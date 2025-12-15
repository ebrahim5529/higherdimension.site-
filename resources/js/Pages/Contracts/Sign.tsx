/** @jsxImportSource react */
import { Head, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { FileText, Check, AlertCircle, User, Calendar, DollarSign, MapPin } from 'lucide-react';
import DigitalSignature from '@/components/features/DigitalSignature';
import { showToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';

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
  rental_details: RentalDetail[];
  status: string;
  customer_signature?: string | null;
  signed_at?: string | null;
}

interface SignContractProps {
  contract: ContractData;
}

export default function SignContract({ contract }: SignContractProps) {
  const [isSigning, setIsSigning] = useState(false);
  const [customerSignature, setCustomerSignature] = useState<string>('');
  const [isSavingSignature, setIsSavingSignature] = useState(false);
  const [isSigned, setIsSigned] = useState(false);

  useEffect(() => {
    if (contract.customer_signature) {
      setIsSigned(true);
      setCustomerSignature(contract.customer_signature);
    }
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

    try {
      router.post(
        `/contracts/${contract.contract_number}/sign`,
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

  const calculateDuration = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <Head title={`توقيع العقد ${contract.contract_number}`} />
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#58d2c8]/10 rounded-lg">
                <FileText className="h-6 w-6 text-[#58d2c8]" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">توقيع العقد</h1>
                <p className="text-gray-600">رقم العقد: {contract.contract_number}</p>
              </div>
            </div>

            {isSigned && (
              <div className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-800 rounded-lg">
                <Check className="h-5 w-5" />
                <span className="font-medium">تم التوقيع</span>
              </div>
            )}
          </div>
        </div>

        {/* معلومات العقد */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <FileText className="h-5 w-5" />
            تفاصيل العقد
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">اسم العميل</p>
                  <p className="font-medium text-gray-900">{contract.customer_name}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">تاريخ العقد</p>
                  <p className="font-medium text-gray-900">{formatDate(contract.contract_date)}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">مدة الإيجار</p>
                  <p className="font-medium text-gray-900">
                    من {formatDate(contract.start_date)} إلى {formatDate(contract.end_date)}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <DollarSign className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">القيمة الإجمالية</p>
                  <p className="font-medium text-gray-900">{contract.amount.toLocaleString()} ر.ع</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">نوع العقد</p>
                  <p className="font-medium text-gray-900">{contract.contract_type}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <DollarSign className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">بعد الخصم</p>
                  <p className="font-medium text-gray-900">
                    {contract.total_after_discount.toLocaleString()} ر.ع
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* عنوان التسليم */}
          {contract.delivery_address && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">عنوان التسليم</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-900">{contract.delivery_address}</p>
                {contract.location_map_link && (
                  <a
                    href={contract.location_map_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#58d2c8] hover:text-[#4AB8B3] text-sm mt-2 inline-block flex items-center gap-1"
                  >
                    <MapPin className="h-4 w-4" />
                    عرض على الخريطة
                  </a>
                )}
              </div>
            </div>
          )}

          {/* تفاصيل المعدات */}
          {contract.rental_details && contract.rental_details.length > 0 && (
            <div className="mb-6">
              <p className="text-lg font-bold mb-4 text-black">
                أولاً: بموجب هذا العقد التزم المالك (الطرف الأول) بتأجير عدد من المعدات للمستأجر
                (الطرف الثاني) والمبينة أوصافها فيما يلي:
              </p>
              <div className="overflow-x-auto">
                <table className="w-full border-2 border-black">
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
                      const duration = calculateDuration(detail.start_date, detail.end_date);
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
                            {duration} يوم
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
        </div>

        {/* منطقة التوقيع */}
        {!isSigned ? (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FileText className="h-5 w-5" />
              التوقيع على العقد
            </h2>

            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
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

              <div className="grid grid-cols-2 gap-8 mt-12 pt-8 border-t-2 border-black">
                <div className="text-center">
                  <div className="mb-8">
                    <div className="border-b-2 border-black w-48 mx-auto mb-2 h-16"></div>
                  </div>
                  <p className="font-bold text-lg text-black">توقيع الطرف الأول (المؤجر)</p>
                  <p className="text-sm text-black mt-2">شركة البعد العالي للتجارة</p>
                </div>

                <div className="text-center">
                  <div className="mb-8">
                    <div className="border-2 border-dashed border-[#58d2c8] rounded-lg p-4 bg-gray-50">
                      <div className="text-center mb-4">
                        <h3 className="text-lg font-medium text-gray-900">توقيع العميل</h3>
                        <p className="text-sm text-gray-600">اضغط واسحب للتوقيع في المنطقة أدناه</p>
                      </div>
                      <div className="w-full">
                        <DigitalSignature
                          onSignatureComplete={handleSignature}
                          onSignatureClear={() => {
                            setCustomerSignature('');
                            setIsSavingSignature(false);
                          }}
                          width={300}
                          height={120}
                          strokeColor="#000000"
                          strokeWidth={2}
                        />
                      </div>
                    </div>
                  </div>
                  <p className="font-bold text-lg text-black">توقيع الطرف الثاني (المستأجر)</p>
                  <p className="text-sm text-black mt-2">{contract.customer_name}</p>
                </div>
              </div>

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
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <div className="p-3 bg-green-100 rounded-full inline-block mb-4">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">تم التوقيع بنجاح!</h2>
            <p className="text-gray-600 mb-6">شكراً لتوقيعك على العقد</p>
          </div>
        )}

        <div className="mt-8 pt-6 border-t border-black text-center text-sm text-black">
          <p className="mb-1">
            رقم العقد: <span className="font-semibold">{contract.contract_number}</span>
          </p>
          <p>
            تاريخ الإصدار: <span className="font-semibold">{formatDate(contract.contract_date)}</span>
          </p>
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>شركة البعد العالي للتجارة - جميع الحقوق محفوظة</p>
          <p>هذا التوقيع الإلكتروني محمي ومؤمن</p>
        </div>
      </div>
    </div>
  );
}

