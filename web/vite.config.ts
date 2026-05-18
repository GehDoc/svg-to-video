/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import path from 'path';
import Sitemap from 'vite-plugin-sitemap';
import { readFileSync } from 'fs';

const pkg = JSON.parse(
  readFileSync(new URL('./package.json', import.meta.url), 'utf-8')
);

export default defineConfig({
  // Required for GitHub Pages project site deployment at https://gehdoc.github.io/svg-to-video/
  base: process.env.NODE_ENV === 'production' ? '/svg-to-video/' : '/',
  plugins: [
    react(),
    svgr({
      include: '**/*.svg?react',
    }),
    Sitemap({
      hostname: 'https://gehdoc.github.io/svg-to-video/',
      outDir: 'dist',
    }),
    {
      name: 'html-transform',
      transformIndexHtml(html) {
        return html.replace(/%APP_VERSION%/g, pkg.version);
      },
    },
  ],
  resolve: {
    alias: {
      '@shared': path.resolve(__dirname, '../shared'),
    },
  },
  server: {
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp',
    },
  },
});
