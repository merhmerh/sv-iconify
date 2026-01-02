<script>
import IconButton from "$lib/IconButton.svelte";
import { getIconListState } from "./IconList.svelte.js";
import Icon from "@iconify/svelte";
import SvIcon from "$lib/Icon.svelte";
const ic = getIconListState();
</script>

<div class="details">
	<div class="header">
		<h3 class="title">Icon Details</h3>
		<button
			class="close icon"
			onclick={() => {
				ic.selectedIcon = null;
			}}>
			<SvIcon icon="lucide:x" width="20" />
		</button>
	</div>

	<div class="icon-preview">
		<Icon icon={ic.selectedIcon.iconName} width="40" />
	</div>

	<div class="info-item">
		<div class="label">Icon Name</div>
		<button class="value" onclick={() => navigator.clipboard.writeText(ic.selectedIcon.iconName)}>
			<span>{ic.selectedIcon.iconName}</span>
			<IconButton icon="lucide:copy" width="14" />
		</button>
	</div>

	<div class="info-item">
		<div class="label">Icon Set</div>
		<button
			class="value"
			onclick={() => navigator.clipboard.writeText(ic.selectedIcon.iconSetName)}>
			<span>{ic.selectedIcon.iconSetName}</span>
			<IconButton icon="lucide:copy" width="14" />
		</button>
	</div>

	<div class="svg-section">
		<div class="label">SVG Code</div>
		<textarea
			readonly
			value={ic.selectedIcon.svg}
			aria-label="SVG code"
			onclick={(e) => {
				e.target.select();
				navigator.clipboard.writeText(ic.selectedIcon.svg);
			}}></textarea>
		<button class="copy-svg">
			<span>Copy</span>
			<IconButton icon="lucide:copy" width="14" />
		</button>
	</div>
</div>

<style lang="scss">
.details {
	position: relative;
	background: var(--bg);
	border-radius: 0.75rem;
	width: 320px;
	padding: 1rem;
	font-family: var(--font-sans-serif);
	transition: box-shadow 0.2s ease;
	flex-direction: column;
	display: flex;
	gap: 1rem;
	height: fit-content;

	.header {
		display: flex;
		justify-content: space-between;
		align-items: center;

		.title {
			margin: 0;
			font-size: 1.25rem;
			font-weight: 700;
			letter-spacing: -0.025em;
		}
	}

	.icon-preview {
		border: 1px solid var(--border);
		width: 4rem;
		height: 4rem;
		display: flex;
		justify-content: center;
		align-items: center;
		border-radius: 0.5rem;
	}

	.info-item {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;

		.label {
			font-size: 0.75rem;
			font-weight: 600;
			text-transform: uppercase;
			letter-spacing: 0.05em;
		}

		button.value {
			padding: 0.5rem;
			border-radius: 0.5rem;
			border: 1px solid var(--border);
			justify-content: space-between;
			background-color: var(--bg);
			color: var(--text);
			display: flex;
			align-items: center;
			gap: 0.5rem;
			font-size: 0.875rem;
			font-family: var(--font-mono);
			word-break: break-all;
			span {
				text-overflow: ellipsis;
				overflow: hidden;
				white-space: nowrap;
			}
		}
	}
	.svg-section {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	textarea {
		width: 100%;
		height: 130px;
		padding: 0.5rem;
		font-size: 0.8125rem;
		border-radius: 0.5rem;
		color: var(--text);
		font-family: var(--font-mono);
		border: 1px solid var(--border);
		background-color: var(--bg);
		word-break: break-all;
		white-space: normal;
		resize: none;
		transition:
			border-color 0.2s ease,
			box-shadow 0.2s ease;

		&:focus {
			outline: none;
			border-color: var(--border-mid);
			box-shadow: var(--box-shadow-ring);
		}
	}
	button.copy-svg {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		padding: 0.375rem 1rem;
		border-radius: 0.5rem;
		font-size: 0.875rem;
		color: var(--text);
		background: var(--bg-50);
		border: 1px solid var(--border);
		transition: all 0.2s;
		&:hover {
			background: var(--bg-100);
		}
	}
}
</style>
