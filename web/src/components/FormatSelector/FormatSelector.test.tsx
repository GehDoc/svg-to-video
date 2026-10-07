// @vitest-environment jsdom
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { FormatSelector } from './FormatSelector';
import type { VideoFormat } from '../../utils/discoverFormats';

describe('FormatSelector', () => {
  afterEach(() => {
    cleanup();
  });
  const mockFormats: VideoFormat[] = [
    {
      id: 'webm',
      label: 'WebM',
      supportsAlpha: true,
      supportsMetadata: true,
      extension: '.webm',
      mimeType: 'video/webm',
      needsColorKeying: false,
    },
    {
      id: 'mp4',
      label: 'MP4',
      supportsAlpha: false,
      supportsMetadata: true,
      extension: '.mp4',
      mimeType: 'video/mp4',
      needsColorKeying: false,
    },
    {
      id: 'apng',
      label: 'aPNG',
      supportsAlpha: true,
      supportsMetadata: false,
      extension: '.png',
      mimeType: 'image/png',
      needsColorKeying: false,
    },
    {
      id: 'gif',
      label: 'GIF',
      supportsAlpha: true,
      supportsMetadata: false,
      extension: '.gif',
      mimeType: 'image/gif',
      needsColorKeying: true,
    },
  ];

  it('should render options grouped by alpha support', () => {
    render(
      <FormatSelector formats={mockFormats} value="mp4" onChange={vi.fn()} />
    );

    const groups = screen.getAllByRole('group');
    expect(groups.length).toBe(2);
    expect(groups[0].getAttribute('label')).toBe('Supports Alpha');
    expect(groups[1].getAttribute('label')).toBe('Standard');

    // Check individual options in groups
    const alphaOptions = Array.from(groups[0].querySelectorAll('option')).map(
      (o) => o.value
    );
    expect(alphaOptions).toContain('webm');
    expect(alphaOptions).toContain('apng');
    expect(alphaOptions).toContain('gif');

    const standardOptions = Array.from(
      groups[1].querySelectorAll('option')
    ).map((o) => o.value);
    expect(standardOptions).toContain('mp4');
  });

  it('should call onChange when selection changes', () => {
    const handleChange = vi.fn();
    render(
      <FormatSelector
        formats={mockFormats}
        value="mp4"
        onChange={handleChange}
      />
    );

    const select = screen.getByLabelText('Output Format') as HTMLSelectElement;

    fireEvent.change(select, { target: { value: 'webm' } });

    expect(handleChange).toHaveBeenCalledWith('webm');
  });

  it('should disable unsupported options and append (Unsupported) to label', () => {
    const formatsWithUnsupported: VideoFormat[] = [
      {
        id: 'webm',
        label: 'WebM',
        supportsAlpha: true,
        supportsMetadata: true,
        extension: '.webm',
        mimeType: 'video/webm',
        needsColorKeying: false,
        isSupported: true,
      },
      {
        id: 'mp4',
        label: 'MP4',
        supportsAlpha: false,
        supportsMetadata: true,
        extension: '.mp4',
        mimeType: 'video/mp4',
        needsColorKeying: false,
        isSupported: false,
      },
    ];

    render(
      <FormatSelector
        formats={formatsWithUnsupported}
        value="webm"
        onChange={vi.fn()}
      />
    );

    const webmOption = screen.getByRole('option', {
      name: 'WebM',
    }) as HTMLOptionElement;
    const mp4Option = screen.getByRole('option', {
      name: 'MP4 (Unsupported)',
    }) as HTMLOptionElement;

    expect(webmOption.disabled).toBe(false);
    expect(mp4Option.disabled).toBe(true);
    expect(mp4Option.textContent).toContain('(Unsupported)');
  });
});
