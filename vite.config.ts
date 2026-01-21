import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";
import { svIconify } from "./src/lib/build/vite-plugin.js";

export default defineConfig({
	plugins: [
		svIconify({
			includes: {
				iconSets: ["lucide"],
				icons: [],
			},
		}),
		sveltekit(),
	],
	server: {
		host: true,
	},
	build: {
		minify: false,
		sourcemap: true,
	},
});
