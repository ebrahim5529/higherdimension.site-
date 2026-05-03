/** @jsxImportSource react */
import { Head, router } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';
import { FileText, Check, AlertCircle, MapPin } from 'lucide-react';
import { ContractPrintStyles, ContractPrintButton } from '@/components/features/ContractPrint';
import DigitalSignature from '@/components/features/DigitalSignature';
import { showToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { CONTRACT_AGREEMENT_PLACE_AR } from '@/lib/contract-agreement-place';

interface RentalDetail {
  id: number;
  item_description: string;
  quantity: number;
  daily_rate: number;
  monthly_rate: number;
  duration: number;
  duration_type: string;
  start_date: string;
  end_date: string;
  total: number;
}

interface ContractData {
  id: number;
  contract_number: string;
  customer_name: string;
  customer_id: number;
  customer_number?: string;
  customer_type?: string;
  customer_commercial_record?: string;
  customer_id_number?: string;
  contract_date: string;
  start_date: string;
  end_date: string;
  amount: number;
  total_after_discount: number;
  total_discount: number;
  contract_type: string;
  delivery_address: string;
  location_map_link?: string | null;
  transport_and_installation_cost: number;
  contract_notes?: string | null;
  /** مطابق لصفحة التفاصيل: diffInDays + 1 بين بداية ونهاية العقد */
  duration_days?: number;
  rental_details: RentalDetail[];
  status: string;
  customer_signature?: string | null;
  signed_at?: string | null;
}

interface SignContractProps {
  contract: ContractData;
  companySignature?: {
    id: number;
    company_name: string;
    signer_name: string;
    signer_title: string;
    signature_url: string | null;
  } | null;
}

type CompanySig = SignContractProps['companySignature'];

/** نفس بيانات /dashboard/electronic-signature: صورة + اسم الشركة + الموقّع + الصفة */
function LessorSignatureCell ({
  companySignature,
  compact = false,
}: {
  companySignature?: CompanySig;
  compact?: boolean;
}) {
  const url = companySignature?.signature_url ?? null;
  const company =
    (companySignature?.company_name && companySignature.company_name.trim()) ||
    'شركة البعد العالي للتجارة';
  const signerName = companySignature?.signer_name?.trim() ?? '';
  const signerTitle = companySignature?.signer_title?.trim() ?? '';

  const hImg = compact ? 'h-12' : 'h-16';
  const maxH = compact ? 'max-h-10' : 'max-h-14';

  return (
    <>
      <div className={compact ? 'mb-3' : 'mb-4 sm:mb-6'}>
        {url ? (
          <div
            className={`border border-black rounded-sm w-48 max-w-full mx-auto ${hImg} flex items-center justify-center bg-white`}
          >
            <img
              src={url}
              alt="توقيع الشركة"
              className={`${maxH} max-w-[180px] object-contain`}
            />
          </div>
        ) : (
          <div className={`border-b-2 border-black w-48 max-w-full mx-auto mb-2 ${hImg}`} />
        )}
      </div>
      <p className={`font-bold text-black ${compact ? 'mt-1 text-sm' : 'text-lg'}`}>
        توقيع الطرف الأول (المؤجر)
      </p>
      <p className={compact ? 'text-sm text-black mt-1' : 'text-sm text-black mt-2'}>{company}</p>
      {(signerName || signerTitle) ? (
        <div className={`space-y-0.5 text-black ${compact ? 'text-[11px] mt-1' : 'text-xs mt-2'}`}>
          {signerName ? <p>الموقّع: {signerName}</p> : null}
          {signerTitle ? <p>الصفة: {signerTitle}</p> : null}
        </div>
      ) : null}
    </>
  );
}

export default function SignContract({ contract, companySignature }: SignContractProps) {
  const [isSigning, setIsSigning] = useState(false);
  const [customerSignature, setCustomerSignature] = useState<string>('');
  const [isSavingSignature, setIsSavingSignature] = useState(false);
  const [isSigned, setIsSigned] = useState(false);
  const autoPrintTriggeredRef = useRef(false);

  // الحصول على رقم العقد من الرابط للتأكد من التطابق
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '';
  const contractNumberFromUrl = pathname.split('/contract/sign/')[1] || '';
  
  // استخدام رقم العقد من الرابط إذا كان متوفراً، وإلا استخدام رقم العقد من البيانات
  const displayContractNumber = contractNumberFromUrl || contract?.contract_number || '';

  useEffect(() => {
    if (!contract) {
      showToast.error('خطأ', 'لم يتم العثور على بيانات العقد');
      return;
    }
    
    // التحقق من أن رقم العقد يطابق الرابط
    if (contractNumberFromUrl && contract.contract_number !== contractNumberFromUrl) {
      console.warn(`تحذير: رقم العقد في البيانات (${contract.contract_number}) لا يطابق الرابط (${contractNumberFromUrl})`);
    }
    
    if (contract.customer_signature) {
      setIsSigned(true);
      setCustomerSignature(contract.customer_signature);
    }
  }, [contract, contractNumberFromUrl]);

  // طباعة أفقية للعقود الطويلة: ?layout=landscape (يضبط @page في أنماط الطباعة)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    if (params.get('layout') !== 'landscape') return undefined;
    document.documentElement.classList.add('contract-sign-print-landscape');
    return () => {
      document.documentElement.classList.remove('contract-sign-print-landscape');
    };
  }, []);

  // طباعة تلقائية عند فتح الرابط من جدول العقود (?print=1)
  useEffect(() => {
    if (!contract || autoPrintTriggeredRef.current) return;
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    if (params.get('print') !== '1') return;
    autoPrintTriggeredRef.current = true;
    const timer = window.setTimeout(() => {
      window.print();
      params.delete('print');
      const search = params.toString();
      window.history.replaceState(
        {},
        '',
        `${window.location.pathname}${search ? `?${search}` : ''}`
      );
    }, 800);
    return () => clearTimeout(timer);
  }, [contract]);

  // معالجة التوقيع
  const handleSignature = async (signatureData: string) => {
    setCustomerSignature(signatureData);
    setIsSavingSignature(true);
  };

  // حفظ التوقيع
  const handleSaveSignature = async () => {
    if (!customerSignature || !contract) {
      showToast.error('خطأ', 'يرجى التوقيع أولاً');
      return;
    }

    setIsSigning(true);

    // استخدام رقم العقد من الرابط للتأكد من التطابق
    const contractNumberToUse = displayContractNumber || contract.contract_number;

    try {
      router.post(
        `/contracts/${contractNumberToUse}/sign`,
        {
          signature: customerSignature,
        },
        {
          onSuccess: () => {
            setIsSigned(true);
            setIsSavingSignature(false);
            showToast.success('نجح', 'تم التوقيع على العقد بنجاح!');
          },
          onError: (errors) => {
            showToast.error('خطأ', errors?.message || 'حدث خطأ في حفظ التوقيع');
          },
          onFinish: () => {
            setIsSigning(false);
          },
        }
      );
    } catch (error) {
      console.error('خطأ في التوقيع:', error);
      showToast.error('خطأ', 'حدث خطأ في التوقيع');
      setIsSigning(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  /** أيام تقويمية شاملة (مطابقة لـ Laravel diffInDays + 1) */
  const inclusiveCalendarDays = (startDate: string, endDate: string) => {
    if (!startDate || !endDate) return 0;
    const parseUtc = (s: string) => {
      const [y, m, d] = s.split('T')[0].split('-').map((x) => parseInt(x, 10));
      if (!y || !m || !d) return NaN;
      return Date.UTC(y, m - 1, d);
    };
    const start = parseUtc(startDate);
    const end = parseUtc(endDate);
    if (Number.isNaN(start) || Number.isNaN(end)) return 0;
    return Math.round((end - start) / (1000 * 60 * 60 * 24)) + 1;
  };

  const contractTotalDays =
    contract.duration_days && contract.duration_days > 0
      ? contract.duration_days
      : inclusiveCalendarDays(contract.start_date, contract.end_date);

  /** مطابقة منطق إنشاء العقد: شهر تعاقدي = 30 يوماً */
  const CONTRACT_MONTH_AS_DAYS = 30;

  /** المدة دائماً بالأيام (للطباعة والعرض) */
  const formatRentalLineDuration = (detail: RentalDetail) => {
    const fromRange = inclusiveCalendarDays(detail.start_date, detail.end_date);
    if (fromRange > 0) return `${fromRange} يوم`;
    const dt = String(detail.duration_type || '').toLowerCase();
    if (dt === 'monthly' && detail.duration > 0) {
      return `${detail.duration * CONTRACT_MONTH_AS_DAYS} يوم`;
    }
    if (detail.duration > 0) return `${detail.duration} يوم`;
    return '—';
  };

  return (
    <>
      <Head title={`توقيع العقد ${displayContractNumber}`} />
      <ContractPrintStyles />
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6 no-print">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#58d2c8]/10 rounded-lg">
                  <FileText className="h-6 w-6 text-[#58d2c8]" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">توقيع العقد</h1>
                  <p className="text-gray-600">رقم العقد: {displayContractNumber}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <ContractPrintButton />

                {isSigned && (
                  <div className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-800 rounded-lg">
                    <Check className="h-5 w-5" />
                    <span className="font-medium">تم التوقيع</span>
                  </div>
                )}
              </div>
            </div>
          </div>

        <div className="print-scale contract-print-one-page sign-contract-sheet">
          {/* معلومات العقد */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6 print-container">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2 sign-print-doc-title">
              <FileText className="h-5 w-5 screen-only" />
              تفاصيل العقد
            </h2>

            <div className="overflow-x-auto mb-6">
              <table className="sign-print-meta-table w-full border border-black border-collapse text-sm">
                <tbody>
                  <tr>
                    <td className="border border-black p-1 align-top">
                      <div className="text-xs text-gray-600">اسم العميل</div>
                      <div className="font-medium text-gray-900">{contract.customer_name}</div>
                    </td>
                    <td className="border border-black p-1 align-top">
                      <div className="text-xs text-gray-600">تاريخ العقد</div>
                      <div className="font-medium text-gray-900">{formatDate(contract.contract_date)}</div>
                    </td>
                    <td className="border border-black p-1 align-top">
                      <div className="text-xs text-gray-600">مدة الإيجار</div>
                      <div className="font-medium text-gray-900">
                        من {formatDate(contract.start_date)} إلى {formatDate(contract.end_date)}
                        {contractTotalDays > 0 && (
                          <span className="block text-xs mt-0.5">({contractTotalDays} يوم)</span>
                        )}
                      </div>
                    </td>
                    <td className="border border-black p-1 align-top">
                      <div className="text-xs text-gray-600">القيمة الإجمالية</div>
                      <div className="font-medium text-gray-900">{contract.amount.toLocaleString()} ر.ع</div>
                    </td>
                  </tr>

                  <tr>
                    <td className="border border-black p-1 align-top">
                      <div className="text-xs text-gray-600">نوع العقد</div>
                      <div className="font-medium text-gray-900">{contract.contract_type}</div>
                    </td>
                    <td className="border border-black p-1 align-top">
                      <div className="text-xs text-gray-600">بعد الخصم</div>
                      <div className="font-medium text-gray-900">{contract.total_after_discount.toLocaleString()} ر.ع</div>
                    </td>
                    <td className="border border-black p-1 align-top" colSpan={2}>
                      <div className="text-xs text-gray-600">عنوان التسليم</div>
                      <div className="font-medium text-gray-900">{contract.delivery_address || '-'}</div>
                      {contract.location_map_link && (
                        <a
                          href={contract.location_map_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#58d2c8] hover:text-[#4AB8B3] text-xs mt-1 inline-block screen-only"
                        >
                          <span className="inline-flex items-center gap-1">
                            <MapPin className="h-3.5 w-3.5" />
                            عرض على الخريطة
                          </span>
                        </a>
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

          {/* الطرف الأول والثاني */}
          <div className="mb-6 space-y-4 sign-print-parties">
            <div className="sign-print-party bg-gray-50 rounded-lg p-4">
              <p className="font-bold text-lg text-black mb-2">الطرف الأول (المالك):</p>
              <p className="text-black">
                شركة البعد العالي للتجارة، س.ت: 1208502، ومقرها ولاية السيب، هاتف: ٩٣٠٩٩٩١٤.
              </p>
            </div>
            <div className="sign-print-party bg-gray-50 rounded-lg p-4">
              <p className="font-bold text-lg text-black mb-2">الطرف الثاني (المستأجر):</p>
              <p className="text-black">
                {contract.customer_type === 'COMPANY' ? 'شركة / مؤسسة' : 'فرد'}:{' '}
                {contract.customer_name}
              </p>
              {contract.customer_commercial_record && (
                <p className="text-black mt-1">س.ت: {contract.customer_commercial_record}</p>
              )}
              {contract.customer_id_number && (
                <p className="text-black mt-1">رقم الهوية: {contract.customer_id_number}</p>
              )}
              <div className="mt-2 space-y-1">
                <p className="text-black">
                  <span>ويمثلها في هذا العقد:</span>
                </p>
                <p className="text-black">
                  <span>بصفته:</span>
                </p>
              </div>
            </div>
          </div>

          {/* المقدمة */}
          <div className="mb-6 sign-print-section">
            <p className="font-bold text-lg text-black mb-2">مقدمة:</p>
            <p className="text-black">
              الطرف الأول منشأة تمتلك عدد من المعدات، وقد أبدى الطرف الثاني رغبته في استئجار
              عدد منها بغرض الانتفاع بها لفترة زمنية محددة، وقد اتفق الطرفان على ما يلي:
            </p>
          </div>

          {/* تفاصيل المعدات */}
          {contract.rental_details && contract.rental_details.length > 0 && (
            <div className="mb-6 sign-print-section">
              <p className="text-lg font-bold mb-4 text-black">
                أولاً: بموجب هذا العقد التزم المالك (الطرف الأول) بتأجير عدد من المعدات للمستأجر
                (الطرف الثاني) والمبينة أوصافها فيما يلي:
              </p>
              <div className="overflow-x-auto">
                <table className="sign-print-items-table w-full border-2 border-black border-collapse">
                  <thead>
                    <tr className="bg-white border-2 border-black">
                      <th className="border-2 border-black p-3 text-center font-bold text-black">م</th>
                      <th className="border-2 border-black p-3 text-center font-bold text-black">النوع</th>
                      <th className="border-2 border-black p-3 text-center font-bold text-black">العدد</th>
                      <th className="border-2 border-black p-3 text-center font-bold text-black">تاريخ الإيجار</th>
                      <th className="border-2 border-black p-3 text-center font-bold text-black">تاريخ الإرجاع</th>
                      <th className="border-2 border-black p-3 text-center font-bold text-black">المدة</th>
                      <th className="border-2 border-black p-3 text-center font-bold text-black">قيمة الإيجار</th>
                    </tr>
                  </thead>
                  <tbody>
                    {contract.rental_details.map((detail, index) => {
                      const durationLabel = formatRentalLineDuration(detail);
                      return (
                        <tr key={detail.id} className="border-2 border-black">
                          <td className="border-2 border-black p-3 text-center font-semibold text-black">
                            {index + 1}
                          </td>
                          <td className="border-2 border-black p-3 text-center text-black">
                            {detail.item_description}
                          </td>
                          <td className="border-2 border-black p-3 text-center font-semibold text-black">
                            {detail.quantity}
                          </td>
                          <td className="border-2 border-black p-3 text-center text-black">
                            {formatDate(detail.start_date)}
                          </td>
                          <td className="border-2 border-black p-3 text-center text-black">
                            {formatDate(detail.end_date)}
                          </td>
                          <td className="border-2 border-black p-3 text-center font-semibold text-black">
                            {durationLabel}
                          </td>
                          <td className="border-2 border-black p-3 text-center font-bold text-black">
                            {detail.total.toLocaleString()} ر.ع
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ثانياً: مكان الاتفاق */}
          <div className="mb-6 sign-print-section">
            <p className="font-bold text-lg text-black mb-2">ثانياً: مكان الاتفاق:</p>
            <p className="text-black">{CONTRACT_AGREEMENT_PLACE_AR}</p>
          </div>

          {/* ثالثاً: مدة العقد */}
          <div className="mb-6 sign-print-section">
            <p className="font-bold text-lg text-black mb-2">ثالثاً: مدة العقد:</p>
            <p className="text-black">
              مدة هذا العقد تبدأ من تاريخ إستلام المستأجر للمعدات الموضحة في العقد، وتتجدد
              تلقائياً لفترة مماثلة بعد انقضاء مدة العقد الأصلية في حالة عدم إرجاع المعدات
              وعدم الإخطار، وفي هذه الحالة يحق للطرف الأول تحديد سعر إيجار جديد بعد انتهاء
              هذا العقد.
            </p>
          </div>

          {/* رابعاً: التزامات المستأجر */}
          <div className="mb-6 sign-print-section">
            <p className="font-bold text-lg text-black mb-2">رابعاً: التزامات المستأجر:</p>
            <ul className="sign-print-obligations list-disc list-outside space-y-2 text-black pr-5 columns-1 md:columns-2 [column-gap:1rem]">
              <li>
                يلتزم المستأجر بتمكين المؤجر أو من يمثله بمعاينة المعدات المؤجرة وتفقدها
                وصيانتها في أى وقت أو سحبها ونقلها في حال تخلف المستأجر عن سداد قيمة الإيجار
                مقدماً أو الإخلال بشروط العقد دون أن يتحمل أي مسئولية نتيجة الضرر الناتج عن
                سحب المعدات أو فكها من الموقع ويعد هذا الشرط بمثابة الإخطار المسبق للمستأجر.
              </li>
              <li>
                يقر المستأجر بأنه قد عاين المعدات المؤجرة معاينة نافية للجهالة وقبلها
                بحالتها الراهنة، وأنها صالحة للإستعمال.
              </li>
              <li>
                إذا تسبب المستأجر في فقد المعدة أو تلفها كلياً أو جزئياً بفعله أو بفعل الغير
                يلتزم بتعويض المالك بقيمتها حسب الشراء.
              </li>
              <li>
                جميع العقود المبرمة حول الكميات المستأجرة يتم إعادة إحتساب قيمة إيجارية أخرى
                في حالة إرجاع جزء منها بعقد جديد ولا ينطبق سعر الإيجار على أي إتفاق آخر خارج
                عن هذا العقد، ويحدد الطرف الأول (المؤجر) القيمة الإيجارية الجديدة.
              </li>
              <li>
                يحق للمالك تحديد قيمة إيجارية جديدة حسب رؤيته بعد إنتهاء هذا العقد أو التجديد
                التلقائي ويعد هذا الشرط بمثابة الإخطار المسبق للمستأجر.
              </li>
              <li>
                يقر الطرف الثاني (المستأجر) بتخويل أى شخص يعمل لديه باستلام المعدات وتسليمها.
              </li>
              <li>
                لا يعتد بأى إدعاء حول إرجاع المعدات ما لم يقدم المستأجر ما يفيد ذلك كتابياً
                موقعاً من طرف المؤجر.
              </li>
            </ul>
          </div>

          {/* خامساً: الفصل في النزاع */}
          <div className="mb-6 sign-print-section">
            <p className="font-bold text-lg text-black mb-2">خامساً: الفصل في النزاع:</p>
            <p className="text-black">
              أي نزاع قد ينشأ عن تنفيذ هذا العقد أو تفسير نصوصه إن لم يتم حسمه بالتراضي يتم
              الفصل فيه لدى الجهات القضائية والمحاكم المختصة بولاية السيب وفي حالة وجود بند
              غير واضح يفسر لصالح المؤجر ويستمر إحتساب القيمة الإيجارية لحين إرجاع المعدات.
            </p>
          </div>
        </div>

        {/* منطقة التوقيع */}
        {!isSigned ? (
          <div className="bg-white rounded-lg shadow-sm p-6 print-container">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FileText className="h-5 w-5" />
              التوقيع على العقد
            </h2>

            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 screen-only">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-blue-900">تعليمات التوقيع</h3>
                    <p className="text-sm text-blue-700 mt-1">
                      يرجى مراجعة تفاصيل العقد أعلاه والتوقيع إلكترونياً في المنطقة أدناه. هذا
                      التوقيع له نفس القوة القانونية للتوقيع اليدوي.
                    </p>
                  </div>
                </div>
              </div>

              <table
                className="sign-signature-table w-full table-fixed border-collapse border-2 border-black mt-8 sm:mt-10"
                dir="rtl"
              >
                <tbody>
                  <tr>
                    <td className="w-1/2 align-top border border-black p-3 sm:p-4 text-center min-w-0">
                      <LessorSignatureCell companySignature={companySignature} />
                    </td>
                    <td className="w-1/2 align-top border border-black p-3 sm:p-4 text-center min-w-0">
                      <div className="mb-4 sm:mb-6">
                        <div className="border-2 border-dashed border-[#58d2c8] rounded-lg p-3 sm:p-4 bg-gray-50 signature-pad">
                          <div className="text-center mb-3 sm:mb-4">
                            <h3 className="text-base sm:text-lg font-medium text-gray-900">توقيع العميل</h3>
                            <p className="text-xs sm:text-sm text-gray-600 mt-1">اضغط واسحب للتوقيع في المنطقة أدناه</p>
                          </div>
                          <div className="w-full min-w-0">
                            <DigitalSignature
                              responsive
                              minHeight={128}
                              aspectRatio={0.38}
                              onSignatureComplete={handleSignature}
                              onSignatureClear={() => {
                                setCustomerSignature('');
                                setIsSavingSignature(false);
                              }}
                              strokeColor="#000000"
                              strokeWidth={2}
                            />
                          </div>
                        </div>
                        <div className="print-only">
                          <div className="border-b border-black w-48 max-w-full mx-auto h-10"></div>
                        </div>
                      </div>
                      <p className="font-bold text-lg text-black">توقيع الطرف الثاني (المستأجر)</p>
                      <p className="text-sm text-black mt-2">{contract.customer_name}</p>
                    </td>
                  </tr>
                </tbody>
              </table>

              {isSavingSignature && (
                <div className="mt-6 text-center">
                  <Button
                    onClick={handleSaveSignature}
                    disabled={isSigning}
                    className="px-8 py-3 bg-[#58d2c8] hover:bg-[#4AB8B3] disabled:bg-gray-400 text-white rounded-lg transition-colors flex items-center gap-2 mx-auto"
                  >
                    <Check className="h-5 w-5" />
                    {isSigning ? 'جاري حفظ التوقيع...' : 'حفظ التوقيع'}
                  </Button>
                  <p className="text-sm text-gray-600 mt-2">اضغط لحفظ التوقيع والانتقال للصفحة التالية</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-6 print-container">
            <div className="text-center screen-only">
              <div className="p-3 bg-green-100 rounded-full inline-block mb-4">
                <Check className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">تم التوقيع بنجاح!</h2>
              <p className="text-gray-600 mb-6">شكراً لتوقيعك على العقد</p>

              <table
                className="sign-signature-table w-full table-fixed border-collapse border-2 border-black mt-6 border-t-2 border-t-black pt-6"
                dir="rtl"
              >
                <tbody>
                  <tr>
                    <td className="w-1/2 align-top border border-black p-4 text-center">
                      <LessorSignatureCell companySignature={companySignature} />
                    </td>
                    <td className="w-1/2 align-top border border-black p-4 text-center">
                      <div className="border border-black rounded-sm w-48 max-w-full mx-auto h-16 flex items-center justify-center bg-white">
                        {(customerSignature || contract.customer_signature) ? (
                          <img
                            src={(customerSignature || contract.customer_signature) as string}
                            alt="توقيع العميل"
                            className="max-h-14 max-w-[180px] object-contain"
                          />
                        ) : (
                          <div className="border-b border-black w-40"></div>
                        )}
                      </div>
                      <p className="font-bold text-black mt-2">توقيع الطرف الثاني (المستأجر)</p>
                      <p className="text-black">{contract.customer_name}</p>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="print-only">
              <table
                className="sign-signature-table w-full table-fixed border-collapse border-2 border-black mt-2 pt-2 border-t border-black"
                dir="rtl"
              >
                <tbody>
                  <tr>
                    <td className="w-1/2 align-top border border-black p-3 text-center">
                      <LessorSignatureCell companySignature={companySignature} compact />
                    </td>
                    <td className="w-1/2 align-top border border-black p-3 text-center">
                      <div className="border border-black rounded-sm w-44 max-w-full mx-auto h-12 flex items-center justify-center bg-white">
                        {(customerSignature || contract.customer_signature) ? (
                          <img
                            src={(customerSignature || contract.customer_signature) as string}
                            alt="توقيع العميل"
                            className="max-h-10 max-w-[180px] object-contain"
                          />
                        ) : (
                          <div className="border-b border-black w-40"></div>
                        )}
                      </div>
                      <p className="font-bold text-black mt-2">توقيع الطرف الثاني (المستأجر)</p>
                      <p className="text-black">{contract.customer_name}</p>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="mt-8 pt-4 border-t border-black text-center text-xs text-black print-footer-contract">
          <p className="mb-0.5">
            رقم العقد: <span className="font-semibold">{displayContractNumber}</span>
            {' — '}
            تاريخ الإصدار: <span className="font-semibold">{formatDate(contract.contract_date)}</span>
          </p>
          <p className="text-gray-500 mt-1 print-only text-[9px]">
            شركة البعد العالي للتجارة
          </p>
        </div>

        <div className="mt-4 text-center text-sm text-gray-500 screen-only">
          <p>شركة البعد العالي للتجارة - جميع الحقوق محفوظة</p>
          <p>هذا التوقيع الإلكتروني محمي ومؤمن</p>
        </div>
        </div>
      </div>
    </div>
    </>
  );
}

