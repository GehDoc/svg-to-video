const isProd = process.env.NODE_ENV === 'production';

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disables automatic AGENTS.md generation and updates
  agentRules: false,
  // Disable Next.js UI in development to avoid conflicts
  devIndicators: false,
  // Required for GitHub Pages project site deployment
  basePath: isProd ? '/svg-to-video' : '',
  assetPrefix: isProd ? '/svg-to-video/' : '',
  // Ensure output is standalone for static export or serverless deployment
  output: 'export',
  distDir: 'dist', // Match existing Vite output directory
  images: {
    unoptimized: true, // Required for 'output: export'
  },
  transpilePackages: ['../../shared'],
  turbopack: {}, // Use webpack config
  webpack(config) {
    config.resolve.extensionAlias = {
      '.js': ['.js', '.ts'],
      '.jsx': ['.jsx', '.tsx'],
    };

    // SVGR support
    // Find the existing rule that handles SVG imports
    const fileLoaderRule = config.module.rules.find((rule) =>
      rule.test?.test?.('.svg')
    );

    config.module.rules.push(
      // Re-apply the existing rule, but only for svg imports ending in ?url
      {
        ...fileLoaderRule,
        test: /\.svg$/i,
        resourceQuery: /url/, // *.svg?url
      },
      // Raw string import: handles ANY file imported with ?raw (e.g. *.svg?raw,
      // *.html?raw). Must be listed BEFORE the SVGR catch-all so webpack picks
      // it up first for SVG files. Returns the raw file content as a string.
      {
        resourceQuery: /raw/,
        type: 'asset/source',
      },
      // Convert all other *.svg imports to React components.
      // Exclude ?url and ?raw so neither slips through to SVGR.
      {
        test: /\.svg$/i,
        issuer: fileLoaderRule.issuer,
        resourceQuery: {
          not: [...(fileLoaderRule.resourceQuery?.not || []), /url/, /raw/],
        },
        use: ['@svgr/webpack'],
      }
    );

    // Modify the file loader rule to ignore *.svg, since we have it handled now.
    fileLoaderRule.exclude = /\.svg$/i;

    return config;
  },
  async headers() {
    if (process.env.NODE_ENV === 'development') {
      return [
        {
          source: '/(.*)',
          headers: [
            {
              key: 'Cross-Origin-Opener-Policy',
              value: 'same-origin',
            },
            {
              key: 'Cross-Origin-Embedder-Policy',
              value: 'require-corp',
            },
          ],
        },
      ];
    }
    return [];
  },
};

export default nextConfig;
