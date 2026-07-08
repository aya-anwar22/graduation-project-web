/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  // الآن سيتعرف TypeScript على هذه الخاصية
  test: {
    environment: 'jsdom',
    coverage: {
      provider: 'v8',
      enabled: true,
      reporter: ['text', 'lcov'],
      reportsDirectory: './coverage',
      clean: true,
    }
  }
})