/** @jsxImportSource react */
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { showToast } from '@/hooks/use-toast';
import { Clock, Save, ArrowLeft, User, Calendar, FileText } from 'lucide-react';
import { Combobox } from '@/components/ui/combobox';

interface Employee {
  id: number;
  employee_number: string;
  name: string;
}

interface CreateAttendanceProps {
  employees: Employee[];
}

export default function CreateAttendance({ employees }: CreateAttendanceProps) {
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
    date: new Date().toISOString().split('T')[0],
    check_in: '',
    check_out: '',
    total_hours: '',
    overtime: '',
    status: 'present' as 'present' | 'absent' | 'late' | 'half_day' | 'on_leave',
    notes: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const submitData = { ...data };
    if (!submitData.check_in) delete submitData.check_in;
    if (!submitData.check_out) delete submitData.check_out;
    if (!submitData.total_hours) delete submitData.total_hours;
    if (!submitData.overtime) delete submitData.overtime;
    if (!submitData.notes) delete submitData.notes;
    
    post('/employees/attendance', {
      data: submitData,
      onSuccess: () => {
        showToast.success('تم الإنشاء بنجاح', 'تم إضافة سجل الحضور بنجاح');
        router.visit('/employees/attendance');
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
      <Head title="إضافة سجل حضور جديد" />
      <div className="space-y-6 mt-2 -mx-1 sm:-mx-2 lg:-mx-3 xl:-mx-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => router.visit('/employees/attendance')}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Clock className="h-6 w-6" />
              إضافة سجل حضور جديد
            </h1>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                معلومات الحضور
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

                <div>
                  <label className="block text-sm font-medium mb-1">وقت الدخول</label>
                  <Input
                    type="time"
                    value={data.check_in}
                    onChange={(e) => setData('check_in', e.target.value)}
                    placeholder="HH:MM"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">وقت الخروج</label>
                  <Input
                    type="time"
                    value={data.check_out}
                    onChange={(e) => setData('check_out', e.target.value)}
                    placeholder="HH:MM"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">إجمالي الساعات</label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    value={data.total_hours}
                    onChange={(e) => setData('total_hours', e.target.value)}
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">ساعات إضافية</label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    value={data.overtime}
                    onChange={(e) => setData('overtime', e.target.value)}
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    الحالة <span className="text-red-500">*</span>
                  </label>
                  <Combobox
                    options={[
                      { value: 'present', label: 'حاضر' },
                      { value: 'absent', label: 'غائب' },
                      { value: 'late', label: 'متأخر' },
                      { value: 'half_day', label: 'نصف يوم' },
                      { value: 'on_leave', label: 'في إجازة' },
                    ]}
                    value={data.status}
                    onValueChange={(value) => setData('status', value as any)}
                    placeholder="اختر الحالة"
                    searchPlaceholder="ابحث..."
                    emptyText="لا توجد نتائج"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">ملاحظات</label>
                  <div className="relative">
                    <FileText className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                    <textarea
                      value={data.notes}
                      onChange={(e) => setData('notes', e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-800 dark:text-white"
                      placeholder="أدخل أي ملاحظات عن الحضور"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex items-center justify-end gap-4 pt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.visit('/employees/attendance')}
              disabled={processing}
            >
              إلغاء
            </Button>
            <Button type="submit" disabled={processing} className="flex items-center gap-2 bg-[#913D95] hover:bg-[#7A2F7D]">
              <Save className="h-4 w-4" />
              {processing ? 'جاري الحفظ...' : 'حفظ السجل'}
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}

