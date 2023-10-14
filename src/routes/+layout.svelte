<script lang="ts">
	import { setupIonicBase } from 'ionic-svelte';
	import { dev } from '$app/environment';
	import { preloadCode } from '$app/navigation';

	/* Call Ionic's setup routine */
	setupIonicBase();

	/* Import all components - or do partial loading - see below */
	/* import 'ionic-svelte/components/all'; */

	import 'ionic-svelte/components/ion-app';
	import 'ionic-svelte/components/ion-content';
	import 'ionic-svelte/components/ion-progress-bar';
	import 'ionic-svelte/components/ion-picker';
	import 'ionic-svelte/components/ion-button';

	/* Theme variables */
	import '../theme/variables.css';

	import '../theme/global.css';
	import { pwaStatusStream, type PWAStatus } from '$lib/pwa';

	// Prefetch all code when not in dev
	if (!dev) preloadCode();

	// We listen to the resize event
	window.addEventListener('resize', () => {
		// We execute the same script as before
		const vh = window.innerHeight * 0.01;
		document.documentElement.style.setProperty('--vh', `${vh}px`);
	});

	const vh = window.innerHeight * 0.01;
	document.documentElement.style.setProperty('--vh', `${vh}px`);

	/*
		This part - import 'ionic-svelte/components/all'; -  loads all components at once.

		This adds at least >800kb (uncompressed) to your bundle - 80 components (so do your math!!)

		You can also choose to import each component you want to use separately and leave out others.

		It is recommended to do this in this file, as you only need to do such once. But you are free
		to do this elsewhere if you like to code-split differently. 

		Example: if you replace the line import 'ionic-svelte/components/all'; with the imports below, you will see the resulting bundle being much smaller

		import 'ionic-svelte/components/ion-app';
		import 'ionic-svelte/components/ion-card';
		import 'ionic-svelte/components/ion-card-title';
		import 'ionic-svelte/components/ion-card-subtitle';
		import 'ionic-svelte/components/ion-card-header';
		import 'ionic-svelte/components/ion-card-content';
		import 'ionic-svelte/components/ion-chip';
		import 'ionic-svelte/components/ion-button';

		Click the ionic-svelte-components-all-import above to go to the full list of possible imports.

		Please don't forget to import ion-app in this file when you decide to code-split:

	    import 'ionic-svelte/components/ion-app';

		You can report issues here - https://github.com/Tommertom/svelte-ionic-npm/issues
		Want to know what is happening more - follow me on Twitter - https://twitter.com/Tommertomm
		Discord channel on Ionic server - https://discordapp.com/channels/520266681499779082/1049388501629681675
	*/

	pwaStatusStream.subscribe((status: PWAStatus) => {
		console.log('PWA status', status);

		if (status.updateFunction) {
			console.log('PWA updating itself in 4 secs......');
			setTimeout(() => {
				status.updateFunction();
			}, 4000);
		}
	});

	// Aggressive prefetching for faster rendering
	if (!dev) {
		preloadCode();
	}


</script>



<ion-app>
	<slot />
</ion-app>
