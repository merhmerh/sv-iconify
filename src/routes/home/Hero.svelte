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
	<a href="/icons" class="browse-btn">
		<Icon icon="lucide:grid-2x2" width="18" rotate="45" />
		<span>Browse Icons</span>
		<Icon icon="lucide:arrow-right" width="18" />
	</a>
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

	.browse-btn {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		margin-top: 1.5rem;
		padding: 0.75rem 2rem;
		background: var(--bg-50);
		border: 1px solid var(--border);
		box-shadow: var(--shadow);
		text-decoration: none;
		border-radius: 5rem;
		font-weight: 500;
		color: var(--text);
		font-size: 1rem;
		transition: all 0.2s;
		&:hover {
			background-color: color-mix(in srgb, var(--accent) 12%, var(--base));
			color: var(--accent);
			border-color: color-mix(in srgb, var(--accent), 50% transparent);
		}
	}
}
</style>
