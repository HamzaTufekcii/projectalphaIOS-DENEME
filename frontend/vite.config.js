import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'

export default defineConfig({
    plugins: [react()],
    server: {
        port: 5173,
        https: {
            key: fs.readFileSync('./localhost+2-key.pem', 'utf-8'),
            cert: fs.readFileSync('./localhost+2.pem', 'utf-8'),
        },
        proxy: {
            '/api': {
                target: 'https://localhost:8443',
                changeOrigin: true,
                secure: false, // self-signed sertifika için
            },
        },
    },
})
