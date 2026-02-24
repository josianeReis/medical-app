import { defineConfig } from 'vitest/config';
export default defineConfig({
  test: {
    environment: 'bun',
    globals: true,
    reporters: ['default'],
    coverage: {
      enabled: false,
    },
  },
  resolve: {
    alias: {
      '@/': new URL('./', import.meta.url).pathname,
    },
  },
});