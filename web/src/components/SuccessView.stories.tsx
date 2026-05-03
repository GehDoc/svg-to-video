import type { Meta, StoryObj } from '@storybook/react-vite';
import { SuccessView } from './SuccessView';
import { StudioProvider } from '../context/StudioProvider';
import { useRef } from 'react';

const meta: Meta<typeof SuccessView> = {
  title: 'Components/SuccessView',
  component: SuccessView,
  decorators: [
    (Story) => {
      const ref = useRef(null);
      return <StudioProvider rendererRef={ref}>{Story()}</StudioProvider>;
    },
  ],
};

export default meta;
type Story = StoryObj<typeof SuccessView>;

export const Default: Story = {};
