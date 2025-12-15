/** @jsxImportSource react */
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { showToast } from '@/hooks/use-toast';
import { TrendingUp, Save, ArrowLeft, User, Calendar, FileText } from 'lucide-react';
import { Combobox } from '@/components/ui/combobox';

interface Employee {
  id: number;
  employee_number: string;
  name: string;
}

interface IncentiveData {
  id: number;
  employee_id: number;
  incentive_type: 'performance' | 'bonus' | 'overtime' | 'commission' | 'other';
  amount: number;
  reason: string | null;
  date: string;
  status: 'approved' | 'pending' | 'rejected';
  approved_by: string | null;
  approved_date: string | null;
  notes: string | null;
}

interface EditIncentiveProps {
  incentive: IncentiveData;
  employees: Employee[];
}

const incentiveTypes = [
  { value: 'performance', label: 'أداء' },
  { value: 'bonus', label: 'مكافأة' },
  { value: 'overtime', label: 'ساعات إضافية' },
  { value: 'commission', label: 'عمولة' },
  { value: 'other', label: 'أخرى' },
];

export default function EditIncentive({ incentive, employees }: EditIncentiveProps) {
  const { flash } = usePage().props as any;

  useEffect(() => {
    if (flash?.success) {
      showToast.success('نجح', flash.success);
    }
    if (flash?.error) {
      showToast.error('خطأ', flash.error);
    }
  }, [flash]);

  const { data, setData, put, processing, errors } = useForm({
    employee_id: incentive.employee_id.toString(),
    incentive_type: incentive.incentive_type,
    amount: incentive.amount.toString(),
    reason: incentive.reason || '',
    date: incentive.date,
    status: incentive.status,
    approved_by: incentive.approved_by || '',
    approved_date: incentive.approved_date || '',
    notes: incentive.notes || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const submitData = { ...data };
    if (!submitData.approved_by) delete submitData.approved_by;
    if (!submitData.approved_date) delete submitData.approved_date;
    if (!submitData.notes) delete submitData.notes;
    
    put(`/employees/incentives/${incentive.id}`, {
      data: submitData,
      onSuccess: () => {
        showToast.success('تم التحديث بنجاح', 'تم تحديث الحافز بنجاح');
        router.visit(`/employees/incentives/${incentive.id}`);
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
      <Head title="تعديل الحافز" />
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => router.visit('/employees/incentives')}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <TrendingUp className="h-6 w-6" />
              تعديل الحافز
            </h1>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                معلومات الحافز
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    الموظف <span className="text-red-500">*</span>
                  </label>
                  <Combobox
                    options={employees.map((emp) => ({
                      value: emp.id.toString(),
                      label: `${emp.name} (${emp.employee_number})`,
                    }))}
                    value={data.employee_id}
                    onValueChange={(value) => setData('employee_id', value)}
                    placeholder="اختر الموظف"
                    searchPlaceholder="ابحث عن الموظف..."
                    emptyText="لا يوجد موظفين"
                    error={!!errors.employee_id}
                  />
                  {errors.employee_id && <p className="text-red-500 text-xs mt-1">{errors.employee_id}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    نوع الحافز <span className="text-red-500">*</span>
                  </label>
                  <Combobox
                    options={incentiveTypes.map((type) => ({
                      value: type.value,
                      label: type.label,
                    }))}
                    value={data.incentive_type}
                    onValueChange={(value) => setData('incentive_type', value as any)}
                    placeholder="اختر نوع الحافز"
                    searchPlaceholder="ابحث..."
                    emptyText="لا توجد نتائج"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    المبلغ <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    value={data.amount}
                    onChange={(e) => setData('amount', e.target.value)}
                    placeholder="0.00"
                    className={errors.amount ? 'border-red-500' : ''}
                  />
                  {errors.amount && <p className="text-red-500 text-xs mt-1">{errors.amount}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    التاريخ <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      type="date"
                      value={data.date}
                      onChange={(e) => setData('date', e.target.value)}
                      className={`pr-10 ${errors.date ? 'border-red-500' : ''}`}
                    />
                  </div>
                  {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date}</p>}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">السبب</label>
                  <div className="relative">
                    <FileText className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                    <textarea
                      value={data.reason}
                      onChange={(e) => setData('reason', e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-800 dark:text-white"
                      placeholder="أدخل سبب الحافز"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    الحالة <span className="text-red-500">*</span>
                  </label>
                  <Combobox
                    options={[
                      { value: 'pending', label: 'في الانتظار' },
                      { value: 'approved', label: 'موافق عليه' },
                      { value: 'rejected', label: 'مرفوض' },
                    ]}
                    value={data.status}
                    onValueChange={(value) => setData('status', value as 'approved' | 'pending' | 'rejected')}
                    placeholder="اختر الحالة"
                    searchPlaceholder="ابحث..."
                    emptyText="لا توجد نتائج"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">الموافق عليه من</label>
                  <Input
                    type="text"
                    value={data.approved_by}
                    onChange={(e) => setData('approved_by', e.target.value)}
                    placeholder="اسم الموافق"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">تاريخ الموافقة</label>
                  <div className="relative">
                    <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      type="date"
                      value={data.approved_date}
                      onChange={(e) => setData('approved_date', e.target.value)}
                      className="pr-10"
                    />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">ملاحظات</label>
                  <textarea
                    value={data.notes}
                    onChange={(e) => setData('notes', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-800 dark:text-white"
                    placeholder="أدخل أي ملاحظات عن الحافز"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex items-center justify-end gap-4 pt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.visit('/employees/incentives')}
              disabled={processing}
            >
              إلغاء
            </Button>
            <Button type="submit" disabled={processing} className="flex items-center gap-2 bg-[#913D95] hover:bg-[#7A2F7D]">
              <Save className="h-4 w-4" />
              {processing ? 'جاري الحفظ...' : 'حفظ التعديلات'}
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}

