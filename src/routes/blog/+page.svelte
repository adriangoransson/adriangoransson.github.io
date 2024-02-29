<script lang="ts">
	import { page } from '$app/stores';

	let { data } = $props();
</script>

<svelte:head>
	<title>Blog | Adrian Göransson</title>
</svelte:head>

<main>
	<header>
		<h1>Blog posts</h1>
	</header>

	{#each data.posts as post}
		<a class="alt" href={`${$page.route.id}/${post.path}`}>
			<span>
				{post.title}
			</span>
			{#if post.date}
				<span>
					{post.date.substring(0, 10)}
				</span>
			{/if}
		</a>
	{/each}
</main>

<style>
	header {
		margin: 25px auto;
	}

	a {
		display: flex;
		justify-content: space-between;
		padding: 5px;
	}

	a span:nth-child(2) {
		flex-shrink: 0;
	}

	main {
		margin-bottom: 50px;
	}
</style>
