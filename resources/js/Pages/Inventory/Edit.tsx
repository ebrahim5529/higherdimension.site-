/** @jsxImportSource react */
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { showToast } from '@/hooks/use-toast';
import { Package, Save, ArrowRight, X } from 'lucide-react';
import { scaffoldStatuses } from '@/data/inventoryData';

interface Scaffold {
  id: number;
  scaffoldNumber: string;
  quantity: number;
  descriptionAr: string;
  descriptionEn: string;
  dailyRentalPrice: number;
  monthlyRentalPrice: number;
  status?: string;
}

interface EditScaffoldProps {
  scaffold: Scaffold;
}

export default function EditScaffold({ scaffold }: EditScaffoldProps) {
  const { flash } = usePage().props as any;

  // عرض رسائل Flash من Laravel
  useEffect(() => {
    if (flash?.success) {
      showToast.success('نجح', flash.success);
    }
    if (flash?.error) {
      showToast.error('خطأ', flash.error);
    }
  }, [flash]);

  const { data, setData, put, processing, errors } = useForm({
    scaffold_number: scaffold.scaffoldNumber || '',
    quantity: scaffold.quantity || 1,
    description_ar: scaffold.descriptionAr || '',
    description_en: scaffold.descriptionEn || '',
    daily_rental_price: scaffold.dailyRentalPrice || 0,
    monthly_rental_price: scaffold.monthlyRentalPrice || 0,
    status: scaffold.status || 'AVAILABLE',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    put(`/inventory/${scaffold.id}`, {
      onSuccess: () => {
        showToast.success('تم التحديث بنجاح', 'تم تحديث بيانات المعدة بنجاح');
        router.visit('/inventory');
      },
      onError: (errors) => {
        if (errors.message) {
          showToast.error('خطأ في التحديث', errors.message);
        } else {
          showToast.error('خطأ في التحديث', 'يرجى التحقق من البيانات المدخلة');
        }
      },
    });
  };

  return (
    <DashboardLayout>
      <Head title={`تعديل المعدة: ${scaffold.scaffoldNumber}`} />
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => router.visit('/inventory')}>
              <ArrowRight className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">تعديل معدة</h1>
              <p className="text-gray-600 dark:text-gray-400">تعديل بيانات المعدة</p>
            </div>
          </div>
        </div>

        {/* النموذج */}
        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* المعلومات الأساسية */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
                المعلومات الأساسية
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    كود الصنف *
                  </label>
                  <Input
                    type="text"
                    value={data.scaffold_number}
                    onChange={(e) => setData('scaffold_number', e.target.value)}
                    placeholder="مثال: SCAF-001"
                    className={errors.scaffold_number ? 'border-red-500' : ''}
                  />
                  {errors.scaffold_number && (
                    <p className="text-red-500 text-xs mt-1">{errors.scaffold_number}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    الكمية *
                  </label>
                  <Input
                    type="number"
                    min="1"
                    value={data.quantity}
                    onChange={(e) => setData('quantity', parseInt(e.target.value) || 1)}
                    placeholder="1"
                    className={errors.quantity ? 'border-red-500' : ''}
                  />
                  {errors.quantity && (
                    <p className="text-red-500 text-xs mt-1">{errors.quantity}</p>
                  )}
                </div>
              </div>
            </div>

            {/* أوصاف الصنف */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
                أوصاف الصنف
              </h3>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    الوصف العربي للصنف *
                  </label>
                  <Input
                    type="text"
                    value={data.description_ar}
                    onChange={(e) => setData('description_ar', e.target.value)}
                    placeholder="مثال: معدة حديدية متعددة الطوابق"
                    className={errors.description_ar ? 'border-red-500' : ''}
                  />
                  {errors.description_ar && (
                    <p className="text-red-500 text-xs mt-1">{errors.description_ar}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    الوصف الإنجليزي للصنف *
                  </label>
                  <Input
                    type="text"
                    value={data.description_en}
                    onChange={(e) => setData('description_en', e.target.value)}
                    placeholder="Example: Multi-level Steel Scaffolding"
                    className={errors.description_en ? 'border-red-500' : ''}
                  />
                  {errors.description_en && (
                    <p className="text-red-500 text-xs mt-1">{errors.description_en}</p>
                  )}
                </div>
              </div>
            </div>

            {/* أسعار الإيجار */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
                أسعار الإيجار (ريال عماني)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    قيمة الإيجار اليومي *
                  </label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    value={data.daily_rental_price}
                    onChange={(e) => setData('daily_rental_price', parseFloat(e.target.value) || 0)}
                    placeholder="50.00"
                    className={errors.daily_rental_price ? 'border-red-500' : ''}
                  />
                  {errors.daily_rental_price && (
                    <p className="text-red-500 text-xs mt-1">{errors.daily_rental_price}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    قيمة الإيجار الشهري *
                  </label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    value={data.monthly_rental_price}
                    onChange={(e) => setData('monthly_rental_price', parseFloat(e.target.value) || 0)}
                    placeholder="1200.00"
                    className={errors.monthly_rental_price ? 'border-red-500' : ''}
                  />
                  {errors.monthly_rental_price && (
                    <p className="text-red-500 text-xs mt-1">{errors.monthly_rental_price}</p>
                  )}
                </div>
              </div>
            </div>

            {/* حالة المعدة */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
                حالة المعدة
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    الحالة *
                  </label>
                  <select
                    value={data.status}
                    onChange={(e) => setData('status', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-800 dark:text-white"
                  >
                    {scaffoldStatuses.map((status) => (
                      <option key={status.value} value={status.value}>
                        {status.label}
                      </option>
                    ))}
                  </select>
                  {errors.status && (
                    <p className="text-red-500 text-xs mt-1">{errors.status}</p>
                  )}
                </div>
              </div>
            </div>

            {/* أزرار الإجراءات */}
            <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-200">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.visit('/inventory')}
                disabled={processing}
                className="flex items-center gap-2"
              >
                <X className="h-4 w-4" />
                إلغاء
              </Button>
              <Button type="submit" disabled={processing} className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                {processing ? 'جاري الحفظ...' : 'تحديث المعدة'}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </DashboardLayout>
  );
}

