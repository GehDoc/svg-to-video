export * from './metadata.js';
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

export type RendererMessage =
  | { type: 'LOAD_SVG'; payload: LoadSvgPayload }
  | { type: 'SEEK'; payload: SeekPayload }
  | { type: 'CAPTURE'; payload: CapturePayload }
  | { type: 'READY' }
  | { type: 'SEEKED' }
  | { type: 'CAPTURE_RESULT'; payload: ImageBitmap }
  | { type: 'SCRIPT_LOADED' };

export function isRendererMessage(data: unknown): data is RendererMessage {
  return (
    !!data &&
    typeof data === 'object' &&
    'type' in data &&
    typeof (data as { type: unknown }).type === 'string' &&
    [
      'LOAD_SVG',
      'SEEK',
      'CAPTURE',
      'READY',
      'SEEKED',
      'CAPTURE_RESULT',
      'SCRIPT_LOADED',
    ].includes((data as { type: string }).type)
  );
}
