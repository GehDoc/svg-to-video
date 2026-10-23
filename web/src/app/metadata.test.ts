import { describe, expect, it } from 'vitest';
import { metadata } from './layout';

describe('Home Page Metadata', () => {
  it('has a description meta content length between 25 and 158 characters', () => {
    const description = metadata.description;
    expect(typeof description).toBe('string');
    if (typeof description === 'string') {
      expect(description.length).toBeGreaterThanOrEqual(25);
      expect(description.length).toBeLessThanOrEqual(158);
    }
  });
});
