/** @jsxImportSource react */
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { showToast } from '@/hooks/use-toast';
import { ArrowLeft, Save, Upload, X } from 'lucide-react';
import { Combobox } from '@/components/ui/combobox';

interface Contract {
  id: number;
  contractNumber: string;
  title: string;
  customerName: string;
  amount: number;
  paidAmount: number;
  remainingAmount: number;
}

interface CreatePaymentProps {
  contract?: Contract;
  contracts: Contract[];
}

export default function CreatePayment({ contract: initialContract, contracts }: CreatePaymentProps) {
  const { flash } = usePage().props as any;
  const [selectedContract, setSelectedContract] = useState<Contract | null>(initialContract || null);
  const [checkImage, setCheckImage] = useState<File | null>(null);
  const [checkImagePreview, setCheckImagePreview] = useState<string | null>(null);

  const form = useForm({
    contract_id: initialContract?.id || '',
    payment_method: 'cash' as 'cash' | 'check' | 'credit_card' | 'bank_transfer',
    payment_date: new Date().toISOString().split('T')[0],
    amount: '',
    check_number: '',
    bank_name: '',
    check_date: '',
    notes: '',
  });

  useEffect(() => {
    if (flash?.success) {
      showToast.success('نجح', flash.success);
    }
    if (flash?.error) {
      showToast.error('خطأ', flash.error);
    }
  }, [flash]);

  useEffect(() => {
    if (selectedContract) {
      form.setData('contract_id', selectedContract.id);
      // تعيين المبلغ المتبقي كقيمة افتراضية
      if (!form.data.amount || form.data.amount === '0') {
        form.setData('amount', selectedContract.remainingAmount.toString());
      }
    }
  }, [selectedContract]);

  const handleContractSelect = (contractId: string) => {
    const contract = contracts.find((c) => c.id.toString() === contractId);
    if (contract) {
      setSelectedContract(contract);
      form.setData('contract_id', contract.id);
      form.setData('amount', contract.remainingAmount.toString());
    }
  };

  const handleCheckImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        showToast.error('خطأ', 'حجم الملف يجب أن يكون أقل من 10MB');
        return;
      }
      setCheckImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setCheckImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeCheckImage = () => {
    setCheckImage(null);
    setCheckImagePreview(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedContract) {
      showToast.error('خطأ', 'يرجى اختيار عقد');
      return;
    }

    if (parseFloat(form.data.amount) > selectedContract.remainingAmount) {
      showToast.error('خطأ', `المبلغ المدخل يتجاوز المبلغ المتبقي (${selectedContract.remainingAmount.toFixed(2)} ر.ع)`);
      return;
    }

    if (parseFloat(form.data.amount) <= 0) {
      showToast.error('خطأ', 'المبلغ يجب أن يكون أكبر من صفر');
      return;
    }

    // إضافة صورة الشيك إلى البيانات
    form.setData('check_image', checkImage);

    form.post('/payments', {
      forceFormData: true,
      onSuccess: () => {
        router.visit('/payments');
      },
      onError: (errors) => {
        const errorMessages: string[] = [];
        const errorLabels: Record<string, string> = {
          contract_id: 'العقد',
          payment_method: 'طريقة الدفع',
          payment_date: 'تاريخ الدفع',
          amount: 'المبلغ',
          check_number: 'رقم الشيك',
          bank_name: 'البنك',
          check_date: 'تاريخ الشيك',
          check_image: 'صورة الشيك',
        };

        const extractErrors = (obj: any, prefix = ''): void => {
          Object.keys(obj).forEach((key) => {
            const fullKey = prefix ? `${prefix}.${key}` : key;
            const value = obj[key];

            if (Array.isArray(value)) {
              value.forEach((msg) => {
                const label = errorLabels[key] || errorLabels[fullKey] || key;
                errorMessages.push(`${label}: ${msg}`);
              });
            } else if (typeof value === 'string') {
              const label = errorLabels[key] || errorLabels[fullKey] || key;
              errorMessages.push(`${label}: ${value}`);
            } else if (value && typeof value === 'object') {
              extractErrors(value, fullKey);
            }
          });
        };

        extractErrors(errors);

        if (errorMessages.length > 0) {
          showToast.error('خطأ في التسديد', errorMessages[0]);
        } else {
          showToast.error('خطأ في التسديد', 'يرجى التحقق من البيانات المدخلة');
        }
      },
    });
  };

  const contractOptions = contracts.map((contract) => ({
    value: contract.id.toString(),
    label: `${contract.contractNumber} - ${contract.customerName} (متبقي: ${contract.remainingAmount.toFixed(2)} ر.ع)`,
  }));

  const banks = [
    'بنك مسقط',
    'البنك الوطني العماني',
    'بنك عمان العربي',
    'بنك الإمارات دبي الوطني',
    'بنك HSBC عمان',
    'بنك ستاندرد تشارترد',
    'بنك المشرق',
    'بنك أبوظبي الإسلامي',
  ];

  return (
    <DashboardLayout>
      <Head title="تسديد دفعة جديدة" />
      <div className="space-y-6 pb-8 mt-2 -mx-1 sm:-mx-2 lg:-mx-3 xl:-mx-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.visit('/payments')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              العودة
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                تسديد دفعة جديدة
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">تسديد مبلغ من المتبقي لعقد</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* معلومات العقد */}
          <Card className="p-6 mb-6">
            <CardHeader>
              <CardTitle>اختيار العقد</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    العقد *
                  </label>
                  <Combobox
                    options={contractOptions}
                    value={selectedContract?.id.toString() || ''}
                    onValueChange={handleContractSelect}
                    placeholder="اختر العقد..."
                    searchPlaceholder="ابحث عن عقد..."
                    emptyText="لا توجد عقود"
                  />
                </div>

                {selectedContract && (
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 space-y-2">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">رقم العقد:</span>
                        <span className="font-medium text-gray-900 dark:text-white mr-2">
                          {selectedContract.contractNumber}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">العميل:</span>
                        <span className="font-medium text-gray-900 dark:text-white mr-2">
                          {selectedContract.customerName}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">المبلغ الإجمالي:</span>
                        <span className="font-medium text-gray-900 dark:text-white mr-2">
                          {selectedContract.amount.toFixed(2)} ر.ع
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">المبلغ المدفوع:</span>
                        <span className="font-medium text-green-600 dark:text-green-400 mr-2">
                          {selectedContract.paidAmount.toFixed(2)} ر.ع
                        </span>
                      </div>
                      <div className="col-span-2">
                        <span className="text-gray-600 dark:text-gray-400">المبلغ المتبقي:</span>
                        <span className="font-medium text-orange-600 dark:text-orange-400 mr-2 text-lg">
                          {selectedContract.remainingAmount.toFixed(2)} ر.ع
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* معلومات الدفعة */}
          <Card className="p-6 mb-6">
            <CardHeader>
              <CardTitle>معلومات الدفعة</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    طريقة الدفع *
                  </label>
                  <select
                    value={form.data.payment_method}
                    onChange={(e) => form.setData('payment_method', e.target.value as any)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#58d2c8] focus:border-transparent bg-white"
                    required
                  >
                    <option value="cash">نقداً</option>
                    <option value="check">شيك</option>
                    <option value="credit_card">بطاقة ائتمان</option>
                    <option value="bank_transfer">تحويل بنكي</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    تاريخ الدفع *
                  </label>
                  <Input
                    type="date"
                    value={form.data.payment_date}
                    onChange={(e) => form.setData('payment_date', e.target.value)}
                    className="w-full"
                    dir="ltr"
                    lang="en"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    المبلغ (ر.ع) *
                  </label>
                  <Input
                    type="number"
                    value={form.data.amount}
                    onChange={(e) => form.setData('amount', e.target.value)}
                    min="0.01"
                    step="0.01"
                    max={selectedContract?.remainingAmount || undefined}
                    className="w-full"
                    dir="ltr"
                    lang="en"
                    required
                  />
                  {selectedContract && (
                    <p className="text-xs text-gray-500 mt-1">
                      الحد الأقصى: {selectedContract.remainingAmount.toFixed(2)} ر.ع
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* تفاصيل الشيك (إذا كانت طريقة الدفع شيك) */}
          {form.data.payment_method === 'check' && (
            <Card className="p-6 mb-6">
              <CardHeader>
                <CardTitle>تفاصيل الشيك</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      رقم الشيك
                    </label>
                    <Input
                      type="text"
                      value={form.data.check_number}
                      onChange={(e) => form.setData('check_number', e.target.value)}
                      className="w-full"
                      dir="ltr"
                      lang="en"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      البنك
                    </label>
                    <select
                      value={form.data.bank_name}
                      onChange={(e) => form.setData('bank_name', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#58d2c8] focus:border-transparent bg-white"
                    >
                      <option value="">اختر البنك</option>
                      {banks.map((bank) => (
                        <option key={bank} value={bank}>
                          {bank}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      تاريخ الشيك
                    </label>
                    <Input
                      type="date"
                      value={form.data.check_date}
                      onChange={(e) => form.setData('check_date', e.target.value)}
                      className="w-full"
                      dir="ltr"
                      lang="en"
                    />
                  </div>

                  <div className="md:col-span-3">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      صورة الشيك
                    </label>
                    <div className="space-y-3">
                      {!checkImagePreview ? (
                        <div className="flex items-center gap-4">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleCheckImageChange}
                            className="hidden"
                            id="check-image-input"
                          />
                          <label
                            htmlFor="check-image-input"
                            className="cursor-pointer bg-[#58d2c8] text-white px-4 py-2 rounded-lg hover:bg-[#4AB8B3] transition-colors flex items-center gap-2"
                          >
                            <Upload className="w-4 h-4" />
                            رفع صورة الشيك
                          </label>
                        </div>
                      ) : (
                        <div className="relative inline-block">
                          <img
                            src={checkImagePreview}
                            alt="صورة الشيك"
                            className="h-32 w-auto rounded-lg border border-gray-300"
                          />
                          <button
                            type="button"
                            onClick={removeCheckImage}
                            className="absolute top-2 left-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      )}
                      <p className="text-xs text-gray-500">الحد الأقصى: 10MB</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* ملاحظات */}
          <Card className="p-6 mb-6">
            <CardHeader>
              <CardTitle>ملاحظات (اختياري)</CardTitle>
            </CardHeader>
            <CardContent>
              <textarea
                value={form.data.notes}
                onChange={(e) => form.setData('notes', e.target.value)}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#58d2c8] focus:border-transparent resize-none"
                placeholder="أدخل أي ملاحظات إضافية..."
              />
            </CardContent>
          </Card>

          {/* أزرار الإجراءات */}
          <div className="flex items-center justify-end gap-4">
            <Button
              type="button"
              variant="ghost"
              onClick={() => router.visit('/payments')}
            >
              إلغاء
            </Button>
            <Button
              type="submit"
              disabled={form.processing || !selectedContract}
              className="bg-[#58d2c8] hover:bg-[#4AB8B3] text-white flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              {form.processing ? 'جاري الحفظ...' : 'حفظ الدفعة'}
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}

