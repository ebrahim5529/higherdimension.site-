/** @jsxImportSource react */
import { Head, router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
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

  const handleAddContract = () => {
    router.visit('/contracts/create');
  };

  const handleEditContract = (contract: Contract) => {
    router.visit(`/contracts/${contract.id}/edit`);
  };

  const handleDeleteContract = (contract: Contract) => {
    setContractToDelete(contract);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (contractToDelete) {
      setIsLoading(true);
      router.delete(`/contracts/${contractToDelete.id}`, {
        onSuccess: () => {
          showToast.success('تم الحذف بنجاح', `تم حذف العقد "${contractToDelete.contractNumber}" بنجاح`);
          setDeleteDialogOpen(false);
          setContractToDelete(null);
          setIsLoading(false);
        },
        onError: (errors) => {
          showToast.error('فشل الحذف', errors?.message || 'حدث خطأ أثناء حذف العقد');
          setIsLoading(false);
        },
      });
    }
  };

  const handleViewContract = (contract: Contract) => {
    router.visit(`/contracts/${contract.id}`);
  };

  const handleViewStages = (contract: Contract) => {
    setContractForStages(contract);
    setStagesModalOpen(true);
  };

  const handlePrint = (contract: Contract) => {
    // TODO: Implement print functionality
    showToast.info('طباعة', `جاري طباعة العقد ${contract.contractNumber}...`);
  };

  const handleIssueInvoice = (contract: Contract) => {
    setContractForInvoice(contract);
    setInvoiceModalOpen(true);
  };

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
          onOpenChange={setDeleteDialogOpen}
          onConfirm={confirmDelete}
          title="تأكيد حذف العقد"
          description={`هل أنت متأكد من حذف العقد "${contractToDelete?.contractNumber}"؟ لا يمكن التراجع عن هذا الإجراء.`}
          confirmText="حذف"
          cancelText="إلغاء"
          variant="danger"
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

