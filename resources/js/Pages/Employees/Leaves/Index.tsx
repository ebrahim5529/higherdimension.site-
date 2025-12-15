/** @jsxImportSource react */
import { Head, router, usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { showToast } from '@/hooks/use-toast';
import { Calendar, BarChart3, Plus, Eye, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';

interface Leave {
  id: number;
  employeeId: string;
  employeeName: string;
  position: string;
  department: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  totalDays: number;
  reason: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';
  appliedDate: string;
  approvedBy: string | null;
  approvedDate: string | null;
  remainingBalance: number | null;
}

interface LeaveStats {
  totalLeaves: number;
  pendingLeaves: number;
  approvedLeaves: number;
  rejectedLeaves: number;
  cancelledLeaves: number;
  totalDays: number;
}

interface LeavesIndexProps {
  leaves: Leave[];
  stats: LeaveStats;
}

const leaveTypeLabels: Record<string, string> = {
  ANNUAL: 'سنوية',
  SICK: 'مرضية',
  EMERGENCY: 'طارئة',
  MATERNITY: 'أمومة',
  PATERNITY: 'أبوة',
  UNPAID: 'بدون راتب',
  OTHER: 'أخرى',
};

const statusLabels: Record<string, string> = {
  PENDING: 'في الانتظار',
  APPROVED: 'موافق عليها',
  REJECTED: 'مرفوضة',
  CANCELLED: 'ملغاة',
};

const statusColors: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  APPROVED: 'bg-green-100 text-green-800',
  REJECTED: 'bg-red-100 text-red-800',
  CANCELLED: 'bg-gray-100 text-gray-800',
};

export default function LeavesIndex({ leaves, stats }: LeavesIndexProps) {
  const { flash } = usePage().props as any;
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [leaveToDelete, setLeaveToDelete] = useState<{ id: number; name: string } | null>(null);

  useEffect(() => {
    if (flash?.success) {
      showToast.success('نجح', flash.success);
    }
    if (flash?.error) {
      showToast.error('خطأ', flash.error);
    }
  }, [flash]);

  const handleDelete = (id: number, employeeName: string) => {
    setLeaveToDelete({ id, name: employeeName });
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (leaveToDelete) {
      router.delete(`/employees/leaves/${leaveToDelete.id}`, {
        onSuccess: () => {
          showToast.success('نجح', `تم حذف الإجازة بنجاح`);
          setDeleteDialogOpen(false);
          setLeaveToDelete(null);
        },
        onError: (errors) => {
          showToast.error('فشل الحذف', errors?.message || 'حدث خطأ أثناء حذف الإجازة');
        },
      });
    }
  };

  return (
    <DashboardLayout>
      <Head title="الإجازات" />
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">الإجازات</h1>
          </div>
          <Button
            onClick={() => router.visit('/employees/leaves/create')}
            className="flex items-center gap-2 bg-[#913D95] hover:bg-[#7A2F7D]"
          >
            <Plus className="h-4 w-4" />
            إضافة إجازة جديدة
          </Button>
        </div>

        {/* إحصائيات الإجازات */}
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            <h2 className="text-xl font-semibold">إحصائيات الإجازات</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-sm text-gray-600 mb-2">إجمالي الإجازات</h3>
              <div className="text-2xl font-bold text-[#913D95]">{stats.totalLeaves}</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-sm text-gray-600 mb-2">في الانتظار</h3>
              <div className="text-2xl font-bold text-yellow-600">{stats.pendingLeaves}</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-sm text-gray-600 mb-2">موافق عليها</h3>
              <div className="text-2xl font-bold text-green-600">{stats.approvedLeaves}</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-sm text-gray-600 mb-2">إجمالي الأيام</h3>
              <div className="text-2xl font-bold text-[#913D95]">{stats.totalDays} يوم</div>
            </div>
          </div>
        </div>

        {/* جدول الإجازات */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6">
            <h2 className="text-lg font-semibold mb-4">قائمة الإجازات</h2>
            {leaves.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-right text-sm font-medium text-gray-900">الموظف</th>
                      <th className="px-4 py-3 text-right text-sm font-medium text-gray-900">نوع الإجازة</th>
                      <th className="px-4 py-3 text-right text-sm font-medium text-gray-900">من تاريخ</th>
                      <th className="px-4 py-3 text-right text-sm font-medium text-gray-900">إلى تاريخ</th>
                      <th className="px-4 py-3 text-right text-sm font-medium text-gray-900">عدد الأيام</th>
                      <th className="px-4 py-3 text-right text-sm font-medium text-gray-900">الحالة</th>
                      <th className="px-4 py-3 text-right text-sm font-medium text-gray-900">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {leaves.map((leave) => (
                      <tr key={leave.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm">
                          <div>
                            <div className="font-medium">{leave.employeeName}</div>
                            <div className="text-xs text-gray-500">{leave.employeeId}</div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          {leaveTypeLabels[leave.leaveType] || leave.leaveType}
                        </td>
                        <td className="px-4 py-3 text-sm">{leave.startDate}</td>
                        <td className="px-4 py-3 text-sm">{leave.endDate}</td>
                        <td className="px-4 py-3 text-sm">{leave.totalDays} يوم</td>
                        <td className="px-4 py-3 text-sm">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[leave.status]}`}
                          >
                            {statusLabels[leave.status]}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => router.visit(`/employees/leaves/${leave.id}`)}
                              className="h-8 w-8 p-0"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => router.visit(`/employees/leaves/${leave.id}/edit`)}
                              className="h-8 w-8 p-0"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(leave.id, leave.employeeName)}
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
              <p className="text-center text-gray-500 py-8">لا توجد إجازات</p>
            )}
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={confirmDelete}
        title="تأكيد حذف الإجازة"
        description={`هل أنت متأكد من حذف إجازة الموظف "${leaveToDelete?.name}"؟ لا يمكن التراجع عن هذا الإجراء.`}
        confirmText="حذف"
        cancelText="إلغاء"
        variant="danger"
      />
    </DashboardLayout>
  );
}
