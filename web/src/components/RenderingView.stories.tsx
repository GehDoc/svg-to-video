import type { Meta, StoryObj } from '@storybook/react-vite';
import { RenderingView } from './RenderingView';
import { StudioProvider } from '../context/StudioProvider';
import { useRef } from 'react';

const meta: Meta<typeof RenderingView> = {
  title: 'Components/RenderingView',
  component: RenderingView,
  decorators: [
    (Story) => {
      const ref = useRef(null);
      return <StudioProvider rendererRef={ref}>{Story()}</StudioProvider>;
    },
  ],
};

export default meta;
type Story = StoryObj<typeof RenderingView>;

export const Default: Story = {};
