<script>
import Footer from "../Footer.svelte";
import Theme from "../home/Theme.svelte";

let { children } = $props();
</script>

<header>
	<a href="/">
		<img src="main.png" draggable="false" alt="main" />
	</a>

	<Theme fixed={false} />
</header>
<main>
	{@render children?.()}
</main>

<Footer width="1600px">
	<span>Powered by <a href="https://icon-sets.iconify.design/"> Iconify</a></span>
</Footer>

<style lang="scss">
header {
	padding: 0.5rem;
	width: min(1600px, 100%);
	margin-inline: auto;
	padding-inline: 1rem;
	display: flex;
	justify-content: space-between;
	align-items: center;
	height: 4rem;
	a {
		display: flex;
		align-items: center;
		img {
			height: 3rem;
		}
	}
}
main {
	padding: 1rem;
	width: min(1600px, 100%);
	margin-inline: auto;
	padding-inline: 1rem;
	min-height: calc(100dvh - 4rem);
}
</style>
