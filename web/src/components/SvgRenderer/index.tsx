import {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
  useEffect,
  useCallback,
  memo,
} from 'react';
import { seekAnimations } from '@shared/animation-engine';
import { getRendererScript } from './renderer';
import rendererTemplate from './renderer.html?raw';
import './SvgRenderer.scss';

export interface RendererHandle {
  loadSvg: (svgContent: string, width: number, height: number) => Promise<void>;
  seek: (timeMs: number) => Promise<void>;
  capture: (
    method: 'optimal' | 'high-fidelity',
    transparent: boolean
  ) => Promise<ImageBitmap>;
  isReady: () => boolean;
}

interface SvgRendererProps {
  svgContent?: string | null;
  width?: number;
  height?: number;
  backgroundColor?: string;
  isTransparent?: boolean;
  isRendering?: boolean;
}

const SvgRenderer = memo(
  forwardRef<RendererHandle, SvgRendererProps>(
    (
      {
        svgContent,
        width,
        height,
        backgroundColor,
        isTransparent,
        isRendering,
      },
      ref
    ) => {
      const iframeRef = useRef<HTMLIFrameElement>(null);
      const [ready, setReady] = useState(false);
      const [scriptLoaded, setScriptLoaded] = useState(false);
      const [dimensions, setDimensions] = useState({
        width: width || 0,
        height: height || 0,
      });

      // Initialize iframe with blob to ensure COOP/COEP header inheritance
      useEffect(() => {
        const parentOrigin = window.location.origin;
        const rendererScript = `(${getRendererScript.toString()})(window.seekAnimations, "${parentOrigin}");`;
        const html = rendererTemplate.replace(
          '// RENDERER_SCRIPT_PLACEHOLDER',
          `
        window.seekAnimations = ${seekAnimations.toString()};
        ${rendererScript}
      `
        );

        const handler = (event: MessageEvent) => {
          const parentOrigin = window.location.origin;
          // Sandboxed iframes might have origin "null" or the parent's origin
          if (
            (event.origin !== 'null' && event.origin !== parentOrigin) ||
            event.source !== iframeRef.current?.contentWindow
          ) {
            return;
          }

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
        async (
          targetSvgcontent: string,
          targetWidth: number,
          targetHeight: number
        ) => {
          setReady(false);
          setDimensions({ width: targetWidth, height: targetHeight });
          const iframe = iframeRef.current;
          if (!iframe) {
            return;
          }

          // Wait for script to be loaded if it hasn't already
          if (!scriptLoaded) {
            await new Promise<void>((resolve) => {
              const handler = (event: MessageEvent) => {
                const parentOrigin = window.location.origin;
                if (
                  (event.origin === 'null' || event.origin === parentOrigin) &&
                  event.source === iframe.contentWindow &&
                  event.data.type === 'SCRIPT_LOADED'
                ) {
                  window.removeEventListener('message', handler);
                  resolve();
                }
              };
              window.addEventListener('message', handler);
            });
          }

          return new Promise<void>((resolve) => {
            const handler = (event: MessageEvent) => {
              const parentOrigin = window.location.origin;
              if (
                (event.origin === 'null' || event.origin === parentOrigin) &&
                event.source === iframe.contentWindow &&
                event.data.type === 'READY'
              ) {
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
                  svgContent: targetSvgcontent,
                  width: targetWidth,
                  height: targetHeight,
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
        if (
          svgContent &&
          width &&
          height &&
          (!isRendering || dimensions.width === 0)
        ) {
          // No delay on first load to make it feel snappier, 100ms delay for subsequent updates (e.g. scale slider)
          const delay = dimensions.width === 0 ? 0 : 100;
          const timeoutId = setTimeout(() => {
            internalLoad(svgContent, width, height);
          }, delay);
          return () => clearTimeout(timeoutId);
        }
      }, [
        svgContent,
        width,
        height,
        isRendering,
        dimensions.width,
        internalLoad,
      ]);

      useImperativeHandle(ref, () => ({
        loadSvg: internalLoad,

        seek: async (timeMs: number) => {
          return new Promise<void>((resolve) => {
            const iframe = iframeRef.current;
            const handler = (event: MessageEvent) => {
              const parentOrigin = window.location.origin;
              if (
                (event.origin === 'null' || event.origin === parentOrigin) &&
                event.source === iframe?.contentWindow &&
                event.data.type === 'SEEKED'
              ) {
                window.removeEventListener('message', handler);
                resolve();
              }
            };
            window.addEventListener('message', handler);
            iframe?.contentWindow?.postMessage(
              { type: 'SEEK', payload: { timeMs } },
              '*'
            );
          });
        },

        capture: async (
          method: 'optimal' | 'high-fidelity',
          transparent: boolean
        ) => {
          return new Promise<ImageBitmap>((resolve) => {
            const iframe = iframeRef.current;
            const handler = (event: MessageEvent) => {
              const parentOrigin = window.location.origin;
              if (
                (event.origin === 'null' || event.origin === parentOrigin) &&
                event.source === iframe?.contentWindow &&
                event.data.type === 'CAPTURE_RESULT'
              ) {
                window.removeEventListener('message', handler);
                resolve(event.data.payload);
              }
            };
            window.addEventListener('message', handler);
            iframe?.contentWindow?.postMessage(
              { type: 'CAPTURE', payload: { method, transparent } },
              '*'
            );
          });
        },

        isReady: () => ready,
      }));

      return (
        <div className="renderer-monitor" data-testid="svg-renderer">
          <p className="monitor-label">Live Monitor</p>
          <div
            className="monitor-viewport"
            style={{
              backgroundColor: isTransparent ? 'transparent' : backgroundColor,
              backgroundImage: isTransparent
                ? 'repeating-conic-gradient(#ccc 0% 25%, #fff 0% 50%)'
                : 'none',
              backgroundSize: isTransparent ? '20px 20px' : 'auto',
            }}
          >
            <iframe
              ref={iframeRef}
              title="svg-renderer"
              sandbox="allow-scripts"
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
  )
);

SvgRenderer.displayName = 'SvgRenderer';

export default SvgRenderer;
