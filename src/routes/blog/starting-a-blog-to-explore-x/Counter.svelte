<script lang="ts">
	let count = $state(1);
</script>

<div>
	Wow, very interactive and {'cool'.repeat(count)}.
	<noscript>If only you had Javascript enabled!</noscript>
</div>

<button onclick={() => count++}>Increase coolness</button>

<style>
	div {
		text-align: left;
		hyphens: auto;
	}
</style>
