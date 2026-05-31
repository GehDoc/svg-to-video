// @vitest-environment jsdom
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { FormatSelector } from './FormatSelector';
import type { VideoFormat } from '../../utils/discoverFormats';
import * as Mediabunny from 'mediabunny';

class MockOutputFormat extends Mediabunny.OutputFormat {
  getSupportedCodecs() {
    return [];
  }
  getSupportedTrackCounts() {
    return {
      total: { min: 0, max: 3 },
      video: { min: 0, max: 1 },
      audio: { min: 0, max: 1 },
      subtitle: { min: 0, max: 1 },
    };
  }

  get fileExtension() {
    return '.mp4';
  }
  get mimeType() {
    return 'video/mp4';
  }
  get supportsVideoRotationMetadata() {
    return false;
  }
  get supportsTimestampedMediaData() {
    return false;
  }
}

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
      OutputFormatClass: MockOutputFormat,
    },
    {
      id: 'mp4',
      label: 'MP4',
      supportsAlpha: false,
      supportsMetadata: true,
      extension: '.mp4',
      mimeType: 'video/mp4',
      OutputFormatClass: MockOutputFormat,
    },
    {
      id: 'apng',
      label: 'aPNG',
      supportsAlpha: true,
      supportsMetadata: false,
      extension: '.png',
      mimeType: 'image/png',
      OutputFormatClass: MockOutputFormat,
    },
    {
      id: 'gif-transparent',
      label: 'GIF (Transparent)',
      supportsAlpha: true,
      supportsMetadata: false,
      extension: '.gif',
      mimeType: 'image/gif',
      OutputFormatClass: MockOutputFormat,
    },
    {
      id: 'gif',
      label: 'GIF',
      supportsAlpha: false,
      supportsMetadata: false,
      extension: '.gif',
      mimeType: 'image/gif',
      OutputFormatClass: MockOutputFormat,
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
    expect(alphaOptions).toContain('gif-transparent');

    const standardOptions = Array.from(
      groups[1].querySelectorAll('option')
    ).map((o) => o.value);
    expect(standardOptions).toContain('mp4');
    expect(standardOptions).toContain('gif');
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
});
