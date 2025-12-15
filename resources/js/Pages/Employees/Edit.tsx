/** @jsxImportSource react */
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { showToast } from '@/hooks/use-toast';
import { Users, Save, ArrowRight, X } from 'lucide-react';

interface Employee {
  id: number;
  employee_number: string;
  name: string;
  position: string;
  department: string;
  email: string;
  phone: string;
  hire_date: string;
  status: 'active' | 'inactive' | 'on_leave';
  total_salary: number;
}

interface EditEmployeeProps {
  employee: Employee;
}

export default function EditEmployee({ employee }: EditEmployeeProps) {
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
    employee_number: employee.employee_number || '',
    name: employee.name || '',
    position: employee.position || '',
    department: employee.department || '',
    email: employee.email || '',
    phone: employee.phone || '',
    hire_date: employee.hire_date || new Date().toISOString().split('T')[0],
    status: employee.status || ('active' as any),
    total_salary: employee.total_salary || 0,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    put(`/employees/${employee.id}`, {
      onSuccess: () => {
        showToast.success('تم التحديث بنجاح', 'تم تحديث بيانات الموظف بنجاح');
        router.visit('/employees');
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
      <Head title={`تعديل الموظف: ${employee.name}`} />
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => router.visit('/employees')}>
              <ArrowRight className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">تعديل موظف</h1>
              <p className="text-gray-600 dark:text-gray-400">تعديل بيانات الموظف</p>
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
                    رقم الموظف *
                  </label>
                  <Input
                    type="text"
                    value={data.employee_number}
                    onChange={(e) => setData('employee_number', e.target.value)}
                    placeholder="EMP001"
                    className={errors.employee_number ? 'border-red-500' : ''}
                  />
                  {errors.employee_number && (
                    <p className="text-red-500 text-xs mt-1">{errors.employee_number}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    الاسم الكامل *
                  </label>
                  <Input
                    type="text"
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                    placeholder="مثال: أحمد محمد العلي"
                    className={errors.name ? 'border-red-500' : ''}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    المنصب *
                  </label>
                  <Input
                    type="text"
                    value={data.position}
                    onChange={(e) => setData('position', e.target.value)}
                    placeholder="مثال: مدير المبيعات"
                    className={errors.position ? 'border-red-500' : ''}
                  />
                  {errors.position && (
                    <p className="text-red-500 text-xs mt-1">{errors.position}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    القسم *
                  </label>
                  <Input
                    type="text"
                    value={data.department}
                    onChange={(e) => setData('department', e.target.value)}
                    placeholder="مثال: المبيعات"
                    className={errors.department ? 'border-red-500' : ''}
                  />
                  {errors.department && (
                    <p className="text-red-500 text-xs mt-1">{errors.department}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    البريد الإلكتروني *
                  </label>
                  <Input
                    type="email"
                    value={data.email}
                    onChange={(e) => setData('email', e.target.value)}
                    placeholder="example@company.com"
                    className={errors.email ? 'border-red-500' : ''}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    رقم الهاتف
                  </label>
                  <Input
                    type="text"
                    value={data.phone}
                    onChange={(e) => setData('phone', e.target.value)}
                    placeholder="+968 9123 4567"
                    className={errors.phone ? 'border-red-500' : ''}
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    تاريخ التوظيف *
                  </label>
                  <Input
                    type="date"
                    value={data.hire_date}
                    onChange={(e) => setData('hire_date', e.target.value)}
                    className={errors.hire_date ? 'border-red-500' : ''}
                  />
                  {errors.hire_date && (
                    <p className="text-red-500 text-xs mt-1">{errors.hire_date}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    الحالة *
                  </label>
                  <select
                    value={data.status}
                    onChange={(e) => setData('status', e.target.value as any)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-800 dark:text-white"
                  >
                    <option value="active">نشط</option>
                    <option value="inactive">غير نشط</option>
                    <option value="on_leave">في إجازة</option>
                  </select>
                  {errors.status && (
                    <p className="text-red-500 text-xs mt-1">{errors.status}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    الراتب الإجمالي (ر.ع) *
                  </label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    value={data.total_salary}
                    onChange={(e) => setData('total_salary', parseFloat(e.target.value) || 0)}
                    placeholder="0.00"
                    className={errors.total_salary ? 'border-red-500' : ''}
                  />
                  {errors.total_salary && (
                    <p className="text-red-500 text-xs mt-1">{errors.total_salary}</p>
                  )}
                </div>
              </div>
            </div>

            {/* أزرار الإجراءات */}
            <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-200">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.visit('/employees')}
                disabled={processing}
                className="flex items-center gap-2"
              >
                <X className="h-4 w-4" />
                إلغاء
              </Button>
              <Button type="submit" disabled={processing} className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                {processing ? 'جاري الحفظ...' : 'تحديث الموظف'}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </DashboardLayout>
  );
}

