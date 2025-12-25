import path from "path";
import fs from "fs";
import { extractIconReferences, groupIconsBySet } from "./icon-extractor.js";
import { createOptimizedBundle } from "./bundle-generator.js";
import { DEV } from "esm-env";

/** Try to locate the icon data directory from the sv-iconify package */
function findIconDataDir(rootDir) {
	// Try to resolve sv-iconify package
	const possiblePaths = [
		path.join(rootDir, "node_modules/sv-iconify/dist/data/json"),
		// // Linked package pointing to src
		path.join(rootDir, "node_modules/sv-iconify/src/lib/data/json"),
		// // If running within sv-iconify itself
		path.join(rootDir, "src/lib/data/json"),
	];

	for (const dir of possiblePaths) {
		console.log(dir);
		if (fs.existsSync(dir)) {
			return dir;
		}
	}

	return null;
}
/**
 * @typedef {Object} SvIconifyOptions
 * @property {string} [sourceDir]
 * @property {string} [outputPath]
 * @property {string} [scanDir]
 */

/**
 * @param {SvIconifyOptions} [options]
 */
export function svIconify(options = {}) {
	const {
		sourceDir: userSourceDir,
		outputPath = "static/_sv-iconify/icons-bundle.json",
		scanDir = "src",
	} = options;

	let rootDir = "";
	let bundleGenerated = false;
	let isProduction = false;
	const VIRTUAL_MODULE_ID = "virtual:iconify-bundle";
	const RESOLVED_VIRTUAL_MODULE_ID = "\0" + VIRTUAL_MODULE_ID;

	return {
		name: "vite-plugin-sv-iconify-static",
		enforce: /** @type {"pre"} */ ("pre"),

		config(config, { command }) {
			// Detect if this is a build command
			isProduction = command === "build";

			return {
				optimizeDeps: {
					exclude: ["sv-iconify"],
				},
			};
		},

		configResolved(config) {
			rootDir = config.root;
		},

		resolveId(id) {
			if (id === VIRTUAL_MODULE_ID) {
				return RESOLVED_VIRTUAL_MODULE_ID;
			}
		},

		async load(id) {
			if (id === RESOLVED_VIRTUAL_MODULE_ID) {
				// In dev mode, return empty bundle (icons loaded directly from JSON files)
				if (!isProduction) {
					return "export default {}";
				}

				// In production, load the generated bundle
				const bundlePath = path.resolve(rootDir, outputPath);
				if (fs.existsSync(bundlePath)) {
					const bundle = fs.readFileSync(bundlePath, "utf-8");
					return `export default ${bundle}`;
				}

				// Fallback to empty bundle
				console.warn("⚠️  Icon bundle not found, returning empty bundle");
				return "export default {}";
			}
		},

		async buildStart() {
			// Only generate bundle for production build
			if (!isProduction) {
				return;
			}

			if (bundleGenerated) {
				return; // Already generated
			}

			console.log("\n🔍 Scanning for icon usage...");

			const scanPath = path.resolve(rootDir, scanDir);
			const iconReferences = await extractIconReferences(scanPath);

			console.log(`   Found ${iconReferences.size} unique icon references`);

			if (iconReferences.size === 0) {
				console.log("⚠️  No icons found, skipping bundle generation");
				return;
			}

			const iconsGrouped = groupIconsBySet(iconReferences);

			// Try to find icon data directory
			const sourceDir = userSourceDir || findIconDataDir(rootDir);
			if (!sourceDir) {
				console.error(
					"❌ Could not locate icon data directory. Please specify sourceDir option.",
				);
				return;
			}

			const bundlePath = path.resolve(rootDir, outputPath);
			createOptimizedBundle(iconsGrouped, sourceDir, bundlePath);
			bundleGenerated = true;
		},
	};
}
