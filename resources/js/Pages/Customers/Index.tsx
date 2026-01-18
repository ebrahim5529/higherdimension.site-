/** @jsxImportSource react */
import { Head, router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { CustomerStats } from '@/components/features/CustomerStats';
import { CustomersTable } from '@/components/features/CustomersTable';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { showToast } from '@/hooks/use-toast';
import { BarChart3 } from 'lucide-react';

interface Customer {
  id: number;
  customerNumber: string;
  name: string;
  nationality: string;
  customerType: 'INDIVIDUAL' | 'COMPANY';
  idNumber: string;
  phone: string;
  email: string;
  status: 'ACTIVE' | 'INACTIVE';
  registrationDate: string;
  contractsCount: number;
  totalPayments: number;
  pendingAmount: number;
  hasWarnings: boolean;
}

interface CustomerStatsType {
  totalCustomers: number;
  activeCustomers: number;
  inactiveCustomers: number;
  individualCustomers: number;
  companyCustomers: number;
  totalContracts: number;
  totalPayments: number;
  totalPendingAmount: number;
  customersWithWarnings: number;
  nationalityDistribution: Record<string, number>;
  monthlyRegistrations: Record<string, number>;
}

interface CustomersIndexProps {
  customers: Customer[];
  stats: CustomerStatsType;
}

export default function CustomersIndex({ customers, stats }: CustomersIndexProps) {
  const { flash } = usePage().props as any;
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState<{ id: string; name: string } | null>(null);

  // عرض رسائل Flash من Laravel
  useEffect(() => {
    if (flash?.success) {
      showToast.success('نجح', flash.success);
    }
    if (flash?.error) {
      showToast.error('خطأ', flash.error);
    }
  }, [flash]);

  // تحويل بيانات العملاء إلى تنسيق CustomersTable
  const tableData = customers.map((customer) => ({
    id: customer.id.toString(),
    customerNumber: customer.customerNumber,
    name: customer.name,
    customerType: customer.customerType,
    nationality: customer.nationality,
    status: customer.status,
    registrationDate: new Date(customer.registrationDate),
    email: customer.email,
    contractsCount: customer.contractsCount,
  }));

  const handleAddCustomer = () => {
    router.visit('/customers/create');
  };

  const handleEditCustomer = (customer: { id: string }) => {
    router.visit(`/customers/${customer.id}/edit`);
  };

  const handleDeleteCustomer = (customer: { id: string; name: string }) => {
    setCustomerToDelete(customer);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (customerToDelete) {
      router.delete(`/customers/${customerToDelete.id}`, {
        onSuccess: () => {
          showToast.success('تم الحذف بنجاح', `تم حذف العميل "${customerToDelete.name}" بنجاح`);
          setDeleteDialogOpen(false);
          setCustomerToDelete(null);
        },
        onError: (errors) => {
          showToast.error('فشل الحذف', errors?.message || 'حدث خطأ أثناء حذف العميل');
        },
      });
    }
  };

  const handleViewCustomer = (customer: { id: string }) => {
    router.visit(`/customers/${customer.id}`);
  };

  const handleExportCustomers = () => {
    showToast.info('قريباً', 'سيتم إضافة ميزة التصدير قريباً');
  };

  return (
    <DashboardLayout>
      <Head title="إدارة العملاء" />
      <div className="w-full space-y-6 mt-2 -mx-1 sm:-mx-2 lg:-mx-3 xl:-mx-4">
        {/* العنوان */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            <h2 className="text-xl font-semibold">العملاء</h2>
          </div>
        </div>

        {/* إحصائيات العملاء */}
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            <h2 className="text-xl font-semibold">إحصائيات العملاء</h2>
          </div>
          <CustomerStats stats={stats} />
        </div>

        {/* جدول العملاء */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            <h2 className="text-xl font-semibold">قائمة العملاء</h2>
          </div>
          <CustomersTable
            data={tableData}
            onAddCustomer={handleAddCustomer}
            onEditCustomer={handleEditCustomer}
            onDeleteCustomer={handleDeleteCustomer}
            onViewCustomer={handleViewCustomer}
            onExportCustomers={handleExportCustomers}
          />
        </div>

        {/* Confirm Delete Dialog */}
        <ConfirmDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          onConfirm={confirmDelete}
          title="تأكيد حذف العميل"
          description={`هل أنت متأكد من حذف العميل "${customerToDelete?.name}"؟ لا يمكن التراجع عن هذا الإجراء.`}
          confirmText="حذف"
          cancelText="إلغاء"
          variant="danger"
        />
      </div>
    </DashboardLayout>
  );
}
