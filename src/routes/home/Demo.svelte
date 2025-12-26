<script>
import Icon from "$lib/Icon.svelte";
import Code from "./Code.svelte";
import { getThemeState } from "./theme.svelte.js";
const t = getThemeState();
const iconList = [
	{ name: "Package", value: "lucide:package" },
	{ name: "Heart", value: "lucide:heart" },
	{ name: "Star", value: "lucide:star" },
	{ name: "Moon", value: "ic:outline-nightlight" },
	{ name: "Rocket", value: "solar:rocket-linear" },
	{ name: "Edit", value: "iconamoon:edit" },
	{ name: "Loader", value: "svg-spinners:3-dots-bounce" },
	{ name: "Bug", value: "jam:bug" },
	{ name: "Bird", value: "hugeicons:angry-bird" },
	{ name: "VS Code", value: "vscode-icons:file-type-vscode" },
];

let demo = $state({
	icon: "lucide:package",
	width: 80,
	hue: 128,
	strokeWidth: 20,
	rotate: 0,
	hFlip: false,
	vFlip: false,
	style: "overflow:unset",
});
const iconProps = $derived.by(() => {
	const saturation = t.theme === "light" ? "25%" : "75%";
	const lightness = t.theme === "light" ? "50%" : "75%";

	const color = `hsl(${demo.hue}, ${saturation}, ${lightness})`;
	const strokeWidth = demo.strokeWidth / 10;
	const rotate = demo.rotate;
	return {
		width: demo.width,
		strokeWidth,
		color,
		rotate,
		hFlip: demo.hFlip,
		vFlip: demo.vFlip,
		style: demo.style,
	};
});

const generatedCode = $derived.by(() => {
	let props = [`icon="${demo.icon}"`];

	if (demo.width !== 80) props.push(`width={${demo.width}}`);
	if (iconProps.color !== "hsl(0, 25%, 50%)" && iconProps.color !== "hsl(0, 75%, 50%)") {
		props.push(`color="${iconProps.color}"`);
	}
	if (iconProps.strokeWidth !== 2) props.push(`strokeWidth={${iconProps.strokeWidth}}`);
	if (demo.rotate !== 0) props.push(`rotate={${demo.rotate}}`);
	if (demo.hFlip) props.push(`hFlip={true}`);
	if (demo.vFlip) props.push(`vFlip={true}`);
	if (demo.style) props.push(`style="${demo.style}"`);
	return `<Icon ${props.join(" ")} />`;
});
</script>

