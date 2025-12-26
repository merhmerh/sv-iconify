<script lang="ts">
import { load } from "./Loader.svelte.js";

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

let svg = $state("");
let viewBox = $state("0 0 24 24");

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

$effect(() => {
	icon;
	strokeWidth || sw;
	fetchIcon();
});

async function fetchIcon() {
	const currentIcon = icon;
	if (currentIcon) {
		const result = await load(currentIcon);
		if (result) {
			svg = result.svg ?? "";
			viewBox = result.viewBox ?? "0 0 24 24";
			if (strokeWidth !== undefined || sw !== undefined) {
				const computedStrokeWidth = strokeWidth ?? sw;
				svg = svg.replace(/stroke-width="[^"]*"/, `stroke-width="${computedStrokeWidth}"`);
			}
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
