let bundleLoaded = false;
let bundlePromise = null;

import { DEV } from "esm-env";

const FALLBACK_ENABLED =
	typeof __SV_ICONIFY_FALLBACK__ !== "undefined" ? __SV_ICONIFY_FALLBACK__ : true;

// Cache for individual icon sets in dev mode
const devIconSetCache = new Map();

let iconCache = new Map();

// For fallback API loading
let iconsToFetchFromAPI = new Set();
let iconResolvers = new Map(); // Map of iconName -> array of resolve functions

// To track pending promises for icon loads
let pendingPromises = new Map(); // Map of iconName -> promise

// Eagerly start loading the bundle in production
if (!DEV) {
	bundlePromise = (async () => {
		try {
			const mod = await import("virtual:iconify-bundle");
			const bundle = mod.default ?? mod;
			// Populate iconCache with all icons from the bundle
			for (const [iconName, iconData] of Object.entries(bundle)) {
				iconCache.set(iconName, iconData);
			}
			bundleLoaded = true;
			return true;
		} catch (e) {
			console.error(
				"[sv-iconify] Icon bundle not found. Make sure you've added the svIconify() plugin to your vite.config.ts",
			);
			return false;
		}
	})();
}

/** Load an icon set from individual JSON files (dev mode) */
async function loadIconSetFromFile(iconSet) {
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
		throw e;
	}
}

/** Load the bundle (prod mode) */
async function loadBundle() {
	if (bundleLoaded) {
		return true;
	}

	// Bundle is already loading from module initialization
	return bundlePromise;
}

export async function load(iconName) {
	const [iconSet, name] = iconName.split(":", 2);
	if (!iconSet || !name) return null;

	let iconSetData = null;

	// In dev mode, load from individual JSON files
	try {
		if (DEV) {
			//load from cache
			if (iconCache.has(iconName)) {
				return iconCache.get(iconName);
			}

			// Check if this icon is already being loaded
			if (pendingPromises.has(iconName)) {
				return pendingPromises.get(iconName);
			}

			// Create a promise for this icon load
			const loadPromise = (async () => {
				iconSetData = await loadIconSetFromFile(iconSet);
				// Try to get the icon directly
				const { width, height, top, left } = iconSetData;

				let icon = iconSetData.icons?.[name];
				if (!icon) {
					const alias = iconSetData.aliases?.[name]?.parent;
					if (!alias) return null;
					icon = iconSetData.icons?.[alias];
				}

				const svg = icon.body;
				const viewBoxObj = {
					left: icon?.left ?? left ?? 0,
					top: icon?.top ?? top ?? 0,
					width: icon?.width ?? width ?? 16,
					height: icon?.height ?? height ?? 16,
				};
				const viewBox = Object.values(viewBoxObj).join(" ");
				const result = svg ? { svg, viewBox } : null;
				iconCache.set(iconName, result);
				pendingPromises.delete(iconName);
				return result;
			})();

			pendingPromises.set(iconName, loadPromise);
			return await loadPromise;
		} else {
			// In prod mode, load from bundle
			const loaded = await loadBundle();
			if (!loaded) throw new Error("Icon bundle not loaded");

			const iconData = iconCache.get(iconName);
			if (!iconData || !iconData.svg) {
				console.warn(`[sv-iconify] Icon not found in bundle: ${iconName}`);
				throw new Error("Icon not found in bundle");
			}
			return iconData;
		}
	} catch (e) {
		//delete pending promise on error
		pendingPromises.delete(iconName);

		//fallback
		if (!FALLBACK_ENABLED) return null;

		await fallbackUseIconifyAPI(iconName);
		//now cache is populated,
		const result = iconCache.get(iconName);
		if (result) return result;
		return;
	}
}

async function fallbackUseIconifyAPI(iconName) {
	// Check if icon is already in cache
	if (iconCache.has(iconName)) {
		return iconCache.get(iconName);
	}

	// If there's already a pending promise for this icon, return it
	if (pendingPromises.has(iconName)) {
		return pendingPromises.get(iconName);
	}

	// Create a promise that will be resolved when the icon is fetched
	const promise = new Promise((resolve) => {
		// Store the resolver in an array to handle multiple requests for the same icon
		if (!iconResolvers.has(iconName)) {
			iconResolvers.set(iconName, []);
		}
		iconResolvers.get(iconName).push(resolve);
	});

	pendingPromises.set(iconName, promise);
	iconsToFetchFromAPI.add(iconName);
	fetchFromIconify();

	return promise;
}

const fetchFromIconify = debounce(async () => {
	const map = {};
	for (const item of Array.from(iconsToFetchFromAPI)) {
		const [prefix, name] = item.split(":");
		if (!map[prefix]) {
			map[prefix] = new Set();
		}
		map[prefix].add(name);
	}

	const promises = [];
	const MAX_URL_LENGTH = 450; // Total length limit for icon names

	for (const [prefix, icons] of Object.entries(map)) {
		const iconsArray = Array.from(icons);
		const baseUrl = `https://api.iconify.design/${prefix}.json?icons=`;
		const availableLength = MAX_URL_LENGTH;

		// Chunk icons to fit within URL length limit
		const chunks = [];
		let currentChunk = [];
		let currentLength = 0;

		for (const iconName of iconsArray) {
			const nameLength = iconName.length + (currentChunk.length > 0 ? 1 : 0); // +1 for comma separator

			if (currentLength + nameLength > availableLength && currentChunk.length > 0) {
				// Start new chunk
				chunks.push(currentChunk);
				currentChunk = [iconName];
				currentLength = iconName.length;
			} else {
				currentChunk.push(iconName);
				currentLength += nameLength;
			}
		}

		if (currentChunk.length > 0) {
			chunks.push(currentChunk);
		}

		// Fetch each chunk
		for (const chunk of chunks) {
			const url = `${baseUrl}${chunk.join(",")}`;
			const promise = fetch(url);
			promises.push(promise);
		}
	}

	const results = await Promise.all(promises);
	for (const resp of results) {
		const data = await resp.json();
		const { prefix, icons, width, height, left = 0, top = 0 } = data;
		for (const [iconName, icon] of Object.entries(icons)) {
			const svg = icon.body;
			const viewBoxObj = {
				left: icon?.left ?? left ?? 0,
				top: icon?.top ?? top ?? 0,
				width: icon?.width ?? width ?? 16,
				height: icon?.height ?? height ?? 16,
			};

			const viewBox = Object.values(viewBoxObj).join(" ");
			const key = `${prefix}:${iconName}`;
			const iconData = { svg: svg, viewBox };
			iconCache.set(key, iconData);

			if (iconResolvers.has(key)) {
				const resolvers = iconResolvers.get(key);
				resolvers.forEach((resolve) => resolve(iconData));
				iconResolvers.delete(key);
				pendingPromises.delete(key);
			}
		}
	}

	iconsToFetchFromAPI.clear();
	return "ok";
}, 50);

/** Synchronously get icon if bundle is already available (prod only) */
export function getProdCacheIcon(iconName) {
	if (DEV || !bundleLoaded) return null;

	const iconData = iconCache.get(iconName);
	if (!iconData || !iconData.svg) {
		return null;
	}
	return iconData;
}

function debounce(func, delay = 300) {
	let timeoutId;

	/** @param {any[]} args */
	function debounced(...args) {
		const context = this;

		clearTimeout(timeoutId);

		timeoutId = setTimeout(() => {
			func.apply(context, args);
		}, delay);
	}

	return debounced;
}
