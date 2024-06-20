import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: 'tests/integration/**.test.ts',
    threads: true,
    environment: 'node',
    globals: false,
    watch: false,
    clearMocks: true,
    setupFiles: ['src/scripts/index.ts']
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('src', import.meta.url))
    }
  }
})
