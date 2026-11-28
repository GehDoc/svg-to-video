import type { ResolutionPreset } from '../hooks/useRenderer';
import type { VideoMetadata } from '../../../shared/metadata';

export interface StudioConfig {
  duration: number;
  hold: number;
  fps: number;
  preset: ResolutionPreset;
  scale: number;
  backgroundColor: string;
  format: string;
  isTransparent: boolean;
  captureMethod: 'optimal' | 'high-fidelity';
  metadata: VideoMetadata;
  loop: boolean;
}

export const DEFAULT_STUDIO_CONFIG: Readonly<StudioConfig> = Object.freeze({
  duration: 5,
  hold: 0,
  fps: 24,
  preset: 'original',
  scale: 1,
  backgroundColor: '#ffffff',
  format: 'mp4',
  isTransparent: false,
  captureMethod: 'high-fidelity',
  loop: true,
  metadata: Object.freeze({
    title: '',
    comment: '',
  }),
});

export interface StudioSourceState {
  svgContent: string | null;
  fileName: string;
  detectedDuration?: number;
  originalDim: {
    width: number;
    height: number;
    isDimensionsDetected: boolean;
  };
}

export const DEFAULT_SOURCE_STATE: Readonly<StudioSourceState> = Object.freeze({
  svgContent: null,
  fileName: 'animation.mp4',
  detectedDuration: undefined,
  originalDim: Object.freeze({
    width: 0,
    height: 0,
    isDimensionsDetected: false,
  }),
});
