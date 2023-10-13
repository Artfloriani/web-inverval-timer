<script lang="ts">
	import Button from './Button.svelte';
	import {
		closeCircleOutline,
		pauseCircleOutline,
		playCircleOutline,
		playForwardCircleOutline
	} from 'ionicons/icons';

	export let step: string;
	export let label: string;
	export let running: boolean;
	export let round: number = 1;
	export let progress = 0;

	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	function stopTimer() {
		dispatch('stop');
	}

	function toggleTimer() {
		dispatch('toggle');
	}
	function skip() {
		dispatch('skip');
	}
</script>

<div class="header__spacing">
	{#if step !== 'settings'}
		<div class="header__label animate">Round {round}</div>
	{/if}
</div>
<div class="header__content">
	{#if step === 'pre'}
		<div class="header__description">Get Ready</div>
	{:else if step === 'work'}
		<div class="header__description">Work</div>
	{:else if step === 'rest'}
		<div class="header__description">Rest</div>
	{:else if step === 'finished'}
		<div class="header__description">Finished</div>
	{:else}
		<div class="header__description">Total Time</div>
	{/if}
	<div class="header__number">{label}</div>

	{#if step === 'work' || step === 'rest'}
		<ion-progress-bar value={progress} />
	{/if}
</div>

<div class="header__buttons" class:animate={step !== 'settings'}>
	{#if step !== 'settings'}
		<Button
			align="center"
			size="medium"
			transparent
			icon={closeCircleOutline}
			on:click={stopTimer}
		/>
		<Button
			align="center"
			size="large"
			icon={running ? pauseCircleOutline : playCircleOutline}
			transparent
			on:click={toggleTimer}
		/>
		<Button
			align="center"
			size="medium"
			transparent
			icon={playForwardCircleOutline}
			on:click={skip}
		/>
	{:else}
		<div class="header__description" />
	{/if}
</div>

<style>
	.header__buttons {
		display: flex;
		align-items: flex-end;
		width: 100%;

		opacity: 0;
		transform: translateY(100%);
		max-height: 0;
	}

	.header__spacing {
		padding: 20px;
	}

	.header__label {
		font-weight: bold;
		opacity: 0;
		transform: translateY(100%);
	}

	.header__content {
		width: 100%;
		text-align: center;
		padding: 30px;
	}

	.animate {
		animation: slide-up 0.5s;
		animation-delay: 0.2s;
		animation-fill-mode: forwards;
		animation-timing-function: cubic-bezier(0.05, 0.7, 0.1, 1);
	}

	@keyframes slide-up {
		from {
			max-height: 0;
			opacity: 0;
			transform: translateY(100%);
		}
		to {
			max-height: 10rem;
			opacity: 1;
			transform: translateY(0);
		}
	}

	.header__number,
	.header__description {
		text-align: center;
		margin: 0.5rem 0;
		color: #000000de;
	}

	.header__description {
		font-size: 1.2rem;
	}

	.header__number {
		font-size: 6rem;
		font-weight: 700;
		margin-bottom: 40px;
	}
</style>
