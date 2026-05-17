import{j as e,H as L,a as E,L as A}from"./app-D3xxVui2.js";import{D as T,b as R}from"./DashboardLayout-DYWdkKkZ.js";import{C as x,b as m,c as o,a as h,d as I}from"./card-C2kFP0K6.js";import{B as g}from"./button-Cl78x0Ad.js";import{T as w,d as v,b as l,e as a,a as O,c,f as P}from"./table-DLVzdLQZ.js";import{A as F}from"./arrow-right-LWDpIIb-.js";import{P as S}from"./x-t75AqXGl.js";import{P as f}from"./printer-DBBhRexE.js";import{S as q}from"./square-pen-pl76IffP.js";import{F as z}from"./file-text-Dvz8emKO.js";/* empty css            */import"./createLucideIcon-CSZUwRNW.js";import"./triangle-alert-DcG8QJQY.js";import"./eye-BvEgfRG-.js";import"./shield-DiN7iMlP.js";import"./circle-alert-CMhyh2vb.js";import"./map-pin-CZBwbbms.js";import"./mail-DnICIMxN.js";function ae({scaffold:r}){const n=t=>{const i=Number(t);return Number.isFinite(i)?i:0},d=r.contractUsages??[],p=n(r.quantity),j=n(r.availableQuantity),b=r.usedQuantityDifference!=null?n(r.usedQuantityDifference):Math.max(0,p-j),u=r.usedQuantityFromContracts!=null?n(r.usedQuantityFromContracts):d.reduce((t,i)=>t+n(i.quantityUsed),0),y=t=>new Intl.NumberFormat("ar-SA",{style:"currency",currency:"OMR"}).format(t),s=t=>new Intl.NumberFormat("en-US",{useGrouping:!1,maximumFractionDigits:0}).format(t),N=t=>({AVAILABLE:"متوفرة",RENTED:"مستأجرة",SOLD:"مباعة",MAINTENANCE:"تحت الصيانة",RESERVED:"محجوزة"})[t]||t,C=t=>({AVAILABLE:"bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",RENTED:"bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",SOLD:"bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",MAINTENANCE:"bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",RESERVED:"bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"})[t]||"bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",k=t=>({ACTIVE:"مفتوح",OPEN:"مفتوح",CLOSED:"مغلق",COMPLETED:"مغلق",RENTAL_CLOSED:"مغلق",EXPIRED:"مغلق",CANCELLED:"مغلق",CLOSED_NOT_RECEIVED:"مغلق ولم يتم الاستلام"})[t]||t,D=t=>{switch(t){case"ACTIVE":case"OPEN":return"bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";case"CLOSED":case"COMPLETED":case"RENTAL_CLOSED":case"EXPIRED":case"CANCELLED":return"bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";case"CLOSED_NOT_RECEIVED":return"bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200";default:return"bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"}};return e.jsxs(T,{children:[e.jsx(L,{title:`تفاصيل المعدة: ${r.scaffoldNumber}`}),e.jsx("style",{children:`
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
      `}),e.jsxs("div",{className:"print-layout-root space-y-6 mt-2 -mx-1 sm:-mx-2 lg:-mx-3 xl:-mx-4 print:mx-0 print:mt-0",children:[e.jsxs("div",{className:"print-report print-container",children:[e.jsx("div",{className:"border border-black rounded-md p-3 mb-3",children:e.jsxs("div",{className:"flex items-start justify-between",children:[e.jsxs("div",{children:[e.jsx("div",{className:"text-lg font-bold text-black",children:"تقرير بيانات المعدة"}),e.jsxs("div",{className:"text-sm text-black",children:["كود الصنف: ",r.scaffoldNumber]}),e.jsx("div",{className:"text-xs text-black",children:r.descriptionAr?r.descriptionAr:"—"})]}),e.jsxs("div",{className:"text-xs text-black",children:["تاريخ الطباعة: ",new Date().toLocaleDateString("ar-SA")]})]})}),e.jsx("table",{className:"print-table",children:e.jsxs("tbody",{children:[e.jsxs("tr",{children:[e.jsx("th",{className:"w-1/4",children:"كود الصنف"}),e.jsx("td",{className:"w-1/4",children:r.scaffoldNumber}),e.jsx("th",{className:"w-1/4",children:"الحالة"}),e.jsx("td",{className:"w-1/4",children:N(r.status)})]}),e.jsx("tr",{children:e.jsx("th",{className:"font-bold",colSpan:4,children:"الكميات"})}),e.jsxs("tr",{children:[e.jsx("th",{children:"إجمالي الكمية"}),e.jsx("td",{colSpan:3,children:s(p)})]}),e.jsxs("tr",{children:[e.jsx("th",{children:"الكمية المستخدمة"}),e.jsx("td",{colSpan:3,children:s(b)})]}),e.jsxs("tr",{children:[e.jsx("th",{children:"الكمية المتاحة"}),e.jsx("td",{colSpan:3,children:s(j)})]}),e.jsx("tr",{children:e.jsx("th",{className:"font-bold",colSpan:4,children:"الوصف"})}),e.jsxs("tr",{children:[e.jsx("th",{children:"الوصف العربي"}),e.jsx("td",{colSpan:3,children:r.descriptionAr||"—"})]}),e.jsxs("tr",{children:[e.jsx("th",{children:"الوصف الإنجليزي"}),e.jsx("td",{colSpan:3,children:r.descriptionEn||"—"})]}),e.jsx("tr",{children:e.jsx("th",{className:"font-bold",colSpan:4,children:"الأسعار"})}),e.jsxs("tr",{children:[e.jsx("th",{children:"الإيجار اليومي"}),e.jsx("td",{children:y(r.dailyRentalPrice)}),e.jsx("th",{children:"الإيجار الشهري"}),e.jsx("td",{children:y(r.monthlyRentalPrice)})]}),e.jsx("tr",{children:e.jsx("th",{className:"font-bold",colSpan:5,children:"الكمية في العقود (جميع الحالات)"})}),e.jsxs("tr",{children:[e.jsx("th",{children:"اسم العقد"}),e.jsx("th",{children:"العميل"}),e.jsx("th",{children:"رقم العقد"}),e.jsx("th",{children:"حالة العقد"}),e.jsx("th",{children:"الكمية المستخدمة"})]}),d.length>0?d.map(t=>e.jsxs("tr",{children:[e.jsx("td",{children:t.contractTitle}),e.jsx("td",{children:t.customerName??"—"}),e.jsx("td",{children:t.contractNumber}),e.jsx("td",{children:k(t.contractStatus)}),e.jsx("td",{children:s(n(t.quantityUsed))})]},`print-${t.contractId}`)):e.jsx("tr",{children:e.jsx("td",{colSpan:5,children:"لا توجد بنود عقد مرتبطة بهذه المعدة."})}),e.jsxs("tr",{children:[e.jsx("th",{colSpan:4,children:"الإجمالي"}),e.jsx("td",{children:s(u)})]})]})})]}),e.jsxs("div",{className:"inventory-screen space-y-6",children:[e.jsxs("div",{className:"flex items-center justify-between no-print",children:[e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx(g,{variant:"ghost",size:"sm",onClick:()=>E.visit("/inventory"),children:e.jsx(F,{className:"h-4 w-4"})}),e.jsx("div",{children:e.jsxs("h1",{className:"text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2",children:[e.jsx(S,{className:"h-6 w-6"}),"تفاصيل المعدة: ",r.scaffoldNumber]})})]}),e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsxs(g,{variant:"outline",onClick:()=>window.print(),className:"flex items-center gap-2",children:[e.jsx(f,{className:"h-4 w-4"}),"طباعة"]}),e.jsxs(g,{onClick:()=>E.visit(`/inventory/${r.id}/edit`),className:"flex items-center gap-2",children:[e.jsx(q,{className:"h-4 w-4"}),"تعديل"]})]})]}),e.jsxs(x,{children:[e.jsx(m,{children:e.jsxs(o,{className:"flex items-center gap-2",children:[e.jsx(S,{className:"h-5 w-5"}),"المعلومات الأساسية"]})}),e.jsx(h,{className:"pt-0",children:e.jsx("div",{className:"rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden",children:e.jsx(w,{children:e.jsxs(v,{children:[e.jsxs(l,{className:"hover:bg-transparent border-b border-gray-200 dark:border-gray-700",children:[e.jsx(a,{className:"w-[22%] align-middle bg-gray-50 dark:bg-gray-800/80 text-right text-sm font-semibold text-gray-700 dark:text-gray-300",children:"كود الصنف"}),e.jsx(a,{className:"align-middle text-right font-mono text-sm text-gray-900 dark:text-white",children:r.scaffoldNumber}),e.jsx(a,{className:"w-[22%] align-middle bg-gray-50 dark:bg-gray-800/80 text-right text-sm font-semibold text-gray-700 dark:text-gray-300",children:"الحالة"}),e.jsx(a,{className:"align-middle text-right",children:e.jsx("span",{className:`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${C(r.status)}`,children:N(r.status)})})]}),e.jsxs(l,{className:"hover:bg-transparent border-b border-gray-200 dark:border-gray-700",children:[e.jsx(a,{className:"align-middle bg-gray-50 dark:bg-gray-800/80 text-right text-sm font-semibold text-gray-700 dark:text-gray-300",children:"إجمالي الكمية"}),e.jsx(a,{className:"align-middle text-right tabular-nums text-sm font-medium text-gray-900 dark:text-white",colSpan:3,children:s(p)})]}),e.jsxs(l,{className:"hover:bg-transparent border-b border-gray-200 dark:border-gray-700",children:[e.jsx(a,{className:"align-middle bg-gray-50 dark:bg-gray-800/80 text-right text-sm font-semibold text-gray-700 dark:text-gray-300",children:"الكمية المستخدمة"}),e.jsx(a,{className:"align-middle text-right tabular-nums text-sm font-medium text-amber-700 dark:text-amber-300",colSpan:3,children:s(b)})]}),e.jsxs(l,{className:"hover:bg-transparent border-0",children:[e.jsx(a,{className:"align-middle bg-gray-50 dark:bg-gray-800/80 text-right text-sm font-semibold text-gray-700 dark:text-gray-300",children:"الكمية المتاحة"}),e.jsx(a,{className:"align-middle text-right tabular-nums text-sm font-medium text-green-700 dark:text-green-400",colSpan:3,children:s(j)})]})]})})})})]}),e.jsxs(x,{children:[e.jsxs(m,{className:"flex flex-row flex-wrap items-center justify-between gap-3 space-y-0",children:[e.jsxs("div",{className:"space-y-1.5",children:[e.jsxs(o,{className:"flex items-center gap-2 text-base sm:text-lg",children:[e.jsx(z,{className:"h-5 w-5 shrink-0"}),"الكمية المؤجرة (جميع العقود)"]}),e.jsx(I,{className:"text-right text-xs leading-relaxed max-w-xl",children:"يُحسب المجموع من كل بنود العقود المرتبطة بهذه المعدة، لجميع حالات العقد."})]}),d.length>0&&e.jsxs(g,{type:"button",variant:"outline",size:"sm",onClick:()=>window.print(),className:"no-print shrink-0 gap-2",children:[e.jsx(f,{className:"h-4 w-4"}),"طباعة"]})]}),e.jsx(h,{children:d.length===0?e.jsx("p",{className:"text-sm text-gray-600 dark:text-gray-400",children:"لا توجد بنود عقد مرتبطة بهذه المعدة."}):e.jsxs(w,{children:[e.jsx(O,{children:e.jsxs(l,{children:[e.jsx(c,{className:"text-right",children:"اسم العقد"}),e.jsx(c,{className:"text-right",children:"العميل"}),e.jsx(c,{className:"text-right",children:"رقم العقد"}),e.jsx(c,{className:"text-right w-[150px]",children:"حالة العقد"}),e.jsx(c,{className:"text-right w-[120px]",children:"الكمية المستخدمة"})]})}),e.jsx(v,{children:d.map(t=>e.jsxs(l,{children:[e.jsx(a,{className:"text-right font-medium",children:t.contractTitle}),e.jsx(a,{className:"text-right text-gray-700 dark:text-gray-300",children:t.customerName??"—"}),e.jsx(a,{className:"text-right",children:e.jsx(A,{href:`/contracts/${t.contractId}`,className:"text-[#58d2c8] hover:underline font-mono",children:t.contractNumber})}),e.jsx(a,{className:"text-right",children:e.jsx("span",{className:`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${D(t.contractStatus)}`,children:k(t.contractStatus)})}),e.jsx(a,{className:"text-right tabular-nums font-medium",children:s(n(t.quantityUsed))})]},t.contractId))}),e.jsx(P,{children:e.jsxs(l,{children:[e.jsx(a,{colSpan:4,className:"text-right font-bold text-gray-900 dark:text-white",children:"الإجمالي"}),e.jsx(a,{className:"text-right tabular-nums font-bold text-gray-900 dark:text-white",children:s(u)})]})})]})})]}),e.jsxs(x,{children:[e.jsx(m,{children:e.jsx(o,{children:"الوصف"})}),e.jsx(h,{children:e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-4",children:[e.jsxs("div",{children:[e.jsx("label",{className:"text-sm font-medium text-gray-600 dark:text-gray-400",children:"الوصف العربي"}),e.jsx("p",{className:"text-sm text-gray-900 dark:text-white",children:r.descriptionAr||"-"})]}),e.jsxs("div",{children:[e.jsx("label",{className:"text-sm font-medium text-gray-600 dark:text-gray-400",children:"الوصف الإنجليزي"}),e.jsx("p",{className:"text-sm text-gray-900 dark:text-white",children:r.descriptionEn||"-"})]})]})})]}),e.jsxs(x,{children:[e.jsx(m,{children:e.jsxs(o,{className:"flex items-center gap-2",children:[e.jsx(R,{className:"h-5 w-5"}),"الأسعار"]})}),e.jsx(h,{children:e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-4",children:[e.jsxs("div",{children:[e.jsx("label",{className:"text-sm font-medium text-gray-600 dark:text-gray-400",children:"الإيجار اليومي"}),e.jsxs("p",{className:"text-sm font-medium text-gray-900 dark:text-white",children:[r.dailyRentalPrice.toLocaleString()," ر.ع"]})]}),e.jsxs("div",{children:[e.jsx("label",{className:"text-sm font-medium text-gray-600 dark:text-gray-400",children:"الإيجار الشهري"}),e.jsxs("p",{className:"text-sm font-medium text-gray-900 dark:text-white",children:[r.monthlyRentalPrice.toLocaleString()," ر.ع"]})]})]})})]})]})]})]})}export{ae as default};
