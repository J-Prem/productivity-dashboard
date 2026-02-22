import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: '/productivity-dashboard/',
  plugins: [
    react(),
    tailwindcss(),
  ],
  define: {
    'process.env': {},
    global: 'globalThis',
  },
  build: {
    rollupOptions: {
      external: [],
    },
  },
})
