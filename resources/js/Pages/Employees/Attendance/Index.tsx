/** @jsxImportSource react */
import { Head, router, usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { showToast } from '@/hooks/use-toast';
import { Clock, BarChart3, Plus, Eye, Edit, Trash2, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';

interface Attendance {
  id: number;
  employeeId: string;
  employeeName: string;
  position: string;
  department: string;
  date: string;
  checkIn: string | null;
  checkOut: string | null;
  totalHours: number | null;
  overtime: number | null;
  status: 'present' | 'absent' | 'late' | 'half_day' | 'on_leave';
  notes: string | null;
}

interface AttendanceStats {
  totalRecords: number;
  presentCount: number;
  absentCount: number;
  lateCount: number;
  onLeaveCount: number;
  totalHours: number;
  totalOvertime: number;
}

interface AttendanceIndexProps {
  attendances: Attendance[];
  stats: AttendanceStats;
}

const statusLabels: Record<string, string> = {
  present: 'حاضر',
  absent: 'غائب',
  late: 'متأخر',
  half_day: 'نصف يوم',
  on_leave: 'في إجازة',
};

const statusColors: Record<string, string> = {
  present: 'bg-green-100 text-green-800',
  absent: 'bg-red-100 text-red-800',
  late: 'bg-yellow-100 text-yellow-800',
  half_day: 'bg-blue-100 text-blue-800',
  on_leave: 'bg-purple-100 text-purple-800',
};

export default function AttendanceIndex({ attendances, stats }: AttendanceIndexProps) {
  const { flash } = usePage().props as any;
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [attendanceToDelete, setAttendanceToDelete] = useState<{ id: number; name: string } | null>(null);

  useEffect(() => {
    if (flash?.success) {
      showToast.success('نجح', flash.success);
    }
    if (flash?.error) {
      showToast.error('خطأ', flash.error);
    }
  }, [flash]);

  const handleDelete = (id: number, employeeName: string) => {
    setAttendanceToDelete({ id, name: employeeName });
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (attendanceToDelete) {
      router.delete(`/employees/attendance/${attendanceToDelete.id}`, {
        onSuccess: () => {
          showToast.success('نجح', `تم حذف سجل الحضور بنجاح`);
          setDeleteDialogOpen(false);
          setAttendanceToDelete(null);
        },
        onError: (errors) => {
          showToast.error('فشل الحذف', errors?.message || 'حدث خطأ أثناء حذف سجل الحضور');
        },
      });
    }
  };

  return (
    <DashboardLayout>
      <Head title="الحضور والانصراف" />
      <div className="space-y-6 mt-2 -mx-1 sm:-mx-2 lg:-mx-3 xl:-mx-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">الحضور والانصراف</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={() => router.visit('/employees/attendance/reports')}
              variant="outline"
              className="flex items-center gap-2"
            >
              <FileText className="h-4 w-4" />
              التقارير
            </Button>
            <Button
              onClick={() => router.visit('/employees/attendance/create')}
              className="flex items-center gap-2 bg-[#913D95] hover:bg-[#7A2F7D]"
            >
              <Plus className="h-4 w-4" />
              إضافة سجل حضور
            </Button>
          </div>
        </div>

        {/* إحصائيات الحضور */}
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            <h2 className="text-xl font-semibold">إحصائيات الحضور</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-sm text-gray-600 mb-2">إجمالي السجلات</h3>
              <div className="text-2xl font-bold text-[#913D95]">{stats.totalRecords}</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-sm text-gray-600 mb-2">حاضر</h3>
              <div className="text-2xl font-bold text-green-600">{stats.presentCount}</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-sm text-gray-600 mb-2">غائب</h3>
              <div className="text-2xl font-bold text-red-600">{stats.absentCount}</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-sm text-gray-600 mb-2">إجمالي الساعات</h3>
              <div className="text-2xl font-bold text-[#913D95]">
                {stats.totalHours.toFixed(1)} ساعة
              </div>
            </div>
          </div>
        </div>

        {/* جدول الحضور */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6">
            <h2 className="text-lg font-semibold mb-4">قائمة الحضور</h2>
            {attendances.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-right text-sm font-medium text-gray-900">الموظف</th>
                      <th className="px-4 py-3 text-right text-sm font-medium text-gray-900">التاريخ</th>
                      <th className="px-4 py-3 text-right text-sm font-medium text-gray-900">وقت الدخول</th>
                      <th className="px-4 py-3 text-right text-sm font-medium text-gray-900">وقت الخروج</th>
                      <th className="px-4 py-3 text-right text-sm font-medium text-gray-900">الساعات</th>
                      <th className="px-4 py-3 text-right text-sm font-medium text-gray-900">الحالة</th>
                      <th className="px-4 py-3 text-right text-sm font-medium text-gray-900">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {attendances.map((attendance) => (
                      <tr key={attendance.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm">
                          <div>
                            <div className="font-medium">{attendance.employeeName}</div>
                            <div className="text-xs text-gray-500">{attendance.employeeId}</div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm">{attendance.date}</td>
                        <td className="px-4 py-3 text-sm">{attendance.checkIn || '-'}</td>
                        <td className="px-4 py-3 text-sm">{attendance.checkOut || '-'}</td>
                        <td className="px-4 py-3 text-sm">
                          {attendance.totalHours ? `${attendance.totalHours} ساعة` : '-'}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[attendance.status]}`}
                          >
                            {statusLabels[attendance.status]}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => router.visit(`/employees/attendance/${attendance.id}`)}
                              className="h-8 w-8 p-0"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => router.visit(`/employees/attendance/${attendance.id}/edit`)}
                              className="h-8 w-8 p-0"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(attendance.id, attendance.employeeName)}
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
              <p className="text-center text-gray-500 py-8">لا توجد سجلات حضور</p>
            )}
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={confirmDelete}
        title="تأكيد حذف سجل الحضور"
        description={`هل أنت متأكد من حذف سجل حضور الموظف "${attendanceToDelete?.name}"؟ لا يمكن التراجع عن هذا الإجراء.`}
        confirmText="حذف"
        cancelText="إلغاء"
        variant="danger"
      />
    </DashboardLayout>
  );
}
