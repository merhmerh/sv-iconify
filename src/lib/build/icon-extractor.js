import fs from "fs";
import path from "path";

/**
 * Recursively find all files matching extensions in a directory
 */
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

/**
 * Extracts icon references from source files
 * Looks for patterns like: "lucide:apple", 'mdi:home', etc.
 */
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

	return iconReferences;
}

/**
 * Groups icon references by icon set
 * Input: ["lucide:apple", "lucide:activity", "mdi:home"]
 * Output: { lucide: ["apple", "activity"], mdi: ["home"] }
 */
export function groupIconsBySet(iconReferences) {
	const grouped = {};

	for (const iconRef of iconReferences) {
		const [iconSet, iconName] = iconRef.split(":", 2);
		if (iconSet && iconName) {
			if (!grouped[iconSet]) {
				grouped[iconSet] = new Set();
			}
			grouped[iconSet].add(iconName);
		}
	}

	return grouped;
}
