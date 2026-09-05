// @vitest-environment jsdom
import {
  render,
  screen,
  cleanup,
  fireEvent,
  waitFor,
} from '@testing-library/react';
import { test, expect, afterEach, beforeEach, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { SuccessView } from './SuccessView';
import pkg from '../../package.json';

const trackMock = vi.fn();

beforeEach(() => {
  trackMock.mockClear();
  vi.stubGlobal('umami', { track: trackMock });
});

afterEach(cleanup);

test('SuccessView renders MP4 success state correctly', () => {
  render(
    <SuccessView
      fileName="test.mp4"
      fileSize="1.2 MB"
      renderedUrl="blob:test"
      mimeType="video/mp4"
      onDownload={vi.fn()}
      onBack={vi.fn()}
    />
  );

  expect(screen.getByText(/Render Complete/i)).toBeInTheDocument();
  expect(screen.getByText(/test.mp4/i)).toBeInTheDocument();
  expect(screen.getByTestId('video-preview')).toBeInTheDocument();
});

test('SuccessView handles copy action', async () => {
  const onCopyOverride = vi.fn().mockResolvedValue(true);

  render(
    <SuccessView
      fileName="test.mp4"
      fileSize="1.2 MB"
      renderedUrl="blob:test"
      mimeType="video/mp4"
      format="mp4"
      isTransparent={false}
      onDownload={vi.fn()}
      onBack={vi.fn()}
      onCopyOverride={onCopyOverride}
    />
  );

  const copyBtn = screen.getByRole('button', { name: /Copy Data URL/i });
  fireEvent.click(copyBtn);

  expect(onCopyOverride).toHaveBeenCalled();
  await waitFor(() =>
    expect(trackMock).toHaveBeenCalledWith('copy-data-url', {
      success: true,
      format: 'mp4',
      isTransparent: false,
      version: pkg.version,
    })
  );

  // Verify success class is applied
  await waitFor(() => expect(copyBtn).toHaveClass('copy-button--success'));
  // Verify success icon is present
  expect(copyBtn.querySelector('.icon-success')).toBeInTheDocument();
});

test('SuccessView renders donation support link and tracks click', () => {
  render(
    <SuccessView
      fileName="test.mp4"
      fileSize="1.2 MB"
      renderedUrl="blob:test"
      mimeType="video/mp4"
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

  fireEvent.click(sponsorLink);
  expect(trackMock).toHaveBeenCalledWith('click-sponsor', {
    location: 'success-view',
    version: pkg.version,
  });
});

test('SuccessView renders img tag for png/gif (image/ MIME types)', () => {
  const { rerender } = render(
    <SuccessView
      fileName="test.png"
      fileSize="100 KB"
      renderedUrl="blob:test.png"
      mimeType="image/png"
      onDownload={vi.fn()}
      onBack={vi.fn()}
    />
  );
  expect(screen.getByRole('img')).toBeInTheDocument();
  expect(screen.getByRole('img')).toHaveAttribute('src', 'blob:test.png');
  expect(screen.queryByTestId('video-preview')).not.toBeInTheDocument();

  rerender(
    <SuccessView
      fileName="test.gif"
      fileSize="100 KB"
      renderedUrl="blob:test.gif"
      mimeType="image/gif"
      onDownload={vi.fn()}
      onBack={vi.fn()}
    />
  );
  expect(screen.getByRole('img')).toBeInTheDocument();
  expect(screen.getByRole('img')).toHaveAttribute('src', 'blob:test.gif');
  expect(screen.queryByTestId('video-preview')).not.toBeInTheDocument();
});
