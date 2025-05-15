import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
console.log("Seks");
// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5180,
    proxy: {
      '/api':{
        target:'http://localhost:8080',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/,'')
      }
    }
  },
});
