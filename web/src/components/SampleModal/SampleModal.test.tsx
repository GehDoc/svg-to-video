/**
 * @vitest-environment jsdom
 */
import { render, screen, fireEvent } from '@testing-library/react';
import { SampleModal } from './SampleModal';
import { SAMPLES } from '../../utils/samples';
import { expect, test, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';

test('SampleModal does not render anything when isOpen is false', () => {
  render(
    <SampleModal isOpen={false} onClose={vi.fn()} onSelectSample={vi.fn()} />
  );

  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
});

test('SampleModal renders dialog and sample cards when isOpen is true', () => {
  render(
    <SampleModal isOpen={true} onClose={vi.fn()} onSelectSample={vi.fn()} />
  );

  const dialog = screen.getByRole('dialog', { name: /sample animations/i });
  expect(dialog).toBeInTheDocument();

  // Verify all samples are listed
  for (const sample of SAMPLES) {
    expect(screen.getByText(sample.name)).toBeInTheDocument();
  }
});

test('SampleModal calls onClose when clicking close button', () => {
  const onClose = vi.fn();
  render(
    <SampleModal isOpen={true} onClose={onClose} onSelectSample={vi.fn()} />
  );

  const closeBtn = screen.getByRole('button', { name: /close sample modal/i });
  fireEvent.click(closeBtn);

  expect(onClose).toHaveBeenCalledTimes(1);
});

test('SampleModal calls onClose when clicking backdrop', () => {
  const onClose = vi.fn();
  render(
    <SampleModal isOpen={true} onClose={onClose} onSelectSample={vi.fn()} />
  );

  const backdrop = screen.getByTestId('sample-modal-backdrop');
  fireEvent.click(backdrop);

  expect(onClose).toHaveBeenCalledTimes(1);
});

test('SampleModal calls onClose when pressing Escape key', () => {
  const onClose = vi.fn();
  render(
    <SampleModal isOpen={true} onClose={onClose} onSelectSample={vi.fn()} />
  );

  fireEvent.keyDown(window, { key: 'Escape' });

  expect(onClose).toHaveBeenCalledTimes(1);
});

test('SampleModal calls onSelectSample and onClose when a sample is selected', () => {
  const onSelectSample = vi.fn();
  const onClose = vi.fn();
  render(
    <SampleModal
      isOpen={true}
      onClose={onClose}
      onSelectSample={onSelectSample}
    />
  );

  const firstSampleBtn = screen.getByRole('button', {
    name: new RegExp(`Test ${SAMPLES[0].name} sample`, 'i'),
  });
  fireEvent.click(firstSampleBtn);

  expect(onSelectSample).toHaveBeenCalledWith(SAMPLES[0]);
  expect(onClose).toHaveBeenCalledTimes(1);
});
