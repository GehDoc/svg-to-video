import{a as e,n as t}from"./chunk-BneVvdWh.js";import{t as n}from"./react-D1sJ83FZ.js";import{t as r}from"./jsx-runtime-fcfuQg7E.js";function i(e){document.getAnimations().forEach(t=>{try{t.pause()}catch{}t.currentTime=e}),document.querySelectorAll(`svg`).forEach(t=>{try{typeof t.pauseAnimations==`function`&&t.pauseAnimations(),typeof t.setCurrentTime==`function`&&t.setCurrentTime(e/1e3)}catch{}})}var a=t((()=>{(function(){typeof module<`u`&&module.exports&&(module.exports={seekAnimations:i})})()}));function o(e){let t=`fill.fill-opacity.fill-rule.stroke.stroke-opacity.stroke-width.stroke-linecap.stroke-linejoin.stroke-miterlimit.stroke-dasharray.stroke-dashoffset.opacity.display.visibility.filter.mask.clip-path.clip-rule.stop-color.stop-opacity.font-family.font-size.font-weight.font-style.text-anchor.text-decoration.dominant-baseline.alignment-baseline.baseline-shift.transform.transform-origin.x.y.width.height.cx.cy.r.rx.ry.color.flood-color.flood-opacity.lighting-color.mix-blend-mode.isolation`.split(`.`),n=document.getElementById(`svg-container`),r=document.getElementById(`capture-canvas`),i=!1;window.addEventListener(`message`,async a=>{let{type:o,payload:s}=a.data;if(o===`LOAD_SVG`){i=!1;let{svgContent:t,width:a,height:o,backgroundColor:c,timeMs:l}=s;n.innerHTML=t,n.style.width=a+`px`,n.style.height=o+`px`,n.style.backgroundColor=c,r.width=a,r.height=o,e(l),requestAnimationFrame(()=>{i=!0,window.parent.postMessage({type:`READY`},`*`)})}if(o===`SEEK`){if(!i)return;e(s.timeMs),await new Promise(e=>requestAnimationFrame(e)),window.parent.postMessage({type:`SEEKED`},`*`)}if(o===`CAPTURE`){if(!i)return;let e=n.querySelector(`svg`),a=r.getContext(`2d`);if(!e||!a)return;let o=e.cloneNode(!0);o.querySelectorAll(`animate, animateTransform, animateMotion, set`).forEach(e=>e.remove());let c=[e,...Array.from(e.querySelectorAll(`*`)).filter(e=>![`animate`,`animateTransform`,`animateMotion`,`set`].includes(e.tagName.toLowerCase()))],l=[o,...Array.from(o.querySelectorAll(`*`))];c.forEach((e,n)=>{let r=window.getComputedStyle(e),i=l[n];if(!(!i||!i.style))if(s.method===`high-fidelity`)for(let e=0;e<r.length;e++){let t=r[e];i.style.setProperty(t,r.getPropertyValue(t),r.getPropertyPriority(t))}else for(let e of t){let t=r.getPropertyValue(e);t&&i.style.setProperty(e,t)}});let u=new XMLSerializer().serializeToString(o),d=new Blob([u],{type:`image/svg+xml;charset=utf-8`}),f=URL.createObjectURL(d),p=new Image;await new Promise((e,t)=>{p.onload=e,p.onerror=t,p.src=f}),a.clearRect(0,0,r.width,r.height),a.drawImage(p,0,0,r.width,r.height),URL.revokeObjectURL(f);let m=await createImageBitmap(r);window.parent.postMessage({type:`CAPTURE_RESULT`,payload:m},`*`,[m])}}),window.parent.postMessage({type:`SCRIPT_LOADED`},`*`)}var s=t((()=>{})),c,l=t((()=>{c=`<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="favicon.svg?v=2" />
    <style>
      body,
      html {
        margin: 0;
        padding: 0;
        overflow: hidden;
        width: 100%;
        height: 100%;
        background: transparent;
      }
      #svg-container {
        width: 100%;
        height: 100%;
        max-width: 100%;
        max-height: 100%;
      }
      svg {
        display: block;
        width: 100%;
        height: 100%;
      }
      canvas {
        display: none;
      }
    </style>
  </head>
  <body>
    <div id="svg-container"></div>
    <canvas id="capture-canvas"></canvas>
    <script type="module">
      // RENDERER_SCRIPT_PLACEHOLDER
    <\/script>
  </body>
</html>
`})),u,d,f,p=t((()=>{u=e(n(),1),a(),s(),l(),d=r(),f=(0,u.forwardRef)((e,t)=>{let n=(0,u.useRef)(null),[r,a]=(0,u.useState)(!1),[s,l]=(0,u.useState)(!1),[f,p]=(0,u.useState)({width:0,height:0});return(0,u.useEffect)(()=>{let e=`(${o.toString()})(window.seekAnimations);`,t=c.replace(`// RENDERER_SCRIPT_PLACEHOLDER`,`
      window.seekAnimations = ${i.toString()};
      ${e}
    `),r=e=>{e.data.type===`SCRIPT_LOADED`&&l(!0)};window.addEventListener(`message`,r);let a=new Blob([t],{type:`text/html`}),s=URL.createObjectURL(a);return n.current&&(n.current.src=s),()=>{URL.revokeObjectURL(s),window.removeEventListener(`message`,r)}},[]),(0,u.useImperativeHandle)(t,()=>({loadSvg:async(e,t,r,i)=>{a(!1),p({width:t,height:r});let o=n.current;if(o)return s||await new Promise(e=>{let t=n=>{n.data.type===`SCRIPT_LOADED`&&(window.removeEventListener(`message`,t),e())};window.addEventListener(`message`,t)}),new Promise(n=>{let s=e=>{e.data.type===`READY`&&(window.removeEventListener(`message`,s),a(!0),n())};window.addEventListener(`message`,s),o.contentWindow?.postMessage({type:`LOAD_SVG`,payload:{svgContent:e,width:t,height:r,backgroundColor:i,timeMs:0}},`*`)})},seek:async e=>new Promise(t=>{let r=e=>{e.data.type===`SEEKED`&&(window.removeEventListener(`message`,r),t())};window.addEventListener(`message`,r),n.current?.contentWindow?.postMessage({type:`SEEK`,payload:{timeMs:e}},`*`)}),capture:async e=>new Promise(t=>{let r=e=>{e.data.type===`CAPTURE_RESULT`&&(window.removeEventListener(`message`,r),t(e.data.payload))};window.addEventListener(`message`,r),n.current?.contentWindow?.postMessage({type:`CAPTURE`,payload:{method:e}},`*`)}),isReady:()=>r})),(0,d.jsxs)(`div`,{className:`renderer-monitor`,"data-testid":`svg-renderer`,children:[(0,d.jsx)(`p`,{className:`monitor-label`,children:`Live Monitor`}),(0,d.jsx)(`div`,{className:`monitor-viewport`,children:(0,d.jsx)(`iframe`,{ref:n,title:`svg-renderer`,style:{width:f.width,height:f.height,maxWidth:`100%`,maxHeight:`100%`,aspectRatio:`${f.width} / ${f.height}`,border:`none`,pointerEvents:`none`,backgroundColor:`white`}})})]})}),f.displayName=`SvgRenderer`,f.__docgenInfo={description:``,methods:[{name:`loadSvg`,docblock:null,modifiers:[`async`],params:[{name:`svgContent`,optional:!1,type:{name:`string`}},{name:`width`,optional:!1,type:{name:`number`}},{name:`height`,optional:!1,type:{name:`number`}},{name:`backgroundColor`,optional:!1,type:{name:`string`}}],returns:null},{name:`seek`,docblock:null,modifiers:[`async`],params:[{name:`timeMs`,optional:!1,type:{name:`number`}}],returns:null},{name:`capture`,docblock:null,modifiers:[`async`],params:[{name:`method`,optional:!1,type:{name:`union`,raw:`'optimal' | 'high-fidelity'`,elements:[{name:`literal`,value:`'optimal'`},{name:`literal`,value:`'high-fidelity'`}]}}],returns:null},{name:`isReady`,docblock:null,modifiers:[],params:[],returns:null}],displayName:`SvgRenderer`}})),m,h,g,_,v,y,b,x,S,C,w,T;t((()=>{m=e(n(),1),p(),h=r(),{within:g,expect:_,fn:v}=__STORYBOOK_MODULE_TEST__,y=({backgroundColor:e,svgContent:t,width:n,height:r,seekTime:i,onCapture:a})=>{let o=(0,m.useRef)(null);(0,m.useEffect)(()=>{o.current&&o.current.loadSvg(t,n,r,e)},[e,t,n,r]),(0,m.useEffect)(()=>{o.current&&o.current.seek(i)},[i]);let s=async e=>{if(o.current){let t=await o.current.capture(e),n=document.createElement(`canvas`);n.width=t.width,n.height=t.height;let r=n.getContext(`bitmaprenderer`);r&&r.transferFromImageBitmap(t);let i=n.toDataURL();return a?.({method:e,width:t.width,height:t.height,dataUrl:i}),i}return null};return(0,h.jsxs)(`div`,{style:{backgroundColor:`#f5f5f5`,padding:`20px`,minHeight:`100vh`},children:[(0,h.jsxs)(`div`,{style:{marginBottom:`20px`,display:`flex`,gap:`10px`,alignItems:`center`},children:[(0,h.jsx)(`button`,{onClick:()=>s(`optimal`),"data-testid":`capture-optimal`,children:`Capture (Optimal)`}),(0,h.jsx)(`button`,{onClick:()=>s(`high-fidelity`),"data-testid":`capture-hifi`,children:`Capture (High-Fidelity)`}),(0,h.jsxs)(`span`,{style:{fontSize:`12px`,color:`#666`},children:[`Current Seek: `,i,`ms`]})]}),(0,h.jsx)(`div`,{style:{display:`inline-block`,boxShadow:`0 4px 12px rgba(0,0,0,0.1)`,backgroundColor:`white`,borderRadius:`4px`,overflow:`hidden`},children:(0,h.jsx)(f,{ref:o})})]})},b={title:`Components/SvgRenderer`,component:y,tags:[`autodocs`],args:{onCapture:v(),backgroundColor:`#ffffff`,width:500,height:500,seekTime:0,svgContent:`<svg width="500" height="500" xmlns="http://www.w3.org/2000/svg"><polygon points="0,0 500,0 0,500" fill="blue" opacity="0.8" /><circle cx="350" cy="150" r="100" fill="yellow"><animate attributeName="r" from="50" to="150" dur="2s" repeatCount="indefinite" /></circle></svg>`}},x={play:async({canvasElement:e})=>{await _(g(e).getByTestId(`svg-renderer`)).toBeInTheDocument()}},S={args:{backgroundColor:`#f0f0f0`,svgContent:`
      <svg width="400" height="100" viewBox="0 0 400 100" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#eee" />
        <circle cx="50" cy="50" r="20" fill="#3b82f6">
          <animate attributeName="cx" from="50" to="350" dur="2s" repeatCount="indefinite" />
        </circle>
      </svg>
    `,width:400,height:100}},C={args:{backgroundColor:`#ffffff`,width:600,height:600,svgContent:`
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
    `}},w={args:{backgroundColor:`#ffffff`,width:500,height:300,svgContent:`
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
    `}},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    const renderer = canvas.getByTestId('svg-renderer');
    await expect(renderer).toBeInTheDocument();
  }
}`,...x.parameters?.docs?.source}}},S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
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
}`,...S.parameters?.docs?.source}}},C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
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
}`,...C.parameters?.docs?.source}}},w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
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
}`,...w.parameters?.docs?.source}}},T=[`Default`,`LoopSynchronizedCapture`,`AnimationStressTest`,`FilterFidelity`]}))();export{C as AnimationStressTest,x as Default,w as FilterFidelity,S as LoopSynchronizedCapture,T as __namedExportsOrder,b as default};