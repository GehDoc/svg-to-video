import { createContext } from 'react';
import type { RendererHandle } from '../components/SvgRenderer';
import { type ResolutionPreset, type RenderState } from '../hooks/useRenderer';

export interface StudioContextType {
  svgContent: string | null;
  setSvgContent: (content: string | null) => void;
  fileName: string;
  setFileName: (name: string) => void;
  duration: number;
  setDuration: (d: number) => void;
  hold: number;
  setHold: (h: number) => void;
  fps: number;
  setFps: (f: number) => void;
  preset: ResolutionPreset;
  setPreset: (p: ResolutionPreset) => void;
  scale: number;
  setScale: (s: number) => void;
  backgroundColor: string;
  setBackgroundColor: (c: string) => void;
  captureMethod: 'optimal' | 'high-fidelity';
  setCaptureMethod: (m: 'optimal' | 'high-fidelity') => void;
  isDragging: boolean;
  setIsDragging: (d: boolean) => void;
  renderedUrl: string | null;
  setRenderedUrl: (url: string | null) => void;
  fileSize: string | null;
  setFileSize: (size: string | null) => void;
  originalDim: { width: number; height: number; isDimensionsDetected: boolean };
  targetDim: { width: number; height: number };
  state: RenderState;
  handleStartRender: () => Promise<void>;
  cancel: () => void;
  downloadResult: () => void;
  rendererRef: React.RefObject<RendererHandle | null>;
}

export const StudioContext = createContext<StudioContextType | undefined>(
  undefined
);
