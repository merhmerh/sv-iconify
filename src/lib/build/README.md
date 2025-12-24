# Icon Bundle Optimization

This directory contains the build-time optimization system that extracts only the icons used in your project.

## How it works

### Development Mode

In development, icons are loaded dynamically from individual JSON files in `data/json/`. This allows for fast hot-reloading and easy development.

### Production Mode

During the build process:

1. **Icon Extraction** (`icon-extractor.ts`):
    - Scans all `.svelte`, `.ts`, and `.js` files in the `src` directory
    - Finds icon references matching the pattern `"prefix:name"` (e.g., `"lucide:apple"`)
    - Creates a list of all unique icons used in the project

2. **Bundle Generation** (`bundle-generator.ts`):
    - Loads the full icon set JSON files for each icon set used
    - Extracts only the icons that are actually referenced in your code
    - Handles icon aliases automatically
    - Creates a single optimized `icons-bundle.json` file

3. **Vite Plugin** (`vite-plugin.ts`):
    - Integrates the extraction and bundling process into the Vite build pipeline
    - Runs automatically during `vite build`
    - Logs statistics about the optimization

4. **Production Loader** (`../Loader.svelte.ts`):
    - In production, loads icons from the optimized bundle instead of individual JSON files
    - Lazy loads the bundle on first icon request
    - Caches the bundle for subsequent requests

## Benefits

- **Smaller Bundle Size**: Only icons you use are included in production
- **Offline Support**: All icons are bundled at build time
- **Fast Loading**: Single JSON file instead of multiple HTTP requests
- **Type Safety**: TypeScript support throughout

## Usage

Just use icons normally in your code:

\`\`\`svelte
<Icon icon="lucide:apple" />
<Icon icon="mdi:home" />
\`\`\`

The build system automatically detects these references and optimizes the bundle.

## Configuration

You can customize the plugin in `vite.config.ts`:

\`\`\`typescript
iconifyStatic({
sourceDir: "src/lib/data/json", // Where full icon sets are stored
outputPath: "src/lib/data/icons-bundle.json", // Where to write the bundle
scanDir: "src", // Directory to scan for icon usage
})
\`\`\`
