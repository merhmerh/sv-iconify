import type { Plugin } from "vite";

export interface SvIconifyOptions {
	/**
	 * Path to the directory containing icon JSON files. If not provided, will auto-detect from node_modules/sv-iconify
	 */
	sourceDir?: string;
	/**
	 * Output path for the generated icon bundle (production builds only)
	 * @default 'static/_sv-iconify/icons-bundle.json'
	 */
	outputPath?: string;
	/**
	 * Directory to scan for icon usage in your source files
	 * @default 'src'
	 */
	scanDir?: string;
	/**
	 * Icons to include in the bundle
	 */
	includes?: {
		/**
		 * Icon sets to include (e.g., ['mdi', 'fa'])
		 */
		iconSets?: string[];
		/**
		 * Specific icons to include (e.g., ['mdi:home', 'fa:user'])
		 */
		icons?: string[];
	};
	/**
	 * Whether to enable fallback loading from the Iconify API for missing icons
	 * @default true
	 */
	fallback?: boolean;
}

/**
 * Vite plugin for sv-iconify that optimizes icon loading by generating a bundle of only the icons used in your project
 */
export function svIconify(options?: SvIconifyOptions): Plugin;
