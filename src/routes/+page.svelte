<script>
import Icon from "$lib/Icon.svelte";
import Hero from "./home/hero.svelte";
import { text } from "./text.js";
import "./style.css";

const features = [
	{
		icon: "lucide:zap",
		title: "Tree Shaking",
		description: "Only bundle icons you actually use. No bloat, no waste.",
	},
	{
		icon: "lucide:wifi-off",
		title: "Fully Offline",
		description: "No API calls, no network requests. Works everywhere, always.",
	},
	{
		icon: "lucide:package",
		title: "Iconify Icons",
		description: "Access to the Iconify collection at build time.",
	},
	{
		icon: "lucide:rocket",
		title: "1 Step Config",
		description: "Drop-in component that just works. No complex setup.",
	},
];

const showcaseIcons = [
	"lucide:heart",
	"lucide:star",
	"lucide:smile",
	"lucide:sun",
	"lucide:moon",
	"lucide:cloud",
	"mdi:fire",
	"mdi:water",
	"mdi:leaf",
	"carbon:earth",
	"carbon:lightning",
	"carbon:snow",
	"tabler:flame",
	"tabler:droplet",
	"tabler:flower",
	"fa6-solid:crown",
	"fa6-solid:gem",
	"fa6-solid:shield",
	"bi:alarm",
	"bi:battery",
];

// const iconSets = [
// 	{ name: "Lucide", count: "1,200+", prefix: "lucide" },
// 	{ name: "Material Design", count: "7,000+", prefix: "mdi" },
// 	{ name: "Font Awesome", count: "2,000+", prefix: "fa6-solid" },
// 	{ name: "Carbon", count: "2,400+", prefix: "carbon" },
// 	{ name: "Tabler", count: "5,000+", prefix: "tabler" },
// 	{ name: "Bootstrap", count: "2,000+", prefix: "bi" },
// ];
</script>

<svelte:head>
	<title>sv-iconify - Tree-shaken Iconify Icons for Svelte</title>
</svelte:head>

<main>
	<Hero />

	<!-- Features -->
	<section class="features">
		<h2>Why sv-iconify?</h2>
		<div class="features-grid">
			{#each features as feature}
				<div class="feature-card">
					<div class="feature-icon">
						<Icon icon={feature.icon} width="32" />
					</div>
					<h3>{feature.title}</h3>
					<p>{feature.description}</p>
				</div>
			{/each}
		</div>
	</section>

	<!-- Live Demo -->
	<!-- <section class="demo">
		<h2>See it in action</h2>
		<p class="section-subtitle">These icons are bundled at build time, not fetched at runtime</p>
		<div class="icon-showcase">
			{#each showcaseIcons as icon}
				<div class="icon-item">
					<Icon {icon} width="40" />
				</div>
			{/each}
		</div>
	</section> -->

	<!-- Usage Example -->
	<section class="usage">
		<h2>Usage</h2>
		<div class="code-example">
			<pre><code>{text.script}</code></pre>
		</div>
	</section>
</main>

<style>
main {
	max-width: 1200px;
	margin: 0 auto;
	padding: 2rem 1rem;
	font-family:
		system-ui,
		-apple-system,
		sans-serif;
}

/* Sections */
section {
	margin-bottom: 6rem;
}

h2 {
	font-size: clamp(2rem, 4vw, 2.5rem);
	text-align: center;
	margin-bottom: 1rem;
	font-weight: 700;
	color: #222;
}

.section-subtitle {
	text-align: center;
	color: #888;
	margin-bottom: 3rem;
	font-size: 1.1rem;
}

/* Features */
.features-grid {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
	gap: 2rem;
	margin-top: 3rem;
}

.feature-card {
	padding: 2rem;
	background: white;
	border-radius: 1rem;
	border: 1px solid #e0e0e0;
	transition: all 0.3s ease;
}

.feature-card:hover {
	transform: translateY(-4px);
	box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
	border-color: #667eea;
}

.feature-icon {
	display: inline-flex;
	padding: 0.75rem;
	background: linear-gradient(135deg, #667eea15 0%, #764ba215 100%);
	border-radius: 0.75rem;
	color: #667eea;
	margin-bottom: 1rem;
}

.feature-card h3 {
	font-size: 1.3rem;
	margin: 0 0 0.5rem;
	color: #333;
}

.feature-card p {
	color: #666;
	line-height: 1.6;
	margin: 0;
}

/* Demo */
.icon-showcase {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
	gap: 1.5rem;
	padding: 3rem;
	background: linear-gradient(135deg, #667eea08 0%, #764ba208 100%);
	border-radius: 1rem;
	border: 1px solid #e0e0e0;
}

.icon-item {
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 1.5rem;
	background: white;
	border-radius: 0.75rem;
	transition: all 0.3s ease;
	color: #667eea;
}

.icon-item:hover {
	transform: scale(1.1);
	box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
}

/* Icon Sets */
.sets-grid {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
	gap: 1rem;
}

.set-card {
	padding: 1.5rem;
	background: white;
	border: 1px solid #e0e0e0;
	border-radius: 0.75rem;
	display: flex;
	justify-content: space-between;
	align-items: center;
	transition: all 0.3s ease;
}

.set-card:hover {
	border-color: #667eea;
	box-shadow: 0 2px 8px rgba(102, 126, 234, 0.1);
}

.set-name {
	font-weight: 600;
	color: #333;
}

.set-count {
	color: #888;
	font-size: 0.9rem;
}

/* Usage */
.code-example {
	background: #1e1e1e;
	padding: 2rem;
	border-radius: 1rem;
	overflow-x: auto;
	border: 1px solid #333;
}

.code-example pre {
	margin: 0;
}

.code-example code {
	color: #d4d4d4;
	font-family: "Monaco", "Menlo", "Courier New", monospace;
	font-size: 0.95rem;
	line-height: 1.6;
}

@media (max-width: 768px) {
	section {
		margin-bottom: 4rem;
	}

	.features-grid {
		grid-template-columns: 1fr;
	}

	.icon-showcase {
		grid-template-columns: repeat(auto-fit, minmax(60px, 1fr));
		padding: 2rem;
		gap: 1rem;
	}
}
</style>
