<script>
import Icon from "$lib/Icon.svelte";
import { fly } from "svelte/transition";
import { getThemeState } from "./theme.svelte.js";

const t = getThemeState();
let showTheme = $state(true);
</script>

<svelte:window
	onscroll={() => {
		showTheme = window.scrollY <= 500;
	}} />

{#if showTheme}
	<button class="theme" onclick={() => t.switchTheme()} transition:fly>
		{#if t.theme === "dark"}
			<Icon icon="lucide:moon" width="20" />
		{:else}
			<Icon icon="lucide:sun" width="20" />
		{/if}
	</button>
{/if}

<style lang="scss">
.theme {
	position: fixed;
	top: 1rem;
	right: 1rem;
	border: 0;
	justify-content: center;
	align-items: center;
	display: flex;
	border-radius: 50%;
	padding: 0.5rem;
	cursor: pointer;
	background-color: transparent;
	color: var(--text);
}
</style>
