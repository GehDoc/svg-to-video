import { defineConfig } from 'vitest/config';
import viteConfig from './vite.config';

export default defineConfig({
  ...viteConfig,
  test: {
    include: ['src/**/*.test.{ts,tsx}'],
    exclude: ['src/**/*.spec.{ts,tsx}', 'tests/**/*.spec.{ts,tsx}'],
    environment: 'jsdom',
    setupFiles: ['./vitest.shims.d.ts'], // Adjust path if necessary
  },
});
