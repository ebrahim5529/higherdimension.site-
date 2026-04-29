import{j as e,r as l,H as D,a as F}from"./app-D-bdmIQv.js";import{B as $,a as I}from"./button-Bif1CSro.js";import{P as U}from"./printer-D_I41N7Y.js";import{D as H}from"./DigitalSignature-UaWraa8x.js";import{s as b}from"./use-toast-0ss-k3Db.js";import{F as u}from"./file-text-sY_FB8QW.js";import{C as j}from"./check-CFlE4kGU.js";import{M}from"./map-pin-IX0JctEr.js";import{C as O}from"./circle-alert-Dr5NXJSz.js";/* empty css            */import"./createLucideIcon-CjYUuB1Y.js";import"./download-DC6lCvrf.js";import"./trash-2-B8rr8heN.js";const Y=`
  @media print {
    @page {
      size: A4 portrait;
      margin: 1.5cm;
    }

    @page contract_print_landscape {
      size: A4 landscape;
      margin: 1.5cm;
    }

    html.contract-sign-print-landscape {
      page: contract_print_landscape;
    }

    html, body {
      margin: 0 !important;
      padding: 0 !important;
      height: auto !important;
    }

    body {
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    .print-only {
      display: block !important;
    }
    .screen-only {
      display: none !important;
    }
    .no-print {
      display: none !important;
    }

    .contract-print-one-page {
      zoom: 0.78;
      transform-origin: top center;
    }

    .sign-contract-sheet {
      direction: rtl;
      text-align: right;
      color: #000 !important;
      font-size: 11pt !important;
      line-height: 1.4 !important;
    }

    .print-container {
      max-width: 100% !important;
      margin: 0 0 0.35rem 0 !important;
      padding: 0.25rem 0.35rem !important;
      box-shadow: none !important;
      background: #fff !important;
      page-break-inside: auto !important;
      break-inside: auto !important;
    }

    .sign-print-doc-title {
      font-size: 14pt !important;
      font-weight: 700 !important;
      margin: 0 0 0.4rem 0 !important;
      padding-bottom: 0.25rem !important;
      border-bottom: 1px solid #000 !important;
    }

    .sign-print-section {
      margin-bottom: 0.45rem !important;
    }
    .sign-print-section > p:first-child {
      font-size: 13pt !important;
      font-weight: 700 !important;
      margin: 0 0 0.2rem 0 !important;
    }
    .sign-print-section > p:not(:first-child),
    .sign-print-section p {
      font-size: 11pt !important;
      line-height: 1.4 !important;
      margin: 0 0 0.25rem 0 !important;
    }

    .sign-print-meta-table {
      width: 100% !important;
      border-collapse: collapse !important;
      table-layout: fixed !important;
      font-size: 10pt !important;
    }
    .sign-print-meta-table td {
      border: 1px solid #000 !important;
      padding: 0.2rem 0.35rem !important;
      vertical-align: top !important;
      word-wrap: break-word !important;
    }
    .sign-print-meta-table .text-xs {
      font-size: 9pt !important;
      color: #333 !important;
    }

    .sign-print-parties {
      margin-bottom: 0.45rem !important;
    }
    .sign-print-party {
      background: #f3f4f6 !important;
      border: 1px solid #9ca3af !important;
      border-radius: 2px !important;
      padding: 0.35rem 0.45rem !important;
      margin-bottom: 0.35rem !important;
    }
    .sign-print-party p {
      margin: 0 0 0.15rem 0 !important;
      font-size: 10pt !important;
      line-height: 1.4 !important;
    }

    .sign-print-items-table {
      width: 100% !important;
      border-collapse: collapse !important;
      font-size: 10pt !important;
    }
    .sign-print-items-table th,
    .sign-print-items-table td {
      border: 1px solid #000 !important;
      padding: 0.2rem 0.3rem !important;
      text-align: center !important;
      vertical-align: middle !important;
    }
    .sign-print-items-table th {
      font-weight: 700 !important;
      background: #e5e7eb !important;
      font-size: 10pt !important;
    }

    .sign-print-obligations {
      column-count: 1 !important;
      list-style-position: outside !important;
      padding-right: 1rem !important;
      margin: 0 !important;
    }
    .sign-print-obligations li {
      margin-bottom: 0.25rem !important;
      font-size: 10pt !important;
      line-height: 1.4 !important;
      break-inside: avoid;
    }

    .sign-signature-table {
      width: 100% !important;
      table-layout: fixed !important;
      border-collapse: collapse !important;
    }
    .sign-signature-table td {
      width: 50% !important;
      border: 1px solid #000 !important;
      vertical-align: top !important;
      padding: 0.35rem 0.45rem !important;
    }

    .signature-pad {
      display: none !important;
    }

    .print-footer-contract {
      margin-top: 0.45rem !important;
      padding-top: 0.3rem !important;
      font-size: 9pt !important;
      border-top: 1px solid #000 !important;
    }

    .mb-6 { margin-bottom: 0.4rem !important; }
    .mb-4 { margin-bottom: 0.3rem !important; }
    .mb-2 { margin-bottom: 0.2rem !important; }
    .mt-2 { margin-top: 0.2rem !important; }
    .mt-8 { margin-top: 0.45rem !important; }
    .p-6 { padding: 0.35rem !important; }
    .p-4 { padding: 0.3rem !important; }
    .p-3 { padding: 0.25rem !important; }
    .py-8 { padding-top: 0.35rem !important; padding-bottom: 0.35rem !important; }
    .min-h-screen { min-height: 0 !important; }

    .text-xl { font-size: 12pt !important; }
    .text-lg { font-size: 11pt !important; }
    .text-sm { font-size: 10pt !important; }

    .grid-cols-2 { grid-template-columns: 1fr 1fr !important; }
    .gap-8 { gap: 0.45rem !important; }
    .gap-6 { gap: 0.35rem !important; }
    .gap-4 { gap: 0.3rem !important; }
    .gap-2 { gap: 0.2rem !important; }
    .space-y-4 > * + * { margin-top: 0.35rem !important; }
    .space-y-2 > * + * { margin-top: 0.2rem !important; }
    .pt-6, .sm\\:pt-8 { padding-top: 0.35rem !important; }
    .border-t-2 { border-top-width: 1px !important; }

    h1 { font-size: 14pt !important; }
    h2 { font-size: 13pt !important; }
    h3 { font-size: 12pt !important; }
  }

  @media screen {
    .print-only {
      display: none;
    }
  }
`;function q(){return e.jsx("style",{children:Y})}function G({className:t,children:n,onClick:o,...d}){return e.jsx($,{type:"button",...d,className:I("bg-[#58d2c8] hover:bg-[#4AB8B3] text-white flex items-center gap-2",t),onClick:a=>{o?.(a),!a.defaultPrevented&&window.print()},children:n??e.jsxs(e.Fragment,{children:[e.jsx(U,{className:"h-4 w-4"}),"طباعة العقد"]})})}function N({companySignature:t,compact:n=!1}){const o=t?.signature_url??null,d=t?.company_name&&t.company_name.trim()||"شركة البعد العالي للتجارة",a=t?.signer_name?.trim()??"",c=t?.signer_title?.trim()??"",h=n?"h-12":"h-16",p=n?"max-h-10":"max-h-14";return e.jsxs(e.Fragment,{children:[e.jsx("div",{className:n?"mb-3":"mb-4 sm:mb-6",children:o?e.jsx("div",{className:`border border-black rounded-sm w-48 max-w-full mx-auto ${h} flex items-center justify-center bg-white`,children:e.jsx("img",{src:o,alt:"توقيع الشركة",className:`${p} max-w-[180px] object-contain`})}):e.jsx("div",{className:`border-b-2 border-black w-48 max-w-full mx-auto mb-2 ${h}`})}),e.jsx("p",{className:`font-bold text-black ${n?"mt-1 text-sm":"text-lg"}`,children:"توقيع الطرف الأول (المؤجر)"}),e.jsx("p",{className:n?"text-sm text-black mt-1":"text-sm text-black mt-2",children:d}),a||c?e.jsxs("div",{className:`space-y-0.5 text-black ${n?"text-[11px] mt-1":"text-xs mt-2"}`,children:[a?e.jsxs("p",{children:["الموقّع: ",a]}):null,c?e.jsxs("p",{children:["الصفة: ",c]}):null]}):null]})}function le({contract:t,companySignature:n}){const[o,d]=l.useState(!1),[a,c]=l.useState(""),[h,p]=l.useState(!1),[f,k]=l.useState(!1),w=l.useRef(!1),x=(typeof window<"u"?window.location.pathname:"").split("/contract/sign/")[1]||"",g=x||t?.contract_number||"";l.useEffect(()=>{if(!t){b.error("خطأ","لم يتم العثور على بيانات العقد");return}x&&t.contract_number!==x&&console.warn(`تحذير: رقم العقد في البيانات (${t.contract_number}) لا يطابق الرابط (${x})`),t.customer_signature&&(k(!0),c(t.customer_signature))},[t,x]),l.useEffect(()=>{if(!(typeof window>"u"||new URLSearchParams(window.location.search).get("layout")!=="landscape"))return document.documentElement.classList.add("contract-sign-print-landscape"),()=>{document.documentElement.classList.remove("contract-sign-print-landscape")}},[]),l.useEffect(()=>{if(!t||w.current||typeof window>"u")return;const r=new URLSearchParams(window.location.search);if(r.get("print")!=="1")return;w.current=!0;const s=window.setTimeout(()=>{window.print(),r.delete("print");const i=r.toString();window.history.replaceState({},"",`${window.location.pathname}${i?`?${i}`:""}`)},800);return()=>clearTimeout(s)},[t]);const L=async r=>{c(r),p(!0)},A=async()=>{if(!a||!t){b.error("خطأ","يرجى التوقيع أولاً");return}d(!0);const r=g||t.contract_number;try{F.post(`/contracts/${r}/sign`,{signature:a},{onSuccess:()=>{k(!0),p(!1),b.success("نجح","تم التوقيع على العقد بنجاح!")},onError:s=>{b.error("خطأ",s?.message||"حدث خطأ في حفظ التوقيع")},onFinish:()=>{d(!1)}})}catch(s){console.error("خطأ في التوقيع:",s),b.error("خطأ","حدث خطأ في التوقيع"),d(!1)}},m=r=>new Date(r).toLocaleDateString("ar-SA",{year:"numeric",month:"long",day:"numeric"}),y=(r,s)=>{if(!r||!s)return 0;const i=B=>{const[C,z,T]=B.split("T")[0].split("-").map(E=>parseInt(E,10));return!C||!z||!T?NaN:Date.UTC(C,z-1,T)},_=i(r),S=i(s);return Number.isNaN(_)||Number.isNaN(S)?0:Math.round((S-_)/(1e3*60*60*24))+1},v=t.duration_days&&t.duration_days>0?t.duration_days:y(t.start_date,t.end_date),P=30,R=r=>{const s=y(r.start_date,r.end_date);return s>0?`${s} يوم`:String(r.duration_type||"").toLowerCase()==="monthly"&&r.duration>0?`${r.duration*P} يوم`:r.duration>0?`${r.duration} يوم`:"—"};return e.jsxs(e.Fragment,{children:[e.jsx(D,{title:`توقيع العقد ${g}`}),e.jsx(q,{}),e.jsx("div",{className:"min-h-screen bg-gray-50 py-8",children:e.jsxs("div",{className:"max-w-4xl mx-auto px-4",children:[e.jsx("div",{className:"bg-white rounded-lg shadow-sm p-6 mb-6 no-print",children:e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx("div",{className:"p-2 bg-[#58d2c8]/10 rounded-lg",children:e.jsx(u,{className:"h-6 w-6 text-[#58d2c8]"})}),e.jsxs("div",{children:[e.jsx("h1",{className:"text-2xl font-bold text-gray-900",children:"توقيع العقد"}),e.jsxs("p",{className:"text-gray-600",children:["رقم العقد: ",g]})]})]}),e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx(G,{}),f&&e.jsxs("div",{className:"flex items-center gap-2 px-4 py-2 bg-green-100 text-green-800 rounded-lg",children:[e.jsx(j,{className:"h-5 w-5"}),e.jsx("span",{className:"font-medium",children:"تم التوقيع"})]})]})]})}),e.jsxs("div",{className:"print-scale contract-print-one-page sign-contract-sheet",children:[e.jsxs("div",{className:"bg-white rounded-lg shadow-sm p-6 mb-6 print-container",children:[e.jsxs("h2",{className:"text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2 sign-print-doc-title",children:[e.jsx(u,{className:"h-5 w-5 screen-only"}),"تفاصيل العقد"]}),e.jsx("div",{className:"overflow-x-auto mb-6",children:e.jsx("table",{className:"sign-print-meta-table w-full border border-black border-collapse text-sm",children:e.jsxs("tbody",{children:[e.jsxs("tr",{children:[e.jsxs("td",{className:"border border-black p-1 align-top",children:[e.jsx("div",{className:"text-xs text-gray-600",children:"اسم العميل"}),e.jsx("div",{className:"font-medium text-gray-900",children:t.customer_name})]}),e.jsxs("td",{className:"border border-black p-1 align-top",children:[e.jsx("div",{className:"text-xs text-gray-600",children:"تاريخ العقد"}),e.jsx("div",{className:"font-medium text-gray-900",children:m(t.contract_date)})]}),e.jsxs("td",{className:"border border-black p-1 align-top",children:[e.jsx("div",{className:"text-xs text-gray-600",children:"مدة الإيجار"}),e.jsxs("div",{className:"font-medium text-gray-900",children:["من ",m(t.start_date)," إلى ",m(t.end_date),v>0&&e.jsxs("span",{className:"block text-xs mt-0.5",children:["(",v," يوم)"]})]})]}),e.jsxs("td",{className:"border border-black p-1 align-top",children:[e.jsx("div",{className:"text-xs text-gray-600",children:"القيمة الإجمالية"}),e.jsxs("div",{className:"font-medium text-gray-900",children:[t.amount.toLocaleString()," ر.ع"]})]})]}),e.jsxs("tr",{children:[e.jsxs("td",{className:"border border-black p-1 align-top",children:[e.jsx("div",{className:"text-xs text-gray-600",children:"نوع العقد"}),e.jsx("div",{className:"font-medium text-gray-900",children:t.contract_type})]}),e.jsxs("td",{className:"border border-black p-1 align-top",children:[e.jsx("div",{className:"text-xs text-gray-600",children:"بعد الخصم"}),e.jsxs("div",{className:"font-medium text-gray-900",children:[t.total_after_discount.toLocaleString()," ر.ع"]})]}),e.jsxs("td",{className:"border border-black p-1 align-top",colSpan:2,children:[e.jsx("div",{className:"text-xs text-gray-600",children:"عنوان التسليم"}),e.jsx("div",{className:"font-medium text-gray-900",children:t.delivery_address||"-"}),t.location_map_link&&e.jsx("a",{href:t.location_map_link,target:"_blank",rel:"noopener noreferrer",className:"text-[#58d2c8] hover:text-[#4AB8B3] text-xs mt-1 inline-block screen-only",children:e.jsxs("span",{className:"inline-flex items-center gap-1",children:[e.jsx(M,{className:"h-3.5 w-3.5"}),"عرض على الخريطة"]})})]})]})]})})}),e.jsxs("div",{className:"mb-6 space-y-4 sign-print-parties",children:[e.jsxs("div",{className:"sign-print-party bg-gray-50 rounded-lg p-4",children:[e.jsx("p",{className:"font-bold text-lg text-black mb-2",children:"الطرف الأول (المالك):"}),e.jsx("p",{className:"text-black",children:"شركة البعد العالي للتجارة، س.ت: 1208502، ومقرها ولاية السيب، هاتف: ٩٣٠٩٩٩١٤."})]}),e.jsxs("div",{className:"sign-print-party bg-gray-50 rounded-lg p-4",children:[e.jsx("p",{className:"font-bold text-lg text-black mb-2",children:"الطرف الثاني (المستأجر):"}),e.jsxs("p",{className:"text-black",children:[t.customer_type==="COMPANY"?"شركة / مؤسسة":"فرد",":"," ",t.customer_name]}),t.customer_commercial_record&&e.jsxs("p",{className:"text-black mt-1",children:["س.ت: ",t.customer_commercial_record]}),t.customer_id_number&&e.jsxs("p",{className:"text-black mt-1",children:["رقم الهوية: ",t.customer_id_number]}),e.jsxs("div",{className:"mt-2 space-y-1",children:[e.jsx("p",{className:"text-black",children:e.jsx("span",{children:"ويمثلها في هذا العقد:"})}),e.jsx("p",{className:"text-black",children:e.jsx("span",{children:"بصفته:"})})]})]})]}),e.jsxs("div",{className:"mb-6 sign-print-section",children:[e.jsx("p",{className:"font-bold text-lg text-black mb-2",children:"مقدمة:"}),e.jsx("p",{className:"text-black",children:"الطرف الأول منشأة تمتلك عدد من المعدات، وقد أبدى الطرف الثاني رغبته في استئجار عدد منها بغرض الانتفاع بها لفترة زمنية محددة، وقد اتفق الطرفان على ما يلي:"})]}),t.rental_details&&t.rental_details.length>0&&e.jsxs("div",{className:"mb-6 sign-print-section",children:[e.jsx("p",{className:"text-lg font-bold mb-4 text-black",children:"أولاً: بموجب هذا العقد التزم المالك (الطرف الأول) بتأجير عدد من المعدات للمستأجر (الطرف الثاني) والمبينة أوصافها فيما يلي:"}),e.jsx("div",{className:"overflow-x-auto",children:e.jsxs("table",{className:"sign-print-items-table w-full border-2 border-black border-collapse",children:[e.jsx("thead",{children:e.jsxs("tr",{className:"bg-white border-2 border-black",children:[e.jsx("th",{className:"border-2 border-black p-3 text-center font-bold text-black",children:"م"}),e.jsx("th",{className:"border-2 border-black p-3 text-center font-bold text-black",children:"النوع"}),e.jsx("th",{className:"border-2 border-black p-3 text-center font-bold text-black",children:"العدد"}),e.jsx("th",{className:"border-2 border-black p-3 text-center font-bold text-black",children:"تاريخ الإيجار"}),e.jsx("th",{className:"border-2 border-black p-3 text-center font-bold text-black",children:"تاريخ الإرجاع"}),e.jsx("th",{className:"border-2 border-black p-3 text-center font-bold text-black",children:"المدة"}),e.jsx("th",{className:"border-2 border-black p-3 text-center font-bold text-black",children:"قيمة الإيجار"})]})}),e.jsx("tbody",{children:t.rental_details.map((r,s)=>{const i=R(r);return e.jsxs("tr",{className:"border-2 border-black",children:[e.jsx("td",{className:"border-2 border-black p-3 text-center font-semibold text-black",children:s+1}),e.jsx("td",{className:"border-2 border-black p-3 text-center text-black",children:r.item_description}),e.jsx("td",{className:"border-2 border-black p-3 text-center font-semibold text-black",children:r.quantity}),e.jsx("td",{className:"border-2 border-black p-3 text-center text-black",children:m(r.start_date)}),e.jsx("td",{className:"border-2 border-black p-3 text-center text-black",children:m(r.end_date)}),e.jsx("td",{className:"border-2 border-black p-3 text-center font-semibold text-black",children:i}),e.jsxs("td",{className:"border-2 border-black p-3 text-center font-bold text-black",children:[r.total.toLocaleString()," ر.ع"]})]},r.id)})})]})})]}),e.jsxs("div",{className:"mb-6 sign-print-section",children:[e.jsx("p",{className:"font-bold text-lg text-black mb-2",children:"ثانياً: مكان الاتفاق:"}),e.jsx("p",{className:"text-black",children:t.delivery_address||"مسقط، سلطنة عمان"})]}),e.jsxs("div",{className:"mb-6 sign-print-section",children:[e.jsx("p",{className:"font-bold text-lg text-black mb-2",children:"ثالثاً: مدة العقد:"}),e.jsx("p",{className:"text-black",children:"مدة هذا العقد تبدأ من تاريخ إستلام المستأجر للمعدات الموضحة في العقد، وتتجدد تلقائياً لفترة مماثلة بعد انقضاء مدة العقد الأصلية في حالة عدم إرجاع المعدات وعدم الإخطار، وفي هذه الحالة يحق للطرف الأول تحديد سعر إيجار جديد بعد انتهاء هذا العقد."})]}),e.jsxs("div",{className:"mb-6 sign-print-section",children:[e.jsx("p",{className:"font-bold text-lg text-black mb-2",children:"رابعاً: التزامات المستأجر:"}),e.jsxs("ul",{className:"sign-print-obligations list-disc list-outside space-y-2 text-black pr-5 columns-1 md:columns-2 [column-gap:1rem]",children:[e.jsx("li",{children:"يلتزم المستأجر بتمكين المؤجر أو من يمثله بمعاينة المعدات المؤجرة وتفقدها وصيانتها في أى وقت أو سحبها ونقلها في حال تخلف المستأجر عن سداد قيمة الإيجار مقدماً أو الإخلال بشروط العقد دون أن يتحمل أي مسئولية نتيجة الضرر الناتج عن سحب المعدات أو فكها من الموقع ويعد هذا الشرط بمثابة الإخطار المسبق للمستأجر."}),e.jsx("li",{children:"يقر المستأجر بأنه قد عاين المعدات المؤجرة معاينة نافية للجهالة وقبلها بحالتها الراهنة، وأنها صالحة للإستعمال."}),e.jsx("li",{children:"إذا تسبب المستأجر في فقد المعدة أو تلفها كلياً أو جزئياً بفعله أو بفعل الغير يلتزم بتعويض المالك بقيمتها حسب الشراء."}),e.jsx("li",{children:"جميع العقود المبرمة حول الكميات المستأجرة يتم إعادة إحتساب قيمة إيجارية أخرى في حالة إرجاع جزء منها بعقد جديد ولا ينطبق سعر الإيجار على أي إتفاق آخر خارج عن هذا العقد، ويحدد الطرف الأول (المؤجر) القيمة الإيجارية الجديدة."}),e.jsx("li",{children:"يحق للمالك تحديد قيمة إيجارية جديدة حسب رؤيته بعد إنتهاء هذا العقد أو التجديد التلقائي ويعد هذا الشرط بمثابة الإخطار المسبق للمستأجر."}),e.jsx("li",{children:"يقر الطرف الثاني (المستأجر) بتخويل أى شخص يعمل لديه باستلام المعدات وتسليمها."}),e.jsx("li",{children:"لا يعتد بأى إدعاء حول إرجاع المعدات ما لم يقدم المستأجر ما يفيد ذلك كتابياً موقعاً من طرف المؤجر."})]})]}),e.jsxs("div",{className:"mb-6 sign-print-section",children:[e.jsx("p",{className:"font-bold text-lg text-black mb-2",children:"خامساً: الفصل في النزاع:"}),e.jsx("p",{className:"text-black",children:"أي نزاع قد ينشأ عن تنفيذ هذا العقد أو تفسير نصوصه إن لم يتم حسمه بالتراضي يتم الفصل فيه لدى الجهات القضائية والمحاكم المختصة بولاية السيب وفي حالة وجود بند غير واضح يفسر لصالح المؤجر ويستمر إحتساب القيمة الإيجارية لحين إرجاع المعدات."})]})]}),f?e.jsxs("div",{className:"bg-white rounded-lg shadow-sm p-6 print-container",children:[e.jsxs("div",{className:"text-center screen-only",children:[e.jsx("div",{className:"p-3 bg-green-100 rounded-full inline-block mb-4",children:e.jsx(j,{className:"h-8 w-8 text-green-600"})}),e.jsx("h2",{className:"text-2xl font-bold text-gray-900 mb-2",children:"تم التوقيع بنجاح!"}),e.jsx("p",{className:"text-gray-600 mb-6",children:"شكراً لتوقيعك على العقد"}),e.jsx("table",{className:"sign-signature-table w-full table-fixed border-collapse border-2 border-black mt-6 border-t-2 border-t-black pt-6",dir:"rtl",children:e.jsx("tbody",{children:e.jsxs("tr",{children:[e.jsx("td",{className:"w-1/2 align-top border border-black p-4 text-center",children:e.jsx(N,{companySignature:n})}),e.jsxs("td",{className:"w-1/2 align-top border border-black p-4 text-center",children:[e.jsx("div",{className:"border border-black rounded-sm w-48 max-w-full mx-auto h-16 flex items-center justify-center bg-white",children:a||t.customer_signature?e.jsx("img",{src:a||t.customer_signature,alt:"توقيع العميل",className:"max-h-14 max-w-[180px] object-contain"}):e.jsx("div",{className:"border-b border-black w-40"})}),e.jsx("p",{className:"font-bold text-black mt-2",children:"توقيع الطرف الثاني (المستأجر)"}),e.jsx("p",{className:"text-black",children:t.customer_name})]})]})})})]}),e.jsx("div",{className:"print-only",children:e.jsx("table",{className:"sign-signature-table w-full table-fixed border-collapse border-2 border-black mt-2 pt-2 border-t border-black",dir:"rtl",children:e.jsx("tbody",{children:e.jsxs("tr",{children:[e.jsx("td",{className:"w-1/2 align-top border border-black p-3 text-center",children:e.jsx(N,{companySignature:n,compact:!0})}),e.jsxs("td",{className:"w-1/2 align-top border border-black p-3 text-center",children:[e.jsx("div",{className:"border border-black rounded-sm w-44 max-w-full mx-auto h-12 flex items-center justify-center bg-white",children:a||t.customer_signature?e.jsx("img",{src:a||t.customer_signature,alt:"توقيع العميل",className:"max-h-10 max-w-[180px] object-contain"}):e.jsx("div",{className:"border-b border-black w-40"})}),e.jsx("p",{className:"font-bold text-black mt-2",children:"توقيع الطرف الثاني (المستأجر)"}),e.jsx("p",{className:"text-black",children:t.customer_name})]})]})})})})]}):e.jsxs("div",{className:"bg-white rounded-lg shadow-sm p-6 print-container",children:[e.jsxs("h2",{className:"text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2",children:[e.jsx(u,{className:"h-5 w-5"}),"التوقيع على العقد"]}),e.jsxs("div",{className:"space-y-4",children:[e.jsx("div",{className:"bg-blue-50 border border-blue-200 rounded-lg p-4 screen-only",children:e.jsxs("div",{className:"flex items-start gap-3",children:[e.jsx(O,{className:"h-5 w-5 text-blue-600 mt-0.5"}),e.jsxs("div",{children:[e.jsx("h3",{className:"font-medium text-blue-900",children:"تعليمات التوقيع"}),e.jsx("p",{className:"text-sm text-blue-700 mt-1",children:"يرجى مراجعة تفاصيل العقد أعلاه والتوقيع إلكترونياً في المنطقة أدناه. هذا التوقيع له نفس القوة القانونية للتوقيع اليدوي."})]})]})}),e.jsx("table",{className:"sign-signature-table w-full table-fixed border-collapse border-2 border-black mt-8 sm:mt-10",dir:"rtl",children:e.jsx("tbody",{children:e.jsxs("tr",{children:[e.jsx("td",{className:"w-1/2 align-top border border-black p-3 sm:p-4 text-center min-w-0",children:e.jsx(N,{companySignature:n})}),e.jsxs("td",{className:"w-1/2 align-top border border-black p-3 sm:p-4 text-center min-w-0",children:[e.jsxs("div",{className:"mb-4 sm:mb-6",children:[e.jsxs("div",{className:"border-2 border-dashed border-[#58d2c8] rounded-lg p-3 sm:p-4 bg-gray-50 signature-pad",children:[e.jsxs("div",{className:"text-center mb-3 sm:mb-4",children:[e.jsx("h3",{className:"text-base sm:text-lg font-medium text-gray-900",children:"توقيع العميل"}),e.jsx("p",{className:"text-xs sm:text-sm text-gray-600 mt-1",children:"اضغط واسحب للتوقيع في المنطقة أدناه"})]}),e.jsx("div",{className:"w-full min-w-0",children:e.jsx(H,{responsive:!0,minHeight:128,aspectRatio:.38,onSignatureComplete:L,onSignatureClear:()=>{c(""),p(!1)},strokeColor:"#000000",strokeWidth:2})})]}),e.jsx("div",{className:"print-only",children:e.jsx("div",{className:"border-b border-black w-48 max-w-full mx-auto h-10"})})]}),e.jsx("p",{className:"font-bold text-lg text-black",children:"توقيع الطرف الثاني (المستأجر)"}),e.jsx("p",{className:"text-sm text-black mt-2",children:t.customer_name})]})]})})}),h&&e.jsxs("div",{className:"mt-6 text-center",children:[e.jsxs($,{onClick:A,disabled:o,className:"px-8 py-3 bg-[#58d2c8] hover:bg-[#4AB8B3] disabled:bg-gray-400 text-white rounded-lg transition-colors flex items-center gap-2 mx-auto",children:[e.jsx(j,{className:"h-5 w-5"}),o?"جاري حفظ التوقيع...":"حفظ التوقيع"]}),e.jsx("p",{className:"text-sm text-gray-600 mt-2",children:"اضغط لحفظ التوقيع والانتقال للصفحة التالية"})]})]})]}),e.jsxs("div",{className:"mt-8 pt-4 border-t border-black text-center text-xs text-black print-footer-contract",children:[e.jsxs("p",{className:"mb-0.5",children:["رقم العقد: ",e.jsx("span",{className:"font-semibold",children:g})," — ","تاريخ الإصدار: ",e.jsx("span",{className:"font-semibold",children:m(t.contract_date)})]}),e.jsx("p",{className:"text-gray-500 mt-1 print-only text-[9px]",children:"شركة البعد العالي للتجارة"})]}),e.jsxs("div",{className:"mt-4 text-center text-sm text-gray-500 screen-only",children:[e.jsx("p",{children:"شركة البعد العالي للتجارة - جميع الحقوق محفوظة"}),e.jsx("p",{children:"هذا التوقيع الإلكتروني محمي ومؤمن"})]})]})]})})]})}export{le as default};
