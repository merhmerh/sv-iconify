<script>
import Home from "./home/Home.svelte";

const description =
	"A Svelte icon component library powered by Iconify with tree-shaking support. Works offline and only bundles the icons you use in your app.";
const image =
	"https://raw.githubusercontent.com/merhmerh/sv-iconify/refs/heads/main/static/main.png";
</script>

<svelte:head>
	<title>sv Iconify</title>
	<meta name="description" content={description} />
	<meta property="og:title" content="sv Iconify" />
	<meta property="og:description" content={description} />
	<meta property="og:type" content="website" />
	<meta property="og:image" content={image} />
</svelte:head>
<Home />
