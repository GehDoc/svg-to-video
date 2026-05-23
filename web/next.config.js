const isProd = process.env.NODE_ENV === 'production';

/** @type {import('next').NextConfig} */
const nextConfig = {
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
      // Convert all other *.svg imports to React components
      {
        test: /\.svg$/i,
        issuer: fileLoaderRule.issuer,
        resourceQuery: {
          not: [...(fileLoaderRule.resourceQuery?.not || []), /url/],
        }, // exclude if *.svg?url
        use: ['@svgr/webpack'],
      },
      // Vite ?raw support
      {
        resourceQuery: /raw/,
        type: 'asset/source',
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
