import type { ResolutionPreset } from '../hooks/useRenderer';
import rocketSvg from '../assets/samples/rocket.svg?raw';
import spinnerSvg from '../assets/samples/spinner.svg?raw';
import gearSvg from '../assets/samples/gear.svg?raw';
import radarSvg from '../assets/samples/radar.svg?raw';

export interface SamplePreset {
  id: string;
  name: string;
  description: string;
  category: string;
  svgContent: string;
  // Target capture settings
  duration: number;
  fps: number;
  format: string;
  isTransparent: boolean;
  preset?: ResolutionPreset;
  scale?: number;
}

export const SAMPLES: SamplePreset[] = [
  {
    id: 'rocket-launch',
    name: 'Rocket Launch',
    description:
      'Smooth floating rocket with pulsating flame and twinkling stars.',
    category: 'Illustration',
    duration: 10,
    fps: 30,
    format: 'mp4',
    isTransparent: false,
    preset: 'original',
    scale: 1,
    svgContent: rocketSvg,
  },
  {
    id: 'loading-spinner',
    name: 'Loading Spinner',
    description: 'Radial orbiting gradient dots with ambient center pulse.',
    category: 'UI Element',
    duration: 2,
    fps: 30,
    format: 'webm',
    isTransparent: true,
    preset: 'original',
    scale: 1,
    svgContent: spinnerSvg,
  },
  {
    id: 'mechanical-gear',
    name: 'Mechanical Gear',
    description:
      'Precision interlocking dual gears with smooth synchronized rotation.',
    category: 'Motion Graphics',
    duration: 6,
    fps: 30,
    format: 'gif',
    isTransparent: true,
    preset: 'original',
    scale: 1,
    svgContent: gearSvg,
  },
  {
    id: 'radar-scanner',
    name: 'SMIL Radar Scanner',
    description:
      'Native SVG SMIL animation with rotating beam, sonar waves, and pulsing targets.',
    category: 'SMIL Animation',
    duration: 4,
    fps: 30,
    format: 'mp4',
    isTransparent: false,
    preset: 'original',
    scale: 1,
    svgContent: radarSvg,
  },
];
