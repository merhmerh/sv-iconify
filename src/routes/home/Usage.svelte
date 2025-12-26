<script>
import Icon from "$lib/Icon.svelte";
import Code from "./Code.svelte";
import { codes } from "./codes.ts";

const icons = [
	"lucide:anchor",
	"lucide:aperture",
	"lucide:archive",
	"lucide:arrow-big-down",
	"lucide:baggage-claim",
	"lucide:battery-charging",
	"lucide:bell-ring",
	"lucide:bike",
	"lucide:binary",
	"lucide:bird",
	"lucide:bluetooth",
	"lucide:bomb",
	"tabler:armchair",
	"tabler:atom",
	"tabler:award",
	"tabler:backhoe",
	"tabler:ball-basketball",
	"tabler:bandage",
	"tabler:barcode",
	"tabler:basket",
];
</script>

<section>
	<h3>Usage</h3>
	<p>Add the svIconify vite plugin to your vite config to enable tree-shaking</p>
	<Code code={codes.vitePlugin} file="vite.config.js" lang="js" />

	<p>Import the Icon component and use it in your Svelte files:</p>
	<Code code={codes.script} file="+page.svelte" lang="svelte" />

	<div class="icons">
		{#each icons as icon}
			<div class="icon">
				<Icon {icon} width="24" />
			</div>
		{/each}
	</div>
</section>

<style lang="scss">
.icons {
	display: flex;
	justify-content: center;
	overflow: hidden;
	gap: 0.5rem;
	position: relative;
	width: 100%;
	@media screen and (max-width: 768px) {
		mask-image: linear-gradient(to right, transparent, black 15%, black 85%, transparent);
		-webkit-mask-image: linear-gradient(to right, transparent, black 15%, black 85%, transparent);
	}
	.icon {
		display: flex;
		align-items: center;
		justify-content: space-evenly;
		flex-shrink: 0;
		color: color-mix(in srgb, var(--primary), 50% var(--bg-100));
	}
}
</style>
