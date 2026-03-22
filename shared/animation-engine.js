/**
 * Browser-side function to seek all animations to a specific time.
 * Supports both CSS Animations (Web Animations API) and SMIL.
 * This is the core logic shared between the CLI (Puppeteer) and the Web (Iframe) versions.
 * @param {number} timeInMilliseconds
 */
function seekAnimations(timeInMilliseconds) {
  // 1. Seek CSS Animations (Web Animations API)
  const animations = document.getAnimations();
  for (let i = 0; i < animations.length; i++) {
    const animation = animations[i];
    try {
      animation.pause();
    } catch (_error) {
      /* ignored */
    }
    animation.currentTime = timeInMilliseconds;
  }

  // 2. Seek SMIL Animations
  const svgs = document.querySelectorAll('svg');
  for (let i = 0; i < svgs.length; i++) {
    const svg = svgs[i];
    try {
      if (typeof svg.setCurrentTime === 'function') {
        svg.setCurrentTime(timeInMilliseconds / 1000);
      }
    } catch (_error) {
      /* ignored */
    }
  }
}

// Support ESM
export { seekAnimations };

/**
 * Support CommonJS for the CLI.
 * We use a self-executing check to avoid ESM transpilation warnings about 'module'.
 */
(function () {
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { seekAnimations };
  }
})();
