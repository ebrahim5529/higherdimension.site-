/** @jsxImportSource react */
import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Printer, Download, Copy, X } from 'lucide-react';
import { showToast } from '@/hooks/use-toast';
import { router } from '@inertiajs/react';

interface Contract {
  id: number;
  contractNumber: string;
}

interface ContractInvoiceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contract: Contract | null;
}

interface InvoiceData {
  contract: {
    id: number;
    contract_number: string;
    contract_date: string;
    contract_date_ar: string;
    contract_date_en: string;
    customer_name: string;
    customer_number: string;
    delivery_address: string;
    equipment: Array<{
      id: number;
      type: string;
      quantity: number;
      start_date: string;
      end_date: string;
      duration: number;
      duration_text: string;
      total: number;
    }>;
    equipment_total: number;
    transport_cost: number;
    discount: number;
    total_amount: number;
  };
  company: {
    name_ar: string;
    name_en: string;
    address_ar: string;
    address_en: string;
    commercial_register: string;
    phone: string;
  };
}

export function ContractInvoiceModal({
  open,
  onOpenChange,
  contract,
}: ContractInvoiceModalProps) {
  const [invoiceData, setInvoiceData] = useState<InvoiceData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && contract) {
      fetchInvoiceData();
    }
  }, [open, contract]);

  const fetchInvoiceData = async () => {
    if (!contract) return;
    
    setLoading(true);
    try {
      const response = await fetch(`/contracts/${contract.id}/invoice`);
      if (!response.ok) {
        throw new Error('Failed to fetch invoice data');
      }
      const data = await response.json();
      setInvoiceData(data);
    } catch (error) {
      showToast.error('خطأ', 'فشل تحميل بيانات الفاتورة');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopyWhatsApp = () => {
    if (!invoiceData) return;
    
    const message = `عقد إيجار معدات بناء
رقم العقد: ${invoiceData.contract.contract_number}
العميل: ${invoiceData.contract.customer_name}
التاريخ: ${invoiceData.contract.contract_date_ar}
المبلغ الإجمالي: ${invoiceData.contract.total_amount.toFixed(2)} ر.ع`;
    
    navigator.clipboard.writeText(message).then(() => {
      showToast.success('تم النسخ', 'تم نسخ رسالة الواتساب بنجاح');
    }).catch(() => {
      showToast.error('خطأ', 'فشل نسخ الرسالة');
    });
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('ar-OM', {
      minimumFractionDigits: 3,
      maximumFractionDigits: 3,
    }).format(num);
  };

  if (!contract || !invoiceData) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[95vh] overflow-y-auto p-0 bg-white rounded-lg shadow-2xl w-full no-print">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between z-10 no-print">
          <h2 className="text-xl font-bold text-gray-900">عقد إيجار معدات بناء</h2>
          <div className="flex items-center gap-2">
            <Button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-sm"
              title="طباعة العقد على ورقة A4"
            >
              <Printer className="h-4 w-4" />
              طباعة
            </Button>
            <Button
              onClick={handleCopyWhatsApp}
              className="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors text-sm bg-gray-600 hover:bg-gray-700 text-white"
              title="نسخ رسالة الواتساب"
            >
              <Copy className="h-4 w-4" />
              نسخ الرسالة
            </Button>
            <button
              onClick={() => onOpenChange(false)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Invoice Content */}
        <div className="p-8 sm:p-12 bg-white contract-content" dir="rtl" style={{ fontFamily: 'Arial, sans-serif' }}>
          {/* Company Header */}
          <div className="flex items-start justify-between mb-8 pb-4 border-b-2 border-black contract-header">
            <div className="text-right">
              <h2 className="text-2xl font-bold text-black mb-1">{invoiceData.company.name_ar}</h2>
              <p className="text-sm font-semibold text-black mb-3" style={{ letterSpacing: '0.5px' }}>
                {invoiceData.company.name_en}
              </p>
              <div className="space-y-1 text-sm text-black">
                <p>{invoiceData.company.address_ar}</p>
                <p style={{ direction: 'ltr', textAlign: 'right' }}>{invoiceData.company.address_en}</p>
              </div>
            </div>
            <div className="text-left">
              <div className="bg-white border-2 border-black rounded-lg px-6 py-4">
                <p className="text-sm text-black mb-1">NO:</p>
                <p className="text-3xl font-bold text-black">{invoiceData.contract.contract_number}</p>
              </div>
            </div>
          </div>

          {/* Title */}
          <div className="text-center mb-8 contract-title">
            <h1 className="text-3xl font-bold text-black mb-2">عقد إيجار معدات بناء</h1>
            <div className="w-full h-1 bg-black mb-4"></div>
          </div>

          {/* Date */}
          <div className="mb-6 text-base leading-relaxed text-black contract-date">
            <p>
              إنه في يوم: <span className="font-semibold">{invoiceData.contract.contract_date_ar}</span> الموافق{' '}
              <span className="font-semibold border-b border-black px-2">
                {invoiceData.contract.contract_date_en.split('/')[0]}
              </span>{' '}
              /{' '}
              <span className="font-semibold border-b border-black px-2">
                {invoiceData.contract.contract_date_en.split('/')[1]}
              </span>{' '}
              /{' '}
              <span className="font-semibold border-b border-black px-2">
                {invoiceData.contract.contract_date_en.split('/')[2]}
              </span>{' '}
              م، تم الإتفاق بين كل من:
            </p>
          </div>

          {/* Parties */}
          <div className="mb-6 space-y-3 contract-sections">
            <div className="bg-white p-4 rounded-lg border-r-4 border-black">
              <p className="text-lg font-bold mb-2 text-black">الطرف الأول (المالك):</p>
              <p className="text-base text-black">
                {invoiceData.company.name_ar}، س.ت: <span className="font-semibold">{invoiceData.company.commercial_register}</span>، ومقرها ولاية السيب، هاتف:{' '}
                <span className="font-semibold">{invoiceData.company.phone}</span>.
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg border-r-4 border-black">
              <p className="text-lg font-bold mb-2 text-black">الطرف الثاني (المستأجر):</p>
              <p className="text-base mb-2 text-black">
                شركة / مؤسسة: <span className="font-semibold">{invoiceData.contract.customer_name}</span>
              </p>
              <p className="text-base mb-2 text-black">
                س.ت: <span className="font-semibold">{invoiceData.contract.customer_number}</span>
              </p>
              <div className="space-y-1 mt-2">
                <p className="text-base text-black">
                  ويمثلها في هذا العقد: <span className="inline-block border-b border-black w-64 mx-1"></span> بصفته:{' '}
                  <span className="inline-block border-b border-black w-32 mx-1"></span>
                </p>
                <p className="text-base text-black">
                  <span className="inline-block border-b border-black w-64 mx-14"></span> بصفته:{' '}
                  <span className="inline-block border-b border-black w-32 mx-1"></span>
                </p>
              </div>
            </div>
          </div>

          {/* Introduction */}
          <div className="mb-6 p-4 bg-white border-r-4 border-black rounded contract-sections">
            <p className="text-lg font-bold mb-2 text-black">مقدمة:</p>
            <p className="text-base leading-relaxed text-justify text-black">
              الطرف الأول منشأة تمتلك عدد من المعدات، وقد أبدى الطرف الثاني رغبته في استئجار عدد منها بغرض الانتفاع بها لفترة زمنية محددة، وقد اتفق الطرفان على ما يلي:
            </p>
          </div>

          {/* Equipment Table */}
          <div className="mb-6">
            <p className="text-lg font-bold mb-4 text-black">
              أولاً: بموجب هذا العقد التزم المالك (الطرف الأول) بتأجير عدد من المعدات للمستأجر (الطرف الثاني) والمبينة أوصافها فيما يلي:
            </p>
            <div className="overflow-x-auto">
              <table className="w-full border-2 border-black contract-table">
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
                  {invoiceData.contract.equipment.map((item, index) => (
                    <tr key={item.id} className="border-2 border-black">
                      <td className="border-2 border-black p-3 text-center font-semibold text-black">{index + 1}</td>
                      <td className="border-2 border-black p-3 text-center text-black">{item.type}</td>
                      <td className="border-2 border-black p-3 text-center font-semibold text-black">{item.quantity}</td>
                      <td className="border-2 border-black p-3 text-center text-black">{item.start_date}</td>
                      <td className="border-2 border-black p-3 text-center text-black">{item.end_date}</td>
                      <td className="border-2 border-black p-3 text-center font-semibold text-black">{item.duration_text}</td>
                      <td className="border-2 border-black p-3 text-center font-bold text-black">{formatNumber(item.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Agreement Location */}
          <div className="mb-4 p-4 bg-white rounded border-r-4 border-black contract-sections">
            <p className="text-lg mb-2 text-black">
              <span className="font-bold">ثانياً: مكان الاتفاق:</span>
            </p>
            <p className="text-base mr-4 text-black">{invoiceData.contract.delivery_address || 'ولاية السيب، سلطنة عمان'}</p>
          </div>

          {/* Contract Duration */}
          <div className="mb-4 p-4 bg-white rounded border-r-4 border-black contract-sections">
            <p className="text-lg mb-2 text-black">
              <span className="font-bold">ثالثاً: مدة العقد:</span>
            </p>
            <p className="text-base leading-relaxed mr-4 text-justify text-black">
              مدة هذا العقد تبدأ من تاريخ إستلام المستأجر للمعدات الموضحة في العقد، وتتجدد تلقائياً لفترة مماثلة بعد انقضاء مدة العقد الأصلية في حالة عدم إرجاع المعدات وعدم الإخطار، وفي هذه الحالة يحق للطرف الأول تحديد سعر إيجار جديد بعد انتهاء هذا العقد.
            </p>
          </div>

          {/* Tenant Obligations */}
          <div className="mb-4 p-4 bg-white rounded border-r-4 border-black contract-sections">
            <p className="text-lg mb-3 text-black">
              <span className="font-bold">رابعاً: التزامات المستأجر:</span>
            </p>
            <div className="space-y-3 mr-4 text-base leading-relaxed">
              <p className="text-justify text-black">
                • يلتزم المستأجر بتمكين المؤجر أو من يمثله بمعاينة المعدات المؤجرة وتفقدها وصيانتها في أى وقت أو سحبها ونقلها في حال تخلف المستأجر عن سداد قيمة الإيجار مقدماً أو الإخلال بشروط العقد دون أن يتحمل أي مسئولية نتيجة الضرر الناتج عن سحب المعدات أو فكها من الموقع ويعد هذا الشرط بمثابة الإخطار المسبق للمستأجر.
              </p>
              <p className="text-justify text-black">
                • يقر المستأجر بأنه قد عاين المعدات المؤجرة معاينة نافية للجهالة وقبلها بحالتها الراهنة، وأنها صالحة للإستعمال.
              </p>
              <p className="text-justify text-black">
                • إذا تسبب المستأجر في فقد المعدة أو تلفها كلياً أو جزئياً بفعله أو بفعل الغير يلتزم بتعويض المالك بقيمتها حسب الشراء.
              </p>
              <p className="text-justify text-black">
                • جميع العقود المبرمة حول الكميات المستأجرة يتم إعادة إحتساب قيمة إيجارية أخرى في حالة إرجاع جزء منها بعقد جديد ولا ينطبق سعر الإيجار على أي إتفاق آخر خارج عن هذا العقد، ويحدد الطرف الأول (المؤجر) القيمة الإيجارية الجديدة.
              </p>
              <p className="text-justify text-black">
                • يحق للمالك تحديد قيمة إيجارية جديدة حسب رؤيته بعد إنتهاء هذا العقد أو التجديد التلقائي ويعد هذا الشرط بمثابة الإخطار المسبق للمستأجر.
              </p>
              <p className="text-justify text-black">
                • يقر الطرف الثاني (المستأجر) بتخويل أى شخص يعمل لديه باستلام المعدات وتسليمها.
              </p>
              <p className="text-justify text-black">
                • لا يعتد بأى إدعاء حول إرجاع المعدات ما لم يقدم المستأجر ما يفيد ذلك كتابياً موقعاً من طرف المؤجر.
              </p>
            </div>
          </div>

          {/* Dispute Resolution */}
          <div className="mb-8 p-4 bg-white rounded border-r-4 border-black contract-sections">
            <p className="text-lg mb-3 text-black">
              <span className="font-bold">خامساً: الفصل في النزاع:</span>
            </p>
            <p className="text-base leading-relaxed mr-4 text-justify text-black">
              أي نزاع قد ينشأ عن تنفيذ هذا العقد أو تفسير نصوصه إن لم يتم حسمه بالتراضي يتم الفصل فيه لدى الجهات القضائية والمحاكم المختصة بولاية السيب وفي حالة وجود بند غير واضح يفسر لصالح المؤجر ويستمر إحتساب القيمة الإيجارية لحين إرجاع المعدات.
            </p>
          </div>

          {/* Signatures */}
          <div className="grid grid-cols-2 gap-8 mt-12 pt-8 border-t-2 border-black signatures">
            <div className="text-center">
              <div className="mb-8">
                <div className="border-b-2 border-black w-48 mx-auto mb-2 h-16 signature-box"></div>
              </div>
              <p className="font-bold text-lg text-black">توقيع الطرف الأول (المؤجر)</p>
              <p className="text-sm text-black mt-2">{invoiceData.company.name_ar}</p>
            </div>
            <div className="text-center">
              <div className="mb-8">
                <div className="border-b-2 border-black w-48 mx-auto mb-2 h-16 signature-box"></div>
              </div>
              <p className="font-bold text-lg text-black">توقيع الطرف الثاني (المستأجر)</p>
              <p className="text-sm text-black mt-2">{invoiceData.contract.customer_name}</p>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-black text-center text-sm text-black contract-footer">
            <p className="mb-1">
              رقم العقد: <span className="font-semibold">{invoiceData.contract.contract_number}</span>
            </p>
            <p>
              تاريخ الإصدار: <span className="font-semibold">{invoiceData.contract.contract_date_ar}</span>
            </p>
          </div>
        </div>
      </DialogContent>

      {/* Print Styles */}
      <style>{`
        @media print {
          .no-print {
            display: none !important;
          }
          body {
            margin: 0;
            padding: 0;
          }
          .contract-content {
            padding: 20px;
            background-color: white;
            color: black;
          }
        }
      `}</style>
    </Dialog>
  );
}

