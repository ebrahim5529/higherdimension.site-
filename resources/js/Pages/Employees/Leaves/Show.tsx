/** @jsxImportSource react */
import { Head, router } from '@inertiajs/react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, ArrowLeft, User, Edit, CheckCircle, XCircle, Clock, FileText } from 'lucide-react';

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
  notes: string | null;
}

interface LeaveShowProps {
  leave: Leave;
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

export default function LeaveShow({ leave }: LeaveShowProps) {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'REJECTED':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'CANCELLED':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return <CheckCircle className="h-4 w-4" />;
      case 'PENDING':
        return <Clock className="h-4 w-4" />;
      case 'REJECTED':
        return <XCircle className="h-4 w-4" />;
      case 'CANCELLED':
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return 'موافق عليه';
      case 'PENDING':
        return 'في الانتظار';
      case 'REJECTED':
        return 'مرفوض';
      case 'CANCELLED':
        return 'ملغاة';
      default:
        return status;
    }
  };

  return (
    <DashboardLayout>
      <Head title={`${leave.employeeName} - تفاصيل الإجازة`} />
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => router.visit('/employees/leaves')}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <Calendar className="h-6 w-6" />
                تفاصيل الإجازة
              </h1>
              <p className="text-muted-foreground">
                الموظف: {leave.employeeName} ({leave.employeeId})
              </p>
            </div>
          </div>
          <Button onClick={() => router.visit(`/employees/leaves/${leave.id}/edit`)}>
            <Edit className="h-4 w-4" />
            تعديل
          </Button>
        </div>

        <div className="flex items-center gap-4">
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2 ${getStatusColor(leave.status)}`}
          >
            {getStatusIcon(leave.status)}
            {getStatusText(leave.status)}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  معلومات الإجازة
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">الموظف</label>
                    <div className="flex items-center gap-2 mt-1">
                      <User className="h-4 w-4" />
                      <p className="text-sm font-medium">{leave.employeeName}</p>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{leave.employeeId}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">المنصب</label>
                    <p className="text-sm mt-1">{leave.position || '-'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">القسم</label>
                    <p className="text-sm mt-1">{leave.department || '-'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">نوع الإجازة</label>
                    <p className="text-sm mt-1">{leaveTypeLabels[leave.leaveType] || leave.leaveType}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">تاريخ البدء</label>
                    <div className="flex items-center gap-2 mt-1">
                      <Calendar className="h-4 w-4" />
                      <p className="text-sm">{formatDate(leave.startDate)}</p>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">تاريخ الانتهاء</label>
                    <div className="flex items-center gap-2 mt-1">
                      <Calendar className="h-4 w-4" />
                      <p className="text-sm">{formatDate(leave.endDate)}</p>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">تاريخ التقديم</label>
                    <div className="flex items-center gap-2 mt-1">
                      <Calendar className="h-4 w-4" />
                      <p className="text-sm">{formatDate(leave.appliedDate)}</p>
                    </div>
                  </div>
                  {leave.approvedBy && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">الموافق عليه من</label>
                      <p className="text-sm mt-1">{leave.approvedBy}</p>
                    </div>
                  )}
                  {leave.approvedDate && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">تاريخ الموافقة</label>
                      <div className="flex items-center gap-2 mt-1">
                        <Calendar className="h-4 w-4" />
                        <p className="text-sm">{formatDate(leave.approvedDate)}</p>
                      </div>
                    </div>
                  )}
                  {leave.reason && (
                    <div className="md:col-span-2">
                      <label className="text-sm font-medium text-muted-foreground">السبب</label>
                      <p className="text-sm mt-1 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">{leave.reason}</p>
                    </div>
                  )}
                  {leave.notes && (
                    <div className="md:col-span-2">
                      <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        الملاحظات
                      </label>
                      <p className="text-sm mt-1 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">{leave.notes}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  ملخص الإجازة
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">عدد الأيام</span>
                  <span className="font-bold text-lg text-[#913D95]">{leave.totalDays} يوم</span>
                </div>
                {leave.remainingBalance !== null && (
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">الرصيد المتبقي</span>
                    <span className="font-bold text-lg text-green-600">{leave.remainingBalance} يوم</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

