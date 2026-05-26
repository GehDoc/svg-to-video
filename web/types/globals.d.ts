import type { Driver, Config } from 'driver.js';

declare global {
  interface Window {
    driver: {
      js: {
        driver: (config?: Config) => Driver;
      };
    };
    driverObj?: Driver;
  }

  module '*?raw' {
    const content: string;
    export default content;
  }

  module '*.svg' {
    import React from 'react';
    const SVG: React.FC<React.SVGProps<SVGSVGElement>>;
    export default SVG;
  }

  module '*.svg?react' {
    import React from 'react';
    const SVG: React.FC<React.SVGProps<SVGSVGElement>>;
    export default SVG;
  }
}

export {};
