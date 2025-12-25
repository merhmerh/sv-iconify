import fs from "fs";
import path from "path";

/**
 * Loads an icon set JSON file and extracts only the specified icons
 */
export function extractIconsFromSet(jsonPath, iconsToExtract) {
	if (!fs.existsSync(jsonPath)) {
		console.warn(`Icon set not found: ${jsonPath}`);
		return null;
	}

	const fullJson = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));

	// If no specific icons requested, return empty
	if (iconsToExtract.size === 0) {
		return null;
	}

	const extractedJson = {
		prefix: fullJson.prefix,
		icons: {},
		width: fullJson.width,
		height: fullJson.height,
	};

	// Resolve aliases to get all actual icon names we need
	const allNeededIcons = new Set();
	const aliasMap = new Map();

	for (const iconName of iconsToExtract) {
		// Check if it's a direct icon
		if (fullJson.icons?.[iconName]) {
			allNeededIcons.add(iconName);
		}
		// Check if it's an alias
		else if (fullJson.aliases?.[iconName]) {
			const parent = fullJson.aliases[iconName].parent;
			allNeededIcons.add(parent);
			aliasMap.set(iconName, parent);
		} else {
			console.warn(`Icon not found in set: ${iconName}`);
		}
	}

	// Extract the icons
	if (fullJson.icons) {
		for (const iconName of allNeededIcons) {
			if (fullJson.icons[iconName]) {
				if (!extractedJson.icons) extractedJson.icons = {};
				extractedJson.icons[iconName] = fullJson.icons[iconName];
			}
		}
	}

	// Extract aliases if needed
	if (aliasMap.size > 0) {
		extractedJson.aliases = {};
		for (const [alias, parent] of aliasMap) {
			if (fullJson.aliases?.[alias]) {
				extractedJson.aliases[alias] = fullJson.aliases[alias];
			}
		}
	}

	return extractedJson;
}

function getIcon(path, iconSet, iconNames) {
	if (!fs.existsSync(path)) {
		console.warn(`Icon set not found: ${path}`);
		return null;
	}
	const fullJson = JSON.parse(fs.readFileSync(path, "utf-8"));

	if (iconNames.size === 0) return null;

	const icons = {};

	for (const name of iconNames) {
		const key = `${iconSet}:${name}`;
		let svg = fullJson.icons?.[name]?.body;
		if (svg) {
			icons[key] = svg;
			continue;
		}

		// Try to resolve alias
		const alias = fullJson.aliases?.[name]?.parent;
		if (!alias) return null;

		svg = fullJson.icons?.[alias]?.body;
		if (svg) {
			icons[key] = svg;
			continue;
		}

		continue;
	}

	return icons;
}

/**
 * Creates a bundled JSON file with only the icons used in the project
 */
export function createOptimizedBundle(iconsGrouped, sourceDir, outputPath) {
	const bundledIcons = {};
	for (const [iconSet, iconNames] of Object.entries(iconsGrouped)) {
		const jsonPath = path.join(sourceDir, `${iconSet}.json`);

		const icons = getIcon(jsonPath, iconSet, iconNames);
		if (icons) {
			Object.assign(bundledIcons, icons);
		}
	}
	const outputDir = path.dirname(outputPath);
	if (!fs.existsSync(outputDir)) {
		fs.mkdirSync(outputDir, { recursive: true });
	}
	fs.writeFileSync(outputPath, JSON.stringify(bundledIcons, null, 2), "utf-8");

	console.log(`Created Bundle of ${Object.keys(bundledIcons).length} icons at ${outputPath}`);
	return;
}
