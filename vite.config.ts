import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // 👇 esto es CRÍTICO para GitHub Pages (debe coincidir con el nombre del repo)
  base: '/life-clock/',
})
