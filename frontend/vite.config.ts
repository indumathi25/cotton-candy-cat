import { defineConfig } from 'vite';
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
        port: 3000,      // Keep same port as CRA default
        open: true,      // Auto-open browser on start
    },
    build: {
        outDir: 'build', // Keep same output dir as CRA (for Dockerfile compatibility)
        sourcemap: true,
    },
    resolve: {
        alias: {
            // Allow absolute imports from src/ if needed in the future
            '@': '/src',
        },
    },
});
