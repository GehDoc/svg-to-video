// @vitest-environment jsdom
import {
  render,
  cleanup,
  waitFor,
  screen,
  fireEvent,
  within,
} from '@testing-library/react';
import { test, expect, vi, afterEach } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { Studio } from './Studio';
import { Providers } from './Providers';
import { QueryClient } from '@tanstack/react-query';

const createHermeticQueryClient = () => {
  const client = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        staleTime: Infinity,
      },
    },
  });
  client.setQueryData(['github-repo-stars'], 100);
  return client;
};

vi.mock('./SvgRenderer', () => ({
  default: ({
    svgContent,
    width,
    height,
    backgroundColor,
  }: {
    svgContent: string;
    width: number;
    height: number;
    backgroundColor: string;
  }) => (
    <div data-testid="mock-svg-renderer">
      {svgContent} {width}x{height} {backgroundColor}
    </div>
  ),
}));

afterEach(cleanup);

test('Studio triggers preview on SvgRenderer when svgContent is set via upload', async () => {
  render(
    <Providers queryClient={createHermeticQueryClient()}>
      <Studio />
    </Providers>
  );

  // Mock file upload
  const file = new File(['<svg><rect /></svg>'], 'test.svg', {
    type: 'image/svg+xml',
  });
  const input = screen.getByLabelText(/Drop SVG here or click to upload/i);

  fireEvent.change(input, { target: { files: [file] } });

  // Wait for the debounced effect and verify the mock renderer has the content
  await waitFor(
    () => {
      const renderer = screen.getByTestId('mock-svg-renderer');
      expect(renderer).toHaveTextContent('<svg><rect /></svg>');
      expect(renderer).toHaveTextContent('1920x1080'); // Default for unknown dimensions
      expect(renderer).toHaveTextContent('#ffffff');
    },
    { timeout: 1500 }
  );
});

test('Studio updates preview when backgroundColor changes', async () => {
  render(
    <Providers queryClient={createHermeticQueryClient()}>
      <Studio />
    </Providers>
  );

  // 1. Initial SVG set via upload
  const file = new File(['<svg />'], 'test.svg', { type: 'image/svg+xml' });
  const input = screen.getByLabelText(/Drop SVG here or click to upload/i);
  fireEvent.change(input, { target: { files: [file] } });

  await waitFor(() => {
    expect(screen.getByTestId('mock-svg-renderer')).toHaveTextContent(
      '<svg />'
    );
  });

  // 2. Change Background Color
  const colorInput = screen.getByLabelText(/Background color hex code/i);
  fireEvent.change(colorInput, { target: { value: '#ff0000' } });

  // Wait for debounce and verify color update
  await waitFor(
    () => {
      expect(screen.getByTestId('mock-svg-renderer')).toHaveTextContent(
        '#ff0000'
      );
    },
    { timeout: 1500 }
  );
});

test('Studio automatically updates duration when animated SVG is uploaded', async () => {
  render(
    <Providers queryClient={createHermeticQueryClient()}>
      <Studio />
    </Providers>
  );

  // Upload an animated SVG with 3s duration
  const animatedSvg = `
    <svg width="100" height="100">
      <rect>
        <animate attributeName="opacity" dur="3s" repeatCount="1" />
      </rect>
    </svg>
  `;
  const file = new File([animatedSvg], 'animated.svg', {
    type: 'image/svg+xml',
  });
  const input = screen.getByLabelText(/Drop SVG here or click to upload/i);

  fireEvent.change(input, { target: { files: [file] } });

  // Verify that the duration input field is updated to 3
  await waitFor(
    () => {
      const durationInput = screen.getByLabelText(
        /Dur\. \(s\)/i
      ) as HTMLInputElement;
      expect(durationInput.value).toBe('3');
    },
    { timeout: 1500 }
  );
});

test('Studio applies sample target capture settings and preserves defined capture duration', async () => {
  render(
    <Providers queryClient={createHermeticQueryClient()}>
      <Studio />
    </Providers>
  );

  // Click on "Test Rocket Launch sample" button
  const rocketBtn = screen.getByRole('button', {
    name: /Test Rocket Launch sample/i,
  });
  fireEvent.click(rocketBtn);

  await waitFor(() => {
    // Intrinsic rocket animation is 5s, but sample capture duration is 10s
    const durationInput = screen.getByLabelText(
      /Dur\. \(s\)/i
    ) as HTMLInputElement;
    expect(durationInput.value).toBe('10');

    // FPS should be set to 30
    const fpsInput = screen.getByLabelText(/FPS/i) as HTMLInputElement;
    expect(fpsInput.value).toBe('30');

    // Resolution preset should be preserved/applied
    const resolutionSelect = screen.getByLabelText(
      /Resolution/i
    ) as HTMLSelectElement;
    expect(resolutionSelect.value).toBe('original');
  });
});

