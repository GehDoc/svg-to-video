import type { Metadata } from 'next';
import Script from 'next/script';
import '../index.css';
import pkg from '../../package.json';

export const metadata: Metadata = {
  title: 'SVG to Video - Professional Animated SVG Converter',
  description:
    'High-fidelity, browser-based SVG to video Studio (MP4, WebM, MKV, MOV) with transparent background support, frame-accurate rendering.',
  other: {
    version: pkg.version,
  },
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
          src={`${process.env.NODE_ENV === 'production' ? '/svg-to-video' : ''}/coi-serviceworker.js`}
          async
        />
        {process.env.NODE_ENV === 'production' && (
          <Script
            src="/assets/3rd-party/analytics.js"
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
