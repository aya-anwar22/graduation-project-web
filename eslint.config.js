import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),

  {
    files: ['**/*.{ts,tsx}'],

    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],

    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },

    rules: {
      // مؤقتًا أثناء التطوير
      '@typescript-eslint/no-explicit-any': 'off',

      // خليها Warning بدل Error
      '@typescript-eslint/no-unused-vars': 'warn',

      // Rule جديدة في React 19
      'react-hooks/set-state-in-effect': 'off',

      // Fast Refresh
      'react-refresh/only-export-components': 'off',

      // Hooks Dependency
      'react-hooks/exhaustive-deps': 'warn',

      // const بدل let
      'prefer-const': 'warn',
    },
  },
])