import * as THREE from 'three';

//create a new Three.js scene
const scene = new THREE.Scene();

//render the scene
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
