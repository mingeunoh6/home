<script lang="ts">
	import { createMachine, assign } from 'xstate';
	import { useMachine } from '@xstate/svelte';

	const enum States {
		READY = 'READY',
		START = 'START',
		MOVE = 'MOVE',
		END = 'END'
	}

	const enum Events {
		StartJoystick = 'StartJoystick',
		InvokeJoyStick = 'InvokeJoyStick',
		MoveJoystick = 'MoveJoystick',
		EndJoystick = 'EndJoystick',
		CalculateDelta = 'CalculateDelta',
		CalculateAngle = 'CalculateAngle',
		ControlKnob = 'ControlKnob',
		GetCurrentRotationDirection = 'GetCurrentRotationDirection',
		ResetJoyStick = 'ResetJoyStick'
	}

	const increment = (ctx) => (ctx.count += 1);
	const decrement = (ctx) => (ctx.count -= 1);

	const joystickMachine = createMachine({
		initial: States.READY,
		context: {
			inputState: 'none',
			deltaX: 0,
			deltaY: 0,
			distance: 0,
			maxDistance: 0,
			angle: 0,
			angleToDegree: 0,
			previousAngle: null,
			clockDirection: 'null',
			directionGuide: 'null'
		},
		states: {
			[States.READY]: {
				on: {
					[Events.StartJoystick]: {
						actions: assign({ count: increment }),
						cond: (ctx) => ctx.inputState === 'none'
					},
					[Events.Decrement]: {
						actions: assign({ count: decrement }),
						cond: (ctx) => ctx.count > 0
					},
					[Events.ToggleEnabled]: States.Disabled
				}
			},
			[States.START]: {
				on: {
					[Events.ToggleEnabled]: States.Enabled
				}
			},
			[States.MOVE]: {
				on: {
					[Events.ToggleEnabled]: States.Enabled
				}
			},
			[States.END]: {
				on: {
					[Events.ToggleEnabled]: States.Enabled
				}
			}
		}
	});

	const { state, send } = useMachine(counterMachine);
</script>

<p>The counter is {$state.value === States.Enabled ? 'enabled' : 'disabled'}</p>
<p>Count: {$state.context.count}</p>
<button on:click={() => send(Events.ToggleEnabled)}> Enabled/Disabled </button>
<button on:click={() => send(Events.Increment)}> Increment </button>

<button on:click={() => send(Events.Decrement)}> Decrement </button>

<style>
	button {
		font-family: inherit;
		font-size: inherit;
		padding: 1em 2em;
		color: #ff3e00;
		background-color: rgba(255, 62, 0, 0.6);
		border-radius: 2em;
		border: 2px solid rgba(255, 62, 0, 0) 0.2;
		outline: none;
		width: 200px;
		font-variant-numeric: tabular-nums;
		cursor: pointer;
	}
	button:focus {
		border: 2px solid #ff3e00;
	}

	button:active {
		background-color: rgba(255, 62, 0, 0.2);
	}
</style>
