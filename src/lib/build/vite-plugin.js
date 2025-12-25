import path from "path";
import fs from "fs";
import { extractIconReferences, groupIconsBySet } from "./icon-extractor.js";
import { createOptimizedBundle } from "./bundle-generator.js";
import { DEV } from "esm-env";

/**
 * @typedef {Object} SvIconifyOptions
 * @property {string} [sourceDir] - Path to the directory containing icon JSON files. If not provided, will auto-detect from node_modules/sv-iconify
 * @property {string} [outputPath='static/_sv-iconify/icons-bundle.json'] - Output path for the generated icon bundle (production builds only)
 * @property {string} [scanDir='src'] - Directory to scan for icon usage in your source files
 */

/**
 * Vite plugin for sv-iconify that optimizes icon loading by generating a bundle of only the icons used in your project
 * @param {SvIconifyOptions} [options] - Configuration options for the plugin
 * @returns {import('vite').Plugin} Vite plugin instance
 */
export function svIconify({
	sourceDir: userSourceDir,
	outputPath = "static/_sv-iconify/icons-bundle.json",
	scanDir = "src",
	includes = {
		iconSets: [],
		icons: [],
	},
}) {
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
			if (!isProduction) return;

			if (bundleGenerated) return; // Already generated

			console.log("\n🔍 Scanning for icon usage...");
			const scanPath = path.resolve(rootDir, scanDir);
			const extractedIcons = await extractIconReferences(scanPath);

			const ref = {
				iconSets: includes.iconSets,
				icons: [...new Set([...includes.icons, ...extractedIcons])],
			};

			const bundlePath = path.resolve(rootDir, outputPath);
			createOptimizedBundle(ref, sourceDir, bundlePath);
			bundleGenerated = true;
		},
	};
}

/** Try to locate the icon data directory from the sv-iconify package */
function findIconDataDir(rootDir) {
	const possiblePaths = [
		path.join(rootDir, "node_modules/sv-iconify/dist/data/json"),
		path.join(rootDir, "node_modules/sv-iconify/src/lib/data/json"),
		path.join(rootDir, "src/lib/data/json"),
	];

	for (const dir of possiblePaths) {
		if (fs.existsSync(dir)) {
			return dir;
		}
	}

	return null;
}
