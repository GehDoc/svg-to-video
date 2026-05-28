import type { Meta, StoryObj } from '@storybook/react-vite';
import { SeoFallback } from './SeoFallback';

const meta: Meta<typeof SeoFallback> = {
  title: 'Components/Splash Screen (SEO Fallback)',
  component: SeoFallback,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof SeoFallback>;

export const Default: Story = {};
