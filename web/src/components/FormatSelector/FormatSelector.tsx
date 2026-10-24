import { type ChangeEvent } from 'react';
import type { VideoFormat } from '../../utils/discoverFormats';

interface FormatSelectorProps {
  formats: VideoFormat[];
  value: string;
  onChange: (formatId: string) => void;
  disabled?: boolean;
}

export const FormatSelector = ({
  formats,
  value,
  onChange,
  disabled,
}: FormatSelectorProps) => {
  const hasUnsupportedFormats = formats.some((f) => f.isSupported === false);

  return (
    <div className="input-group">
      <label htmlFor="format">Output Format</label>
      <select
        id="format"
        value={value}
        onChange={(e: ChangeEvent<HTMLSelectElement>) =>
          onChange(e.target.value)
        }
        disabled={disabled || formats.length === 0}
      >
        <optgroup label="Supports Alpha">
          {formats
            .filter((f) => f.supportsAlpha)
            .map((f) => (
              <option
                key={f.id}
                value={f.id}
                disabled={f.isSupported === false}
              >
                {f.label}
              </option>
            ))}
        </optgroup>
        <optgroup label="Standard">
          {formats
            .filter((f) => !f.supportsAlpha)
            .map((f) => (
              <option
                key={f.id}
                value={f.id}
                disabled={f.isSupported === false}
              >
                {f.label}
              </option>
            ))}
        </optgroup>
      </select>
      {hasUnsupportedFormats && (
        <p className="hint-text hint-text--info">
          Some formats are disabled because they are not supported by your
          browser.
        </p>
      )}
    </div>
  );
};
