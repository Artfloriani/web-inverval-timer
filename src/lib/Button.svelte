<script lang="ts">
    export let icon :string;
    export let label: string;
    export let text : string = '';


 import { createEventDispatcher } from 'svelte'

  const dispatch = createEventDispatcher()
</script>

<ion-button class="button" on:click={() => {
     dispatch('click')
}}>
    <ion-icon src={icon} class="icon"></ion-icon>
    <span class="text">{label}</span>
    <span class="additional-text">{text}</span>
</ion-button>

<style>
    .button {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0.5rem;
        border: none;
        color: #fff;
        font-size: 1rem;
        cursor: pointer;
    }

    .icon {
        margin-right: 0.5rem;
    }

    .text {
        margin-right: auto;
    }

    .additional-text {
        margin-left: 0.5rem;
    }
</style>
