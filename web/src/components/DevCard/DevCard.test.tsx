// @vitest-environment jsdom
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { test, expect, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { DevCard } from './DevCard';

test('DevCard renders title, snippet, and handles copy to clipboard', async () => {
  const writeText = vi.fn().mockResolvedValue(undefined);
  Object.assign(navigator, {
    clipboard: { writeText },
  });

  render(
    <DevCard
      title="Test CLI"
      snippet="npx test-cmd"
      copyAriaLabel="Copy test snippet"
    />
  );

  expect(screen.getByText('Test CLI')).toBeInTheDocument();
  expect(screen.getByLabelText('Test CLI')).toHaveTextContent('npx test-cmd');

  const button = screen.getByRole('button', { name: 'Copy test snippet' });
  expect(button).toBeInTheDocument();

  fireEvent.click(button);

  expect(writeText).toHaveBeenCalledWith('npx test-cmd');
  await waitFor(() => {
    expect(screen.getByText(/Copied/i)).toBeInTheDocument();
  });
});

test('DevCard supports tab switching and copies active tab snippet', async () => {
  const writeText = vi.fn().mockResolvedValue(undefined);
  Object.assign(navigator, {
    clipboard: { writeText },
  });

  render(
    <DevCard
      tabs={[
        { id: 'tab1', label: 'CLI Tab', snippet: 'npx cli-command' },
        { id: 'tab2', label: 'MCP Tab', snippet: '{"mcp": true}' },
      ]}
    />
  );

  expect(screen.getByRole('tab', { name: /CLI Tab/i })).toBeInTheDocument();
  expect(screen.getByRole('tab', { name: /MCP Tab/i })).toBeInTheDocument();
  expect(screen.getByLabelText(/CLI Tab code snippet/i)).toHaveTextContent(
    'npx cli-command'
  );

  // Switch to second tab
  fireEvent.click(screen.getByRole('tab', { name: /MCP Tab/i }));
  expect(screen.getByLabelText(/MCP Tab code snippet/i)).toHaveTextContent(
    '{"mcp": true}'
  );

  // Copy active tab snippet
  const copyBtn = screen.getByRole('button', { name: 'Copy MCP Tab' });
  fireEvent.click(copyBtn);

  expect(writeText).toHaveBeenCalledWith('{"mcp": true}');
  await waitFor(() => {
    expect(screen.getByText(/Copied/i)).toBeInTheDocument();
  });
});
