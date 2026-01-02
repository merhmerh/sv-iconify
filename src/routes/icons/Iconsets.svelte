<script>
import Search from "$lib/components/Search.svelte";
import Icon from "$lib/Icon.svelte";
import { tick } from "svelte";
import { SvelteSet } from "svelte/reactivity";
import { fly } from "svelte/transition";
import { getIconListState } from "./IconList.svelte.js";

const ic = getIconListState();
// let selectedIconset = new SvelteSet();
let searchFilter = new SvelteSet();
let showList = $state(false);
let searchInput = $state("");
let searchBar = $state(null);
let filterBarElement = $state(null);

function onsearch() {
	searchFilter.clear();
	const filter = searchInput.trim().toLowerCase();
	if (filter === "") {
		return;
	}
	for (const iconset of ic.iconsets) {
		if (iconset.name.toLowerCase().includes(filter)) {
			searchFilter.add(iconset.name);
		}
	}
}

function onSearchSelect() {
	if (searchFilter.size > 0) {
		const first = searchFilter.values().next().value;
		ic.updateIconset.add(first);
		searchInput = "";
		showList = false;
	}
}

async function toggleShowList() {
	showList = !showList;
	if (showList) {
		searchInput = "";
		searchFilter.clear();
		await tick();
		if (searchBar) {
			searchBar.focus();
		}
	}
}
let filterBarHeight = $state(0);
</script>

<svelte:window
	onclick={(e) => {
		if (e.target.closest(".filter-container") == null) {
			showList = false;
		}
	}} />

<div class="filter-container">
	<div
		bind:this={filterBarElement}
		class="filter-bar"
		class:dropdown-open={showList}
		class:more-than-one-row={filterBarHeight > 40}
		bind:clientHeight={filterBarHeight}
		role="button"
		tabindex="0"
		onclick={() => toggleShowList()}
		onkeydown={(e) => {
			if (e.key === "Enter" || e.key === " ") {
				e.preventDefault();
				toggleShowList();
			}
		}}>
		<div class="selected-tags">
			{#each Array.from(ic.selectedIconset) as iconsetName}
				<span class="tag">
					{iconsetName}
					<button
						class="icon"
						onclick={(e) => {
							e.stopPropagation();
							ic.updateIconset.delete(iconsetName);
						}}>
						<Icon icon="lucide:x" width="12" />
					</button>
				</span>
			{/each}
			{#if ic.selectedIconset.size === 0}
				<span class="placeholder">Select icon sets...</span>
			{/if}
		</div>

		<button
			class="toggle-btn"
			onclick={(e) => {
				e.stopPropagation();
				toggleShowList();
			}}>
			<div class="icon">
				<Icon icon={showList ? "lucide:chevron-up" : "lucide:chevrons-down"} width="16" />
			</div>
			<span class="count">{ic.selectedIconset.size}/{ic.iconsets.length}</span>
		</button>
	</div>

	{#if showList}
		<div class="dropdown" transition:fly={{ y: -8, duration: 150 }}>
			<div class="divider"></div>
			<Search
				spellcheck={false}
				bind:this={searchBar}
				bind:value={searchInput}
				placeholder="Search icon sets..."
				oninput={() => onsearch()}
				onsearch={() => onSearchSelect()} />

			<div class="list">
				{#each ic.iconsets as iconset}
					{#if searchFilter.has(iconset.name) || (searchFilter.size === 0 && !searchInput)}
						<button
							class="option"
							class:selected={ic.selectedIconset.has(iconset.name)}
							onclick={() => {
								!ic.selectedIconset.has(iconset.name)
									? ic.updateIconset.add(iconset.name)
									: ic.updateIconset.delete(iconset.name);
							}}>
							<span>{iconset.name}</span>
						</button>
					{/if}
				{/each}

				{#if searchFilter.size === 0 && searchInput}
					<p class="not-found">No icon sets found.</p>
				{/if}
			</div>
		</div>
	{/if}
</div>

<style lang="scss">
.filter-container {
	width: 100%;
	font-family: var(--font-sans-serif);
	position: relative;

	.filter-bar {
		display: grid;
		grid-template-columns: auto 6rem;
		gap: 0.5rem;
		padding: 0.25rem;
		background: var(--bg-50);
		border: 1px solid var(--border);
		border-radius: 2rem;
		min-height: 42px;
		transition: all 0.2s ease;

		cursor: pointer;

		&.more-than-one-row {
			border-radius: 1rem;
		}

		&.dropdown-open {
			background-color: var(--bg);
			border-radius: 0.5rem 0.5rem 0 0;
		}

		.selected-tags {
			flex: 1;
			display: flex;
			align-items: center;
			flex-wrap: wrap;
			gap: 0.375rem;
			min-height: 24px;

			.placeholder {
				padding-inline: 0.75rem;
				color: color-mix(in srgb, var(--text), 25% transparent);
			}
			.tag {
				display: inline-flex;
				align-items: center;
				gap: 2px;
				padding: 0.25rem 0.5rem;
				padding-right: 0.25rem;
				background: color-mix(in srgb, var(--accent) 12%, var(--bg));
				border: 1px solid color-mix(in srgb, var(--accent) 50%, var(--bg));
				color: var(--accent);
				border-radius: 1rem;
				font-size: 0.875rem;
				font-weight: 500;

				button.icon {
					border-radius: 50%;

					&:hover {
						background: color-mix(in srgb, var(--accent), 75% transparent);
					}
				}
			}
		}

		.toggle-btn {
			height: fit-content;
			display: flex;
			align-items: center;
			gap: 0rem;
			padding: 0.375rem 0.625rem;
			background: var(--bg-100);
			border: 1px solid var(--border);
			border-radius: 2rem;
			font-size: 0.8125rem;
			font-weight: 600;
			color: var(--primary);
			transition: all 0.2s ease;
			white-space: nowrap;

			&:hover {
				background: var(--gray-100);
				border-color: var(--accent);
			}
			.icon {
				display: flex;
				justify-content: center;
				align-items: center;
			}
			span.count {
				flex: 1;
				text-align: center;
			}
		}
	}

	.dropdown {
		position: absolute;
		top: calc(100% - 2px);
		left: 0;
		right: 0;
		background: var(--bg);
		border: 1px solid var(--border);
		border-top: 0;
		border-radius: 0 0 0.5rem 0.5rem;
		box-shadow: var(--shadow-lg);

		z-index: 1;
		padding: 0.5rem;

		display: flex;
		flex-direction: column;
		gap: 0.25rem;

		.divider {
			border-top: 1px solid var(--border);
			padding-bottom: 0.5rem;
		}

		.list {
			margin-top: 0.25rem;
			scrollbar-width: thin;
			overflow-y: auto;
			max-height: 320px;
			display: flex;
			flex-wrap: wrap;
			gap: 0.25rem;
			button.option {
				display: flex;
				align-items: center;
				justify-content: space-between;
				padding: 0.25rem 0.375rem;
				background: color-mix(in srgb, var(--bg-100), 50% transparent);
				border: 1px solid var(--border);
				color: var(--text);
				font-size: 0.875rem;
				text-align: left;
				border-radius: 0.5rem;
				cursor: pointer;
				transition: all 0.15s ease;

				&:hover {
					background: var(--bg-100);
				}

				&.selected {
					border-color: var(--accent);
					background: color-mix(in srgb, var(--accent), 90% transparent);
					color: var(--accent);
				}
			}
			p.not-found {
				margin: 0;
				font-size: 0.875rem;
				padding: 0.25rem 0.5rem;
				border: 1px solid transparent;
			}
		}
	}
}
</style>
