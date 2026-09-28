import type { Metadata } from 'next';
import Script from 'next/script';
import '../index.scss';
import pkg from '../../package.json';
import {
  UMAMI_HOST_URL,
  UMAMI_WEBSITE_HOSTNAME,
  UMAMI_WEBSITE_ID,
} from '@shared/analytics-schema';

const siteName = 'SVG to Video';
const title =
  'SVG to Video Converter (MP4, WebM, GIF, aPNG) – Free Online Studio';
const description = pkg.description;
const url = pkg.homepage;
const imageUrl = `${url}assets/social-preview.svg`;

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    'animated svg',
    'svg to video',
    'svg to mp4',
    'svg to webm',
    'svg to apng',
    'svg to gif',
    'transparent background',
    'alpha channel',
    'metadata injection',
    'video metadata',
    'cli gif export',
    'cli apng export',
    'web animations api',
    'browser-based converter',
    'mcp server',
    'model context protocol',
    'agent skill',
  ],
  alternates: {
    canonical: url,
  },
  openGraph: {
    title,
    description,
    url,
    siteName,
    images: [{ url: imageUrl, width: 1200, height: 630 }],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: [imageUrl],
  },
  other: { version: pkg.version },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: siteName,
  alternateName: 'SVG to Video Converter',
  description,
  url,
  applicationCategory: 'MultimediaApplication',
  operatingSystem: 'All',
  browserRequirements:
    'Requires JavaScript and HTML5 Canvas / Web Animations API support',
  image: imageUrl,
  author: {
    '@type': 'Person',
    name: pkg.author,
    url: `https://github.com/${pkg.author}`,
  },
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'EUR' },
  featureList: [
    'High-fidelity SVG to video conversion (MP4, WebM, MKV, MOV)',
    'Optimized animated image export (aPNG, GIF)',
    'Transparent background support (WebM, aPNG, GIF89a)',
    'Metadata embedding across video and animated images',
    'Frame-accurate Web Animations API scrubbing',
    'Model Context Protocol (MCP) server & Agent Skill support',
    '100% Client-side serverless browser rendering',
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="./favicon.svg" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script src="./coi-serviceworker.js" async />
        {process.env.NODE_ENV === 'production' && (
          <Script
            src="./assets/3rd-party/analytics.js"
            data-website-id={UMAMI_WEBSITE_ID}
            data-domains={UMAMI_WEBSITE_HOSTNAME}
            data-host-url={UMAMI_HOST_URL}
            strategy="afterInteractive"
          />
        )}
      </head>
      <body>
        <div id="root">{children}</div>
      </body>
    </html>
  );
}
