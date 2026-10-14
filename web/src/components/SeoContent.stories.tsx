import type { Meta, StoryObj } from '@storybook/react-vite';
import { SeoContent } from './SeoContent';

const meta: Meta<typeof SeoContent> = {
  title: 'Components/SeoContent',
  component: SeoContent,
};

export default meta;
type Story = StoryObj<typeof SeoContent>;

export const Default: Story = {};
