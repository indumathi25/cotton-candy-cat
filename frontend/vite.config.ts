/// <reference types="vitest" />
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react({
            babel: {
                plugins: [
                    ['babel-plugin-react-compiler', { target: '19' }],
                ],
            },
        }),
    ],
    envDir: '../',
    server: {
        port: 3000,
        open: true,
        proxy: {
            '/api': {
                target: 'http://localhost:8080',
                changeOrigin: true,
            },
        },
    },
    build: {
        outDir: 'build', // Keep same output dir as CRA (for Dockerfile compatibility)
        sourcemap: true,
    },
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: './src/setupTests.ts',
        css: true,
    },
    resolve: {
        alias: {
            // Allow absolute imports from src/ if needed in the future
            '@': '/src',
        },
    },
});
