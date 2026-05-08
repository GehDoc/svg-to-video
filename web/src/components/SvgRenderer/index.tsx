import {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
  useEffect,
  useCallback,
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

interface SvgRendererProps {
  svgContent?: string | null;
  width?: number;
  height?: number;
  backgroundColor?: string;
  isRendering?: boolean;
}

const SvgRenderer = forwardRef<RendererHandle, SvgRendererProps>(
  ({ svgContent, width, height, backgroundColor, isRendering }, ref) => {
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const [ready, setReady] = useState(false);
    const [scriptLoaded, setScriptLoaded] = useState(false);
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

      const handler = (event: MessageEvent) => {
        if (event.data.type === 'SCRIPT_LOADED') {
          setScriptLoaded(true);
        }
      };
      window.addEventListener('message', handler);

      const blob = new Blob([html], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      if (iframeRef.current) {
        iframeRef.current.src = url;
      }

      return () => {
        URL.revokeObjectURL(url);
        window.removeEventListener('message', handler);
      };
    }, []);

    const internalLoad = useCallback(
      async (s: string, w: number, h: number, b: string) => {
        setReady(false);
        setDimensions({ width: w, height: h });
        const iframe = iframeRef.current;
        if (!iframe) {
          return;
        }

        // Wait for script to be loaded if it hasn't already
        if (!scriptLoaded) {
          await new Promise<void>((resolve) => {
            const handler = (event: MessageEvent) => {
              if (event.data.type === 'SCRIPT_LOADED') {
                window.removeEventListener('message', handler);
                resolve();
              }
            };
            window.addEventListener('message', handler);
          });
        }

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
              payload: {
                svgContent: s,
                width: w,
                height: h,
                backgroundColor: b,
                timeMs: 0,
              },
            },
            '*'
          );
        });
      },
      [scriptLoaded]
    );

    // Sync from Props (Debounced Preview)
    useEffect(() => {
      if (svgContent && width && height && backgroundColor && !isRendering) {
        const timeoutId = setTimeout(() => {
          internalLoad(svgContent, width, height, backgroundColor);
        }, 100);
        return () => clearTimeout(timeoutId);
      }
    }, [svgContent, width, height, backgroundColor, isRendering, internalLoad]);

    useImperativeHandle(ref, () => ({
      loadSvg: internalLoad,

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
      <div className="renderer-monitor" data-testid="svg-renderer">
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
              backgroundColor: 'transparent',
            }}
          />
        </div>
      </div>
    );
  }
);

SvgRenderer.displayName = 'SvgRenderer';

export default SvgRenderer;
