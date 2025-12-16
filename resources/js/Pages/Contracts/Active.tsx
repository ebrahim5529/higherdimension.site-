/** @jsxImportSource react */
import { Head, router } from '@inertiajs/react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { ContractsTable } from '@/components/features/ContractsTable';
import { Card, CardContent } from '@/components/ui/card';
import { Activity, FileText, DollarSign, TrendingUp } from 'lucide-react';

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
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'OMR',
    }).format(amount);
  };

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
          onIssueInvoice={handleInvoice}
        />
      </div>
    </DashboardLayout>
  );

  function handleViewContract(contract: Contract) {
    router.visit(`/contracts/${contract.id}`);
  }

  function handleEditContract(contract: Contract) {
    router.visit(`/contracts/${contract.id}/edit`);
  }

  function handleDeleteContract(contract: Contract) {
    // Handle delete
  }

  function handleViewStages(contract: Contract) {
    // Handle view stages
  }

  function handlePrint(contract: Contract) {
    // Handle print
  }

  function handleInvoice(contract: Contract) {
    router.visit(`/contracts/${contract.id}/invoice`);
  }
}

