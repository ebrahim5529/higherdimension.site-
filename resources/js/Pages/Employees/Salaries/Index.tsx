/** @jsxImportSource react */
import { Head, router, usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { showToast } from '@/hooks/use-toast';
import { DollarSign, BarChart3, Plus, Eye, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';

interface Salary {
  id: number;
  employeeId: string;
  employeeName: string;
  position: string;
  department: string;
  basicSalary: number;
  allowances: number;
  deductions: number;
  totalSalary: number;
  paymentDate: string;
  status: 'paid' | 'pending' | 'overdue';
  paymentMethod: 'bank_transfer' | 'cash' | 'check';
}

interface SalaryStats {
  totalSalaries: number;
  totalAmount: number;
  paidSalaries: number;
  pendingSalaries: number;
  overdueSalaries: number;
  averageSalary: number;
}

interface SalariesIndexProps {
  salaries: Salary[];
  stats: SalaryStats;
}

export default function SalariesIndex({ salaries, stats }: SalariesIndexProps) {
  const { flash } = usePage().props as any;
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [salaryToDelete, setSalaryToDelete] = useState<{ id: number; name: string } | null>(null);

  useEffect(() => {
    if (flash?.success) {
      showToast.success('نجح', flash.success);
    }
    if (flash?.error) {
      showToast.error('خطأ', flash.error);
    }
  }, [flash]);

  const handleDelete = (id: number, employeeName: string) => {
    setSalaryToDelete({ id, name: employeeName });
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (salaryToDelete) {
      router.delete(`/employees/salaries/${salaryToDelete.id}`, {
        onSuccess: () => {
          showToast.success('نجح', `تم حذف الراتب بنجاح`);
          setDeleteDialogOpen(false);
          setSalaryToDelete(null);
        },
        onError: (errors) => {
          showToast.error('فشل الحذف', errors?.message || 'حدث خطأ أثناء حذف الراتب');
        },
      });
    }
  };

  return (
    <DashboardLayout>
      <Head title="الرواتب" />
      <div className="space-y-6 mt-2 -mx-1 sm:-mx-2 lg:-mx-3 xl:-mx-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">الرواتب</h1>
          </div>
          <Button
            onClick={() => router.visit('/employees/salaries/create')}
            className="flex items-center gap-2 bg-[#913D95] hover:bg-[#7A2F7D]"
          >
            <Plus className="h-4 w-4" />
            إضافة راتب جديد
          </Button>
        </div>

        {/* إحصائيات الرواتب */}
        <div className="space-y-6 mt-2 -mx-1 sm:-mx-2 lg:-mx-3 xl:-mx-4">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            <h2 className="text-xl font-semibold">إحصائيات الرواتب</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-sm text-gray-600 mb-2">إجمالي الرواتب</h3>
              <div className="text-2xl font-bold text-[#913D95]">{stats.totalSalaries}</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-sm text-gray-600 mb-2">إجمالي المبلغ</h3>
              <div className="text-2xl font-bold text-[#913D95]">
                {stats.totalAmount.toLocaleString()} ر.ع
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-sm text-gray-600 mb-2">مدفوعة</h3>
              <div className="text-2xl font-bold text-green-600">{stats.paidSalaries}</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-sm text-gray-600 mb-2">متوسطة الراتب</h3>
              <div className="text-2xl font-bold text-[#913D95]">
                {stats.averageSalary.toLocaleString()} ر.ع
              </div>
            </div>
          </div>
        </div>

        {/* جدول الرواتب */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6">
            <h2 className="text-lg font-semibold mb-4">قائمة الرواتب</h2>
            {salaries.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-right text-sm font-medium text-gray-900">الموظف</th>
                      <th className="px-4 py-3 text-right text-sm font-medium text-gray-900">الراتب الأساسي</th>
                      <th className="px-4 py-3 text-right text-sm font-medium text-gray-900">البدلات</th>
                      <th className="px-4 py-3 text-right text-sm font-medium text-gray-900">الخصومات</th>
                      <th className="px-4 py-3 text-right text-sm font-medium text-gray-900">الإجمالي</th>
                      <th className="px-4 py-3 text-right text-sm font-medium text-gray-900">تاريخ الدفع</th>
                      <th className="px-4 py-3 text-right text-sm font-medium text-gray-900">الحالة</th>
                      <th className="px-4 py-3 text-right text-sm font-medium text-gray-900">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {salaries.map((salary) => (
                      <tr key={salary.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm">
                          <div>
                            <div className="font-medium">{salary.employeeName}</div>
                            <div className="text-xs text-gray-500">{salary.employeeId}</div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm">{salary.basicSalary.toLocaleString()} ر.ع</td>
                        <td className="px-4 py-3 text-sm">{salary.allowances.toLocaleString()} ر.ع</td>
                        <td className="px-4 py-3 text-sm">{salary.deductions.toLocaleString()} ر.ع</td>
                        <td className="px-4 py-3 text-sm font-medium text-[#913D95]">
                          {salary.totalSalary.toLocaleString()} ر.ع
                        </td>
                        <td className="px-4 py-3 text-sm">{salary.paymentDate}</td>
                        <td className="px-4 py-3 text-sm">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              salary.status === 'paid'
                                ? 'bg-green-100 text-green-800'
                                : salary.status === 'pending'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {salary.status === 'paid' ? 'مدفوعة' : salary.status === 'pending' ? 'في الانتظار' : 'متأخرة'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => router.visit(`/employees/salaries/${salary.id}`)}
                              className="h-8 w-8 p-0"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => router.visit(`/employees/salaries/${salary.id}/edit`)}
                              className="h-8 w-8 p-0"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(salary.id, salary.employeeName)}
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
              <p className="text-center text-gray-500 py-8">لا توجد رواتب</p>
            )}
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={confirmDelete}
        title="تأكيد حذف الراتب"
        description={`هل أنت متأكد من حذف راتب الموظف "${salaryToDelete?.name}"؟ لا يمكن التراجع عن هذا الإجراء.`}
        confirmText="حذف"
        cancelText="إلغاء"
        variant="danger"
      />
    </DashboardLayout>
  );
}

