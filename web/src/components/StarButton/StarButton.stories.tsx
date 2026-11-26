import type { Meta, StoryObj } from '@storybook/react-vite';
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StarButton } from './StarButton';

const meta: Meta<typeof StarButton> = {
  title: 'Components/StarButton',
  component: StarButton,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof StarButton>;

export const Default: Story = {};

export const Medium: Story = {
  args: {
    size: 'medium',
  },
};

export const WithoutCount: Story = {
  args: {
    showCount: false,
  },
};

export const Loading: Story = {
  decorators: [
    (Story) => {
      const client = new QueryClient({
        defaultOptions: {
          queries: {
            retry: false,
          },
        },
      });
      client.setQueryDefaults(['github-repo-stars'], {
        queryFn: () => new Promise(() => {}),
        staleTime: Infinity,
      });
      return (
        <QueryClientProvider client={client}>
          <Story />
        </QueryClientProvider>
      );
    },
  ],
};

export const Fallback: Story = {
  decorators: [
    (Story) => {
      const client = new QueryClient();
      client.setQueryData(['github-repo-stars'], null);
      return (
        <QueryClientProvider client={client}>
          <Story />
        </QueryClientProvider>
      );
    },
  ],
};
