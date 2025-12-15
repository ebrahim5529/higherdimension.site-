/** @jsxImportSource react */
import { Head, router, usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { showToast } from '@/hooks/use-toast';
import { TrendingUp, BarChart3, Plus, Eye, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';

interface Incentive {
  id: number;
  employeeId: string;
  employeeName: string;
  position: string;
  department: string;
  incentiveType: string;
  amount: number;
  reason: string | null;
  date: string;
  status: 'approved' | 'pending' | 'rejected';
  approvedBy: string | null;
  approvedDate: string | null;
}

interface IncentiveStats {
  totalIncentives: number;
  totalAmount: number;
  approvedIncentives: number;
  pendingIncentives: number;
  rejectedIncentives: number;
  averageAmount: number;
}

interface IncentivesIndexProps {
  incentives: Incentive[];
  stats: IncentiveStats;
}

const incentiveTypeLabels: Record<string, string> = {
  performance: 'أداء',
  bonus: 'مكافأة',
  overtime: 'ساعات إضافية',
  commission: 'عمولة',
  other: 'أخرى',
};

const statusLabels: Record<string, string> = {
  approved: 'موافق عليه',
  pending: 'في الانتظار',
  rejected: 'مرفوض',
};

const statusColors: Record<string, string> = {
  approved: 'bg-green-100 text-green-800',
  pending: 'bg-yellow-100 text-yellow-800',
  rejected: 'bg-red-100 text-red-800',
};

export default function IncentivesIndex({ incentives, stats }: IncentivesIndexProps) {
  const { flash } = usePage().props as any;
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [incentiveToDelete, setIncentiveToDelete] = useState<{ id: number; name: string } | null>(null);

  useEffect(() => {
    if (flash?.success) {
      showToast.success('نجح', flash.success);
    }
    if (flash?.error) {
      showToast.error('خطأ', flash.error);
    }
  }, [flash]);

  const handleDelete = (id: number, employeeName: string) => {
    setIncentiveToDelete({ id, name: employeeName });
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (incentiveToDelete) {
      router.delete(`/employees/incentives/${incentiveToDelete.id}`, {
        onSuccess: () => {
          showToast.success('نجح', `تم حذف الحافز بنجاح`);
          setDeleteDialogOpen(false);
          setIncentiveToDelete(null);
        },
        onError: (errors) => {
          showToast.error('فشل الحذف', errors?.message || 'حدث خطأ أثناء حذف الحافز');
        },
      });
    }
  };

  return (
    <DashboardLayout>
      <Head title="الحوافز" />
      <div className="space-y-6 mt-2 -mx-1 sm:-mx-2 lg:-mx-3 xl:-mx-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">الحوافز</h1>
          </div>
          <Button
            onClick={() => router.visit('/employees/incentives/create')}
            className="flex items-center gap-2 bg-[#913D95] hover:bg-[#7A2F7D]"
          >
            <Plus className="h-4 w-4" />
            إضافة حافز جديد
          </Button>
        </div>

        {/* إحصائيات الحوافز */}
        <div className="space-y-6 mt-2 -mx-1 sm:-mx-2 lg:-mx-3 xl:-mx-4">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            <h2 className="text-xl font-semibold">إحصائيات الحوافز</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-sm text-gray-600 mb-2">إجمالي الحوافز</h3>
              <div className="text-2xl font-bold text-[#913D95]">{stats.totalIncentives}</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-sm text-gray-600 mb-2">إجمالي المبلغ</h3>
              <div className="text-2xl font-bold text-[#913D95]">
                {stats.totalAmount.toLocaleString()} ر.ع
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-sm text-gray-600 mb-2">موافق عليها</h3>
              <div className="text-2xl font-bold text-green-600">{stats.approvedIncentives}</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-sm text-gray-600 mb-2">متوسط المبلغ</h3>
              <div className="text-2xl font-bold text-[#913D95]">
                {stats.averageAmount.toLocaleString()} ر.ع
              </div>
            </div>
          </div>
        </div>

        {/* جدول الحوافز */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6">
            <h2 className="text-lg font-semibold mb-4">قائمة الحوافز</h2>
            {incentives.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-right text-sm font-medium text-gray-900">الموظف</th>
                      <th className="px-4 py-3 text-right text-sm font-medium text-gray-900">نوع الحافز</th>
                      <th className="px-4 py-3 text-right text-sm font-medium text-gray-900">المبلغ</th>
                      <th className="px-4 py-3 text-right text-sm font-medium text-gray-900">التاريخ</th>
                      <th className="px-4 py-3 text-right text-sm font-medium text-gray-900">الحالة</th>
                      <th className="px-4 py-3 text-right text-sm font-medium text-gray-900">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {incentives.map((incentive) => (
                      <tr key={incentive.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm">
                          <div>
                            <div className="font-medium">{incentive.employeeName}</div>
                            <div className="text-xs text-gray-500">{incentive.employeeId}</div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          {incentiveTypeLabels[incentive.incentiveType] || incentive.incentiveType}
                        </td>
                        <td className="px-4 py-3 text-sm font-medium text-[#913D95]">
                          {incentive.amount.toLocaleString()} ر.ع
                        </td>
                        <td className="px-4 py-3 text-sm">{incentive.date}</td>
                        <td className="px-4 py-3 text-sm">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[incentive.status]}`}
                          >
                            {statusLabels[incentive.status]}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => router.visit(`/employees/incentives/${incentive.id}`)}
                              className="h-8 w-8 p-0"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => router.visit(`/employees/incentives/${incentive.id}/edit`)}
                              className="h-8 w-8 p-0"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(incentive.id, incentive.employeeName)}
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
              <p className="text-center text-gray-500 py-8">لا توجد حوافز</p>
            )}
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={confirmDelete}
        title="تأكيد حذف الحافز"
        description={`هل أنت متأكد من حذف حافز الموظف "${incentiveToDelete?.name}"؟ لا يمكن التراجع عن هذا الإجراء.`}
        confirmText="حذف"
        cancelText="إلغاء"
        variant="danger"
      />
    </DashboardLayout>
  );
}
