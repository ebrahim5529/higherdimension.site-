/** @jsxImportSource react */
import { Head, router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { EmployeeStats } from '@/components/features/EmployeeStats';
import { EmployeesTable } from '@/components/features/EmployeesTable';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { showToast } from '@/hooks/use-toast';
import { Users, BarChart3, TrendingUp, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Employee {
  id: number;
  employeeId: string;
  name: string;
  position: string;
  department: string;
  email: string;
  phone: string;
  hireDate: string;
  status: 'active' | 'inactive' | 'on_leave';
  salary: number;
  manager: string;
  location: string;
}

interface EmployeeStatsType {
  totalEmployees: number;
  activeEmployees: number;
  inactiveEmployees: number;
  onLeaveEmployees: number;
  newHiresThisMonth: number;
  averageSalary: number;
  totalSalaryCost: number;
}

interface EmployeesIndexProps {
  employees: Employee[];
  stats: EmployeeStatsType;
}

export default function EmployeesIndex({ employees, stats }: EmployeesIndexProps) {
  const { flash } = usePage().props as any;
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState<{ id: number; name: string } | null>(null);

  // عرض رسائل Flash من Laravel
  useEffect(() => {
    if (flash?.success) {
      showToast.success('نجح', flash.success);
    }
    if (flash?.error) {
      showToast.error('خطأ', flash.error);
    }
  }, [flash]);

  // تحويل بيانات الموظفين إلى تنسيق EmployeesTable
  const tableData = employees.map((employee) => ({
    id: employee.id.toString(),
    employeeId: employee.employeeId,
    name: employee.name,
    position: employee.position,
    department: employee.department,
    email: employee.email,
    phone: employee.phone,
    hireDate: employee.hireDate,
    status: employee.status,
    salary: employee.salary,
    manager: employee.manager,
    location: employee.location,
  }));

  const handleAddEmployee = () => {
    router.visit('/employees/create');
  };

  const handleEditEmployee = (employee: { id: string }) => {
    router.visit(`/employees/${employee.id}/edit`);
  };

  const handleDeleteEmployee = (employee: { id: string; name: string }) => {
    setEmployeeToDelete({ id: parseInt(employee.id), name: employee.name });
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (employeeToDelete) {
      router.delete(`/employees/${employeeToDelete.id}`, {
        onSuccess: () => {
          showToast.success('تم الحذف بنجاح', `تم حذف الموظف "${employeeToDelete.name}" بنجاح`);
          setDeleteDialogOpen(false);
          setEmployeeToDelete(null);
        },
        onError: (errors) => {
          showToast.error('فشل الحذف', errors?.message || 'حدث خطأ أثناء حذف الموظف');
        },
      });
    }
  };

  const handleViewEmployee = (employee: { id: string }) => {
    router.visit(`/employees/${employee.id}`);
  };

  const handleExportEmployees = () => {
    showToast.info('تصدير البيانات', 'جارٍ تصدير بيانات الموظفين...');
    // Implement actual export logic here
  };

  return (
    <DashboardLayout>
      <Head title="إدارة الموظفين" />
      <div className="w-full space-y-6 mt-2 -mx-1 sm:-mx-2 lg:-mx-3 xl:-mx-4">
        {/* العنوان */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            <h2 className="text-xl font-semibold">الموظفين</h2>
          </div>
          <Button
            onClick={handleAddEmployee}
            className="flex items-center gap-2 bg-[#913D95] hover:bg-[#7A2F7D]"
          >
            <Plus className="h-4 w-4" />
            إضافة موظف جديد
          </Button>
        </div>

        {/* إحصائيات الموظفين */}
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            <h2 className="text-xl font-semibold">إحصائيات الموظفين</h2>
          </div>
          <EmployeeStats stats={stats} />
        </div>

        {/* جدول الموظفين */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            <h2 className="text-xl font-semibold">قائمة الموظفين</h2>
          </div>
          <EmployeesTable
            data={tableData}
            onAddEmployee={handleAddEmployee}
            onEditEmployee={handleEditEmployee}
            onDeleteEmployee={handleDeleteEmployee}
            onViewEmployee={handleViewEmployee}
            onExportEmployees={handleExportEmployees}
          />
        </div>

        {/* Confirm Delete Dialog */}
        <ConfirmDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          onConfirm={confirmDelete}
          title="تأكيد حذف الموظف"
          description={`هل أنت متأكد من حذف الموظف "${employeeToDelete?.name}"؟ لا يمكن التراجع عن هذا الإجراء.`}
          confirmText="حذف"
          cancelText="إلغاء"
          variant="danger"
        />
      </div>
    </DashboardLayout>
  );
}

