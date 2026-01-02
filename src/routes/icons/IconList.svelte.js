import { getContext, onMount, setContext, tick } from "svelte";
import { SvelteSet } from "svelte/reactivity";
import iconsets from "$lib/data/iconsets.json";

export class IconListState {
	iconsets = iconsets;
	searchValue = $state("");
	selectedIconset = new SvelteSet();
	icons = $state({});
	hasSearched = $state(false);
	selectedIcon = $state(null);
	searchError = $state(null);

	constructor() {
		onMount(() => {
			try {
				const stored = localStorage.getItem("selectedIconsets");
				if (stored) {
					const parsed = JSON.parse(stored);
					if (Array.isArray(parsed)) {
						for (const name of parsed) {
							this.selectedIconset.add(name);
						}
					}
				}
				const lastSearch = localStorage.getItem("lastSearch");
				if (lastSearch) {
					this.searchValue = lastSearch;
					this.searchIcons(lastSearch);
				}
			} catch (e) {
				//do nothing
			}
			$effect(() => {
				this.selectedIconset;
				localStorage.setItem(
					"selectedIconsets",
					JSON.stringify(Array.from(this.selectedIconset)),
				);
			});
		});
	}

	async searchIcons(query) {
		if (!query) return;

		if (this.selectedIconset.size === 0) {
			this.icons = {};
			this.searchError = "Please select at least one iconset to search.";
			return;
		}
		this.hasSearched = true;
		let iconResults = {};
		const prefixes = Array.from(this.selectedIconset).map((x) => {
			return this.iconsets.find((set) => set.name === x).prefix;
		});
		const params = {
			query: query,
			prefixes: prefixes,
		};
		const resp = await fetch(
			`https://api.iconify.design/search?` + new URLSearchParams(params),
		);
		const data = await resp.json();

		for (const prefix of prefixes) {
			const iconData = data.icons.filter((icon) => {
				return icon.startsWith(prefix + ":");
			});
			iconResults[prefix] = iconData;
		}
		//sort, if no icons found for a prefix, move it to the end
		iconResults = Object.fromEntries(
			Object.entries(iconResults).sort(([, a], [, b]) => {
				if (a.length === 0 && b.length > 0) return 1;
				if (a.length > 0 && b.length === 0) return -1;
				return 0;
			}),
		);
		this.icons = iconResults;

		console.log($state.snapshot(iconResults));
		localStorage.setItem("lastSearch", query);
	}

	selectIcon(e, icon) {
		const btn = e.target.closest("button");
		const svgElem = btn.querySelector("svg");
		const [iconSetPrefix, iconName] = icon.split(":");
		const iconSetData = this.iconsets.find((x) => x.prefix === iconSetPrefix);
		const html = svgElem.outerHTML;
		//parse as dom
		const parser = new DOMParser();
		const doc = parser.parseFromString(html, "image/svg+xml");
		const parsedSvg = doc.querySelector("svg");

		// Remove comment nodes and other unnecessary nodes
		const removeComments = (node) => {
			for (let i = node.childNodes.length - 1; i >= 0; i--) {
				const child = node.childNodes[i];
				if (child.nodeType === Node.COMMENT_NODE) {
					node.removeChild(child);
				} else if (child.nodeType === Node.ELEMENT_NODE) {
					removeComments(child);
				}
			}
		};
		removeComments(parsedSvg);

		// Set width and height attributes
		parsedSvg.setAttribute("width", "16");
		parsedSvg.setAttribute("height", "16");

		this.selectedIcon = {
			iconSetName: iconSetData.name,
			iconSetPrefix: iconSetPrefix,
			iconName: icon,
			svg: parsedSvg.outerHTML,
		};
	}

	updateIconset = {
		add: (name) => {
			this.selectedIconset.add(name);
			this.searchIcons(this.searchValue);
		},
		delete: (name) => {
			this.selectedIconset.delete(name);
			this.searchIcons(this.searchValue);
		},
	};
}

const KEY = Symbol("IconListState");

/**
 * @returns {IconListState} - A new instance of `State` which is stored in the context.
 */
export function setIconListState() {
	return setContext(KEY, new IconListState());
}

/**
 * Retrieves the current state from the context.
 * @returns {ReturnType<typeof IconListState>} - The current state.
 */
export function getIconListState() {
	return getContext(KEY);
}
