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
  return (
    <div className="input-group">
      <label htmlFor="format">Output Format</label>
      <select
        id="format"
        role="combobox"
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
              <option key={f.id} value={f.id}>
                {f.label}
              </option>
            ))}
        </optgroup>
        <optgroup label="Standard">
          {formats
            .filter((f) => !f.supportsAlpha)
            .map((f) => (
              <option key={f.id} value={f.id}>
                {f.label}
              </option>
            ))}
        </optgroup>
      </select>
    </div>
  );
};
