<script>
import Icon from "$lib/Icon.svelte";
const icons = [
	"lucide:apple",
	"lucide:activity",
	"lucide:airplay",
	"lucide:alarm-check",
	"lucide:alert-circle",
	"lucide:align-center",
	"lucide:anchor",
	"lucide:archive",
	"lucide:arrow-down-circle",
	"lucide:arrow-up-circle",
];
</script>

<main>
	<h1>Iconify Static</h1>

	<div class="container">
		{#each icons as iconName}
			<Icon icon={iconName} width="20" />
		{/each}
	</div>
</main>

<style>
main {
	width: min(800px, 100%);
	margin-inline: auto;
	.container {
		border: 1px solid lightgrey;
		padding: 1rem;
		min-height: 2rem;
		border-radius: 1rem;
		display: flex;
		gap: 0.5rem;
	}
}
</style>
