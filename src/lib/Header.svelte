<script lang="ts">
	import Button  from './Button.svelte';
	import { closeCircleOutline, pauseCircleOutline, playCircleOutline, playForwardCircleOutline } from 'ionicons/icons';

    export let step: string;
    export let label: string;
    export let running: boolean;

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


<div></div>
<div>
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
</div>

<div class="header__buttons">
{#if step !== 'settings'}
	<Button align="center" size="medium" icon={closeCircleOutline} on:click={stopTimer} />
	<Button
        align="center"
        size="large"
		icon={running ? pauseCircleOutline : playCircleOutline}
		label=""
		on:click={toggleTimer}
	/>
    <Button
        align="center"
        size="medium"
		icon={playForwardCircleOutline}
		on:click={skip}
	/>
{:else}
	<div class="header__description"> </div>
{/if}
</div>

<style>
    .header__buttons {
        display: flex;
        align-items: flex-end;
        width: 100%;
        min-height: 50px;

    }
    .header__description {
        font-size: 1.2rem;

    }

    .header__number {
        font-size: 6rem;
        font-weight: 700;
    }

    .header__number,
    .header__description {
        text-align: center;
        margin: 0.5rem 0;
    }
</style>

