/**
 * Unified Analytics Telemetry Event Schemas (Umami)
 * Shared contract between Web Studio, CLI, and MCP Server.
 */

export type CaptureMethodType =
  'puppeteer' | 'webcodecs' | 'optimal' | 'canvas' | (string & {});

export interface FileLoadEventProperties {
  method?: 'file-picker' | 'drag-and-drop';
  aspectRatio: 'square' | 'landscape' | 'portrait' | 'unknown';
  hasAnimation: boolean;
  detectedDuration?: number;
  isDimensionsDetected: boolean;
}

export interface ConversionStartEventProperties {
  format: string;
  isTransparent: boolean;
  captureMethod: CaptureMethodType;
  fps: number;
  videoDurationSec: number;
}

export interface ConversionSuccessEventProperties {
  format: string;
  isTransparent: boolean;
  captureMethod: CaptureMethodType;
  fps: number;
  videoDurationSec: number;
  totalFrames: number;
  processDurationSec: number;
}

export interface ConversionFailedEventProperties {
  error: string;
  format: string;
  isTransparent: boolean;
  captureMethod: CaptureMethodType;
  processDurationSec: number;
}

export interface ConversionCancelEventProperties {
  format: string;
  isTransparent: boolean;
  captureMethod: CaptureMethodType;
  processDurationSec: number;
}

export interface ClickSponsorEventProperties {
  location: 'header' | 'dropdown' | 'success-view';
}

export interface CopyDataUrlEventProperties {
  success: boolean;
  format?: string;
  isTransparent?: boolean;
}

export interface DownloadResultEventProperties {
  format?: string;
  isTransparent?: boolean;
}

export interface BackToStudioEventProperties {
  format?: string;
  isTransparent?: boolean;
}

export type EmptyEventProperties = Record<string, never> | void;

export interface AnalyticsEventMap {
  'file-load': FileLoadEventProperties;
  'conversion-start': ConversionStartEventProperties;
  'conversion-success': ConversionSuccessEventProperties;
  'conversion-failed': ConversionFailedEventProperties;
  'conversion-cancel': ConversionCancelEventProperties;
  'click-sponsor': ClickSponsorEventProperties;
  'copy-data-url': CopyDataUrlEventProperties;
  'download-result': DownloadResultEventProperties;
  'back-to-studio': BackToStudioEventProperties;
  'click-issue-report'?: EmptyEventProperties;
  'click-source-code'?: EmptyEventProperties;
}

export type AnalyticsEventName = keyof AnalyticsEventMap;
