import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { SeoFallback } from './SeoFallback';

describe('SeoFallback', () => {
  it('renders the branding title and badge', () => {
    render(<SeoFallback />);
    expect(screen.getByText(/SVG to Video/i)).toBeDefined();
    expect(screen.getAllByText(/STUDIO/i)).toBeDefined();
  });

  it('contains the SEO description with WebCodecs', () => {
    render(<SeoFallback />);
    expect(screen.getByText(/alpha-channel transparency/i)).toBeDefined();
    expect(screen.getByText(/WebCodecs/i)).toBeDefined();
  });

  it('provides links to GitHub and License', () => {
    render(<SeoFallback />);
    const githubLink = screen.getByRole('link', { name: /View on GitHub/i });
    expect(githubLink.getAttribute('href')).toContain('github.com');
  });
});
