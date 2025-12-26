<script>
import Code from "./Code.svelte";
import { codes } from "./codes.ts";
</script>

<section>
	<h3>Bundling Config</h3>
	<p>
		To ensure tree-shaking works correctly, make sure to add the svIconify vite plugin to your
		vite config. You can pass options to customize the behavior.
	</p>
	<Code code={codes.vitePluginConfig} file="vite.config.js" lang="js" />

	<ul class="config-list">
		<li>
			<strong>sourceDir</strong> - <span class="type">(string)</span><br />
			Path to the directory containing icon JSON files.<br />
			<em>Default: 'node_modules/sv-iconify/dist/data/json'</em>
		</li>
		<li>
			<strong>outputPath</strong> - <span class="type">(string)</span><br />
			Output path for the generated icon bundle (production builds only).<br />
			<em>Default: 'static/_sv-iconify/icons-bundle.json'</em>
		</li>
		<li>
			<strong>scanDir</strong> - <span class="type">(string)</span><br />
			Directory to scan for icon usage in your source files.<br />
			<em>Default: 'src'</em>
		</li>
		<li>
			<strong>includes</strong> - <span class="type">(object)</span><br />
			Configuration for force-including icons or icon sets.<br />
			Use this to force include icon sets that cannot be automatically detected. This is essential
			when icon names are dynamic, such as those loaded from a database or API at runtime.
			<ul class="nested-list">
				<li>
					<strong>includes.iconSets</strong> - <span class="type">(string[])</span><br />
					List of icon set prefixes to include entirely <br />
					<em>e.g., ['lucide', 'tabler']</em>
				</li>
				<li>
					<strong>includes.icons</strong> - <span class="type">(string[])</span><br />
					Specific icons to include.<br />
					<em>e.g., ['lucide:home', 'tabler:package']</em>
				</li>
			</ul>
		</li>
	</ul>
</section>

<style lang="scss">
.config-list {
	margin-top: 1.5rem;
	line-height: 1.8;

	li {
		list-style: none;
		margin-left: -2.5rem;
		margin-bottom: 1.5rem;

		strong {
			color: var(--accent);
			font-weight: 600;
		}

		.type {
			color: var(--gray-500);
			font-size: 0.9rem;
		}

		em {
			color: var(--gray-500);
			font-style: italic;
		}
	}

	.nested-list {
		margin-top: 0.75rem;
		margin-left: 1.5rem;

		li {
			list-style-type: square;
			margin-bottom: 1rem;
		}
	}
}
</style>
