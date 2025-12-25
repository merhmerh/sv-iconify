<script>
import Icon from "$lib/Icon.svelte";
</script>

<section class="hero">
	<div class="hero-icon">
		<Icon icon="lucide:package" width="64" />
	</div>
	<h1>sv-iconify</h1>
	<p class="tagline">Tree-shaken Iconify icons for Svelte</p>
	<p class="description">
		Access icons from Iconify without API calls. Only bundle what you use, work completely
		offline.
	</p>

	<div class="cta">
		<button
			class="install-box"
			onclick={() => {
				navigator.clipboard.writeText("pnpm add sv-iconify --save-dev");
			}}>
			<code>pnpm add sv-iconify --save-dev</code>
			<Icon icon="lucide:copy" />
		</button>
	</div>
</section>

<style>
.hero {
	text-align: center;
	padding: 4rem 0 6rem;
	display: flex;
	flex-direction: column;
	align-items: center;

	.hero-icon {
		display: inline-flex;
		padding: 1.5rem;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		border-radius: 1.5rem;
		color: white;
		margin-bottom: 2rem;
		box-shadow: 0 10px 40px rgba(102, 126, 234, 0.3);
	}

	h1 {
		font-size: clamp(2.5rem, 6vw, 4rem);
		font-weight: 800;
		margin: 0 0 1rem;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}

	.tagline {
		font-size: clamp(1.2rem, 3vw, 1.5rem);
		color: #666;
		margin: 0 0 1rem;
		font-weight: 500;
	}

	.description {
		font-size: 1.1rem;
		color: #888;
		max-width: 600px;
		margin: 0 auto 2rem;
		line-height: 1.6;
	}

	.install-box {
		cursor: pointer;
		width: fit-content;
		gap: 1rem;
		display: flex;
		align-content: center;
		background: #f5f5f5;
		padding: 1rem 2rem;
		border-radius: 0.75rem;
		border: 2px solid #e0e0e0;
		transition: all 0.3s ease;
		&:hover {
			border-color: #667eea;
			box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
		}

		code {
			font-family: "Monaco", "Menlo", "Courier New", monospace;
			font-size: 1rem;
			color: #333;
		}
	}
}
</style>
