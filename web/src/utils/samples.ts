export interface SamplePreset {
  id: string;
  name: string;
  description: string;
  category: string;
  duration: number;
  fps: number;
  format: string;
  isTransparent: boolean;
  svgContent: string;
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
    svgContent: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
  <defs>
    <linearGradient id="rocketBody" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="100%" stop-color="#cbd5e1"/>
    </linearGradient>
    <linearGradient id="rocketFin" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ef4444"/>
      <stop offset="100%" stop-color="#b91c1c"/>
    </linearGradient>
    <linearGradient id="flameGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#fbbf24"/>
      <stop offset="50%" stop-color="#f97316"/>
      <stop offset="100%" stop-color="#dc2626"/>
    </linearGradient>
    <style>
      @keyframes float {
        0%, 100% { transform: translateY(0px) rotate(-45deg); }
        50% { transform: translateY(-14px) rotate(-43deg); }
      }
      @keyframes flame {
        0%, 100% { transform: scaleY(1) scaleX(1); opacity: 0.9; }
        50% { transform: scaleY(1.3) scaleX(0.85); opacity: 1; }
      }
      @keyframes starTwinkle {
        0%, 100% { opacity: 0.2; transform: scale(0.8); }
        50% { opacity: 1; transform: scale(1.2); }
      }
      .rocket-group {
        transform-origin: 200px 180px;
        animation: float 5s ease-in-out infinite;
      }
      .flame {
        transform-origin: 200px 240px;
        animation: flame 0.25s ease-in-out infinite alternate;
      }
      .star-1 { animation: starTwinkle 2s ease-in-out infinite; transform-origin: 80px 100px; }
      .star-2 { animation: starTwinkle 2.5s ease-in-out infinite 0.5s; transform-origin: 320px 120px; }
      .star-3 { animation: starTwinkle 5s ease-in-out infinite 1s; transform-origin: 100px 300px; }
      .star-4 { animation: starTwinkle 2s ease-in-out infinite 0.3s; transform-origin: 310px 280px; }
    </style>
  </defs>
  <g fill="#94a3b8">
    <circle class="star-1" cx="80" cy="100" r="3" />
    <circle class="star-2" cx="320" cy="120" r="4" />
    <circle class="star-3" cx="100" cy="300" r="3.5" />
    <circle class="star-4" cx="310" cy="280" r="2.5" />
  </g>
  <g class="rocket-group">
    <path class="flame" d="M 185 240 Q 200 310 200 320 Q 200 310 215 240 Z" fill="url(#flameGrad)" />
    <path class="flame" d="M 192 240 Q 200 280 200 290 Q 200 280 208 240 Z" fill="#fef08a" />
    <path d="M 170 200 L 140 235 L 175 230 Z" fill="url(#rocketFin)" />
    <path d="M 230 200 L 260 235 L 225 230 Z" fill="url(#rocketFin)" />
    <path d="M 200 110 C 170 145 165 205 170 240 L 230 240 C 235 205 230 145 200 110 Z" fill="url(#rocketBody)" stroke="#94a3b8" stroke-width="2" />
    <path d="M 197 195 L 200 150 L 203 195 L 200 240 Z" fill="url(#rocketFin)" />
    <circle cx="200" cy="165" r="16" fill="#38bdf8" stroke="#0284c7" stroke-width="3" />
    <circle cx="196" cy="160" r="5" fill="#ffffff" opacity="0.8" />
  </g>
</svg>`,
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
    svgContent: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
  <defs>
    <style>
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      @keyframes pulseRing {
        0%, 100% { transform: scale(0.95); opacity: 0.7; }
        50% { transform: scale(1.05); opacity: 1; }
      }
      .spinner-wrapper {
        transform-origin: 200px 200px;
        animation: spin 2s linear infinite;
      }
      .pulse-center {
        transform-origin: 200px 200px;
        animation: pulseRing 2s ease-in-out infinite;
      }
    </style>
    <linearGradient id="spinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#5e61e6"/>
      <stop offset="50%" stop-color="#a855f7"/>
      <stop offset="100%" stop-color="#ec4899"/>
    </linearGradient>
  </defs>
  <circle class="pulse-center" cx="200" cy="200" r="35" fill="url(#spinGrad)" opacity="0.15" />
  <circle class="pulse-center" cx="200" cy="200" r="18" fill="url(#spinGrad)" />
  <g class="spinner-wrapper">
    <circle cx="200" cy="90" r="12" fill="#5e61e6" opacity="1.0" />
    <circle cx="278" cy="122" r="11" fill="#7c3aed" opacity="0.88" />
    <circle cx="310" cy="200" r="10" fill="#9333ea" opacity="0.75" />
    <circle cx="278" cy="278" r="9" fill="#a855f7" opacity="0.62" />
    <circle cx="200" cy="310" r="8" fill="#c084fc" opacity="0.5" />
    <circle cx="122" cy="278" r="7" fill="#d8b4fe" opacity="0.38" />
    <circle cx="90" cy="200" r="6" fill="#e9d5ff" opacity="0.25" />
    <circle cx="122" cy="122" r="5" fill="#f3e8ff" opacity="0.15" />
  </g>
</svg>`,
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
    svgContent: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
  <defs>
    <style>
      @keyframes rotateClockwise {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      @keyframes rotateCounter {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(-360deg); }
      }
      .gear-large {
        transform-origin: 160px 170px;
        animation: rotateClockwise 6s linear infinite;
      }
      .gear-small {
        transform-origin: 265px 255px;
        animation: rotateCounter 3.6s linear infinite;
      }
    </style>
    <linearGradient id="gearGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#3b82f6"/>
      <stop offset="100%" stop-color="#1d4ed8"/>
    </linearGradient>
    <linearGradient id="gearGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#06b6d4"/>
      <stop offset="100%" stop-color="#0e7490"/>
    </linearGradient>
  </defs>
  <g class="gear-large">
    <circle cx="160" cy="170" r="65" fill="url(#gearGrad1)" />
    <rect x="150" y="90" width="20" height="24" rx="4" fill="url(#gearGrad1)" />
    <rect x="150" y="226" width="20" height="24" rx="4" fill="url(#gearGrad1)" />
    <rect x="80" y="160" width="24" height="20" rx="4" fill="url(#gearGrad1)" />
    <rect x="216" y="160" width="24" height="20" rx="4" fill="url(#gearGrad1)" />
    <rect x="103" y="113" width="20" height="24" rx="4" transform="rotate(45 113 125)" fill="url(#gearGrad1)" />
    <rect x="197" y="207" width="20" height="24" rx="4" transform="rotate(45 207 219)" fill="url(#gearGrad1)" />
    <rect x="197" y="113" width="20" height="24" rx="4" transform="rotate(-45 207 125)" fill="url(#gearGrad1)" />
    <rect x="103" y="207" width="20" height="24" rx="4" transform="rotate(-45 113 219)" fill="url(#gearGrad1)" />
    <circle cx="160" cy="170" r="25" fill="#ffffff" />
    <circle cx="160" cy="170" r="14" fill="#94a3b8" />
  </g>
  <g class="gear-small">
    <circle cx="265" cy="255" r="42" fill="url(#gearGrad2)" />
    <rect x="257" y="202" width="16" height="18" rx="3" fill="url(#gearGrad2)" />
    <rect x="257" y="290" width="16" height="18" rx="3" fill="url(#gearGrad2)" />
    <rect x="212" y="247" width="18" height="16" rx="3" fill="url(#gearGrad2)" />
    <rect x="300" y="247" width="18" height="16" rx="3" fill="url(#gearGrad2)" />
    <rect x="224" y="214" width="16" height="18" rx="3" transform="rotate(60 232 223)" fill="url(#gearGrad2)" />
    <rect x="288" y="278" width="16" height="18" rx="3" transform="rotate(60 296 287)" fill="url(#gearGrad2)" />
    <circle cx="265" cy="255" r="16" fill="#ffffff" />
    <circle cx="265" cy="255" r="8" fill="#94a3b8" />
  </g>
</svg>`,
  },
];
