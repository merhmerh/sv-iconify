<script>
import Icon from "$lib/Icon.svelte";
import Code from "./Code.svelte";
import { codes } from "./codes.ts";
import { getThemeState } from "./theme.svelte.js";
const t = getThemeState();
const iconList = [
	{ name: "Package", value: "lucide:package" },
	{ name: "Heart", value: "lucide:heart" },
	{ name: "Star", value: "lucide:star" },
	{ name: "Sun", value: "lucide:sun" },
	{ name: "Moon", value: "lucide:moon" },
	{ name: "Rocket", value: "lucide:rocket" },
	{ name: "Zap", value: "lucide:zap" },
	{ name: "Coffee", value: "lucide:coffee" },
	{ name: "Music", value: "lucide:music" },
	{ name: "Camera", value: "lucide:camera" },
	{ name: "Flame", value: "lucide:flame" },
];

let demo = $state({
	icon: "lucide:package",
	width: 80,
	hue: 128,
	strokeWidth: 20,
	rotate: 0,
	hFlip: false,
	vFlip: false,
	style: "overflow:unset",
});
const iconProps = $derived.by(() => {
	const saturation = t.theme === "light" ? "25%" : "75%";
	const lightness = t.theme === "light" ? "50%" : "75%";

	const color = `hsl(${demo.hue}, ${saturation}, ${lightness})`;
	const strokeWidth = demo.strokeWidth / 10;
	const rotate = demo.rotate;
	return {
		width: demo.width,
		strokeWidth,
		color,
		rotate,
		hFlip: demo.hFlip,
		vFlip: demo.vFlip,
		style: demo.style,
	};
});

const generatedCode = $derived.by(() => {
	let props = [`icon="${demo.icon}"`];

	if (demo.width !== 80) props.push(`width={${demo.width}}`);
	if (iconProps.color !== "hsl(0, 25%, 50%)" && iconProps.color !== "hsl(0, 75%, 50%)") {
		props.push(`color="${iconProps.color}"`);
	}
	if (iconProps.strokeWidth !== 2) props.push(`strokeWidth={${iconProps.strokeWidth}}`);
	if (demo.rotate !== 0) props.push(`rotate={${demo.rotate}}`);
	if (demo.hFlip) props.push(`hFlip={true}`);
	if (demo.vFlip) props.push(`vFlip={true}`);
	if (demo.style !== "overflow:unset") props.push(`style="${demo.style}"`);

	return `<Icon ${props.join(" ")} />`;
});
</script>

<section>
	<h3>Props</h3>
	<p>Icons can customized similar to Iconify</p>
	<Code code={codes.basicUsage} file="+page.svelte" lang="svelte" />

	<p>
		The list of available props are shown in the
		<a
			href="#demo"
			onclick={(e) => {
				e.preventDefault();
				document.getElementById("demo").scrollIntoView({ behavior: "smooth" });
			}}>demo above</a>
		along with the generated code for the current.
	</p>
</section>
