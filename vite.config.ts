import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";
import { iconifyStatic } from "./src/lib/build/vite-plugin.js";

export default defineConfig({
	plugins: [iconifyStatic(), sveltekit()],
	server: {
		host: true,
	},
});
