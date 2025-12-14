/** @jsxImportSource react */
import { Head, router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { SupplierStats } from '@/components/features/SupplierStats';
import { SuppliersTable } from '@/components/features/SuppliersTable';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { showToast } from '@/hooks/use-toast';
import { BarChart3 } from 'lucide-react';

interface Supplier {
  id: number;
  supplierNumber: string;
  name: string;
  nationality: string;
  supplierType: 'INDIVIDUAL' | 'COMPANY';
  idNumber: string;
  phone: string;
  email: string;
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  registrationDate: string;
  invoicesCount: number;
  totalInvoices: number;
  paidAmount: number;
  pendingAmount: number;
  overdueAmount: number;
  purchasesCount: number;
  totalPurchases: number;
  rating: number;
  hasWarnings: boolean;
}

interface SupplierStatsType {
  totalSuppliers: number;
  activeSuppliers: number;
  inactiveSuppliers: number;
  suspendedSuppliers: number;
  individualSuppliers: number;
  companySuppliers: number;
  totalInvoices: number;
  totalInvoiceAmount: number;
  paidAmount: number;
  pendingAmount: number;
  overdueAmount: number;
  totalPurchases: number;
  totalPurchaseAmount: number;
  suppliersWithWarnings: number;
  averageRating: number;
  nationalityDistribution: Record<string, number>;
  monthlyRegistrations: Record<string, number>;
}

interface SuppliersIndexProps {
  suppliers: Supplier[];
  stats: SupplierStatsType;
}

export default function SuppliersIndex({ suppliers, stats }: SuppliersIndexProps) {
  const { flash } = usePage().props as any;
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [supplierToDelete, setSupplierToDelete] = useState<{ id: string; name: string } | null>(null);

  // عرض رسائل Flash من Laravel
  useEffect(() => {
    if (flash?.success) {
      showToast.success('نجح', flash.success);
    }
    if (flash?.error) {
      showToast.error('خطأ', flash.error);
    }
  }, [flash]);

  // تحويل بيانات الموردين إلى تنسيق SuppliersTable
  const tableData = suppliers.map((supplier) => ({
    id: supplier.id.toString(),
    supplierNumber: supplier.supplierNumber,
    name: supplier.name,
    supplierType: supplier.supplierType,
    status: supplier.status,
    rating: supplier.rating || 0,
    registrationDate: new Date(supplier.registrationDate),
    email: supplier.email,
    phone: supplier.phone,
    invoicesCount: supplier.invoicesCount,
    purchasesCount: supplier.purchasesCount,
    hasWarnings: supplier.hasWarnings,
  }));

  const handleAddSupplier = () => {
    router.visit('/suppliers/create');
  };

  const handleEditSupplier = (supplier: { id: string }) => {
    router.visit(`/suppliers/${supplier.id}/edit`);
  };

  const handleDeleteSupplier = (supplier: { id: string; name: string }) => {
    setSupplierToDelete(supplier);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (supplierToDelete) {
      router.delete(`/suppliers/${supplierToDelete.id}`, {
        onSuccess: () => {
          showToast.success('تم الحذف بنجاح', `تم حذف المورد "${supplierToDelete.name}" بنجاح`);
          setDeleteDialogOpen(false);
          setSupplierToDelete(null);
        },
        onError: (errors) => {
          showToast.error('فشل الحذف', errors?.message || 'حدث خطأ أثناء حذف المورد');
        },
      });
    }
  };

  const handleViewSupplier = (supplier: { id: string }) => {
    router.visit(`/suppliers/${supplier.id}`);
  };

  const handleExportSuppliers = () => {
    showToast.info('قريباً', 'سيتم إضافة ميزة التصدير قريباً');
  };

  return (
    <DashboardLayout>
      <Head title="إدارة الموردين" />
      <div className="w-full space-y-6">
        {/* العنوان */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            <h2 className="text-xl font-semibold">الموردين</h2>
          </div>
        </div>

        {/* إحصائيات الموردين */}
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            <h2 className="text-xl font-semibold">إحصائيات الموردين</h2>
          </div>
          <SupplierStats stats={stats} />
        </div>

        {/* جدول الموردين */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            <h2 className="text-xl font-semibold">قائمة الموردين</h2>
          </div>
          <SuppliersTable
            data={tableData}
            onAddSupplier={handleAddSupplier}
            onEditSupplier={handleEditSupplier}
            onDeleteSupplier={handleDeleteSupplier}
            onViewSupplier={handleViewSupplier}
            onExportSuppliers={handleExportSuppliers}
          />
        </div>

        {/* Confirm Delete Dialog */}
        <ConfirmDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          onConfirm={confirmDelete}
          title="تأكيد حذف المورد"
          description={`هل أنت متأكد من حذف المورد "${supplierToDelete?.name}"؟ لا يمكن التراجع عن هذا الإجراء.`}
          confirmText="حذف"
          cancelText="إلغاء"
          variant="danger"
        />
      </div>
    </DashboardLayout>
  );
}

