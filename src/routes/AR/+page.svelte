<script>
	import { beforeUpdate, onMount, afterUpdate, onDestroy } from 'svelte';
	let modelViewer;

	beforeUpdate(() => {
		console.log('loading');
	});

	onMount(() => {
		console.log('activated');
	});

	onDestroy(() => {
		console.log('destroyed');
	});
</script>

<model-viewer
	bind:this={modelViewer}
	id="viewer"
	src="/3d/eid_al-adha_cow.glb"
	alt="A 3D model of something"
	loading="eager"
	reveal="auto"
	auto-rotate
	auto-rotate-delay="1000"
	rotation-per-second="5deg"
	shadow-intensity="1"
	shadow-softness="1"
	camera-controls
	camera-target="auto auto auto"
	camera-orbit="45deg 90deg 100%"
	field-of-view="auto"
	interpolation-decay="50"
	interaction-prompt="auto"
	interaction-prompt-style="wiggle"
	interaction-prompt-threshold="1000"
	touch-action="pan-y"
	orbit-sensitivity="1"
	ar
	ar-modes="webxr scene-viewer quick-look"
	ar-scale="auto"
	ar-placement="floor"
	xr-environment
>
	<button
		slot="ar-button"
		style="background-color: white; border-radius: 4px; border: none; position: absolute; top: 16px; right: 16px; "
	>
		👋 Activate AR
	</button>

	<div slot="interaction-prompt">
		<h1>click</h1>
	</div>
	<div slot="pan-target">panning</div>

	<button
		class="hotspot"
		slot="hotspot-hand"
		data-position="-0.54 0.93 0.1"
		data-normal="-0.73 0.05 0.69"
	>
		<div class="annotation">This hotspot disappears completely</div>
	</button>
</model-viewer>

<style>
	model-viewer {
		width: 100%;
		height: 500px;
	}

	model-viewer::part(default-ar-button) {
		border: 1px solid red;
	}

	model-viewer::part(default-exit-webxr-ar-button) {
		border: 1px solid red;
	}

	.hotspot {
		display: block;
		width: 20px;
		height: 20px;
		border-radius: 10px;
		border: none;
		background-color: blue;
		box-sizing: border-box;
		pointer-events: none;
	}

	.hotspot[slot='hotspot-hand'] {
		--min-hotspot-opacity: 0;
		background-color: red;
	}

	.annotation {
		background-color: #888888;
		position: absolute;
		transform: translate(10px, 10px);
		border-radius: 10px;
		padding: 10px;
	}
	:not(:defined) > * {
		display: none;
	}
</style>
