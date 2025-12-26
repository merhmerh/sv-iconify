// Cache for the bundle
let bundleCache = null;
let bundlePromise = null;
import { DEV } from "esm-env";

// Cache for individual icon sets in dev mode
const devIconSetCache = new Map();

// Eagerly start loading the bundle in production
if (!DEV) {
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

	// Bundle is already loading from module initialization
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
		const { width, height, top, left } = iconSetData;
		const viewBox = `${top ?? 0} ${left ?? 0} ${width ?? 16} ${height ?? 16}`;

		let svg = iconSetData.icons?.[name]?.body;
		if (svg) return { svg, viewBox };

		// Try to resolve alias
		const alias = iconSetData.aliases?.[name]?.parent;
		if (!alias) return null;

		svg = iconSetData.icons?.[alias]?.body;
		return svg ? { svg, viewBox } : null;
	} else {
		// In prod mode, load from bundle
		const bundle = await loadBundle();
		if (!bundle) return null;

		const iconData = bundle[iconName];
		if (!iconData || !iconData.svg) {
			console.warn(`[sv-iconify] Icon not found in bundle: ${iconName}`);
			return null;
		}
		return iconData;
	}
}

/** Synchronously get icon if bundle is already available (prod only) */
export function getProdCacheIcon(iconName) {
	if (DEV || !bundleCache) return null;

	const iconData = bundleCache[iconName];
	if (!iconData || !iconData.svg) {
		return null;
	}
	return iconData;
}
