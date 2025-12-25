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

/**
 * Creates a bundled JSON file with only the icons used in the project
 */
export function createOptimizedBundle(iconsGrouped, sourceDir, outputPath) {
	const bundledIcons = {};

	for (const [iconSet, iconNames] of Object.entries(iconsGrouped)) {
		const jsonPath = path.join(sourceDir, `${iconSet}.json`);
		const extracted = extractIconsFromSet(jsonPath, iconNames);

		if (extracted && extracted.icons && Object.keys(extracted.icons).length > 0) {
			bundledIcons[iconSet] = extracted;
		}
	}
	console.log(bundledIcons);

	// Ensure output directory exists
	const outputDir = path.dirname(outputPath);
	if (!fs.existsSync(outputDir)) {
		fs.mkdirSync(outputDir, { recursive: true });
	}

	// Write the bundled icons
	fs.writeFileSync(outputPath, JSON.stringify(bundledIcons, null, 2), "utf-8");

	// Log statistics
	const totalIcons = Object.values(bundledIcons).reduce(
		(sum, set) => sum + (set.icons ? Object.keys(set.icons).length : 0),
		0,
	);
	console.log(
		`✓ Created optimized icon bundle: ${Object.keys(bundledIcons).length} sets, ${totalIcons} icons`,
	);
}
