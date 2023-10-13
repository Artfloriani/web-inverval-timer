<script lang="ts">
	import Button from '$lib/Button.svelte';
	import { pickerController } from 'ionic-svelte';

	import {
		playOutline,
		timerOutline,
		pauseCircleOutline,
		refreshCircleOutline
	} from 'ionicons/icons';

	// timer settings
	let preTime = 10;
	let workTime = 15;
	let restTime = 5;
	let rounds = 3;
	let timer = (workTime + restTime) * rounds;
	let interval$: any;

	// labels for timer settings
	let workLabel = '3:00';
	let restLabel = '1:00';
	let timerLabel = '4:00';

	// running timer values
	let currentRound = 1;
	let step: 'settings' | 'pre' | 'work' | 'rest' | 'finished' = 'settings';

	$: {
		//convert seconds to "mm:ss" format
		workLabel = secondsToHHmm(workTime);
		restLabel = secondsToHHmm(restTime);
		timer = (workTime + restTime) * rounds;
		timerLabel = secondsToHHmm(timer);
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
		}, 1000);
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

	/**
	 * convert a seconds number into a "mm:ss" string
	 * @param seconds
	 */
	function secondsToHHmm(seconds: number) {
		let m: string | number = Math.floor(seconds / 60);
		let s: string | number = seconds - m * 60;
		if (s < 10) s = '0' + s;
		if (m < 10) m = '0' + m;
		return `${m}:${s}`;
	}

	/**
	 * Populate and open the Picker depending on the type
	 * @param type
	 */
	async function populatePicker(type: 'work' | 'rest') {
		const dateTime = document.querySelector('ion-datetime');

		const label = type === 'work' ? workLabel : restLabel;
		const [selectedMinute, selectedSecond] = label.split(':');

		const mOptions = minuteOptions();
		const sOptions = secondOptions();

		const picker = await pickerController.create({
			columns: [
				{
					cssClass: 'picker__column',
					name: 'minutes',
					options: mOptions,
					selectedIndex: mOptions.findIndex((o) => o.text === selectedMinute)
				},
				{ cssClass: 'picker__column--tiny', name: 'divisor', options: [{ text: ':', value: ':' }] },

				{
					cssClass: 'picker__column',
					name: 'seconds',
					options: sOptions,
					selectedIndex: sOptions.findIndex((o) => o.text === selectedSecond)
				}
			],
			buttons: [
				{
					text: 'Cancel',
					role: 'cancel'
				},
				{
					text: 'Confirm',
					handler: (value) => {
						// update timer settings
						if (type === 'work') {
							workTime = value.minutes.value * 60 + value.seconds.value;
						} else {
							restTime = value.minutes.value * 60 + value.seconds.value;
						}
					}
				}
			]
		});

		await picker.present();
	}

	/**
	 * Generate picker options for minutes, from 0 to 30
	 */
	function minuteOptions() {
		const options = [];
		for (let i = 0; i <= 30; i++) {
			options.push({
				text: i < 10 ? `0${i}` : i.toString(),
				value: i
			});
		}
		return options;
	}

	/**
	 * Generate picker options for seconds from 0 to 55, by 5
	 */
	function secondOptions() {
		const options = [];
		for (let i = 0; i < 60; i += 5) {
			options.push({
				text: i < 10 ? `0${i}` : i.toString(),
				value: i
			});
		}
		return options;
	}
</script>

<ion-content>
	<div class="layout">
		<div class="timer__header">
			<div class="timer__number">{timerLabel}</div>
		</div>
		<div class="timer__content">
			<Button
				icon={timerOutline}
				label="Work"
				text={workLabel}
				on:click={() => {
					populatePicker('work');
				}}
			/>
			<Button
				icon={pauseCircleOutline}
				label="Rest"
				text={restLabel}
				on:click={() => {
					populatePicker('rest');
				}}
			/>
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
		font-size: 3rem;
		font-weight: bold;
	}
</style>
