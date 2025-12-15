/** @jsxImportSource react */
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { showToast } from '@/hooks/use-toast';
import { Calendar, Save, ArrowLeft, User, FileText } from 'lucide-react';

interface Employee {
  id: number;
  employee_number: string;
  name: string;
}

interface CreateLeaveProps {
  employees: Employee[];
}

const leaveTypes = [
  { value: 'ANNUAL', label: 'سنوية' },
  { value: 'SICK', label: 'مرضية' },
  { value: 'EMERGENCY', label: 'طارئة' },
  { value: 'MATERNITY', label: 'أمومة' },
  { value: 'PATERNITY', label: 'أبوة' },
  { value: 'UNPAID', label: 'بدون راتب' },
  { value: 'OTHER', label: 'أخرى' },
];

export default function CreateLeave({ employees }: CreateLeaveProps) {
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
    leave_type: 'ANNUAL' as 'ANNUAL' | 'SICK' | 'EMERGENCY' | 'MATERNITY' | 'PATERNITY' | 'UNPAID' | 'OTHER',
    start_date: '',
    end_date: '',
    total_days: '',
    reason: '',
    status: 'PENDING' as 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED',
    applied_date: new Date().toISOString().split('T')[0],
    approved_by: '',
    approved_date: '',
    remaining_balance: '',
    notes: '',
  });

  // حساب عدد الأيام تلقائياً
  useEffect(() => {
    if (data.start_date && data.end_date) {
      const start = new Date(data.start_date);
      const end = new Date(data.end_date);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      if (diffDays > 0) {
        setData('total_days', diffDays.toString());
      }
    }
  }, [data.start_date, data.end_date]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const submitData = { ...data };
    if (!submitData.approved_by) delete submitData.approved_by;
    if (!submitData.approved_date) delete submitData.approved_date;
    if (!submitData.remaining_balance) delete submitData.remaining_balance;
    if (!submitData.notes) delete submitData.notes;
    
    post('/employees/leaves', {
      data: submitData,
      onSuccess: () => {
        showToast.success('تم الإنشاء بنجاح', 'تم إضافة الإجازة بنجاح');
        router.visit('/employees/leaves');
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
      <Head title="إضافة طلب إجازة جديد" />
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => router.visit('/employees/leaves')}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Calendar className="h-6 w-6" />
              إضافة طلب إجازة جديد
            </h1>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                معلومات الإجازة
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                <div>
                  <label className="block text-sm font-medium mb-1">
                    نوع الإجازة <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={data.leave_type}
                    onChange={(e) => setData('leave_type', e.target.value as any)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-800 dark:text-white"
                  >
                    {leaveTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    تاريخ البدء <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      type="date"
                      value={data.start_date}
                      onChange={(e) => setData('start_date', e.target.value)}
                      className={`pr-10 ${errors.start_date ? 'border-red-500' : ''}`}
                    />
                  </div>
                  {errors.start_date && <p className="text-red-500 text-xs mt-1">{errors.start_date}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    تاريخ الانتهاء <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      type="date"
                      value={data.end_date}
                      onChange={(e) => setData('end_date', e.target.value)}
                      min={data.start_date}
                      className={`pr-10 ${errors.end_date ? 'border-red-500' : ''}`}
                    />
                  </div>
                  {errors.end_date && <p className="text-red-500 text-xs mt-1">{errors.end_date}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    عدد الأيام <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="number"
                    min="1"
                    value={data.total_days}
                    onChange={(e) => setData('total_days', e.target.value)}
                    placeholder="0"
                    className={errors.total_days ? 'border-red-500' : ''}
                    readOnly
                  />
                  {errors.total_days && <p className="text-red-500 text-xs mt-1">{errors.total_days}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    تاريخ التقديم <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      type="date"
                      value={data.applied_date}
                      onChange={(e) => setData('applied_date', e.target.value)}
                      className={`pr-10 ${errors.applied_date ? 'border-red-500' : ''}`}
                    />
                  </div>
                  {errors.applied_date && <p className="text-red-500 text-xs mt-1">{errors.applied_date}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    الحالة <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={data.status}
                    onChange={(e) => setData('status', e.target.value as any)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-800 dark:text-white"
                  >
                    <option value="PENDING">في الانتظار</option>
                    <option value="APPROVED">موافق عليه</option>
                    <option value="REJECTED">مرفوض</option>
                    <option value="CANCELLED">ملغاة</option>
                  </select>
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

                <div>
                  <label className="block text-sm font-medium mb-1">الرصيد المتبقي</label>
                  <Input
                    type="number"
                    min="0"
                    value={data.remaining_balance}
                    onChange={(e) => setData('remaining_balance', e.target.value)}
                    placeholder="0"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">
                    السبب <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <FileText className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                    <textarea
                      value={data.reason}
                      onChange={(e) => setData('reason', e.target.value)}
                      rows={3}
                      className={`w-full px-3 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-800 dark:text-white ${
                        errors.reason ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      }`}
                      placeholder="أدخل سبب الإجازة"
                    />
                  </div>
                  {errors.reason && <p className="text-red-500 text-xs mt-1">{errors.reason}</p>}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">ملاحظات</label>
                  <textarea
                    value={data.notes}
                    onChange={(e) => setData('notes', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-800 dark:text-white"
                    placeholder="أدخل أي ملاحظات عن الإجازة"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex items-center justify-end gap-4 pt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.visit('/employees/leaves')}
              disabled={processing}
            >
              إلغاء
            </Button>
            <Button type="submit" disabled={processing} className="flex items-center gap-2 bg-[#913D95] hover:bg-[#7A2F7D]">
              <Save className="h-4 w-4" />
              {processing ? 'جاري الحفظ...' : 'حفظ الإجازة'}
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}

