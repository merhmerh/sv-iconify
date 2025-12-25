import fs from "fs";
import path from "path";

function checkPathExists(p) {
	if (!fs.existsSync(p)) {
		console.warn(`Icon set not found: ${p}`);
		return null;
	}
	return true;
}

function getAllIconsFromSet(p) {
	const exists = checkPathExists(p);
	if (!exists) return [];

	const json = JSON.parse(fs.readFileSync(p, "utf-8"));
	const iconsMap = {};
	const aliasMap = new Map();
	for (const [alias, { parent }] of Object.entries(json.aliases)) {
		aliasMap.set(parent, alias);
	}
	for (const [key, { body }] of Object.entries(json.icons)) {
		if (aliasMap.has(key)) {
			const k = aliasMap.get(key);
			iconsMap[k] = body;
			continue;
		}
		iconsMap[key] = body;
	}
	return iconsMap;
}

function getIcons(p, iconSet, iconNames) {
	const exists = checkPathExists(p);
	if (!exists) return [];

	const json = JSON.parse(fs.readFileSync(p, "utf-8"));
	// console.log(json.info.name); //iconName
	const iconsMap = {};
	for (const name of iconNames) {
		const key = `${iconSet}:${name}`;
		const directSvg = json.icons?.[name]?.body;
		if (directSvg) {
			iconsMap[key] = directSvg;
			continue;
		}

		// Try to resolve alias
		const alias = json.aliases?.[name]?.parent;
		if (!alias) continue;

		const aliasSvg = json.icons?.[alias]?.body;
		if (!aliasSvg) continue;

		iconsMap[key] = aliasSvg;
	}

	return iconsMap;
}

/** Creates a bundled JSON file with only the icons used in the project */
export function createOptimizedBundle({ iconSets = [], icons = [] }, sourceDir, outputPath) {
	const bundledIcons = {};

	//get iconset first and filter icons that already included
	if (iconSets.length > 0) {
		icons = icons.filter((icon) => {
			return !iconSets.some((set) => icon.startsWith(`${set}:`));
		});

		//get all iconSets first
		for (const iconset of iconSets) {
			const p = path.join(sourceDir, `${iconset}.json`);
			const icons = getAllIconsFromSet(p);
			Object.assign(bundledIcons, icons);
		}
	}

	//then get individual icons
	const iconsGrouped = {};
	for (const iconName of icons) {
		const [iconSet, name] = iconName.split(":");
		if (!iconsGrouped[iconSet]) {
			iconsGrouped[iconSet] = new Set();
		}
		iconsGrouped[iconSet].add(name);
	}
	for (const [iconSet, iconNamesSet] of Object.entries(iconsGrouped)) {
		const iconNames = Array.from(iconNamesSet);
		const p = path.join(sourceDir, `${iconSet}.json`);
		const icons = getIcons(p, iconSet, iconNames);
		Object.assign(bundledIcons, icons);
	}

	const outputDir = path.dirname(outputPath);
	if (!fs.existsSync(outputDir)) {
		fs.mkdirSync(outputDir, { recursive: true });
	}
	fs.writeFileSync(outputPath, JSON.stringify(bundledIcons, null, 2), "utf-8");

	console.log(`Created Bundle of ${Object.keys(bundledIcons).length} icons`);
	return;
}

/** Recursively find all files matching extensions in a director  */
function findFiles(dir, extensions, ignored = []) {
	const results = [];

	function walk(currentPath) {
		const entries = fs.readdirSync(currentPath, { withFileTypes: true });

		for (const entry of entries) {
			const fullPath = path.join(currentPath, entry.name);
			const relativePath = path.relative(dir, fullPath);

			// Skip ignored directories
			if (ignored.some((pattern) => relativePath.includes(pattern))) {
				continue;
			}

			if (entry.isDirectory()) {
				walk(fullPath);
			} else if (entry.isFile()) {
				const ext = path.extname(entry.name);
				if (extensions.includes(ext)) {
					results.push(fullPath);
				}
			}
		}
	}

	walk(dir);
	return results;
}

/** Extracts icon references from source files */
export async function extractIconReferences(srcDir) {
	const iconReferences = new Set();

	// Pattern to match icon references in various formats
	// Matches: "prefix:name", 'prefix:name', icon="prefix:name", icon='prefix:name'
	const iconPattern = /["']([a-z0-9-]+:[a-z0-9-]+)["']/gi;

	// Find all .svelte, .ts, .js files
	const files = findFiles(
		srcDir,
		[".svelte", ".ts", ".js"],
		["node_modules", "dist", ".svelte-kit", "build"],
	);

	for (const file of files) {
		const content = fs.readFileSync(file, "utf-8");
		const matches = content.matchAll(iconPattern);

		for (const match of matches) {
			const iconRef = match[1];
			// Validate format: prefix:name and exclude module imports like virtual:*
			if (iconRef && iconRef.includes(":") && !iconRef.startsWith("virtual:")) {
				iconReferences.add(iconRef);
			}
		}
	}

	return Array.from(iconReferences);
}
