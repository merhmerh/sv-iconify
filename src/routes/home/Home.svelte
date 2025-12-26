<script>
import "./main.scss";
import { codes } from "./codes.ts";
import Hero from "./Hero.svelte";
import Installation from "./Installation.svelte";
import Code from "./Code.svelte";
import Props from "./Props.svelte";
import Usage from "./Usage.svelte";
import { setThemeState } from "./theme.svelte.js";
import Theme from "./Theme.svelte";
import Demo from "./Demo.svelte";
import ViteConfig from "./ViteConfig.svelte";

setThemeState();
</script>

<main>
	<Theme />
	<Hero />
	<Installation />
	<Demo />
	<Usage />
	<Props />
	<ViteConfig />
</main>

<style lang="scss">
main {
	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;
	width: min(632px, 100%);
	margin-inline: auto;
	padding-inline: 2rem;
	padding-block: 2rem;
	@media screen and (max-width: 632px) {
		padding-inline: 1rem;
		width: 100%;
	}
}
</style>
