/** @jsxImportSource react */
import { Head, router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { InventoryStats } from '@/components/features/InventoryStats';
import { ScaffoldsTable } from '@/components/features/ScaffoldsTable';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { showToast } from '@/hooks/use-toast';
import { Package, BarChart3, TrendingUp, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Scaffold {
  id: number;
  scaffoldNumber: string;
  type: string;
  size: string;
  material: string;
  condition: string;
  status: string;
  quantity: number;
  availableQuantity: number;
  location: string;
  sellingPrice: number;
  dailyRentalPrice: number;
  monthlyRentalPrice: number;
  entryDate: string;
  lastMaintenanceDate?: string;
  nextMaintenanceDate?: string;
  descriptionAr?: string;
  descriptionEn?: string;
  notes?: string;
  supplierName?: string;
  createdAt: string;
  updatedAt: string;
  hasImages: boolean;
  hasAttachments: boolean;
}

interface InventoryStatsType {
  totalScaffolds: number;
  availableScaffolds: number;
  rentedScaffolds: number;
  soldScaffolds: number;
  maintenanceScaffolds: number;
  reservedScaffolds: number;
  totalValue: number;
  availableValue: number;
  rentedValue: number;
  soldValue: number;
  maintenanceValue: number;
  lowStockItems: number;
  maintenanceDueItems: number;
  typeDistribution: Record<string, number>;
  materialDistribution: Record<string, number>;
  conditionDistribution: Record<string, number>;
  statusDistribution: Record<string, number>;
  monthlyAdditions: Record<string, number>;
  monthlyRentals: Record<string, number>;
  monthlySales: Record<string, number>;
}

interface InventoryIndexProps {
  scaffolds: Scaffold[];
  stats: InventoryStatsType;
}

export default function InventoryIndex({ scaffolds, stats }: InventoryIndexProps) {
  const { flash } = usePage().props as any;
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [scaffoldToDelete, setScaffoldToDelete] = useState<{ id: string; scaffoldNumber: string } | null>(null);

  // عرض رسائل Flash من Laravel
  useEffect(() => {
    if (flash?.success) {
      showToast.success('نجح', flash.success);
    }
    if (flash?.error) {
      showToast.error('خطأ', flash.error);
    }
  }, [flash]);

  // تحويل بيانات السقالات إلى تنسيق ScaffoldsTable
  const tableData = scaffolds.map((scaffold) => ({
    id: scaffold.id.toString(),
    scaffoldNumber: scaffold.scaffoldNumber,
    type: scaffold.type,
    size: scaffold.size,
    material: scaffold.material,
    condition: scaffold.condition,
    status: scaffold.status,
    quantity: scaffold.quantity,
    availableQuantity: scaffold.availableQuantity,
    location: scaffold.location,
    sellingPrice: scaffold.sellingPrice,
    dailyRentalPrice: scaffold.dailyRentalPrice,
    monthlyRentalPrice: scaffold.monthlyRentalPrice,
    entryDate: scaffold.entryDate,
    lastMaintenanceDate: scaffold.lastMaintenanceDate,
    nextMaintenanceDate: scaffold.nextMaintenanceDate,
    hasImages: scaffold.hasImages,
    hasAttachments: scaffold.hasAttachments,
    notes: scaffold.notes,
    supplierName: scaffold.supplierName,
    createdAt: scaffold.createdAt,
    updatedAt: scaffold.updatedAt,
    descriptionAr: scaffold.descriptionAr,
    descriptionEn: scaffold.descriptionEn,
  }));

  const handleAddScaffold = () => {
    router.visit('/inventory/create');
  };

  const handleEditScaffold = (scaffold: { id: string }) => {
    router.visit(`/inventory/${scaffold.id}/edit`);
  };

  const handleDeleteScaffold = (scaffold: { id: string; scaffoldNumber: string }) => {
    setScaffoldToDelete(scaffold);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (scaffoldToDelete) {
      router.delete(`/inventory/${scaffoldToDelete.id}`, {
        onSuccess: () => {
          showToast.success('تم الحذف بنجاح', `تم حذف المعدة "${scaffoldToDelete.scaffoldNumber}" بنجاح`);
          setDeleteDialogOpen(false);
          setScaffoldToDelete(null);
        },
        onError: (errors) => {
          showToast.error('فشل الحذف', errors?.message || 'حدث خطأ أثناء حذف المعدة');
        },
      });
    }
  };

  const handleViewScaffold = (scaffold: { id: string }) => {
    router.visit(`/inventory/${scaffold.id}`);
  };

  const handleExportScaffolds = () => {
    showToast.info('قريباً', 'سيتم إضافة ميزة التصدير قريباً');
  };

  return (
    <DashboardLayout>
      <Head title="إدارة المخزون" />
      <div className="w-full space-y-6 mt-2 -mx-1 sm:-mx-2 lg:-mx-3 xl:-mx-4">
        {/* العنوان */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            <h2 className="text-xl font-semibold">المخزون</h2>
          </div>
          <Button
            onClick={handleAddScaffold}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            إضافة معدة جديد
          </Button>
        </div>

        {/* إحصائيات المخزون */}
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            <h2 className="text-xl font-semibold">إحصائيات المخزون</h2>
          </div>
          <InventoryStats stats={stats} />
        </div>

        {/* جدول السقالات */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            <h2 className="text-xl font-semibold">السقالات</h2>
          </div>
          <ScaffoldsTable
            data={tableData}
            onAddScaffold={handleAddScaffold}
            onEditScaffold={handleEditScaffold}
            onDeleteScaffold={handleDeleteScaffold}
            onViewScaffold={handleViewScaffold}
            onExportScaffolds={handleExportScaffolds}
          />
        </div>

        {/* Confirm Delete Dialog */}
        <ConfirmDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          onConfirm={confirmDelete}
          title="تأكيد حذف المعدة"
          description={`هل أنت متأكد من حذف المعدة "${scaffoldToDelete?.scaffoldNumber}"؟ لا يمكن التراجع عن هذا الإجراء.`}
          confirmText="حذف"
          cancelText="إلغاء"
          variant="danger"
        />
      </div>
    </DashboardLayout>
  );
}

