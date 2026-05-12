import{a as e,n as t}from"./chunk-DnJy8xQt.js";import{a as n}from"./iframe--ciyqCWl.js";import{t as r}from"./jsx-runtime-DxP0NviS.js";function i(e){document.getAnimations().forEach(t=>{try{t.pause()}catch{}t.currentTime=e}),document.querySelectorAll(`svg`).forEach(t=>{try{typeof t.pauseAnimations==`function`&&t.pauseAnimations(),typeof t.setCurrentTime==`function`&&t.setCurrentTime(e/1e3)}catch{}})}var a=t((()=>{(function(){typeof module<`u`&&module.exports&&(module.exports={seekAnimations:i})})()}));function o(e,t){let n=`fill.fill-opacity.fill-rule.stroke.stroke-opacity.stroke-width.stroke-linecap.stroke-linejoin.stroke-miterlimit.stroke-dasharray.stroke-dashoffset.opacity.display.visibility.filter.mask.clip-path.clip-rule.stop-color.stop-opacity.font-family.font-size.font-weight.font-style.text-anchor.text-decoration.dominant-baseline.alignment-baseline.baseline-shift.transform.transform-origin.x.y.width.height.cx.cy.r.rx.ry.color.flood-color.flood-opacity.lighting-color.mix-blend-mode.isolation`.split(`.`),r=document.getElementById(`svg-container`),i=document.getElementById(`capture-canvas`),a=!1;window.addEventListener(`message`,async o=>{let{type:s,payload:c}=o.data;if(s===`LOAD_SVG`){a=!1;let{svgContent:n,width:o,height:s,timeMs:l}=c;r.innerHTML=n,r.style.width=o+`px`,r.style.height=s+`px`,r.style.backgroundColor=`transparent`,i.width=o,i.height=s,e(l),requestAnimationFrame(()=>{a=!0,window.parent.postMessage({type:`READY`},t)})}if(s===`SEEK`){if(!a)return;e(c.timeMs),await new Promise(e=>requestAnimationFrame(e)),window.parent.postMessage({type:`SEEKED`},t)}if(s===`CAPTURE`){if(!a)return;let e=r.querySelector(`svg`),o=i.getContext(`2d`);if(!e||!o)return;let s=e.cloneNode(!0),l=[e,...Array.from(e.querySelectorAll(`*`))],u=[s,...Array.from(s.querySelectorAll(`*`))];l.forEach((e,t)=>{let r=u[t];if(!r||!r.style)return;let i=e.tagName.toLowerCase();if([`animate`,`animatetransform`,`animatemotion`,`set`,`style`,`script`].includes(i))return;let a=window.getComputedStyle(e);if(c.method===`high-fidelity`)for(let e of a)r.style.setProperty(e,a.getPropertyValue(e),a.getPropertyPriority(e));else for(let e of n){let t=a.getPropertyValue(e);t&&r.style.setProperty(e,t)}}),s.querySelectorAll(`animate, animateTransform, animateMotion, set, style, script`).forEach(e=>e.remove());let d=new XMLSerializer().serializeToString(s),f=new Blob([d],{type:`image/svg+xml;charset=utf-8`}),p=URL.createObjectURL(f),m=new Image;try{await new Promise((e,t)=>{m.onload=e,m.onerror=t,m.src=p}),o.clearRect(0,0,i.width,i.height),o.drawImage(m,0,0,i.width,i.height);let e=await createImageBitmap(i);window.parent.postMessage({type:`CAPTURE_RESULT`,payload:e},t,[e])}catch(e){console.error(`[Renderer] Capture failed:`,e)}finally{URL.revokeObjectURL(p)}}}),window.parent.postMessage({type:`SCRIPT_LOADED`},t)}var s=t((()=>{})),c,l=t((()=>{c=`<!doctype html>
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
`})),u=t((()=>{})),d,f,p,m=t((()=>{d=e(n(),1),a(),s(),l(),u(),f=r(),p=(0,d.forwardRef)(({svgContent:e,width:t,height:n,backgroundColor:r,isTransparent:a,isRendering:s},l)=>{let u=(0,d.useRef)(null),[p,m]=(0,d.useState)(!1),[h,g]=(0,d.useState)(!1),[_,v]=(0,d.useState)({width:t||0,height:n||0});(0,d.useEffect)(()=>{let e=window.location.origin,t=`(${o.toString()})(window.seekAnimations, "${e}");`,n=c.replace(`// RENDERER_SCRIPT_PLACEHOLDER`,`
        window.seekAnimations = ${i.toString()};
        ${t}
      `),r=e=>{let t=window.location.origin;e.origin!==`null`&&e.origin!==t||e.source!==u.current?.contentWindow||e.data.type===`SCRIPT_LOADED`&&g(!0)};window.addEventListener(`message`,r);let a=new Blob([n],{type:`text/html`}),s=URL.createObjectURL(a);return u.current&&(u.current.src=s),()=>{URL.revokeObjectURL(s),window.removeEventListener(`message`,r)}},[]);let y=(0,d.useCallback)(async(e,t,n)=>{m(!1),v({width:t,height:n});let r=u.current;if(r)return h||await new Promise(e=>{let t=n=>{let i=window.location.origin;(n.origin===`null`||n.origin===i)&&n.source===r.contentWindow&&n.data.type===`SCRIPT_LOADED`&&(window.removeEventListener(`message`,t),e())};window.addEventListener(`message`,t)}),new Promise(i=>{let a=e=>{let t=window.location.origin;(e.origin===`null`||e.origin===t)&&e.source===r.contentWindow&&e.data.type===`READY`&&(window.removeEventListener(`message`,a),m(!0),i())};window.addEventListener(`message`,a),r.contentWindow?.postMessage({type:`LOAD_SVG`,payload:{svgContent:e,width:t,height:n,timeMs:0}},`*`)})},[h]);return(0,d.useEffect)(()=>{if(e&&t&&n&&(!s||_.width===0)){let r=setTimeout(()=>{y(e,t,n)},100);return()=>clearTimeout(r)}},[e,t,n,s,_.width,y]),(0,d.useImperativeHandle)(l,()=>({loadSvg:y,seek:async e=>new Promise(t=>{let n=u.current,r=e=>{let i=window.location.origin;(e.origin===`null`||e.origin===i)&&e.source===n?.contentWindow&&e.data.type===`SEEKED`&&(window.removeEventListener(`message`,r),t())};window.addEventListener(`message`,r),n?.contentWindow?.postMessage({type:`SEEK`,payload:{timeMs:e}},`*`)}),capture:async(e,t)=>new Promise(n=>{let r=u.current,i=e=>{let t=window.location.origin;(e.origin===`null`||e.origin===t)&&e.source===r?.contentWindow&&e.data.type===`CAPTURE_RESULT`&&(window.removeEventListener(`message`,i),n(e.data.payload))};window.addEventListener(`message`,i),r?.contentWindow?.postMessage({type:`CAPTURE`,payload:{method:e,transparent:t}},`*`)}),isReady:()=>p})),(0,f.jsxs)(`div`,{className:`renderer-monitor`,"data-testid":`svg-renderer`,children:[(0,f.jsx)(`p`,{className:`monitor-label`,children:`Live Monitor`}),(0,f.jsx)(`div`,{className:`monitor-viewport`,style:{backgroundColor:a?`transparent`:r,backgroundImage:a?`repeating-conic-gradient(#ccc 0% 25%, #fff 0% 50%)`:`none`,backgroundSize:a?`20px 20px`:`auto`},children:(0,f.jsx)(`iframe`,{ref:u,title:`svg-renderer`,sandbox:`allow-scripts allow-same-origin`,style:{width:_.width,height:_.height,maxWidth:`100%`,maxHeight:`100%`,aspectRatio:`${_.width} / ${_.height}`,border:`none`,pointerEvents:`none`,backgroundColor:`transparent`}})})]})}),p.displayName=`SvgRenderer`,p.__docgenInfo={description:``,methods:[{name:`seek`,docblock:null,modifiers:[`async`],params:[{name:`timeMs`,optional:!1,type:{name:`number`}}],returns:null},{name:`capture`,docblock:null,modifiers:[`async`],params:[{name:`method`,optional:!1,type:{name:`union`,raw:`'optimal' | 'high-fidelity'`,elements:[{name:`literal`,value:`'optimal'`},{name:`literal`,value:`'high-fidelity'`}]}},{name:`transparent`,optional:!1,type:{name:`boolean`}}],returns:null},{name:`isReady`,docblock:null,modifiers:[],params:[],returns:null}],displayName:`SvgRenderer`,props:{svgContent:{required:!1,tsType:{name:`union`,raw:`string | null`,elements:[{name:`string`},{name:`null`}]},description:``},width:{required:!1,tsType:{name:`number`},description:``},height:{required:!1,tsType:{name:`number`},description:``},backgroundColor:{required:!1,tsType:{name:`string`},description:``},isTransparent:{required:!1,tsType:{name:`boolean`},description:``},isRendering:{required:!1,tsType:{name:`boolean`},description:``}}}}));export{m as n,p as t};