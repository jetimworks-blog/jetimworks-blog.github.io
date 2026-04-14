import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  plugins: [react(), tailwindcss()],
  // Use /blog/ for production builds (GitHub Pages), / for local development
  base: command === 'serve' ? '/' : '/blog/',
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
  server: {
    host: '0.0.0.0',  // Allow network access
    port: 5173,
  },
}))
