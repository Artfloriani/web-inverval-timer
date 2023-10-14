import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';

import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
	plugins: [
		sveltekit(),
		VitePWA({
			registerType: 'autoUpdate',
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
						type: 'image/png'
					},
					{
						src: '512.png',
						sizes: '512x512',
						type: 'image/png'
					}
				]
			}
		})
	],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	}
});
