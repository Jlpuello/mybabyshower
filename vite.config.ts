import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  root: 'src/client',
  publicDir: '../../public',
  build: {
    outDir: '../../dist',
    emptyOutDir: true,
  },
  server: {
    allowedHosts: ['.duckdns.org'],
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
      '/uploads': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(fileURLToPath(new URL('.', import.meta.url)), './src/client'),
      '@shared': path.resolve(fileURLToPath(new URL('.', import.meta.url)), './src/shared'),
    },
  },
})
