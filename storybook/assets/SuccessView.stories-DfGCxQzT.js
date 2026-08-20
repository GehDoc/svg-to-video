import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{d as t}from"./iframe-CDsxzxJY.js";import{t as n}from"./jsx-runtime-DeHZSEgm.js";import{n as r,t as i}from"./Button-f8eQqFLP.js";import{i as a,r as o}from"./discoverFormats-C2st2xp1.js";import{f as s,i as c,l,o as u,p as d}from"./fa-DQ1hdQF0.js";import{n as f,t as p}from"./package-BgnqJLPa.js";var m,h;function g(){return(g=e((()=>{m=async e=>{let t=await(await fetch(e)).blob();return new Promise((e,n)=>{let r=new FileReader;r.onloadend=()=>e(r.result),r.onerror=n,r.readAsDataURL(t)})},h=async e=>{try{let t=await m(e);return await navigator.clipboard.writeText(t),!0}catch(e){return console.error(`Clipboard copy data-url failed:`,e),!1}}})))()}var _,v,y;function b(){return(b=e((()=>{_=t(),r(),d(),p(),g(),o(),v=n(),y=({fileName:e,fileSize:t,renderedUrl:n,mimeType:r,onDownload:o,onBack:d,onCopyOverride:p})=>{let[m,g]=(0,_.useState)(`idle`),y=async()=>{g(`idle`);let e=await(p||h)(n);typeof umami<`u`&&umami.track(`copy-data-url`,{success:e}),e?(g(`success`),setTimeout(()=>g(`idle`),2e3)):(g(`error`),setTimeout(()=>g(`idle`),2e3))},b=()=>m===`success`?(0,v.jsx)(c,{className:`icon-success`}):m===`error`?(0,v.jsx)(s,{className:`icon-error`}):(0,v.jsx)(u,{}),x=a(r);return(0,v.jsxs)(`div`,{className:`success-card`,children:[(0,v.jsxs)(`header`,{className:`success-header`,children:[(0,v.jsx)(`div`,{className:`success-icon`,"aria-hidden":`true`,children:(0,v.jsx)(c,{})}),(0,v.jsx)(`h3`,{children:`Render Complete`}),(0,v.jsxs)(`p`,{className:`success-meta`,children:[e,` • `,t]})]}),(0,v.jsx)(`div`,{className:`success-preview`,children:x?(0,v.jsx)(`img`,{src:n,alt:`Rendered animation preview`}):(0,v.jsxs)(`video`,{src:n,controls:!0,autoPlay:!0,loop:!0,"data-testid":`video-preview`,children:[(0,v.jsx)(`track`,{kind:`captions`,srcLang:`en`,label:`English`,default:!0}),`Your browser does not support the video tag.`]})}),(0,v.jsxs)(`div`,{className:`success-actions`,children:[(0,v.jsx)(i,{variant:`primary`,onClick:o,children:`Download`}),(0,v.jsxs)(i,{variant:`outline`,onClick:y,className:`copy-button copy-button--${m}`,children:[b(),`Copy Data URL`]}),(0,v.jsx)(i,{variant:`secondary`,onClick:d,children:`Back to Studio`})]}),(0,v.jsxs)(`div`,{className:`success-support`,children:[(0,v.jsxs)(`span`,{children:[(0,v.jsx)(l,{className:`icon-heart`}),` Love this tool?`,` `]}),(0,v.jsx)(`a`,{href:f.funding.url,target:`_blank`,rel:`noopener noreferrer`,children:`Support its development on GitHub ↗`})]})]})},y.__docgenInfo={description:``,methods:[],displayName:`SuccessView`,props:{fileName:{required:!0,tsType:{name:`string`},description:``},fileSize:{required:!0,tsType:{name:`union`,raw:`string | null`,elements:[{name:`string`},{name:`null`}]},description:``},renderedUrl:{required:!0,tsType:{name:`string`},description:``},mimeType:{required:!0,tsType:{name:`string`},description:``},onDownload:{required:!0,tsType:{name:`signature`,type:`function`,raw:`() => void`,signature:{arguments:[],return:{name:`void`}}},description:``},onBack:{required:!0,tsType:{name:`signature`,type:`function`,raw:`() => void`,signature:{arguments:[],return:{name:`void`}}},description:``},onCopyOverride:{required:!1,tsType:{name:`signature`,type:`function`,raw:`(url: string) => Promise<boolean>`,signature:{arguments:[{type:{name:`string`},name:`url`}],return:{name:`Promise`,elements:[{name:`boolean`}],raw:`Promise<boolean>`}}},description:``}}}})))()}var x,S,C,w,T,E,D,O,k,A;function j(){return(j=e((()=>{b(),{userEvent:x,within:S,fn:C}=__STORYBOOK_MODULE_TEST__,w={title:`Components/SuccessView`,component:y,args:{fileName:`animation.mp4`,fileSize:`2.5 MB`,renderedUrl:`https://example.com/video.mp4`,mimeType:`video/mp4`,onDownload:C(),onBack:C(),onCopyOverride:C()}},T={},E={args:{onCopyOverride:async()=>(await new Promise(e=>setTimeout(e,500)),!0)},play:async({canvasElement:e})=>{let t=S(e).getByRole(`button`,{name:/Copy Data URL/i});await x.click(t)}},D={args:{onCopyOverride:async()=>(await new Promise(e=>setTimeout(e,500)),!1)},play:async({canvasElement:e})=>{let t=S(e).getByRole(`button`,{name:/Copy Data URL/i});await x.click(t)}},O={args:{fileName:`animation.png`,mimeType:`image/png`,renderedUrl:`https://gehdoc.github.io/svg-to-video/assets/demo.gif`}},k={args:{fileName:`animation.gif`,mimeType:`image/gif`,renderedUrl:`https://gehdoc.github.io/svg-to-video/assets/demo.gif`}},T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{}`,...T.parameters?.docs?.source}}},E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
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
}`,...E.parameters?.docs?.source}}},D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
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
}`,...D.parameters?.docs?.source}}},O.parameters={...O.parameters,docs:{...O.parameters?.docs,source:{originalSource:`{
  args: {
    fileName: 'animation.png',
    mimeType: 'image/png',
    renderedUrl: 'https://gehdoc.github.io/svg-to-video/assets/demo.gif' // Using gif as placeholder for image preview
  }
}`,...O.parameters?.docs?.source}}},k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:`{
  args: {
    fileName: 'animation.gif',
    mimeType: 'image/gif',
    renderedUrl: 'https://gehdoc.github.io/svg-to-video/assets/demo.gif'
  }
}`,...k.parameters?.docs?.source}}},A=[`Default`,`CopySuccess`,`CopyError`,`APNG`,`GIF`]})))()}j();export{O as APNG,D as CopyError,E as CopySuccess,T as Default,k as GIF,A as __namedExportsOrder,w as default};