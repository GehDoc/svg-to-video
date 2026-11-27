import { useReducer, useCallback } from 'react';
import {
  DEFAULT_STUDIO_CONFIG,
  DEFAULT_SOURCE_STATE,
  type StudioConfig,
  type StudioSourceState,
} from '../types/studio';
import type { SamplePreset } from '../utils/samples';

export interface StudioState {
  source: StudioSourceState;
  config: StudioConfig;
  renderedUrl: string | null;
  fileSize: string | null;
  isSampleModalOpen: boolean;
  isDragging: boolean;
  supportError: string | null;
}

type StudioAction =
  | { type: 'RESET_STUDIO' }
  | { type: 'UPDATE_CONFIG'; patch: Partial<StudioConfig> }
  | { type: 'SET_FILE_NAME'; fileName: string }
  | {
      type: 'LOAD_SOURCE';
      svgContent: string;
      fileName: string;
      detectedDuration?: number;
      originalDim: {
        width: number;
        height: number;
        isDimensionsDetected: boolean;
      };
    }
  | {
      type: 'LOAD_SAMPLE';
      sample: SamplePreset;
      originalDim: {
        width: number;
        height: number;
        isDimensionsDetected: boolean;
      };
    }
  | { type: 'SET_RENDER_RESULT'; url: string | null; size: string | null }
  | { type: 'SET_SAMPLE_MODAL'; open: boolean }
  | { type: 'SET_DRAGGING'; isDragging: boolean }
  | { type: 'SET_SUPPORT_ERROR'; error: string | null };

const initialStudioState: StudioState = {
  source: { ...DEFAULT_SOURCE_STATE },
  config: { ...DEFAULT_STUDIO_CONFIG },
  renderedUrl: null,
  fileSize: null,
  isSampleModalOpen: false,
  isDragging: false,
  supportError: null,
};

function studioReducer(state: StudioState, action: StudioAction): StudioState {
  switch (action.type) {
    case 'RESET_STUDIO':
      return {
        source: { ...DEFAULT_SOURCE_STATE },
        config: { ...DEFAULT_STUDIO_CONFIG },
        renderedUrl: null,
        fileSize: null,
        isSampleModalOpen: false,
        isDragging: false,
        supportError: null,
      };

    case 'UPDATE_CONFIG':
      return {
        ...state,
        config: {
          ...state.config,
          ...action.patch,
        },
      };

    case 'SET_FILE_NAME':
      return {
        ...state,
        source: {
          ...state.source,
          fileName: action.fileName,
        },
      };

    case 'LOAD_SOURCE':
      return {
        ...state,
        source: {
          svgContent: action.svgContent,
          fileName: action.fileName,
          detectedDuration: action.detectedDuration,
          originalDim: action.originalDim,
        },
        config: {
          ...state.config,
          duration:
            action.detectedDuration && action.detectedDuration > 0
              ? action.detectedDuration
              : state.config.duration,
        },
        renderedUrl: null,
        fileSize: null,
        supportError: null,
      };

    case 'LOAD_SAMPLE': {
      const { sample, originalDim } = action;
      return {
        ...state,
        source: {
          svgContent: sample.svgContent,
          fileName: `${sample.id}.${sample.format}`,
          detectedDuration: sample.duration,
          originalDim,
        },
        config: {
          ...state.config,
          duration: sample.duration,
          fps: sample.fps,
          format: sample.format,
          isTransparent: sample.isTransparent,
          preset: sample.preset ?? 'original',
          scale: sample.scale ?? 1,
        },
        renderedUrl: null,
        fileSize: null,
        isSampleModalOpen: false,
        supportError: null,
      };
    }

    case 'SET_RENDER_RESULT':
      return {
        ...state,
        renderedUrl: action.url,
        fileSize: action.size,
      };

    case 'SET_SAMPLE_MODAL':
      return {
        ...state,
        isSampleModalOpen: action.open,
      };

    case 'SET_DRAGGING':
      return {
        ...state,
        isDragging: action.isDragging,
      };

    case 'SET_SUPPORT_ERROR':
      return {
        ...state,
        supportError: action.error,
      };

    default:
      return state;
  }
}

export function useStudioState() {
  const [state, dispatch] = useReducer(studioReducer, initialStudioState);

  const resetStudio = useCallback(() => dispatch({ type: 'RESET_STUDIO' }), []);
  const updateConfig = useCallback(
    (patch: Partial<StudioConfig>) =>
      dispatch({ type: 'UPDATE_CONFIG', patch }),
    []
  );
  const setFileName = useCallback(
    (fileName: string) => dispatch({ type: 'SET_FILE_NAME', fileName }),
    []
  );
  const loadSource = useCallback(
    (
      svgContent: string,
      fileName: string,
      originalDim: {
        width: number;
        height: number;
        isDimensionsDetected: boolean;
      },
      detectedDuration?: number
    ) =>
      dispatch({
        type: 'LOAD_SOURCE',
        svgContent,
        fileName,
        originalDim,
        detectedDuration,
      }),
    []
  );
  const loadSample = useCallback(
    (
      sample: SamplePreset,
      originalDim: {
        width: number;
        height: number;
        isDimensionsDetected: boolean;
      }
    ) => dispatch({ type: 'LOAD_SAMPLE', sample, originalDim }),
    []
  );
  const setRenderResult = useCallback(
    (url: string | null, size: string | null = null) =>
      dispatch({ type: 'SET_RENDER_RESULT', url, size }),
    []
  );
  const setSampleModalOpen = useCallback(
    (open: boolean) => dispatch({ type: 'SET_SAMPLE_MODAL', open }),
    []
  );
  const setIsDragging = useCallback(
    (isDragging: boolean) => dispatch({ type: 'SET_DRAGGING', isDragging }),
    []
  );
  const setSupportError = useCallback(
    (error: string | null) => dispatch({ type: 'SET_SUPPORT_ERROR', error }),
    []
  );

  return {
    state,
    resetStudio,
    updateConfig,
    setFileName,
    loadSource,
    loadSample,
    setRenderResult,
    setSampleModalOpen,
    setIsDragging,
    setSupportError,
  };
}
