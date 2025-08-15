import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), vueJsx(), vueDevTools()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    headers: {
      'Service-Worker-Allowed': '/',
    },
  },
  publicDir: 'public',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      input: {
        main: './index.html',
        'firebase-messaging-sw': './public/firebase-messaging-sw.js',
      },
      output: {
        manualChunks: {
          'vendor-vue': ['vue', 'vue-router', 'pinia'],
          'vendor-ui': ['vue3-apexcharts'],
          'vendor-utils': ['axios', 'marked'],
          'vendor-firebase': ['firebase/app', 'firebase/messaging', 'firebase/auth'],
        },
      },
    },
  },
})
