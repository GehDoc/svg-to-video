import type { Meta, StoryObj } from '@storybook/react-vite';
import { LandingView } from './LandingView';

const meta: Meta<typeof LandingView> = {
  title: 'Components/LandingView',
  component: LandingView,
};

export default meta;
type Story = StoryObj<typeof LandingView>;

export const Default: Story = {};
