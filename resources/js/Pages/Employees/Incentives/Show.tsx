/** @jsxImportSource react */
import { Head, router } from '@inertiajs/react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, ArrowLeft, User, Calendar, Edit, CheckCircle, XCircle, Clock, FileText, DollarSign } from 'lucide-react';

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
  notes: string | null;
}

interface IncentiveShowProps {
  incentive: Incentive;
}

const incentiveTypeLabels: Record<string, string> = {
  performance: 'أداء',
  bonus: 'مكافأة',
  overtime: 'ساعات إضافية',
  commission: 'عمولة',
  other: 'أخرى',
};

export default function IncentiveShow({ incentive }: IncentiveShowProps) {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'OMR',
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-4 w-4" />;
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'rejected':
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved':
        return 'موافق عليه';
      case 'pending':
        return 'في الانتظار';
      case 'rejected':
        return 'مرفوض';
      default:
        return status;
    }
  };

  return (
    <DashboardLayout>
      <Head title={`${incentive.employeeName} - تفاصيل الحافز`} />
      <div className="space-y-6 mt-2 -mx-1 sm:-mx-2 lg:-mx-3 xl:-mx-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => router.visit('/employees/incentives')}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <TrendingUp className="h-6 w-6" />
                تفاصيل الحافز
              </h1>
              <p className="text-muted-foreground">
                الموظف: {incentive.employeeName} ({incentive.employeeId})
              </p>
            </div>
          </div>
          <Button onClick={() => router.visit(`/employees/incentives/${incentive.id}/edit`)}>
            <Edit className="h-4 w-4" />
            تعديل
          </Button>
        </div>

        <div className="flex items-center gap-4">
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2 ${getStatusColor(incentive.status)}`}
          >
            {getStatusIcon(incentive.status)}
            {getStatusText(incentive.status)}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  معلومات الحافز
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">الموظف</label>
                    <div className="flex items-center gap-2 mt-1">
                      <User className="h-4 w-4" />
                      <p className="text-sm font-medium">{incentive.employeeName}</p>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{incentive.employeeId}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">المنصب</label>
                    <p className="text-sm mt-1">{incentive.position || '-'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">القسم</label>
                    <p className="text-sm mt-1">{incentive.department || '-'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">نوع الحافز</label>
                    <p className="text-sm mt-1">{incentiveTypeLabels[incentive.incentiveType] || incentive.incentiveType}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">التاريخ</label>
                    <div className="flex items-center gap-2 mt-1">
                      <Calendar className="h-4 w-4" />
                      <p className="text-sm">{formatDate(incentive.date)}</p>
                    </div>
                  </div>
                  {incentive.approvedBy && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">الموافق عليه من</label>
                      <p className="text-sm mt-1">{incentive.approvedBy}</p>
                    </div>
                  )}
                  {incentive.approvedDate && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">تاريخ الموافقة</label>
                      <div className="flex items-center gap-2 mt-1">
                        <Calendar className="h-4 w-4" />
                        <p className="text-sm">{formatDate(incentive.approvedDate)}</p>
                      </div>
                    </div>
                  )}
                  {incentive.reason && (
                    <div className="md:col-span-2">
                      <label className="text-sm font-medium text-muted-foreground">السبب</label>
                      <p className="text-sm mt-1 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">{incentive.reason}</p>
                    </div>
                  )}
                  {incentive.notes && (
                    <div className="md:col-span-2">
                      <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        الملاحظات
                      </label>
                      <p className="text-sm mt-1 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">{incentive.notes}</p>
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
                  <DollarSign className="h-5 w-5" />
                  ملخص الحافز
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">المبلغ</span>
                  <span className="font-bold text-lg text-[#913D95]">{formatCurrency(incentive.amount)}</span>
                </div>
                <div className="pt-2 border-t">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">الإجمالي</span>
                    <span className="font-bold text-xl text-[#913D95]">{formatCurrency(incentive.amount)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

