import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  test: {
    environment: 'jsdom',
    coverage: {
      provider: 'v8',
      enabled: true,
      reporter: ['text', 'lcov'],
      // التأكد من أن المسار يبدأ من الجذر
      reportsDirectory: './coverage',
      clean: true,
    }
  }
})