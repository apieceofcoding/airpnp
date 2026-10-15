import { resolve } from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig({
	build: {
		rollupOptions: {
			input: {
				main: resolve(import.meta.dirname, 'index.html'),
				stay: resolve(import.meta.dirname, 'stay.html'),
			},
		},
	},
});
