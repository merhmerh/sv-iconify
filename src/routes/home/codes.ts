export const codes = {
	script: `<script>
  import Icon from 'sv-iconify';
</script>

<Icon icon="lucide:heart" width="24" />
<Icon icon="mdi:home" width="32" color="blue" />`,
	vitePlugin: `import { defineConfig } from "vite";
import { sveltekit } from "@sveltejs/kit/vite";
import { svIconify } from "sv-iconify/vite";

export default defineConfig({
	plugins: [
		svIconify(), // Required
		sveltekit(),
	],
});`,
	vitePluginConfig: `import { defineConfig } from "vite";
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
});`,

	basicUsage: `<!-- Basic usage -->
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
<Icon icon="mdi:arrow-left" vFlip />`,
};
