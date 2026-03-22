import { seekAnimations } from '@shared/animation-engine';

/**
 * These are the properties that significantly affect SVG rendering.
 * Using a curated list is much faster than computedStyle.length (300+ props).
 */
export const OPTIMAL_PROPS = [
  'fill',
  'fill-opacity',
  'fill-rule',
  'stroke',
  'stroke-opacity',
  'stroke-width',
  'stroke-linecap',
  'stroke-linejoin',
  'stroke-miterlimit',
  'stroke-dasharray',
  'stroke-dashoffset',
  'opacity',
  'display',
  'visibility',
  'filter',
  'mask',
  'clip-path',
  'clip-rule',
  'stop-color',
  'stop-opacity',
  'font-family',
  'font-size',
  'font-weight',
  'font-style',
  'text-anchor',
  'text-decoration',
  'dominant-baseline',
  'alignment-baseline',
  'baseline-shift',
  'transform',
  'transform-origin',
  'x',
  'y',
  'width',
  'height',
  'cx',
  'cy',
  'r',
  'rx',
  'ry',
  'color',
  'flood-color',
  'flood-opacity',
  'lighting-color',
  'mix-blend-mode',
  'isolation',
];

/**
 * Logic to be injected into the iframe.
 * We stringify the functions we need to ensure they are available in the iframe context.
 */
export const getIframeTemplate = (
  svgContent: string,
  width: number,
  height: number
) => `
<!DOCTYPE html>
<html>
  <head>
    <style>
      body, html { margin: 0; padding: 0; overflow: hidden; width: 100%; height: 100%; background: transparent; }
      #svg-container { width: ${width}px; height: ${height}px; }
      svg { display: block; width: 100%; height: 100%; }
      canvas { display: none; }
    </style>
  </head>
  <body>
    <div id="svg-container">${svgContent}</div>
    <canvas id="capture-canvas" width="${width}" height="${height}"></canvas>
    <script>
      window.OPTIMAL_PROPS = ${JSON.stringify(OPTIMAL_PROPS)};
      window.seekAnimations = ${seekAnimations.toString()};

      window.captureFrame = async (method) => {
        const svg = document.querySelector('svg');
        const canvas = document.getElementById('capture-canvas');
        const ctx = canvas.getContext('2d');
        if (!svg || !canvas || !ctx) return null;
        
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
            for (const prop of window.OPTIMAL_PROPS) {
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
            image.onerror = resolve;
          });
        }));
      };
    </script>
  </body>
</html>
`;
