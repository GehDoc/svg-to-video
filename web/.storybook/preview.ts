import type { Preview } from '@storybook/react';
import '../src/index.css';
import '../src/App.css';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    a11y: {
      context: '#storybook-root',
      config: {
        rules: [
          {
            // Some specific rules if needed
            id: 'color-contrast',
            enabled: true,
          },
        ],
      },
    },
  },
};

export default preview;
