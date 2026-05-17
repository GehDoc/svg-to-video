import{a as e,n as t}from"./chunk-DnJy8xQt.js";import{a as n}from"./iframe-Fo0lVCon.js";import{t as r}from"./jsx-runtime-DxP0NviS.js";import{r as i}from"./discoverFormats-DHyKD-oe.js";import{n as a,t as o}from"./ErrorView-BoPg6Y8O.js";import{n as s,t as c}from"./MetaDisplay-kQgPA_kq.js";import{n as l,t as u}from"./ProgressOverlay-DEnZEjNF.js";import{n as d,t as f}from"./SvgRenderer-BSDk4k8o.js";var p,m,h=t((()=>{n(),d(),p=r(),m=({rendererRef:e,svgContent:t,width:n,height:r,backgroundColor:i,isTransparent:a,isRendering:o})=>(0,p.jsx)(`div`,{className:`monitor-wrapper`,children:(0,p.jsx)(f,{ref:e,svgContent:t,width:n,height:r,backgroundColor:i,isTransparent:a,isRendering:o})}),m.__docgenInfo={description:``,methods:[],displayName:`RendererMonitor`,props:{rendererRef:{required:!0,tsType:{name:`RefObject`,elements:[{name:`union`,raw:`RendererHandle | null`,elements:[{name:`RendererHandle`},{name:`null`}]}],raw:`RefObject<RendererHandle | null>`},description:``},svgContent:{required:!1,tsType:{name:`union`,raw:`string | null`,elements:[{name:`string`},{name:`null`}]},description:``},width:{required:!1,tsType:{name:`number`},description:``},height:{required:!1,tsType:{name:`number`},description:``},backgroundColor:{required:!1,tsType:{name:`string`},description:``},isTransparent:{required:!1,tsType:{name:`boolean`},description:``},isRendering:{required:!1,tsType:{name:`boolean`},description:``}}}})),g=t((()=>{n(),i()})),_=t((()=>{})),v,y,b=t((()=>{h(),l(),s(),a(),g(),_(),v=r(),y=({state:e,svgContent:t,originalDim:n,targetDim:r,rendererRef:i,backgroundColor:a,isTransparent:s,onCancel:l,onClearError:d})=>(0,v.jsx)(`div`,{className:`rendering-view`,children:e.status.startsWith(`Error:`)?(0,v.jsx)(o,{message:e.status,onClose:d}):(0,v.jsxs)(v.Fragment,{children:[(0,v.jsx)(m,{rendererRef:i,svgContent:t,width:r.width,height:r.height,backgroundColor:a,isTransparent:s,isRendering:e.isRendering}),(0,v.jsx)(u,{status:e.isRendering?e.status:`Ready to Export`,progress:e.isRendering?e.progress:void 0,onCancel:e.isRendering?l:void 0,children:(0,v.jsx)(c,{meta:e.meta,dimensions:{width:n.width,height:n.height,targetWidth:r.width,targetHeight:r.height}})})]})}),y.__docgenInfo={description:``,methods:[],displayName:`RenderingView`,props:{state:{required:!0,tsType:{name:`RenderState`},description:``},svgContent:{required:!0,tsType:{name:`union`,raw:`string | null`,elements:[{name:`string`},{name:`null`}]},description:``},originalDim:{required:!0,tsType:{name:`signature`,type:`object`,raw:`{ width: number; height: number }`,signature:{properties:[{key:`width`,value:{name:`number`,required:!0}},{key:`height`,value:{name:`number`,required:!0}}]}},description:``},targetDim:{required:!0,tsType:{name:`signature`,type:`object`,raw:`{ width: number; height: number }`,signature:{properties:[{key:`width`,value:{name:`number`,required:!0}},{key:`height`,value:{name:`number`,required:!0}}]}},description:``},rendererRef:{required:!0,tsType:{name:`ReactRefObject`,raw:`React.RefObject<RendererHandle | null>`,elements:[{name:`union`,raw:`RendererHandle | null`,elements:[{name:`RendererHandle`},{name:`null`}]}]},description:``},backgroundColor:{required:!0,tsType:{name:`string`},description:``},isTransparent:{required:!0,tsType:{name:`boolean`},description:``},onCancel:{required:!0,tsType:{name:`signature`,type:`function`,raw:`() => void`,signature:{arguments:[],return:{name:`void`}}},description:``},onClearError:{required:!0,tsType:{name:`signature`,type:`function`,raw:`() => void`,signature:{arguments:[],return:{name:`void`}}},description:``}}}})),x,S,C,w,T,E;t((()=>{b(),x=e(n(),1),S={title:`Components/RenderingView`,component:y,args:{state:{isRendering:!1,status:`Ready to Export`,progress:0,meta:void 0},svgContent:`
      <svg viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg">
        <rect width="500" height="500" fill="#f8fafc" />
        <circle cx="250" cy="250" r="120" fill="#6366f1" opacity="0.8" />
        <text x="250" y="260" font-family="sans-serif" font-size="40" font-weight="bold" text-anchor="middle" fill="white">SVG</text>
      </svg>
    `,originalDim:{width:500,height:500},targetDim:{width:1e3,height:1e3},rendererRef:(0,x.createRef)(),backgroundColor:`#ffffff`,isTransparent:!1,onCancel:()=>console.log(`Cancel`),onClearError:()=>console.log(`Clear Error`)}},C={args:{state:{isRendering:!0,status:`Processing...`,progress:45,meta:{originalSize:`500x500`,finalSize:`1920x1080`,codec:`h264`,eta:12}}}},w={args:{state:{isRendering:!1,status:`Ready to Export`,progress:0,meta:void 0},originalDim:{width:500,height:500},targetDim:{width:1e3,height:1e3}}},T={args:{state:{isRendering:!1,status:`Error: Failed to render`,progress:0,meta:void 0}}},C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
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
}`,...C.parameters?.docs?.source}}},w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
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
}`,...w.parameters?.docs?.source}}},T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
  args: {
    state: {
      isRendering: false,
      status: 'Error: Failed to render',
      progress: 0,
      meta: undefined
    }
  }
}`,...T.parameters?.docs?.source}}},E=[`Rendering`,`IdleWithSvg`,`ErrorState`]}))();export{T as ErrorState,w as IdleWithSvg,C as Rendering,E as __namedExportsOrder,S as default};