<script>
import IconButton from "$lib/IconButton.svelte";
import { codeToHtml } from "shiki";
import { getThemeState } from "./theme.svelte.js";

let { code = "", lang = "", file } = $props();
const t = getThemeState();

let html = $state(null);

async function runShiki() {
	const shikiTheme = t.theme == "dark" ? "catppuccin-mocha" : "catppuccin-latte";
	html = await codeToHtml(code, {
		lang,
		theme: shikiTheme,
	});
}

$effect(() => {
	t.theme;
	runShiki();
});
</script>

<div class="code-wrapper">
	{#if file}
		<span class="lang">{file}</span>
	{/if}
	{#if html}
		{@html html}
	{:else}
		<pre><code>{code}</code></pre>
	{/if}
	<button
		class="copy"
		onclick={() => {
			navigator.clipboard.writeText(code);
		}}>
		<IconButton icon="lucide:copy" />
	</button>
</div>

<style lang="scss">
.code-wrapper {
	margin-block: 1rem;
	border: 1px solid var(--gray-100);
	background-color: var(--code-bg);
	padding: 0.5rem;
	border-radius: 0.5rem;
	display: flex;
	flex-direction: column;
	position: relative;
	.copy {
		position: absolute;
		display: flex;
		justify-content: center;
		align-items: center;
		top: 0.625rem;
		right: 0.625rem;
		padding: 0.5rem;
		border: 0;
		color: color-mix(in srgb, var(--text), 50% transparent);
		border-radius: 0.5rem;
		background: transparent;
		cursor: pointer;
		transition: all 0.3s;
		&:hover {
			background-color: var(--gray-200);
			color: var(--primary);
		}
	}
	.lang {
		width: fit-content;
		font-size: 0.8125rem;
		border-radius: 0.375rem;
		padding: 0.25rem 0.375rem;
		border: 1px solid var(--border);
		background-color: color-mix(in srgb, var(--bg-100), 50% transparent);
		font-family: var(--font-mono);
		color: color-mix(in srgb, var(--text), 25% transparent);
	}
	pre {
		margin: 0;
		padding: 0.5rem;
		background-color: transparent !important;
		tab-size: 2;
		font-size: 0.875rem;
		line-height: 150%;
		-moz-tab-size: 2;
		font-family: var(--font-mono);
		white-space: pre-wrap;
	}
	& :global {
		.shiki {
			margin: 0;
			padding: 0.5rem;
			background-color: transparent !important;
			tab-size: 2;
			font-size: 0.875rem;
			line-height: 150%;
			-moz-tab-size: 2;
			font-family: var(--font-mono);
			white-space: pre-wrap;
		}
	}
}
</style>
