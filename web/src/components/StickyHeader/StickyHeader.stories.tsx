import type { Meta, StoryObj } from '@storybook/react-vite';
import React from 'react';
import { StickyHeader } from './StickyHeader';

const meta: Meta<typeof StickyHeader> = {
  title: 'Components/StickyHeader',
  component: StickyHeader,
  parameters: {
    layout: 'padded',
  },
};

export default meta;
type Story = StoryObj<typeof StickyHeader>;

export const Default: Story = {
  render: () => (
    <div
      tabIndex={0}
      aria-label="Demo scrollable container"
      style={{
        height: '400px',
        overflowY: 'auto',
        border: '1px solid var(--border)',
        padding: '1rem',
      }}
    >
      <div style={{ height: '800px' }}>
        <section
          style={{
            height: '350px',
            background: 'var(--panel)',
            marginBottom: '1rem',
            padding: '1rem',
          }}
        >
          <StickyHeader
            as="h3"
            style={{ background: 'var(--card)', padding: '0.5rem' }}
          >
            Section 1 Sticky Header
          </StickyHeader>
          <p style={{ marginTop: '1rem' }}>
            Scroll down to see the sticky header pin to the top with a subtle
            elevation shadow.
          </p>
        </section>
        <section
          style={{
            height: '350px',
            background: 'var(--panel)',
            padding: '1rem',
          }}
        >
          <StickyHeader
            as="h3"
            style={{ background: 'var(--card)', padding: '0.5rem' }}
          >
            Section 2 Sticky Header
          </StickyHeader>
          <p style={{ marginTop: '1rem' }}>
            Section 2 replaces Section 1 when scrolling.
          </p>
        </section>
      </div>
    </div>
  ),
};
