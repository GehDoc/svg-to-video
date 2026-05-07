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
    `),r=e=>{e.data.type===`SCRIPT_LOADED`&&l(!0)};window.addEventListener(`message`,r);let a=new Blob([t],{type:`text/html`}),s=URL.createObjectURL(a);return n.current&&(n.current.src=s),()=>{URL.revokeObjectURL(s),window.removeEventListener(`message`,r)}},[]),(0,u.useImperativeHandle)(t,()=>({loadSvg:async(e,t,r,i)=>{a(!1),p({width:t,height:r});let o=n.current;if(o)return s||await new Promise(e=>{let t=n=>{n.data.type===`SCRIPT_LOADED`&&(window.removeEventListener(`message`,t),e())};window.addEventListener(`message`,t)}),new Promise(n=>{let s=e=>{e.data.type===`READY`&&(window.removeEventListener(`message`,s),a(!0),n())};window.addEventListener(`message`,s),o.contentWindow?.postMessage({type:`LOAD_SVG`,payload:{svgContent:e,width:t,height:r,backgroundColor:i,timeMs:0}},`*`)})},seek:async e=>new Promise(t=>{let r=e=>{e.data.type===`SEEKED`&&(window.removeEventListener(`message`,r),t())};window.addEventListener(`message`,r),n.current?.contentWindow?.postMessage({type:`SEEK`,payload:{timeMs:e}},`*`)}),capture:async e=>new Promise(t=>{let r=e=>{e.data.type===`CAPTURE_RESULT`&&(window.removeEventListener(`message`,r),t(e.data.payload))};window.addEventListener(`message`,r),n.current?.contentWindow?.postMessage({type:`CAPTURE`,payload:{method:e}},`*`)}),isReady:()=>r})),(0,d.jsxs)(`div`,{className:`renderer-monitor`,"data-testid":`svg-renderer`,children:[(0,d.jsx)(`p`,{className:`monitor-label`,children:`Live Monitor`}),(0,d.jsx)(`div`,{className:`monitor-viewport`,children:(0,d.jsx)(`iframe`,{ref:n,title:`svg-renderer`,style:{width:f.width,height:f.height,maxWidth:`100%`,maxHeight:`100%`,aspectRatio:`${f.width} / ${f.height}`,border:`none`,pointerEvents:`none`,backgroundColor:`white`}})})]})}),f.displayName=`SvgRenderer`,f.__docgenInfo={description:``,methods:[{name:`loadSvg`,docblock:null,modifiers:[`async`],params:[{name:`svgContent`,optional:!1,type:{name:`string`}},{name:`width`,optional:!1,type:{name:`number`}},{name:`height`,optional:!1,type:{name:`number`}},{name:`backgroundColor`,optional:!1,type:{name:`string`}}],returns:null},{name:`seek`,docblock:null,modifiers:[`async`],params:[{name:`timeMs`,optional:!1,type:{name:`number`}}],returns:null},{name:`capture`,docblock:null,modifiers:[`async`],params:[{name:`method`,optional:!1,type:{name:`union`,raw:`'optimal' | 'high-fidelity'`,elements:[{name:`literal`,value:`'optimal'`},{name:`literal`,value:`'high-fidelity'`}]}}],returns:null},{name:`isReady`,docblock:null,modifiers:[],params:[],returns:null}],displayName:`SvgRenderer`}}));export{p as n,f as t};