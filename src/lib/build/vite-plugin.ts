import type { Plugin } from "vite";
import path from "path";
import fs from "fs";
import { extractIconReferences, groupIconsBySet } from "./icon-extractor.js";
import { createOptimizedBundle } from "./bundle-generator.js";

export interface IconifyStaticOptions {
	/**
	 * Directory containing the full icon set JSON files
	 * @default "src/lib/data/json"
	 */
	sourceDir?: string;

	/**
	 * Output path for the optimized bundle
	 * @default "src/lib/data/icons-bundle.json"
	 */
	outputPath?: string;

	/**
	 * Root directory to scan for icon usage
	 * @default "src"
	 */
	scanDir?: string;
}

export function iconifyStatic(options: IconifyStaticOptions = {}): Plugin {
	const {
		sourceDir = "src/lib/data/json",
		outputPath = "src/lib/data/icons-bundle.json",
		scanDir = "src",
	} = options;

	let rootDir = "";
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

		load(id) {
			if (id === RESOLVED_VIRTUAL_MODULE_ID) {
				const bundlePath = path.resolve(rootDir, outputPath);

				// In dev mode, return empty bundle
				if (process.env.NODE_ENV === "development") {
					return "export default {}";
				}

				// In production, check if bundle exists
				if (fs.existsSync(bundlePath)) {
					const bundle = fs.readFileSync(bundlePath, "utf-8");
					return `export default ${bundle}`;
				}

				// Fallback to empty bundle
				return "export default {}";
			}
		},

		async buildStart() {
			// Only run during build, not in dev mode
			if (process.env.NODE_ENV === "development") {
				return;
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
			const sourcePath = path.resolve(rootDir, sourceDir);
			const outputFullPath = path.resolve(rootDir, outputPath);

			createOptimizedBundle(iconsGrouped, sourcePath, outputFullPath);
		},
	};
}
