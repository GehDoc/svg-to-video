import{a as e,n as t}from"./chunk-DnJy8xQt.js";import{a as n}from"./iframe-DsCcfUbv.js";import{t as r}from"./jsx-runtime-DxP0NviS.js";import{n as i,t as a}from"./ErrorView-BCuXv9iK.js";import{n as o,t as s}from"./MetaDisplay-C-3QVbcA.js";import{n as c,t as l}from"./ProgressOverlay-BLX755QT.js";import{n as u,t as d}from"./SvgRenderer-Ceevv2iy.js";var f,p,m=t((()=>{n(),u(),f=r(),p=({rendererRef:e,svgContent:t,width:n,height:r,backgroundColor:i,isTransparent:a,isRendering:o})=>(0,f.jsx)(`div`,{className:`monitor-wrapper`,children:(0,f.jsx)(d,{ref:e,svgContent:t,width:n,height:r,backgroundColor:i,isTransparent:a,isRendering:o})}),p.__docgenInfo={description:``,methods:[],displayName:`RendererMonitor`,props:{rendererRef:{required:!0,tsType:{name:`RefObject`,elements:[{name:`union`,raw:`RendererHandle | null`,elements:[{name:`RendererHandle`},{name:`null`}]}],raw:`RefObject<RendererHandle | null>`},description:``},svgContent:{required:!1,tsType:{name:`union`,raw:`string | null`,elements:[{name:`string`},{name:`null`}]},description:``},width:{required:!1,tsType:{name:`number`},description:``},height:{required:!1,tsType:{name:`number`},description:``},backgroundColor:{required:!1,tsType:{name:`string`},description:``},isTransparent:{required:!1,tsType:{name:`boolean`},description:``},isRendering:{required:!1,tsType:{name:`boolean`},description:``}}}})),h=t((()=>{n()})),g=t((()=>{})),_,v,y=t((()=>{m(),c(),o(),i(),h(),g(),_=r(),v=({state:e,svgContent:t,originalDim:n,targetDim:r,rendererRef:i,backgroundColor:o,isTransparent:c,onCancel:u,onClearError:d})=>(0,_.jsx)(`div`,{className:`rendering-view`,children:e.status.startsWith(`Error:`)?(0,_.jsx)(a,{message:e.status,onClose:d}):(0,_.jsxs)(_.Fragment,{children:[(0,_.jsx)(p,{rendererRef:i,svgContent:t,width:r.width,height:r.height,backgroundColor:o,isTransparent:c,isRendering:e.isRendering}),(0,_.jsx)(l,{status:e.isRendering?e.status:`Ready to Export`,progress:e.isRendering?e.progress:void 0,onCancel:e.isRendering?u:void 0,children:(0,_.jsx)(s,{meta:e.meta,dimensions:{width:n.width,height:n.height,targetWidth:r.width,targetHeight:r.height}})})]})}),v.__docgenInfo={description:``,methods:[],displayName:`RenderingView`,props:{state:{required:!0,tsType:{name:`RenderState`},description:``},svgContent:{required:!0,tsType:{name:`union`,raw:`string | null`,elements:[{name:`string`},{name:`null`}]},description:``},originalDim:{required:!0,tsType:{name:`signature`,type:`object`,raw:`{ width: number; height: number }`,signature:{properties:[{key:`width`,value:{name:`number`,required:!0}},{key:`height`,value:{name:`number`,required:!0}}]}},description:``},targetDim:{required:!0,tsType:{name:`signature`,type:`object`,raw:`{ width: number; height: number }`,signature:{properties:[{key:`width`,value:{name:`number`,required:!0}},{key:`height`,value:{name:`number`,required:!0}}]}},description:``},rendererRef:{required:!0,tsType:{name:`ReactRefObject`,raw:`React.RefObject<RendererHandle | null>`,elements:[{name:`union`,raw:`RendererHandle | null`,elements:[{name:`RendererHandle`},{name:`null`}]}]},description:``},backgroundColor:{required:!0,tsType:{name:`string`},description:``},isTransparent:{required:!0,tsType:{name:`boolean`},description:``},onCancel:{required:!0,tsType:{name:`signature`,type:`function`,raw:`() => void`,signature:{arguments:[],return:{name:`void`}}},description:``},onClearError:{required:!0,tsType:{name:`signature`,type:`function`,raw:`() => void`,signature:{arguments:[],return:{name:`void`}}},description:``}}}})),b,x,S,C,w,T;t((()=>{y(),b=e(n(),1),x={title:`Components/RenderingView`,component:v,args:{state:{isRendering:!1,status:`Ready to Export`,progress:0,meta:void 0},svgContent:`
      <svg viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg">
        <rect width="500" height="500" fill="#f8fafc" />
        <circle cx="250" cy="250" r="120" fill="#6366f1" opacity="0.8" />
        <text x="250" y="260" font-family="sans-serif" font-size="40" font-weight="bold" text-anchor="middle" fill="white">SVG</text>
      </svg>
    `,originalDim:{width:500,height:500},targetDim:{width:1e3,height:1e3},rendererRef:(0,b.createRef)(),backgroundColor:`#ffffff`,isTransparent:!1,onCancel:()=>console.log(`Cancel`),onClearError:()=>console.log(`Clear Error`)}},S={args:{state:{isRendering:!0,status:`Processing...`,progress:45,meta:{originalSize:`500x500`,finalSize:`1920x1080`,codec:`h264`,eta:12}}}},C={args:{state:{isRendering:!1,status:`Ready to Export`,progress:0,meta:void 0},originalDim:{width:500,height:500},targetDim:{width:1e3,height:1e3}}},w={args:{state:{isRendering:!1,status:`Error: Failed to render`,progress:0,meta:void 0}}},S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
  args: {
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
    }
  }
}`,...S.parameters?.docs?.source}}},C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  args: {
    state: {
      isRendering: false,
      status: 'Ready to Export',
      progress: 0,
      meta: undefined
    },
    originalDim: {
      width: 500,
      height: 500
    },
    targetDim: {
      width: 1000,
      height: 1000
    }
  }
}`,...C.parameters?.docs?.source}}},w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
  args: {
    state: {
      isRendering: false,
      status: 'Error: Failed to render',
      progress: 0,
      meta: undefined
    }
  }
}`,...w.parameters?.docs?.source}}},T=[`Rendering`,`IdleWithSvg`,`ErrorState`]}))();export{w as ErrorState,C as IdleWithSvg,S as Rendering,T as __namedExportsOrder,x as default};