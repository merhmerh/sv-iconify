<script>
let { width = "632px", children } = $props();
</script>

<footer style:--width={width}>
	<div class="content">
		<p>
			Created by <a href="https://arvin.how">merhmerh </a>
		</p>
		<div class="right">
			{@render children?.()}
		</div>
	</div>
</footer>

<style lang="scss">
footer {
	display: flex;
	align-items: center;
	height: 4rem;
	background-color: color-mix(in srgb, var(--gray-100), 50% transparent);
	.content {
		width: min(var(--width), 100%);
		margin-inline: auto;
		font-size: 0.875rem;
		padding-inline: 1rem;
		color: color-mix(in srgb, var(--text), 50% transparent);
		display: flex;
		align-items: center;
		justify-content: space-between;
		@media screen and (max-width: 768px) {
			padding-inline: 1rem;
		}
	}
}
</style>
