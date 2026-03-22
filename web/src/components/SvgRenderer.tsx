import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { getIframeTemplate } from './SvgRenderer.template';

export interface RendererHandle {
  loadSvg: (svgContent: string, width: number, height: number) => Promise<void>;
  seek: (timeMs: number) => Promise<void>;
  capture: (method: 'optimal' | 'high-fidelity') => Promise<ImageBitmap>;
  isReady: () => boolean;
}

interface RendererWindow extends Window {
  checkAssets?: () => Promise<void>;
  seekAnimations?: (timeMs: number) => void;
  captureFrame?: (method: 'optimal' | 'high-fidelity') => Promise<ImageBitmap>;
}

const SvgRenderer = forwardRef<RendererHandle>((_, ref) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [ready, setReady] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useImperativeHandle(ref, () => ({
    loadSvg: async (svgContent: string, width: number, height: number) => {
      setReady(false);
      setDimensions({ width, height });
      const iframe = iframeRef.current;
      if (!iframe) return;

      const doc = iframe.contentDocument || iframe.contentWindow?.document;
      if (!doc) throw new Error('Could not access iframe document');

      // Ensure animations are paused via CSS variable if used
      const pausedSvg = svgContent.replace(
        /--play-state:\s*running\s*;/g,
        '--play-state: paused;'
      );

      doc.open();
      doc.write(getIframeTemplate(pausedSvg, width, height));
      doc.close();

      // Wait for iframe scripts to load and fonts to be ready
      await new Promise((resolve) => {
        iframe.onload = resolve;
      });

      await (iframe.contentWindow as RendererWindow).checkAssets?.();

      setReady(true);
    },

    seek: async (timeMs: number) => {
      const win = iframeRef.current?.contentWindow as RendererWindow;
      if (win?.seekAnimations) {
        win.seekAnimations(timeMs);
        // Wait for next frame to ensure rendering
        await new Promise((r) => win.requestAnimationFrame(r));
      }
    },

    capture: async (method: 'optimal' | 'high-fidelity') => {
      const win = iframeRef.current?.contentWindow as RendererWindow;
      if (win?.captureFrame) {
        const result = await win.captureFrame(method);
        if (!result) throw new Error('Capture failed: No result from iframe');
        return result;
      }
      throw new Error('Capture method not available in iframe');
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
