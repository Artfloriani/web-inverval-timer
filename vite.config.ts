import { sveltekit } from '@sveltejs/kit/vite';
import { SvelteKitPWA } from '@vite-pwa/sveltekit';

/** @type {import('vite').UserConfig} */
const config = {
	plugins: [
		SvelteKitPWA({
			injectRegister: 'auto',
			registerType: 'autoUpdate',
			outDir: './build',
			srcDir: './build',
			workbox: {
				globPatterns: ['**/*.{js,css,html,ico,png,svg,mp3}']
			},
			includeAssets: ['favicon.ico', '192.png', '512.png'],
			manifest: {
				name: 'Free HIIT Timer',
				short_name: 'HIIT Timer',
				description: 'A 100% Free HIIT Timer for your workouts | HIIT, Boxing, Crossfit',
				theme_color: '#FAFAFAFA',
				icons: [
					{
						src: '192.png',
						sizes: '192x192',
						type: 'image/png',
						purpose: 'maskable any'
					},
					{
						src: '512.png',
						sizes: '512x512',
						type: 'image/png',
						purpose: 'maskable any'
					}
				]
			}
		}),
		sveltekit()
	],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	}
};

export default config;
