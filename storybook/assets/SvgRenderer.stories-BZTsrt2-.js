import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{d as t}from"./iframe-B-fTLtjz.js";import{t as n}from"./jsx-runtime-DeHZSEgm.js";import{n as r,t as i}from"./SvgRenderer-4rPXxjjB.js";var a,o,s,c,l,u,d,f,p,m,h,g,_,v,y,b;function x(){return(x=e((()=>{a=t(),r(),o=n(),{within:s,expect:c,waitFor:l}=__STORYBOOK_MODULE_TEST__,u=(0,a.forwardRef)(({backgroundColor:e,svgContent:t,width:n,height:r,seekTime:s,isTransparent:c},l)=>{let u=(0,a.useRef)(null);return(0,a.useImperativeHandle)(l,()=>({loadSvg:(e,t,n)=>u.current.loadSvg(e,t,n),seek:e=>u.current.seek(e),capture:e=>u.current.capture(e,!1),isReady:()=>u.current.isReady()})),(0,a.useEffect)(()=>{u.current&&u.current.loadSvg(t,n,r)},[t,n,r]),(0,a.useEffect)(()=>{u.current&&u.current.seek(s)},[s]),(0,o.jsx)(`div`,{className:`svg-renderer-story-wrapper`,children:(0,o.jsx)(i,{ref:u,backgroundColor:e,isTransparent:c})})}),u.displayName=`Wrapper`,d={title:`Components/SvgRenderer`,component:u,args:{backgroundColor:`#0f172a`,width:500,height:500,seekTime:0,isTransparent:!1,svgContent:`<svg width="500" height="500" xmlns="http://www.w3.org/2000/svg"><polygon points="0,0 500,0 0,500" fill="blue" opacity="0.8" /><circle cx="350" cy="150" r="100" fill="yellow"><animate attributeName="r" from="50" to="150" dur="2s" repeatCount="indefinite" /></circle></svg>`}},f={name:`Background Color Test`,play:async({canvasElement:e})=>{let t=s(e).getByTestId(`svg-renderer`);await c(t).toBeInTheDocument()}},p={args:{backgroundColor:`#0f172a`,isTransparent:!0,svgContent:`<svg width="500" height="500" xmlns="http://www.w3.org/2000/svg"><circle cx="250" cy="250" r="100" fill="red" /></svg>`}},m={args:{backgroundColor:`#f0f0f0`,svgContent:`
      <svg width="400" height="100" viewBox="0 0 400 100" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#eee" />
        <circle cx="50" cy="50" r="20" fill="#3b82f6">
          <animate attributeName="cx" from="50" to="350" dur="2s" repeatCount="indefinite" />
        </circle>
      </svg>
    `,width:400,height:100}},h={args:{backgroundColor:`#ffffff`,width:400,height:100,svgContent:`
      <svg width="400" height="100" viewBox="0 0 400 100" xmlns="http://www.w3.org/2000/svg">
        <style>
          @keyframes slide {
            from { transform: translateX(0); }
            to { transform: translateX(300px); }
          }
          circle {
            animation: slide 2s infinite alternate ease-in-out;
          }
        </style>
        <rect width="100%" height="100%" fill="#eee" />
        <circle cx="50" cy="50" r="20" fill="#f43f5e" />
      </svg>
    `}},g={args:{backgroundColor:`#ffffff`,width:400,height:200,svgContent:`
      <svg width="400" height="200" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#fee2e2" />
        <circle cx="200" cy="80" r="50" fill="red" />
        <script>window.xss_executed = true;<\/script>
        <rect x="0" y="0" width="100" height="100" fill="transparent" onload="window.xss_executed = true;" />
        <text x="20" y="180" font-size="16" font-weight="bold" fill="red">No JS execution allowed here ?</text>
      </svg>
    `},play:async({canvasElement:e})=>{let t=s(e).getByTestId(`svg-renderer`);await l(()=>{let e=t.querySelector(`iframe`);if(!e||!e.src.startsWith(`blob:`))throw Error(`Renderer not ready`)},{timeout:2e3}),await new Promise(e=>setTimeout(e,2e3)),await c(window.xss_executed).toBeUndefined(),window.xss_executed=void 0}},_={args:{backgroundColor:`#ffffff`,width:600,height:600,svgContent:`
      <svg width="600" height="600" viewBox="0 0 600 600" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#1a1a1a" />
        <g transform="translate(300, 300)">
          <circle r="20" fill="none" stroke="hsl(0, 70%, 60%)" stroke-width="2">
            <animate attributeName="stroke-dasharray" from="0, 1000" to="1000, 0" dur="1s" repeatCount="indefinite" />
            <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="2s" repeatCount="indefinite" />
          </circle>
          <circle r="32" fill="none" stroke="hsl(18, 70%, 60%)" stroke-width="2">
            <animate attributeName="stroke-dasharray" from="0, 1000" to="1000, 0" dur="1.2s" repeatCount="indefinite" />
            <animateTransform attributeName="transform" type="rotate" from="0" to="-360" dur="2.5s" repeatCount="indefinite" />
          </circle>
          <circle r="44" fill="none" stroke="hsl(36, 70%, 60%)" stroke-width="2">
            <animate attributeName="stroke-dasharray" from="0, 1000" to="1000, 0" dur="1.4s" repeatCount="indefinite" />
            <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="3s" repeatCount="indefinite" />
          </circle>
          <circle r="56" fill="none" stroke="hsl(54, 70%, 60%)" stroke-width="2">
            <animate attributeName="stroke-dasharray" from="0, 1000" to="1000, 0" dur="1.6s" repeatCount="indefinite" />
            <animateTransform attributeName="transform" type="rotate" from="0" to="-360" dur="3.5s" repeatCount="indefinite" />
          </circle>
          <circle r="68" fill="none" stroke="hsl(72, 70%, 60%)" stroke-width="2">
            <animate attributeName="stroke-dasharray" from="0, 1000" to="1000, 0" dur="1.8s" repeatCount="indefinite" />
            <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="4s" repeatCount="indefinite" />
          </circle>
          <circle r="80" fill="none" stroke="hsl(90, 70%, 60%)" stroke-width="2">
            <animate attributeName="stroke-dasharray" from="0, 1000" to="1000, 0" dur="2s" repeatCount="indefinite" />
            <animateTransform attributeName="transform" type="rotate" from="0" to="-360" dur="4.5s" repeatCount="indefinite" />
          </circle>
          <circle r="92" fill="none" stroke="hsl(108, 70%, 60%)" stroke-width="2">
            <animate attributeName="stroke-dasharray" from="0, 1000" to="1000, 0" dur="2.2s" repeatCount="indefinite" />
            <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="5s" repeatCount="indefinite" />
          </circle>
          <circle r="104" fill="none" stroke="hsl(126, 70%, 60%)" stroke-width="2">
            <animate attributeName="stroke-dasharray" from="0, 1000" to="1000, 0" dur="2.4s" repeatCount="indefinite" />
            <animateTransform attributeName="transform" type="rotate" from="0" to="-360" dur="5.5s" repeatCount="indefinite" />
          </circle>
          <circle r="116" fill="none" stroke="hsl(144, 70%, 60%)" stroke-width="2">
            <animate attributeName="stroke-dasharray" from="0, 1000" to="1000, 0" dur="2.6s" repeatCount="indefinite" />
            <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="6s" repeatCount="indefinite" />
          </circle>
          <circle r="128" fill="none" stroke="hsl(162, 70%, 60%)" stroke-width="2">
            <animate attributeName="stroke-dasharray" from="0, 1000" to="1000, 0" dur="2.8s" repeatCount="indefinite" />
            <animateTransform attributeName="transform" type="rotate" from="0" to="-360" dur="6.5s" repeatCount="indefinite" />
          </circle>
        </g>
      </svg>
    `}},v={args:{backgroundColor:`#ffffff`,width:500,height:300,svgContent:`
      <svg width="500" height="300" viewBox="0 0 500 300" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="blur">
            <feGaussianBlur in="SourceGraphic" stdDeviation="5" />
          </filter>
          <filter id="colorMatrix">
            <feColorMatrix type="matrix" values="0 0 0 0 1  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" />
          </filter>
        </defs>
        <rect width="100%" height="100%" fill="#eee" />
        <circle cx="100" cy="150" r="50" fill="red" filter="url(#blur)" />
        <circle cx="250" cy="150" r="50" fill="green" filter="url(#colorMatrix)" />
        <rect x="350" y="100" width="100" height="100" fill="blue">
          <animate attributeName="opacity" values="1;0.2;1" dur="2s" repeatCount="indefinite" />
        </rect>
      </svg>
    `}},y={args:{backgroundColor:`#ffffff`,width:400,height:200,svgContent:`
      <svg width="400" height="200" viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#f8fafc" />
        
        <!-- set tag test -->
        <rect x="50" y="50" width="50" height="50" fill="blue">
          <set attributeName="fill" to="red" begin="1s" />
        </rect>

        <!-- animateMotion test -->
        <circle r="15" fill="green">
          <animateMotion 
            path="M 50 150 L 350 150" 
            dur="2s" 
            repeatCount="indefinite" />
        </circle>
      </svg>
    `}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  name: 'Background Color Test',
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    const renderer = canvas.getByTestId('svg-renderer');
    await expect(renderer).toBeInTheDocument();
  }
}`,...f.parameters?.docs?.source}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  args: {
    backgroundColor: '#0f172a',
    isTransparent: true,
    svgContent: '<svg width="500" height="500" xmlns="http://www.w3.org/2000/svg"><circle cx="250" cy="250" r="100" fill="red" /></svg>'
  }
}`,...p.parameters?.docs?.source}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  args: {
    backgroundColor: '#f0f0f0',
    svgContent: \`
      <svg width="400" height="100" viewBox="0 0 400 100" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#eee" />
        <circle cx="50" cy="50" r="20" fill="#3b82f6">
          <animate attributeName="cx" from="50" to="350" dur="2s" repeatCount="indefinite" />
        </circle>
      </svg>
    \`,
    width: 400,
    height: 100
  }
}`,...m.parameters?.docs?.source}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  args: {
    backgroundColor: '#ffffff',
    width: 400,
    height: 100,
    svgContent: \`
      <svg width="400" height="100" viewBox="0 0 400 100" xmlns="http://www.w3.org/2000/svg">
        <style>
          @keyframes slide {
            from { transform: translateX(0); }
            to { transform: translateX(300px); }
          }
          circle {
            animation: slide 2s infinite alternate ease-in-out;
          }
        </style>
        <rect width="100%" height="100%" fill="#eee" />
        <circle cx="50" cy="50" r="20" fill="#f43f5e" />
      </svg>
    \`
  }
}`,...h.parameters?.docs?.source}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  args: {
    backgroundColor: '#ffffff',
    width: 400,
    height: 200,
    svgContent: \`
      <svg width="400" height="200" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#fee2e2" />
        <circle cx="200" cy="80" r="50" fill="red" />
        <script>window.xss_executed = true;<\/script>
        <rect x="0" y="0" width="100" height="100" fill="transparent" onload="window.xss_executed = true;" />
        <text x="20" y="180" font-size="16" font-weight="bold" fill="red">No JS execution allowed here ?</text>
      </svg>
    \`
  },
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    const renderer = canvas.getByTestId('svg-renderer');

    // Wait until the renderer has injected the iframe with the blob src
    await waitFor(() => {
      const iframe = renderer.querySelector('iframe');
      if (!iframe || !iframe.src.startsWith('blob:')) {
        throw new Error('Renderer not ready');
      }
    }, {
      timeout: 2000
    });

    // Wait for internal script execution
    await new Promise(resolve => setTimeout(resolve, 2000));
    await expect((window as WindowExtensionXss).xss_executed).toBeUndefined();

    // Teardown
    (window as WindowExtensionXss).xss_executed = undefined;
  }
}`,...g.parameters?.docs?.source}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  args: {
    backgroundColor: '#ffffff',
    width: 600,
    height: 600,
    svgContent: \`
      <svg width="600" height="600" viewBox="0 0 600 600" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#1a1a1a" />
        <g transform="translate(300, 300)">
          <circle r="20" fill="none" stroke="hsl(0, 70%, 60%)" stroke-width="2">
            <animate attributeName="stroke-dasharray" from="0, 1000" to="1000, 0" dur="1s" repeatCount="indefinite" />
            <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="2s" repeatCount="indefinite" />
          </circle>
          <circle r="32" fill="none" stroke="hsl(18, 70%, 60%)" stroke-width="2">
            <animate attributeName="stroke-dasharray" from="0, 1000" to="1000, 0" dur="1.2s" repeatCount="indefinite" />
            <animateTransform attributeName="transform" type="rotate" from="0" to="-360" dur="2.5s" repeatCount="indefinite" />
          </circle>
          <circle r="44" fill="none" stroke="hsl(36, 70%, 60%)" stroke-width="2">
            <animate attributeName="stroke-dasharray" from="0, 1000" to="1000, 0" dur="1.4s" repeatCount="indefinite" />
            <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="3s" repeatCount="indefinite" />
          </circle>
          <circle r="56" fill="none" stroke="hsl(54, 70%, 60%)" stroke-width="2">
            <animate attributeName="stroke-dasharray" from="0, 1000" to="1000, 0" dur="1.6s" repeatCount="indefinite" />
            <animateTransform attributeName="transform" type="rotate" from="0" to="-360" dur="3.5s" repeatCount="indefinite" />
          </circle>
          <circle r="68" fill="none" stroke="hsl(72, 70%, 60%)" stroke-width="2">
            <animate attributeName="stroke-dasharray" from="0, 1000" to="1000, 0" dur="1.8s" repeatCount="indefinite" />
            <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="4s" repeatCount="indefinite" />
          </circle>
          <circle r="80" fill="none" stroke="hsl(90, 70%, 60%)" stroke-width="2">
            <animate attributeName="stroke-dasharray" from="0, 1000" to="1000, 0" dur="2s" repeatCount="indefinite" />
            <animateTransform attributeName="transform" type="rotate" from="0" to="-360" dur="4.5s" repeatCount="indefinite" />
          </circle>
          <circle r="92" fill="none" stroke="hsl(108, 70%, 60%)" stroke-width="2">
            <animate attributeName="stroke-dasharray" from="0, 1000" to="1000, 0" dur="2.2s" repeatCount="indefinite" />
            <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="5s" repeatCount="indefinite" />
          </circle>
          <circle r="104" fill="none" stroke="hsl(126, 70%, 60%)" stroke-width="2">
            <animate attributeName="stroke-dasharray" from="0, 1000" to="1000, 0" dur="2.4s" repeatCount="indefinite" />
            <animateTransform attributeName="transform" type="rotate" from="0" to="-360" dur="5.5s" repeatCount="indefinite" />
          </circle>
          <circle r="116" fill="none" stroke="hsl(144, 70%, 60%)" stroke-width="2">
            <animate attributeName="stroke-dasharray" from="0, 1000" to="1000, 0" dur="2.6s" repeatCount="indefinite" />
            <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="6s" repeatCount="indefinite" />
          </circle>
          <circle r="128" fill="none" stroke="hsl(162, 70%, 60%)" stroke-width="2">
            <animate attributeName="stroke-dasharray" from="0, 1000" to="1000, 0" dur="2.8s" repeatCount="indefinite" />
            <animateTransform attributeName="transform" type="rotate" from="0" to="-360" dur="6.5s" repeatCount="indefinite" />
          </circle>
        </g>
      </svg>
    \`
  }
}`,..._.parameters?.docs?.source}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  args: {
    backgroundColor: '#ffffff',
    width: 500,
    height: 300,
    svgContent: \`
      <svg width="500" height="300" viewBox="0 0 500 300" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="blur">
            <feGaussianBlur in="SourceGraphic" stdDeviation="5" />
          </filter>
          <filter id="colorMatrix">
            <feColorMatrix type="matrix" values="0 0 0 0 1  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" />
          </filter>
        </defs>
        <rect width="100%" height="100%" fill="#eee" />
        <circle cx="100" cy="150" r="50" fill="red" filter="url(#blur)" />
        <circle cx="250" cy="150" r="50" fill="green" filter="url(#colorMatrix)" />
        <rect x="350" y="100" width="100" height="100" fill="blue">
          <animate attributeName="opacity" values="1;0.2;1" dur="2s" repeatCount="indefinite" />
        </rect>
      </svg>
    \`
  }
}`,...v.parameters?.docs?.source}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  args: {
    backgroundColor: '#ffffff',
    width: 400,
    height: 200,
    svgContent: \`
      <svg width="400" height="200" viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#f8fafc" />
        
        <!-- set tag test -->
        <rect x="50" y="50" width="50" height="50" fill="blue">
          <set attributeName="fill" to="red" begin="1s" />
        </rect>

        <!-- animateMotion test -->
        <circle r="15" fill="green">
          <animateMotion 
            path="M 50 150 L 350 150" 
            dur="2s" 
            repeatCount="indefinite" />
        </circle>
      </svg>
    \`
  }
}`,...y.parameters?.docs?.source}}},b=[`BackgroundTest`,`TransparentBackgroundTest`,`SMILAnimation`,`CSSAnimation`,`MaliciousXSS`,`AnimationStressTest`,`FilterFidelity`,`StrippedTagsAnimation`]})))()}x();export{_ as AnimationStressTest,f as BackgroundTest,h as CSSAnimation,v as FilterFidelity,g as MaliciousXSS,m as SMILAnimation,y as StrippedTagsAnimation,p as TransparentBackgroundTest,b as __namedExportsOrder,d as default};