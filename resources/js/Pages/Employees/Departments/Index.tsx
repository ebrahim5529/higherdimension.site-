/** @jsxImportSource react */
import { Head, router, usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { showToast } from '@/hooks/use-toast';
import { Building2, BarChart3, Plus, Eye, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';

interface Department {
  id: number;
  name: string;
  code: string;
  managerId: number | null;
  managerName: string;
  employeeCount: number;
  description: string | null;
  status: 'ACTIVE' | 'INACTIVE';
  location: string | null;
  budget: number;
}

interface DepartmentStats {
  totalDepartments: number;
  activeDepartments: number;
  inactiveDepartments: number;
  totalEmployees: number;
  totalBudget: number;
}

interface DepartmentsIndexProps {
  departments: Department[];
  stats: DepartmentStats;
}

const statusLabels: Record<string, string> = {
  ACTIVE: 'نشط',
  INACTIVE: 'غير نشط',
};

const statusColors: Record<string, string> = {
  ACTIVE: 'bg-green-100 text-green-800',
  INACTIVE: 'bg-red-100 text-red-800',
};

export default function DepartmentsIndex({ departments, stats }: DepartmentsIndexProps) {
  const { flash } = usePage().props as any;
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [departmentToDelete, setDepartmentToDelete] = useState<{ id: number; name: string } | null>(null);

  useEffect(() => {
    if (flash?.success) {
      showToast.success('نجح', flash.success);
    }
    if (flash?.error) {
      showToast.error('خطأ', flash.error);
    }
  }, [flash]);

  const handleDelete = (id: number, name: string) => {
    setDepartmentToDelete({ id, name });
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (departmentToDelete) {
      router.delete(`/employees/departments/${departmentToDelete.id}`, {
        onSuccess: () => {
          showToast.success('نجح', `تم حذف القسم بنجاح`);
          setDeleteDialogOpen(false);
          setDepartmentToDelete(null);
        },
        onError: (errors) => {
          showToast.error('فشل الحذف', errors?.message || 'حدث خطأ أثناء حذف القسم');
        },
      });
    }
  };

  return (
    <DashboardLayout>
      <Head title="الأقسام" />
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">الأقسام</h1>
          </div>
          <Button
            onClick={() => router.visit('/employees/departments/create')}
            className="flex items-center gap-2 bg-[#913D95] hover:bg-[#7A2F7D]"
          >
            <Plus className="h-4 w-4" />
            إضافة قسم جديد
          </Button>
        </div>

        {/* إحصائيات الأقسام */}
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            <h2 className="text-xl font-semibold">إحصائيات الأقسام</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-sm text-gray-600 mb-2">إجمالي الأقسام</h3>
              <div className="text-2xl font-bold text-[#913D95]">{stats.totalDepartments}</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-sm text-gray-600 mb-2">نشطة</h3>
              <div className="text-2xl font-bold text-green-600">{stats.activeDepartments}</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-sm text-gray-600 mb-2">إجمالي الموظفين</h3>
              <div className="text-2xl font-bold text-[#913D95]">{stats.totalEmployees}</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-sm text-gray-600 mb-2">إجمالي الميزانية</h3>
              <div className="text-2xl font-bold text-[#913D95]">
                {stats.totalBudget.toLocaleString()} ر.ع
              </div>
            </div>
          </div>
        </div>

        {/* جدول الأقسام */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6">
            <h2 className="text-lg font-semibold mb-4">قائمة الأقسام</h2>
            {departments.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-right text-sm font-medium text-gray-900">اسم القسم</th>
                      <th className="px-4 py-3 text-right text-sm font-medium text-gray-900">الكود</th>
                      <th className="px-4 py-3 text-right text-sm font-medium text-gray-900">المدير</th>
                      <th className="px-4 py-3 text-right text-sm font-medium text-gray-900">عدد الموظفين</th>
                      <th className="px-4 py-3 text-right text-sm font-medium text-gray-900">الميزانية</th>
                      <th className="px-4 py-3 text-right text-sm font-medium text-gray-900">الحالة</th>
                      <th className="px-4 py-3 text-right text-sm font-medium text-gray-900">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {departments.map((department) => (
                      <tr key={department.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm font-medium">{department.name}</td>
                        <td className="px-4 py-3 text-sm text-gray-500">{department.code}</td>
                        <td className="px-4 py-3 text-sm">{department.managerName}</td>
                        <td className="px-4 py-3 text-sm">{department.employeeCount}</td>
                        <td className="px-4 py-3 text-sm">
                          {department.budget.toLocaleString()} ر.ع
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[department.status]}`}
                          >
                            {statusLabels[department.status]}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => router.visit(`/employees/departments/${department.id}`)}
                              className="h-8 w-8 p-0"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => router.visit(`/employees/departments/${department.id}/edit`)}
                              className="h-8 w-8 p-0"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(department.id, department.name)}
                              className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-center text-gray-500 py-8">لا توجد أقسام</p>
            )}
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={confirmDelete}
        title="تأكيد حذف القسم"
        description={`هل أنت متأكد من حذف القسم "${departmentToDelete?.name}"؟ لا يمكن التراجع عن هذا الإجراء.`}
        confirmText="حذف"
        cancelText="إلغاء"
        variant="danger"
      />
    </DashboardLayout>
  );
}
