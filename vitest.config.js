import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
	plugins: [react()],
	test: {
		environment: 'jsdom',
		globals: true,
		setupFiles: './vitest.setup.js',
		include: ['src/**/*.test.{js,jsx}'],
		exclude: ['backend/**'],
		coverage: {
			reporter: ['text', 'lcov'],
			provider: 'v8',
			reportsDirectory: './coverage-frontend',
			exclude: ['node_modules/', 'backend/'],
			lines: 70,
			functions: 70,
			branches: 60,
			statements: 70,
		},
	},
});
