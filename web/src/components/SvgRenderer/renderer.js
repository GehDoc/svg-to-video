/**
 * This is the isolated renderer script that will run inside the iframe.
 * It is injected by SvgRenderer via Blob.
 * @param {(timeMs: number) => void} seekAnimations - The animation seeking function from the shared engine.
 * @param {string} parentOrigin - The origin of the parent window for secure postMessage.
 */
export function getRendererScript(seekAnimations, parentOrigin) {
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
  let isReady = false;

  window.addEventListener('message', async (event) => {
    const { type, payload } = event.data;

    if (type === 'LOAD_SVG') {
      isReady = false;
      const { svgContent, width, height, backgroundColor, timeMs } = payload;
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

    if (type === 'SEEK') {
      if (!isReady) return;
      seekAnimations(payload.timeMs);
      await new Promise((r) => requestAnimationFrame(r));
      window.parent.postMessage({ type: 'SEEKED' }, parentOrigin);
    }

    if (type === 'CAPTURE') {
      if (!isReady) return;
      const svg = svgContainer.querySelector('svg');
      const ctx = captureCanvas.getContext('2d');
      if (!svg || !ctx) return;

      const clone = svg.cloneNode(true);

      const originalElements = [
        svg,
        ...Array.from(svg.querySelectorAll('*')).filter(
          (el) =>
            !['animate', 'animateTransform', 'animateMotion', 'set'].includes(
              el.tagName.toLowerCase()
            )
        ),
      ];
      const cloneElements = [clone, ...Array.from(clone.querySelectorAll('*'))];

      originalElements.forEach((el, i) => {
        const style = window.getComputedStyle(el);
        const cloneEl = cloneElements[i];
        if (!cloneEl || !cloneEl.style) return;

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
          // Always copy 'transform' first to ensure animation state is captured
          const transformVal = style.getPropertyValue('transform');
          if (transformVal && transformVal !== 'none') {
            cloneEl.setAttribute('transform', transformVal);
            cloneEl.style.removeProperty('transform');
          }

          for (const prop of OPTIMAL_PROPS) {
            if (prop === 'transform') continue;
            const val = style.getPropertyValue(prop);
            if (val) cloneEl.style.setProperty(prop, val);
          }
        }
      });

      // CLEANUP: Remove all animation, style, and script tags AFTER properties are baked
      const cleanupTags = clone.querySelectorAll(
        'animate, animateTransform, animateMotion, set, style, script'
      );
      cleanupTags.forEach((tag) => tag.remove());

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
      window.parent.postMessage(
        { type: 'CAPTURE_RESULT', payload: bitmap },
        parentOrigin,
        [bitmap]
      );
    }
  });

  // Signal that the script is loaded and listening
  window.parent.postMessage({ type: 'SCRIPT_LOADED' }, parentOrigin);
}
