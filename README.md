# sv-iconify

<div align="center">
<img src="https://raw.githubusercontent.com/merhmerh/sv-iconify/refs/heads/main/static/main.png" height="300" />
</div>

[![npm version](https://img.shields.io/npm/v/sv-iconify?style=flat-square)](https://www.npmjs.com/package/sv-iconify)
[![license](https://img.shields.io/npm/l/sv-iconify?style=flat-square)](https://github.com/merhmerh/sv-iconify/blob/main/LICENSE)

A Tree-shakeable Iconify component for Svelte

Access all [Iconify](https://iconify.design/) icons in your SvelteKit project. Only bundling the icons you use for optimal performance.

## Limitations

- Emojis iconsets is not available due to their large size.

## Installation

```bash
npm install sv-iconify -D
# or
pnpm add sv-iconify -D
```

## Setup

Add the Vite plugin to your `vite.config.ts`:

```js
import { defineConfig } from "vite";
import { sveltekit } from "@sveltejs/kit/vite";
import { svIconify } from "sv-iconify/vite";

export default defineConfig({
	plugins: [
		svIconify(), // Required - scans your code and bundles icons
		sveltekit(),
	],
});
```

**The plugin is required** for icons to work. It scans your code for icon usage and creates a bundle containing only the icons you use.

see below section for configuration options.

## Basic Usage

Import and use the `Icon` component in your Svelte files:

```js
<script>
import { Icon } from "sv-iconify";
</script>

<Icon icon="mdi:home" />
<Icon icon="carbon:user-avatar" width={32} />
<Icon icon="lucide:settings" color="blue" />
```

## Icon Props

| Property      | Type             | Description                                                              | Default      |
| ------------- | ---------------- | ------------------------------------------------------------------------ | ------------ |
| `icon`        | string           | Icon name in format `iconset:name` (e.g., `"mdi:home"`, `"carbon:user"`) | — (required) |
| `width`       | number \| string | Icon width                                                               | `16`         |
| `height`      | number \| string | Icon height                                                              | `16`         |
| `color`       | string           | Icon color                                                               | `"inherit"`  |
| `strokeWidth` | number           | Stroke width for stroke-based icons                                      | —            |
| `rotate`      | string \| number | Rotation angle (e.g., `"90deg"`, `90`)                                   | `0`          |
| `hFlip`       | boolean          | Flip horizontally                                                        | `false`      |
| `vFlip`       | boolean          | Flip vertically                                                          | `false`      |
| `style`       | string           | Additional CSS styles                                                    | —            |

## Examples

```html
<!-- Basic usage -->
<Icon icon="mdi:home" />

<!-- Custom size -->
<Icon icon="carbon:user" width="{24}" />
<Icon icon="carbon:user" width="1rem" />
<Icon icon="carbon:user" width="24" />

<!-- Custom color -->
<Icon icon="lucide:heart" color="red" />
<Icon icon="lucide:heart" color="var(--red-600)" />

<!-- Rotation -->
<Icon icon="mdi:arrow-right" rotate="90deg" />

<!-- Flip -->
<Icon icon="mdi:arrow-left" hFlip />
<Icon icon="mdi:arrow-left" vFlip />
```

## How It Works

The plugin scans your code for icon usage (e.g., `icon="mdi:home"`) and creates an optimized bundle:

- **Development mode:** This library contains all icons and serves them on demand
- **Production mode:** Bundle includes only the icons you use, optimized for size

## Configuration

The Vite plugin can be configured with the following options:

- **`sourceDir`** (`string`)
    - Path to the directory containing icon JSON files.
    - Default: Auto-detect from `node_modules` - _node_modules/sv-iconify/dist/data/json_

- **`outputPath`** (`string`)
    - Output path for the generated icon bundle (production builds only).
    - Default: `'static/_sv-iconify/icons-bundle.json'`.

- **`scanDir`** (`string`)
    - Directory to scan for icon usage in your source files.
    - Default: `'src'`.

- **`includes`** (`object`)
    - Configuration for force-including icons or icon sets.
    - **Use case:** Use this to force include icon sets that cannot be found by the static scanner. This is essential when icon names are dynamic, such as those loaded from a database or API at runtime.
    - **`includes.iconSets`** (`string[]`)
        - List of icon set prefixes to include entirely (e.g., `['lucide', 'tabler']`).
    - **`includes.icons`** (`string[]`)
        - Specific icons to include (e.g., `['lucide:home', 'tabler:package']`).

### Configuration Example

```js
import { defineConfig } from "vite";
import { sveltekit } from "@sveltejs/kit/vite";
import { svIconify } from "sv-iconify/vite";

export default defineConfig({
	plugins: [
		svIconify({
			sourceDir: "./custom-icons",
			outputPath: "static/icons/icons-bundle.json",
			scanDir: "src",
			includes: {
				iconSets: ["mdi", "carbon"],
				icons: ["lucide:home", "tabler:package"],
			},
		}),
		sveltekit(),
	],
});
```

## License

MIT