<section>
	<h3 id="demo">Demo</h3>
	<div class="demo">
		<div class="icon">
			<Icon
				icon={demo.icon}
				width={iconProps.width}
				color={iconProps.color}
				rotate={iconProps.rotate}
				hFlip={iconProps.hFlip}
				vFlip={iconProps.vFlip}
				strokeWidth={iconProps.strokeWidth}
				style={iconProps.style} />
		</div>
		<div class="config">
			<div class="field toggle-field">
				<label for="icon">Icon</label>
				<select id="icon" class="select-input" bind:value={demo.icon}>
					{#each iconList as iconOption}
						<option value={iconOption.value}>
							{iconOption.name} - {iconOption.value}
						</option>
					{/each}
				</select>
			</div>

			<div class="field">
				<label for="width">Width</label>
				<div class="input-group">
					<input
						id="width"
						type="range"
						min="8"
						max="120"
						bind:value={demo.width}
						ondblclick={() => {
							demo.width = 80;
						}} />
					<span class="value">{demo.width}px</span>
				</div>
			</div>

			<div class="field">
				<label for="color">Color</label>
				<div class="input-group">
					<input
						id="color"
						type="range"
						min="0"
						max="255"
						bind:value={demo.hue}
						ondblclick={() => {
							demo.hue = 128;
						}} />
					<span class="value">{demo.hue}°</span>
				</div>
			</div>

			<div class="field">
				<label for="stroke">Stroke Width</label>
				<div class="input-group">
					<input
						id="stroke"
						type="range"
						min="0"
						max="100"
						bind:value={demo.strokeWidth}
						ondblclick={() => {
							demo.strokeWidth = 20;
						}} />
					<span class="value">{demo.strokeWidth / 10}</span>
				</div>
			</div>

			<div class="field">
				<label for="rotate">Rotate</label>
				<div class="input-group">
					<input
						id="rotate"
						type="range"
						min={-360}
						max="360"
						bind:value={demo.rotate}
						ondblclick={() => {
							demo.rotate = 0;
						}} />
					<span class="value">{demo.rotate}°</span>
				</div>
			</div>

			<div class="field toggle-field">
				<label for="hflip">Horizontal flip</label>
				<label class="toggle">
					<input id="hflip" type="checkbox" bind:checked={demo.hFlip} />
					<span class="slider"></span>
				</label>
			</div>

			<div class="field toggle-field">
				<label for="vflip">Vertical flip</label>
				<label class="toggle">
					<input id="vflip" type="checkbox" bind:checked={demo.vFlip} />
					<span class="slider"></span>
				</label>
			</div>

			<div class="field toggle-field">
				<label for="styles">Styles</label>
				<input
					spellcheck="false"
					placeholder="margin-left:4px;"
					id="styles"
					class="text-input"
					type="text"
					bind:value={demo.style} />
			</div>
		</div>
		<div class="code-output">
			<Code code={generatedCode} lang="svelte" />
		</div>
	</div>
</section>

<style lang="scss">
.demo {
	display: flex;
	gap: 2rem;
	flex-wrap: wrap;
	align-items: flex-start;
	padding: 1rem;
	background-color: var(--code-bg);
	border-radius: 1rem;
	border: 1px solid var(--border);

	.icon {
		border-radius: 1rem;
		display: flex;
		justify-content: center;
		align-items: center;
		width: 140px;
		height: 140px;
		border: 1px solid var(--border);
		transition:
			all 0.3s ease,
			border-color 0 ease;
	}

	.config {
		flex: 1;
		min-width: 280px;
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
	}

	.field {
		display: flex;
		flex-direction: column;
		// align-items: center;
		// justify-content: space-between;
		font-family: var(--font-sans-serif);
		font-size: 1rem;
		gap: 0.5rem;

		&.toggle-field {
			gap: 1rem;
			flex-direction: row;
			justify-content: space-between;
			align-items: center;
		}

		label {
			color: var(--primary);
			font-weight: 500;
		}

		.input-group {
			display: flex;
			align-items: center;
			gap: 0.75rem;

			.value {
				min-width: 3rem;
				text-align: right;
				font-family: var(--font-mono);
				font-size: 0.875rem;
				color: var(--text);
				background: var(--gray-100);
				padding: 0.25rem 0.5rem;
				border-radius: 0.25rem;
			}
		}

		input[type="range"] {
			flex: 1;
			height: 6px;
			border-radius: 3px;
			background: var(--gray-100);
			outline: none;
			-webkit-appearance: none;

			&::-webkit-slider-thumb {
				-webkit-appearance: none;
				appearance: none;
				width: 18px;
				height: 18px;
				border-radius: 50%;
				background: var(--accent);
				cursor: pointer;
				transition: all 0.2s ease;
				box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);

				&:hover {
					transform: scale(1.2);
					box-shadow: 0 2px 8px rgba(79, 70, 229, 0.4);
				}
			}

			&::-moz-range-thumb {
				width: 18px;
				height: 18px;
				border-radius: 50%;
				background: var(--accent);
				cursor: pointer;
				border: none;
				transition: all 0.2s ease;
				box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);

				&:hover {
					transform: scale(1.2);
					box-shadow: 0 2px 8px rgba(79, 70, 229, 0.4);
				}
			}
		}

		.text-input,
		.select-input {
			width: 100%;
			padding: 0.5rem 0.75rem;
			border: 1px solid var(--border);
			border-radius: 0.5rem;
			background: var(--gray-50);
			color: var(--text);
			font-size: 1rem;
			transition:
				all 0.2s ease,
				background-color 0s,
				color 0s;
			&:focus {
				outline: none;
				border-color: var(--accent);
				box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
			}
		}

		.select-input {
			cursor: pointer;
			width: 100%;
			background-color: var(--bg-100);
			&:hover {
				border-color: var(--accent);
			}
		}
	}

	// Toggle Switch
	.toggle {
		position: relative;
		display: inline-block;
		width: 48px;
		height: 26px;
		margin: 0;

		input {
			opacity: 0;
			width: 0;
			height: 0;

			&:checked + .slider {
				background-color: var(--accent);
			}

			&:checked + .slider:before {
				transform: translateX(22px);
			}

			&:focus + .slider {
				box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.2);
			}
		}

		.slider {
			position: absolute;
			cursor: pointer;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			background-color: var(--gray-500);
			transition: all 0.3s ease;
			border-radius: 26px;

			&:before {
				position: absolute;
				content: "";
				height: 20px;
				width: 20px;
				left: 3px;
				bottom: 3px;
				background-color: white;
				transition: all 0.3s ease;
				border-radius: 50%;
				box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
			}
		}
	}
	.code-output {
		width: 100%;
		& :global {
			.code-wrapper {
				margin: 0;
			}
		}
	}
}
</style>
