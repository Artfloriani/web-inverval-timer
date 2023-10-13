<script lang="ts">
	import Button from "$lib/Button.svelte";

	import {playOutline, timerOutline, pauseCircleOutline, refreshCircleOutline} from "ionicons/icons";



	// timer settings
	let workTime = 180;
	let restTime = 60;
	let rounds = 3;
	let timer = (workTime + restTime) * rounds;
	
	// labels for timer settings
	let workLabel = "3:00";
	let restLabel = "1:00"
	let timerLabel = '4:00';

	// running timer values
	let currentRound = 0;
	let step : 'settings' | 'pre' | 'work' | 'rest' | 'finished' = 'settings';

	$: {
		//convert seconds to "mm:ss" format
		workLabel = secondsToHHmm(workTime);
		restLabel = secondsToHHmm(restTime);
		timerLabel = secondsToHHmm(timer)
	}

	function startTimer() {
		setInterval(() => {
			timer--;
		}, 1000);
	}

	function secondsToHHmm(seconds: number)  {
		let m = Math.floor(seconds / 60);
		let s = seconds - m * 60;
		return s < 10 ? `${m}:0${s}`:`${m}:${s}`;
	}

</script>

<ion-content >
	<div class="layout">

		<div class="timer__header">
			<div class="timer__number">{timerLabel}</div>
			
		</div>
		<div class="timer__content"> 
			<Button icon={timerOutline} label="Work" text={workLabel} />
			<Button icon={pauseCircleOutline} label="Rest" text={restLabel} />
			<Button icon={refreshCircleOutline} label="Rounds" text="3" />
			<Button icon={playOutline} label="Start" on:click={startTimer} />
		</div>
	</div>
</ion-content>

<style>

	.layout {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}
	.timer__header {
		flex: 1;
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: #3880ff;
		color: #fff;
	}

	.timer__content {
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
		align-items: center;
	}

	.timer__number {
		font-size: 40px;
		font-weight: bold;
	}

	.number {
		float: right;
	}
</style>
