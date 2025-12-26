<script>
import Icon from "$lib/Icon.svelte";
import { fly, fade, scale } from "svelte/transition";
import { cubicInOut } from "svelte/easing";
import { getThemeState } from "./theme.svelte.js";
import { innerWidth } from "svelte/reactivity/window";

const t = getThemeState();
let showTheme = $state(true);
</script>

<svelte:window
	onscroll={() => {
		const breakPoint = innerWidth.current <= 640 ? 200 : 500;
		showTheme = window.scrollY <= breakPoint;
	}} />

{#if showTheme}
	<div class="fixed" transition:fly>
		<a href="https://github.com/merhmerh/sv-iconify">
			<Icon icon="mdi:github" width="28" />
		</a>
		<button onclick={() => t.switchTheme()}>
			{#if t.theme === "dark"}
				<div
					class="icon-wrapper"
					in:scale={{ duration: 400, start: 0.75, opacity: 0, easing: cubicInOut }}
					out:scale={{ duration: 300, start: 1, opacity: 0, easing: cubicInOut }}>
					<Icon icon="lucide:moon" width="20" />
				</div>
			{:else}
				<div
					class="icon-wrapper"
					in:scale={{ duration: 400, start: 0.75, opacity: 0, easing: cubicInOut }}
					out:scale={{ duration: 300, start: 1, opacity: 0, easing: cubicInOut }}>
					<Icon icon="lucide:sun" width="20" />
				</div>
			{/if}
		</button>
	</div>
{/if}

<style lang="scss">
.fixed {
	position: fixed;
	top: 1rem;
	right: 1rem;
	display: flex;
	align-items: center;
	gap: 0.125rem;
	z-index: 1;
	button,
	a {
		display: flex;
		justify-content: center;
		align-items: center;
		border: 0;
		border-radius: 50%;
		width: 2.25rem;
		height: 2.25rem;
		cursor: pointer;
		background-color: transparent;
		color: var(--text);
		&:hover {
			background-color: var(--gray-100);
		}
	}

	button {
		position: relative;
		.icon-wrapper {
			position: absolute;
			inset: 0;
			display: flex;
			align-items: center;
			justify-content: center;
		}
	}
}
</style>
