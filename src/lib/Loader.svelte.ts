import { DEV } from "esm-env";

type IconifyJSON = {
	icons?: Record<string, { body: string }>;
	aliases?: Record<string, { parent: string }>;
};

// Cache for the production bundle
let bundleCache: Record<string, IconifyJSON> | null = null;

export async function load(iconName: string) {
	// Use esm-env for cross-bundler compatibility
	if (DEV) {
		return await devLoad(iconName);
	}
	return await prodLoad(iconName);
}

async function prodLoad(iconName: string) {
	const [iconSet, name] = iconName.split(":", 2);
	if (!iconSet || !name) return null;

	// Load the bundle lazily on first use
	if (!bundleCache) {
		try {
			// Use virtual module that's provided by the vite plugin
			//@ts-ignore
			const mod = await import("virtual:iconify-bundle");
			bundleCache = (mod as any).default ?? (mod as any);
		} catch (e) {
			console.error("Failed to load optimized icon bundle", e);
			return null;
		}
	}

	if (!bundleCache) return null;

	const iconSetData = bundleCache[iconSet];
	if (!iconSetData) {
		console.warn(`Icon set "${iconSet}" not found in bundle`);
		return null;
	}

	// Try to get the icon directly
	let svg = iconSetData.icons?.[name]?.body;
	if (svg) return svg;

	// Try to resolve alias
	const alias = iconSetData.aliases?.[name]?.parent;
	if (!alias) return null;

	svg = iconSetData.icons?.[alias]?.body;
	return svg ?? null;
}

async function devLoad(iconName: string) {
	const [iconSet, name] = iconName.split(":", 2);
	if (!iconSet || !name) return null;

	let mod: { default?: IconifyJSON } | IconifyJSON;

	try {
		mod = await import(`./data/json/${iconSet}.json`);
	} catch (e) {
		console.error(`Failed to load icon set: ${iconSet}`, e);
		return null;
	}

	const json: IconifyJSON = (mod as any).default ?? (mod as any);

	let svg = json.icons?.[name]?.body;
	if (svg) return svg;

	const alias = json.aliases?.[name]?.parent;
	if (!alias) return null;

	svg = json.icons?.[alias]?.body;
	return svg ?? null;
}
