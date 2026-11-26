import type { Preview } from '@storybook/react';
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '../src/index.scss';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const preview: Preview = {
  decorators: [
    (Story) =>
      React.createElement(
        QueryClientProvider,
        { client: queryClient },
        React.createElement(Story)
      ),
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    a11y: {
      test: 'error',
      config: {
        rules: [
          {
            id: 'color-contrast',
            enabled: true,
          },
        ],
      },
    },
  },
};

export default preview;
