import adapter from "@sveltejs/adapter-auto";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter({}),
	},
	compilerOptions: {
		experimental: {
			async: true,
		},
	},
	vitePlugin: {
		inspector: {
			toggleKeyCombo: "alt-w",
			toggleButtonPos: "bottom-left",
			alwaysOnTop: false,
			launchEditor: "code",
		},
	},
	preprocess: vitePreprocess(),
};

export default config;
