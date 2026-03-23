import {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
  useEffect,
} from 'react';

export interface RendererHandle {
  loadSvg: (svgContent: string, width: number, height: number) => Promise<void>;
  seek: (timeMs: number) => Promise<void>;
  capture: (method: 'optimal' | 'high-fidelity') => Promise<ImageBitmap>;
  isReady: () => boolean;
}

const SvgRenderer = forwardRef<RendererHandle>((_, ref) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [ready, setReady] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Initialize iframe with blob
  useEffect(() => {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body, html { margin: 0; padding: 0; overflow: hidden; width: 100%; height: 100%; background: transparent; }
            #svg-container { width: 100%; height: 100%; }
            svg { display: block; width: 100%; height: 100%; }
            canvas { display: none; }
          </style>
        </head>
        <body>
          <div id="svg-container"></div>
          <canvas id="capture-canvas"></canvas>
          <script>
            // We use standard JS here to avoid browser-incompatible TS syntax
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

            const svgContainer = document.getElementById('svg-container');
            const captureCanvas = document.getElementById('capture-canvas');

            window.addEventListener('message', async (event) => {
              const { type, payload } = event.data;

              if (type === 'LOAD_SVG') {
                const { svgContent, width, height } = payload;
                svgContainer.innerHTML = svgContent.replace(/--play-state:\\s*running\\s*;/g, '--play-state: paused;');
                svgContainer.style.width = width + 'px';
                svgContainer.style.height = height + 'px';
                captureCanvas.width = width;
                captureCanvas.height = height;
                window.parent.postMessage({ type: 'READY' }, '*');
              }

              if (type === 'SEEK') {
                // Assuming seekAnimations is global or defined in parent/accessible.
                // In your shared engine, we must ensure it's available.
                // For now, simple pause/play or similar logic would go here.
                window.parent.postMessage({ type: 'SEEKED' }, '*');
              }

              if (type === 'CAPTURE') {
                const svg = document.querySelector('svg');
                const ctx = captureCanvas.getContext('2d');
                const clone = svg.cloneNode(true);
                const originalElements = [svg, ...Array.from(svg.querySelectorAll('*'))];
                const cloneElements = [clone, ...Array.from(clone.querySelectorAll('*'))];
                
                originalElements.forEach((el, i) => {
                  const style = window.getComputedStyle(el);
                  const cloneEl = cloneElements[i];
                  if (!cloneEl.style) return;
                  
                  if (payload.method === 'high-fidelity') {
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
                ctx.clearRect(0, 0, captureCanvas.width, captureCanvas.height);
                ctx.drawImage(img, 0, 0, captureCanvas.width, captureCanvas.height);
                URL.revokeObjectURL(url);
                const bitmap = await createImageBitmap(captureCanvas);
                const channel = new MessageChannel();
                window.parent.postMessage({ type: 'CAPTURE_RESULT', payload: bitmap }, '*', [channel.port2]);
              }
            });
          </script>
        </body>
      </html>
    `;
    const blob = new Blob([html], { type: 'text/html' });
    if (iframeRef.current) {
      iframeRef.current.src = URL.createObjectURL(blob);
    }
  }, []);

  useImperativeHandle(ref, () => ({
    loadSvg: async (svgContent: string, width: number, height: number) => {
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
          { type: 'LOAD_SVG', payload: { svgContent, width, height } },
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
