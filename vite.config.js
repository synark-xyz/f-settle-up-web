import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Listen on all addresses including LAN
    port: 5173,
    strictPort: false, // Try next port if 5173 is taken
  }
})
