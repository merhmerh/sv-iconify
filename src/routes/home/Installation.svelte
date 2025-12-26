<script>
import Code from "./Code.svelte";
</script>

<section>
	<h3>Installation</h3>
	<Code code={`pnpm add sv-iconify --save-dev`} lang="bash" />
</section>

<style lang="scss">
section {
	& :global {
		pre.shiki {
			font-size: 1rem;
		}
	}
}
</style>
