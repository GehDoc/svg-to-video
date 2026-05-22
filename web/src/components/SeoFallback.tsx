import './SeoFallback.scss';

export const SeoFallback = () => {
  return (
    <div className="seo-fallback">
      <h1>SVG to Video Studio</h1>
      <p>
        Convert SVG animations to MP4, WebM, MKV, MOV, and other video formats
        with transparency directly in your browser. A private, serverless,
        frame-accurate converter for developers.
      </p>

      <p>
        <a
          href="https://github.com/GehDoc/svg-to-video"
          target="_blank"
          rel="noopener noreferrer"
        >
          View on GitHub
        </a>
        {' | '}
        <a
          href="https://github.com/GehDoc/svg-to-video/blob/main/LICENSE"
          target="_blank"
          rel="noopener noreferrer"
        >
          MIT License
        </a>
      </p>

      <p>Loading the studio...</p>
    </div>
  );
};
