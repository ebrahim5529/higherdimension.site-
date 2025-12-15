/** @jsxImportSource react */
import { Head, router } from '@inertiajs/react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building2, ArrowLeft, User, MapPin, Edit, CheckCircle, XCircle, DollarSign, Users } from 'lucide-react';

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

interface DepartmentShowProps {
  department: Department;
}

export default function DepartmentShow({ department }: DepartmentShowProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'OMR',
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'INACTIVE':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return <CheckCircle className="h-4 w-4" />;
      case 'INACTIVE':
        return <XCircle className="h-4 w-4" />;
      default:
        return <XCircle className="h-4 w-4" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'نشط';
      case 'INACTIVE':
        return 'غير نشط';
      default:
        return status;
    }
  };

  return (
    <DashboardLayout>
      <Head title={`${department.name} - تفاصيل القسم`} />
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => router.visit('/employees/departments')}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <Building2 className="h-6 w-6" />
                {department.name}
              </h1>
              <p className="text-muted-foreground">رمز القسم: {department.code}</p>
            </div>
          </div>
          <Button onClick={() => router.visit(`/employees/departments/${department.id}/edit`)}>
            <Edit className="h-4 w-4" />
            تعديل
          </Button>
        </div>

        <div className="flex items-center gap-4">
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2 ${getStatusColor(department.status)}`}
          >
            {getStatusIcon(department.status)}
            {getStatusText(department.status)}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  معلومات القسم
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">اسم القسم</label>
                    <p className="text-sm font-medium mt-1">{department.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">رمز القسم</label>
                    <p className="text-sm font-mono mt-1">{department.code}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">المدير</label>
                    <div className="flex items-center gap-2 mt-1">
                      <User className="h-4 w-4" />
                      <p className="text-sm">{department.managerName}</p>
                    </div>
                  </div>
                  {department.location && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">الموقع</label>
                      <div className="flex items-center gap-2 mt-1">
                        <MapPin className="h-4 w-4" />
                        <p className="text-sm">{department.location}</p>
                      </div>
                    </div>
                  )}
                  {department.description && (
                    <div className="md:col-span-2">
                      <label className="text-sm font-medium text-muted-foreground">الوصف</label>
                      <p className="text-sm mt-1 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">{department.description}</p>
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
                  <Users className="h-5 w-5" />
                  ملخص القسم
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">عدد الموظفين</span>
                  <span className="font-bold text-lg text-[#913D95]">{department.employeeCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">الميزانية</span>
                  <span className="font-bold text-lg text-[#913D95]">{formatCurrency(department.budget)}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

