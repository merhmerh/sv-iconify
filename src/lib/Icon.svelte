<script lang="ts">
import { load, getProdCacheIcon } from "./Loader.svelte.js";
import { DEV } from "esm-env";

interface Props {
	/** Icon name */
	icon?: string;
	/** Width of the icon. If number, treated as pixels; if string, use any valid CSS length (e.g. "1.5rem", "24px"). */
	width?: number | string;
	/** Height of the icon. If number, treated as pixels; if string, use any valid CSS length (e.g. "1.5rem", "24px"). */
	height?: number | string;
	/** css color */
	color?: string;
	/** stroke-width to override the default one in the SVG */
	strokeWidth?: number;
	/** Shorthand for width */
	w?: number | string;
	/** Shorthand for height */
	h?: number | string;
	/** Shorthand for color */
	c?: string;
	/** Shorthand for strokeWidth*/
	sw?: number;
	/** rotation angle in deg or number */
	rotate?: string | number | undefined;
	// horizontal flip
	hFlip?: boolean;
	// vertical flip
	vFlip?: boolean;
	// additional css styles
	style?: string;
}

let {
	icon = undefined,
	width = undefined,
	height = undefined,
	color = "inherit",
	strokeWidth = undefined,
	w = undefined,
	h = undefined,
	c = undefined,
	sw = undefined,
	rotate = 0,
	hFlip = false,
	vFlip = false,
	style = "",
}: Props = $props();

let rawSvg = $state("");
let viewBox = $state("0 0 24 24");

// Apply stroke-width transformation to the raw SVG
const svg = $derived.by(() => {
	if (!rawSvg) return "";
	if (strokeWidth !== undefined || sw !== undefined) {
		const computedStrokeWidth = strokeWidth ?? sw;
		return rawSvg.replace(/stroke-width="[^"]*"/, `stroke-width="${computedStrokeWidth}"`);
	}
	return rawSvg;
});

const { styles, svgWidth, svgHeight } = $derived.by(() => {
	// Dimensions
	const computedWidth = width ?? w;
	const computedHeight = height ?? h;

	let finalWidth: string | number = 16;
	if (computedWidth) {
		finalWidth = smartConvertUnit(computedWidth);
	} else if (computedHeight) {
		finalWidth = smartConvertUnit(computedHeight);
	}
	let finalHeight = computedHeight ? smartConvertUnit(computedHeight) : finalWidth;

	// Styles
	const computedColor = color ?? c ?? "inherit";
	const styleArr = [`color: ${computedColor}`];

	const tx = [];
	if (hFlip) tx.push("scaleX(-1)");
	if (vFlip) tx.push("scaleY(-1)");
	if (rotate) {
		const angle =
			typeof rotate === "string" && rotate.endsWith("deg")
				? rotate
				: (convertToNumber(rotate) ?? 0) + "deg";
		tx.push(`rotate(${angle})`);
	}
	if (tx.length) styleArr.push(`transform: ${tx.join(" ")}`);
	if (style) styleArr.push(style);

	return {
		styles: styleArr.join("; "),
		svgWidth: finalWidth,
		svgHeight: finalHeight,
	};
});

function convertToNumber(value: string | number | undefined) {
	if (typeof value === "number") {
		return value;
	}
	if (!isNaN(Number(value))) {
		return Number(value);
	}
	return undefined;
}

function smartConvertUnit(value: string | number | undefined, defaultUnit = "") {
	if (typeof value === "number") {
		return defaultUnit ? `${value}${defaultUnit}` : `${value}`;
	}
	if (!isNaN(Number(value))) {
		return defaultUnit ? `${Number(value)}${defaultUnit}` : `${value}`;
	}
	return value ?? (defaultUnit ? `16${defaultUnit}` : "16");
}

// Only fetch icon when icon name changes, not when strokeWidth changes
$effect(() => {
	icon;
	fetchIcon();
});

const NUM_BUCKETS = 10; // Total number of localStorage buckets (sv-iconify-cache-0 through -9)
const CACHE_KEY_PREFIX = "sv-iconify-cache-";

function getIconBucket(icon: string): number {
	// Simple hash function to distribute icons across buckets
	let hash = 0;
	for (let i = 0; i < icon.length; i++) {
		hash = (hash << 5) - hash + icon.charCodeAt(i);
		hash = hash & hash; // Convert to 32bit integer
	}
	return Math.abs(hash) % NUM_BUCKETS;
}

function cacheToLocalStorage(icon: string, data: { svg: string; viewBox: string }) {
	try {
		const bucketNum = getIconBucket(icon);
		const cacheKey = CACHE_KEY_PREFIX + bucketNum;

		// Get existing cache for this bucket or create new object
		const cached = localStorage.getItem(cacheKey);
		const cacheObj = cached ? JSON.parse(cached) : {};

		// Add/update this icon
		cacheObj[icon] = data;

		// Save back to localStorage
		localStorage.setItem(cacheKey, JSON.stringify(cacheObj));
	} catch (e) {
		// Silently fail if localStorage is not available or quota exceeded
		console.warn("Failed to cache icon:", e);
	}
}

function getFromLocalStorageCache(icon: string): { svg: string; viewBox: string } | null {
	try {
		const bucketNum = getIconBucket(icon);
		const cacheKey = CACHE_KEY_PREFIX + bucketNum;

		const cached = localStorage.getItem(cacheKey);
		if (cached) {
			const cacheObj = JSON.parse(cached);
			return cacheObj[icon] || null;
		}
	} catch (e) {
		// Silently fail if localStorage is not available
		console.warn("Failed to read icon cache:", e);
	}
	return null;
}

async function fetchIcon() {
	const currentIcon = icon;
	if (currentIcon) {
		// In prod, get bundle cache
		let result = getProdCacheIcon(currentIcon);

		// Try localStorage cache if bundle cache miss
		if (!result && !DEV) {
			result = getFromLocalStorageCache(currentIcon);
		}

		// Fall back to async load if not available (dev or cache not ready)
		if (!result) {
			result = await load(currentIcon);
		}

		if (result) {
			if (!DEV) {
				cacheToLocalStorage(currentIcon, result);
			}
			rawSvg = result.svg ?? "";
			viewBox = result.viewBox ?? "0 0 24 24";
		}
	}
}
</script>

<svg
	xmlns="http://www.w3.org/2000/svg"
	aria-hidden="true"
	role="img"
	{viewBox}
	width={svgWidth}
	height={svgHeight}
	style={styles}>
	{@html svg}
</svg>
