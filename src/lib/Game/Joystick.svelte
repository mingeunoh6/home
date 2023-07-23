<script>
	import { onMount, onDestroy, afterUpdate, beforeUpdate, tick } from 'svelte';
	import { start } from 'xstate/lib/actions';
	//values
	let joystick;
	let joystickKnob;
	let joystickState = 'READY';

	let startJoystickPosition = {
		x: 0,
		y: 0
	};

	let currentJoystickPosition = {
		x: 0,
		y: 0
	};

	let endJoystickPosition = {
		x: 0,
		y: 0
	};

	let inputState = 'none';
	let deltaX = 0;
	let deltaY = 0;
	let distance = 0;
	let maxDistance;
	let angle = 0;
	let angleToDegree = 0;
	let previousAngle = null;
	let clockDirection;
	let directionGuide;

	onMount(async () => {
		console.log('onMount');

		//check there is window or not (for ssr)
		if (typeof window !== 'undefined') {
			//add screen click/touch event to the window
			window.addEventListener('mousedown', startJoystick);
			window.addEventListener('touchstart', startJoystick);

			//add joystick end event when user realeased mouse/ touch screen
			window.addEventListener('mouseup', endJoystick);
			window.addEventListener('touchend', endJoystick);
		}

		//get max distance of joystick by its width
		maxDistance = joystick.getBoundingClientRect().width / 3;
	});

	//start joystick: activated when user click/touhes the screen

	function startJoystick(event) {
		event.preventDefault();

		if (joystickState === 'READY' && inputState === 'none') {
			joystickState = 'START';
			inputState = 'mousedown/touchstart';
		}

		//check if user use mouse or touch screen
		if (event.type === 'mousedown') {
			startJoystickPosition.x = event.clientX;
			startJoystickPosition.y = event.clientY;
		} else if (event.type === 'touchstart') {
			startJoystickPosition.x = event.touches[0].clientX;
			startJoystickPosition.y = event.touches[0].clientY;
		}

		invokeJoyStick();

		//if mouse/touch moves, call moveJoystick function
		if (typeof window !== 'undefined') {
			//add joystick move event when user move mouse/ touch screen
			window.addEventListener('mousemove', moveJoystick);
			window.addEventListener('touchmove', moveJoystick);
		}
	}

	//moving joystick
	function moveJoystick(event) {
		if (inputState === 'mousedown/touchstart' && joystickState === 'START') {
			joystickState = 'MOVING';
			inputState = 'mousemove/touchmove';
		}

		if (event.type === 'mousemove') {
			currentJoystickPosition.x = event.clientX;
			currentJoystickPosition.y = event.clientY;
		} else if (event.type === 'touchmove') {
			currentJoystickPosition.x = event.touches[0].clientX;
			currentJoystickPosition.y = event.touches[0].clientY;
		}

		controlKnob();
	}

	//end joystick
	function endJoystick(event) {
		if (inputState === 'mousemove/touchmove' && joystickState === 'MOVING') {
			joystickState = 'END';
			inputState = 'mouseup/touchend';
		}

		if (event.type === 'mouseup') {
			endJoystickPosition.x = event.clientX;
			endJoystickPosition.y = event.clientY;
		} else if (event.type === 'touchend') {
			endJoystickPosition.x = event.changedTouches[0].clientX;
			endJoystickPosition.y = event.changedTouches[0].clientY;
		}

		if (typeof window !== 'undefined') {
			window.removeEventListener('mousemove', moveJoystick);
			window.removeEventListener('touchmove', moveJoystick);
		}

		//reset joystick state
		resetJoystick();
	}

	onDestroy(async () => {
		console.log('onDestroy');
		if (typeof window !== 'undefined') {
			window.removeEventListener('mousedown', startJoystick);
			window.removeEventListener('touchstart', startJoystick);
			window.removeEventListener('mousemove', moveJoystick);
			window.removeEventListener('touchmove', moveJoystick);
			window.removeEventListener('mouseup', endJoystick);
			window.removeEventListener('touchend', endJoystick);
		}
	});

	function invokeJoyStick() {
		//Move joystick to the startJoyStickPosition
		joystick.style.left = `${startJoystickPosition.x}px`;
		joystick.style.top = `${startJoystickPosition.y}px`;
	}

	function calculateDelta() {
		deltaX = currentJoystickPosition.x - startJoystickPosition.x;
		deltaY = currentJoystickPosition.y - startJoystickPosition.y;
		distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
	}

	function calculateAngle() {
		deltaX = currentJoystickPosition.x - startJoystickPosition.x;
		deltaY = currentJoystickPosition.y - startJoystickPosition.y;
		distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

		//get angle by arccosine
		// 0 < angle < Math.PI(3.14....)
		angle = Math.acos(deltaX / distance);

		//Distinction of angle by quadrant
		//Topleft
		if (deltaX < 0 && deltaY < 0) {
			directionGuide = 'NW';
			angle = -angle;
		}
		//Topright
		else if (deltaX > 0 && deltaY < 0) {
			directionGuide = 'NE';
			angle = -angle;
		}
		//Bottomleft
		else if (deltaX < 0 && deltaY > 0) {
			directionGuide = 'SW';
			angle = angle;
		}
		//Bottomright
		else if (deltaX > 0 && deltaY > 0) {
			directionGuide = 'SE';
			angle = angle;
		}
		//Top
		else if (deltaX === 0 && deltaY < 0) {
			directionGuide = 'N';
			angle = -angle;
		}
		//Bottom
		else if (deltaX === 0 && deltaY > 0) {
			directionGuide = 'S';
			angle = angle;
		}
		//Left
		else if (deltaX < 0 && deltaY === 0) {
			directionGuide = 'W';
			angle = angle;
		}
		//Right
		else if (deltaX > 0 && deltaY === 0) {
			directionGuide = 'E';
			angle = angle;
		}

		angleToDegree = angle * (180 / Math.PI);
		getCurrentRotationDirection();
	}

	function controlKnob() {
		if (inputState === 'mousemove/touchmove' && joystickState === 'MOVING') {
			calculateDelta();
			calculateAngle();

			if (distance > maxDistance) {
				joystickKnob.style.transform = `translate3D(${maxDistance * Math.cos(angle)}px, ${
					maxDistance * Math.sin(angle)
				}px, 0)`;
			} else {
				//move joystick knob
				joystickKnob.style.transform = `translate3D(${deltaX}px, ${deltaY}px, 0)`;
			}
		} else {
			//not moving
			joystickKnob.style.transform = `translate3D(0px, 0px, 0)`;
		}
	}

	const getCurrentRotationDirection = () => {
		if (inputState === 'mousemove/touchmove' && joystickState === 'MOVING') {
			let currentAngle = angleToDegree;

			if (previousAngle !== null) {
				if (previousAngle < currentAngle) {
					clockDirection = 'clockwise';
				} else if (previousAngle > currentAngle) {
					clockDirection = 'counterclockwise';
				}
			}

			//Update previous angle
			previousAngle = currentAngle;
			requestAnimationFrame(getCurrentRotationDirection);
		} else {
			previousAngle = null;
			clockDirection = 'null';
		}
	};

	function resetJoystick() {
		joystickState = 'READY';
		inputState = 'none';
		deltaX = 0;
		deltaY = 0;
		distance = 0;
		angle = 0;
		angleToDegree = 0;

		controlKnob();
	}
