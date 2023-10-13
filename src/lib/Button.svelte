<script lang="ts">
	export let icon: string = '';
	export let label: string = '';
	export let text: string = '';
    export let align : 'auto' | 'center' = 'auto'
    export let size: 'default' | 'large' | 'medium' = 'default'

	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();
</script>

<ion-button
	class="button"
    class:align-center={align === 'center'}
    class:large={size === 'large'}
    class:medium={size === 'medium'}
	on:click={() => {
		dispatch('click');
	}}
>
	{#if icon !== ''}
		<ion-icon src={icon} class="icon" />
	{/if}
    {#if label !== ''}
	    <span class="label">{label}</span>
    {/if}
    {#if text !== ''}
	    <span class="additional-text">{text}</span>
    {/if}
</ion-button>

<style>
	.button {
		width: 100%;
		display: flex;
		align-items: center;
		padding: 0.5rem;
		border: none;

		color: #fff;
		font-size: 1rem;
	}

    .large {
        font-size: 5rem;
        height: 10rem;
        min-height: auto;

        --padding-start: 0;
        --padding-end: 0;
        --padding-bottom: 0;
    }
      
    .medium {
        font-size: 1.5rem;
    }

	.icon {
		margin-right: 0.5rem;
	}

	.label {
		margin-right: auto;
	}

	.additional-text {
		margin-left: 0.5rem;
	}

    .align-center .label, .align-center .additional-text, .align-center .icon {
        margin: auto
    }
</style>
