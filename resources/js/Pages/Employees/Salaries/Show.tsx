/** @jsxImportSource react */
import { Head, router } from '@inertiajs/react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DollarSign, ArrowLeft, User, Calendar, CreditCard, Edit, CheckCircle, XCircle, Clock, FileText } from 'lucide-react';

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
  notes: string | null;
}

interface SalaryShowProps {
  salary: Salary;
}

export default function SalaryShow({ salary }: SalaryShowProps) {
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
      case 'paid':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'overdue':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <CheckCircle className="h-4 w-4" />;
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'overdue':
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'paid':
        return 'مدفوعة';
      case 'pending':
        return 'في الانتظار';
      case 'overdue':
        return 'متأخرة';
      default:
        return status;
    }
  };

  const getPaymentMethodText = (method: string) => {
    switch (method) {
      case 'bank_transfer':
        return 'تحويل بنكي';
      case 'cash':
        return 'نقدي';
      case 'check':
        return 'شيك';
      default:
        return method;
    }
  };

  return (
    <DashboardLayout>
      <Head title={`${salary.employeeName} - تفاصيل الراتب`} />
      <div className="space-y-6 mt-2 -mx-1 sm:-mx-2 lg:-mx-3 xl:-mx-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => router.visit('/employees/salaries')}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <DollarSign className="h-6 w-6" />
                تفاصيل الراتب
              </h1>
              <p className="text-muted-foreground">
                الموظف: {salary.employeeName} ({salary.employeeId})
              </p>
            </div>
          </div>
          <Button onClick={() => router.visit(`/employees/salaries/${salary.id}/edit`)}>
            <Edit className="h-4 w-4" />
            تعديل
          </Button>
        </div>

        {/* Status */}
        <div className="flex items-center gap-4">
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2 ${getStatusColor(salary.status)}`}
          >
            {getStatusIcon(salary.status)}
            {getStatusText(salary.status)}
          </span>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Basic Information */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  معلومات الراتب
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">الموظف</label>
                    <div className="flex items-center gap-2 mt-1">
                      <User className="h-4 w-4" />
                      <p className="text-sm font-medium">{salary.employeeName}</p>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{salary.employeeId}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">المنصب</label>
                    <p className="text-sm mt-1">{salary.position || '-'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">القسم</label>
                    <p className="text-sm mt-1">{salary.department || '-'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">تاريخ الدفع</label>
                    <div className="flex items-center gap-2 mt-1">
                      <Calendar className="h-4 w-4" />
                      <p className="text-sm">{formatDate(salary.paymentDate)}</p>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">طريقة الدفع</label>
                    <div className="flex items-center gap-2 mt-1">
                      <CreditCard className="h-4 w-4" />
                      <p className="text-sm">{getPaymentMethodText(salary.paymentMethod)}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Salary Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  تفاصيل الراتب
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">الراتب الأساسي</label>
                    <p className="text-lg font-semibold mt-1">{formatCurrency(salary.basicSalary)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">البدلات</label>
                    <p className="text-lg font-semibold text-green-600 mt-1">+ {formatCurrency(salary.allowances)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">الخصومات</label>
                    <p className="text-lg font-semibold text-red-600 mt-1">- {formatCurrency(salary.deductions)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">الإجمالي</label>
                    <p className="text-2xl font-bold text-[#913D95] mt-1">{formatCurrency(salary.totalSalary)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Notes */}
            {salary.notes && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    الملاحظات
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 dark:text-gray-400 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    {salary.notes}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Summary Card */}
          <div className="space-y-6 mt-2 -mx-1 sm:-mx-2 lg:-mx-3 xl:-mx-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  ملخص الراتب
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">الراتب الأساسي</span>
                  <span className="font-medium">{formatCurrency(salary.basicSalary)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">البدلات</span>
                  <span className="font-medium text-green-600">+ {formatCurrency(salary.allowances)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">الخصومات</span>
                  <span className="font-medium text-red-600">- {formatCurrency(salary.deductions)}</span>
                </div>
                <div className="pt-2 border-t">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">الإجمالي</span>
                    <span className="font-bold text-lg text-[#913D95]">{formatCurrency(salary.totalSalary)}</span>
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

