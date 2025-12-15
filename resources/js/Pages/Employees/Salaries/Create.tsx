/** @jsxImportSource react */
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { showToast } from '@/hooks/use-toast';
import { DollarSign, Save, ArrowLeft, User, Calendar, CreditCard } from 'lucide-react';
import { Combobox } from '@/components/ui/combobox';

interface Employee {
  id: number;
  employee_number: string;
  name: string;
}

interface CreateSalaryProps {
  employees: Employee[];
}

export default function CreateSalary({ employees }: CreateSalaryProps) {
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
    basic_salary: '',
    allowances: '0',
    deductions: '0',
    total_salary: '',
    payment_date: new Date().toISOString().split('T')[0],
    status: 'pending' as 'paid' | 'pending' | 'overdue',
    payment_method: 'bank_transfer' as 'bank_transfer' | 'cash' | 'check',
    notes: '',
  });

  // حساب الإجمالي تلقائياً
  useEffect(() => {
    const basic = parseFloat(data.basic_salary.toString()) || 0;
    const allowances = parseFloat(data.allowances.toString()) || 0;
    const deductions = parseFloat(data.deductions.toString()) || 0;
    const total = basic + allowances - deductions;
    setData('total_salary', total.toString());
  }, [data.basic_salary, data.allowances, data.deductions]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post('/employees/salaries', {
      onSuccess: () => {
        showToast.success('تم الإنشاء بنجاح', 'تم إضافة الراتب بنجاح');
        router.visit('/employees/salaries');
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
      <Head title="إضافة راتب جديد" />
      <div className="space-y-6 mt-2 -mx-1 sm:-mx-2 lg:-mx-3 xl:-mx-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => router.visit('/employees/salaries')}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <DollarSign className="h-6 w-6" />
                إضافة راتب جديد
              </h1>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* معلومات الراتب */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                معلومات الراتب
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* الموظف */}
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

                {/* تاريخ الدفع */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    تاريخ الدفع <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      type="date"
                      value={data.payment_date}
                      onChange={(e) => setData('payment_date', e.target.value)}
                      className={`pr-10 ${errors.payment_date ? 'border-red-500' : ''}`}
                    />
                  </div>
                  {errors.payment_date && <p className="text-red-500 text-xs mt-1">{errors.payment_date}</p>}
                </div>

                {/* الراتب الأساسي */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    الراتب الأساسي <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    value={data.basic_salary}
                    onChange={(e) => setData('basic_salary', e.target.value)}
                    placeholder="0.00"
                    className={errors.basic_salary ? 'border-red-500' : ''}
                  />
                  {errors.basic_salary && <p className="text-red-500 text-xs mt-1">{errors.basic_salary}</p>}
                </div>

                {/* البدلات */}
                <div>
                  <label className="block text-sm font-medium mb-1">البدلات</label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    value={data.allowances}
                    onChange={(e) => setData('allowances', e.target.value)}
                    placeholder="0.00"
                  />
                </div>

                {/* الخصومات */}
                <div>
                  <label className="block text-sm font-medium mb-1">الخصومات</label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    value={data.deductions}
                    onChange={(e) => setData('deductions', e.target.value)}
                    placeholder="0.00"
                  />
                </div>

                {/* الإجمالي */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    الإجمالي <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    value={data.total_salary}
                    onChange={(e) => setData('total_salary', e.target.value)}
                    placeholder="0.00"
                    className={`font-bold text-[#913D95] ${errors.total_salary ? 'border-red-500' : ''}`}
                    readOnly
                  />
                  {errors.total_salary && <p className="text-red-500 text-xs mt-1">{errors.total_salary}</p>}
                </div>

                {/* الحالة */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    الحالة <span className="text-red-500">*</span>
                  </label>
                  <Combobox
                    options={[
                      { value: 'pending', label: 'في الانتظار' },
                      { value: 'paid', label: 'مدفوعة' },
                      { value: 'overdue', label: 'متأخرة' },
                    ]}
                    value={data.status}
                    onValueChange={(value) => setData('status', value as 'paid' | 'pending' | 'overdue')}
                    placeholder="اختر الحالة"
                    searchPlaceholder="ابحث..."
                    emptyText="لا توجد نتائج"
                  />
                </div>

                {/* طريقة الدفع */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    طريقة الدفع <span className="text-red-500">*</span>
                  </label>
                  <Combobox
                    options={[
                      { value: 'bank_transfer', label: 'تحويل بنكي' },
                      { value: 'cash', label: 'نقدي' },
                      { value: 'check', label: 'شيك' },
                    ]}
                    value={data.payment_method}
                    onValueChange={(value) => setData('payment_method', value as 'bank_transfer' | 'cash' | 'check')}
                    placeholder="اختر طريقة الدفع"
                    searchPlaceholder="ابحث..."
                    emptyText="لا توجد نتائج"
                  />
                </div>

                {/* الملاحظات */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">ملاحظات</label>
                  <textarea
                    value={data.notes}
                    onChange={(e) => setData('notes', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-800 dark:text-white"
                    placeholder="أدخل أي ملاحظات عن الراتب"
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
              onClick={() => router.visit('/employees/salaries')}
              disabled={processing}
            >
              إلغاء
            </Button>
            <Button type="submit" disabled={processing} className="flex items-center gap-2 bg-[#913D95] hover:bg-[#7A2F7D]">
              <Save className="h-4 w-4" />
              {processing ? 'جاري الحفظ...' : 'حفظ الراتب'}
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}

