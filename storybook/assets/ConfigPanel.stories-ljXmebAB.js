import{a as e,n as t}from"./chunk-DnJy8xQt.js";import{a as n}from"./iframe--ciyqCWl.js";import{t as r}from"./jsx-runtime-DxP0NviS.js";import{n as i,t as a}from"./Button-BcjyneSm.js";import{i as o,n as s,r as c,t as l}from"./MockStudioProvider-s0KYyK_Q.js";import{n as u,t as d}from"./Dropzone-DKrk2yW9.js";var f=t((()=>{})),p,m=t((()=>{p=e=>e===`webm`})),h=t((()=>{})),g,_,v,y=t((()=>{o(),g=e(n(),1),m(),u(),i(),h(),_=r(),v=()=>{let{svgContent:e,setSvgContent:t,fileName:n,setFileName:r,duration:i,setDuration:o,hold:s,setHold:l,fps:u,setFps:f,preset:m,setPreset:h,scale:v,setScale:y,backgroundColor:b,setBackgroundColor:x,format:S,setFormat:C,isTransparent:w,setIsTransparent:T,captureMethod:E,setCaptureMethod:D,isDragging:O,setIsDragging:k,state:A,handleStartRender:j,originalDim:M,renderedUrl:N}=(0,g.useContext)(c),P=A.isRendering||!!N,F=P||!e,I=e=>{let n=new FileReader;n.onload=n=>{let i=n.target?.result;t(i),r(`${e.name.replace(/\.svg$/i,``)}.mp4`)},n.readAsText(e)};return(0,_.jsxs)(`aside`,{className:`config-panel`,tabIndex:0,children:[(0,_.jsxs)(`section`,{className:`config-section ${P?`is-locked`:``}`,"aria-disabled":P,children:[(0,_.jsx)(`h2`,{"aria-disabled":P,children:`1. Source`}),(0,_.jsx)(d,{svgContent:e,isDragging:O,setIsDragging:k,onFileChange:e=>{e.target.files?.[0]&&I(e.target.files[0])},onDrop:e=>{e.preventDefault(),e.stopPropagation(),k(!1),e.dataTransfer.files?.[0]&&e.dataTransfer.files[0].type===`image/svg+xml`&&I(e.dataTransfer.files[0])},disabled:P})]}),(0,_.jsxs)(`section`,{className:`config-section ${F?`is-locked`:``}`,"aria-disabled":F,children:[(0,_.jsx)(`h2`,{"aria-disabled":F,children:`2. Format`}),(0,_.jsxs)(`div`,{className:`input-group`,children:[(0,_.jsx)(`label`,{htmlFor:`format`,children:`Output Format`}),(0,_.jsxs)(`select`,{id:`format`,value:S,onChange:e=>{C(e.target.value),r(n.replace(/\.[^/.]+$/,`.${e.target.value}`))},disabled:F,children:[(0,_.jsx)(`option`,{value:`mp4`,children:`MP4`}),(0,_.jsx)(`option`,{value:`webm`,children:`WebM`})]})]}),(0,_.jsxs)(`div`,{className:`input-group`,children:[(0,_.jsx)(`label`,{htmlFor:`resolution`,children:`Resolution`}),(0,_.jsxs)(`select`,{id:`resolution`,value:M.isDimensionsDetected?m:`1080p`,onChange:e=>h(e.target.value),disabled:F||!M.isDimensionsDetected,children:[(0,_.jsx)(`option`,{value:`original`,children:`Original Size`}),(0,_.jsx)(`option`,{value:`720p`,children:`720p (Fit)`}),(0,_.jsx)(`option`,{value:`1080p`,children:`1080p (Fit)`})]}),e&&!M.isDimensionsDetected&&(0,_.jsx)(`p`,{className:`hint-text`,"aria-disabled":F||!M.isDimensionsDetected,children:`Warning: Could not detect SVG dimensions. Defaulting to 1080p.`})]}),m===`original`&&(0,_.jsxs)(`div`,{className:`input-group`,children:[(0,_.jsxs)(`label`,{htmlFor:`scale`,children:[`Scale (`,v,`x)`]}),(0,_.jsx)(`input`,{type:`range`,id:`scale`,min:`1`,max:`4`,step:`0.5`,value:v,onChange:e=>y(parseFloat(e.target.value)),disabled:F})]}),(0,_.jsxs)(`div`,{className:`grid-3`,children:[(0,_.jsxs)(`div`,{className:`input-group`,children:[(0,_.jsx)(`label`,{htmlFor:`duration`,children:`Dur. (s)`}),(0,_.jsx)(`input`,{type:`number`,id:`duration`,value:i,onChange:e=>o(parseFloat(e.target.value)),min:1,disabled:F})]}),(0,_.jsxs)(`div`,{className:`input-group`,children:[(0,_.jsx)(`label`,{htmlFor:`hold`,children:`Hold (s)`}),(0,_.jsx)(`input`,{type:`number`,id:`hold`,value:s,onChange:e=>l(parseFloat(e.target.value)),min:0,step:.5,disabled:F})]}),(0,_.jsxs)(`div`,{className:`input-group`,children:[(0,_.jsx)(`label`,{htmlFor:`fps`,children:`FPS`}),(0,_.jsx)(`input`,{type:`number`,id:`fps`,value:u,onChange:e=>f(parseInt(e.target.value)),min:1,max:60,disabled:F})]})]})]}),(0,_.jsxs)(`section`,{className:`config-section ${F?`is-locked`:``}`,"aria-disabled":F,children:[(0,_.jsx)(`h2`,{"aria-disabled":F,children:`3. Canvas`}),(0,_.jsxs)(`div`,{className:`input-group`,children:[(0,_.jsxs)(`label`,{htmlFor:`transparent`,children:[(0,_.jsx)(`input`,{type:`checkbox`,id:`transparent`,checked:w,onChange:e=>T(e.target.checked),disabled:F||!p(S)}),`Transparent Background`]}),!p(S)&&(0,_.jsx)(`p`,{className:`hint-text hint-text--info`,"aria-disabled":F,children:`Transparency only supported for WebM`})]}),(0,_.jsxs)(`div`,{className:`input-group`,children:[(0,_.jsx)(`label`,{htmlFor:`bg-color`,children:`Background`}),(0,_.jsxs)(`div`,{className:`color-picker-wrapper`,children:[(0,_.jsx)(`input`,{type:`color`,id:`bg-color`,value:b,onChange:e=>x(e.target.value),disabled:F||w}),(0,_.jsx)(`input`,{type:`text`,value:b,onChange:e=>x(e.target.value),disabled:F||w,className:`color-text-input`,"aria-label":`Background color hex code`})]})]}),(0,_.jsxs)(`div`,{className:`input-group`,children:[(0,_.jsx)(`label`,{htmlFor:`capture-method`,children:`Capture Method`}),(0,_.jsxs)(`select`,{id:`capture-method`,value:E,onChange:e=>D(e.target.value),disabled:F,children:[(0,_.jsx)(`option`,{value:`optimal`,children:`Optimal (Fast)`}),(0,_.jsx)(`option`,{value:`high-fidelity`,children:`High Fidelity (Slow)`})]})]})]}),(0,_.jsx)(`div`,{className:`render-actions`,children:(0,_.jsx)(a,{variant:`primary`,onClick:j,disabled:!e||P,children:A.isRendering?`Processing...`:`Export ${S.toUpperCase()}`})})]})},v.__docgenInfo={description:``,methods:[],displayName:`ConfigPanel`}})),b,x,S,C,w,T,E,D,O;t((()=>{f(),y(),s(),b=r(),x={title:`Components/ConfigPanel`,component:v,decorators:[e=>(0,b.jsx)(l,{children:(0,b.jsx)(`div`,{className:`story-wrapper`,children:(0,b.jsx)(e,{})})})]},S={},C={decorators:[e=>(0,b.jsx)(l,{mockValues:{svgContent:`<svg></svg>`,originalDim:{width:500,height:500,isDimensionsDetected:!0}},children:(0,b.jsx)(`div`,{className:`story-wrapper`,children:(0,b.jsx)(e,{})})})]},w={decorators:[e=>(0,b.jsx)(l,{mockValues:{svgContent:`<svg></svg>`,format:`webm`,isTransparent:!0,originalDim:{width:500,height:500,isDimensionsDetected:!0}},children:(0,b.jsx)(`div`,{className:`story-wrapper`,children:(0,b.jsx)(e,{})})})]},T={decorators:[e=>(0,b.jsx)(l,{mockValues:{svgContent:`<svg></svg>`,format:`mp4`,isTransparent:!1,originalDim:{width:500,height:500,isDimensionsDetected:!0}},children:(0,b.jsx)(`div`,{className:`story-wrapper`,children:(0,b.jsx)(e,{})})})]},E={decorators:[e=>(0,b.jsx)(l,{mockValues:{state:{isRendering:!0,status:`Processing...`,progress:45},svgContent:`<svg></svg>`,originalDim:{width:500,height:500,isDimensionsDetected:!0},targetDim:{width:1920,height:1080}},children:(0,b.jsx)(`div`,{className:`story-wrapper`,children:(0,b.jsx)(e,{})})})]},D={decorators:[e=>(0,b.jsx)(l,{mockValues:{svgContent:`<svg></svg>`,originalDim:{width:0,height:0,isDimensionsDetected:!1}},children:(0,b.jsx)(`div`,{className:`story-wrapper`,children:(0,b.jsx)(e,{})})})]},S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{}`,...S.parameters?.docs?.source}}},C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  decorators: [Story => <MockStudioProvider mockValues={{
    svgContent: '<svg></svg>',
    originalDim: {
      width: 500,
      height: 500,
      isDimensionsDetected: true
    }
  }}>
        <div className="story-wrapper">
          <Story />
        </div>
      </MockStudioProvider>]
}`,...C.parameters?.docs?.source}}},w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
  decorators: [Story => <MockStudioProvider mockValues={{
    svgContent: '<svg></svg>',
    format: 'webm',
    isTransparent: true,
    originalDim: {
      width: 500,
      height: 500,
      isDimensionsDetected: true
    }
  }}>
        <div className="story-wrapper">
          <Story />
        </div>
      </MockStudioProvider>]
}`,...w.parameters?.docs?.source}}},T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
  decorators: [Story => <MockStudioProvider mockValues={{
    svgContent: '<svg></svg>',
    format: 'mp4',
    isTransparent: false,
    originalDim: {
      width: 500,
      height: 500,
      isDimensionsDetected: true
    }
  }}>
        <div className="story-wrapper">
          <Story />
        </div>
      </MockStudioProvider>]
}`,...T.parameters?.docs?.source}}},E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
  decorators: [Story => <MockStudioProvider mockValues={{
    state: {
      isRendering: true,
      status: 'Processing...',
      progress: 45
    },
    svgContent: '<svg></svg>',
    originalDim: {
      width: 500,
      height: 500,
      isDimensionsDetected: true
    },
    targetDim: {
      width: 1920,
      height: 1080
    }
  }}>
        <div className="story-wrapper">
          <Story />
        </div>
      </MockStudioProvider>]
}`,...E.parameters?.docs?.source}}},D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
  decorators: [Story => <MockStudioProvider mockValues={{
    svgContent: '<svg></svg>',
    originalDim: {
      width: 0,
      height: 0,
      isDimensionsDetected: false
    }
  }}>
        <div className="story-wrapper">
          <Story />
        </div>
      </MockStudioProvider>]
}`,...D.parameters?.docs?.source}}},O=[`Default`,`WithSvg`,`TransparentEnabled`,`TransparentDisabled`,`Rendering`,`WithError`]}))();export{S as Default,E as Rendering,T as TransparentDisabled,w as TransparentEnabled,D as WithError,C as WithSvg,O as __namedExportsOrder,x as default};