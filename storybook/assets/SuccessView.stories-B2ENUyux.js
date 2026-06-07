import{i as e,s as t}from"./preload-helper-CSTgzvhI.js";import{C as n}from"./iframe-BM-WgHbk.js";import{t as r}from"./jsx-runtime-BOjh3_yA.js";import{n as i,t as a}from"./Button-Q4OR_g4Q.js";import{i as o,r as s}from"./discoverFormats-41XrE1nr.js";import{f as c,i as l,l as u,o as d,p as f}from"./fa-DXPhcfUP.js";import{n as p,t as m}from"./package-yc2WNogT.js";var h,g,_=e((()=>{h=async e=>{let t=await(await fetch(e)).blob();return new Promise((e,n)=>{let r=new FileReader;r.onloadend=()=>e(r.result),r.onerror=n,r.readAsDataURL(t)})},g=async e=>{try{let t=await h(e);return await navigator.clipboard.writeText(t),!0}catch(e){return console.error(`Clipboard copy data-url failed:`,e),!1}}})),v=e((()=>{})),y,b,x,S=e((()=>{y=t(n(),1),i(),f(),m(),_(),s(),v(),b=r(),x=({fileName:e,fileSize:t,renderedUrl:n,mimeType:r,onDownload:i,onBack:s,onCopyOverride:f})=>{let[m,h]=(0,y.useState)(`idle`),_=async()=>{h(`idle`);let e=await(f||g)(n);typeof umami<`u`&&umami.track(`copy-data-url`,{success:e}),e?(h(`success`),setTimeout(()=>h(`idle`),2e3)):(h(`error`),setTimeout(()=>h(`idle`),2e3))},v=()=>m===`success`?(0,b.jsx)(l,{className:`icon-success`}):m===`error`?(0,b.jsx)(c,{className:`icon-error`}):(0,b.jsx)(d,{}),x=o(r);return(0,b.jsxs)(`div`,{className:`success-card`,children:[(0,b.jsxs)(`header`,{className:`success-header`,children:[(0,b.jsx)(`div`,{className:`success-icon`,"aria-hidden":`true`,children:(0,b.jsx)(l,{})}),(0,b.jsx)(`h3`,{children:`Render Complete`}),(0,b.jsxs)(`p`,{className:`success-meta`,children:[e,` • `,t]})]}),(0,b.jsx)(`div`,{className:`success-preview`,children:x?(0,b.jsx)(`img`,{src:n,alt:`Rendered animation preview`}):(0,b.jsxs)(`video`,{src:n,controls:!0,autoPlay:!0,loop:!0,"data-testid":`video-preview`,children:[(0,b.jsx)(`track`,{kind:`captions`,srcLang:`en`,label:`English`,default:!0}),`Your browser does not support the video tag.`]})}),(0,b.jsxs)(`div`,{className:`success-actions`,children:[(0,b.jsx)(a,{variant:`primary`,onClick:i,children:`Download`}),(0,b.jsxs)(a,{variant:`outline`,onClick:_,className:`copy-button copy-button--${m}`,children:[v(),`Copy Data URL`]}),(0,b.jsx)(a,{variant:`secondary`,onClick:s,children:`Back to Studio`})]}),(0,b.jsxs)(`div`,{className:`success-support`,children:[(0,b.jsxs)(`span`,{children:[(0,b.jsx)(u,{className:`icon-heart`}),` Love this tool?`,` `]}),(0,b.jsx)(`a`,{href:p.funding.url,target:`_blank`,rel:`noopener noreferrer`,children:`Support its development on GitHub ↗`})]})]})},x.__docgenInfo={description:``,methods:[],displayName:`SuccessView`,props:{fileName:{required:!0,tsType:{name:`string`},description:``},fileSize:{required:!0,tsType:{name:`union`,raw:`string | null`,elements:[{name:`string`},{name:`null`}]},description:``},renderedUrl:{required:!0,tsType:{name:`string`},description:``},mimeType:{required:!0,tsType:{name:`string`},description:``},onDownload:{required:!0,tsType:{name:`signature`,type:`function`,raw:`() => void`,signature:{arguments:[],return:{name:`void`}}},description:``},onBack:{required:!0,tsType:{name:`signature`,type:`function`,raw:`() => void`,signature:{arguments:[],return:{name:`void`}}},description:``},onCopyOverride:{required:!1,tsType:{name:`signature`,type:`function`,raw:`(url: string) => Promise<boolean>`,signature:{arguments:[{type:{name:`string`},name:`url`}],return:{name:`Promise`,elements:[{name:`boolean`}],raw:`Promise<boolean>`}}},description:``}}}})),C,w,T,E,D,O,k,A,j,M;e((()=>{S(),{userEvent:C,within:w,fn:T}=__STORYBOOK_MODULE_TEST__,E={title:`Components/SuccessView`,component:x,args:{fileName:`animation.mp4`,fileSize:`2.5 MB`,renderedUrl:`https://example.com/video.mp4`,mimeType:`video/mp4`,onDownload:T(),onBack:T(),onCopyOverride:T()}},D={},O={args:{onCopyOverride:async()=>(await new Promise(e=>setTimeout(e,500)),!0)},play:async({canvasElement:e})=>{let t=w(e).getByRole(`button`,{name:/Copy Data URL/i});await C.click(t)}},k={args:{onCopyOverride:async()=>(await new Promise(e=>setTimeout(e,500)),!1)},play:async({canvasElement:e})=>{let t=w(e).getByRole(`button`,{name:/Copy Data URL/i});await C.click(t)}},A={args:{fileName:`animation.png`,mimeType:`image/png`,renderedUrl:`https://gehdoc.github.io/svg-to-video/assets/demo.gif`}},j={args:{fileName:`animation.gif`,mimeType:`image/gif`,renderedUrl:`https://gehdoc.github.io/svg-to-video/assets/demo.gif`}},D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{}`,...D.parameters?.docs?.source}}},O.parameters={...O.parameters,docs:{...O.parameters?.docs,source:{originalSource:`{
  args: {
    onCopyOverride: async () => {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      return true;
    }
  },
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    const copyBtn = canvas.getByRole('button', {
      name: /Copy Data URL/i
    });
    await userEvent.click(copyBtn);
  }
}`,...O.parameters?.docs?.source}}},k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:`{
  args: {
    onCopyOverride: async () => {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      return false;
    }
  },
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    const copyBtn = canvas.getByRole('button', {
      name: /Copy Data URL/i
    });
    await userEvent.click(copyBtn);
  }
}`,...k.parameters?.docs?.source}}},A.parameters={...A.parameters,docs:{...A.parameters?.docs,source:{originalSource:`{
  args: {
    fileName: 'animation.png',
    mimeType: 'image/png',
    renderedUrl: 'https://gehdoc.github.io/svg-to-video/assets/demo.gif' // Using gif as placeholder for image preview
  }
}`,...A.parameters?.docs?.source}}},j.parameters={...j.parameters,docs:{...j.parameters?.docs,source:{originalSource:`{
  args: {
    fileName: 'animation.gif',
    mimeType: 'image/gif',
    renderedUrl: 'https://gehdoc.github.io/svg-to-video/assets/demo.gif'
  }
}`,...j.parameters?.docs?.source}}},M=[`Default`,`CopySuccess`,`CopyError`,`APNG`,`GIF`]}))();export{A as APNG,k as CopyError,O as CopySuccess,D as Default,j as GIF,M as __namedExportsOrder,E as default};