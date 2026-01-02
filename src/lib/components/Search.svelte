<script>
import Icon from "$lib/Icon.svelte";
import { onMount } from "svelte";
let {
	style,
	rounded,
	children,
	kbd,
	category,
	unstyled = false,
	size = "",
	value = $bindable(""),
	onsearch = () => {},
	onclear = () => {},
	onkeydown = () => {},
	searchButton = false,
	placeholder = "Search",
	oninput = () => {},
	wrapper = false,
	...props
} = $props();

let showKBD = $state(false);
let input = $state(null);

function search() {
	onsearch(value);
}
function clear() {
	value = "";
	onclear();
}

onMount(() => {
	if (kbd == true) {
		const regex = /mobile/i;
		if (regex.test(navigator.userAgent)) {
			showKBD = false;
		} else {
			showKBD = true;
		}
	}
});

function handleKeydown(e) {
	if (input && showKBD && e.ctrlKey && e.key === "k") {
		e.preventDefault();
		e.stopPropagation();
		input.focus();
		input.setSelectionRange(0, input.value.length);
	}
	//if input is focus
	if (input && input === document.activeElement) {
		if (e.key === "Escape") {
			input.blur();
		}
	}
}

export function focus() {
	input.focus();
}
</script>

<svelte:window onkeydown={handleKeydown} />

{#if wrapper}
	<div class="searchbar-wrapper">
		<div class="icon">
			<Icon icon="hugeicons:search-02" />
		</div>
		{@render SearchBarSnippet()}
	</div>
{:else}
	{@render SearchBarSnippet()}
{/if}

{#snippet SearchBarSnippet()}
	<div class="input-box {style}" class:large={size === "large"} class:rounded class:unstyled>
		{#if category && category.length}
			{@render category?.()}
		{/if}

		<div class="input-area">
			{#if kbd && value.length == 0 && showKBD}
				<div class="kbd">
					<span>{placeholder}</span>
					<div class="kbd-container">
						<kbd>Ctrl</kbd>
						<kbd>K</kbd>
					</div>
				</div>
			{/if}

			{#if !searchButton}
				<div class="none icon mr-0.5">
					<Icon icon="lucide:search" />
				</div>
			{/if}
			<input
				bind:this={input}
				bind:value
				type="text"
				{...props}
				placeholder={showKBD == false ? placeholder : ""}
				onkeydown={(e) => {
					if (e.key === "Enter") {
						e.preventDefault();
						search();
					}
					onkeydown(e);
				}}
				oninput={(e) => {
					oninput(value);
				}} />
		</div>

		{#if value}
			<button type="button" tabindex="-1" class="none icon" onclick={() => clear()}>
				<Icon icon="lucide:x" />
			</button>
		{/if}

		{#if searchButton}
			<button type="button" class="none icon" onclick={() => search()}>
				<Icon icon="lucide:search" />
			</button>
		{/if}

		{@render children?.()}
	</div>
{/snippet}

<style global lang="scss">
.searchbar-wrapper {
	padding-inline: 0.375rem;
	margin-bottom: 0.25rem;
	background-color: var(--bg);
	border-radius: 0.5rem;
	padding: 0.5rem;
	padding-block: 0.25rem;
	display: flex;
	align-items: center;
	gap: 0.375rem;
	margin-left: 3px;
}
.input-box {
	padding-right: 0.5rem;
	width: var(--width, auto);
	position: relative;

	display: flex;
	align-items: center;

	background: var(--bg);
	border: 1px solid var(--border);
	padding-inline: 0.5rem;
	border-radius: 0.375rem;
	font-size: 0.875rem;
	color: var(--text);
	outline: none;

	&:focus-within {
		border-color: color-mix(in oklab, #808080 60%, var(--bg-100));
		box-shadow: var(--box-shadow-ring);
	}

	&.table {
		border-radius: 0.375rem;
		padding-right: 0.25rem;
		background-color: var(--input-box-bg) !important;
		&:hover:not(:disabled) {
			--border-color: var(--primary);
		}
		&:focus-within {
			--border-color: var(--primary) !important;
		}
		input {
			padding: 0.375rem !important;
		}
	}
	&.small {
		padding: 0;
		border-radius: 10rem;
		padding-inline: 0.25rem;

		.input-area {
			input {
				font-size: 0.8125rem;
				padding-block: 0.375rem;
			}
		}
	}

	&.rounded {
		border-radius: 10rem;
		padding-right: 0.5rem;
		.icon {
			border-radius: 50%;
		}
	}

	.input-area {
		display: flex;
		align-items: center;
		width: 100%;

		.kbd {
			position: absolute;
			align-items: center;
			color: var(--text);
			font-weight: 400;
			font-size: 0.875rem;
			padding-inline: 0.25rem;
			display: flex;
			font-family: var(--font-sans-serif);
			width: calc(100% - 3rem);
			pointer-events: none;
			span {
				margin-right: 0.5rem;
				font-size: 1rem;
				opacity: 0.75;
			}
			.kbd-container {
				margin-left: auto;
			}
		}
		input {
			--border-color: var(--border);
			border: 0;
			background: transparent;
			font-family: var(--font-sans-serif);
			padding-block: 0.375rem;
			outline: 0px solid transparent;
			font-size: 0.875rem;
			padding-inline: 0.25rem;
			width: 100%;
			color: var(--text);
			&::placeholder {
				font-size: inherit;
			}
		}
	}

	&.unstyled {
		border: 0;
		padding: 0;
		.input-area {
			input {
				padding: 0;
				padding-block: 0.125rem;
				border: 0;
				border-radius: 0;
			}
		}
	}

	.icon {
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
		width: 1.25rem;
		height: 1.25rem;
		color: var(--text-light);
		transition: all 0.2s ease;

		&.mr-0\.5 {
			margin-right: 0.125rem;
		}
	}

	&.large {
		border-radius: 0.75rem;
		input {
			font-size: 1rem;
			padding-block: 0.5rem;
		}
		button.icon {
			width: 1.75rem;
			height: 1.75rem;
		}
	}

	button.icon {
		cursor: pointer;
		padding: 0.125rem;
		border-radius: 0.25rem;
		&:hover {
			background-color: var(--gray-100) !important;
			color: var(--text);
		}

		&.none {
			background: transparent;
			border: none;
			outline: none;
		}
	}

	.kbd-container {
		display: flex;
		gap: 0.25rem;

		kbd {
			display: inline-flex;
			align-items: center;
			justify-content: center;
			min-width: 1.5rem;
			height: 1.5rem;
			padding-inline: 0.375rem;
			font-size: 0.75rem;
			font-weight: 600;
			line-height: 1;
			color: color-mix(in srgb, var(--text), 50% transparent);
			background: var(--bg-100);
			border: 1px solid var(--border);
			border-radius: 0.25rem;
			box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
		}
	}
}
</style>
