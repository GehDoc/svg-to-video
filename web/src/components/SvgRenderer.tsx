import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { seekAnimations } from '../../../shared/animation-engine';

export interface RendererHandle {
  loadSvg: (svgContent: string, width: number, height: number) => Promise<void>;
  seek: (timeMs: number) => Promise<void>;
  capture: (method: 'optimal' | 'high-fidelity') => Promise<ImageBitmap>;
  isReady: () => boolean;
}

const SvgRenderer = forwardRef<RendererHandle>((_, ref) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [ready, setReady] = useState(false);

  useImperativeHandle(ref, () => ({
    loadSvg: async (svgContent: string, width: number, height: number) => {
      setReady(false);
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
      doc.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body, html { margin: 0; padding: 0; overflow: hidden; width: 100%; height: 100%; background: transparent; }
              svg { display: block; width: ${width}px; height: ${height}px; }
              canvas { display: none; }
            </style>
          </head>
          <body>
            <div id="svg-container">${pausedSvg}</div>
            <canvas id="capture-canvas" width="${width}" height="${height}"></canvas>
            <script>
              window.seekAnimations = ${seekAnimations.toString()};

              const OPTIMAL_PROPS = [
                'fill', 'fill-opacity', 'fill-rule', 'stroke', 'stroke-opacity', 'stroke-width',
                'stroke-linecap', 'stroke-linejoin', 'stroke-miterlimit', 'stroke-dasharray',
                'stroke-dashoffset', 'opacity', 'display', 'visibility', 'filter', 'mask',
                'clip-path', 'clip-rule', 'stop-color', 'stop-opacity',
                'font-family', 'font-size', 'font-weight', 'font-style', 'text-anchor',
                'text-decoration', 'dominant-baseline', 'alignment-baseline', 'baseline-shift',
                'transform', 'transform-origin', 'x', 'y', 'width', 'height', 'cx', 'cy', 'r',
                'rx', 'ry', 'color', 'flood-color', 'flood-opacity',
                'lighting-color', 'mix-blend-mode', 'isolation'
              ];
              
              window.captureFrame = async (method) => {
                const svg = document.querySelector('svg');
                const canvas = document.getElementById('capture-canvas');
                const ctx = canvas.getContext('2d');
                
                const clone = svg.cloneNode(true);
                const originalElements = [svg, ...Array.from(svg.querySelectorAll('*'))];
                const cloneElements = [clone, ...Array.from(clone.querySelectorAll('*'))];
                
                originalElements.forEach((el, i) => {
                  const style = window.getComputedStyle(el);
                  const cloneEl = cloneElements[i];
                  if (!cloneEl || !cloneEl.style) return;
                  
                  if (method === 'high-fidelity') {
                    for (let j = 0; j < style.length; j++) {
                      const prop = style[j];
                      cloneEl.style.setProperty(prop, style.getPropertyValue(prop), style.getPropertyPriority(prop));
                    }
                  } else {
                    for (const prop of OPTIMAL_PROPS) {
                      const val = style.getPropertyValue(prop);
                      if (val) cloneEl.style.setProperty(prop, val);
                    }
                  }
                });
                
                const svgData = new XMLSerializer().serializeToString(clone);
                const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
                const url = URL.createObjectURL(svgBlob);
                
                const img = new Image();
                await new Promise((resolve, reject) => {
                  img.onload = resolve;
                  img.onerror = reject;
                  img.src = url;
                });
                
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, 0, 0);
                URL.revokeObjectURL(url);
                
                return createImageBitmap(canvas);
              };

              window.checkAssets = async () => {
                await document.fonts.ready;
                const images = Array.from(document.querySelectorAll('image, img'));
                await Promise.all(images.map(image => {
                  if (image.complete) return Promise.resolve();
                  return new Promise(resolve => {
                    image.onload = resolve;
                    image.onerror = resolve; // Continue even on error
                  });
                }));
              };
            </script>
          </body>
        </html>
      `);
      doc.close();

      // Wait for iframe scripts to load and fonts to be ready
      await new Promise((resolve) => {
        iframe.onload = resolve;
      });

      await (iframe.contentWindow as any).checkAssets();

      setReady(true);
    },

    seek: async (timeMs: number) => {
      const win = iframeRef.current?.contentWindow as any;
      if (win?.seekAnimations) {
        win.seekAnimations(timeMs);
        // Wait for next frame to ensure rendering
        await new Promise((r) => win.requestAnimationFrame(r));
      }
    },

    capture: async (method: 'optimal' | 'high-fidelity') => {
      const win = iframeRef.current?.contentWindow as any;
      if (win?.captureFrame) {
        return await win.captureFrame(method);
      }
      throw new Error('Capture method not available in iframe');
    },

    isReady: () => ready,
  }));

  return (
    <div className="renderer-monitor">
      <p className="monitor-label">Live Monitor</p>
      <iframe
        ref={iframeRef}
        title="svg-renderer"
        style={{
          width: '100%',
          height: '100%',
          border: 'none',
          pointerEvents: 'none',
          backgroundColor: 'white',
        }}
      />
    </div>
  );
});

SvgRenderer.displayName = 'SvgRenderer';

export default SvgRenderer;
