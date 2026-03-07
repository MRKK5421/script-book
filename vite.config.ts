// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true,
    strictPort: true,
    host: true,
  },
  resolve: {
    alias: {
      '@': '/src',
      '@src': '/Users/kk/Development/script-book/src'
    }
  },
  build: {
    rollupOptions: {
      input: './frontend/index.html'
    }
  }
})