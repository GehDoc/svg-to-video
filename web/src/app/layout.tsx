import type { Metadata } from 'next';
import Script from 'next/script';
import '../index.scss';
import pkg from '../../package.json';

const siteName = 'SVG to Video';
const description =
  'High-fidelity, browser-based SVG to video Studio (MP4, WebM, MKV, MOV) with transparent background support, frame-accurate rendering.';
const url = 'https://gehdoc.github.io/svg-to-video/';
const imageUrl =
  'https://gehdoc.github.io/svg-to-video/assets/social-preview.svg';

export const metadata: Metadata = {
  title: 'SVG to Video - Professional Animated SVG Converter',
  description,
  openGraph: {
    title: siteName,
    description,
    url,
    siteName,
    images: [{ url: imageUrl, width: 1200, height: 630 }],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: siteName,
    description,
    images: [imageUrl],
  },
  other: { version: pkg.version },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: siteName,
  description,
  url,
  applicationCategory: 'MultimediaApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  featureList: [
    'High-fidelity SVG to video conversion',
    'Transparent background support (WebM)',
    'Frame-accurate Web Animations API scrubbing',
    'Serverless browser-based rendering',
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script src="./coi-serviceworker.js" async />
        {process.env.NODE_ENV === 'production' && (
          <Script
            src="./assets/3rd-party/analytics.js"
            data-website-id="4489aba4-cf29-439e-9491-e36f2a531a63"
            data-domains="gehdoc.github.io"
            data-host-url="https://cloud.umami.is"
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
