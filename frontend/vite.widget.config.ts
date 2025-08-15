import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/webclient/widget.ts'),
      name: 'ChatterMateWidget',
      fileName: 'widget',
      formats: ['es'],
    },
    outDir: '../backend/assets',
    emptyOutDir: false,
    rollupOptions: {
      output: {
        format: 'es',
        entryFileNames: 'widget.js',
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === 'style.css') {
            return 'widget.css'
          }
          // Place other assets in a subdirectory that we can ignore or clean up later
          return 'unused/[name]-[hash][extname]'
        },
        chunkFileNames: 'unused/[name]-[hash].js',
        manualChunks: undefined, // Disable code splitting
      },
    },
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production'),
  },
})
