import React from 'react';
import { RentalDetail, Scaffold } from '@/types/contracts';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScaffoldSelector } from '@/components/features/ScaffoldSelector';
import { convertArabicToEnglishNumbers } from '@/lib/utils';
import { Trash2, Plus } from 'lucide-react';

interface RentalsSectionProps {
  rentals: RentalDetail[];
  onAddRentalItem: () => void;
  onDeleteRentalItem: (id: string) => void;
  onUpdateRentalDetail: (id: string, field: keyof RentalDetail, value: any) => void;
  onScaffoldChange: (id: string, scaffold: Scaffold | null) => void;
  errors?: Record<string, string>;
}

export function RentalsSection({
  rentals,
  onAddRentalItem,
  onDeleteRentalItem,
  onUpdateRentalDetail,
  onScaffoldChange,
  errors = {},
}: RentalsSectionProps) {
  return (
    <Card className="p-6 mb-6">
      <div className="border-b border-gray-200 pb-4 mb-6 flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">تفاصيل الإيجار</h2>
        <Button
          type="button"
          onClick={onAddRentalItem}
          className="bg-[#58d2c8] hover:bg-[#4AB8B3] text-white flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          إضافة معدة
        </Button>
      </div>

      <div className="space-y-6">
        {errors.rental_details && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
            {errors.rental_details}
          </div>
        )}
        {rentals.map((rental, index) => (
          <div key={rental.id} className="border border-gray-200 rounded-lg p-6 bg-gray-50">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg">المعدة {index + 1}</h3>
              <button
                type="button"
                onClick={() => onDeleteRentalItem(rental.id)}
                className="text-red-600 hover:text-red-800 hover:bg-red-50 p-2 rounded-lg transition-colors"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* المعدة */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  المعدة *
                </label>
                <ScaffoldSelector
                  value={rental.scaffoldId}
                  onChange={(scaffold) => onScaffoldChange(rental.id, scaffold)}
                  disabled={false}
                />
                {errors[`rental_details.${index}.scaffold_id`] && (
                  <div className="text-red-500 text-xs mt-1">{errors[`rental_details.${index}.scaffold_id`]}</div>
                )}
              </div>

              {/* تاريخ بداية الإيجار */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  تاريخ بداية الإيجار *
                </label>
                <Input
                  type="date"
                  value={rental.startDate}
                  onChange={(e) => onUpdateRentalDetail(rental.id, 'startDate', e.target.value)}
                  className={`w-full bg-white ${errors[`rental_details.${index}.start_date`] ? 'border-red-500' : ''}`}
                  dir="ltr"
                  lang="en"
                  required
                />
                {errors[`rental_details.${index}.start_date`] && (
                  <div className="text-red-500 text-xs mt-1">{errors[`rental_details.${index}.start_date`]}</div>
                )}
              </div>

              {/* المدة */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  المدة *
                </label>
                <select
                  value={rental.durationType}
                  onChange={(e) => onUpdateRentalDetail(rental.id, 'durationType', e.target.value as 'daily' | 'monthly')}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#58d2c8] focus:border-transparent bg-white ${errors[`rental_details.${index}.duration_type`] ? 'border-red-500' : 'border-gray-300'}`}
                  required
                >
                  <option value="monthly">شهري</option>
                  <option value="daily">يومي</option>
                </select>
                {errors[`rental_details.${index}.duration_type`] && (
                  <div className="text-red-500 text-xs mt-1">{errors[`rental_details.${index}.duration_type`]}</div>
                )}
              </div>

              {/* عدد المدة */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {rental.durationType === 'monthly' ? 'اختر عدد الأشهر' : 'اختر عدد الأيام'} *
                </label>
                <Input
                  type="text"
                  value={rental.duration}
                  onChange={(e) => {
                    const convertedValue = convertArabicToEnglishNumbers(e.target.value);
                    e.target.value = convertedValue;
                    const value = convertedValue === '' ? 0 : Number(convertedValue) || 0;
                    onUpdateRentalDetail(rental.id, 'duration', value);
                  }}
                  placeholder={rental.durationType === 'monthly' ? 'بالأشهر' : 'بالأيام'}
                  dir="ltr"
                  lang="en"
                  required
                  className={`bg-white ${errors[`rental_details.${index}.duration`] ? 'border-red-500' : ''}`}
                />
                {errors[`rental_details.${index}.duration`] && (
                  <div className="text-red-500 text-xs mt-1">{errors[`rental_details.${index}.duration`]}</div>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  {rental.durationType === 'monthly' ? '(1 شهر = 30 يوم)' : 'حساب يومي'}
                </p>
              </div>

              {/* الكمية */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الكمية <span className="text-red-500">*</span>
                </label>
                <Input
                  type="text"
                  value={rental.quantity || ''}
                  onChange={(e) => {
                    const convertedValue = convertArabicToEnglishNumbers(e.target.value);
                    e.target.value = convertedValue;
                    const value = convertedValue === '' ? 0 : Number(convertedValue) || 0;
                    if (!isNaN(value) && value >= 0) {
                      onUpdateRentalDetail(rental.id, 'quantity', value);
                    }
                  }}
                  dir="ltr"
                  lang="en"
                  required
                  className={`bg-white ${errors[`rental_details.${index}.quantity`] ? 'border-red-500' : ''}`}
                  placeholder="أدخل الكمية"
                />
                {errors[`rental_details.${index}.quantity`] && (
                  <div className="text-red-500 text-xs mt-1">{errors[`rental_details.${index}.quantity`]}</div>
                )}
              </div>

              {/* الإيجار اليومي */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الإيجار اليومي (ر.ع)
                </label>
                <Input
                  type="text"
                  value={rental.dailyRate}
                  onChange={(e) => {
                    const convertedValue = convertArabicToEnglishNumbers(e.target.value);
                    e.target.value = convertedValue;
                    const value = convertedValue === '' ? 0 : Number(convertedValue) || 0;
                    onUpdateRentalDetail(rental.id, 'dailyRate', value);
                  }}
                  dir="ltr"
                  lang="en"
                  className={`bg-white ${errors[`rental_details.${index}.daily_rate`] ? 'border-red-500' : ''}`}
                  placeholder="0"
                />
                {errors[`rental_details.${index}.daily_rate`] && (
                  <div className="text-red-500 text-xs mt-1">{errors[`rental_details.${index}.daily_rate`]}</div>
                )}
              </div>

              {/* الإيجار الشهري */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الإيجار الشهري (ر.ع)
                </label>
                <Input
                  type="text"
                  value={rental.monthlyRate}
                  onChange={(e) => {
                    const convertedValue = convertArabicToEnglishNumbers(e.target.value);
                    e.target.value = convertedValue;
                    const value = convertedValue === '' ? 0 : Number(convertedValue) || 0;
                    onUpdateRentalDetail(rental.id, 'monthlyRate', value);
                  }}
                  dir="ltr"
                  lang="en"
                  className={`bg-white ${errors[`rental_details.${index}.monthly_rate`] ? 'border-red-500' : ''}`}
                  placeholder="0"
                />
                {errors[`rental_details.${index}.monthly_rate`] && (
                  <div className="text-red-500 text-xs mt-1">{errors[`rental_details.${index}.monthly_rate`]}</div>
                )}
              </div>

              {/* تاريخ النهاية - محسوب تلقائياً */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  تاريخ النهاية
                  <span className="text-xs text-gray-500 font-normal block mt-1">
                    محسوب تلقائياً من تاريخ بداية الإيجار *
                  </span>
                </label>
                <Input
                  type="date"
                  value={rental.endDate || ''}
                  className="w-full bg-gray-100"
                  dir="ltr"
                  lang="en"
                  readOnly
                  placeholder={rental.endDate ? '' : 'سيتم حسابه تلقائياً'}
                />
                {errors[`rental_details.${index}.end_date`] && (
                  <div className="text-red-500 text-xs mt-1">{errors[`rental_details.${index}.end_date`]}</div>
                )}
              </div>

              {/* الإجمالي */}
              <div className="md:col-span-2 lg:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الإجمالي (ر.ع)
                </label>
                <Input
                  type="text"
                  value={rental.total.toFixed(2)}
                  className="w-full bg-gray-100 font-bold text-[#58d2c8]"
                  dir="ltr"
                  lang="en"
                  readOnly
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

export default RentalsSection;


