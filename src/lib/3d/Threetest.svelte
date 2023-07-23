<script>
	import { browser } from '$app/environment';
	import { cameraTargetIntrinsics } from '@google/model-viewer/lib/features/controls';
	import { onMount, onDestroy, beforeUpdate, afterUpdate, tick } from 'svelte';
	import * as THREE from 'three';

	let scene, camera, renderer, controls, geometry, material, mesh;

	onMount(async () => {
		console.log('onMount');
		let canvas = document.querySelector('#canvas');
		console.log(canvas?.style.width, canvas?.style.height);

		scene = new THREE.Scene();
		camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

		renderer = new THREE.WebGLRenderer({
			antialias: true,
			alpha: true,
			canvas: canvas
		});
		renderer.setSize(window.innerWidth, window.innerHeight);

		geometry = new THREE.BoxGeometry(1, 1, 1);
		material = new THREE.MeshBasicMaterial({ color: 0xffffff });
		mesh = new THREE.Mesh(geometry, material);
		scene.add(mesh);

		//camera position
		camera.position.z = 5;

		let light = new THREE.AmbientLight(0xffffff, 0.5);
		scene.add(light);

		renderer.render(scene, camera);

		animate();
	});

	beforeUpdate(async () => {
		console.log('beforeUpdate');
	});

	afterUpdate(async () => {
		console.log('afterUpdate');
		console.log(canvas?.style.width, canvas?.style.height);
	});

	onDestroy(async () => {
		console.log('onDestroy');
	});

	//resize
	window.addEventListener('resize', onWindowResize, false);

	function onWindowResize() {
		camera.aspect = window.clientWidth / window.clientHeight;
		camera.updateProjectionMatrix();

		renderer.setSize(window.innerWidth, window.innerHeight);
	}

	function animate() {
		requestAnimationFrame(animate);

		mesh.rotation.x += 0.01;
		mesh.rotation.y += 0.01;

		renderer.render(scene, camera);
	}

	console.log('plain-last');
</script>

<div id="container"><canvas id="canvas" /></div>

<style>
	#container {
		position: relative;
		border: 1px solid red;
		width: 100%;
		height: 100%;
	}

	canvas {
		width: 100%;
		height: 100%;
	}
</style>