</script>

<div>
	<div id="dataGUI">
		<h1>joystick</h1>
		<p>mouse/touch: {inputState}</p>
		<p>state: {joystickState}</p>
		<p>startX: {startJoystickPosition.x}, startY: {startJoystickPosition.y}</p>
		<p>currentX: {currentJoystickPosition.x}, currentY: {currentJoystickPosition.y}</p>
		<p>endX:{endJoystickPosition.x}, endY:{endJoystickPosition.y}</p>

		<h1>calculation</h1>
		<p>deltaX: {deltaX}, deltaY: {deltaY}</p>
		<p>maxDistance: {maxDistance}</p>
		<p>Current distance: {distance}</p>
		<p>angle: {angle}</p>
		<p>angleToDegree: {angleToDegree}</p>
		<h1>Direction</h1>
		<p>Direction: {directionGuide}</p>
		<p>clockDirection: {clockDirection}</p>
	</div>
</div>

<div id="joystick" bind:this={joystick}>
	<div class="compassUi">
		<div id="N"><span>N</span></div>
		<div id="S"><span>S</span></div>
		<div id="E"><span>E</span></div>
		<div id="W"><span>W</span></div>
	</div>
	<div id="joystick-knob" bind:this={joystickKnob} />
</div>

<style>
	#dataGUI {
		position: absolute;
		top: 10px;
		left: 10px;
		background-color: rgba(0, 0, 0, 0.5);
		padding: 10px;
		color: white;
		pointer-events: none;

		& h1 {
			position: relative;
			color: white;
			&::after {
				position: absolute;
				top: 0;
				left: 0;
				content: '';
				width: 100%;
				height: 100%;
				border-bottom: 1px solid white;
			}
		}

		& p {
			margin: 10px;
		}
	}

	#joystick {
		position: absolute;
		width: 120px;
		height: 120px;
		border-radius: 50%;
		background-color: rgba(0, 0, 0, 0.5);
		top: 80%;
		left: 80%;
		transform: translateX(-50%) translateY(-50%);
		display: flex;
		justify-content: center;
		align-items: center;

		transition: all 0.1s ease-in-out;
		z-index: 9999;
	}

	#joystick-knob {
		position: absolute;
		width: 80px;
		height: 80px;

		background-color: rgba(0, 0, 0, 0.5);

		border-radius: 50%;
		cursor: pointer;
	}

	.compassUi {
		position: absolute;
		box-sizing: border-box;
		border: 1px solid red;
		width: 180px;
		height: 180px;
		border-radius: 50%;

		&& #N {
			position: absolute;
			padding: 4px;
			top: 0;
			left: 50%;
			transform: translateX(-50%);
			color: red;
		}
		&& #S {
			position: absolute;
			padding: 4px;
			bottom: 0;
			left: 50%;
			transform: translateX(-50%);
			color: rgb(76, 0, 255);
		}
		&& #E {
			position: absolute;
			padding: 4px;
			top: 50%;
			right: 0;
			transform: translateY(-50%);
			color: rgb(5, 59, 52);
		}
		&& #W {
			position: absolute;
			padding: 4px;
			top: 50%;
			left: 0;
			transform: translateY(-50%);
			color: rgb(255, 25, 160);
		}
	}
</style>
