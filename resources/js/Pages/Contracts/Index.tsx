/** @jsxImportSource react */
import { Head, router, usePage } from '@inertiajs/react';
import { useEffect, useState, useCallback } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { ContractsStats } from '@/components/features/ContractsStats';
import { ContractsTable } from '@/components/features/ContractsTable';
import { ContractStagesModal } from '@/components/features/ContractStagesModal';
import { ContractInvoiceModal } from '@/components/features/ContractInvoiceModal';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { showToast } from '@/hooks/use-toast';
import { FileText, Plus } from 'lucide-react';

interface Contract {
  id: number;
  contractNumber: string;
  customerName: string;
  customerPhone: string;
  type: 'تأجير' | 'بيع';
  amount: number;
  totalAfterDiscount: number;
  totalPayments: number;
  remainingAmount: number;
  status: string;
  paymentStatus: string;
  startDate: string;
  endDate: string;
  deliveryAddress: string;
  locationMapLink?: string | null;
}

interface ContractsStatsType {
  totalContracts: number;
  activeContracts: number;
  expiredContracts: number;
  cancelledContracts: number;
  totalValue: number;
  paidContracts: number;
  pendingContracts: number;
  partialPaymentContracts: number;
}

interface ContractsIndexProps {
  contracts: Contract[];
  stats: ContractsStatsType;
}

export default function ContractsIndex({ contracts, stats }: ContractsIndexProps) {
  const { flash } = usePage().props as any;
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [contractToDelete, setContractToDelete] = useState<Contract | null>(null);
  const [stagesModalOpen, setStagesModalOpen] = useState(false);
  const [contractForStages, setContractForStages] = useState<Contract | null>(null);
  const [invoiceModalOpen, setInvoiceModalOpen] = useState(false);
  const [contractForInvoice, setContractForInvoice] = useState<Contract | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (flash?.success) {
      showToast.success('نجح', flash.success);
    }
    if (flash?.error) {
      showToast.error('خطأ', flash.error);
    }
  }, [flash]);

  const handleAddContract = useCallback(() => {
    router.visit('/contracts/create');
  }, []);

  const handleEditContract = useCallback((contract: Contract) => {
    router.visit(`/contracts/${contract.id}/edit`);
  }, []);

  const handleDeleteContract = useCallback((contract: Contract) => {
    setContractToDelete(contract);
    setDeleteDialogOpen(true);
  }, []);

  const confirmDelete = useCallback(() => {
    if (!contractToDelete) {
      return;
    }

    const target = contractToDelete;
    setIsLoading(true);

    router.delete(`/contracts/${target.id}`, {
      preserveScroll: true,
      onSuccess: () => {
        showToast.success('تم الحذف بنجاح', `تم حذف العقد "${target.contractNumber}" بنجاح`);
        setDeleteDialogOpen(false);
        setContractToDelete(null);
      },
      onError: (errors) => {
        let msg = 'حدث خطأ أثناء حذف العقد';
        if (errors && typeof errors === 'object') {
          const values = Object.values(errors as Record<string, unknown>).flat();
          const first = values.find((v) => typeof v === 'string') as string | undefined;
          if (first) {
            msg = first;
          }
        }
        showToast.error('فشل الحذف', msg);
      },
      onFinish: () => {
        setIsLoading(false);
      },
    });
  }, [contractToDelete]);

  const handleViewContract = useCallback((contract: Contract) => {
    router.visit(`/contracts/${contract.id}`);
  }, []);

  const handleViewStages = useCallback((contract: Contract) => {
    setContractForStages(contract);
    setStagesModalOpen(true);
  }, []);

  const handlePrint = useCallback((contract: Contract) => {
    // TODO: Implement print functionality
    showToast.info('طباعة', `جاري طباعة العقد ${contract.contractNumber}...`);
  }, []);

  const handleIssueInvoice = useCallback((contract: Contract) => {
    setContractForInvoice(contract);
    setInvoiceModalOpen(true);
  }, []);

  return (
    <DashboardLayout>
      <Head title="العقود" />
      <div className="space-y-6 mt-2 -mx-1 sm:-mx-2 lg:-mx-3 xl:-mx-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="h-6 w-6 text-[#58d2c8]" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              العقود
            </h1>
          </div>
          <button
            onClick={handleAddContract}
            className="bg-[#58d2c8] text-white px-4 py-2 rounded-lg hover:bg-[#4AB8B3] transition-colors flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            إضافة عقد جديد
          </button>
        </div>

        {/* إحصائيات العقود */}
        <ContractsStats contracts={contracts} stats={stats} />

        {/* جدول العقود */}
        <ContractsTable
          data={contracts}
          onAddContract={handleAddContract}
          onEditContract={handleEditContract}
          onDeleteContract={handleDeleteContract}
          onViewContract={handleViewContract}
          onViewStages={handleViewStages}
          onPrint={handlePrint}
          onIssueInvoice={handleIssueInvoice}
          isLoading={isLoading}
        />

        {/* نافذة تأكيد الحذف */}
        <ConfirmDialog
          open={deleteDialogOpen}
          onOpenChange={(open) => {
            setDeleteDialogOpen(open);
            if (!open) {
              setContractToDelete(null);
            }
          }}
          onConfirm={confirmDelete}
          title="تأكيد حذف العقد"
          description={`هل أنت متأكد من حذف العقد "${contractToDelete?.contractNumber}"؟ لا يمكن التراجع عن هذا الإجراء.`}
          confirmText="حذف"
          cancelText="إلغاء"
          variant="danger"
          isLoading={isLoading}
        />

        {/* نافذة عرض المراحل */}
        <ContractStagesModal
          open={stagesModalOpen}
          onOpenChange={setStagesModalOpen}
          contract={contractForStages}
        />

        {/* نافذة إصدار الفاتورة */}
        <ContractInvoiceModal
          open={invoiceModalOpen}
          onOpenChange={setInvoiceModalOpen}
          contract={contractForInvoice}
        />
      </div>
    </DashboardLayout>
  );
}

