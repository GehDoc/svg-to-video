/**
 * This is the isolated renderer script that will run inside the iframe.
 * It is injected by SvgRenderer via Blob.
 * @param {(timeMs: number) => void} seekAnimations - The animation seeking function from the shared engine.
 */
export function getRendererScript(seekAnimations) {
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

  window.addEventListener('message', async (event) => {
    const { type, payload } = event.data;

    if (type === 'LOAD_SVG') {
      const { svgContent, width, height } = payload;
      svgContainer.innerHTML = svgContent.replace(
        /--play-state:\s*running\s*;/g,
        '--play-state: paused;'
      );
      svgContainer.style.width = width + 'px';
      svgContainer.style.height = height + 'px';
      captureCanvas.width = width;
      captureCanvas.height = height;
      window.parent.postMessage({ type: 'READY' }, '*');
    }

    if (type === 'SEEK') {
      seekAnimations(payload.timeMs);
      await new Promise((r) => requestAnimationFrame(r));
      await new Promise((r) => requestAnimationFrame(r));
      window.parent.postMessage({ type: 'SEEKED' }, '*');
    }

    if (type === 'CAPTURE') {
      const svg = document.querySelector('svg');
      const ctx = captureCanvas.getContext('2d');
      if (!svg || !ctx) return;

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
            cloneEl.style.setProperty(
              prop,
              style.getPropertyValue(prop),
              style.getPropertyPriority(prop)
            );
          }
        } else {
          for (const prop of OPTIMAL_PROPS) {
            const val = style.getPropertyValue(prop);
            if (val) cloneEl.style.setProperty(prop, val);
          }
        }
      });

      const svgData = new XMLSerializer().serializeToString(clone);
      const svgBlob = new Blob([svgData], {
        type: 'image/svg+xml;charset=utf-8',
      });
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
      window.parent.postMessage(
        { type: 'CAPTURE_RESULT', payload: bitmap },
        '*',
        [channel.port2]
      );
    }
  });
}
