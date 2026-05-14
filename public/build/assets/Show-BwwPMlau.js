import{j as t,H as S,a as y,L as f}from"./app-BbqYRrtx.js";import{D as A,b as E}from"./DashboardLayout-DJ5P0EA3.js";import{C as l,b as d,c,a as x}from"./card-DvbXRIju.js";import{B as m}from"./button-Dsr0qUEF.js";import{T as N,d as u,b as i,e as a,a as L,c as o,f as C}from"./table-BueWSzBj.js";import{A as T}from"./arrow-right-BxogIam7.js";import{P as k}from"./x-NWaNnHCk.js";import{P as w}from"./printer-BC7_dq0z.js";import{S as R}from"./square-pen-BHQO2Vm1.js";import{F as D}from"./file-text-CUfyGn5_.js";/* empty css            */import"./createLucideIcon-dGEXd8re.js";import"./triangle-alert-D1RmiWWL.js";import"./eye-Dbekj9b_.js";import"./shield-CHtq4eX4.js";import"./circle-alert-g4JN0Qnl.js";import"./map-pin-C-IqE7-J.js";import"./mail-Z3pwW2o6.js";function X({scaffold:e}){const s=e.contractUsages??[],g=e.usedQuantityDifference??Math.max(0,e.quantity-e.availableQuantity),p=e.usedQuantityFromContracts??s.reduce((r,h)=>r+h.quantityUsed,0),j=r=>new Intl.NumberFormat("ar-SA",{style:"currency",currency:"OMR"}).format(r),n=r=>r.toLocaleString("en-US"),b=r=>({AVAILABLE:"متوفرة",RENTED:"مستأجرة",SOLD:"مباعة",MAINTENANCE:"تحت الصيانة",RESERVED:"محجوزة"})[r]||r,v=r=>({AVAILABLE:"bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",RENTED:"bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",SOLD:"bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",MAINTENANCE:"bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",RESERVED:"bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"})[r]||"bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";return t.jsxs(A,{children:[t.jsx(S,{title:`تفاصيل المعدة: ${e.scaffoldNumber}`}),t.jsx("style",{children:`
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
      `}),t.jsxs("div",{className:"print-layout-root space-y-6 mt-2 -mx-1 sm:-mx-2 lg:-mx-3 xl:-mx-4 print:mx-0 print:mt-0",children:[t.jsxs("div",{className:"print-report print-container",children:[t.jsx("div",{className:"border border-black rounded-md p-3 mb-3",children:t.jsxs("div",{className:"flex items-start justify-between",children:[t.jsxs("div",{children:[t.jsx("div",{className:"text-lg font-bold text-black",children:"تقرير بيانات المعدة"}),t.jsxs("div",{className:"text-sm text-black",children:["كود الصنف: ",e.scaffoldNumber]}),t.jsx("div",{className:"text-xs text-black",children:e.descriptionAr?e.descriptionAr:"—"})]}),t.jsxs("div",{className:"text-xs text-black",children:["تاريخ الطباعة: ",new Date().toLocaleDateString("ar-SA")]})]})}),t.jsx("table",{className:"print-table",children:t.jsxs("tbody",{children:[t.jsxs("tr",{children:[t.jsx("th",{className:"w-1/4",children:"كود الصنف"}),t.jsx("td",{className:"w-1/4",children:e.scaffoldNumber}),t.jsx("th",{className:"w-1/4",children:"الحالة"}),t.jsx("td",{className:"w-1/4",children:b(e.status)})]}),t.jsx("tr",{children:t.jsx("th",{className:"font-bold",colSpan:4,children:"الكميات"})}),t.jsxs("tr",{children:[t.jsx("th",{children:"الإجمالي"}),t.jsx("td",{children:n(e.quantity)}),t.jsx("th",{children:"المتاح"}),t.jsx("td",{children:n(e.availableQuantity)})]}),t.jsxs("tr",{children:[t.jsx("th",{children:"المستخدم (فرق الكمية)"}),t.jsxs("td",{colSpan:3,children:[n(g)," (الإجمالي − المتاح)"]})]}),t.jsx("tr",{children:t.jsx("th",{className:"font-bold",colSpan:4,children:"الوصف"})}),t.jsxs("tr",{children:[t.jsx("th",{children:"الوصف العربي"}),t.jsx("td",{colSpan:3,children:e.descriptionAr||"—"})]}),t.jsxs("tr",{children:[t.jsx("th",{children:"الوصف الإنجليزي"}),t.jsx("td",{colSpan:3,children:e.descriptionEn||"—"})]}),t.jsx("tr",{children:t.jsx("th",{className:"font-bold",colSpan:4,children:"الأسعار"})}),t.jsxs("tr",{children:[t.jsx("th",{children:"الإيجار اليومي"}),t.jsx("td",{children:j(e.dailyRentalPrice)}),t.jsx("th",{children:"الإيجار الشهري"}),t.jsx("td",{children:j(e.monthlyRentalPrice)})]}),t.jsx("tr",{children:t.jsx("th",{className:"font-bold",colSpan:4,children:"الكمية المستخدمة في العقود"})}),t.jsxs("tr",{children:[t.jsx("th",{children:"اسم العقد"}),t.jsx("th",{children:"العميل"}),t.jsx("th",{children:"رقم العقد"}),t.jsx("th",{children:"الكمية المستخدمة"})]}),s.length>0?s.map(r=>t.jsxs("tr",{children:[t.jsx("td",{children:r.contractTitle}),t.jsx("td",{children:r.customerName??"—"}),t.jsx("td",{children:r.contractNumber}),t.jsx("td",{children:n(r.quantityUsed)})]},`print-${r.contractId}`)):t.jsx("tr",{children:t.jsx("td",{colSpan:4,children:"لا توجد بنود عقد مرتبطة بهذه المعدة حالياً."})}),t.jsxs("tr",{children:[t.jsx("th",{colSpan:3,children:"الإجمالي"}),t.jsx("td",{children:n(p)})]})]})})]}),t.jsxs("div",{className:"inventory-screen space-y-6",children:[t.jsxs("div",{className:"flex items-center justify-between no-print",children:[t.jsxs("div",{className:"flex items-center gap-3",children:[t.jsx(m,{variant:"ghost",size:"sm",onClick:()=>y.visit("/inventory"),children:t.jsx(T,{className:"h-4 w-4"})}),t.jsx("div",{children:t.jsxs("h1",{className:"text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2",children:[t.jsx(k,{className:"h-6 w-6"}),"تفاصيل المعدة: ",e.scaffoldNumber]})})]}),t.jsxs("div",{className:"flex items-center gap-2",children:[t.jsxs(m,{variant:"outline",onClick:()=>window.print(),className:"flex items-center gap-2",children:[t.jsx(w,{className:"h-4 w-4"}),"طباعة"]}),t.jsxs(m,{onClick:()=>y.visit(`/inventory/${e.id}/edit`),className:"flex items-center gap-2",children:[t.jsx(R,{className:"h-4 w-4"}),"تعديل"]})]})]}),t.jsxs(l,{children:[t.jsx(d,{children:t.jsxs(c,{className:"flex items-center gap-2",children:[t.jsx(k,{className:"h-5 w-5"}),"المعلومات الأساسية"]})}),t.jsx(x,{className:"pt-0",children:t.jsx("div",{className:"rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden",children:t.jsx(N,{children:t.jsxs(u,{children:[t.jsxs(i,{className:"hover:bg-transparent border-b border-gray-200 dark:border-gray-700",children:[t.jsx(a,{className:"w-[22%] align-middle bg-gray-50 dark:bg-gray-800/80 text-right text-sm font-semibold text-gray-700 dark:text-gray-300",children:"كود الصنف"}),t.jsx(a,{className:"align-middle text-right font-mono text-sm text-gray-900 dark:text-white",children:e.scaffoldNumber}),t.jsx(a,{className:"w-[22%] align-middle bg-gray-50 dark:bg-gray-800/80 text-right text-sm font-semibold text-gray-700 dark:text-gray-300",children:"الحالة"}),t.jsx(a,{className:"align-middle text-right",children:t.jsx("span",{className:`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${v(e.status)}`,children:b(e.status)})})]}),t.jsxs(i,{className:"hover:bg-transparent border-b border-gray-200 dark:border-gray-700",children:[t.jsx(a,{className:"align-middle bg-gray-50 dark:bg-gray-800/80 text-right text-sm font-semibold text-gray-700 dark:text-gray-300",children:"إجمالي الكمية"}),t.jsx(a,{className:"align-middle text-right tabular-nums text-sm font-medium text-gray-900 dark:text-white",children:e.quantity.toLocaleString("en-US")}),t.jsx(a,{className:"align-middle bg-gray-50 dark:bg-gray-800/80 text-right text-sm font-semibold text-gray-700 dark:text-gray-300",children:"الكمية المتاحة"}),t.jsx(a,{className:"align-middle text-right tabular-nums text-sm font-medium text-green-700 dark:text-green-400",children:e.availableQuantity.toLocaleString("en-US")})]}),t.jsxs(i,{className:"hover:bg-transparent border-0",children:[t.jsx(a,{className:"align-middle bg-gray-50 dark:bg-gray-800/80 text-right text-sm font-semibold text-gray-700 dark:text-gray-300",children:"المستخدم (فرق الكمية)"}),t.jsxs(a,{className:"align-middle text-right text-sm text-gray-900 dark:text-white",colSpan:3,children:[t.jsx("span",{className:"tabular-nums font-semibold text-amber-700 dark:text-amber-300",children:g.toLocaleString("en-US")}),t.jsx("span",{className:"text-gray-500 dark:text-gray-400 text-xs mr-2",children:"(الإجمالي − المتاح)"})]})]})]})})})})]}),t.jsxs(l,{children:[t.jsxs(d,{className:"flex flex-row flex-wrap items-center justify-between gap-3 space-y-0",children:[t.jsxs(c,{className:"flex items-center gap-2 text-base sm:text-lg",children:[t.jsx(D,{className:"h-5 w-5 shrink-0"}),"الكمية المستخدمة في العقود"]}),s.length>0&&t.jsxs(m,{type:"button",variant:"outline",size:"sm",onClick:()=>window.print(),className:"no-print shrink-0 gap-2",children:[t.jsx(w,{className:"h-4 w-4"}),"طباعة"]})]}),t.jsx(x,{children:s.length===0?t.jsx("p",{className:"text-sm text-gray-600 dark:text-gray-400",children:"لا توجد بنود عقد مرتبطة بهذه المعدة حالياً."}):t.jsxs(N,{children:[t.jsx(L,{children:t.jsxs(i,{children:[t.jsx(o,{className:"text-right",children:"اسم العقد"}),t.jsx(o,{className:"text-right",children:"العميل"}),t.jsx(o,{className:"text-right",children:"رقم العقد"}),t.jsx(o,{className:"text-right w-[120px]",children:"الكمية المستخدمة"})]})}),t.jsx(u,{children:s.map(r=>t.jsxs(i,{children:[t.jsx(a,{className:"text-right font-medium",children:r.contractTitle}),t.jsx(a,{className:"text-right text-gray-700 dark:text-gray-300",children:r.customerName??"—"}),t.jsx(a,{className:"text-right",children:t.jsx(f,{href:`/contracts/${r.contractId}`,className:"text-[#58d2c8] hover:underline font-mono",children:r.contractNumber})}),t.jsx(a,{className:"text-right tabular-nums font-medium",children:r.quantityUsed.toLocaleString("en-US")})]},r.contractId))}),t.jsx(C,{children:t.jsxs(i,{children:[t.jsx(a,{colSpan:3,className:"text-right font-bold text-gray-900 dark:text-white",children:"الإجمالي"}),t.jsx(a,{className:"text-right tabular-nums font-bold text-gray-900 dark:text-white",children:p.toLocaleString("en-US")})]})})]})})]}),t.jsxs(l,{children:[t.jsx(d,{children:t.jsx(c,{children:"الوصف"})}),t.jsx(x,{children:t.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-4",children:[t.jsxs("div",{children:[t.jsx("label",{className:"text-sm font-medium text-gray-600 dark:text-gray-400",children:"الوصف العربي"}),t.jsx("p",{className:"text-sm text-gray-900 dark:text-white",children:e.descriptionAr||"-"})]}),t.jsxs("div",{children:[t.jsx("label",{className:"text-sm font-medium text-gray-600 dark:text-gray-400",children:"الوصف الإنجليزي"}),t.jsx("p",{className:"text-sm text-gray-900 dark:text-white",children:e.descriptionEn||"-"})]})]})})]}),t.jsxs(l,{children:[t.jsx(d,{children:t.jsxs(c,{className:"flex items-center gap-2",children:[t.jsx(E,{className:"h-5 w-5"}),"الأسعار"]})}),t.jsx(x,{children:t.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-4",children:[t.jsxs("div",{children:[t.jsx("label",{className:"text-sm font-medium text-gray-600 dark:text-gray-400",children:"الإيجار اليومي"}),t.jsxs("p",{className:"text-sm font-medium text-gray-900 dark:text-white",children:[e.dailyRentalPrice.toLocaleString()," ر.ع"]})]}),t.jsxs("div",{children:[t.jsx("label",{className:"text-sm font-medium text-gray-600 dark:text-gray-400",children:"الإيجار الشهري"}),t.jsxs("p",{className:"text-sm font-medium text-gray-900 dark:text-white",children:[e.monthlyRentalPrice.toLocaleString()," ر.ع"]})]})]})})]})]})]})]})}export{X as default};
