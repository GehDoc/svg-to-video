import{a as e,n as t}from"./chunk-BneVvdWh.js";import{t as n}from"./react-D1sJ83FZ.js";import{t as r}from"./jsx-runtime-fcfuQg7E.js";import{n as i,t as a}from"./SvgRenderer-CfdBTLix.js";var o,s,c,l,u,d,f,p,m,h,g,_;t((()=>{o=e(n(),1),i(),s=r(),{within:c,expect:l,fn:u}=__STORYBOOK_MODULE_TEST__,d=({backgroundColor:e,svgContent:t,width:n,height:r,seekTime:i,onCapture:c})=>{let l=(0,o.useRef)(null);(0,o.useEffect)(()=>{l.current&&l.current.loadSvg(t,n,r,e)},[e,t,n,r]),(0,o.useEffect)(()=>{l.current&&l.current.seek(i)},[i]);let u=async e=>{if(l.current){let t=await l.current.capture(e),n=document.createElement(`canvas`);n.width=t.width,n.height=t.height;let r=n.getContext(`bitmaprenderer`);r&&r.transferFromImageBitmap(t);let i=n.toDataURL();return c?.({method:e,width:t.width,height:t.height,dataUrl:i}),i}return null};return(0,s.jsxs)(`div`,{style:{backgroundColor:`#f5f5f5`,padding:`20px`,minHeight:`100vh`},children:[(0,s.jsxs)(`div`,{style:{marginBottom:`20px`,display:`flex`,gap:`10px`,alignItems:`center`},children:[(0,s.jsx)(`button`,{onClick:()=>u(`optimal`),"data-testid":`capture-optimal`,children:`Capture (Optimal)`}),(0,s.jsx)(`button`,{onClick:()=>u(`high-fidelity`),"data-testid":`capture-hifi`,children:`Capture (High-Fidelity)`}),(0,s.jsxs)(`span`,{style:{fontSize:`12px`,color:`#666`},children:[`Current Seek: `,i,`ms`]})]}),(0,s.jsx)(`div`,{style:{display:`inline-block`,boxShadow:`0 4px 12px rgba(0,0,0,0.1)`,backgroundColor:`white`,borderRadius:`4px`,overflow:`hidden`},children:(0,s.jsx)(a,{ref:l})})]})},f={title:`Components/SvgRenderer`,component:d,tags:[`autodocs`],args:{onCapture:u(),backgroundColor:`#ffffff`,width:500,height:500,seekTime:0,svgContent:`<svg width="500" height="500" xmlns="http://www.w3.org/2000/svg"><polygon points="0,0 500,0 0,500" fill="blue" opacity="0.8" /><circle cx="350" cy="150" r="100" fill="yellow"><animate attributeName="r" from="50" to="150" dur="2s" repeatCount="indefinite" /></circle></svg>`}},p={play:async({canvasElement:e})=>{await l(c(e).getByTestId(`svg-renderer`)).toBeInTheDocument()}},m={args:{backgroundColor:`#f0f0f0`,svgContent:`
      <svg width="400" height="100" viewBox="0 0 400 100" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#eee" />
        <circle cx="50" cy="50" r="20" fill="#3b82f6">
          <animate attributeName="cx" from="50" to="350" dur="2s" repeatCount="indefinite" />
        </circle>
      </svg>
    `,width:400,height:100}},h={args:{backgroundColor:`#ffffff`,width:600,height:600,svgContent:`
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
    `}},g={args:{backgroundColor:`#ffffff`,width:500,height:300,svgContent:`
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
    `}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    const renderer = canvas.getByTestId('svg-renderer');
    await expect(renderer).toBeInTheDocument();
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
}`,...h.parameters?.docs?.source}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
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
}`,...g.parameters?.docs?.source}}},_=[`Default`,`LoopSynchronizedCapture`,`AnimationStressTest`,`FilterFidelity`]}))();export{h as AnimationStressTest,p as Default,g as FilterFidelity,m as LoopSynchronizedCapture,_ as __namedExportsOrder,f as default};