import type { Meta, StoryObj } from '@storybook/react-vite';
import { FaTerminal } from 'react-icons/fa';
import { DevCard } from './DevCard';

const meta: Meta<typeof DevCard> = {
  title: 'Components/DevCard',
  component: DevCard,
};

export default meta;
type Story = StoryObj<typeof DevCard>;

export const Default: Story = {
  args: {
    title: 'CLI Automation',
    icon: <FaTerminal />,
    snippet: 'npx -y @gehdoc/svg-to-video input.svg 60 ./out-dir',
  },
};
