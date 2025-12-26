<script>
import "./main.scss";
import Hero from "./Hero.svelte";
import Installation from "./Installation.svelte";
import Props from "./Props.svelte";
import Usage from "./Usage.svelte";
import { setThemeState } from "./theme.svelte.js";
import Theme from "./Theme.svelte";
import Demo from "./Demo.svelte";
import ViteConfig from "./ViteConfig.svelte";
import Credits from "./Credits.svelte";

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
	<Credits />
</main>

<footer>
	<div class="content">
		<p>
			Created by <a href="https://arvin.how">merhmerh </a>
		</p>
	</div>
</footer>

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
footer {
	display: flex;
	align-items: center;
	height: 4rem;
	background-color: color-mix(in srgb, var(--gray-100), 50% transparent);
	.content {
		width: min(632px, 100%);
		margin-inline: auto;
		font-size: 0.875rem;
		color: color-mix(in srgb, var(--text), 50% transparent);
		@media screen and (max-width: 768px) {
			padding-inline: 1rem;
		}
	}
}
</style>
