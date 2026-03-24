import {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
  useEffect,
} from 'react';
import { seekAnimations } from '@shared/animation-engine';
import { getRendererScript } from './renderer';
import rendererTemplate from './renderer.html?raw';

export interface RendererHandle {
  loadSvg: (
    svgContent: string,
    width: number,
    height: number,
    backgroundColor: string
  ) => Promise<void>;
  seek: (timeMs: number) => Promise<void>;
  capture: (method: 'optimal' | 'high-fidelity') => Promise<ImageBitmap>;
  isReady: () => boolean;
}

const SvgRenderer = forwardRef<RendererHandle>((_, ref) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [ready, setReady] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Initialize iframe with blob to ensure COOP/COEP header inheritance
  useEffect(() => {
    const rendererScript = `(${getRendererScript.toString()})(window.seekAnimations);`;
    const html = rendererTemplate.replace(
      '// RENDERER_SCRIPT_PLACEHOLDER',
      `
      window.seekAnimations = ${seekAnimations.toString()};
      ${rendererScript}
    `
    );
    const blob = new Blob([html], { type: 'text/html' });
    if (iframeRef.current) {
      iframeRef.current.src = URL.createObjectURL(blob);
    }
  }, []);

  useImperativeHandle(ref, () => ({
    loadSvg: async (
      svgContent: string,
      width: number,
      height: number,
      backgroundColor: string
    ) => {
      setReady(false);
      setDimensions({ width, height });
      const iframe = iframeRef.current;
      if (!iframe) return;

      return new Promise<void>((resolve) => {
        const handler = (event: MessageEvent) => {
          if (event.data.type === 'READY') {
            window.removeEventListener('message', handler);
            setReady(true);
            resolve();
          }
        };
        window.addEventListener('message', handler);
        iframe.contentWindow?.postMessage(
          {
            type: 'LOAD_SVG',
            payload: { svgContent, width, height, backgroundColor },
          },
          '*'
        );
      });
    },

    seek: async (timeMs: number) => {
      return new Promise<void>((resolve) => {
        const handler = (event: MessageEvent) => {
          if (event.data.type === 'SEEKED') {
            window.removeEventListener('message', handler);
            resolve();
          }
        };
        window.addEventListener('message', handler);
        iframeRef.current?.contentWindow?.postMessage(
          { type: 'SEEK', payload: { timeMs } },
          '*'
        );
      });
    },

    capture: async (method: 'optimal' | 'high-fidelity') => {
      return new Promise<ImageBitmap>((resolve) => {
        const handler = (event: MessageEvent) => {
          if (event.data.type === 'CAPTURE_RESULT') {
            window.removeEventListener('message', handler);
            resolve(event.data.payload);
          }
        };
        window.addEventListener('message', handler);
        iframeRef.current?.contentWindow?.postMessage(
          { type: 'CAPTURE', payload: { method } },
          '*'
        );
      });
    },

    isReady: () => ready,
  }));

  return (
    <div className="renderer-monitor">
      <p className="monitor-label">Live Monitor</p>
      <div className="monitor-viewport">
        <iframe
          ref={iframeRef}
          title="svg-renderer"
          style={{
            width: dimensions.width,
            height: dimensions.height,
            maxWidth: '100%',
            maxHeight: '100%',
            aspectRatio: `${dimensions.width} / ${dimensions.height}`,
            border: 'none',
            pointerEvents: 'none',
            backgroundColor: 'white',
          }}
        />
      </div>
    </div>
  );
});

SvgRenderer.displayName = 'SvgRenderer';

export default SvgRenderer;
