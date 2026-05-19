import type { Meta, StoryObj } from '@storybook/react-vite';
import { HeaderMenu } from './HeaderMenu';

const meta: Meta<typeof HeaderMenu> = {
  title: 'Components/HeaderMenu',
  component: HeaderMenu,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof HeaderMenu>;

export const Default: Story = {};
