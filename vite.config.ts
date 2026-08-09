import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
  ],
  server: {
    headers: {
      // Vite 8 dev mode uses eval internally for its module runner / HMR.
      // Without 'unsafe-eval' the JavaScript fails to load entirely.
      'Content-Security-Policy': [
        "default-src 'self'",
        "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
        "font-src 'self' https://fonts.gstatic.com data:",
        "img-src 'self' data: blob:",
        // WebSocket needed for Vite HMR
        "connect-src 'self' ws://localhost:* wss://localhost:*",
      ].join('; '),
    },
  },
})
