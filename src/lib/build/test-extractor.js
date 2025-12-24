#!/usr/bin/env node
import { extractIconReferences, groupIconsBySet } from "./icon-extractor.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function test() {
	console.log("Testing icon extraction...\n");

	const srcDir = path.resolve(__dirname, "../../");
	const icons = await extractIconReferences(srcDir);

	console.log(`Found ${icons.size} unique icons:`);
	for (const icon of icons) {
		console.log(`  - ${icon}`);
	}

	console.log("\nGrouped by icon set:");
	const grouped = groupIconsBySet(icons);
	for (const [set, names] of Object.entries(grouped)) {
		console.log(`  ${set}: ${names.size} icons`);
		for (const name of names) {
			console.log(`    - ${name}`);
		}
	}
}

test();
