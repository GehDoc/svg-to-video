import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'node:url';
import { playwright } from '@vitest/browser-playwright';

const dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@shared': path.resolve(dirname, '../shared'),
    },
  },
  test: {
    include: ['src/**/*.test.tsx'],
    browser: {
      enabled: true,
      provider: playwright({}), // Using factory here too
      instances: [{ browser: 'chromium' }],
    },
  },
});
