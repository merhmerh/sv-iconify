import type { Plugin } from "vite";
import path from "path";
import fs from "fs";
import { extractIconReferences, groupIconsBySet } from "./icon-extractor.js";
import { createOptimizedBundle } from "./bundle-generator.js";

export interface IconifyStaticOptions {
	/**
	 * Directory containing the full icon set JSON files
	 * If not provided, will try to auto-detect from sv-iconify package
	 */
	sourceDir?: string;

	/**
	 * Output path for the optimized bundle
	 * @default ".svelte-kit/sv-iconify/icons-bundle.json"
	 */
	outputPath?: string;

	/**
	 * Root directory to scan for icon usage
	 * @default "src"
	 */
	scanDir?: string;
}

/**
 * Try to locate the icon data directory from the sv-iconify package
 */
function findIconDataDir(rootDir: string): string | null {
	// Try to resolve sv-iconify package
	const possiblePaths = [
		// In node_modules (published package)
		path.join(rootDir, "node_modules/sv-iconify/dist/data/json"),
		// Linked package pointing to dist
		path.join(rootDir, "node_modules/sv-iconify/dist/data/json"),
		// Linked package pointing to src
		path.join(rootDir, "node_modules/sv-iconify/src/lib/data/json"),
		// If running within sv-iconify itself
		path.join(rootDir, "src/lib/data/json"),
	];

	for (const dir of possiblePaths) {
		if (fs.existsSync(dir)) {
			return dir;
		}
	}

	return null;
}

export function svIconify(options: IconifyStaticOptions = {}): Plugin {
	const {
		sourceDir: userSourceDir,
		outputPath = ".svelte-kit/sv-iconify/icons-bundle.json",
		scanDir = "src",
	} = options;

	let rootDir = "";
	let bundleGenerated = false;
	const VIRTUAL_MODULE_ID = "virtual:iconify-bundle";
	const RESOLVED_VIRTUAL_MODULE_ID = "\0" + VIRTUAL_MODULE_ID;

	return {
		name: "vite-plugin-sv-iconify-static",
		enforce: "pre",

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
				const bundlePath = path.resolve(rootDir, outputPath);

				// Generate bundle if not already generated (for dev mode)
				if (!bundleGenerated) {
					console.log("\n🔍 Scanning for icon usage...");

					const scanPath = path.resolve(rootDir, scanDir);
					const iconReferences = await extractIconReferences(scanPath);

					console.log(`   Found ${iconReferences.size} unique icon references`);

					if (iconReferences.size > 0) {
						const iconsGrouped = groupIconsBySet(iconReferences);

						// Try to find icon data directory
						const sourceDir = userSourceDir || findIconDataDir(rootDir);
						if (!sourceDir) {
							console.error(
								"❌ Could not locate icon data directory. Please specify sourceDir option.",
							);
							return "export default {}";
						}

						createOptimizedBundle(iconsGrouped, sourceDir, bundlePath);
						bundleGenerated = true;
					}
				}

				// Load and return the bundle
				if (fs.existsSync(bundlePath)) {
					const bundle = fs.readFileSync(bundlePath, "utf-8");
					return `export default ${bundle}`;
				}

				// Fallback to empty bundle
				return "export default {}";
			}
		},

		async buildStart() {
			// Generate bundle for production build
			if (bundleGenerated) {
				return; // Already generated in load()
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
