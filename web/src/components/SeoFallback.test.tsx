import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { SeoFallback } from './SeoFallback';
import { metadata } from '../app/layout';

describe('SeoFallback', () => {
  it('renders the branding title and badge', () => {
    render(<SeoFallback />);
    expect(screen.getByText(/SVG to Video/i)).toBeDefined();
    expect(screen.getAllByText(/STUDIO/i)).toBeDefined();
  });

  it('contains the SEO description with transparency support', () => {
    render(<SeoFallback />);
    expect(screen.getByText(/alpha-channel transparency/i)).toBeDefined();
    expect(screen.getByText(/animated images \(aPNG, GIF\)/i)).toBeDefined();
  });

  it('provides links to GitHub and License', () => {
    render(<SeoFallback />);
    const githubLink = screen.getByRole('link', { name: /View on GitHub/i });
    expect(githubLink.getAttribute('href')).toContain('github.com');
  });

  it('has a metadata description length between 25 and 158 characters', () => {
    const description = metadata.description;
    expect(typeof description).toBe('string');
    if (typeof description === 'string') {
      expect(description.length).toBeGreaterThanOrEqual(25);
      expect(description.length).toBeLessThanOrEqual(158);
    }
  });
});
