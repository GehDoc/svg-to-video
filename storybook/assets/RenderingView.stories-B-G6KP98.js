import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{d as t}from"./iframe-C817-4O7.js";import{t as n}from"./jsx-runtime-DeHZSEgm.js";import{n as r,t as i}from"./ErrorView-B3E-wP9D.js";import{n as a,t as o}from"./MetaDisplay-C5x--fGe.js";import{n as s,t as c}from"./ProgressOverlay-78hWk_jR.js";import{n as l,t as u}from"./SvgRenderer-C-GiSptK.js";var d,f;function p(){return(p=e((()=>{l(),d=n(),f=({rendererRef:e,svgContent:t,width:n,height:r,backgroundColor:i,isTransparent:a,isRendering:o})=>(0,d.jsx)(`div`,{className:`monitor-wrapper`,children:(0,d.jsx)(u,{ref:e,svgContent:t,width:n,height:r,backgroundColor:i,isTransparent:a,isRendering:o})}),f.__docgenInfo={description:``,methods:[],displayName:`RendererMonitor`,props:{rendererRef:{required:!0,tsType:{name:`RefObject`,elements:[{name:`union`,raw:`RendererHandle | null`,elements:[{name:`RendererHandle`},{name:`null`}]}],raw:`RefObject<RendererHandle | null>`},description:``},svgContent:{required:!1,tsType:{name:`union`,raw:`string | null`,elements:[{name:`string`},{name:`null`}]},description:``},width:{required:!1,tsType:{name:`number`},description:``},height:{required:!1,tsType:{name:`number`},description:``},backgroundColor:{required:!1,tsType:{name:`string`},description:``},isTransparent:{required:!1,tsType:{name:`boolean`},description:``},isRendering:{required:!1,tsType:{name:`boolean`},description:``}}}})))()}var m,h;function g(){return(g=e((()=>{p(),s(),a(),r(),m=n(),h=({state:e,svgContent:t,originalDim:n,targetDim:r,rendererRef:a,backgroundColor:s,isTransparent:l,onCancel:u,onClearError:d})=>{let p=e.status.startsWith(`Error:`);return(0,m.jsx)(`div`,{className:`rendering-view`,children:p?(0,m.jsx)(i,{message:e.status,onClose:d}):(0,m.jsxs)(m.Fragment,{children:[(0,m.jsx)(f,{rendererRef:a,svgContent:t,width:r.width,height:r.height,backgroundColor:s,isTransparent:l,isRendering:e.isRendering}),(0,m.jsx)(c,{status:e.isRendering?e.status:`Ready to Export`,progress:e.isRendering?e.progress:void 0,onCancel:e.isRendering?u:void 0,children:(0,m.jsx)(o,{meta:e.meta,dimensions:{width:n.width,height:n.height,targetWidth:r.width,targetHeight:r.height}})})]})})},h.__docgenInfo={description:``,methods:[],displayName:`RenderingView`,props:{state:{required:!0,tsType:{name:`RenderState`},description:``},svgContent:{required:!0,tsType:{name:`union`,raw:`string | null`,elements:[{name:`string`},{name:`null`}]},description:``},originalDim:{required:!0,tsType:{name:`signature`,type:`object`,raw:`{ width: number; height: number }`,signature:{properties:[{key:`width`,value:{name:`number`,required:!0}},{key:`height`,value:{name:`number`,required:!0}}]}},description:``},targetDim:{required:!0,tsType:{name:`signature`,type:`object`,raw:`{ width: number; height: number }`,signature:{properties:[{key:`width`,value:{name:`number`,required:!0}},{key:`height`,value:{name:`number`,required:!0}}]}},description:``},rendererRef:{required:!0,tsType:{name:`ReactRefObject`,raw:`React.RefObject<RendererHandle | null>`,elements:[{name:`union`,raw:`RendererHandle | null`,elements:[{name:`RendererHandle`},{name:`null`}]}]},description:``},backgroundColor:{required:!0,tsType:{name:`string`},description:``},isTransparent:{required:!0,tsType:{name:`boolean`},description:``},onCancel:{required:!0,tsType:{name:`signature`,type:`function`,raw:`() => void`,signature:{arguments:[],return:{name:`void`}}},description:``},onClearError:{required:!0,tsType:{name:`signature`,type:`function`,raw:`() => void`,signature:{arguments:[],return:{name:`void`}}},description:``}}}})))()}var _,v,y,b,x,S;function C(){return(C=e((()=>{g(),_=t(),v={title:`Components/RenderingView`,component:h,args:{state:{isRendering:!1,status:`Ready to Export`,progress:0,meta:void 0},svgContent:`
      <svg viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg">
        <rect width="500" height="500" fill="#f8fafc" />
        <circle cx="250" cy="250" r="120" fill="#6366f1" opacity="0.8" />
        <text x="250" y="260" font-family="sans-serif" font-size="40" font-weight="bold" text-anchor="middle" fill="white">SVG</text>
      </svg>
    `,originalDim:{width:500,height:500},targetDim:{width:1e3,height:1e3},rendererRef:(0,_.createRef)(),backgroundColor:`#ffffff`,isTransparent:!1,onCancel:()=>console.log(`Cancel`),onClearError:()=>console.log(`Clear Error`)}},y={args:{state:{isRendering:!0,status:`Processing...`,progress:45,meta:{originalSize:`500x500`,finalSize:`1920x1080`,codec:`h264`,eta:12}}}},b={args:{state:{isRendering:!1,status:`Ready to Export`,progress:0,meta:void 0},originalDim:{width:500,height:500},targetDim:{width:1e3,height:1e3}}},x={args:{state:{isRendering:!1,status:`Error: Failed to render`,progress:0,meta:void 0}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
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
}`,...y.parameters?.docs?.source}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
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
}`,...b.parameters?.docs?.source}}},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  args: {
    state: {
      isRendering: false,
      status: 'Error: Failed to render',
      progress: 0,
      meta: undefined
    }
  }
}`,...x.parameters?.docs?.source}}},S=[`Rendering`,`IdleWithSvg`,`ErrorState`]})))()}C();export{x as ErrorState,b as IdleWithSvg,y as Rendering,S as __namedExportsOrder,v as default};