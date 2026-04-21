/** @jsxImportSource react */
import { Head, router, usePage } from '@inertiajs/react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { ContractsTable } from '@/components/features/ContractsTable';
import { Card, CardContent } from '@/components/ui/card';
import { Activity, FileText, DollarSign, TrendingUp } from 'lucide-react';
import { openContractSignPrintWindow } from '@/components/features/ContractPrint';
import { useCallback, useEffect, useState } from 'react';
import { showToast } from '@/hooks/use-toast';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { ContractStagesModal } from '@/components/features/ContractStagesModal';
import { ContractInvoiceModal } from '@/components/features/ContractInvoiceModal';

interface Contract {
  id: number;
  contractNumber: string;
  customerName: string;
  type: string;
  amount: number;
  totalPayments: number;
  remainingAmount: number;
  status: string;
  startDate: string;
  endDate: string;
  createdDate: string;
}

interface Stats {
  total: number;
  totalValue: number;
  totalPaid: number;
  totalRemaining: number;
}

interface ActiveContractsProps {
  contracts: Contract[];
  stats: Stats;
}

export default function ActiveContracts({ contracts, stats }: ActiveContractsProps) {
  const { flash } = usePage().props as any
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [contractToDelete, setContractToDelete] = useState<Contract | null>(null)
  const [stagesModalOpen, setStagesModalOpen] = useState(false)
  const [contractForStages, setContractForStages] = useState<Contract | null>(null)
  const [invoiceModalOpen, setInvoiceModalOpen] = useState(false)
  const [contractForInvoice, setContractForInvoice] = useState<Contract | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (flash?.success) showToast.success('نجح', flash.success)
    if (flash?.error) showToast.error('خطأ', flash.error)
  }, [flash])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'OMR',
    }).format(amount);
  };

  const handleViewContract = useCallback((contract: Contract) => {
    router.visit(`/contracts/${contract.id}`)
  }, [])

  const handleEditContract = useCallback((contract: Contract) => {
    router.visit(`/contracts/${contract.id}/edit`)
  }, [])

  const handleDeleteContract = useCallback((contract: Contract) => {
    setContractToDelete(contract)
    setDeleteDialogOpen(true)
  }, [])

  const confirmDelete = useCallback(() => {
    if (!contractToDelete) return

    const target = contractToDelete
    setIsLoading(true)

    router.delete(`/contracts/${target.id}`, {
      preserveScroll: true,
      onSuccess: () => {
        showToast.success('تم الحذف بنجاح', `تم حذف العقد "${target.contractNumber}" بنجاح`)
        setDeleteDialogOpen(false)
        setContractToDelete(null)
      },
      onError: (errors) => {
        let msg = 'حدث خطأ أثناء حذف العقد'
        if (errors && typeof errors === 'object') {
          const values = Object.values(errors as Record<string, unknown>).flat()
          const first = values.find((v) => typeof v === 'string') as string | undefined
          if (first) msg = first
        }
        showToast.error('فشل الحذف', msg)
      },
      onFinish: () => setIsLoading(false),
    })
  }, [contractToDelete])

  const handleViewStages = useCallback((contract: Contract) => {
    setContractForStages(contract)
    setStagesModalOpen(true)
  }, [])

  const handlePrint = useCallback((contract: Contract) => {
    openContractSignPrintWindow(contract.contractNumber)
  }, [])

  const handleIssueInvoice = useCallback((contract: Contract) => {
    setContractForInvoice(contract)
    setInvoiceModalOpen(true)
  }, [])

  return (
    <DashboardLayout>
      <Head title="عقود نشطة" />
      <div className="space-y-6 pb-8 mt-2 -mx-1 sm:-mx-2 lg:-mx-3 xl:-mx-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">عقود نشطة</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">عرض جميع العقود النشطة</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">إجمالي العقود</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
                </div>
                <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">إجمالي القيمة</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {formatCurrency(stats.totalValue)}
                  </p>
                </div>
                <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                  <DollarSign className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">المبلغ المدفوع</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {formatCurrency(stats.totalPaid)}
                  </p>
                </div>
                <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">المبلغ المتبقي</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {formatCurrency(stats.totalRemaining)}
                  </p>
                </div>
                <div className="p-3 bg-orange-100 dark:bg-orange-900 rounded-lg">
                  <Activity className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contracts Table */}
        <ContractsTable
          data={contracts.map((contract) => ({
            ...contract,
            totalAfterDiscount: contract.amount,
            paymentStatus: contract.remainingAmount === 0 ? 'مدفوعة' : contract.remainingAmount < contract.amount ? 'مدفوعة جزئياً' : 'غير مدفوعة',
            deliveryAddress: '',
            locationMapLink: null,
          }))}
          onAddContract={() => router.visit('/contracts/create')}
          onViewContract={handleViewContract}
          onEditContract={handleEditContract}
          onDeleteContract={handleDeleteContract}
          onViewStages={handleViewStages}
          onPrint={handlePrint}
          onIssueInvoice={handleIssueInvoice}
        />

        <ConfirmDialog
          open={deleteDialogOpen}
          onOpenChange={(open) => {
            setDeleteDialogOpen(open)
            if (!open) setContractToDelete(null)
          }}
          onConfirm={confirmDelete}
          title="تأكيد حذف العقد"
          description={`هل أنت متأكد من حذف العقد "${contractToDelete?.contractNumber}"؟ لا يمكن التراجع عن هذا الإجراء.`}
          confirmText="حذف"
          cancelText="إلغاء"
          variant="danger"
          isLoading={isLoading}
        />

        <ContractStagesModal
          open={stagesModalOpen}
          onOpenChange={setStagesModalOpen}
          contract={contractForStages}
        />

        <ContractInvoiceModal
          open={invoiceModalOpen}
          onOpenChange={setInvoiceModalOpen}
          contract={contractForInvoice}
        />
      </div>
    </DashboardLayout>
  );
}

