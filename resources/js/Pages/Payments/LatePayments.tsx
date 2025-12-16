/** @jsxImportSource react */
import { Head, router, usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { showToast } from '@/hooks/use-toast';
import { AlertCircle, Plus, Eye, DollarSign, Calendar, User, FileText } from 'lucide-react';

interface Contract {
  id: number;
  contractNumber: string;
  title: string;
  customerName: string;
  customerPhone?: string;
  amount: number;
  paidAmount: number;
  remainingAmount: number;
  isOverdue: boolean;
  overdueAmount: number;
  overdueDays: number;
  startDate: string;
  endDate: string;
  paymentType: string;
  installmentCount?: number;
}

interface LatePaymentsProps {
  contracts: Contract[];
  stats: {
    totalOverdueContracts: number;
    totalOverdueAmount: number;
  };
}

export default function LatePayments({ contracts, stats }: LatePaymentsProps) {
  const { flash } = usePage().props as any;

  useEffect(() => {
    if (flash?.success) {
      showToast.success('نجح', flash.success);
    }
    if (flash?.error) {
      showToast.error('خطأ', flash.error);
    }
  }, [flash]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'OMR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const handleViewContract = (contract: Contract) => {
    router.visit(`/contracts/${contract.id}`);
  };

  const handleAddPayment = (contract: Contract) => {
    router.visit(`/payments/create?contract_id=${contract.id}`);
  };

  return (
    <DashboardLayout>
      <Head title="المدفوعات المتأخرة" />
      <div className="space-y-6 mt-2 -mx-1 sm:-mx-2 lg:-mx-3 xl:-mx-4">
        {/* عنوان الصفحة */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              المدفوعات المتأخرة
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              عرض العقود التي لديها مدفوعات متأخرة
            </p>
          </div>
        </div>

        {/* الإحصائيات */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                عدد العقود المتأخرة
              </CardTitle>
              <div className="p-2 rounded-lg bg-red-100">
                <AlertCircle className="h-5 w-5 text-red-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.totalOverdueContracts}
              </div>
              <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                عقد متأخر
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                إجمالي المبلغ المتأخر
              </CardTitle>
              <div className="p-2 rounded-lg bg-orange-100">
                <DollarSign className="h-5 w-5 text-orange-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(stats.totalOverdueAmount)}
              </div>
              <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">
                مبلغ متأخر
              </p>
            </CardContent>
          </Card>
        </div>

        {/* جدول العقود المتأخرة */}
        <Card className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                <tr>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    رقم العقد
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    العميل
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    المبلغ الإجمالي
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    المدفوع
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    المبلغ المتأخر
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    أيام التأخير
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    الإجراءات
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {contracts.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                      <AlertCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>لا توجد عقود متأخرة</p>
                    </td>
                  </tr>
                ) : (
                  contracts.map((contract) => (
                    <tr
                      key={contract.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-gray-400" />
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {contract.contractNumber}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {contract.title}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-900 dark:text-white">
                            {contract.customerName}
                          </span>
                        </div>
                        {contract.customerPhone && (
                          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {contract.customerPhone}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-gray-900 dark:text-white">
                          {formatCurrency(contract.amount)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-green-600 dark:text-green-400">
                          {formatCurrency(contract.paidAmount)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <AlertCircle className="h-4 w-4 text-red-500" />
                          <span className="text-sm font-bold text-red-600 dark:text-red-400">
                            {formatCurrency(contract.overdueAmount)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span className="text-sm font-medium text-orange-600 dark:text-orange-400">
                            {contract.overdueDays} يوم
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="flex items-center justify-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewContract(contract)}
                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                            title="عرض العقد"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleAddPayment(contract)}
                            className="text-green-600 hover:text-green-700 hover:bg-green-50"
                            title="تسديد دفعة"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}

