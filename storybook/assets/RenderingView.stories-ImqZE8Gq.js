import{a as e,n as t}from"./chunk-BneVvdWh.js";import{t as n}from"./react-D1sJ83FZ.js";import{t as r}from"./jsx-runtime-fcfuQg7E.js";import{i,n as a,r as o,t as s}from"./MockStudioProvider-C5OhOgID.js";import{n as c,t as l}from"./MetaDisplay-DBWynmKM.js";import{n as u,t as d}from"./ProgressOverlay-BgHMuJJa.js";import{n as f,t as p}from"./SvgRenderer-CFArYwW-.js";var m=t((()=>{})),h,g,_=t((()=>{n(),f(),m(),h=r(),g=({rendererRef:e})=>(0,h.jsx)(`div`,{className:`monitor-wrapper`,children:(0,h.jsx)(p,{ref:e})}),g.__docgenInfo={description:``,methods:[],displayName:`RendererMonitor`,props:{rendererRef:{required:!0,tsType:{name:`RefObject`,elements:[{name:`union`,raw:`RendererHandle | null`,elements:[{name:`RendererHandle`},{name:`null`}]}],raw:`RefObject<RendererHandle | null>`},description:``}}}})),v=t((()=>{})),y,b,x,S=t((()=>{i(),y=e(n(),1),_(),u(),c(),v(),b=r(),x=()=>{let{state:e,cancel:t,svgContent:n,originalDim:r,targetDim:i,rendererRef:a}=(0,y.useContext)(o);return(0,b.jsxs)(b.Fragment,{children:[(0,b.jsx)(g,{rendererRef:a}),e.isRendering?(0,b.jsx)(d,{status:e.status,progress:e.progress,onCancel:t,children:e.meta&&(0,b.jsx)(l,{meta:e.meta})}):(0,b.jsx)(b.Fragment,{children:n&&(0,b.jsx)(d,{children:(0,b.jsx)(l,{dimensions:{width:r.width,height:r.height,targetWidth:i.width,targetHeight:i.height}})})})]})},x.__docgenInfo={description:``,methods:[],displayName:`RenderingView`}})),C,w,T,E,D;t((()=>{S(),a(),C=r(),w={title:`Components/RenderingView`,component:x},T={decorators:[e=>(0,C.jsx)(s,{mockValues:{state:{isRendering:!0,status:`Processing...`,progress:45,meta:{originalSize:`500x500`,finalSize:`1920x1080`,codec:`h264`,eta:12}},svgContent:`<svg></svg>`},children:e()})]},E={decorators:[e=>(0,C.jsx)(s,{mockValues:{state:{isRendering:!1,status:`Idle`,progress:0,meta:void 0},svgContent:`<svg></svg>`,originalDim:{width:500,height:500,isDimensionsDetected:!0},targetDim:{width:1920,height:1080}},children:e()})]},T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
  decorators: [Story => <MockStudioProvider mockValues={{
    state: {
      isRendering: true,
      status: 'Processing...',
      progress: 45,
      meta: {
        originalSize: '500x500',
        finalSize: '1920x1080',
        codec: 'h264',
        eta: 12
      }
    },
    svgContent: '<svg></svg>'
  }}>
        {Story()}
      </MockStudioProvider>]
}`,...T.parameters?.docs?.source}}},E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
  decorators: [Story => <MockStudioProvider mockValues={{
    state: {
      isRendering: false,
      status: 'Idle',
      progress: 0,
      meta: undefined
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
        {Story()}
      </MockStudioProvider>]
}`,...E.parameters?.docs?.source}}},D=[`Rendering`,`IdleWithSvg`]}))();export{E as IdleWithSvg,T as Rendering,D as __namedExportsOrder,w as default};