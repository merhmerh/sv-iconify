type IconifyJSON = {
	icons?: Record<string, { body: string }>;
	aliases?: Record<string, { parent: string }>;
};

// Cache for the bundle
let bundleCache: Record<string, IconifyJSON> | null = null;
let bundleLoadAttempted = false;

export async function load(iconName: string) {
	const [iconSet, name] = iconName.split(":", 2);
	if (!iconSet || !name) return null;

	// Load the bundle lazily on first use (works in both dev and prod)
	if (!bundleLoadAttempted) {
		bundleLoadAttempted = true;
		try {
			// Use virtual module that's provided by the vite plugin
			// The plugin should be configured in vite.config for this to work
			//@ts-ignore
			const mod = await import(/* @vite-ignore */ "virtual:iconify-bundle");
			bundleCache = (mod as any).default ?? (mod as any);
		} catch (e) {
			console.error(
				"[sv-iconify] Icon bundle not found. Make sure you've added the svIconify() plugin to your vite.config.ts",
			);
			return null;
		}
	}

	if (!bundleCache) return null;

	const iconSetData = bundleCache[iconSet];
	if (!iconSetData) {
		console.warn(`[sv-iconify] Icon set "${iconSet}" not found in bundle`);
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
