import{j as e,H as C,a as k,L as E}from"./app-CR9u-zQw.js";import{D as T,b as D}from"./DashboardLayout-CLxDLGbX.js";import{C as c,b as x,c as m,a as o,d as R}from"./card-303E4aoj.js";import{B as h}from"./button-BSL2_0jL.js";import{T as w,d as v,b as n,e as a,a as L,c as g,f as F}from"./table-OJOiWVK2.js";import{A as I}from"./arrow-right-CCbb479p.js";import{P as f}from"./x-CdRGQgGm.js";import{P as S}from"./printer-B1cS2pQR.js";import{S as P}from"./square-pen-CaxqXdra.js";import{F as q}from"./file-text-C44SHNS-.js";/* empty css            */import"./createLucideIcon-C1bEwINZ.js";import"./triangle-alert-ClYiaBAM.js";import"./eye-o4wwzghJ.js";import"./shield-CcKx0_Va.js";import"./circle-alert-DqIfKMuv.js";import"./map-pin-1NbsP3rm.js";import"./mail-Bwz1DBCO.js";function te({scaffold:t}){const i=r=>{const d=Number(r);return Number.isFinite(d)?d:0},l=t.contractUsages??[],p=i(t.quantity),j=i(t.availableQuantity),b=t.usedQuantityDifference!=null?i(t.usedQuantityDifference):Math.max(0,p-j),y=t.usedQuantityFromContracts!=null?i(t.usedQuantityFromContracts):l.reduce((r,d)=>r+i(d.quantityUsed),0),u=r=>new Intl.NumberFormat("ar-SA",{style:"currency",currency:"OMR"}).format(r),s=r=>new Intl.NumberFormat("en-US",{useGrouping:!1,maximumFractionDigits:0}).format(r),N=r=>({AVAILABLE:"متوفرة",RENTED:"مستأجرة",SOLD:"مباعة",MAINTENANCE:"تحت الصيانة",RESERVED:"محجوزة"})[r]||r,A=r=>({AVAILABLE:"bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",RENTED:"bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",SOLD:"bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",MAINTENANCE:"bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",RESERVED:"bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"})[r]||"bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";return e.jsxs(T,{children:[e.jsx(C,{title:`تفاصيل المعدة: ${t.scaffoldNumber}`}),e.jsx("style",{children:`
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
      `}),e.jsxs("div",{className:"print-layout-root space-y-6 mt-2 -mx-1 sm:-mx-2 lg:-mx-3 xl:-mx-4 print:mx-0 print:mt-0",children:[e.jsxs("div",{className:"print-report print-container",children:[e.jsx("div",{className:"border border-black rounded-md p-3 mb-3",children:e.jsxs("div",{className:"flex items-start justify-between",children:[e.jsxs("div",{children:[e.jsx("div",{className:"text-lg font-bold text-black",children:"تقرير بيانات المعدة"}),e.jsxs("div",{className:"text-sm text-black",children:["كود الصنف: ",t.scaffoldNumber]}),e.jsx("div",{className:"text-xs text-black",children:t.descriptionAr?t.descriptionAr:"—"})]}),e.jsxs("div",{className:"text-xs text-black",children:["تاريخ الطباعة: ",new Date().toLocaleDateString("ar-SA")]})]})}),e.jsx("table",{className:"print-table",children:e.jsxs("tbody",{children:[e.jsxs("tr",{children:[e.jsx("th",{className:"w-1/4",children:"كود الصنف"}),e.jsx("td",{className:"w-1/4",children:t.scaffoldNumber}),e.jsx("th",{className:"w-1/4",children:"الحالة"}),e.jsx("td",{className:"w-1/4",children:N(t.status)})]}),e.jsx("tr",{children:e.jsx("th",{className:"font-bold",colSpan:4,children:"الكميات"})}),e.jsxs("tr",{children:[e.jsx("th",{children:"إجمالي الكمية"}),e.jsx("td",{colSpan:3,children:s(p)})]}),e.jsxs("tr",{children:[e.jsx("th",{children:"الكمية المستخدمة"}),e.jsx("td",{colSpan:3,children:s(b)})]}),e.jsxs("tr",{children:[e.jsx("th",{children:"الكمية المتاحة"}),e.jsx("td",{colSpan:3,children:s(j)})]}),e.jsx("tr",{children:e.jsx("th",{className:"font-bold",colSpan:4,children:"الوصف"})}),e.jsxs("tr",{children:[e.jsx("th",{children:"الوصف العربي"}),e.jsx("td",{colSpan:3,children:t.descriptionAr||"—"})]}),e.jsxs("tr",{children:[e.jsx("th",{children:"الوصف الإنجليزي"}),e.jsx("td",{colSpan:3,children:t.descriptionEn||"—"})]}),e.jsx("tr",{children:e.jsx("th",{className:"font-bold",colSpan:4,children:"الأسعار"})}),e.jsxs("tr",{children:[e.jsx("th",{children:"الإيجار اليومي"}),e.jsx("td",{children:u(t.dailyRentalPrice)}),e.jsx("th",{children:"الإيجار الشهري"}),e.jsx("td",{children:u(t.monthlyRentalPrice)})]}),e.jsx("tr",{children:e.jsx("th",{className:"font-bold",colSpan:4,children:"الكمية في العقود (جميع الحالات)"})}),e.jsxs("tr",{children:[e.jsx("th",{children:"اسم العقد"}),e.jsx("th",{children:"العميل"}),e.jsx("th",{children:"رقم العقد"}),e.jsx("th",{children:"الكمية المستخدمة"})]}),l.length>0?l.map(r=>e.jsxs("tr",{children:[e.jsx("td",{children:r.contractTitle}),e.jsx("td",{children:r.customerName??"—"}),e.jsx("td",{children:r.contractNumber}),e.jsx("td",{children:s(i(r.quantityUsed))})]},`print-${r.contractId}`)):e.jsx("tr",{children:e.jsx("td",{colSpan:4,children:"لا توجد بنود عقد مرتبطة بهذه المعدة."})}),e.jsxs("tr",{children:[e.jsx("th",{colSpan:3,children:"الإجمالي"}),e.jsx("td",{children:s(y)})]})]})})]}),e.jsxs("div",{className:"inventory-screen space-y-6",children:[e.jsxs("div",{className:"flex items-center justify-between no-print",children:[e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx(h,{variant:"ghost",size:"sm",onClick:()=>k.visit("/inventory"),children:e.jsx(I,{className:"h-4 w-4"})}),e.jsx("div",{children:e.jsxs("h1",{className:"text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2",children:[e.jsx(f,{className:"h-6 w-6"}),"تفاصيل المعدة: ",t.scaffoldNumber]})})]}),e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsxs(h,{variant:"outline",onClick:()=>window.print(),className:"flex items-center gap-2",children:[e.jsx(S,{className:"h-4 w-4"}),"طباعة"]}),e.jsxs(h,{onClick:()=>k.visit(`/inventory/${t.id}/edit`),className:"flex items-center gap-2",children:[e.jsx(P,{className:"h-4 w-4"}),"تعديل"]})]})]}),e.jsxs(c,{children:[e.jsx(x,{children:e.jsxs(m,{className:"flex items-center gap-2",children:[e.jsx(f,{className:"h-5 w-5"}),"المعلومات الأساسية"]})}),e.jsx(o,{className:"pt-0",children:e.jsx("div",{className:"rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden",children:e.jsx(w,{children:e.jsxs(v,{children:[e.jsxs(n,{className:"hover:bg-transparent border-b border-gray-200 dark:border-gray-700",children:[e.jsx(a,{className:"w-[22%] align-middle bg-gray-50 dark:bg-gray-800/80 text-right text-sm font-semibold text-gray-700 dark:text-gray-300",children:"كود الصنف"}),e.jsx(a,{className:"align-middle text-right font-mono text-sm text-gray-900 dark:text-white",children:t.scaffoldNumber}),e.jsx(a,{className:"w-[22%] align-middle bg-gray-50 dark:bg-gray-800/80 text-right text-sm font-semibold text-gray-700 dark:text-gray-300",children:"الحالة"}),e.jsx(a,{className:"align-middle text-right",children:e.jsx("span",{className:`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${A(t.status)}`,children:N(t.status)})})]}),e.jsxs(n,{className:"hover:bg-transparent border-b border-gray-200 dark:border-gray-700",children:[e.jsx(a,{className:"align-middle bg-gray-50 dark:bg-gray-800/80 text-right text-sm font-semibold text-gray-700 dark:text-gray-300",children:"إجمالي الكمية"}),e.jsx(a,{className:"align-middle text-right tabular-nums text-sm font-medium text-gray-900 dark:text-white",colSpan:3,children:s(p)})]}),e.jsxs(n,{className:"hover:bg-transparent border-b border-gray-200 dark:border-gray-700",children:[e.jsx(a,{className:"align-middle bg-gray-50 dark:bg-gray-800/80 text-right text-sm font-semibold text-gray-700 dark:text-gray-300",children:"الكمية المستخدمة"}),e.jsx(a,{className:"align-middle text-right tabular-nums text-sm font-medium text-amber-700 dark:text-amber-300",colSpan:3,children:s(b)})]}),e.jsxs(n,{className:"hover:bg-transparent border-0",children:[e.jsx(a,{className:"align-middle bg-gray-50 dark:bg-gray-800/80 text-right text-sm font-semibold text-gray-700 dark:text-gray-300",children:"الكمية المتاحة"}),e.jsx(a,{className:"align-middle text-right tabular-nums text-sm font-medium text-green-700 dark:text-green-400",colSpan:3,children:s(j)})]})]})})})})]}),e.jsxs(c,{children:[e.jsxs(x,{className:"flex flex-row flex-wrap items-center justify-between gap-3 space-y-0",children:[e.jsxs("div",{className:"space-y-1.5",children:[e.jsxs(m,{className:"flex items-center gap-2 text-base sm:text-lg",children:[e.jsx(q,{className:"h-5 w-5 shrink-0"}),"الكمية المؤجرة (جميع العقود)"]}),e.jsx(R,{className:"text-right text-xs leading-relaxed max-w-xl",children:"يُحسب المجموع من كل بنود العقود المرتبطة بهذه المعدة، لجميع حالات العقد."})]}),l.length>0&&e.jsxs(h,{type:"button",variant:"outline",size:"sm",onClick:()=>window.print(),className:"no-print shrink-0 gap-2",children:[e.jsx(S,{className:"h-4 w-4"}),"طباعة"]})]}),e.jsx(o,{children:l.length===0?e.jsx("p",{className:"text-sm text-gray-600 dark:text-gray-400",children:"لا توجد بنود عقد مرتبطة بهذه المعدة."}):e.jsxs(w,{children:[e.jsx(L,{children:e.jsxs(n,{children:[e.jsx(g,{className:"text-right",children:"اسم العقد"}),e.jsx(g,{className:"text-right",children:"العميل"}),e.jsx(g,{className:"text-right",children:"رقم العقد"}),e.jsx(g,{className:"text-right w-[120px]",children:"الكمية المستخدمة"})]})}),e.jsx(v,{children:l.map(r=>e.jsxs(n,{children:[e.jsx(a,{className:"text-right font-medium",children:r.contractTitle}),e.jsx(a,{className:"text-right text-gray-700 dark:text-gray-300",children:r.customerName??"—"}),e.jsx(a,{className:"text-right",children:e.jsx(E,{href:`/contracts/${r.contractId}`,className:"text-[#58d2c8] hover:underline font-mono",children:r.contractNumber})}),e.jsx(a,{className:"text-right tabular-nums font-medium",children:s(i(r.quantityUsed))})]},r.contractId))}),e.jsx(F,{children:e.jsxs(n,{children:[e.jsx(a,{colSpan:3,className:"text-right font-bold text-gray-900 dark:text-white",children:"الإجمالي"}),e.jsx(a,{className:"text-right tabular-nums font-bold text-gray-900 dark:text-white",children:s(y)})]})})]})})]}),e.jsxs(c,{children:[e.jsx(x,{children:e.jsx(m,{children:"الوصف"})}),e.jsx(o,{children:e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-4",children:[e.jsxs("div",{children:[e.jsx("label",{className:"text-sm font-medium text-gray-600 dark:text-gray-400",children:"الوصف العربي"}),e.jsx("p",{className:"text-sm text-gray-900 dark:text-white",children:t.descriptionAr||"-"})]}),e.jsxs("div",{children:[e.jsx("label",{className:"text-sm font-medium text-gray-600 dark:text-gray-400",children:"الوصف الإنجليزي"}),e.jsx("p",{className:"text-sm text-gray-900 dark:text-white",children:t.descriptionEn||"-"})]})]})})]}),e.jsxs(c,{children:[e.jsx(x,{children:e.jsxs(m,{className:"flex items-center gap-2",children:[e.jsx(D,{className:"h-5 w-5"}),"الأسعار"]})}),e.jsx(o,{children:e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-4",children:[e.jsxs("div",{children:[e.jsx("label",{className:"text-sm font-medium text-gray-600 dark:text-gray-400",children:"الإيجار اليومي"}),e.jsxs("p",{className:"text-sm font-medium text-gray-900 dark:text-white",children:[t.dailyRentalPrice.toLocaleString()," ر.ع"]})]}),e.jsxs("div",{children:[e.jsx("label",{className:"text-sm font-medium text-gray-600 dark:text-gray-400",children:"الإيجار الشهري"}),e.jsxs("p",{className:"text-sm font-medium text-gray-900 dark:text-white",children:[t.monthlyRentalPrice.toLocaleString()," ر.ع"]})]})]})})]})]})]})]})}export{te as default};
