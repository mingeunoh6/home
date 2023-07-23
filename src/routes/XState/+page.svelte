<script>
	import { onMount, onDestroy, afterUpdate, beforeUpdate, tick } from 'svelte';
	import Counter from '$lib/XStateTester/Counter.svelte';

	onMount(async () => {
		console.log('onMount');
	});

	beforeUpdate(async () => {
		console.log('beforeUpdate');
	});

	afterUpdate(async () => {
		console.log('afterUpdate');
	});

	onDestroy(async () => {
		console.log('onDestroy');
	});
</script>

<main>
	<h1>XState machine tester</h1>
	<Counter />
</main>

<style>
</style>
