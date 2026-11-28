import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{t}from"./react-BGJ90fIb.js";import{n,t as r}from"./StarButton-dv1x2_Ft.js";import{t as i}from"./jsx-runtime-MKhVqBIO.js";import{F as a,I as o}from"./query-B8nDwThU.js";import{n as s,r as c}from"./iframe-zuzJFNWp.js";var l,u,d,f,p,m,h,g;function _(){return(_=e((()=>{t(),c(),o(),n(),l=i(),u={title:`Components/StarButton`,component:r,tags:[`autodocs`]},d={},f={args:{size:`medium`}},p={args:{showCount:!1}},m={decorators:[e=>{let t=new s({defaultOptions:{queries:{retry:!1}}});return t.setQueryDefaults([`github-repo-stars`],{queryFn:()=>new Promise(()=>{}),staleTime:1/0}),(0,l.jsx)(a,{client:t,children:(0,l.jsx)(e,{})})}]},h={decorators:[e=>{let t=new s;return t.setQueryData([`github-repo-stars`],null),(0,l.jsx)(a,{client:t,children:(0,l.jsx)(e,{})})}]},g=[`Default`,`Medium`,`WithoutCount`,`Loading`,`Fallback`],d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{}`,...d.parameters?.docs?.source}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  args: {
    size: 'medium'
  }
}`,...f.parameters?.docs?.source}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  args: {
    showCount: false
  }
}`,...p.parameters?.docs?.source}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  decorators: [Story => {
    const client = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false
        }
      }
    });
    client.setQueryDefaults(['github-repo-stars'], {
      queryFn: () => new Promise(() => {}),
      staleTime: Infinity
    });
    return <QueryClientProvider client={client}>
          <Story />
        </QueryClientProvider>;
  }]
}`,...m.parameters?.docs?.source}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  decorators: [Story => {
    const client = new QueryClient();
    client.setQueryData(['github-repo-stars'], null);
    return <QueryClientProvider client={client}>
          <Story />
        </QueryClientProvider>;
  }]
}`,...h.parameters?.docs?.source}}}})))()}_();export{d as Default,h as Fallback,m as Loading,f as Medium,p as WithoutCount,g as __namedExportsOrder,u as default};