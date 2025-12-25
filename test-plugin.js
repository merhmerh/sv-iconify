#!/usr/bin/env node

/**
 * Test script for vite-plugin.js
 * Simulates the plugin's buildStart hook without running the full Vite build
 */

import path from "path";
import { fileURLToPath } from "url";
import { extractIconReferences, groupIconsBySet } from "./src/lib/build/icon-extractor.js";
import { createOptimizedBundle } from "./src/lib/build/bundle-generator.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const config = {
	rootDir: __dirname,
	scanDir: "src",
	sourceDir: path.join(__dirname, "src/lib/data/json"),
	outputPath: ".svelte-kit/sv-iconify/icons-bundle.json",
};

async function testPlugin() {
	console.log("🧪 Testing Vite Plugin\n");
	console.log("Configuration:");
	console.log(`  Root Dir: ${config.rootDir}`);
	console.log(`  Scan Dir: ${config.scanDir}`);
	console.log(`  Source Dir: ${config.sourceDir}`);
	console.log(`  Output Path: ${config.outputPath}\n`);

	try {
		// Step 1: Extract icon references
		console.log("🔍 Step 1: Scanning for icon usage...");
		const scanPath = path.resolve(config.rootDir, config.scanDir);
		const iconReferences = await extractIconReferences(scanPath);

		console.log(`   Found ${iconReferences.size} unique icon references`);

		if (iconReferences.size === 0) {
			console.log("⚠️  No icons found, skipping bundle generation");
			return;
		}

		// Display found icons
		console.log("\n📋 Icon references found:");
		const icons = Array.from(iconReferences).sort();
		for (const icon of icons) {
			console.log(`   - ${icon}`);
		}

		// Step 2: Group icons by set
		console.log("\n📦 Step 2: Grouping icons by set...");
		const iconsGrouped = groupIconsBySet(iconReferences);

		console.log(`   Grouped into ${Object.keys(iconsGrouped).length} icon sets`);
		for (const [setName, icons] of Object.entries(iconsGrouped)) {
			console.log(`   - ${setName}: ${icons.size} icons`);
		}

		// Step 3: Create optimized bundle
		console.log("\n🎁 Step 3: Creating optimized bundle...");
		const bundlePath = path.resolve(config.rootDir, config.outputPath);
		createOptimizedBundle(iconsGrouped, config.sourceDir, bundlePath);

		console.log("\n✅ Test completed successfully!");
		console.log(`   Bundle saved to: ${bundlePath}`);
	} catch (error) {
		console.error("\n❌ Test failed:");
		console.error(error);
		process.exit(1);
	}
}

// Run the test
testPlugin();
