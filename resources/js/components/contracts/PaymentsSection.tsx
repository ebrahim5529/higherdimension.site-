import React from 'react';
import { PaymentDetail } from '@/types/contracts';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Trash2, Plus, } from 'lucide-react';
import { convertArabicToEnglishNumbers } from '@/lib/utils';

interface PaymentsSectionProps {
  payments: PaymentDetail[];
  onAddPayment: () => void;
  onDeletePayment: (id: string) => void;
  onUpdatePayment: (id: string, field: keyof PaymentDetail, value: any) => void;
  onCheckImageChange: (id: string, file: File | null) => void;
  errors?: Record<string, string>;
}

export function PaymentsSection({
  payments,
  onAddPayment,
  onDeletePayment,
  onUpdatePayment,
  onCheckImageChange,
  errors = {},
}: PaymentsSectionProps) {
  const totalPayments = payments.reduce((sum, p) => sum + p.amount, 0);
  return (
    <div className="card p-6 mb-6" style={{ padding: 0 }}>
      <div className="border-b border-gray-200 pb-4 mb-6 flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">المدفوعات</h2>
        <Button
          type="button"
          onClick={onAddPayment}
          className="bg-[#58d2c8] hover:bg-[#4AB8B3] text-white flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          إضافة دفعة
        </Button>
      </div>

      <div className="space-y-4">
        {payments.map((payment, index) => (
          <div key={payment.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">الدفعة {index + 1}</h3>
              <button
                type="button"
                onClick={() => onDeletePayment(payment.id)}
                className="text-red-600 hover:text-red-800 hover:bg-red-50 p-2 rounded-lg transition-colors"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* طريقة الدفع */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  طريقة الدفع *
                </label>
                <select
                  value={payment.paymentMethod}
                  onChange={(e) => onUpdatePayment(payment.id, 'paymentMethod', e.target.value as any)}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#58d2c8] focus:border-transparent bg-white ${errors[`payments.${index}.payment_method`] ? 'border-red-500' : 'border-gray-300'}`}
                  required
                >
                  <option value="cash">نقداً</option>
                  <option value="check">شيكات</option>
                  <option value="credit_card">بطاقة ائتمان</option>
                  <option value="bank_transfer">تحويل بنكي</option>
                </select>
                {errors[`payments.${index}.payment_method`] && (
                  <div className="text-red-500 text-xs mt-1">{errors[`payments.${index}.payment_method`]}</div>
                )}
              </div>

              {/* تاريخ الدفع */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  تاريخ الدفع *
                </label>
                <Input
                  type="date"
                  value={payment.paymentDate}
                  onChange={(e) => onUpdatePayment(payment.id, 'paymentDate', e.target.value)}
                  className={`w-full bg-white ${errors[`payments.${index}.payment_date`] ? 'border-red-500' : ''}`}
                  dir="ltr"
                  lang="en"
                  required
                />
                {errors[`payments.${index}.payment_date`] && (
                  <div className="text-red-500 text-xs mt-1">{errors[`payments.${index}.payment_date`]}</div>
                )}
              </div>

              {/* المبلغ */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  المبلغ (ر.ع) *
                </label>
                <Input
                  type="text"
                  value={payment.amount}
                  onChange={(e) => {
                    const convertedValue = convertArabicToEnglishNumbers(e.target.value);
                    e.target.value = convertedValue;
                    const value = convertedValue === '' ? 0 : Number(convertedValue) || 0;
                    onUpdatePayment(payment.id, 'amount', value);
                  }}
                  dir="ltr"
                  lang="en"
                  required
                  className={`bg-white ${errors[`payments.${index}.amount`] ? 'border-red-500' : ''}`}
                  placeholder="0"
                />
                {errors[`payments.${index}.amount`] && (
                  <div className="text-red-500 text-xs mt-1">{errors[`payments.${index}.amount`]}</div>
                )}
              </div>
            </div>

            {payment.paymentMethod === 'check' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    رقم الشيك
                  </label>
                  <Input
                    type="text"
                    value={payment.checkNumber || ''}
                    onChange={(e) => onUpdatePayment(payment.id, 'checkNumber', e.target.value)}
                    placeholder="أدخل رقم الشيك"
                    dir="ltr"
                    lang="en"
                    className={`bg-white ${errors[`payments.${index}.check_number`] ? 'border-red-500' : ''}`}
                  />
                  {errors[`payments.${index}.check_number`] && (
                    <div className="text-red-500 text-xs mt-1">{errors[`payments.${index}.check_number`]}</div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    البنك
                  </label>
                  <select
                    value={payment.bankName || ''}
                    onChange={(e) => onUpdatePayment(payment.id, 'bankName', e.target.value)}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#58d2c8] focus:border-transparent bg-white ${errors[`payments.${index}.bank_name`] ? 'border-red-500' : 'border-gray-300'}`}
                  >
                    <option value="">اختر البنك</option>
                    <option value="بنك مسقط">بنك مسقط</option>
                    <option value="البنك الوطني العماني">البنك الوطني العماني</option>
                    <option value="بنك عمان العربي">بنك عمان العربي</option>
                    <option value="بنك الإمارات دبي الوطني">بنك الإمارات دبي الوطني</option>
                    <option value="بنك HSBC عمان">بنك HSBC عمان</option>
                    <option value="بنك ستاندرد تشارترد">بنك ستاندرد تشارترد</option>
                    <option value="بنك المشرق">بنك المشرق</option>
                    <option value="بنك أبوظبي الإسلامي">بنك أبوظبي الإسلامي</option>
                  </select>
                  {errors[`payments.${index}.bank_name`] && (
                    <div className="text-red-500 text-xs mt-1">{errors[`payments.${index}.bank_name`]}</div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    تاريخ الشيك
                  </label>
                  <Input
                    type="date"
                    value={payment.checkDate || ''}
                    onChange={(e) => onUpdatePayment(payment.id, 'checkDate', e.target.value)}
                    className={`w-full bg-white ${errors[`payments.${index}.check_date`] ? 'border-red-500' : ''}`}
                    dir="ltr"
                    lang="en"
                  />
                  {errors[`payments.${index}.check_date`] && (
                    <div className="text-red-500 text-xs mt-1">{errors[`payments.${index}.check_date`]}</div>
                  )}
                </div>
              </div>
            )}

            <div className="md:col-span-3 mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                صورة الشيك
              </label>
              <div className="space-y-3">
                <div className="flex items-center gap-4">
                  <input
                    accept="image/*"
                    className="hidden"
                    id={`check-image-${payment.id}`}
                    type="file"
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null;
                      if (file) onCheckImageChange(payment.id, file);
                    }}
                  />
                  <label
                    htmlFor={`check-image-${payment.id}`}
                    className="cursor-pointer bg-[#58d2c8] text-white px-4 py-2 rounded-lg hover:bg-[#4AB8B3] transition-colors flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    رفع صورة الشيك
                  </label>
                  {payment.checkImage && (
                    <span className="text-sm text-gray-600">{payment.checkImage.name}</span>
                  )}
                  {payment.checkImagePath && !payment.checkImage && (
                    <span className="text-sm text-gray-600">صورة موجودة</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 bg-green-50 rounded-lg border border-green-200 mt-2">
        <div className="flex items-center justify-between">
          <span className="font-medium text-gray-700">إجمالي المدفوعات:</span>
          <span className="text-xl font-bold text-green-600">{totalPayments.toFixed(2)} ر.ع</span>
        </div>
      </div>
    </div>
  );
}

export default PaymentsSection;


