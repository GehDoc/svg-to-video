import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{t}from"./jsx-runtime-DeHZSEgm.js";var n,r;function i(){return(i=e((()=>{n=t(),r=({meta:e,dimensions:t})=>{let r=e?.originalSize||(t?`${t.width}x${t.height}`:`---`),i=e?.finalSize||(t?`${t.targetWidth}x${t.targetHeight}`:`---`),a=e?.codec||`---`,o=e?.eta===void 0?`---`:`${e.eta}s`;return(0,n.jsxs)(`div`,{className:`meta-grid`,children:[(0,n.jsxs)(`div`,{className:`meta-item`,children:[(0,n.jsx)(`strong`,{children:`Source:`}),` `,r]}),(0,n.jsxs)(`div`,{className:`meta-item`,children:[(0,n.jsx)(`strong`,{children:`Export:`}),` `,i]}),(0,n.jsxs)(`div`,{className:`meta-item`,children:[(0,n.jsx)(`strong`,{children:`Codec:`}),` `,a]}),(0,n.jsxs)(`div`,{className:`meta-item`,children:[(0,n.jsx)(`strong`,{children:`ETA:`}),` `,o]})]})},r.__docgenInfo={description:``,methods:[],displayName:`MetaDisplay`,props:{meta:{required:!1,tsType:{name:`signature`,type:`object`,raw:`{
  originalSize: string;
  finalSize: string;
  codec: string;
  eta: number;
}`,signature:{properties:[{key:`originalSize`,value:{name:`string`,required:!0}},{key:`finalSize`,value:{name:`string`,required:!0}},{key:`codec`,value:{name:`string`,required:!0}},{key:`eta`,value:{name:`number`,required:!0}}]}},description:``},dimensions:{required:!1,tsType:{name:`signature`,type:`object`,raw:`{
  width: number;
  height: number;
  targetWidth: number;
  targetHeight: number;
}`,signature:{properties:[{key:`width`,value:{name:`number`,required:!0}},{key:`height`,value:{name:`number`,required:!0}},{key:`targetWidth`,value:{name:`number`,required:!0}},{key:`targetHeight`,value:{name:`number`,required:!0}}]}},description:``}}}})))()}export{i as n,r as t};