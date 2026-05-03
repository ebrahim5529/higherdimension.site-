import{r as d,j as e,a as _}from"./app-wZ5aPkTQ.js";import{D as S,a as D}from"./dialog-BkkWCWI1.js";import{B as l}from"./button-DJz__RYc.js";import{I as P}from"./input-Ch8PZE-Y.js";import{s as m}from"./use-toast-BHOqcOWY.js";import{M as p}from"./message-square-JnZgQXjs.js";import{X as E}from"./x-B8-GXBLy.js";import{F as W}from"./file-text-BZppbnEU.js";import{P as A}from"./phone-DqMof2Dz.js";import{E as B}from"./eye-CQsQ4fHf.js";import{D as F}from"./download-BPN9q4fL.js";import{C as I}from"./copy-Dl9Qy3cL.js";import{c as U}from"./createLucideIcon-iaksOQdk.js";const z=U("Send",[["path",{d:"M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z",key:"1ffxy3"}],["path",{d:"m21.854 2.147-10.94 10.939",key:"12cjpa"}]]),T=({open:n,onOpenChange:i,contract:s,customerPhone:o=""})=>{const[t,c]=d.useState(o),[x,b]=d.useState(""),[g,u]=d.useState("");d.useEffect(()=>{s&&n&&(c(o),f())},[s,n,o]),d.useEffect(()=>{x.trim()?u(x):f()},[x,s]);const f=()=>{if(!s)return;const r=s.contract_type||"تأجير معدات بناء",a=typeof window<"u"?window.location.origin:"",h=s.contract_number||"",$=`${a}/contract/sign/${h}`,k=`السلام عليكم ورحمة الله وبركاته



أهلاً وسهلاً بكم في شركة البعد العالي للتجارة



تم إعداد عقد إيجار معدات بناء برقم: *${h}*



تفاصيل العقد:

• العميل: ${s.customer_name}

• القيمة الإجمالية: ${s.total_amount} ر.ع

• تاريخ العقد: ${s.contract_date}

• نوع العقد: ${r}



يرجى مراجعة العقد والتوقيع عليه من خلال الرابط التالي:

${$}



بعد التوقيع سيتم إرسال نسخة موقعة إليكم



شكراً لثقتكم بنا
شركة البعد العالي للتجارة`;u(k)},N=r=>{let a=r.replace(/[\s\-\(\)]/g,"");return a.startsWith("+968")?a=a.substring(4):a.startsWith("968")&&(a=a.substring(3)),`968${a}`},y=()=>{navigator.clipboard.writeText(g),m.success("تم النسخ","تم نسخ الرسالة إلى الحافظة")},v=()=>{if(!t.trim()){m.error("خطأ","يرجى إدخال رقم الهاتف");return}const r=N(t),a=encodeURIComponent(g),h=`https://wa.me/${r}?text=${a}`;window.open(h,"_blank")},w=()=>{if(!t.trim()){m.error("خطأ","يرجى إدخال رقم الهاتف");return}m.info("قيد التطوير","سيتم إضافة هذه الميزة قريباً")},C=()=>{s&&window.open(`/contracts/${s.id}/invoice`,"_blank")},M=()=>{s&&m.info("قيد التطوير","سيتم إضافة هذه الميزة قريباً")},j=t.trim().length>=7;return s?e.jsx(S,{open:n,onOpenChange:i,children:e.jsxs(D,{className:"max-w-2xl max-h-[90vh] overflow-y-auto p-0",children:[e.jsxs("div",{className:"flex items-center justify-between p-6 border-b border-gray-200",children:[e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx("div",{className:"p-2 bg-green-100 rounded-lg",children:e.jsx(p,{className:"h-6 w-6 text-green-600"})}),e.jsxs("div",{children:[e.jsx("h2",{className:"text-xl font-bold text-gray-900",children:"إرسال العقد عبر الواتساب"}),e.jsx("p",{className:"text-sm text-gray-600",children:"إرسال العقد للعميل للتوقيع"})]})]}),e.jsx(l,{variant:"ghost",size:"icon",onClick:()=>i(!1),className:"h-8 w-8",children:e.jsx(E,{className:"h-5 w-5"})})]}),e.jsxs("div",{className:"p-6 space-y-6",children:[e.jsxs("div",{className:"bg-gray-50 rounded-lg p-4",children:[e.jsxs("div",{className:"flex items-center gap-2 mb-3",children:[e.jsx(W,{className:"h-5 w-5 text-gray-600"}),e.jsx("h3",{className:"font-semibold text-gray-900",children:"معلومات العقد"})]}),e.jsxs("div",{className:"grid grid-cols-2 gap-4 text-sm",children:[e.jsxs("div",{children:[e.jsx("span",{className:"text-gray-600",children:"رقم العقد:"}),e.jsxs("span",{className:"font-medium text-gray-900 mr-2",children:[" ",s.contract_number]})]}),e.jsxs("div",{children:[e.jsx("span",{className:"text-gray-600",children:"اسم العميل:"}),e.jsxs("span",{className:"font-medium text-gray-900 mr-2",children:[" ",s.customer_name]})]}),e.jsxs("div",{children:[e.jsx("span",{className:"text-gray-600",children:"القيمة الإجمالية:"}),e.jsxs("span",{className:"font-medium text-gray-900 mr-2",children:[" ",s.total_amount," ر.ع"]})]}),e.jsxs("div",{children:[e.jsx("span",{className:"text-gray-600",children:"تاريخ العقد:"}),e.jsxs("span",{className:"font-medium text-gray-900 mr-2",children:[" ",s.contract_date]})]})]})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsxs("label",{className:"flex items-center gap-2 text-sm font-medium text-gray-700",children:[e.jsx(A,{className:"h-4 w-4"}),"رقم الهاتف"]}),e.jsx(P,{placeholder:"96812345678 أو 12345678",type:"tel",value:t,onChange:r=>c(r.target.value),className:"w-full"}),e.jsx("p",{className:"text-xs text-gray-500",children:"يمكن إدخال الرقم بدون رمز البلد أو مع +968"})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsxs("label",{className:"flex items-center gap-2 text-sm font-medium text-gray-700",children:[e.jsx(p,{className:"h-4 w-4"}),"الرسالة المخصصة (اختياري)"]}),e.jsx("textarea",{placeholder:"اكتب رسالة مخصصة أو اتركها فارغة لاستخدام الرسالة الافتراضية",rows:6,value:x,onChange:r=>b(r.target.value),className:"w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#58d2c8] focus:border-transparent resize-none"})]}),e.jsxs("div",{className:"bg-yellow-50 rounded-lg p-4",children:[e.jsx("h4",{className:"font-medium text-yellow-900 mb-3",children:"معاينة وتوليد العقد:"}),e.jsxs("div",{className:"flex flex-wrap gap-3",children:[e.jsxs(l,{variant:"default",onClick:C,className:"bg-blue-600 hover:bg-blue-700",children:[e.jsx(B,{className:"h-4 w-4 mr-2"}),"معاينة نموذج العقد"]}),e.jsxs(l,{variant:"default",onClick:M,className:"bg-purple-600 hover:bg-purple-700",children:[e.jsx(F,{className:"h-4 w-4 mr-2"}),"توليد PDF"]})]})]}),e.jsxs("div",{className:"bg-blue-50 rounded-lg p-4",children:[e.jsx("h4",{className:"font-medium text-blue-900 mb-2",children:"معاينة الرسالة:"}),e.jsx("div",{className:"bg-white rounded border p-3 text-sm text-gray-700 whitespace-pre-wrap max-h-40 overflow-y-auto",children:g})]})]}),e.jsxs("div",{className:"flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50",children:[e.jsx(l,{variant:"ghost",onClick:()=>i(!1),children:"إلغاء"}),e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsxs(l,{variant:"default",onClick:y,className:"bg-gray-600 hover:bg-gray-700",children:[e.jsx(I,{className:"h-4 w-4 mr-2"}),"نسخ الرسالة"]}),e.jsxs(l,{variant:"default",onClick:v,disabled:!j,className:"bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed",children:[e.jsx(p,{className:"h-4 w-4 mr-2"}),"فتح الواتساب"]}),e.jsxs(l,{variant:"default",onClick:w,disabled:!j,className:"bg-[#58d2c8] hover:bg-[#4AB8B3] disabled:bg-gray-400 disabled:cursor-not-allowed",children:[e.jsx(z,{className:"h-4 w-4 mr-2"}),"إرسال عبر النظام"]})]})]})]})}):null};function ee({open:n,onOpenChange:i,contract:s,customerPhone:o,redirectOnCloseTo:t=null}){return e.jsx(T,{open:n,onOpenChange:c=>{i(c),!c&&t&&_.visit(t)},contract:s,customerPhone:o})}export{T as C,z as S,ee as a};
