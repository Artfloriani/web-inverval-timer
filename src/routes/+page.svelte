<script lang="ts">
	import Button from "$lib/Button.svelte";

	import {playOutline, timerOutline, pauseCircleOutline, refreshCircleOutline} from "ionicons/icons";


	// timer settings
	let preTime = 10;
	let workTime = 15;
	let restTime = 5;
	let rounds = 3;
	let timer = (workTime + restTime) * rounds;
	let interval$:any;
	
	// labels for timer settings
	let workLabel = "3:00";
	let restLabel = "1:00"
	let timerLabel = '4:00';

	// running timer values
	let currentRound = 1;
	let step : 'settings' | 'pre' | 'work' | 'rest' | 'finished' = 'settings';

	$: {
		//convert seconds to "mm:ss" format
		workLabel = secondsToHHmm(workTime);
		restLabel = secondsToHHmm(restTime);
		timerLabel = secondsToHHmm(timer)
	}

	function startTimer() {
		currentRound = 1;
		nextStep();

		interval$ = setInterval(() => {
			timer--;
			if (timer < 0) {
				nextStep();
			}

			if (step === 'finished') {
				stopTimer();
			}
		}, 1000)
	}

	function stopTimer() {
		clearInterval(interval$);
	}


	function nextStep() {
		switch (step) {
			case 'settings':
				timer = preTime;
				step = 'pre';
				break;
			case 'pre':
				timer = workTime;
				step = 'work';
				break;
			case 'work':
				timer = restTime;
				step = 'rest';
				break;
			case 'rest':
				if (currentRound++ < rounds) {
					timer = workTime;
					step = 'work';
					break;
				}

				step = 'finished';
				timer = 0;
				break;
			case 'finished':
				step = 'settings';
				break;
		}
	}

	function secondsToHHmm(seconds: number)  {
		let m :string | number = Math.floor(seconds / 60);
		let s :string | number = seconds - m * 60;
		if (s < 10) s = '0' + s;
		if (m < 10) m = '0' + m;
		return `${m}:${s}`;
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

</style>
