<script lang="ts">
	import Button from '$lib/Button.svelte';
	import Header from '$lib/Header.svelte';
	import { pickerController } from 'ionic-svelte';

	import {
		playOutline,
		timerOutline,
		pauseCircleOutline,
		refreshCircleOutline,
		volumeMuteOutline,
		volumeHighOutline
	} from 'ionicons/icons';
	import { onMount } from 'svelte';

	// timer settings
	let preTime = 10;
	let workTime = 180;
	let restTime = 60;
	let rounds = 5;
	let timer = (workTime + restTime) * rounds;
	let interval$: any;
	let playAudio = true;

	// labels for timer settings
	let workLabel = '3:00';
	let restLabel = '1:00';
	let timerLabel = '4:00';

	// running timer values
	let currentRound = 1;
	let step: 'settings' | 'pre' | 'work' | 'rest' | 'finished' = 'settings';
	let progress = 0;

	$: {
		//convert seconds to "mm:ss" format
		workLabel = secondsToHHmm(workTime);
		restLabel = secondsToHHmm(restTime);
		timerLabel = secondsToHHmm(timer);

		const totalTime = step === 'work' ? workTime : restTime;
		progress = (totalTime - timer) / totalTime;
	}

	onMount(() => {
		keepAwake();
	});

	async function keepAwake() {
		try {
			const wakeLock = await navigator.wakeLock.request('screen');
		} catch (err: any) {
			// the wake lock request fails - usually system related, such being low on battery
			console.log(`${err.name}, ${err.message}`);
		}
	}

	function startTimer() {
		if (interval$) {
			stopTimer();
		}

		currentRound = 1;
		nextStep();

		intervalSetup();
	}

	function intervalSetup() {
		interval$ = setInterval(() => {
			timer--;
			if (timer < 0) {
				nextStep();
			}

			audioCheck();

			if (step === 'finished') {
				stopTimer();
			}
		}, 1000);
	}

	function audioCheck() {
		if (!playAudio) {
			return;
		}

		if (timer <= 3 && timer > 0) {
			// (<HTMLAudioElement>document.getElementById(`${timer}-audio`)).play();
		} else if (timer === 0) {
			if (step === 'work') {
				(<HTMLAudioElement>document.getElementById('rest-audio')).play();
			} else if ((step === 'rest' || step === 'pre') && currentRound <= rounds) {
				(<HTMLAudioElement>document.getElementById('start-audio')).play();
			}
		} else if (step === 'work') {
			const halfWay = Math.round(workTime / 2);
			if (timer === halfWay) {
				(<HTMLAudioElement>document.getElementById('half-audio')).play();
			}
		}
	}

	function stopTimer() {
		step = 'settings';
		setTotalTimer();
		clearInterval(interval$);
	}

	function pauseTimer() {
		clearInterval(interval$);
		interval$ = null;
	}

	function resumeTimer() {
		intervalSetup();
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
				if (currentRound === rounds) {
					stopTimer();
					break;
				}
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
				stopTimer();
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
	async function openTimePicker(type: 'work' | 'rest') {
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
						setTotalTimer();
					}
				}
			]
		});

		await picker.present();
	}

	async function openRoundPicker() {
		const rOptions = roundOptions();
		const picker = await pickerController.create({
			columns: [
				{
					name: 'rounds',
					options: rOptions,
					selectedIndex: rOptions.findIndex((o) => o.value === rounds)
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
						rounds = value.rounds.value;
						setTotalTimer();
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

	/**
	 * Generate round options between 1 and 20
	 */
	function roundOptions() {
		const options = [];
		for (let i = 1; i <= 20; i++) {
			options.push({
				text: i.toString(),
				value: i
			});
		}
		return options;
	}

	function setTotalTimer() {
		timer = (workTime + restTime) * rounds;
	}

	function toggleTimer() {
		interval$ !== null ? pauseTimer() : resumeTimer();
	}
</script>

<audio id="3-audio" preload="auto" autoplay={false}>
	<source src="3.mp3" type="audio/mpeg" />
</audio>

<audio id="2-audio" preload="auto" autoplay={false}>
	<source src="2.mp3" type="audio/mpeg" />
</audio>
<audio id="1-audio" preload="auto" autoplay={false}>
	<source src="1.mp3" type="audio/mpeg" />
</audio>

<audio id="rest-audio" preload="auto" autoplay={false}>
	<source src="rest.mp3" type="audio/mpeg" />
</audio>

<audio id="start-audio" preload="auto" autoplay={false}>
	<source src="start.mp3" type="audio/mpeg" />
</audio>

<audio id="half-audio" preload="auto" autoplay={false}>
	<source src="half.mp3" type="audio/mpeg" />
</audio>

<ion-content>
	<div slot="fixed" class="timer__volume">
		<Button
			transparent
			icon={playAudio ? volumeHighOutline : volumeMuteOutline}
			on:click={() => (playAudio = !playAudio)}
		/>
	</div>
	<div class="layout">
		<div class="timer__header {step}" class:active={step != 'settings'}>
			<Header
				running={interval$ !== null}
				label={timerLabel}
				{step}
				round={currentRound}
				{progress}
				on:stop={stopTimer}
				on:toggle={toggleTimer}
				on:skip={nextStep}
			/>
		</div>
		<div class="timer__content" class:hidden={step != 'settings'}>
			<Button
				icon={timerOutline}
				label="Work"
				text={workLabel}
				color="secondary"
				on:click={() => {
					openTimePicker('work');
				}}
			/>
			<Button
				icon={pauseCircleOutline}
				label="Rest"
				text={restLabel}
				color="tertiary"
				on:click={() => {
					openTimePicker('rest');
				}}
			/>
			<Button
				icon={refreshCircleOutline}
				label="Rounds"
				color="medium"
				text={rounds.toString()}
				on:click={openRoundPicker}
			/>
			<Button icon={playOutline} color="light" label="Start" size="footer" on:click={startTimer} />
		</div>
	</div>
</ion-content>

<style>
	ion-content {
		--background: var(--ion-color-light);
	}
	.layout {
		display: flex;
		flex-direction: column;
		height: calc(var(--vh, 1vh) * 100);
	}
	.timer__header {
		flex: 1;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		align-items: center;
		background-color: var(--ion-color-light);

		transition: background-color 0.29s cubic-bezier(0.3, 0, 1, 1);
	}

	.pre {
		background-color: var(--ion-color-light);
	}

	.work {
		background-color: var(--ion-color-secondary);
	}

	.rest {
		background-color: var(--ion-color-tertiary);
	}

	.timer__content {
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
		align-items: center;
		max-height: calc(var(--vh, 80vh) * 100);
		transition: max-height 0.29s;
		transition-timing-function: cubic-bezier(0.3, 0, 1, 1);
	}

	.hidden {
		max-height: 0;
		overflow: hidden;
	}

	.timer__number {
		font-size: 3rem;
		font-weight: bold;
	}

	.timer__volume {
		right: 0;
	}
</style>
