// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

declare module "virtual:iconify-bundle" {
	type IconifyJSON = {
		icons?: Record<string, { body: string }>;
		aliases?: Record<string, { parent: string }>;
	};
	const bundle: Record<string, IconifyJSON>;
	export default bundle;
}

export {};
