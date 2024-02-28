<script>
	import '$lib/shiki.css';

	let { children } = $props();
</script>

<nav>
	<a class="alt" href="/">Adrian Göransson</a>
	<a class="alt" href="/blog">Blog</a>
</nav>

{@render children()}

<style>
	nav {
		margin-top: 5px;
		display: flex;
		justify-content: space-between;
	}

	a {
		font-size: 1.2em;
	}
</style>
