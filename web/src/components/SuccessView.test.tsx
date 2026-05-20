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
import * as clipboard from '../utils/clipboard';

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
  const spy = vi.spyOn(clipboard, 'copyDataUrl').mockResolvedValue(true);

  render(
    <SuccessView
      fileName="test.mp4"
      fileSize="1.2 MB"
      renderedUrl="blob:test"
      onDownload={vi.fn()}
      onBack={vi.fn()}
    />
  );

  const copyBtn = screen.getByRole('button', { name: /Copy Data URL/i });
  fireEvent.click(copyBtn);

  expect(spy).toHaveBeenCalled();
  await waitFor(() => expect(screen.getByText(/Copied!/i)).toBeInTheDocument());
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
