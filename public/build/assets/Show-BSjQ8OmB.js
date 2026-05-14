import{j as t,H as C,a as k,L as E}from"./app-CQ5yU9tU.js";import{D as T,b as D}from"./DashboardLayout-Ch60mG2Y.js";import{C as c,b as x,c as m,a as o,d as R}from"./card-C2wsodmz.js";import{B as h}from"./button-DpyFYwFp.js";import{T as w,d as v,b as d,e as s,a as L,c as g,f as F}from"./table-CUsaGsXM.js";import{A as I}from"./arrow-right-CWRRuo_r.js";import{P as f}from"./x-Cbmqf-Ue.js";import{P as S}from"./printer-l7UB6Tib.js";import{S as P}from"./square-pen-De6OU8DD.js";import{F as z}from"./file-text-BGbZozi0.js";/* empty css            */import"./createLucideIcon-DCO4LFb-.js";import"./triangle-alert-DwHMy_Nm.js";import"./eye-CV3D2j06.js";import"./shield-DLapb7R8.js";import"./circle-alert-CaGGHxl0.js";import"./map-pin-kVoKg4-v.js";import"./mail-NLWLR8Nh.js";function et({scaffold:e}){const i=r=>{const l=Number(r);return Number.isFinite(l)?l:0},n=e.contractUsages??[],p=i(e.quantity),j=i(e.availableQuantity),b=e.usedQuantityDifference!=null?i(e.usedQuantityDifference):Math.max(0,p-j),y=e.usedQuantityFromContracts!=null?i(e.usedQuantityFromContracts):n.reduce((r,l)=>r+i(l.quantityUsed),0),u=r=>new Intl.NumberFormat("ar-SA",{style:"currency",currency:"OMR"}).format(r),a=r=>new Intl.NumberFormat("en-US",{useGrouping:!1,maximumFractionDigits:0}).format(r),N=r=>({AVAILABLE:"متوفرة",RENTED:"مستأجرة",SOLD:"مباعة",MAINTENANCE:"تحت الصيانة",RESERVED:"محجوزة"})[r]||r,A=r=>({AVAILABLE:"bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",RENTED:"bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",SOLD:"bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",MAINTENANCE:"bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",RESERVED:"bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"})[r]||"bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";return t.jsxs(T,{children:[t.jsx(C,{title:`تفاصيل المعدة: ${e.scaffoldNumber}`}),t.jsx("style",{children:`
        @media print {
          @page {
            size: A4;
            margin: 14mm 12mm;
          }

          html, body {
            margin: 0 !important;
            padding: 0 !important;
            width: 100% !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
            font-size: 11px;
          }

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

          .no-print {
            display: none !important;
          }

          .print-only {
            display: block !important;
          }

          .inventory-screen {
            display: none !important;
          }

          .print-report {
            display: block !important;
          }

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

          .print-break {
            page-break-inside: avoid;
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
          }
        }

        @media screen {
          .print-only {
            display: none;
          }

          .print-report {
            display: none;
          }
        }
      `}),t.jsxs("div",{className:"print-layout-root space-y-6 mt-2 -mx-1 sm:-mx-2 lg:-mx-3 xl:-mx-4 print:mx-0 print:mt-0",children:[t.jsxs("div",{className:"print-report print-container",children:[t.jsx("div",{className:"border border-black rounded-md p-3 mb-3",children:t.jsxs("div",{className:"flex items-start justify-between",children:[t.jsxs("div",{children:[t.jsx("div",{className:"text-lg font-bold text-black",children:"تقرير بيانات المعدة"}),t.jsxs("div",{className:"text-sm text-black",children:["كود الصنف: ",e.scaffoldNumber]}),t.jsx("div",{className:"text-xs text-black",children:e.descriptionAr?e.descriptionAr:"—"})]}),t.jsxs("div",{className:"text-xs text-black",children:["تاريخ الطباعة: ",new Date().toLocaleDateString("ar-SA")]})]})}),t.jsx("table",{className:"print-table",children:t.jsxs("tbody",{children:[t.jsxs("tr",{children:[t.jsx("th",{className:"w-1/4",children:"كود الصنف"}),t.jsx("td",{className:"w-1/4",children:e.scaffoldNumber}),t.jsx("th",{className:"w-1/4",children:"الحالة"}),t.jsx("td",{className:"w-1/4",children:N(e.status)})]}),t.jsx("tr",{children:t.jsx("th",{className:"font-bold",colSpan:4,children:"الكميات"})}),t.jsxs("tr",{children:[t.jsx("th",{children:"الإجمالي"}),t.jsx("td",{children:a(p)}),t.jsx("th",{children:"المتاح"}),t.jsx("td",{children:a(j)})]}),t.jsxs("tr",{children:[t.jsx("th",{children:"المستخدم (فرق الكمية)"}),t.jsxs("td",{colSpan:3,children:[a(b)," (الإجمالي − المتاح)"]})]}),t.jsx("tr",{children:t.jsx("th",{className:"font-bold",colSpan:4,children:"الوصف"})}),t.jsxs("tr",{children:[t.jsx("th",{children:"الوصف العربي"}),t.jsx("td",{colSpan:3,children:e.descriptionAr||"—"})]}),t.jsxs("tr",{children:[t.jsx("th",{children:"الوصف الإنجليزي"}),t.jsx("td",{colSpan:3,children:e.descriptionEn||"—"})]}),t.jsx("tr",{children:t.jsx("th",{className:"font-bold",colSpan:4,children:"الأسعار"})}),t.jsxs("tr",{children:[t.jsx("th",{children:"الإيجار اليومي"}),t.jsx("td",{children:u(e.dailyRentalPrice)}),t.jsx("th",{children:"الإيجار الشهري"}),t.jsx("td",{children:u(e.monthlyRentalPrice)})]}),t.jsx("tr",{children:t.jsx("th",{className:"font-bold",colSpan:4,children:"الكمية في العقود النشطة (غير منتهية)"})}),t.jsxs("tr",{children:[t.jsx("th",{children:"اسم العقد"}),t.jsx("th",{children:"العميل"}),t.jsx("th",{children:"رقم العقد"}),t.jsx("th",{children:"الكمية المستخدمة"})]}),n.length>0?n.map(r=>t.jsxs("tr",{children:[t.jsx("td",{children:r.contractTitle}),t.jsx("td",{children:r.customerName??"—"}),t.jsx("td",{children:r.contractNumber}),t.jsx("td",{children:a(i(r.quantityUsed))})]},`print-${r.contractId}`)):t.jsx("tr",{children:t.jsx("td",{colSpan:4,children:"لا توجد بنود عقد مرتبطة بهذه المعدة حالياً."})}),t.jsxs("tr",{children:[t.jsx("th",{colSpan:3,children:"الإجمالي"}),t.jsx("td",{children:a(y)})]})]})})]}),t.jsxs("div",{className:"inventory-screen space-y-6",children:[t.jsxs("div",{className:"flex items-center justify-between no-print",children:[t.jsxs("div",{className:"flex items-center gap-3",children:[t.jsx(h,{variant:"ghost",size:"sm",onClick:()=>k.visit("/inventory"),children:t.jsx(I,{className:"h-4 w-4"})}),t.jsx("div",{children:t.jsxs("h1",{className:"text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2",children:[t.jsx(f,{className:"h-6 w-6"}),"تفاصيل المعدة: ",e.scaffoldNumber]})})]}),t.jsxs("div",{className:"flex items-center gap-2",children:[t.jsxs(h,{variant:"outline",onClick:()=>window.print(),className:"flex items-center gap-2",children:[t.jsx(S,{className:"h-4 w-4"}),"طباعة"]}),t.jsxs(h,{onClick:()=>k.visit(`/inventory/${e.id}/edit`),className:"flex items-center gap-2",children:[t.jsx(P,{className:"h-4 w-4"}),"تعديل"]})]})]}),t.jsxs(c,{children:[t.jsx(x,{children:t.jsxs(m,{className:"flex items-center gap-2",children:[t.jsx(f,{className:"h-5 w-5"}),"المعلومات الأساسية"]})}),t.jsx(o,{className:"pt-0",children:t.jsx("div",{className:"rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden",children:t.jsx(w,{children:t.jsxs(v,{children:[t.jsxs(d,{className:"hover:bg-transparent border-b border-gray-200 dark:border-gray-700",children:[t.jsx(s,{className:"w-[22%] align-middle bg-gray-50 dark:bg-gray-800/80 text-right text-sm font-semibold text-gray-700 dark:text-gray-300",children:"كود الصنف"}),t.jsx(s,{className:"align-middle text-right font-mono text-sm text-gray-900 dark:text-white",children:e.scaffoldNumber}),t.jsx(s,{className:"w-[22%] align-middle bg-gray-50 dark:bg-gray-800/80 text-right text-sm font-semibold text-gray-700 dark:text-gray-300",children:"الحالة"}),t.jsx(s,{className:"align-middle text-right",children:t.jsx("span",{className:`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${A(e.status)}`,children:N(e.status)})})]}),t.jsxs(d,{className:"hover:bg-transparent border-b border-gray-200 dark:border-gray-700",children:[t.jsx(s,{className:"align-middle bg-gray-50 dark:bg-gray-800/80 text-right text-sm font-semibold text-gray-700 dark:text-gray-300",children:"إجمالي الكمية"}),t.jsx(s,{className:"align-middle text-right tabular-nums text-sm font-medium text-gray-900 dark:text-white",children:a(p)}),t.jsx(s,{className:"align-middle bg-gray-50 dark:bg-gray-800/80 text-right text-sm font-semibold text-gray-700 dark:text-gray-300",children:"الكمية المتاحة"}),t.jsx(s,{className:"align-middle text-right tabular-nums text-sm font-medium text-green-700 dark:text-green-400",children:a(j)})]}),t.jsxs(d,{className:"hover:bg-transparent border-0",children:[t.jsx(s,{className:"align-middle bg-gray-50 dark:bg-gray-800/80 text-right text-sm font-semibold text-gray-700 dark:text-gray-300",children:"المستخدم (فرق الكمية)"}),t.jsxs(s,{className:"align-middle text-right text-sm text-gray-900 dark:text-white",colSpan:3,children:[t.jsx("span",{className:"tabular-nums font-semibold text-amber-700 dark:text-amber-300",children:a(b)}),t.jsx("span",{className:"text-gray-500 dark:text-gray-400 text-xs mr-2",children:"(الإجمالي − المتاح)"})]})]})]})})})})]}),t.jsxs(c,{children:[t.jsxs(x,{className:"flex flex-row flex-wrap items-center justify-between gap-3 space-y-0",children:[t.jsxs("div",{className:"space-y-1.5",children:[t.jsxs(m,{className:"flex items-center gap-2 text-base sm:text-lg",children:[t.jsx(z,{className:"h-5 w-5 shrink-0"}),"الكمية المؤجرة (عقود نشطة)"]}),t.jsx(R,{className:"text-right text-xs leading-relaxed max-w-xl",children:"يُحسب المجموع من بنود العقود فقط عندما تكون الحالة «نشطة» أو «مفتوحة» ولم يمر تاريخ انتهاء العقد بعد."})]}),n.length>0&&t.jsxs(h,{type:"button",variant:"outline",size:"sm",onClick:()=>window.print(),className:"no-print shrink-0 gap-2",children:[t.jsx(S,{className:"h-4 w-4"}),"طباعة"]})]}),t.jsx(o,{children:n.length===0?t.jsx("p",{className:"text-sm text-gray-600 dark:text-gray-400",children:"لا توجد بنود في عقود نشطة وغير منتهية مرتبطة بهذه المعدة."}):t.jsxs(w,{children:[t.jsx(L,{children:t.jsxs(d,{children:[t.jsx(g,{className:"text-right",children:"اسم العقد"}),t.jsx(g,{className:"text-right",children:"العميل"}),t.jsx(g,{className:"text-right",children:"رقم العقد"}),t.jsx(g,{className:"text-right w-[120px]",children:"الكمية المستخدمة"})]})}),t.jsx(v,{children:n.map(r=>t.jsxs(d,{children:[t.jsx(s,{className:"text-right font-medium",children:r.contractTitle}),t.jsx(s,{className:"text-right text-gray-700 dark:text-gray-300",children:r.customerName??"—"}),t.jsx(s,{className:"text-right",children:t.jsx(E,{href:`/contracts/${r.contractId}`,className:"text-[#58d2c8] hover:underline font-mono",children:r.contractNumber})}),t.jsx(s,{className:"text-right tabular-nums font-medium",children:a(i(r.quantityUsed))})]},r.contractId))}),t.jsx(F,{children:t.jsxs(d,{children:[t.jsx(s,{colSpan:3,className:"text-right font-bold text-gray-900 dark:text-white",children:"الإجمالي"}),t.jsx(s,{className:"text-right tabular-nums font-bold text-gray-900 dark:text-white",children:a(y)})]})})]})})]}),t.jsxs(c,{children:[t.jsx(x,{children:t.jsx(m,{children:"الوصف"})}),t.jsx(o,{children:t.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-4",children:[t.jsxs("div",{children:[t.jsx("label",{className:"text-sm font-medium text-gray-600 dark:text-gray-400",children:"الوصف العربي"}),t.jsx("p",{className:"text-sm text-gray-900 dark:text-white",children:e.descriptionAr||"-"})]}),t.jsxs("div",{children:[t.jsx("label",{className:"text-sm font-medium text-gray-600 dark:text-gray-400",children:"الوصف الإنجليزي"}),t.jsx("p",{className:"text-sm text-gray-900 dark:text-white",children:e.descriptionEn||"-"})]})]})})]}),t.jsxs(c,{children:[t.jsx(x,{children:t.jsxs(m,{className:"flex items-center gap-2",children:[t.jsx(D,{className:"h-5 w-5"}),"الأسعار"]})}),t.jsx(o,{children:t.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-4",children:[t.jsxs("div",{children:[t.jsx("label",{className:"text-sm font-medium text-gray-600 dark:text-gray-400",children:"الإيجار اليومي"}),t.jsxs("p",{className:"text-sm font-medium text-gray-900 dark:text-white",children:[e.dailyRentalPrice.toLocaleString()," ر.ع"]})]}),t.jsxs("div",{children:[t.jsx("label",{className:"text-sm font-medium text-gray-600 dark:text-gray-400",children:"الإيجار الشهري"}),t.jsxs("p",{className:"text-sm font-medium text-gray-900 dark:text-white",children:[e.monthlyRentalPrice.toLocaleString()," ر.ع"]})]})]})})]})]})]})]})}export{et as default};
