import{a as e,n as t}from"./chunk-BneVvdWh.js";import{t as n}from"./react-D1sJ83FZ.js";import{t as r}from"./jsx-runtime-fcfuQg7E.js";import{i,n as a,r as o,t as s}from"./MockStudioProvider-pnyfo_BK.js";import{n as c,t as l}from"./SvgRenderer-CfdBTLix.js";var u=t((()=>{})),d,f,p=t((()=>{n(),c(),u(),d=r(),f=({rendererRef:e})=>(0,d.jsx)(`div`,{className:`monitor-wrapper`,children:(0,d.jsx)(l,{ref:e})}),f.__docgenInfo={description:``,methods:[],displayName:`RendererMonitor`,props:{rendererRef:{required:!0,tsType:{name:`RefObject`,elements:[{name:`union`,raw:`RendererHandle | null`,elements:[{name:`RendererHandle`},{name:`null`}]}],raw:`RefObject<RendererHandle | null>`},description:``}}}})),m=t((()=>{})),h,g,_=t((()=>{m(),h=r(),g=({status:e,progress:t,onCancel:n,children:r})=>(0,h.jsxs)(`div`,{className:`progress-overlay`,children:[e&&t!==void 0&&n&&(0,h.jsxs)(`div`,{className:`progress-status`,children:[(0,h.jsx)(`span`,{children:e}),(0,h.jsx)(`button`,{className:`cancel-button`,onClick:n,children:`Cancel`}),(0,h.jsxs)(`span`,{children:[t,`%`]})]}),t!==void 0&&(0,h.jsx)(`div`,{className:`progress-bar-container`,children:(0,h.jsx)(`div`,{className:`progress-bar-fill`,style:{width:`${t}%`}})}),r]}),g.__docgenInfo={description:``,methods:[],displayName:`ProgressOverlay`,props:{status:{required:!1,tsType:{name:`string`},description:``},progress:{required:!1,tsType:{name:`number`},description:``},onCancel:{required:!1,tsType:{name:`signature`,type:`function`,raw:`() => void`,signature:{arguments:[],return:{name:`void`}}},description:``},children:{required:!1,tsType:{name:`ReactReactNode`,raw:`React.ReactNode`},description:``}}}})),v=t((()=>{})),y,b,x=t((()=>{v(),y=r(),b=({meta:e,dimensions:t})=>(0,y.jsx)(`div`,{className:`meta-grid`,children:e?(0,y.jsxs)(y.Fragment,{children:[(0,y.jsxs)(`div`,{className:`meta-item`,children:[(0,y.jsx)(`strong`,{children:`Source`}),` `,e.originalSize]}),(0,y.jsxs)(`div`,{className:`meta-item`,children:[(0,y.jsx)(`strong`,{children:`Export`}),` `,e.finalSize]}),(0,y.jsxs)(`div`,{className:`meta-item`,children:[(0,y.jsx)(`strong`,{children:`Codec`}),` `,e.codec]}),(0,y.jsxs)(`div`,{className:`meta-item`,children:[(0,y.jsx)(`strong`,{children:`ETA`}),` `,e.eta,`s`]})]}):t?(0,y.jsxs)(y.Fragment,{children:[(0,y.jsxs)(`div`,{className:`meta-item`,children:[(0,y.jsx)(`strong`,{children:`Source`}),` `,t.width,`x`,t.height]}),(0,y.jsxs)(`div`,{className:`meta-item`,children:[(0,y.jsx)(`strong`,{children:`Export`}),` `,t.targetWidth,`x`,t.targetHeight]})]}):null}),b.__docgenInfo={description:``,methods:[],displayName:`MetaDisplay`,props:{meta:{required:!1,tsType:{name:`signature`,type:`object`,raw:`{
  originalSize: string;
  finalSize: string;
  codec: string;
  eta: number;
}`,signature:{properties:[{key:`originalSize`,value:{name:`string`,required:!0}},{key:`finalSize`,value:{name:`string`,required:!0}},{key:`codec`,value:{name:`string`,required:!0}},{key:`eta`,value:{name:`number`,required:!0}}]}},description:``},dimensions:{required:!1,tsType:{name:`signature`,type:`object`,raw:`{
  width: number;
  height: number;
  targetWidth: number;
  targetHeight: number;
}`,signature:{properties:[{key:`width`,value:{name:`number`,required:!0}},{key:`height`,value:{name:`number`,required:!0}},{key:`targetWidth`,value:{name:`number`,required:!0}},{key:`targetHeight`,value:{name:`number`,required:!0}}]}},description:``}}}})),S=t((()=>{})),C,w,T,E=t((()=>{i(),C=e(n(),1),p(),_(),x(),S(),w=r(),T=()=>{let{state:e,cancel:t,svgContent:n,originalDim:r,targetDim:i,rendererRef:a}=(0,C.useContext)(o);return(0,w.jsxs)(w.Fragment,{children:[(0,w.jsx)(f,{rendererRef:a}),e.isRendering?(0,w.jsx)(g,{status:e.status,progress:e.progress,onCancel:t,children:e.meta&&(0,w.jsx)(b,{meta:e.meta})}):(0,w.jsx)(w.Fragment,{children:n&&(0,w.jsx)(g,{children:(0,w.jsx)(b,{dimensions:{width:r.width,height:r.height,targetWidth:i.width,targetHeight:i.height}})})})]})},T.__docgenInfo={description:``,methods:[],displayName:`RenderingView`}})),D,O,k,A,j;t((()=>{E(),a(),D=r(),O={title:`Components/RenderingView`,component:T},k={decorators:[e=>(0,D.jsx)(s,{mockValues:{state:{isRendering:!0,status:`Processing...`,progress:45,meta:{originalSize:`500x500`,finalSize:`1920x1080`,codec:`h264`,eta:12}},svgContent:`<svg></svg>`},children:e()})]},A={decorators:[e=>(0,D.jsx)(s,{mockValues:{state:{isRendering:!1,status:`Idle`,progress:0,meta:void 0},svgContent:`<svg></svg>`,originalDim:{width:500,height:500,isDimensionsDetected:!0},targetDim:{width:1920,height:1080}},children:e()})]},k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:`{
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
}`,...k.parameters?.docs?.source}}},A.parameters={...A.parameters,docs:{...A.parameters?.docs,source:{originalSource:`{
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
}`,...A.parameters?.docs?.source}}},j=[`Rendering`,`IdleWithSvg`]}))();export{A as IdleWithSvg,k as Rendering,j as __namedExportsOrder,O as default};