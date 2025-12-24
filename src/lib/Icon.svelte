<script lang="ts">
import { load } from "./Loader.svelte.ts";

let {
	icon = undefined as string | undefined,
	width = undefined as number | string | undefined,
	height = undefined as number | string | undefined,
	color = "inherit" as string,
	strokeWidth = undefined as number | undefined,
	rotate = "0deg" as string | number,
	hFlip = false as boolean,
	vFlip = false as boolean,
	style = "" as string,
} = $props();
let svg = $state("");

let styles = $derived.by(() => {
	const styles = [`color: ${color}`];

	const tx = [];
	if (hFlip) {
		tx.push("scaleX(-1)");
	}
	if (vFlip) {
		tx.push("scaleY(-1)");
	}
	if (rotate && rotate !== "0deg") {
		let angle = convertToNumber(rotate);
		tx.push(`rotate(${angle})`);
	}
	if (tx.length) styles.push(`transform: ${tx.join(" ")}`);

	let computedWidth = 16 as number | string;
	let computedHeight = 16 as number | string;

	if (!width && !height) {
		// use default 16x16
	} else {
		if (width && !height) {
			computedWidth = smartConvertUnit(width);
			computedHeight = computedWidth;
		} else if (!width && height) {
			computedHeight = smartConvertUnit(height);
			computedWidth = computedHeight;
		} else {
			computedWidth = smartConvertUnit(width);
			computedHeight = smartConvertUnit(height);
		}
	}
	styles.push(`width: ${computedWidth}`);
	styles.push(`height: ${computedHeight}`);

	if (style) {
		styles.push(style);
	}

	return styles.join("; ");
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

function smartConvertUnit(value: string | number | undefined) {
	if (typeof value === "number") {
		return `${value}px`;
	}
	if (!isNaN(Number(value))) {
		return `${Number(value)}px`;
	}
	return value ?? "16px";
}

$effect(() => {
	if (icon) {
		fetchIcon();
	}
});

async function fetchIcon() {
	if (!icon) return (svg = "");
	const result = await load(icon);
	svg = result ?? "";
	if (strokeWidth) {
		svg = svg.replace(/stroke-width="[^"]*"/, `stroke-width="${strokeWidth}"`);
	}
	console.log(svg);
}
</script>

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" style={styles}>
	{@html svg}
</svg>
