import type { Meta, StoryObj } from '@storybook/react-vite';
import { FaTerminal, FaRobot } from 'react-icons/fa';
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

export const WithTabs: Story = {
  args: {
    tabs: [
      {
        id: 'cli',
        label: 'CLI Automation',
        icon: <FaTerminal size={12} />,
        snippet: 'npx -y @gehdoc/svg-to-video input.svg 60 ./out-dir',
      },
      {
        id: 'mcp',
        label: 'AI Agent (MCP)',
        icon: <FaRobot size={12} />,
        snippet: '{\n  "mcpServers": {\n    "svg-to-video": { ... }\n  }\n}',
      },
    ],
  },
};
