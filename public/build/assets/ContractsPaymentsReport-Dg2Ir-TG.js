import{r as h,j as e,H as L,L as y,a as u}from"./app-8OqINlFw.js";import{D as P,e as $}from"./DashboardLayout-BIHqVWqc.js";import{C as n,b as p,c as j,a as l}from"./card-DnGm0w3X.js";import{B as f}from"./button-YHlBK_jD.js";import{C as M}from"./combobox-CrzDC1_-.js";import{T as z,a as B,b as v,c as m,d as H,e as c}from"./table-C16oTAAG.js";import{F as E}from"./file-text-BZukqvFc.js";import{P as R}from"./printer-FnnkiKvO.js";import{c as C}from"./createLucideIcon-BApQ4peW.js";/* empty css            */import"./triangle-alert-DYQZTZnf.js";import"./x-CWy3iZ8T.js";import"./eye-B4ghmYJG.js";import"./shield-shEJhko5.js";import"./circle-alert-C2ymtC9T.js";import"./map-pin-BzJabZgd.js";import"./mail-TAZATdmf.js";import"./dialog-BbQdauNz.js";import"./index-BACWXT7n.js";import"./check-BhUb9Ptb.js";const k=C("ExternalLink",[["path",{d:"M15 3h6v6",key:"1q9fwt"}],["path",{d:"M10 14 21 3",key:"gplh6r"}],["path",{d:"M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6",key:"a6xqqp"}]]),w="/dashboard/customer-contracts-payments-report";function re({customerOptions:g,selectedCustomerId:o,selectedCustomer:s,contracts:i}){const[d,b]=h.useState("all");h.useEffect(()=>{b("all")},[o]);const S=h.useMemo(()=>g.map(t=>({value:String(t.id),label:`${t.name} — ${t.customerNumber}${t.phone?` — ${t.phone}`:""}`})),[g]),x=h.useMemo(()=>{if(!i.length)return[];if(d==="all")return i;const t=Number(d);return i.filter(a=>a.id===t)},[i,d]),N=t=>{if(!t){u.get(w,{},{preserveScroll:!0});return}u.get(w,{customer_id:t},{preserveScroll:!0})},r=t=>new Intl.NumberFormat("en-US",{style:"currency",currency:"OMR"}).format(Number(t||0)),T=()=>new Date().toLocaleDateString("ar-SA",{year:"numeric",month:"long",day:"numeric"}),D=()=>window.print();return e.jsxs(P,{children:[e.jsx(L,{title:"تقرير عقود ومدفوعات عميل"}),e.jsx("style",{children:`
        @media print {
          @page {
            size: A4;
            margin: 14mm 12mm;
          }
          html, body {
            margin: 0 !important;
            padding: 0 !important;
            width: 100% !important;
            font-size: 11px;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .no-print { display: none !important; }
          header,
          aside,
          .fixed.inset-y-0.right-0.z-50,
          .fixed.inset-0.z-40 {
            display: none !important;
          }
          main {
            padding: 0 !important;
            margin: 0 !important;
            overflow: visible !important;
            max-width: 100% !important;
          }
          main > div.max-w-full {
            margin: 0 !important;
            padding: 0 !important;
            max-width: 100% !important;
          }
          .print-layout-root {
            margin: 0 !important;
            padding: 0 !important;
            max-width: 100% !important;
            box-sizing: border-box !important;
          }
          body { background: #fff !important; }
          table { page-break-inside: auto; }
          tr { page-break-inside: avoid; page-break-after: auto; }
          .print-only { display: block !important; }
          .print-report { display: block !important; }
          .print-container {
            margin: 0 !important;
            padding: 0 !important;
            max-width: 100% !important;
            box-sizing: border-box !important;
          }
          .print-container .shadow,
          .print-container .shadow-sm,
          .print-container .shadow-md,
          .print-container .shadow-lg {
            box-shadow: none !important;
          }
          .print-table {
            width: 100%;
            border-collapse: collapse;
          }
          .print-table td,
          .print-table th {
            border: 1px solid #000;
            padding: 4px;
            vertical-align: top;
            text-align: right;
          }
        }
        @media screen {
          .print-only { display: none; }
          .print-report { display: none; }
        }
      `}),e.jsxs("div",{className:"print-layout-root space-y-6 mt-2 -mx-1 sm:-mx-2 lg:-mx-3 xl:-mx-4 print:mx-0 print:mt-0",children:[e.jsxs("div",{className:"flex flex-wrap items-start justify-between gap-4 no-print",children:[e.jsxs("div",{children:[e.jsxs("h1",{className:"text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2",children:[e.jsx(E,{className:"h-8 w-8 text-[#58d2c8]"}),"تقرير عقود ومدفوعات عميل"]}),e.jsx("p",{className:"text-gray-600 dark:text-gray-400 mt-1",children:"اختر عميلاً لعرض جميع عقوده ودفعات كل عقد، مع إمكانية تقييد العرض لعقد واحد أو طباعة التقرير."})]}),e.jsx("div",{className:"flex flex-wrap items-center gap-2",children:s&&e.jsxs(f,{type:"button",className:"bg-[#58d2c8] hover:bg-[#4AB8B3] gap-2",onClick:D,children:[e.jsx(R,{className:"h-4 w-4"}),"طباعة التقرير"]})})]}),e.jsxs(n,{className:"no-print",children:[e.jsx(p,{children:e.jsxs(j,{className:"text-base flex items-center gap-2",children:[e.jsx($,{className:"h-5 w-5"}),"اختيار العميل"]})}),e.jsxs(l,{className:"space-y-4",children:[e.jsxs("div",{className:"max-w-xl",children:[e.jsx("label",{className:"block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2",children:"ابحث واختر عميلاً"}),e.jsx(M,{options:S,value:o?String(o):void 0,onValueChange:N,placeholder:"اكتب للبحث بالاسم أو الرقم أو الجوال...",searchPlaceholder:"بحث...",emptyText:"لا يوجد عميل مطابق"})]}),o?e.jsx(f,{type:"button",variant:"outline",size:"sm",onClick:()=>N(""),children:"إلغاء اختيار العميل"}):null]})]}),s&&e.jsxs(e.Fragment,{children:[e.jsxs(n,{className:"no-print",children:[e.jsxs(p,{className:"flex flex-row flex-wrap items-center justify-between gap-3 space-y-0",children:[e.jsx(j,{className:"text-base",children:"نطاق العقود المعروضة"}),e.jsxs(y,{href:`/customers/${s.id}`,className:"text-sm text-[#58d2c8] hover:underline inline-flex items-center gap-1",children:["صفحة العميل",e.jsx(k,{className:"h-3.5 w-3.5"})]})]}),e.jsxs(l,{children:[e.jsx("label",{className:"block text-sm text-gray-600 dark:text-gray-400 mb-2",children:"العقود"}),e.jsxs("select",{value:d,onChange:t=>b(t.target.value),className:"w-full max-w-md border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-white",children:[e.jsxs("option",{value:"all",children:["كل العقود (",i.length,")"]}),i.map(t=>e.jsxs("option",{value:String(t.id),children:[t.contractNumber," — ",t.statusLabel," — ",r(t.amount)]},t.id))]})]})]}),e.jsxs(n,{className:"no-print",children:[e.jsx(p,{children:e.jsx(j,{className:"text-base",children:"بيانات العميل"})}),e.jsx(l,{children:e.jsxs("div",{className:"grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm",children:[e.jsxs("div",{children:[e.jsx("span",{className:"text-gray-500 dark:text-gray-400",children:"الاسم:"})," ",e.jsx("span",{className:"font-semibold text-gray-900 dark:text-white",children:s.name})]}),e.jsxs("div",{children:[e.jsx("span",{className:"text-gray-500 dark:text-gray-400",children:"رقم العميل:"})," ",e.jsx("span",{className:"font-mono",children:s.customerNumber})]}),e.jsxs("div",{children:[e.jsx("span",{className:"text-gray-500 dark:text-gray-400",children:"الجوال:"})," ",e.jsx("span",{children:s.phone||"—"})]}),e.jsxs("div",{children:[e.jsx("span",{className:"text-gray-500 dark:text-gray-400",children:"البريد:"})," ",e.jsx("span",{children:s.email||"—"})]})]})})]}),x.length===0?e.jsx(n,{className:"no-print",children:e.jsx(l,{className:"py-10 text-center text-gray-600 dark:text-gray-400",children:"لا توجد عقود لهذا العميل."})}):x.map(t=>e.jsxs(n,{className:"no-print",children:[e.jsx(p,{children:e.jsxs(j,{className:"text-base flex flex-wrap items-center gap-2 justify-between",children:[e.jsxs("span",{children:["عقد ",t.contractNumber,e.jsxs("span",{className:"text-sm font-normal text-gray-500 dark:text-gray-400 mr-2",children:["(",t.statusLabel,")"]})]}),e.jsxs(y,{href:`/contracts/${t.id}`,className:"text-sm text-[#58d2c8] hover:underline inline-flex items-center gap-1 font-normal",children:["فتح العقد",e.jsx(k,{className:"h-3.5 w-3.5"})]})]})}),e.jsxs(l,{className:"space-y-4",children:[e.jsxs("div",{className:"grid grid-cols-2 md:grid-cols-4 gap-3 text-sm",children:[e.jsxs("div",{children:[e.jsx("div",{className:"text-gray-500 dark:text-gray-400 text-xs",children:"عنوان العقد"}),e.jsx("div",{className:"font-medium",children:t.title||"—"})]}),e.jsxs("div",{children:[e.jsx("div",{className:"text-gray-500 dark:text-gray-400 text-xs",children:"من — إلى"}),e.jsxs("div",{className:"font-mono text-xs",children:[t.startDate||"—"," ← ",t.endDate||"—"]})]}),e.jsxs("div",{children:[e.jsx("div",{className:"text-gray-500 dark:text-gray-400 text-xs",children:"قيمة العقد"}),e.jsx("div",{className:"font-semibold tabular-nums",children:r(t.amount)})]}),e.jsxs("div",{children:[e.jsx("div",{className:"text-gray-500 dark:text-gray-400 text-xs",children:"المدفوع / المتبقي"}),e.jsxs("div",{className:"tabular-nums",children:[e.jsx("span",{className:"text-green-700 dark:text-green-400",children:r(t.totalPaid)})," / ",e.jsx("span",{className:"text-amber-700 dark:text-amber-300",children:r(t.remaining)})]})]})]}),e.jsxs("div",{children:[e.jsx("h4",{className:"text-sm font-semibold mb-2",children:"دفعات العقد"}),t.payments.length===0?e.jsx("p",{className:"text-sm text-gray-500",children:"لا توجد دفعات مسجلة لهذا العقد."}):e.jsx("div",{className:"rounded-md border border-gray-200 dark:border-gray-700 overflow-x-auto",children:e.jsxs(z,{children:[e.jsx(B,{children:e.jsxs(v,{children:[e.jsx(m,{className:"text-right",children:"التاريخ"}),e.jsx(m,{className:"text-right",children:"الطريقة"}),e.jsx(m,{className:"text-right",children:"المبلغ"}),e.jsx(m,{className:"text-right",children:"شيك / بنك"}),e.jsx(m,{className:"text-right",children:"ملاحظات"})]})}),e.jsx(H,{children:t.payments.map(a=>e.jsxs(v,{children:[e.jsx(c,{className:"text-right font-mono text-sm",children:a.paymentDate}),e.jsx(c,{className:"text-right text-sm",children:a.paymentMethod}),e.jsx(c,{className:"text-right tabular-nums font-medium text-green-700 dark:text-green-400",children:r(a.amount)}),e.jsx(c,{className:"text-right text-sm text-gray-600 dark:text-gray-400",children:[a.checkNumber,a.bankName].filter(Boolean).join(" — ")||"—"}),e.jsx(c,{className:"text-right text-sm max-w-[200px] break-words",children:a.notes||"—"})]},a.id))})]})})]})]})]},t.id))]}),!s&&e.jsx(n,{className:"no-print",children:e.jsx(l,{className:"py-12 text-center text-gray-600 dark:text-gray-400",children:"اختر عميلاً من القائمة أعلاه لعرض العقود والدفعات."})}),s&&e.jsxs("div",{className:"print-report print-container",children:[e.jsx("div",{className:"border border-black rounded-md p-3 mb-3",children:e.jsxs("div",{className:"flex items-start justify-between",children:[e.jsxs("div",{children:[e.jsx("div",{className:"text-lg font-bold text-black",children:"تقرير عقود ومدفوعات عميل"}),e.jsx("div",{className:"text-sm text-black font-bold",children:s.name}),e.jsxs("div",{className:"text-xs text-black",children:["رقم العميل: ",s.customerNumber," — الجوال: ",s.phone||"—"]}),e.jsxs("div",{className:"text-xs text-black mt-1",children:["نطاق العقود:"," ",d==="all"?"كل العقود":x[0]?`عقد ${x[0].contractNumber}`:"عقد محدد"]})]}),e.jsxs("div",{className:"text-xs text-black",children:["تاريخ الطباعة: ",T()]})]})}),x.map(t=>e.jsxs("div",{className:"mb-6 print-break",children:[e.jsx("table",{className:"print-table mb-2",children:e.jsxs("tbody",{children:[e.jsx("tr",{children:e.jsxs("th",{colSpan:4,className:"font-bold bg-gray-100",children:["بيانات العقد ",t.contractNumber]})}),e.jsxs("tr",{children:[e.jsx("th",{children:"رقم العقد"}),e.jsx("td",{children:t.contractNumber}),e.jsx("th",{children:"الحالة"}),e.jsx("td",{children:t.statusLabel})]}),e.jsxs("tr",{children:[e.jsx("th",{children:"العنوان"}),e.jsx("td",{colSpan:3,children:t.title||"—"})]}),e.jsxs("tr",{children:[e.jsx("th",{children:"تاريخ البدء"}),e.jsx("td",{children:t.startDate||"—"}),e.jsx("th",{children:"تاريخ الانتهاء"}),e.jsx("td",{children:t.endDate||"—"})]}),e.jsxs("tr",{children:[e.jsx("th",{children:"قيمة العقد"}),e.jsx("td",{children:r(t.amount)}),e.jsx("th",{children:"المدفوع / المتبقي"}),e.jsxs("td",{children:[r(t.totalPaid)," / ",r(t.remaining)]})]})]})}),e.jsxs("table",{className:"print-table",children:[e.jsxs("thead",{children:[e.jsx("tr",{children:e.jsxs("th",{colSpan:5,className:"text-right font-bold",children:["دفعات العقد ",t.contractNumber]})}),e.jsxs("tr",{children:[e.jsx("th",{children:"التاريخ"}),e.jsx("th",{children:"طريقة الدفع"}),e.jsx("th",{children:"المبلغ"}),e.jsx("th",{children:"شيك / بنك"}),e.jsx("th",{children:"ملاحظات"})]})]}),e.jsx("tbody",{children:t.payments.length===0?e.jsx("tr",{children:e.jsx("td",{colSpan:5,className:"text-center",children:"لا توجد دفعات"})}):t.payments.map(a=>e.jsxs("tr",{children:[e.jsx("td",{children:a.paymentDate}),e.jsx("td",{children:a.paymentMethod}),e.jsx("td",{children:r(a.amount)}),e.jsx("td",{children:[a.checkNumber,a.bankName].filter(Boolean).join(" — ")||"—"}),e.jsx("td",{children:a.notes||"—"})]},`print-p-${a.id}`))})]})]},`print-c-${t.id}`))]})]})]})}export{re as default};
