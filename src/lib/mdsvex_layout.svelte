<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		title: string;
		date: string;
		children: Snippet;
	}

	let { title, date, children } = $props<Props>();

	const d = $derived(date?.substring(0, 10));
</script>

<svelte:head>
	<title>{title}</title>
</svelte:head>

<article>
	<header>
		<h1>{title}</h1>
		{#if d}
			<time datetime={d}>{d}</time>
		{/if}
	</header>

	{@render children()}
</article>

<style>
	header {
		text-align: center;
	}

	h1 {
		font-size: 2em;
	}
</style>
