<script>
	import { onMount, onDestroy, afterUpdate, beforeUpdate, tick } from 'svelte';
	import Joystick from '$lib/Game/Joystick.svelte';
</script>

<main>
	<Joystick />
</main>

<style>
	main {
		overflow: hidden;
		width: 100%;
		height: 100%;
	}
</style>
