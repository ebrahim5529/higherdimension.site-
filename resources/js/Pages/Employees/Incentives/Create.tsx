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

interface Employee {
  id: number;
  employee_number: string;
  name: string;
}

interface CreateIncentiveProps {
  employees: Employee[];
}

const incentiveTypes = [
  { value: 'performance', label: 'أداء' },
  { value: 'bonus', label: 'مكافأة' },
  { value: 'overtime', label: 'ساعات إضافية' },
  { value: 'commission', label: 'عمولة' },
  { value: 'other', label: 'أخرى' },
];

export default function CreateIncentive({ employees }: CreateIncentiveProps) {
  const { flash } = usePage().props as any;

  useEffect(() => {
    if (flash?.success) {
      showToast.success('نجح', flash.success);
    }
    if (flash?.error) {
      showToast.error('خطأ', flash.error);
    }
  }, [flash]);

  const { data, setData, post, processing, errors } = useForm({
    employee_id: '',
    incentive_type: 'performance' as 'performance' | 'bonus' | 'overtime' | 'commission' | 'other',
    amount: '',
    reason: '',
    date: new Date().toISOString().split('T')[0],
    status: 'pending' as 'approved' | 'pending' | 'rejected',
    approved_by: '',
    approved_date: '',
    notes: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const submitData = { ...data };
    if (!submitData.approved_by) delete submitData.approved_by;
    if (!submitData.approved_date) delete submitData.approved_date;
    if (!submitData.notes) delete submitData.notes;
    
    post('/employees/incentives', {
      data: submitData,
      onSuccess: () => {
        showToast.success('تم الإنشاء بنجاح', 'تم إضافة الحافز بنجاح');
        router.visit('/employees/incentives');
      },
      onError: (errors) => {
        if (errors.message) {
          showToast.error('خطأ في الإنشاء', errors.message);
        } else {
          showToast.error('خطأ في الإنشاء', 'يرجى التحقق من البيانات المدخلة');
        }
      },
    });
  };

  return (
    <DashboardLayout>
      <Head title="إضافة حافز جديد" />
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => router.visit('/employees/incentives')}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <TrendingUp className="h-6 w-6" />
                إضافة حافز جديد
              </h1>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* معلومات الحافز */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                معلومات الحافز
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* الموظف */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    الموظف <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <select
                      value={data.employee_id}
                      onChange={(e) => setData('employee_id', e.target.value)}
                      className={`w-full px-3 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-800 dark:text-white ${
                        errors.employee_id ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      }`}
                    >
                      <option value="">اختر الموظف</option>
                      {employees.map((employee) => (
                        <option key={employee.id} value={employee.id}>
                          {employee.name} ({employee.employee_number})
                        </option>
                      ))}
                    </select>
                  </div>
                  {errors.employee_id && <p className="text-red-500 text-xs mt-1">{errors.employee_id}</p>}
                </div>

                {/* نوع الحافز */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    نوع الحافز <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={data.incentive_type}
                    onChange={(e) => setData('incentive_type', e.target.value as any)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-800 dark:text-white"
                  >
                    {incentiveTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* المبلغ */}
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

                {/* التاريخ */}
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

                {/* السبب */}
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

                {/* الحالة */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    الحالة <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={data.status}
                    onChange={(e) => setData('status', e.target.value as 'approved' | 'pending' | 'rejected')}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-800 dark:text-white"
                  >
                    <option value="pending">في الانتظار</option>
                    <option value="approved">موافق عليه</option>
                    <option value="rejected">مرفوض</option>
                  </select>
                </div>

                {/* الموافق عليه من */}
                <div>
                  <label className="block text-sm font-medium mb-1">الموافق عليه من</label>
                  <Input
                    type="text"
                    value={data.approved_by}
                    onChange={(e) => setData('approved_by', e.target.value)}
                    placeholder="اسم الموافق"
                  />
                </div>

                {/* تاريخ الموافقة */}
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

                {/* الملاحظات */}
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

          {/* أزرار الإجراءات */}
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
              {processing ? 'جاري الحفظ...' : 'حفظ الحافز'}
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}

