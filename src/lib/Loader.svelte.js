// Cache for the bundle
let bundleCache = null;
let bundlePromise = null;
import { DEV } from "esm-env";

// Cache for individual icon sets in dev mode
const devIconSetCache = new Map();

/** Load an icon set from individual JSON files (dev mode) */
async function loadIconSetFromFile(iconSet) {
	// Check cache first
	if (devIconSetCache.has(iconSet)) {
		return devIconSetCache.get(iconSet);
	}

	try {
		// Use string concatenation to prevent Vite from statically analyzing and bundling all JSON files
		const baseUrl = import.meta.url;
		const jsonPath = "./data/json/" + iconSet + ".json";
		const url = new URL(jsonPath, baseUrl).href;
		const mod = await import(/* @vite-ignore */ url);
		const data = mod.default ?? mod;
		devIconSetCache.set(iconSet, data);
		return data;
	} catch (e) {
		console.warn(`[sv-iconify] Icon set "${iconSet}" not found in data/json/`);
		return null;
	}
}

/** Load the bundle (prod mode) */
async function loadBundle() {
	if (bundleCache) {
		return bundleCache;
	}

	if (!bundlePromise) {
		bundlePromise = (async () => {
			try {
				const mod = await import("virtual:iconify-bundle");
				bundleCache = mod.default ?? mod;
				return bundleCache;
			} catch (e) {
				console.error(
					"[sv-iconify] Icon bundle not found. Make sure you've added the svIconify() plugin to your vite.config.ts",
				);
				return null;
			}
		})();
	}

	return bundlePromise;
}

export async function load(iconName) {
	const [iconSet, name] = iconName.split(":", 2);
	if (!iconSet || !name) return null;

	let iconSetData = null;

	// In dev mode, load from individual JSON files
	if (DEV) {
		iconSetData = await loadIconSetFromFile(iconSet);
		// Try to get the icon directly
		let svg = iconSetData.icons?.[name]?.body;
		if (svg) return svg;

		// Try to resolve alias
		const alias = iconSetData.aliases?.[name]?.parent;
		if (!alias) return null;

		svg = iconSetData.icons?.[alias]?.body;
		return svg ?? null;
	} else {
		// In prod mode, load from bundle
		const bundle = await loadBundle();
		if (!bundle) return null;

		const svg = bundle[iconName];
		if (!svg) {
			console.warn(`[sv-iconify] Icon not found in bundle: ${iconName}`);
			return null;
		}
		return svg;
	}
}
