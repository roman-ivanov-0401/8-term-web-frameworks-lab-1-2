import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
	plugins: [react()],
	server: {
		proxy: {
			'/api/v1/auth': {
				target: 'http://localhost:3051',
				changeOrigin: true,
				rewrite: (path) => path.replace(/^\/api\/v1\/auth/, '/auth'),
			},
			'/api/v1': {
				target: 'http://localhost:3050',
				changeOrigin: true,
				// rewrite: (path) => path.replace(/^\/api\/v1/, ''),
			},
			'/uploads': {
				target: 'http://localhost:3050',
				changeOrigin: true,
			},
		},
	},
});
