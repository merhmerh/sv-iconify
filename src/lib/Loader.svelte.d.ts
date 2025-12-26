/**
 * Load an icon by name
 * @param iconName - Icon name in format "iconSet:iconName" (e.g., "mdi:home")
 * @returns Icon object with svg and viewBox properties, or null if icon not found
 */
export function load(iconName: string): Promise<{ svg: string; viewBox: string } | null>;

/**
 * Synchronously get an icon if the bundle is already loaded (production only)
 * @param iconName - Icon name in format "iconSet:iconName" (e.g., "mdi:home")
 * @returns Icon object with svg and viewBox properties, or null if icon not found or bundle not yet loaded
 */
export function getProdCacheIcon(iconName: string): { svg: string; viewBox: string } | null;
