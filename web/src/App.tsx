import { useRef } from 'react';
import type { RendererHandle } from './components/SvgRenderer';
import { StudioProvider } from './context/StudioProvider';
import { Header } from './components/Header';
import { ConfigPanel } from './components/ConfigPanel';
import { MonitorPanel } from './components/MonitorPanel';
import './App.css';

function App() {
  const rendererRef = useRef<RendererHandle>(null);

  return (
    <StudioProvider rendererRef={rendererRef}>
      <div className="app-container">
        <Header />
        <main className="studio-layout">
          <ConfigPanel />
          <MonitorPanel />
        </main>
      </div>
    </StudioProvider>
  );
}

export default App;
