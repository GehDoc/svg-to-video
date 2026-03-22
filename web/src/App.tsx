import { useRef } from 'react';
import type { RendererHandle } from './components/SvgRenderer';
import { StudioProvider } from './context/StudioProvider';
import { ConfigPanel } from './components/ConfigPanel';
import { MonitorPanel } from './components/MonitorPanel';
import './App.css';

function App() {
  const rendererRef = useRef<RendererHandle>(null);

  return (
    <StudioProvider rendererRef={rendererRef}>
      <div className="app-container">
        <header>
          <h1>
            <img
              src="/favicon.svg"
              alt=""
              width="24"
              height="24"
              style={{ verticalAlign: 'middle', marginRight: '0.5rem' }}
            />
            SVG to Video{' '}
            <small
              style={{
                opacity: 0.5,
                fontSize: '0.6rem',
                marginLeft: '0.5rem',
                padding: '0.1rem 0.3rem',
                border: '1px solid currentColor',
                borderRadius: '3px',
              }}
            >
              STUDIO
            </small>
          </h1>
          <p>Zero-server high-fidelity rendering</p>
        </header>

        <main className="studio-layout">
          <ConfigPanel />
          <MonitorPanel />
        </main>

        <footer>
          All processing happens locally in your browser. Files never leave your
          computer. |{' '}
          <a
            href="https://github.com/GehDoc/svg-to-video"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub Repository
          </a>
        </footer>
      </div>
    </StudioProvider>
  );
}

export default App;