test('Studio resets state and returns to landing view when clicking header home button', async () => {
  const trackMock = vi.fn();
  (window as unknown as { umami?: { track: typeof trackMock } }).umami = {
    track: trackMock,
  };

  render(
    <Providers queryClient={createHermeticQueryClient()}>
      <Studio />
    </Providers>
  );

  // 1. Initially LandingView is shown
  expect(
    screen.getByText(/Upload your animated SVG on the left/i)
  ).toBeInTheDocument();

  // 2. Select a sample to transition to RenderingView
  const rocketBtn = screen.getByRole('button', {
    name: /Test Rocket Launch sample/i,
  });
  fireEvent.click(rocketBtn);

  await waitFor(() => {
    expect(screen.getByTestId('mock-svg-renderer')).toBeInTheDocument();
  });
  expect(
    screen.queryByText(/Upload your animated SVG on the left/i)
  ).not.toBeInTheDocument();

  // 3. Click the header home button
  const homeBtn = screen.getByRole('button', { name: /svg to video home/i });
  fireEvent.click(homeBtn);

  // 4. Verify landing view is restored and mock renderer is gone
  await waitFor(() => {
    expect(
      screen.getByText(/Upload your animated SVG on the left/i)
    ).toBeInTheDocument();
  });
  expect(screen.queryByTestId('mock-svg-renderer')).not.toBeInTheDocument();

  // 5. Verify telemetry
  expect(trackMock).toHaveBeenCalledWith(
    'click-home',
    expect.objectContaining({
      location: 'header',
    })
  );
});

test('Studio resets state and returns to landing view when clicking Clear SVG in config panel', async () => {
  const trackMock = vi.fn();
  (window as unknown as { umami?: { track: typeof trackMock } }).umami = {
    track: trackMock,
  };

  render(
    <Providers queryClient={createHermeticQueryClient()}>
      <Studio />
    </Providers>
  );

  // Clear SVG button is initially present but disabled
  const initialClearBtn = screen.getByRole('button', {
    name: /clear active svg and return to home screen/i,
  });
  expect(initialClearBtn).toBeDisabled();

  // Select sample
  const rocketBtn = screen.getByRole('button', {
    name: /Test Rocket Launch sample/i,
  });
  fireEvent.click(rocketBtn);

  await waitFor(() => {
    expect(screen.getByTestId('mock-svg-renderer')).toBeInTheDocument();
  });

  // Click Clear SVG button
  const clearBtn = screen.getByRole('button', {
    name: /clear active svg and return to home screen/i,
  });
  fireEvent.click(clearBtn);

  await waitFor(() => {
    expect(
      screen.getByText(/Upload your animated SVG on the left/i)
    ).toBeInTheDocument();
  });
  expect(screen.queryByTestId('mock-svg-renderer')).not.toBeInTheDocument();

  // Verify telemetry
  expect(trackMock).toHaveBeenCalledWith(
    'click-home',
    expect.objectContaining({
      location: 'config-source',
    })
  );
});

test('Studio opens SampleModal via Browse Samples and loads selected sample', async () => {
  const trackMock = vi.fn();
  (window as unknown as { umami?: { track: typeof trackMock } }).umami = {
    track: trackMock,
  };

  render(
    <Providers queryClient={createHermeticQueryClient()}>
      <Studio />
    </Providers>
  );

  // 1. Click Browse Samples button in ConfigPanel
  const browseBtn = screen.getByRole('button', {
    name: /browse sample svg animations/i,
  });
  fireEvent.click(browseBtn);

  // 2. Verify modal opened and open-samples event tracked
  const dialog = screen.getByRole('dialog', { name: /sample animations/i });
  expect(dialog).toBeInTheDocument();
  expect(trackMock).toHaveBeenCalledWith(
    'open-samples',
    expect.objectContaining({
      location: 'config-source',
    })
  );

  // 3. Select a sample from within the modal
  const radarBtn = within(dialog).getByRole('button', {
    name: /Test Radar Scanner sample/i,
  });
  fireEvent.click(radarBtn);

  // 4. Verify modal closed and sample loaded into preview
  await waitFor(() => {
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.getByTestId('mock-svg-renderer')).toBeInTheDocument();
  });
});
