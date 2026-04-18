/**
 * طباعة صفحة توقيع العقد
 * — A4 عمودي (افتراضي)، هوامش 1.5 سم، خطوط pt.
 * أفقي: أضف class على html: contract-sign-print-landscape
 *   أو افتح الرابط بـ ?layout=landscape (يُضبط من Sign.tsx).
 */
export const CONTRACT_SIGN_PRINT_STYLES = `
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
`
