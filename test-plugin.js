#!/usr/bin/env node

/**
 * Test script for vite-plugin.js
 * Simulates the plugin's buildStart hook without running the full Vite build
 */

import path from "path";
import { fileURLToPath } from "url";
import { createOptimizedBundle, extractIconReferences } from "./src/lib/build/bundle-generator.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const config = {
	rootDir: __dirname,
	scanDir: "src",
	sourceDir: path.join(__dirname, "src/lib/data/json"),
	outputPath: ".svelte-kit/sv-iconify/icons-bundle.json",
	includes: {
		iconSets: ["lucide"],
		icons: ["lucide:home"],
	},
};

async function testPlugin() {
	console.log("🧪 Testing Vite Plugin\n");

	try {
		const scanPath = path.resolve(config.rootDir, config.scanDir);
		const extractedIcons = await extractIconReferences(scanPath, config.sourceDir);
		const ref = {
			iconSets: config.includes.iconSets,
			icons: [...new Set([...config.includes.icons, ...extractedIcons])],
		};

		const bundlePath = path.resolve(config.rootDir, config.outputPath);
		createOptimizedBundle(ref, config.sourceDir, bundlePath);

		console.log("\n✅ Test completed successfully!");
		console.log(`Bundle saved to: ${bundlePath}`);
	} catch (error) {
		console.error("\n❌ Test failed:");
		console.error(error);
		process.exit(1);
	}
}

// Run the test
testPlugin();
