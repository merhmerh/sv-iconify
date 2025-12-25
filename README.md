# sv-iconify

A Svelte icon component library with static bundling support. Only bundles the icons you actually use in your app.

# THIS PACKAGE IS WIP AND IS NOT READY FOR PRODUCTION USE YET.

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
import { svIconify } from "sv-iconify/vite";

export default defineConfig({
	plugins: [
		svIconify(), // Required - scans your code and bundles icons
		sveltekit(),
	],
});
```

**The plugin is required** for icons to work. It scans your code for icon usage and creates a bundle containing only the icons you use.

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

The plugin scans your code for icon usage (e.g., `icon="mdi:home"`) and creates an optimized bundle:

- **Development mode:** Bundle includes all icons you use, rebuilt on file changes
- **Production mode:** Bundle includes only the icons you use, optimized for size

This ensures fast development iteration and optimal production bundles.

## Troubleshooting

### Icons not showing

Make sure you've added the `svIconify()` plugin to your `vite.config.ts`. Check the browser console for error messages.

## License

MIT
