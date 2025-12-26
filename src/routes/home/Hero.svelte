<script>
import Icon from "$lib/Icon.svelte";
</script>

<div class="hero">
	<div class="icon-container">
		<img src="main.png" draggable="false" alt="main" />
	</div>
	<p>
		A tree-shakable Svelte icon component powered by Iconify <br />
		Only bundle the icons you actually use
	</p>
</div>

<style lang="scss">
.hero {
	width: 100%;
	text-align: center;
	.icon-container {
		width: 350px;
		margin-inline: auto;
		img {
			width: 100%;
			height: 100%;
		}
	}
	p {
		font-size: 1.25rem;
	}
}
</style>
