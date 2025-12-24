import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";
import { svIconify } from "./src/lib/build/vite-plugin.js";

export default defineConfig({
	plugins: [svIconify(), sveltekit()],
	server: {
		host: true,
	},
});
