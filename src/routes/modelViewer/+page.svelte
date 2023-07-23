<script>
	import { onMount } from 'svelte';

	onMount(async () => {
		await import('@google/model-viewer');
	});
</script>

<model-viewer
	src="/3d/eid_al-adha_cow.glb"
	alt="A 3D model of something"
	auto-rotate
	camera-controls
>
	<outline-effect color="#FFFFFF" strength={2} smoothing={1} /></model-viewer
>
