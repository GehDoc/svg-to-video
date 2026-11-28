import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{t}from"./react-BGJ90fIb.js";import{t as n}from"./jsx-runtime-MKhVqBIO.js";import{n as r,t as i}from"./Button-1riBOttM.js";import{a,n as o,r as s,t as ee}from"./discoverFormats-DhrByMm2.js";import{C as c,T as l,m as u}from"./fa-Cuu5u3_B.js";import{n as d,t as te}from"./Dropzone-DEN9QWEl.js";import{n as f,t as p}from"./StickyHeader-Ddag_izN.js";var m;function h(){return(h=e((()=>{t(),a(),m=(e,t,n)=>{let r=e,i=t;if(n.preset===`720p`){let n=720/t;r=e*n,i=t*n}else if(n.preset===`1080p`){let n=1080/t;r=e*n,i=t*n}else n.preset===`original`&&(r*=n.scale,i*=n.scale);return r=Math.floor(r/2)*2,i=Math.floor(i/2)*2,{width:r,height:i}}})))()}var g;function _(){return(_=e((()=>{s(),g=e=>!!o(e)?.supportsAlpha})))()}var v,y;function b(){return(b=e((()=>{v=n(),y=({formats:e,value:t,onChange:n,disabled:r})=>{let i=e.some(e=>e.isSupported===!1);return(0,v.jsxs)(`div`,{className:`input-group`,children:[(0,v.jsx)(`label`,{htmlFor:`format`,children:`Output Format`}),(0,v.jsxs)(`select`,{id:`format`,value:t,onChange:e=>n(e.target.value),disabled:r||e.length===0,children:[(0,v.jsx)(`optgroup`,{label:`Supports Alpha`,children:e.filter(e=>e.supportsAlpha).map(e=>(0,v.jsx)(`option`,{value:e.id,disabled:e.isSupported===!1,children:e.label},e.id))}),(0,v.jsx)(`optgroup`,{label:`Standard`,children:e.filter(e=>!e.supportsAlpha).map(e=>(0,v.jsx)(`option`,{value:e.id,disabled:e.isSupported===!1,children:e.label},e.id))})]}),i&&(0,v.jsx)(`p`,{className:`hint-text hint-text--info`,children:`Some formats are disabled because they are not supported by your browser.`})]})},y.__docgenInfo={description:``,methods:[],displayName:`FormatSelector`,props:{formats:{required:!0,tsType:{name:`Array`,elements:[{name:`VideoFormat`}],raw:`VideoFormat[]`},description:``},value:{required:!0,tsType:{name:`string`},description:``},onChange:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(formatId: string) => void`,signature:{arguments:[{type:{name:`string`},name:`formatId`}],return:{name:`void`}}},description:``},disabled:{required:!1,tsType:{name:`boolean`},description:``}}}})))()}var x,S,C;function w(){return(w=e((()=>{x=t(),h(),_(),s(),d(),r(),b(),l(),f(),S=n(),C=({svgContent:e,onSvgContentChange:t,fileName:n,onFileNameChange:r,duration:a,onDurationChange:s,hold:l,onHoldChange:d,fps:f,onFpsChange:h,preset:_,onPresetChange:v,scale:b,onScaleChange:C,backgroundColor:w,onBackgroundColorChange:T,format:E,onFormatChange:D,isTransparent:O,onIsTransparentChange:k,captureMethod:A,onCaptureMethodChange:j,isDragging:M,onIsDraggingChange:N,state:P,onStartRender:F,validationError:I,originalDim:L,targetDim:R,renderedUrl:z,metadata:B,onMetadataChange:V,loop:H=!0,onLoopChange:U,detectedDuration:W,onOpenSamples:G,onClearSvg:K})=>{let[q,ne]=(0,x.useState)([]),J=P.isRendering||!!z,Y=J||!e,X=(0,x.useMemo)(()=>o(E),[E]),Z=(0,x.useMemo)(()=>R||(L.width&&L.height?m(L.width,L.height,{preset:_,scale:b}):null),[R,L.width,L.height,_,b]),Q=(e,n)=>{let r=new FileReader;r.onload=r=>{let i=r.target?.result;t(i,`${e.name.replace(/\.svg$/i,``)}.mp4`,n)},r.readAsText(e)},re=e=>{e.target.files?.[0]&&Q(e.target.files[0],`file-picker`)},ie=e=>{e.preventDefault(),e.stopPropagation(),N(!1),e.dataTransfer.files?.[0]&&e.dataTransfer.files[0].type===`image/svg+xml`&&Q(e.dataTransfer.files[0],`drag-and-drop`)},$=(0,x.useCallback)(e=>{let t=o(e);D(e),t&&(r(n.replace(/\.[^/.]+$/,t.extension)),t.supportsAlpha||k(!1))},[n,r,D,k]);return(0,x.useEffect)(()=>{let e=!1;return ee(Z||void 0).then(t=>{if(e)return;ne(t);let n=t.find(e=>e.id===E);if(n&&n.isSupported===!1){let e=t.find(e=>e.isSupported!==!1);e&&$(e.id)}}),()=>{e=!0}},[Z,E,$]),(0,S.jsxs)(`aside`,{className:`config-panel`,children:[(0,S.jsxs)(`div`,{className:`config-content`,tabIndex:0,"aria-label":`Configuration sections`,children:[(0,S.jsxs)(`section`,{className:`config-section ${J?`is-locked`:``}`,"aria-disabled":J,children:[(0,S.jsx)(p,{as:`h2`,"aria-disabled":J,children:`1. Source`}),(0,S.jsx)(te,{svgContent:e,isDragging:M,setIsDragging:N,onFileChange:re,onDrop:ie,disabled:J}),(0,S.jsxs)(`div`,{className:`source-actions`,children:[G&&(0,S.jsxs)(i,{variant:`secondary`,className:`source-action-btn`,onClick:G,disabled:J,type:`button`,"aria-label":`Browse sample SVG animations`,children:[(0,S.jsx)(u,{size:12,className:`btn-icon`}),` Browse Samples`]}),K&&(0,S.jsxs)(i,{variant:`secondary`,className:`source-action-btn source-action-btn--clear`,onClick:K,disabled:!e||J,type:`button`,"aria-label":`Clear active SVG and return to home screen`,children:[(0,S.jsx)(c,{size:12,className:`btn-icon`}),` Clear SVG`]})]})]}),(0,S.jsxs)(`section`,{className:`config-section ${Y?`is-locked`:``}`,"aria-disabled":Y,children:[(0,S.jsx)(p,{as:`h2`,"aria-disabled":Y,children:`2. Format`}),(0,S.jsx)(y,{formats:q,value:E,onChange:$,disabled:Y}),(0,S.jsx)(`div`,{className:`input-group`,children:(0,S.jsxs)(`div`,{className:`checkbox-wrapper`,children:[(0,S.jsx)(`input`,{type:`checkbox`,id:`loop-animation`,checked:H,onChange:e=>U?.(e.target.checked),disabled:Y||!X?.supportsLoop,title:X?.supportsLoop?void 0:`Looping is only supported for animated image formats (GIF, aPNG).`}),(0,S.jsx)(`label`,{htmlFor:`loop-animation`,title:X?.supportsLoop?void 0:`Looping is only supported for animated image formats (GIF, aPNG).`,children:`Loop Animation`})]})}),(0,S.jsxs)(`div`,{className:`input-group`,children:[(0,S.jsx)(`label`,{htmlFor:`resolution`,children:`Resolution`}),(0,S.jsxs)(`select`,{id:`resolution`,value:L.isDimensionsDetected?_:`1080p`,onChange:e=>v(e.target.value),disabled:Y||!L.isDimensionsDetected,children:[(0,S.jsx)(`option`,{value:`original`,children:`Original Size`}),(0,S.jsx)(`option`,{value:`720p`,children:`720p (Fit)`}),(0,S.jsx)(`option`,{value:`1080p`,children:`1080p (Fit)`})]}),e&&L.isDimensionsDetected&&Z&&(0,S.jsxs)(`p`,{className:`hint-text hint-text--info`,"aria-disabled":Y,children:[`Target resolution: `,Z.width,` x`,` `,Z.height,` px`]}),e&&!L.isDimensionsDetected&&(0,S.jsx)(`p`,{className:`hint-text`,"aria-disabled":Y||!L.isDimensionsDetected,children:`Warning: Could not detect SVG dimensions. Defaulting to 1080p.`})]}),_===`original`&&(0,S.jsxs)(`div`,{className:`input-group`,children:[(0,S.jsxs)(`label`,{htmlFor:`scale`,children:[`Scale (`,b,`x)`]}),(0,S.jsx)(`input`,{type:`range`,id:`scale`,min:`1`,max:`4`,step:`0.5`,value:b,onChange:e=>C(parseFloat(e.target.value)),disabled:Y})]}),(0,S.jsxs)(`div`,{className:`grid-3`,children:[(0,S.jsxs)(`div`,{className:`input-group`,children:[(0,S.jsxs)(`div`,{className:`duration-label-wrapper`,children:[(0,S.jsx)(`label`,{htmlFor:`duration`,children:`Dur. (s)`}),W!==void 0&&W>0&&W!==a&&(0,S.jsx)(`button`,{type:`button`,className:`reset-duration-btn`,onClick:()=>s(W),disabled:Y,title:`Reset to detected duration (${W}s)`,children:`↺ Reset`})]}),(0,S.jsx)(`input`,{type:`number`,id:`duration`,className:a>300?`input-warning`:``,value:isNaN(a)?``:a,onChange:e=>{let t=parseFloat(e.target.value);s(isNaN(t)?0:t)},min:.1,step:.1,disabled:Y}),a>300&&(0,S.jsx)(`span`,{className:`duration-warning-text`,role:`status`,title:`Duration exceeds 5 minutes (300s). Rendering may take significant time.`,children:`⚠️ Long duration`})]}),(0,S.jsxs)(`div`,{className:`input-group`,children:[(0,S.jsx)(`label`,{htmlFor:`hold`,children:`Hold (s)`}),(0,S.jsx)(`input`,{type:`number`,id:`hold`,value:isNaN(l)?``:l,onChange:e=>{let t=parseFloat(e.target.value);d(isNaN(t)?0:t)},min:0,step:.5,disabled:Y})]}),(0,S.jsxs)(`div`,{className:`input-group`,children:[(0,S.jsx)(`label`,{htmlFor:`fps`,children:`FPS`}),(0,S.jsx)(`input`,{type:`number`,id:`fps`,value:isNaN(f)?``:f,onChange:e=>{let t=parseInt(e.target.value,10);h(isNaN(t)?0:t)},min:1,max:60,disabled:Y})]})]})]}),(0,S.jsxs)(`section`,{className:`config-section ${Y?`is-locked`:``}`,"aria-disabled":Y,children:[(0,S.jsx)(p,{as:`h2`,"aria-disabled":Y,children:`3. Canvas`}),(0,S.jsxs)(`div`,{className:`input-group`,children:[(0,S.jsxs)(`div`,{className:`checkbox-wrapper`,children:[(0,S.jsx)(`input`,{type:`checkbox`,id:`transparent`,checked:O,onChange:e=>k(e.target.checked),disabled:Y||!g(E)}),(0,S.jsx)(`label`,{htmlFor:`transparent`,children:`Transparent Background`})]}),!g(E)&&(0,S.jsx)(`p`,{className:`hint-text hint-text--info`,"aria-disabled":Y,children:`Transparency only supported for formats with alpha channel support.`})]}),(0,S.jsxs)(`div`,{className:`input-group`,children:[(0,S.jsx)(`label`,{htmlFor:`bg-color`,children:`Background`}),(0,S.jsxs)(`div`,{className:`color-picker-wrapper`,children:[(0,S.jsx)(`input`,{type:`color`,id:`bg-color`,value:w,onChange:e=>T(e.target.value),disabled:Y||O&&!X?.needsColorKeying}),(0,S.jsx)(`input`,{type:`text`,value:w,onChange:e=>T(e.target.value),disabled:Y||O&&!X?.needsColorKeying,className:`color-text-input`,"aria-label":`Background color hex code`})]})]}),(0,S.jsxs)(`div`,{className:`input-group`,children:[(0,S.jsx)(`label`,{htmlFor:`capture-method`,children:`Capture Method`}),(0,S.jsxs)(`select`,{id:`capture-method`,value:A,onChange:e=>j(e.target.value),disabled:Y,children:[(0,S.jsx)(`option`,{value:`optimal`,title:`Bakes key animation properties into frames for faster rendering.`,children:`Optimal (Fast)`}),(0,S.jsx)(`option`,{value:`high-fidelity`,title:`Bakes all computed SVG and CSS properties into frames for maximum accuracy.`,children:`High Fidelity (Slow)`})]}),(0,S.jsx)(`p`,{className:`hint-text hint-text--info`,"aria-disabled":Y,children:A===`optimal`?`Optimal (Fast): Bakes key animation properties into frames. Faster export for standard SVGs.`:`High Fidelity (Slow): Bakes all computed SVG and CSS properties into frames for maximum visual accuracy.`})]})]}),(0,S.jsxs)(`section`,{className:`config-section ${Y?`is-locked`:``}`,"aria-disabled":Y,children:[(0,S.jsx)(p,{as:`h2`,"aria-disabled":Y,children:`4. Metadata`}),(0,S.jsxs)(`div`,{className:`input-group`,children:[(0,S.jsx)(`label`,{htmlFor:`meta-title`,children:`Title`}),(0,S.jsx)(`input`,{type:`text`,id:`meta-title`,value:B.title||``,onChange:e=>V({...B,title:e.target.value}),disabled:Y||!X?.supportsMetadata,placeholder:`Video title`})]}),(0,S.jsxs)(`div`,{className:`input-group`,children:[(0,S.jsx)(`label`,{htmlFor:`meta-comment`,children:`Comment`}),(0,S.jsx)(`textarea`,{id:`meta-comment`,value:B.comment||``,onChange:e=>V({...B,comment:e.target.value}),disabled:Y||!X?.supportsMetadata,placeholder:`Additional notes`,rows:2,className:`textarea-input`})]})]})]}),(0,S.jsxs)(`div`,{className:`render-actions`,children:[I&&(0,S.jsx)(`p`,{className:`validation-error`,role:`alert`,children:I}),(0,S.jsx)(i,{variant:`primary`,onClick:F,disabled:!e||J||!!I,children:P.isRendering?`Processing...`:`Export ${E.toUpperCase()}`})]})]})},C.__docgenInfo={description:``,methods:[],displayName:`ConfigPanel`,props:{svgContent:{required:!0,tsType:{name:`union`,raw:`string | null`,elements:[{name:`string`},{name:`null`}]},description:``},onSvgContentChange:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(
  content: string,
  fileName: string,
  method: 'file-picker' | 'drag-and-drop'
) => void`,signature:{arguments:[{type:{name:`string`},name:`content`},{type:{name:`string`},name:`fileName`},{type:{name:`union`,raw:`'file-picker' | 'drag-and-drop'`,elements:[{name:`literal`,value:`'file-picker'`},{name:`literal`,value:`'drag-and-drop'`}]},name:`method`}],return:{name:`void`}}},description:``},fileName:{required:!0,tsType:{name:`string`},description:``},onFileNameChange:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(name: string) => void`,signature:{arguments:[{type:{name:`string`},name:`name`}],return:{name:`void`}}},description:``},duration:{required:!0,tsType:{name:`number`},description:``},onDurationChange:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(d: number) => void`,signature:{arguments:[{type:{name:`number`},name:`d`}],return:{name:`void`}}},description:``},hold:{required:!0,tsType:{name:`number`},description:``},onHoldChange:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(h: number) => void`,signature:{arguments:[{type:{name:`number`},name:`h`}],return:{name:`void`}}},description:``},fps:{required:!0,tsType:{name:`number`},description:``},onFpsChange:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(f: number) => void`,signature:{arguments:[{type:{name:`number`},name:`f`}],return:{name:`void`}}},description:``},preset:{required:!0,tsType:{name:`union`,raw:`'original' | '720p' | '1080p'`,elements:[{name:`literal`,value:`'original'`},{name:`literal`,value:`'720p'`},{name:`literal`,value:`'1080p'`}]},description:``},onPresetChange:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(p: ResolutionPreset) => void`,signature:{arguments:[{type:{name:`union`,raw:`'original' | '720p' | '1080p'`,elements:[{name:`literal`,value:`'original'`},{name:`literal`,value:`'720p'`},{name:`literal`,value:`'1080p'`}]},name:`p`}],return:{name:`void`}}},description:``},scale:{required:!0,tsType:{name:`number`},description:``},onScaleChange:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(s: number) => void`,signature:{arguments:[{type:{name:`number`},name:`s`}],return:{name:`void`}}},description:``},backgroundColor:{required:!0,tsType:{name:`string`},description:``},onBackgroundColorChange:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(c: string) => void`,signature:{arguments:[{type:{name:`string`},name:`c`}],return:{name:`void`}}},description:``},format:{required:!0,tsType:{name:`string`},description:``},onFormatChange:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(f: string) => void`,signature:{arguments:[{type:{name:`string`},name:`f`}],return:{name:`void`}}},description:``},isTransparent:{required:!0,tsType:{name:`boolean`},description:``},onIsTransparentChange:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(t: boolean) => void`,signature:{arguments:[{type:{name:`boolean`},name:`t`}],return:{name:`void`}}},description:``},captureMethod:{required:!0,tsType:{name:`union`,raw:`'optimal' | 'high-fidelity'`,elements:[{name:`literal`,value:`'optimal'`},{name:`literal`,value:`'high-fidelity'`}]},description:``},onCaptureMethodChange:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(m: 'optimal' | 'high-fidelity') => void`,signature:{arguments:[{type:{name:`union`,raw:`'optimal' | 'high-fidelity'`,elements:[{name:`literal`,value:`'optimal'`},{name:`literal`,value:`'high-fidelity'`}]},name:`m`}],return:{name:`void`}}},description:``},isDragging:{required:!0,tsType:{name:`boolean`},description:``},onIsDraggingChange:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(d: boolean) => void`,signature:{arguments:[{type:{name:`boolean`},name:`d`}],return:{name:`void`}}},description:``},state:{required:!0,tsType:{name:`RenderState`},description:``},onStartRender:{required:!0,tsType:{name:`signature`,type:`function`,raw:`() => void`,signature:{arguments:[],return:{name:`void`}}},description:``},validationError:{required:!0,tsType:{name:`union`,raw:`string | null`,elements:[{name:`string`},{name:`null`}]},description:``},originalDim:{required:!0,tsType:{name:`signature`,type:`object`,raw:`{
  width?: number;
  height?: number;
  isDimensionsDetected: boolean;
}`,signature:{properties:[{key:`width`,value:{name:`number`,required:!1}},{key:`height`,value:{name:`number`,required:!1}},{key:`isDimensionsDetected`,value:{name:`boolean`,required:!0}}]}},description:``},targetDim:{required:!1,tsType:{name:`signature`,type:`object`,raw:`{ width: number; height: number }`,signature:{properties:[{key:`width`,value:{name:`number`,required:!0}},{key:`height`,value:{name:`number`,required:!0}}]}},description:``},renderedUrl:{required:!0,tsType:{name:`union`,raw:`string | null`,elements:[{name:`string`},{name:`null`}]},description:``},metadata:{required:!0,tsType:{name:`VideoMetadata`},description:``},onMetadataChange:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(m: VideoMetadata) => void`,signature:{arguments:[{type:{name:`VideoMetadata`},name:`m`}],return:{name:`void`}}},description:``},loop:{required:!1,tsType:{name:`boolean`},description:``,defaultValue:{value:`true`,computed:!1}},onLoopChange:{required:!1,tsType:{name:`signature`,type:`function`,raw:`(loop: boolean) => void`,signature:{arguments:[{type:{name:`boolean`},name:`loop`}],return:{name:`void`}}},description:``},detectedDuration:{required:!1,tsType:{name:`number`},description:``},onOpenSamples:{required:!1,tsType:{name:`signature`,type:`function`,raw:`() => void`,signature:{arguments:[],return:{name:`void`}}},description:``},onClearSvg:{required:!1,tsType:{name:`signature`,type:`function`,raw:`() => void`,signature:{arguments:[],return:{name:`void`}}},description:``}}}})))()}var T,E,D,O,k,A,j,M,N,P,F,I,L;function R(){return(R=e((()=>{w(),T=n(),E={title:`Components/ConfigPanel`,component:C,args:{svgContent:null,onSvgContentChange:(e,t)=>console.log(`SVG content change`,t),fileName:`animation.mp4`,onFileNameChange:e=>console.log(`File name change`,e),duration:5,onDurationChange:e=>console.log(`Duration change`,e),hold:0,onHoldChange:e=>console.log(`Hold change`,e),fps:60,onFpsChange:e=>console.log(`FPS change`,e),preset:`original`,onPresetChange:e=>console.log(`Preset change`,e),scale:1,onScaleChange:e=>console.log(`Scale change`,e),backgroundColor:`#ffffff`,onBackgroundColorChange:e=>console.log(`Background color change`,e),format:`mp4`,onFormatChange:e=>console.log(`Format change`,e),isTransparent:!1,onIsTransparentChange:e=>console.log(`Is transparent change`,e),captureMethod:`optimal`,onCaptureMethodChange:e=>console.log(`Capture method change`,e),isDragging:!1,onIsDraggingChange:e=>console.log(`Is dragging change`,e),state:{isRendering:!1,status:`Idle`,progress:0},onStartRender:()=>console.log(`Start render`),originalDim:{isDimensionsDetected:!1},renderedUrl:null,metadata:{title:``,comment:``},onMetadataChange:e=>console.log(`Metadata change`,e),loop:!0,onLoopChange:e=>console.log(`Loop change`,e),detectedDuration:5},decorators:[e=>(0,T.jsx)(`div`,{className:`story-wrapper`,children:(0,T.jsx)(e,{})})]},D={},O={args:{svgContent:`<svg></svg>`,originalDim:{width:1920,height:1080,isDimensionsDetected:!0},targetDim:{width:1920,height:1080}}},k={args:{svgContent:`<svg></svg>`,format:`webm`,isTransparent:!0,originalDim:{width:1920,height:1080,isDimensionsDetected:!0},targetDim:{width:1920,height:1080}}},A={args:{svgContent:`<svg></svg>`,format:`mp4`,isTransparent:!1,originalDim:{width:1920,height:1080,isDimensionsDetected:!0},targetDim:{width:1920,height:1080}}},j={args:{state:{isRendering:!0,status:`Processing...`,progress:45},svgContent:`<svg></svg>`,originalDim:{width:1920,height:1080,isDimensionsDetected:!0},targetDim:{width:1920,height:1080}}},M={args:{svgContent:`<svg></svg>`,originalDim:{isDimensionsDetected:!1}}},N={args:{svgContent:`<svg></svg>`,format:`gif`,loop:!0,originalDim:{width:1920,height:1080,isDimensionsDetected:!0},targetDim:{width:1920,height:1080}}},P={args:{svgContent:`<svg></svg>`,format:`mp4`,loop:!0,originalDim:{width:1920,height:1080,isDimensionsDetected:!0},targetDim:{width:1920,height:1080}}},F={args:{svgContent:`<svg></svg>`,duration:350,detectedDuration:350,originalDim:{width:1920,height:1080,isDimensionsDetected:!0},targetDim:{width:1920,height:1080}}},I={args:{svgContent:`<svg></svg>`,duration:10,detectedDuration:3.5,originalDim:{width:1920,height:1080,isDimensionsDetected:!0},targetDim:{width:1920,height:1080}}},L=[`Default`,`WithSvg`,`TransparentEnabled`,`TransparentDisabled`,`Rendering`,`WithError`,`LoopSupportedAnimated`,`LoopDisabledVideo`,`WithDurationWarning`,`WithCustomDuration`],D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{}`,...D.parameters?.docs?.source}}},O.parameters={...O.parameters,docs:{...O.parameters?.docs,source:{originalSource:`{
  args: {
    svgContent: '<svg></svg>',
    originalDim: {
      width: 1920,
      height: 1080,
      isDimensionsDetected: true
    },
    targetDim: {
      width: 1920,
      height: 1080
    }
  }
}`,...O.parameters?.docs?.source}}},k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:`{
  args: {
    svgContent: '<svg></svg>',
    format: 'webm',
    isTransparent: true,
    originalDim: {
      width: 1920,
      height: 1080,
      isDimensionsDetected: true
    },
    targetDim: {
      width: 1920,
      height: 1080
    }
  }
}`,...k.parameters?.docs?.source}}},A.parameters={...A.parameters,docs:{...A.parameters?.docs,source:{originalSource:`{
  args: {
    svgContent: '<svg></svg>',
    format: 'mp4',
    isTransparent: false,
    originalDim: {
      width: 1920,
      height: 1080,
      isDimensionsDetected: true
    },
    targetDim: {
      width: 1920,
      height: 1080
    }
  }
}`,...A.parameters?.docs?.source}}},j.parameters={...j.parameters,docs:{...j.parameters?.docs,source:{originalSource:`{
  args: {
    state: {
      isRendering: true,
      status: 'Processing...',
      progress: 45
    },
    svgContent: '<svg></svg>',
    originalDim: {
      width: 1920,
      height: 1080,
      isDimensionsDetected: true
    },
    targetDim: {
      width: 1920,
      height: 1080
    }
  }
}`,...j.parameters?.docs?.source}}},M.parameters={...M.parameters,docs:{...M.parameters?.docs,source:{originalSource:`{
  args: {
    svgContent: '<svg></svg>',
    originalDim: {
      isDimensionsDetected: false
    }
  }
}`,...M.parameters?.docs?.source}}},N.parameters={...N.parameters,docs:{...N.parameters?.docs,source:{originalSource:`{
  args: {
    svgContent: '<svg></svg>',
    format: 'gif',
    loop: true,
    originalDim: {
      width: 1920,
      height: 1080,
      isDimensionsDetected: true
    },
    targetDim: {
      width: 1920,
      height: 1080
    }
  }
}`,...N.parameters?.docs?.source}}},P.parameters={...P.parameters,docs:{...P.parameters?.docs,source:{originalSource:`{
  args: {
    svgContent: '<svg></svg>',
    format: 'mp4',
    loop: true,
    originalDim: {
      width: 1920,
      height: 1080,
      isDimensionsDetected: true
    },
    targetDim: {
      width: 1920,
      height: 1080
    }
  }
}`,...P.parameters?.docs?.source}}},F.parameters={...F.parameters,docs:{...F.parameters?.docs,source:{originalSource:`{
  args: {
    svgContent: '<svg></svg>',
    duration: 350,
    detectedDuration: 350,
    originalDim: {
      width: 1920,
      height: 1080,
      isDimensionsDetected: true
    },
    targetDim: {
      width: 1920,
      height: 1080
    }
  }
}`,...F.parameters?.docs?.source}}},I.parameters={...I.parameters,docs:{...I.parameters?.docs,source:{originalSource:`{
  args: {
    svgContent: '<svg></svg>',
    duration: 10,
    detectedDuration: 3.5,
    originalDim: {
      width: 1920,
      height: 1080,
      isDimensionsDetected: true
    },
    targetDim: {
      width: 1920,
      height: 1080
    }
  }
}`,...I.parameters?.docs?.source}}}})))()}R();export{D as Default,P as LoopDisabledVideo,N as LoopSupportedAnimated,j as Rendering,A as TransparentDisabled,k as TransparentEnabled,I as WithCustomDuration,F as WithDurationWarning,M as WithError,O as WithSvg,L as __namedExportsOrder,E as default};