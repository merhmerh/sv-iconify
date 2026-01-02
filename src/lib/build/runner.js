import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

main();

function main() {
	pullIcons();
	getListOfIconSets();
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

function getListOfIconSets() {
	//read all files in src/lib/data/json
	const __filename = fileURLToPath(import.meta.url);
	const __dirname = path.dirname(__filename);
	const jsonDir = path.resolve(__dirname, "../data/json");

	const files = fs.readdirSync(jsonDir);
	const iconSets = [];

	for (const file of files) {
		const raw = fs.readFileSync(path.join(jsonDir, file), "utf-8");
		const data = JSON.parse(raw);
		iconSets.push({
			name: data.info.name,
			prefix: data.prefix,
			numberOfIcons: Object.keys(data.icons).length,
		});
	}

	iconSets.sort((a, b) => a.name.localeCompare(b.name));

	fs.writeFileSync(path.join(__dirname, "../data/iconsets.json"), JSON.stringify(iconSets));
}
