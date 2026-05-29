import{a as e,n as t}from"./chunk-DnJy8xQt.js";import{a as n}from"./iframe-Bh_OChOT.js";import{t as r}from"./jsx-runtime-DxP0NviS.js";import{n as i,t as a}from"./Button-Cog33c4V.js";import{f as o,i as s,l as c,o as l,p as u}from"./fa-CKqGie23.js";import{n as d,t as f}from"./package-BPxTnxKQ.js";var p,m,h=t((()=>{p=async e=>{let t=await(await fetch(e)).blob();return new Promise((e,n)=>{let r=new FileReader;r.onloadend=()=>e(r.result),r.onerror=n,r.readAsDataURL(t)})},m=async e=>{try{let t=await p(e);return await navigator.clipboard.writeText(t),!0}catch(e){return console.error(`Clipboard copy data-url failed:`,e),!1}}})),g=t((()=>{})),_,v,y,b=t((()=>{_=e(n(),1),i(),u(),f(),h(),g(),v=r(),y=({fileName:e,fileSize:t,renderedUrl:n,onDownload:r,onBack:i,onCopyOverride:u})=>{let[f,p]=(0,_.useState)(`idle`);return(0,v.jsxs)(`div`,{className:`success-card`,children:[(0,v.jsxs)(`header`,{className:`success-header`,children:[(0,v.jsx)(`div`,{className:`success-icon`,"aria-hidden":`true`,children:(0,v.jsx)(s,{})}),(0,v.jsx)(`h3`,{children:`Render Complete`}),(0,v.jsxs)(`p`,{className:`success-meta`,children:[e,` • `,t]})]}),(0,v.jsx)(`div`,{className:`success-preview`,children:(0,v.jsxs)(`video`,{src:n,controls:!0,autoPlay:!0,loop:!0,children:[(0,v.jsx)(`track`,{kind:`captions`,srcLang:`en`,label:`English`,default:!0}),`Your browser does not support the video tag.`]})}),(0,v.jsxs)(`div`,{className:`success-actions`,children:[(0,v.jsx)(a,{variant:`primary`,onClick:r,children:`Download`}),(0,v.jsxs)(a,{variant:`outline`,onClick:async()=>{p(`idle`);let e=await(u||m)(n);typeof umami<`u`&&umami.track(`copy-data-url`,{success:e}),e?(p(`success`),setTimeout(()=>p(`idle`),2e3)):(p(`error`),setTimeout(()=>p(`idle`),2e3))},className:`copy-button copy-button--${f}`,children:[f===`success`?(0,v.jsx)(s,{className:`icon-success`}):f===`error`?(0,v.jsx)(o,{className:`icon-error`}):(0,v.jsx)(l,{}),`Copy Data URL`]}),(0,v.jsx)(a,{variant:`secondary`,onClick:i,children:`Back to Studio`})]}),(0,v.jsxs)(`div`,{className:`success-support`,children:[(0,v.jsxs)(`span`,{children:[(0,v.jsx)(c,{className:`icon-heart`}),` Love this tool?`,` `]}),(0,v.jsx)(`a`,{href:d.funding.url,target:`_blank`,rel:`noopener noreferrer`,children:`Support its development on GitHub ↗`})]})]})},y.__docgenInfo={description:``,methods:[],displayName:`SuccessView`,props:{fileName:{required:!0,tsType:{name:`string`},description:``},fileSize:{required:!0,tsType:{name:`union`,raw:`string | null`,elements:[{name:`string`},{name:`null`}]},description:``},renderedUrl:{required:!0,tsType:{name:`string`},description:``},onDownload:{required:!0,tsType:{name:`signature`,type:`function`,raw:`() => void`,signature:{arguments:[],return:{name:`void`}}},description:``},onBack:{required:!0,tsType:{name:`signature`,type:`function`,raw:`() => void`,signature:{arguments:[],return:{name:`void`}}},description:``},onCopyOverride:{required:!1,tsType:{name:`signature`,type:`function`,raw:`(url: string) => Promise<boolean>`,signature:{arguments:[{type:{name:`string`},name:`url`}],return:{name:`Promise`,elements:[{name:`boolean`}],raw:`Promise<boolean>`}}},description:``}}}})),x,S,C,w,T,E,D,O;t((()=>{b(),{userEvent:x,within:S,fn:C}=__STORYBOOK_MODULE_TEST__,w={title:`Components/SuccessView`,component:y,args:{fileName:`animation.mp4`,fileSize:`2.5 MB`,renderedUrl:`https://example.com/video.mp4`,onDownload:C(),onBack:C(),onCopyOverride:C()}},T={},E={args:{onCopyOverride:async()=>(await new Promise(e=>setTimeout(e,500)),!0)},play:async({canvasElement:e})=>{let t=S(e).getByRole(`button`,{name:/Copy Data URL/i});await x.click(t)}},D={args:{onCopyOverride:async()=>(await new Promise(e=>setTimeout(e,500)),!1)},play:async({canvasElement:e})=>{let t=S(e).getByRole(`button`,{name:/Copy Data URL/i});await x.click(t)}},T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{}`,...T.parameters?.docs?.source}}},E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
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
}`,...D.parameters?.docs?.source}}},O=[`Default`,`CopySuccess`,`CopyError`]}))();export{D as CopyError,E as CopySuccess,T as Default,O as __namedExportsOrder,w as default};