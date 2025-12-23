import{h as e}from"./app-C70Abe0W.js";const n={success:(s,r)=>{const o=r?`${s}
${r}`:s;e.success(o)},error:(s,r)=>{const o=r?`${s}
${r}`:s;e.error(o)},warning:(s,r)=>{const o=r?`${s}
${r}`:s;e.warning(o)},info:(s,r)=>{const o=r?`${s}
${r}`:s;e.info(o)},loading:s=>e.loading(s),promise:(s,r)=>e.promise(s,{loading:r.loading,success:r.success,error:r.error})};export{n as s};
