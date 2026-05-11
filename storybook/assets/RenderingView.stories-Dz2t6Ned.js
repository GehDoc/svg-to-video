import{a as e,n as t}from"./chunk-DnJy8xQt.js";import{a as n}from"./iframe-Dk-OWOQj.js";import{t as r}from"./jsx-runtime-DxP0NviS.js";import{i,n as a,r as o,t as s}from"./MockStudioProvider-DgzJ7uhs.js";import{n as c,t as l}from"./ErrorView-DOPWSGPV.js";import{n as u,t as d}from"./MetaDisplay-_lthta4o.js";import{n as f,t as p}from"./ProgressOverlay-CrntV0D7.js";import{n as m,t as h}from"./SvgRenderer-CpLAERxK.js";var g=t((()=>{})),_,v,y=t((()=>{n(),m(),g(),_=r(),v=({rendererRef:e,svgContent:t,width:n,height:r,backgroundColor:i,isTransparent:a,isRendering:o})=>(0,_.jsx)(`div`,{className:`monitor-wrapper`,children:(0,_.jsx)(h,{ref:e,svgContent:t,width:n,height:r,backgroundColor:i,isTransparent:a,isRendering:o})}),v.__docgenInfo={description:``,methods:[],displayName:`RendererMonitor`,props:{rendererRef:{required:!0,tsType:{name:`RefObject`,elements:[{name:`union`,raw:`RendererHandle | null`,elements:[{name:`RendererHandle`},{name:`null`}]}],raw:`RefObject<RendererHandle | null>`},description:``},svgContent:{required:!1,tsType:{name:`union`,raw:`string | null`,elements:[{name:`string`},{name:`null`}]},description:``},width:{required:!1,tsType:{name:`number`},description:``},height:{required:!1,tsType:{name:`number`},description:``},backgroundColor:{required:!1,tsType:{name:`string`},description:``},isTransparent:{required:!1,tsType:{name:`boolean`},description:``},isRendering:{required:!1,tsType:{name:`boolean`},description:``}}}})),b=t((()=>{})),x,S,C,w=t((()=>{i(),x=e(n(),1),y(),f(),u(),c(),b(),S=r(),C=()=>{let{state:e,cancel:t,clearError:n,svgContent:r,originalDim:i,targetDim:a,rendererRef:s,backgroundColor:c,isTransparent:u}=(0,x.useContext)(o);return(0,S.jsx)(`div`,{className:`rendering-view`,children:e.status.startsWith(`Error:`)?(0,S.jsx)(l,{message:e.status,onClose:()=>{n()}}):(0,S.jsxs)(S.Fragment,{children:[(0,S.jsx)(v,{rendererRef:s,svgContent:r,width:a.width,height:a.height,backgroundColor:c,isTransparent:u,isRendering:e.isRendering}),(0,S.jsx)(p,{status:e.isRendering?e.status:`Ready to Export`,progress:e.isRendering?e.progress:void 0,onCancel:e.isRendering?t:void 0,children:(0,S.jsx)(d,{meta:e.meta,dimensions:{width:i.width,height:i.height,targetWidth:a.width,targetHeight:a.height}})})]})})},C.__docgenInfo={description:``,methods:[],displayName:`RenderingView`}})),T,E,D,O,k;t((()=>{w(),a(),T=r(),E={title:`Components/RenderingView`,component:C},D={decorators:[e=>(0,T.jsx)(s,{mockValues:{state:{isRendering:!0,status:`Processing...`,progress:45,meta:{originalSize:`500x500`,finalSize:`1920x1080`,codec:`h264`,eta:12}},svgContent:`<svg></svg>`},children:e()})]},O={decorators:[e=>(0,T.jsx)(s,{mockValues:{state:{isRendering:!1,status:`Idle`,progress:0,meta:void 0},svgContent:`<svg></svg>`,originalDim:{width:500,height:500,isDimensionsDetected:!0},targetDim:{width:1920,height:1080}},children:e()})]},D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
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
}`,...D.parameters?.docs?.source}}},O.parameters={...O.parameters,docs:{...O.parameters?.docs,source:{originalSource:`{
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
}`,...O.parameters?.docs?.source}}},k=[`Rendering`,`IdleWithSvg`]}))();export{O as IdleWithSvg,D as Rendering,k as __namedExportsOrder,E as default};