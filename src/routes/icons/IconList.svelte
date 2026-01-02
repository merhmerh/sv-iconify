<script>
import Search from "$lib/components/Search.svelte";
import IconButton from "$lib/IconButton.svelte";
import { tick } from "svelte";
import IconDetails from "./IconDetails.svelte";
import { getIconListState } from "./IconList.svelte.js";
import Icon from "@iconify/svelte";
const ic = getIconListState();
let searchBar = $state(null);

async function onsearch() {
	await ic.searchIcons(ic.searchValue);
}

async function clearSearch() {
	localStorage.removeItem("lastSearch");
	await tick();
	searchBar.focus();
}

// Prevent body scroll when modal is open on mobile
$effect(() => {
	if (ic.selectedIcon && window.innerWidth <= 600) {
		document.body.style.overflow = "hidden";
		return () => {
			document.body.style.overflow = "unset";
		};
	}
});
</script>

<svelte:window
	onkeydown={(e) => {
		if (e.key === "Escape" && ic.selectedIcon) {
			ic.selectedIcon = null;
		}
	}} />

<div class="search">
	<Search
		bind:this={searchBar}
		kbd
		size="large"
		searchButton
		placeholder="Search icons..."
		bind:value={ic.searchValue}
		{onsearch}
		onclear={() => clearSearch()} />
</div>

<div class="wrapper">
	<div class="container">
		{#each Object.entries(ic.icons) as [iconSetName, icons]}
			<div class="iconset-section">
				<div class="iconset-header">
					<h3>{iconSetName}</h3>
					<span class="count">{icons.length} {icons.length === 1 ? "icon" : "icons"}</span>
				</div>
				{#if icons.length === 0}
					<p class="empty">No icons found in this icon set.</p>
				{:else}
					<div class="list">
						{#each icons as icon}
							<div class="icon-box-container">
								<button
									class="icon-box"
									class:selected={ic.selectedIcon?.iconName === icon}
									onclick={(e) => ic.selectIcon(e, icon)}>
									<Icon {icon} width="40" />
								</button>
								<button class="copy" onclick={() => navigator.clipboard.writeText(icon)}>
									<IconButton icon="lucide:copy" width="14" />
								</button>
							</div>
						{/each}
					</div>
				{/if}
			</div>
		{/each}
		{#if Object.keys(ic.icons).length === 0}
			<div class="empty-state">
				{#if !ic.searchError}
					<div class="empty-icon">
						<Icon icon="mdi:magnify" width="48" height="48" />
					</div>
					<p class="empty-title">Search for icons</p>
					<p class="empty-desc">Enter a keyword to find icons from your selected icon sets</p>
				{:else}
					<div class="empty-icon">
						<Icon icon="mdi:alert-circle-outline" width="48" height="48" />
					</div>
					<p class="empty-title">No icons found</p>
					<p class="empty-desc">{ic.searchError}</p>
				{/if}
			</div>
		{/if}
	</div>
	{#if ic.selectedIcon}
		<div class="details-container">
			<IconDetails />
		</div>
	{/if}
</div>

<style lang="scss">
.search {
	margin-block: 1rem;
	width: min(400px, 100%);
	@media screen and (max-width: 600px) {
		width: 100%;
		margin-block: 0.5rem;
	}
}

.wrapper {
	display: flex;
	gap: 0.5rem;
	width: 100%;
	.container {
		font-family: var(--font-sans-serif);
		border-radius: 0.75rem;
		padding: 1.5rem;
		background: var(--bg);
		min-height: 300px;
		display: flex;
		flex-direction: column;
		gap: 2rem;
		flex: 1;

		.iconset-section {
			display: flex;
			flex-direction: column;
			gap: 1rem;

			.iconset-header {
				display: flex;
				align-items: center;
				gap: 0.75rem;
				padding-bottom: 0.5rem;
				border-bottom: 1px solid var(--gray-100);

				h3 {
					margin: 0;
					font-size: 1.25rem;
					font-weight: 500;
					color: var(--text);
				}

				.count {
					font-size: 0.875rem;
					color: var(--text-light);
					padding: 0.25rem 0.625rem;
					background: var(--gray-200);
					border-radius: 1rem;
					font-weight: 500;
				}
			}

			p.empty {
				margin: 0;
				color: color-mix(in srgb, var(--text), 50% transparent);
			}
		}

		.list {
			display: grid;
			grid-template-columns: repeat(auto-fill, minmax(64px, 1fr));
			gap: 0.5rem;

			.icon-box-container {
				display: flex;
				align-items: center;
				justify-content: center;
				position: relative;
				&:hover .copy {
					display: flex;
				}
				.copy {
					display: none;
					position: absolute;
					bottom: -0.625rem;
					right: -0.625rem;
					border-radius: 50%;
					padding: 0.375rem;
					z-index: 1;
					background-color: var(--base);
					border: 1px solid var(--border);
					color: var(--text);
					@media screen and (max-width: 600px) {
						display: none !important;
					}
				}
			}
			button.icon-box {
				aspect-ratio: 1;
				display: flex;
				align-items: center;
				justify-content: center;
				border: 1px solid var(--gray-200);
				border-radius: 0.5rem;
				padding: 0.75rem;
				cursor: pointer;
				transition: all 0.2s ease;
				color: var(--text);

				background:
					linear-gradient(
						45deg,
						var(--c1) 25%,
						var(--c2) 25%,
						var(--c2) 75%,
						var(--c1) 75%,
						var(--c1)
					),
					linear-gradient(
						45deg,
						var(--c1) 25%,
						var(--c2) 25%,
						var(--c2) 75%,
						var(--c1) 75%,
						var(--c1)
					);
				--size: 10px;
				--pos: calc(var(--size) / 2);
				background-size: var(--size) var(--size);
				background-position:
					0 0,
					var(--pos) var(--pos);
				background-color: var(--base);

				&:hover {
					border-color: color-mix(in oklab, #808080 40%, var(--bg-100));
					--c1: color-mix(in srgb, #808080, 85% transparent);
					--c2: transparent;
				}
				&:focus {
					outline: 0;
				}

				&.selected {
					background: color-mix(in srgb, var(--accent) 12%, transparent);
					box-shadow: inset 0 0 0 3px var(--accent);
					@media screen and (max-width: 600px) {
						box-shadow: none;
					}
				}
			}
		}

		.empty-state {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			padding: 3rem 1rem;
			text-align: center;
			flex: 1;

			.empty-icon {
				margin-bottom: 1rem;
				color: var(--gray-500);
				opacity: 0.7;
			}

			.empty-title {
				font-size: 1.25rem;
				font-weight: 600;
				color: var(--text);
				margin: 0 0 0.5rem 0;
			}

			.empty-desc {
				font-size: 0.9375rem;
				color: var(--text-light);
				margin: 0;
				max-width: 400px;
			}
		}
	}
	.details-container {
		position: sticky;
		top: 0.5rem;
		align-self: flex-start;
	}
	@media screen and (max-width: 600px) {
		.details-container {
			position: fixed;
			width: 100vw;
			height: 100dvh;
			background-color: color-mix(in srgb, #000, 25% transparent);
			backdrop-filter: blur(2px);
			z-index: 1;
			top: 0;
			left: 0;
			display: flex;
			justify-content: center;
			align-items: center;
		}
	}
}

:global {
	html[data-theme="dark"] {
		button.icon-box {
			--c1: color-mix(in srgb, #808080, 80% transparent) !important;
		}
	}
}
</style>
