import type { Metadata } from 'next';
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
      </head>
      <body>
        <div id="root">{children}</div>
      </body>
    </html>
  );
}
