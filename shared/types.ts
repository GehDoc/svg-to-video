export type RendererMessageType =
  | 'LOAD_SVG'
  | 'SEEK'
  | 'CAPTURE'
  | 'READY'
  | 'SEEKED'
  | 'CAPTURE_RESULT'
  | 'SCRIPT_LOADED';

export interface LoadSvgPayload {
  svgContent: string;
  width: number;
  height: number;
  timeMs: number;
}

export interface SeekPayload {
  timeMs: number;
}

export interface CapturePayload {
  method: 'optimal' | 'high-fidelity';
  transparent: boolean;
}

export interface RendererMessage {
  type: RendererMessageType;
  payload?: unknown;
}
