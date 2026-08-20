/**
 * This is the isolated renderer script that will run inside the iframe.
 * It is injected by SvgRenderer via Blob.
 * @param seekAnimations - The animation seeking function from the shared engine.
 * @param parentOrigin - The origin of the parent window for secure postMessage.
 */
import type { RendererMessage } from '../../../../shared/types';

export function getRendererScript(
  seekAnimations: (timeMs: number) => void,
  isRendererMessage: (data: unknown) => data is RendererMessage,
  parentOrigin: string
): void {
  const OPTIMAL_PROPS = [
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

  const svgContainer = document.getElementById('svg-container');
  const captureCanvas = document.getElementById('capture-canvas');

  if (
    !(svgContainer instanceof HTMLElement) ||
    !(captureCanvas instanceof HTMLCanvasElement)
  ) {
    console.error('[Renderer] Required DOM elements not found.');
    return;
  }

  let isReady = false;

  window.addEventListener('message', async (event: MessageEvent) => {
    if (event.origin !== parentOrigin || event.source !== window.parent) {
      return;
    }

    const data = event.data;
    if (!isRendererMessage(data)) {
      return;
    }

    if (data.type === 'LOAD_SVG') {
      const { svgContent, width, height, timeMs } = data.payload;
      isReady = false;
      svgContainer.innerHTML = svgContent;
      svgContainer.style.width = width + 'px';
      svgContainer.style.height = height + 'px';
      svgContainer.style.backgroundColor = 'transparent';
      captureCanvas.width = width;
      captureCanvas.height = height;

      // Position all animations at the correct frame before the first render
      seekAnimations(timeMs);

      // Wait for a frame to ensure the innerHTML is parsed and rendered
      requestAnimationFrame(() => {
        isReady = true;
        // Signal that the SVG is ready to be captured
        window.parent.postMessage({ type: 'READY' }, parentOrigin);
      });
    }

    if (data.type === 'SEEK') {
      if (!isReady) return;
      const { timeMs } = data.payload;
      seekAnimations(timeMs);
      await new Promise((r) => requestAnimationFrame(r));
      window.parent.postMessage({ type: 'SEEKED' }, parentOrigin);
    }

    if (data.type === 'CAPTURE') {
      if (!isReady) return;
      const { method } = data.payload;
      const svg = svgContainer.querySelector('svg');
      const ctx = captureCanvas.getContext('2d');
      if (!svg || !ctx) return;

      // 1. CLONE THE SVG
      const cloneNode = svg.cloneNode(true);
      if (!(cloneNode instanceof Element)) return;
      const clone = cloneNode as HTMLElement | SVGElement;

      // 2. MAP ELEMENTS BETWEEN ORIGINAL AND CLONE
      // We use a flat list to avoid recursion and index mismatches
      const svgElements = [svg, ...Array.from(svg.querySelectorAll('*'))];
      const cloneElements = [clone, ...Array.from(clone.querySelectorAll('*'))];

      if (svgElements.length !== cloneElements.length) {
        console.error('[Renderer] Clone structure mismatch');
        return;
      }

      // 3. BAKE COMPUTED STYLES INTO CLONE
      svgElements.forEach((svgElement, svgElementIndex) => {
        const cloneElement = cloneElements[svgElementIndex];
        // Ensure cloneElement is an element with a style property (covers both HTMLElement and SVGElement)
        if (
          !(
            cloneElement instanceof HTMLElement ||
            cloneElement instanceof SVGElement
          )
        ) {
          return;
        }

        // Skip animation, style, and script tags (they will be stripped anyway)
        const tagName = svgElement.tagName.toLowerCase();
        if (
          [
            'animate',
            'animatetransform',
            'animatemotion',
            'set',
            'style',
            'script',
          ].includes(tagName)
        ) {
          return;
        }

        const style = window.getComputedStyle(svgElement);

        if (method === 'high-fidelity') {
          for (let i = 0; i < style.length; i++) {
            const propertyName = style[i];
            cloneElement.style.setProperty(
              propertyName,
              style.getPropertyValue(propertyName),
              style.getPropertyPriority(propertyName)
            );
          }
        } else {
          // OPTIMAL MODE: Focus on properties that typically change in animations
          for (const prop of OPTIMAL_PROPS) {
            const val = style.getPropertyValue(prop);
            if (val) cloneElement.style.setProperty(prop, val);
          }
        }
      });

      // 4. CLEANUP: Strip dynamic tags AFTER baking styles
      // This ensures we capture the visual state but prevent "double-running" or script execution
      const cleanupTags = clone.querySelectorAll(
        'animate, animateTransform, animateMotion, set, style, script'
      );
      cleanupTags.forEach((tag) => tag.remove());

      // 5. SERIALIZE AND DRAW TO CANVAS
      const svgData = new XMLSerializer().serializeToString(clone);
      const svgBlob = new Blob([svgData], {
        type: 'image/svg+xml;charset=utf-8',
      });
      const url = URL.createObjectURL(svgBlob);
      const img = new Image();

      try {
        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
          img.src = url;
        });

        ctx.clearRect(0, 0, captureCanvas.width, captureCanvas.height);
        ctx.drawImage(img, 0, 0, captureCanvas.width, captureCanvas.height);

        const bitmap = await createImageBitmap(captureCanvas);
        window.parent.postMessage(
          { type: 'CAPTURE_RESULT', payload: bitmap },
          parentOrigin,
          [bitmap]
        );
      } catch (err) {
        console.error('[Renderer] Capture failed:', err);
      } finally {
        URL.revokeObjectURL(url);
      }
    }
  });

  // Signal that the script is loaded and listening
  window.parent.postMessage({ type: 'SCRIPT_LOADED' }, parentOrigin);
}
