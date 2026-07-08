import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],

  test: {
    coverage: {
      provider: 'v8',
      reporter: [
        'text',
        'lcov'
      ],
      reportsDirectory: './coverage'
    }
  }
})