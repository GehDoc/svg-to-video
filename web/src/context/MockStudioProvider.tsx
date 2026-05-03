import { type ReactNode } from 'react';
import { StudioContext, type StudioContextType } from './StudioContext';

export const MockStudioProvider = ({
  children,
  mockValues,
}: {
  children: ReactNode;
  mockValues: Partial<StudioContextType>;
}) => {
  const defaultValue: Partial<StudioContextType> = {
    svgContent: null,
    setSvgContent: () => {},
    fileName: 'test.mp4',
    setFileName: () => {},
    duration: 5,
    setDuration: () => {},
    hold: 0,
    setHold: () => {},
    fps: 60,
    setFps: () => {},
    preset: '1080p',
    setPreset: () => {},
    scale: 1,
    setScale: () => {},
    backgroundColor: '#ffffff',
    setBackgroundColor: () => {},
    captureMethod: 'optimal',
    setCaptureMethod: () => {},
    isDragging: false,
    setIsDragging: () => {},
    renderedUrl: null,
    setRenderedUrl: () => {},
    fileSize: null,
    setFileSize: () => {},
    originalDim: { width: 500, height: 500, isDimensionsDetected: true },
    targetDim: { width: 1920, height: 1080 },
    state: { isRendering: false, status: 'Idle', progress: 0, meta: undefined },
    handleStartRender: async () => {},
    cancel: () => {},
    downloadResult: () => {},
    rendererRef: { current: null },
    ...mockValues,
  };

  return (
    <StudioContext.Provider value={defaultValue as StudioContextType}>
      {children}
    </StudioContext.Provider>
  );
};
