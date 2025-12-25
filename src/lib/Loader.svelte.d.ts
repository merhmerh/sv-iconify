/**
 * Load an icon by name
 * @param iconName - Icon name in format "iconSet:iconName" (e.g., "mdi:home")
 * @returns Icon object with svg and viewBox properties, or null if icon not found
 */
export function load(iconName: string): Promise<{ svg: string; viewBox: string } | null>;
