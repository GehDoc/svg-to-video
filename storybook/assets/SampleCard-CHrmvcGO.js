import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{t}from"./react-BGJ90fIb.js";import{t as n}from"./jsx-runtime-MKhVqBIO.js";import{n as r,t as i}from"./Button-1riBOttM.js";import{T as a,g as o}from"./fa-Cuu5u3_B.js";var s;function c(){return(c=e((()=>{s=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
  <defs>
    <linearGradient id="rocketBody" x1="0%" y1="0%" x2="100%" y2="0%">
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

  <!-- Background Stars -->
  <g fill="#94a3b8">
    <circle class="star-1" cx="80" cy="100" r="3" />
    <circle class="star-2" cx="320" cy="120" r="4" />
    <circle class="star-3" cx="100" cy="300" r="3.5" />
    <circle class="star-4" cx="310" cy="280" r="2.5" />
  </g>

  <!-- Rocket assembly centered at (200, 180) -->
  <g class="rocket-group">
    <!-- Flame Exhaust -->
    <path class="flame" d="M 185 240 Q 200 310 200 320 Q 200 310 215 240 Z" fill="url(#flameGrad)" />
    <path class="flame" d="M 192 240 Q 200 280 200 290 Q 200 280 208 240 Z" fill="#fef08a" />

    <!-- Left & Right Fins -->
    <path d="M 170 200 L 140 235 L 175 230 Z" fill="url(#rocketFin)" />
    <path d="M 230 200 L 260 235 L 225 230 Z" fill="url(#rocketFin)" />

    <!-- Main Fuselage -->
    <path d="M 200 110 C 170 145 165 205 170 240 L 230 240 C 235 205 230 145 200 110 Z" fill="url(#rocketBody)" stroke="#94a3b8" stroke-width="2" />

    <!-- Center Fin -->
    <path d="M 197 195 L 200 150 L 203 195 L 200 240 Z" fill="url(#rocketFin)" />

    <!-- Porthole Window -->
    <circle cx="200" cy="165" r="16" fill="#38bdf8" stroke="#0284c7" stroke-width="3" />
    <circle cx="196" cy="160" r="5" fill="#ffffff" opacity="0.8" />
  </g>
</svg>
`})))()}var l;function u(){return(u=e((()=>{l=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
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

  <!-- Central Ambient Glow -->
  <circle class="pulse-center" cx="200" cy="200" r="35" fill="url(#spinGrad)" opacity="0.15" />
  <circle class="pulse-center" cx="200" cy="200" r="18" fill="url(#spinGrad)" />

  <!-- Orbiting Dots -->
  <g class="spinner-wrapper">
    <!-- 8 radially distributed pills/dots with varying opacities -->
    <circle cx="200" cy="90" r="12" fill="#5e61e6" opacity="1.0" />
    <circle cx="278" cy="122" r="11" fill="#7c3aed" opacity="0.88" />
    <circle cx="310" cy="200" r="10" fill="#9333ea" opacity="0.75" />
    <circle cx="278" cy="278" r="9" fill="#a855f7" opacity="0.62" />
    <circle cx="200" cy="310" r="8" fill="#c084fc" opacity="0.5" />
    <circle cx="122" cy="278" r="7" fill="#d8b4fe" opacity="0.38" />
    <circle cx="90" cy="200" r="6" fill="#e9d5ff" opacity="0.25" />
    <circle cx="122" cy="122" r="5" fill="#f3e8ff" opacity="0.15" />
  </g>
</svg>
`})))()}var d;function f(){return(f=e((()=>{d=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
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
        animation: rotateClockwise 2s linear infinite;
      }
      .gear-small {
        transform-origin: 265px 255px;
        animation: rotateCounter 1.5s linear infinite;
      }
    </style>
    <linearGradient id="gearGrad1" gradientUnits="userSpaceOnUse" x1="80" y1="90" x2="240" y2="250">
      <stop offset="0%" stop-color="#3b82f6"/>
      <stop offset="100%" stop-color="#1d4ed8"/>
    </linearGradient>
    <linearGradient id="gearGrad2" gradientUnits="userSpaceOnUse" x1="210" y1="200" x2="320" y2="310">
      <stop offset="0%" stop-color="#06b6d4"/>
      <stop offset="100%" stop-color="#0e7490"/>
    </linearGradient>
  </defs>

  <!-- Large Gear Centered at 160, 170 -->
  <g class="gear-large">
    <!-- 8 teeth rendered behind the circle to eliminate inner boundary seams -->
    <rect x="150" y="90" width="20" height="24" rx="4" fill="url(#gearGrad1)" />
    <rect x="150" y="90" width="20" height="24" rx="4" transform="rotate(45 160 170)" fill="url(#gearGrad1)" />
    <rect x="150" y="90" width="20" height="24" rx="4" transform="rotate(90 160 170)" fill="url(#gearGrad1)" />
    <rect x="150" y="90" width="20" height="24" rx="4" transform="rotate(135 160 170)" fill="url(#gearGrad1)" />
    <rect x="150" y="90" width="20" height="24" rx="4" transform="rotate(180 160 170)" fill="url(#gearGrad1)" />
    <rect x="150" y="90" width="20" height="24" rx="4" transform="rotate(225 160 170)" fill="url(#gearGrad1)" />
    <rect x="150" y="90" width="20" height="24" rx="4" transform="rotate(270 160 170)" fill="url(#gearGrad1)" />
    <rect x="150" y="90" width="20" height="24" rx="4" transform="rotate(315 160 170)" fill="url(#gearGrad1)" />
    <!-- Gear circle on top of teeth -->
    <circle cx="160" cy="170" r="65" fill="url(#gearGrad1)" />
    <!-- Center Hole -->
    <circle cx="160" cy="170" r="25" fill="#ffffff" />
    <circle cx="160" cy="170" r="14" fill="#94a3b8" />
  </g>

  <!-- Small Gear Centered at 265, 255 -->
  <g class="gear-small">
    <!-- 6 teeth with charming missing teeth gaps rendered behind circle -->
    <rect x="257" y="202" width="16" height="18" rx="3" fill="url(#gearGrad2)" />
    <rect x="257" y="290" width="16" height="18" rx="3" fill="url(#gearGrad2)" />
    <rect x="212" y="247" width="18" height="16" rx="3" fill="url(#gearGrad2)" />
    <rect x="300" y="247" width="18" height="16" rx="3" fill="url(#gearGrad2)" />
    <rect x="224" y="214" width="16" height="18" rx="3" transform="rotate(60 232 223)" fill="url(#gearGrad2)" />
    <rect x="288" y="278" width="16" height="18" rx="3" transform="rotate(60 296 287)" fill="url(#gearGrad2)" />
    <!-- Gear circle on top of teeth -->
    <circle cx="265" cy="255" r="42" fill="url(#gearGrad2)" />
    <!-- Center Hole -->
    <circle cx="265" cy="255" r="16" fill="#ffffff" />
    <circle cx="265" cy="255" r="8" fill="#94a3b8" />
  </g>
</svg>
`})))()}var p;function m(){return(m=e((()=>{p=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
  <defs>
    <!-- Radial sweep gradient for radar beam -->
    <radialGradient id="beamGrad" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#06b6d4" stop-opacity="0.8" />
      <stop offset="70%" stop-color="#0891b2" stop-opacity="0.3" />
      <stop offset="100%" stop-color="#0e7490" stop-opacity="0" />
    </radialGradient>
    <linearGradient id="blipGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#34d399" />
      <stop offset="100%" stop-color="#059669" />
    </linearGradient>
  </defs>

  <!-- Background Base -->
  <rect width="400" height="400" fill="#090d16" />

  <!-- Radar Range Rings -->
  <g stroke="#0e7490" stroke-width="1.5" fill="none" opacity="0.6">
    <circle cx="200" cy="200" r="45" />
    <circle cx="200" cy="200" r="90" />
    <circle cx="200" cy="200" r="135" />
    <circle cx="200" cy="200" r="175" stroke="#06b6d4" stroke-width="2" opacity="0.8" />
  </g>

  <!-- Crosshair Axis Lines -->
  <g stroke="#155e75" stroke-width="1" stroke-dasharray="4 4" opacity="0.7">
    <line x1="25" y1="200" x2="375" y2="200" />
    <line x1="200" y1="25" x2="200" y2="375" />
  </g>

  <!-- Concentric SMIL Expanding Sonar Waves -->
  <circle cx="200" cy="200" r="10" fill="none" stroke="#22d3ee" stroke-width="2">
    <animate attributeName="r" from="15" to="175" dur="4s" repeatCount="indefinite" />
    <animate attributeName="opacity" from="0.9" to="0" dur="4s" repeatCount="indefinite" />
    <animate attributeName="stroke-width" from="3" to="0.5" dur="4s" repeatCount="indefinite" />
  </circle>
  <circle cx="200" cy="200" r="10" fill="none" stroke="#22d3ee" stroke-width="2">
    <animate attributeName="r" from="15" to="175" dur="4s" begin="2s" repeatCount="indefinite" />
    <animate attributeName="opacity" from="0.9" to="0" dur="4s" begin="2s" repeatCount="indefinite" />
    <animate attributeName="stroke-width" from="3" to="0.5" dur="4s" begin="2s" repeatCount="indefinite" />
  </circle>

  <!-- Sweeping Radar Beam (SMIL animateTransform) -->
  <g>
    <path d="M 200 200 L 200 25 A 175 175 0 0 1 324 76 Z" fill="url(#beamGrad)" opacity="0.55" />
    <line x1="200" y1="200" x2="200" y2="25" stroke="#67e8f9" stroke-width="2.5" opacity="0.9" />
    <animateTransform
      attributeName="transform"
      type="rotate"
      from="0 200 200"
      to="360 200 200"
      dur="4s"
      repeatCount="indefinite"
    />
  </g>

  <!-- Target Blips (SMIL animate attributeName="opacity" / "r") -->
  <!-- Target 1: Northeast Sector -->
  <circle cx="270" cy="115" r="5.5" fill="url(#blipGrad)">
    <animate attributeName="opacity" values="0.1;1;0.8;0.2;0.1" dur="4s" repeatCount="indefinite" />
    <animate attributeName="r" values="4;6.5;5.5;4" dur="4s" repeatCount="indefinite" />
  </circle>
  <circle cx="270" cy="115" r="12" fill="none" stroke="#34d399" stroke-width="1.5">
    <animate attributeName="r" from="5" to="18" dur="2s" repeatCount="indefinite" />
    <animate attributeName="opacity" from="0.8" to="0" dur="2s" repeatCount="indefinite" />
  </circle>

  <!-- Target 2: Southwest Sector -->
  <circle cx="125" cy="275" r="5" fill="#38bdf8">
    <animate attributeName="opacity" values="0.1;0.2;1;0.6;0.1" dur="4s" repeatCount="indefinite" />
  </circle>

  <!-- Center Hub with Pulsing Core -->
  <circle cx="200" cy="200" r="7" fill="#0891b2" />
  <circle cx="200" cy="200" r="3.5" fill="#ecfeff">
    <animate attributeName="r" values="2.5;4.5;2.5" dur="1s" repeatCount="indefinite" />
  </circle>
</svg>
`})))()}var h;function g(){return(g=e((()=>{c(),u(),f(),m(),h=[{id:`rocket-launch`,name:`Rocket Launch`,description:`Smooth floating rocket with pulsating flame and twinkling stars.`,category:`Illustration`,duration:10,fps:30,format:`mp4`,isTransparent:!1,preset:`original`,scale:1,svgContent:s},{id:`loading-spinner`,name:`Loading Spinner`,description:`Radial orbiting gradient dots with ambient center pulse.`,category:`UI Element`,duration:2,fps:30,format:`webm`,isTransparent:!0,preset:`original`,scale:1,svgContent:l},{id:`mechanical-gear`,name:`Mechanical Gear`,description:`Precision interlocking dual gears with smooth synchronized rotation.`,category:`Motion Graphics`,duration:6,fps:30,format:`gif`,isTransparent:!0,preset:`original`,scale:1,svgContent:d},{id:`radar-scanner`,name:`Radar Scanner`,description:`Native SVG SMIL animation with rotating beam, sonar waves, and pulsing targets.`,category:`SMIL Animation`,duration:4,fps:30,format:`mp4`,isTransparent:!1,preset:`original`,scale:1,svgContent:p}]})))()}var _,v,y;function b(){return(b=e((()=>{_=t(),a(),r(),v=n(),y=({sample:e,onSelectSample:t})=>{let n=(0,_.useRef)(null);(0,_.useEffect)(()=>{let e=n.current?.querySelector(`svg`);if(e&&typeof e.pauseAnimations==`function`)try{e.pauseAnimations()}catch{}},[e.svgContent]);let r=()=>{let e=n.current?.querySelector(`svg`);if(e&&typeof e.unpauseAnimations==`function`)try{e.unpauseAnimations()}catch{}},a=()=>{let e=n.current?.querySelector(`svg`);if(e&&typeof e.pauseAnimations==`function`)try{e.pauseAnimations()}catch{}};return(0,v.jsxs)(`div`,{className:`sample-card`,onMouseEnter:r,onMouseLeave:a,onFocus:r,onBlur:a,children:[(0,v.jsx)(`div`,{ref:n,className:`sample-preview`,dangerouslySetInnerHTML:{__html:e.svgContent},"aria-hidden":`true`}),(0,v.jsxs)(`div`,{className:`sample-info`,children:[(0,v.jsxs)(`div`,{className:`sample-header`,children:[(0,v.jsx)(`h3`,{className:`sample-name`,children:e.name}),(0,v.jsx)(`span`,{className:`sample-tag`,children:e.format.toUpperCase()})]}),(0,v.jsx)(`p`,{className:`sample-desc`,children:e.description}),(0,v.jsxs)(i,{variant:`outline`,className:`sample-btn`,onClick:()=>t?.(e),"aria-label":`Test ${e.name} sample`,children:[(0,v.jsx)(o,{size:10,className:`btn-icon`}),` Try This Sample`]})]})]})},y.__docgenInfo={description:``,methods:[],displayName:`SampleCard`,props:{sample:{required:!0,tsType:{name:`SamplePreset`},description:``},onSelectSample:{required:!1,tsType:{name:`signature`,type:`function`,raw:`(sample: SamplePreset) => void`,signature:{arguments:[{type:{name:`SamplePreset`},name:`sample`}],return:{name:`void`}}},description:``}}}})))()}export{g as i,b as n,h as r,y as t};