<script>
import { page } from "$app/state";
import { setThemeState } from "./home/theme.svelte.js";
import "./styles/main.scss";
let { children } = $props();
setThemeState();

const description =
	"A Svelte icon component library powered by Iconify with tree-shaking support. Works offline and only bundles the icons you use in your app.";
const image =
	"https://raw.githubusercontent.com/merhmerh/sv-iconify/refs/heads/main/static/main.png";

const META = $derived.by(() => {
	let title = "sv Iconify";
	if (page.route.id === "/icons") {
		title = "Icons • sv Iconify";
	}
	return {
		title: title,
		description,
		image,
	};
});
</script>

<svelte:head>
	<title>{META.title}</title>
	<meta name="description" content={META.description} />
	<meta property="og:title" content="sv Iconify" />
	<meta property="og:description" content={META.description} />
	<meta property="og:type" content="website" />
	<meta property="og:image" content={META.image} />
</svelte:head>
{@render children?.()}
