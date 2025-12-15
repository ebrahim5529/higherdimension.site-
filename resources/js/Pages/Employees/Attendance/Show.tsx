/** @jsxImportSource react */
import { Head, router } from '@inertiajs/react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, ArrowLeft, User, Calendar, Edit, CheckCircle, XCircle, AlertCircle, FileText } from 'lucide-react';

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

interface AttendanceShowProps {
  attendance: Attendance;
}

const statusLabels: Record<string, string> = {
  present: 'حاضر',
  absent: 'غائب',
  late: 'متأخر',
  half_day: 'نصف يوم',
  on_leave: 'في إجازة',
};

export default function AttendanceShow({ attendance }: AttendanceShowProps) {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'absent':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'late':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'half_day':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'on_leave':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'present':
        return <CheckCircle className="h-4 w-4" />;
      case 'absent':
        return <XCircle className="h-4 w-4" />;
      case 'late':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <DashboardLayout>
      <Head title={`${attendance.employeeName} - تفاصيل الحضور`} />
      <div className="space-y-6 mt-2 -mx-1 sm:-mx-2 lg:-mx-3 xl:-mx-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => router.visit('/employees/attendance')}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <Clock className="h-6 w-6" />
                تفاصيل الحضور
              </h1>
              <p className="text-muted-foreground">
                الموظف: {attendance.employeeName} ({attendance.employeeId})
              </p>
            </div>
          </div>
          <Button onClick={() => router.visit(`/employees/attendance/${attendance.id}/edit`)}>
            <Edit className="h-4 w-4" />
            تعديل
          </Button>
        </div>

        <div className="flex items-center gap-4">
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2 ${getStatusColor(attendance.status)}`}
          >
            {getStatusIcon(attendance.status)}
            {statusLabels[attendance.status]}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  معلومات الحضور
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">الموظف</label>
                    <div className="flex items-center gap-2 mt-1">
                      <User className="h-4 w-4" />
                      <p className="text-sm font-medium">{attendance.employeeName}</p>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{attendance.employeeId}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">المنصب</label>
                    <p className="text-sm mt-1">{attendance.position || '-'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">القسم</label>
                    <p className="text-sm mt-1">{attendance.department || '-'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">التاريخ</label>
                    <div className="flex items-center gap-2 mt-1">
                      <Calendar className="h-4 w-4" />
                      <p className="text-sm">{formatDate(attendance.date)}</p>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">وقت الدخول</label>
                    <p className="text-sm mt-1">{attendance.checkIn || '-'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">وقت الخروج</label>
                    <p className="text-sm mt-1">{attendance.checkOut || '-'}</p>
                  </div>
                  {attendance.notes && (
                    <div className="md:col-span-2">
                      <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        الملاحظات
                      </label>
                      <p className="text-sm mt-1 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">{attendance.notes}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6 mt-2 -mx-1 sm:-mx-2 lg:-mx-3 xl:-mx-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  ملخص الحضور
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">إجمالي الساعات</span>
                  <span className="font-bold text-lg text-[#913D95]">{attendance.totalHours || 0} ساعة</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">ساعات إضافية</span>
                  <span className="font-bold text-lg text-green-600">{attendance.overtime || 0} ساعة</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

