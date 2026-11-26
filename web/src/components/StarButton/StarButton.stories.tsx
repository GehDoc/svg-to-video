import type { Meta, StoryObj } from '@storybook/react-vite';
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
