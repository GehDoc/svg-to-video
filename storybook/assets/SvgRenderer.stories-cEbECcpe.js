import{a as e,n as t}from"./chunk-DnJy8xQt.js";import{a as n}from"./iframe--ciyqCWl.js";import{t as r}from"./jsx-runtime-DxP0NviS.js";import{n as i,t as a}from"./SvgRenderer-DvPFyEoS.js";var o=t((()=>{})),s,c,l,u,d,f,p,m,h,g,_,v,y,b,x,S;t((()=>{s=e(n(),1),o(),i(),c=r(),{within:l,expect:u,waitFor:d}=__STORYBOOK_MODULE_TEST__,f=(0,s.forwardRef)(({backgroundColor:e,svgContent:t,width:n,height:r,seekTime:i,isTransparent:o},l)=>{let u=(0,s.useRef)(null);return(0,s.useImperativeHandle)(l,()=>({loadSvg:(e,t,n)=>u.current.loadSvg(e,t,n),seek:e=>u.current.seek(e),capture:e=>u.current.capture(e,!1),isReady:()=>u.current.isReady()})),(0,s.useEffect)(()=>{u.current&&u.current.loadSvg(t,n,r)},[t,n,r]),(0,s.useEffect)(()=>{u.current&&u.current.seek(i)},[i]),(0,c.jsx)(`div`,{className:`svg-renderer-story-wrapper`,children:(0,c.jsx)(a,{ref:u,backgroundColor:e,isTransparent:o})})}),f.displayName=`Wrapper`,p={title:`Components/SvgRenderer`,component:f,args:{backgroundColor:`#0f172a`,width:500,height:500,seekTime:0,isTransparent:!1,svgContent:`<svg width="500" height="500" xmlns="http://www.w3.org/2000/svg"><polygon points="0,0 500,0 0,500" fill="blue" opacity="0.8" /><circle cx="350" cy="150" r="100" fill="yellow"><animate attributeName="r" from="50" to="150" dur="2s" repeatCount="indefinite" /></circle></svg>`}},m={name:`Background Color Test`,play:async({canvasElement:e})=>{await u(l(e).getByTestId(`svg-renderer`)).toBeInTheDocument()}},h={args:{backgroundColor:`#0f172a`,isTransparent:!0,svgContent:`<svg width="500" height="500" xmlns="http://www.w3.org/2000/svg"><circle cx="250" cy="250" r="100" fill="red" /></svg>`}},g={args:{backgroundColor:`#f0f0f0`,svgContent:`
      <svg width="400" height="100" viewBox="0 0 400 100" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#eee" />
        <circle cx="50" cy="50" r="20" fill="#3b82f6">
          <animate attributeName="cx" from="50" to="350" dur="2s" repeatCount="indefinite" />
        </circle>
      </svg>
    `,width:400,height:100}},_={args:{backgroundColor:`#ffffff`,width:400,height:100,svgContent:`
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
    `}},v={args:{backgroundColor:`#ffffff`,width:400,height:200,svgContent:`
      <svg width="400" height="200" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#fee2e2" />
        <circle cx="200" cy="80" r="50" fill="red" />
        <script>window.xss_executed = true;<\/script>
        <rect x="0" y="0" width="100" height="100" fill="transparent" onload="window.xss_executed = true;" />
        <text x="20" y="180" font-size="16" font-weight="bold" fill="red">No JS execution allowed here ?</text>
      </svg>
    `},play:async({canvasElement:e})=>{let t=l(e).getByTestId(`svg-renderer`);await d(()=>{let e=t.querySelector(`iframe`);if(!e||!e.src.startsWith(`blob:`))throw Error(`Renderer not ready`)},{timeout:2e3}),await new Promise(e=>setTimeout(e,2e3)),await u(window.xss_executed).toBeUndefined(),window.xss_executed=void 0}},y={args:{backgroundColor:`#ffffff`,width:600,height:600,svgContent:`
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
    `}},b={args:{backgroundColor:`#ffffff`,width:500,height:300,svgContent:`
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
    `}},x={args:{backgroundColor:`#ffffff`,width:400,height:200,svgContent:`
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
    `}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  name: 'Background Color Test',
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    const renderer = canvas.getByTestId('svg-renderer');
    await expect(renderer).toBeInTheDocument();
  }
}`,...m.parameters?.docs?.source}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  args: {
    backgroundColor: '#0f172a',
    isTransparent: true,
    svgContent: '<svg width="500" height="500" xmlns="http://www.w3.org/2000/svg"><circle cx="250" cy="250" r="100" fill="red" /></svg>'
  }
}`,...h.parameters?.docs?.source}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
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
}`,...g.parameters?.docs?.source}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
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
}`,..._.parameters?.docs?.source}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
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
}`,...v.parameters?.docs?.source}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
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
}`,...y.parameters?.docs?.source}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
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
}`,...b.parameters?.docs?.source}}},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
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
}`,...x.parameters?.docs?.source}}},S=[`BackgroundTest`,`TransparentBackgroundTest`,`SMILAnimation`,`CSSAnimation`,`MaliciousXSS`,`AnimationStressTest`,`FilterFidelity`,`StrippedTagsAnimation`]}))();export{y as AnimationStressTest,m as BackgroundTest,_ as CSSAnimation,b as FilterFidelity,v as MaliciousXSS,g as SMILAnimation,x as StrippedTagsAnimation,h as TransparentBackgroundTest,S as __namedExportsOrder,p as default};