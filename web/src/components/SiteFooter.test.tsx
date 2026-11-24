/**
 * @vitest-environment jsdom
 */
import { render, screen, fireEvent } from '@testing-library/react';
import { SiteFooter } from './SiteFooter';
import { expect, test, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';

test('SiteFooter renders brand, version, license, ecosystem links, and back to top', () => {
  const trackMock = vi.fn();
  vi.stubGlobal('umami', { track: trackMock });

  render(<SiteFooter />);

  expect(screen.getByText(/SVG to Video Studio/i)).toBeInTheDocument();
  expect(screen.getByText(/100% client-side rendering/i)).toBeInTheDocument();
  expect(
    screen.getByRole('link', { name: /MIT License/i })
  ).toBeInTheDocument();

  // Ecosystem links
  const githubLink = screen.getByRole('link', { name: /GitHub ↗/i });
  expect(githubLink).toBeInTheDocument();
  fireEvent.click(githubLink);
  expect(trackMock).toHaveBeenCalledWith(
    'click-source-code',
    expect.anything()
  );

  expect(screen.getByRole('link', { name: /npm ↗/i })).toBeInTheDocument();
  expect(
    screen.getByRole('link', { name: /Docker Hub ↗/i })
  ).toBeInTheDocument();
  expect(
    screen.getByRole('link', { name: /MCP Registry ↗/i })
  ).toBeInTheDocument();
  expect(
    screen.getByRole('link', { name: /HuggingFace Space ↗/i })
  ).toBeInTheDocument();

  const bugLink = screen.getByRole('link', { name: /Report an Issue ↗/i });
  expect(bugLink).toBeInTheDocument();
  fireEvent.click(bugLink);
  expect(trackMock).toHaveBeenCalledWith(
    'click-issue-report',
    expect.anything()
  );

  // Back to top
  expect(
    screen.getByRole('link', { name: /Back to top/i })
  ).toBeInTheDocument();
});
