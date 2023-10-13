<script lang="ts">
	export let icon: string = '';
	export let label: string = '';
	export let text: string = '';
    export let transparent = false;
    export let align : 'auto' | 'center' = 'auto'
    export let size: 'default' | 'large' | 'medium' | 'footer' = 'default'
    export let color = '';

	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();
</script>

<ion-button
	class="button"
    class:align-center={align === 'center'}
    class:large={size === 'large'}
    class:medium={size === 'medium'}
    class:footer={size === 'footer'}
    class:transparent={transparent}
    color={color}
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
        margin: 0px;

		border: none;

		font-size: 18px;

        --box-shadow:none;
        --border-radius: 8px;
        --padding-top: 20px;
        --padding-bottom: 20px;
        --padding-start: 20px;
        --padding-end: 20px;
	}

    .footer {
        justify-content: center;
        width: auto;
        min-height: 2.5rem;

        margin-top: 1rem;
        margin-bottom: 1rem;
    }

    .footer .label {
        margin: 0;
    }

    .transparent {
        --background: transparent !important;
        --background-activated: transparent !important;
        --color: var(--ion-color-primary)
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
