/// <reference types="vite-plugin-svgr/client" />

// Raw SVG string imports (e.g. `import foo from './foo.svg?raw'`)
// Supported via the webpack `resourceQuery: /raw/` rule in next.config.js.
declare module '*.svg?raw' {
  const content: string;
  export default content;
}
