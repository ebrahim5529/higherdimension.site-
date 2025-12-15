/** @jsxImportSource react */
import { Head, router } from '@inertiajs/react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Users,
  ArrowRight,
  Printer,
  Download,
  Edit,
  DollarSign,
  Mail,
  Phone,
  MapPin,
  Calendar,
} from 'lucide-react';

interface Employee {
  id: number;
  employeeId: string;
  name: string;
  arabicName?: string;
  email: string;
  phone?: string;
  mobile?: string;
  address?: string;
  city?: string;
  nationality?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female';
  maritalStatus?: 'single' | 'married' | 'divorced' | 'widowed';
  idNumber?: string;
  passportNumber?: string;
  position: string;
  department: string;
  manager?: string;
  location?: string;
  hireDate: string;
  contractType?: 'full_time' | 'part_time' | 'contract' | 'intern';
  workSchedule?: string;
  status: 'active' | 'inactive' | 'on_leave';
  basicSalary?: number;
  allowances?: number;
  totalSalary: number;
  currency?: string;
  paymentMethod?: 'bank_transfer' | 'cash' | 'check';
  bankAccount?: string;
  documents?: any[];
  notes?: string;
}

interface ShowEmployeeProps {
  employee: Employee;
}

export default function ShowEmployee({ employee }: ShowEmployeeProps) {
  const getStatusLabel = (status: string) => {
    const statuses: Record<string, string> = {
      active: 'نشط',
      inactive: 'غير نشط',
      on_leave: 'في إجازة',
    };
    return statuses[status] || status;
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      inactive: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      on_leave: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    };
    return colors[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
  };

  const formatDate = (date: string) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <DashboardLayout>
      <Head title={`تفاصيل الموظف: ${employee.name}`} />
      <div className="space-y-6 mt-2 -mx-1 sm:-mx-2 lg:-mx-3 xl:-mx-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => router.visit('/employees')}>
              <ArrowRight className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Users className="h-6 w-6" />
                تفاصيل الموظف: {employee.name}
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => window.print()}
              className="flex items-center gap-2"
            >
              <Printer className="h-4 w-4" />
              طباعة
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                // TODO: Implement export
                console.log('Export employee');
              }}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              تصدير
            </Button>
            <Button
              onClick={() => router.visit(`/employees/${employee.id}/edit`)}
              className="flex items-center gap-2"
            >
              <Edit className="h-4 w-4" />
              تعديل
            </Button>
          </div>
        </div>

        {/* المعلومات الأساسية */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              المعلومات الأساسية
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">رقم الموظف</label>
                <p className="text-sm font-mono text-gray-900 dark:text-white">{employee.employeeId}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">الاسم</label>
                <p className="text-sm text-gray-900 dark:text-white">{employee.name}</p>
              </div>
              {employee.arabicName && (
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">الاسم العربي</label>
                  <p className="text-sm text-gray-900 dark:text-white">{employee.arabicName}</p>
                </div>
              )}
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">المنصب</label>
                <p className="text-sm text-gray-900 dark:text-white">{employee.position}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">القسم</label>
                <p className="text-sm text-gray-900 dark:text-white">{employee.department}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">الحالة</label>
                <p>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(employee.status)}`}>
                    {getStatusLabel(employee.status)}
                  </span>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* معلومات الاتصال */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              معلومات الاتصال
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center gap-1">
                  <Mail className="h-3 w-3" />
                  البريد الإلكتروني
                </label>
                <p className="text-sm text-gray-900 dark:text-white">{employee.email}</p>
              </div>
              {employee.phone && (
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center gap-1">
                    <Phone className="h-3 w-3" />
                    رقم الهاتف
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">{employee.phone}</p>
                </div>
              )}
              {employee.mobile && (
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">الجوال</label>
                  <p className="text-sm text-gray-900 dark:text-white">{employee.mobile}</p>
                </div>
              )}
              {employee.address && (
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    العنوان
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">{employee.address}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* المعلومات الوظيفية */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              المعلومات الوظيفية
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">تاريخ التوظيف</label>
                <p className="text-sm text-gray-900 dark:text-white flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {formatDate(employee.hireDate)}
                </p>
              </div>
              {employee.manager && (
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">المدير</label>
                  <p className="text-sm text-gray-900 dark:text-white">{employee.manager}</p>
                </div>
              )}
              {employee.location && (
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">الموقع</label>
                  <p className="text-sm text-gray-900 dark:text-white">{employee.location}</p>
                </div>
              )}
              {employee.contractType && (
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">نوع العقد</label>
                  <p className="text-sm text-gray-900 dark:text-white">{employee.contractType}</p>
                </div>
              )}
              {employee.workSchedule && (
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">جدول العمل</label>
                  <p className="text-sm text-gray-900 dark:text-white">{employee.workSchedule}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* المعلومات المالية */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              المعلومات المالية
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {employee.basicSalary !== undefined && (
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">الراتب الأساسي</label>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {employee.basicSalary.toLocaleString()} {employee.currency || 'ر.ع'}
                  </p>
                </div>
              )}
              {employee.allowances !== undefined && (
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">البدلات</label>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {employee.allowances.toLocaleString()} {employee.currency || 'ر.ع'}
                  </p>
                </div>
              )}
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">الراتب الإجمالي</label>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {employee.totalSalary.toLocaleString()} {employee.currency || 'ر.ع'}
                </p>
              </div>
              {employee.paymentMethod && (
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">طريقة الدفع</label>
                  <p className="text-sm text-gray-900 dark:text-white">{employee.paymentMethod}</p>
                </div>
              )}
              {employee.bankAccount && (
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">رقم الحساب البنكي</label>
                  <p className="text-sm text-gray-900 dark:text-white">{employee.bankAccount}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* الملاحظات */}
        {employee.notes && (
          <Card>
            <CardHeader>
              <CardTitle>الملاحظات</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-900 dark:text-white whitespace-pre-wrap">{employee.notes}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}

