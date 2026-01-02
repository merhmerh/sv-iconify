<script>
import Hero from "./Hero.svelte";
import Installation from "./Installation.svelte";
import Props from "./Props.svelte";
import Usage from "./Usage.svelte";
import Demo from "./Demo.svelte";
import ViteConfig from "./ViteConfig.svelte";
import Credits from "./Credits.svelte";
import Theme from "./Theme.svelte";
</script>

<Theme />

<main>
	<Hero />
	<Installation />
	<Demo />
	<Usage />
	<Props />
	<ViteConfig />
	<section class="limitation">
		<h3>Limitation</h3>

		<ul>
			<li>
				<p>
					Since sv-iconify relies on static analysis to detect icon usage in your source code,
					dynamic icon names (e.g., those constructed at runtime) may not be detected and
					included in the bundle.
				</p>
				<p>
					Use the <em>includes</em> option in the Vite plugin configuration to manually include such
					icons or icon sets to ensure they are available at runtime.
				</p>
			</li>
			<li>
				<p>
					Emoji icons are not included are they are too large for dev bundles. If you need
					emoji ensure fallback is set to true and ensure it have internet access.
				</p>
			</li>
		</ul>
	</section>
	<Credits />
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
	.limitation {
		li {
			margin-left: -1rem;
		}
		p {
			margin-block: 0.5rem;
		}
	}
}
</style>
