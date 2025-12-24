# sv-iconify

A Svelte icon component library with static bundling support. Only bundles the icons you actually use in your app.

## Installation

```bash
npm install sv-iconify -D
# or
pnpm add sv-iconify -D
```

## Setup

Add the Vite plugin to your `vite.config.ts`:

```typescript
import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";
import { iconifyStatic } from "sv-iconify";

export default defineConfig({
	plugins: [
		iconifyStatic(), // Add this plugin
		sveltekit(),
	],
});
```

## Usage

Import and use the `Icon` component in your Svelte files:

```js
<script>
import { Icon } from "sv-iconify";
</script>

<Icon icon="mdi:home" />
<Icon icon="carbon:user-avatar" width={32} height={32} />
<Icon icon="lucide:settings" color="blue" />
```

## Icon Props

- `icon` (string, required): Icon name in format `set:name` (e.g., `"mdi:home"`, `"carbon:user"`)
- `width` (number | string): Icon width (default: `16`)
- `height` (number | string): Icon height (default: `16`)
- `color` (string): Icon color (default: `"inherit"`)
- `strokeWidth` (number): Stroke width for stroke-based icons
- `rotate` (string | number): Rotation angle (e.g., `"90deg"`, `90`)
- `hFlip` (boolean): Flip horizontally
- `vFlip` (boolean): Flip vertically
- `style` (string): Additional CSS styles

## Examples

```svelte
<!-- Basic usage -->
<Icon icon="mdi:home" />

<!-- Custom size -->
<Icon icon="carbon:user" width={24} height={24} />

<!-- Custom color -->
<Icon icon="lucide:heart" color="red" />

<!-- Rotation -->
<Icon icon="mdi:arrow-right" rotate="90deg" />

<!-- Flip -->
<Icon icon="mdi:arrow-left" hFlip />

<!-- Combined props -->
<Icon icon="carbon:settings" width={32} color="blue" rotate={45} />
```

## How It Works

1. During development, icons are loaded dynamically from individual JSON files
2. During build, the plugin scans your code for icon usage
3. Only the icons you use are bundled into your final app
4. Icons are inlined as a virtual module for optimal performance

## License

MIT
