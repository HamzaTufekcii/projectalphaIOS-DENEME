// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'https://192.168.1.20:8443',
        changeOrigin: true,
        secure: false  // self-signed için şart
      },
    },
  },
});
