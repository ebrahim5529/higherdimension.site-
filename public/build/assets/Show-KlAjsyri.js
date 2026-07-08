import{u as T,r as R,j as e,H as P,a as f,L as I}from"./app-BRrJ3CdV.js";import{D as O,b as F}from"./DashboardLayout-Bwzne5V9.js";import{s as w}from"./use-toast-Bwn3B4HT.js";import{C as m,b as o,c as h,a as g,d as q}from"./card-Dbed2lD6.js";import{B as p}from"./button-MxZB0I61.js";import{T as v,d as S,b as l,e as s,a as z,c as x,f as V}from"./table-BkO5Qm9j.js";import{A as _}from"./arrow-left-C4hZRcbH.js";import{P as C}from"./x--ywqLEwp.js";import{P as D}from"./printer-a1VclMRq.js";import{S as U}from"./square-pen-Dtta7sC3.js";import{F as M}from"./file-text-CaQ4QP-O.js";/* empty css            */import"./createLucideIcon-CBX3S45X.js";import"./triangle-alert-DV8hH9lH.js";import"./eye-vWP_Cx7N.js";import"./shield-Fi1LtIWx.js";import"./circle-alert-D2ZYTkYp.js";import"./map-pin-DV0zeeAX.js";import"./mail-BmfIO7bn.js";function de({scaffold:r}){const{flash:c}=T().props;R.useEffect(()=>{c?.success&&w.success("نجح",c.success),c?.error&&w.error("خطأ",c.error)},[c]);const n=t=>{const i=Number(t);return Number.isFinite(i)?i:0},d=r.contractUsages??[],j=n(r.quantity),b=n(r.availableQuantity),u=r.usedQuantityDifference!=null?n(r.usedQuantityDifference):Math.max(0,j-b),y=r.usedQuantityFromContracts!=null?n(r.usedQuantityFromContracts):d.reduce((t,i)=>t+n(i.quantityUsed),0),N=t=>new Intl.NumberFormat("ar-SA",{style:"currency",currency:"OMR"}).format(t),a=t=>new Intl.NumberFormat("en-US",{useGrouping:!1,maximumFractionDigits:0}).format(t),k=t=>({AVAILABLE:"متوفرة",RENTED:"مستأجرة",SOLD:"مباعة",MAINTENANCE:"تحت الصيانة",RESERVED:"محجوزة"})[t]||t,L=t=>({AVAILABLE:"bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",RENTED:"bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",SOLD:"bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",MAINTENANCE:"bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",RESERVED:"bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"})[t]||"bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",E=t=>({ACTIVE:"مفتوح",OPEN:"مفتوح",CLOSED:"مغلق",COMPLETED:"مغلق",RENTAL_CLOSED:"مغلق",EXPIRED:"مغلق",CANCELLED:"مغلق",CLOSED_NOT_RECEIVED:"مغلق ولم يتم الاستلام"})[t]||t,A=t=>{switch(t){case"ACTIVE":case"OPEN":return"bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";case"CLOSED":case"COMPLETED":case"RENTAL_CLOSED":case"EXPIRED":case"CANCELLED":return"bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";case"CLOSED_NOT_RECEIVED":return"bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200";default:return"bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"}};return e.jsxs(O,{children:[e.jsx(P,{title:`تفاصيل المعدة: ${r.scaffoldNumber}`}),e.jsx("style",{children:`
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
      `}),e.jsxs("div",{className:"print-layout-root space-y-6 mt-2 -mx-1 sm:-mx-2 lg:-mx-3 xl:-mx-4 print:mx-0 print:mt-0",children:[e.jsxs("div",{className:"print-report print-container",children:[e.jsx("div",{className:"border border-black rounded-md p-3 mb-3",children:e.jsxs("div",{className:"flex items-start justify-between",children:[e.jsxs("div",{children:[e.jsx("div",{className:"text-lg font-bold text-black",children:"تقرير بيانات المعدة"}),e.jsxs("div",{className:"text-sm text-black",children:["كود الصنف: ",r.scaffoldNumber]}),e.jsx("div",{className:"text-xs text-black",children:r.descriptionAr?r.descriptionAr:"—"})]}),e.jsxs("div",{className:"text-xs text-black",children:["تاريخ الطباعة: ",new Date().toLocaleDateString("ar-SA")]})]})}),e.jsx("table",{className:"print-table",children:e.jsxs("tbody",{children:[e.jsxs("tr",{children:[e.jsx("th",{className:"w-1/4",children:"كود الصنف"}),e.jsx("td",{className:"w-1/4",children:r.scaffoldNumber}),e.jsx("th",{className:"w-1/4",children:"الحالة"}),e.jsx("td",{className:"w-1/4",children:k(r.status)})]}),e.jsx("tr",{children:e.jsx("th",{className:"font-bold",colSpan:4,children:"الكميات"})}),e.jsxs("tr",{children:[e.jsx("th",{children:"إجمالي الكمية"}),e.jsx("td",{colSpan:3,children:a(j)})]}),e.jsxs("tr",{children:[e.jsx("th",{children:"الكمية المستخدمة"}),e.jsx("td",{colSpan:3,children:a(u)})]}),e.jsxs("tr",{children:[e.jsx("th",{children:"الكمية المتاحة"}),e.jsx("td",{colSpan:3,children:a(b)})]}),e.jsx("tr",{children:e.jsx("th",{className:"font-bold",colSpan:4,children:"الوصف"})}),e.jsxs("tr",{children:[e.jsx("th",{children:"الوصف العربي"}),e.jsx("td",{colSpan:3,children:r.descriptionAr||"—"})]}),e.jsxs("tr",{children:[e.jsx("th",{children:"الوصف الإنجليزي"}),e.jsx("td",{colSpan:3,children:r.descriptionEn||"—"})]}),e.jsx("tr",{children:e.jsx("th",{className:"font-bold",colSpan:4,children:"الأسعار"})}),e.jsxs("tr",{children:[e.jsx("th",{children:"الإيجار اليومي"}),e.jsx("td",{children:N(r.dailyRentalPrice)}),e.jsx("th",{children:"الإيجار الشهري"}),e.jsx("td",{children:N(r.monthlyRentalPrice)})]}),e.jsx("tr",{children:e.jsx("th",{className:"font-bold",colSpan:5,children:"الكمية في العقود (جميع الحالات)"})}),e.jsxs("tr",{children:[e.jsx("th",{children:"اسم العقد"}),e.jsx("th",{children:"العميل"}),e.jsx("th",{children:"رقم العقد"}),e.jsx("th",{children:"حالة العقد"}),e.jsx("th",{children:"الكمية المستخدمة"})]}),d.length>0?d.map(t=>e.jsxs("tr",{children:[e.jsx("td",{children:t.contractTitle}),e.jsx("td",{children:t.customerName??"—"}),e.jsx("td",{children:t.contractNumber}),e.jsx("td",{children:E(t.contractStatus)}),e.jsx("td",{children:a(n(t.quantityUsed))})]},`print-${t.contractId}`)):e.jsx("tr",{children:e.jsx("td",{colSpan:5,children:"لا توجد بنود عقد مرتبطة بهذه المعدة."})}),e.jsxs("tr",{children:[e.jsx("th",{colSpan:4,children:"الإجمالي"}),e.jsx("td",{children:a(y)})]})]})})]}),e.jsxs("div",{className:"inventory-screen space-y-6",children:[e.jsxs("div",{className:"flex items-center justify-between no-print",children:[e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx(p,{variant:"ghost",size:"sm",onClick:()=>f.visit("/inventory"),children:e.jsx(_,{className:"h-4 w-4"})}),e.jsx("div",{children:e.jsxs("h1",{className:"text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2",children:[e.jsx(C,{className:"h-6 w-6"}),"تفاصيل المعدة: ",r.scaffoldNumber]})})]}),e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsxs(p,{variant:"outline",onClick:()=>window.print(),className:"flex items-center gap-2",children:[e.jsx(D,{className:"h-4 w-4"}),"طباعة"]}),e.jsxs(p,{onClick:()=>f.visit(`/inventory/${r.id}/edit`),className:"flex items-center gap-2",children:[e.jsx(U,{className:"h-4 w-4"}),"تعديل"]})]})]}),e.jsxs(m,{children:[e.jsx(o,{children:e.jsxs(h,{className:"flex items-center gap-2",children:[e.jsx(C,{className:"h-5 w-5"}),"المعلومات الأساسية"]})}),e.jsx(g,{className:"pt-0",children:e.jsx("div",{className:"rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden",children:e.jsx(v,{children:e.jsxs(S,{children:[e.jsxs(l,{className:"hover:bg-transparent border-b border-gray-200 dark:border-gray-700",children:[e.jsx(s,{className:"w-[22%] align-middle bg-gray-50 dark:bg-gray-800/80 text-right text-sm font-semibold text-gray-700 dark:text-gray-300",children:"كود الصنف"}),e.jsx(s,{className:"align-middle text-right font-mono text-sm text-gray-900 dark:text-white",children:r.scaffoldNumber}),e.jsx(s,{className:"w-[22%] align-middle bg-gray-50 dark:bg-gray-800/80 text-right text-sm font-semibold text-gray-700 dark:text-gray-300",children:"الحالة"}),e.jsx(s,{className:"align-middle text-right",children:e.jsx("span",{className:`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${L(r.status)}`,children:k(r.status)})})]}),e.jsxs(l,{className:"hover:bg-transparent border-b border-gray-200 dark:border-gray-700",children:[e.jsx(s,{className:"align-middle bg-gray-50 dark:bg-gray-800/80 text-right text-sm font-semibold text-gray-700 dark:text-gray-300",children:"إجمالي الكمية"}),e.jsx(s,{className:"align-middle text-right tabular-nums text-sm font-medium text-gray-900 dark:text-white",colSpan:3,children:a(j)})]}),e.jsxs(l,{className:"hover:bg-transparent border-b border-gray-200 dark:border-gray-700",children:[e.jsx(s,{className:"align-middle bg-gray-50 dark:bg-gray-800/80 text-right text-sm font-semibold text-gray-700 dark:text-gray-300",children:"الكمية المستخدمة"}),e.jsx(s,{className:"align-middle text-right tabular-nums text-sm font-medium text-amber-700 dark:text-amber-300",colSpan:3,children:a(u)})]}),e.jsxs(l,{className:"hover:bg-transparent border-0",children:[e.jsx(s,{className:"align-middle bg-gray-50 dark:bg-gray-800/80 text-right text-sm font-semibold text-gray-700 dark:text-gray-300",children:"الكمية المتاحة"}),e.jsx(s,{className:"align-middle text-right tabular-nums text-sm font-medium text-green-700 dark:text-green-400",colSpan:3,children:a(b)})]})]})})})})]}),e.jsxs(m,{children:[e.jsxs(o,{className:"flex flex-row flex-wrap items-center justify-between gap-3 space-y-0",children:[e.jsxs("div",{className:"space-y-1.5",children:[e.jsxs(h,{className:"flex items-center gap-2 text-base sm:text-lg",children:[e.jsx(M,{className:"h-5 w-5 shrink-0"}),"الكمية المؤجرة (جميع العقود)"]}),e.jsx(q,{className:"text-right text-xs leading-relaxed max-w-xl",children:"العقود «مغلقة ولم يتم الاستلام» والعقود المفتوحة تُخصم من الكمية المتاحة. العقود المغلقة (بعد الاستلام) لا تُخصم."})]}),d.length>0&&e.jsxs(p,{type:"button",variant:"outline",size:"sm",onClick:()=>window.print(),className:"no-print shrink-0 gap-2",children:[e.jsx(D,{className:"h-4 w-4"}),"طباعة"]})]}),e.jsx(g,{children:d.length===0?e.jsx("p",{className:"text-sm text-gray-600 dark:text-gray-400",children:"لا توجد بنود عقد مرتبطة بهذه المعدة."}):e.jsxs(v,{children:[e.jsx(z,{children:e.jsxs(l,{children:[e.jsx(x,{className:"text-right",children:"اسم العقد"}),e.jsx(x,{className:"text-right",children:"العميل"}),e.jsx(x,{className:"text-right",children:"رقم العقد"}),e.jsx(x,{className:"text-right w-[150px]",children:"حالة العقد"}),e.jsx(x,{className:"text-right w-[120px]",children:"الكمية المستخدمة"})]})}),e.jsx(S,{children:d.map(t=>e.jsxs(l,{children:[e.jsx(s,{className:"text-right font-medium",children:t.contractTitle}),e.jsx(s,{className:"text-right text-gray-700 dark:text-gray-300",children:t.customerName??"—"}),e.jsx(s,{className:"text-right",children:e.jsx(I,{href:`/contracts/${t.contractId}`,className:"text-[#58d2c8] hover:underline font-mono",children:t.contractNumber})}),e.jsx(s,{className:"text-right",children:e.jsx("span",{className:`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${A(t.contractStatus)}`,children:E(t.contractStatus)})}),e.jsx(s,{className:"text-right tabular-nums font-medium",children:a(n(t.quantityUsed))})]},t.contractId))}),e.jsx(V,{children:e.jsxs(l,{children:[e.jsx(s,{colSpan:4,className:"text-right font-bold text-gray-900 dark:text-white",children:"الإجمالي"}),e.jsx(s,{className:"text-right tabular-nums font-bold text-gray-900 dark:text-white",children:a(y)})]})})]})})]}),e.jsxs(m,{children:[e.jsx(o,{children:e.jsx(h,{children:"الوصف"})}),e.jsx(g,{children:e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-4",children:[e.jsxs("div",{children:[e.jsx("label",{className:"text-sm font-medium text-gray-600 dark:text-gray-400",children:"الوصف العربي"}),e.jsx("p",{className:"text-sm text-gray-900 dark:text-white",children:r.descriptionAr||"-"})]}),e.jsxs("div",{children:[e.jsx("label",{className:"text-sm font-medium text-gray-600 dark:text-gray-400",children:"الوصف الإنجليزي"}),e.jsx("p",{className:"text-sm text-gray-900 dark:text-white",children:r.descriptionEn||"-"})]})]})})]}),e.jsxs(m,{children:[e.jsx(o,{children:e.jsxs(h,{className:"flex items-center gap-2",children:[e.jsx(F,{className:"h-5 w-5"}),"الأسعار"]})}),e.jsx(g,{children:e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-4",children:[e.jsxs("div",{children:[e.jsx("label",{className:"text-sm font-medium text-gray-600 dark:text-gray-400",children:"الإيجار اليومي"}),e.jsxs("p",{className:"text-sm font-medium text-gray-900 dark:text-white",children:[r.dailyRentalPrice.toLocaleString()," ر.ع"]})]}),e.jsxs("div",{children:[e.jsx("label",{className:"text-sm font-medium text-gray-600 dark:text-gray-400",children:"الإيجار الشهري"}),e.jsxs("p",{className:"text-sm font-medium text-gray-900 dark:text-white",children:[r.monthlyRentalPrice.toLocaleString()," ر.ع"]})]})]})})]})]})]})]})}export{de as default};
