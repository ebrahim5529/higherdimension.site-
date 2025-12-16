/** @jsxImportSource react */
import { Head, router } from '@inertiajs/react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { ContractsTable } from '@/components/features/ContractsTable';
import { Card, CardContent } from '@/components/ui/card';
import { X, FileText, DollarSign, AlertCircle } from 'lucide-react';

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

interface CancelledContractsProps {
  contracts: Contract[];
  stats: Stats;
}

export default function CancelledContracts({ contracts, stats }: CancelledContractsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'OMR',
    }).format(amount);
  };

  const handleViewContract = (contract: Contract) => {
    router.visit(`/contracts/${contract.id}`);
  };

  const handleEditContract = (contract: Contract) => {
    router.visit(`/contracts/${contract.id}/edit`);
  };

  const handleDeleteContract = (contract: Contract) => {
    // Handle delete
  };

  const handleViewStages = (contract: Contract) => {
    // Handle view stages
  };

  const handlePrint = (contract: Contract) => {
    // Handle print
  };

  const handleInvoice = (contract: Contract) => {
    router.visit(`/contracts/${contract.id}/invoice`);
  };

  return (
    <DashboardLayout>
      <Head title="عقود ملغاة" />
      <div className="space-y-6 pb-8 mt-2 -mx-1 sm:-mx-2 lg:-mx-3 xl:-mx-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">عقود ملغاة</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">عرض جميع العقود الملغاة</p>
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
                <div className="p-3 bg-red-100 dark:bg-red-900 rounded-lg">
                  <FileText className="h-6 w-6 text-red-600 dark:text-red-400" />
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
                <div className="p-3 bg-red-100 dark:bg-red-900 rounded-lg">
                  <DollarSign className="h-6 w-6 text-red-600 dark:text-red-400" />
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
                  <AlertCircle className="h-6 w-6 text-purple-600 dark:text-purple-400" />
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
                  <X className="h-6 w-6 text-orange-600 dark:text-orange-400" />
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
          onIssueInvoice={handleInvoice}
        />
      </div>
    </DashboardLayout>
  );
}

