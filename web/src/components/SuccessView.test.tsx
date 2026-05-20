// @vitest-environment jsdom
import {
  render,
  screen,
  cleanup,
  fireEvent,
  waitFor,
} from '@testing-library/react';
import { test, expect, afterEach, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { SuccessView } from './SuccessView';

afterEach(cleanup);

// Mock umami
vi.stubGlobal('umami', { track: vi.fn() });

test('SuccessView renders MP4 success state correctly', () => {
  render(
    <SuccessView
      fileName="test.mp4"
      fileSize="1.2 MB"
      renderedUrl="blob:test"
      onDownload={vi.fn()}
      onBack={vi.fn()}
    />
  );

  expect(screen.getByText(/Render Complete/i)).toBeInTheDocument();
  expect(screen.getByText(/test.mp4/i)).toBeInTheDocument();
  expect(screen.getByText(/1.2 MB/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /Download/i })).toBeInTheDocument();
  expect(
    screen.getByRole('button', { name: /Copy Data URL/i })
  ).toBeInTheDocument();
});

test('SuccessView handles copy action', async () => {
  const onCopyOverride = vi.fn().mockResolvedValue(true);

  render(
    <SuccessView
      fileName="test.mp4"
      fileSize="1.2 MB"
      renderedUrl="blob:test"
      onDownload={vi.fn()}
      onBack={vi.fn()}
      onCopyOverride={onCopyOverride}
    />
  );

  const copyBtn = screen.getByRole('button', { name: /Copy Data URL/i });
  fireEvent.click(copyBtn);

  expect(onCopyOverride).toHaveBeenCalled();

  // Verify success class is applied
  await waitFor(() => expect(copyBtn).toHaveClass('copy-button--success'));
  // Verify success icon is present
  expect(copyBtn.querySelector('.icon-success')).toBeInTheDocument();
});

test('SuccessView renders donation support link', () => {
  render(
    <SuccessView
      fileName="test.mp4"
      fileSize="1.2 MB"
      renderedUrl="blob:test"
      onDownload={vi.fn()}
      onBack={vi.fn()}
    />
  );

  expect(screen.getByText(/Love this tool?/i)).toBeInTheDocument();
  const sponsorLink = screen.getByRole('link', {
    name: /Support its development on GitHub/i,
  });
  expect(sponsorLink).toHaveAttribute(
    'href',
    'https://github.com/GehDoc/svg-to-video/?sponsor=1'
  );
});
