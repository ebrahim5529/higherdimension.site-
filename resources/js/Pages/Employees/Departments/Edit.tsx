/** @jsxImportSource react */
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { showToast } from '@/hooks/use-toast';
import { Building2, Save, ArrowLeft, User, MapPin, DollarSign } from 'lucide-react';
import { Combobox } from '@/components/ui/combobox';

interface Manager {
  id: number;
  employee_number: string;
  name: string;
  position: string;
}

interface DepartmentData {
  id: number;
  name: string;
  code: string;
  manager_id: number | null;
  description: string | null;
  status: 'ACTIVE' | 'INACTIVE';
  location: string | null;
  budget: number;
}

interface EditDepartmentProps {
  department: DepartmentData;
  managers: Manager[];
}

export default function EditDepartment({ department, managers }: EditDepartmentProps) {
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
    name: department.name,
    code: department.code,
    manager_id: department.manager_id?.toString() || '',
    description: department.description || '',
    status: department.status,
    location: department.location || '',
    budget: department.budget.toString(),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const submitData = { ...data };
    if (!submitData.manager_id) delete submitData.manager_id;
    if (!submitData.description) delete submitData.description;
    if (!submitData.location) delete submitData.location;
    
    put(`/employees/departments/${department.id}`, {
      data: submitData,
      onSuccess: () => {
        showToast.success('تم التحديث بنجاح', 'تم تحديث القسم بنجاح');
        router.visit(`/employees/departments/${department.id}`);
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
      <Head title="تعديل القسم" />
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => router.visit('/employees/departments')}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Building2 className="h-6 w-6" />
              تعديل القسم
            </h1>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                معلومات القسم
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    اسم القسم <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="text"
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                    placeholder="أدخل اسم القسم"
                    className={errors.name ? 'border-red-500' : ''}
                  />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    رمز القسم <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="text"
                    value={data.code}
                    onChange={(e) => setData('code', e.target.value)}
                    placeholder="أدخل رمز القسم"
                    className={errors.code ? 'border-red-500' : ''}
                  />
                  {errors.code && <p className="text-red-500 text-xs mt-1">{errors.code}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">المدير</label>
                  <Combobox
                    options={managers.map((mgr) => ({
                      value: mgr.id.toString(),
                      label: `${mgr.name} (${mgr.position})`,
                    }))}
                    value={data.manager_id}
                    onValueChange={(value) => setData('manager_id', value)}
                    placeholder="اختر المدير"
                    searchPlaceholder="ابحث عن المدير..."
                    emptyText="لا يوجد مديرين"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    الحالة <span className="text-red-500">*</span>
                  </label>
                  <Combobox
                    options={[
                      { value: 'ACTIVE', label: 'نشط' },
                      { value: 'INACTIVE', label: 'غير نشط' },
                    ]}
                    value={data.status}
                    onValueChange={(value) => setData('status', value as 'ACTIVE' | 'INACTIVE')}
                    placeholder="اختر الحالة"
                    searchPlaceholder="ابحث..."
                    emptyText="لا توجد نتائج"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">الموقع</label>
                  <div className="relative">
                    <MapPin className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      type="text"
                      value={data.location}
                      onChange={(e) => setData('location', e.target.value)}
                      placeholder="أدخل موقع القسم"
                      className="pr-10"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">الميزانية</label>
                  <div className="relative">
                    <DollarSign className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      value={data.budget}
                      onChange={(e) => setData('budget', e.target.value)}
                      placeholder="0.00"
                      className="pr-10"
                    />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">الوصف</label>
                  <textarea
                    value={data.description}
                    onChange={(e) => setData('description', e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-800 dark:text-white"
                    placeholder="أدخل وصف القسم"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex items-center justify-end gap-4 pt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.visit('/employees/departments')}
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

