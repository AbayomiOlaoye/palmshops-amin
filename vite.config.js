import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import sass from 'sass-embedded'

export default defineConfig({
  plugins: [react()],
  css: {
    preprocessorOptions: {
      scss: {
        implementation: sass,
      },
    },
  },
  base: '/',
})
