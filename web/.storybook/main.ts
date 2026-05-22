import type { StorybookConfig } from '@storybook/react-vite';
import path from 'path';
import { fileURLToPath } from 'url';
import svgr from 'vite-plugin-svgr';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    '@storybook/addon-vitest',
    '@storybook/addon-a11y',
    '@storybook/addon-docs',
  ],
  framework: '@storybook/react-vite',
  async viteFinal(config, { configType }) {
    if (configType === 'PRODUCTION') {
      config.base = '/svg-to-video/storybook/';
    }

    config.plugins = [
      ...(config.plugins || []),
      svgr({
        include: '**/*.svg?react',
      }),
    ];

    config.resolve = {
      ...config.resolve,
      alias: {
        ...config.resolve?.alias,
        '@shared': path.resolve(__dirname, '../../shared'),
      },
    };

    config.server = {
      ...config.server,
      headers: {
        ...config.server?.headers,
        'Cross-Origin-Opener-Policy': 'same-origin',
        'Cross-Origin-Embedder-Policy': 'require-corp',
      },
    };
    return config;
  },
};
export default config;
