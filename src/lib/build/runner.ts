import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

main();

function main() {
	pullIcons();
}

function pullIcons() {
	const __filename = fileURLToPath(import.meta.url);
	const __dirname = path.dirname(__filename);

	// Move files from node_modules/@iconify/json/json to src/lib/data
	const sourceDir = path.resolve(__dirname, "../../../node_modules/@iconify/json/json");
	const targetDir = path.resolve(__dirname, "../data/json");

	//delete the folder first
	if (fs.existsSync(targetDir)) {
		fs.rmSync(targetDir, { recursive: true, force: true });
	}

	// Create target directory if it doesn't exist
	if (!fs.existsSync(targetDir)) {
		fs.mkdirSync(targetDir, { recursive: true });
	}

	// Copy all JSON files from source to target
	const files = fs.readdirSync(sourceDir);
	let count = 0;

	for (const file of files) {
		if (file.endsWith(".json") && !file.includes("emoji")) {
			const sourcePath = path.join(sourceDir, file);
			const targetPath = path.join(targetDir, file);
			fs.copyFileSync(sourcePath, targetPath);
			count++;
		}
	}

	console.log(`Copied ${count} icon set files to ${targetDir}`);
}
