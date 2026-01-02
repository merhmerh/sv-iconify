import { getContext, onMount, setContext } from "svelte";

export class ThemeState {
	theme = $state("light dark");

	constructor() {
		onMount(() => {
			this.initTheme();
		});
	}

	initTheme() {
		const ls = localStorage.getItem("theme");
		if (ls) {
			try {
				this.theme = ls;
			} catch (e) {
				console.log("Failed to parse theme data from localStorage", e.message);
				this.setDefaultTheme();
			}
		} else {
			this.setDefaultTheme();
		}
		this.update();
	}

	setDefaultTheme() {
		const prefersDark =
			window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
		this.theme = prefersDark ? "dark" : "light";
	}

	switchTheme() {
		this.theme = this.theme === "light" ? "dark" : "light";
		this.update();
	}

	async update() {
		this.setTheme(this.theme);
		localStorage.setItem("theme", this.theme);
	}

	setTheme(theme) {
		//set transition to none to avoid flickering
		const css = document.createElement("style");
		css.textContent = "* { transition: none !important; }";
		document.head.appendChild(css);

		document.documentElement.setAttribute("data-theme", theme);
		document.documentElement.style.colorScheme = theme;

		//reset transition
		void document.body.offsetHeight; // Force reflow
		document.head.removeChild(css);
	}
}

const KEY = Symbol("ThemeState");

/**
 * @returns {ThemeState} - A new instance of `State` which is stored in the context.
 */
export function setThemeState() {
	return setContext(KEY, new ThemeState());
}

/**
 * Retrieves the current state from the context.
 * @returns {ReturnType<typeof ThemeState>} - The current state.
 */
export function getThemeState() {
	return getContext(KEY);
}
