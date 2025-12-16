/** @jsxImportSource react */
import { Head, router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { showToast } from '@/hooks/use-toast';
import { BarChart, Search, Filter, Download, FileText, DollarSign, Calendar, User } from 'lucide-react';
import { Combobox } from '@/components/ui/combobox';

interface Payment {
  id: number;
  contractNumber: string;
  contractTitle: string;
  customerName: string;
  paymentMethod: string;
  paymentDate: string;
  amount: number;
  checkNumber?: string;
  bankName?: string;
  notes?: string;
}

interface PaymentReportsProps {
  payments: Payment[];
  stats: {
    totalPayments: number;
    paymentsCount: number;
    paymentsByMethod: Record<string, { count: number; total: number }>;
  };
  contracts: Array<{
    id: number;
    contractNumber: string;
    title: string;
    customerName: string;
  }>;
  filters: {
    start_date?: string;
    end_date?: string;
    contract_id?: string;
  };
}

export default function PaymentReports({ payments, stats, contracts, filters: initialFilters }: PaymentReportsProps) {
  const { flash } = usePage().props as any;
  const [filters, setFilters] = useState({
    start_date: initialFilters.start_date || '',
    end_date: initialFilters.end_date || '',
    contract_id: initialFilters.contract_id || '',
  });

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

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleApplyFilters = () => {
    const params = new URLSearchParams();
    if (filters.start_date) params.append('start_date', filters.start_date);
    if (filters.end_date) params.append('end_date', filters.end_date);
    if (filters.contract_id) params.append('contract_id', filters.contract_id);

    router.visit(`/payments/reports?${params.toString()}`);
  };

  const handleClearFilters = () => {
    setFilters({
      start_date: '',
      end_date: '',
      contract_id: '',
    });
    router.visit('/payments/reports');
  };

  const contractOptions = contracts.map((contract) => ({
    value: contract.id.toString(),
    label: `${contract.contractNumber} - ${contract.customerName}`,
  }));

  return (
    <DashboardLayout>
      <Head title="تقارير المدفوعات" />
      <div className="space-y-6 mt-2 -mx-1 sm:-mx-2 lg:-mx-3 xl:-mx-4">
        {/* عنوان الصفحة */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              تقارير المدفوعات
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              عرض تقارير شاملة عن جميع المدفوعات
            </p>
          </div>
        </div>

        {/* الإحصائيات */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                إجمالي المدفوعات
              </CardTitle>
              <div className="p-2 rounded-lg bg-green-100">
                <DollarSign className="h-5 w-5 text-green-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(stats.totalPayments)}
              </div>
              <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                {stats.paymentsCount} دفعة
              </p>
            </CardContent>
          </Card>

          {Object.entries(stats.paymentsByMethod).map(([method, data]) => (
            <Card key={method} className="hover:shadow-lg transition-shadow duration-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {method}
                </CardTitle>
                <div className="p-2 rounded-lg bg-blue-100">
                  <FileText className="h-5 w-5 text-blue-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatCurrency(data.total)}
                </div>
                <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                  {data.count} دفعة
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* الفلاتر */}
        <Card className="p-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              الفلاتر
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  من تاريخ
                </label>
                <Input
                  type="date"
                  value={filters.start_date}
                  onChange={(e) => handleFilterChange('start_date', e.target.value)}
                  className="w-full"
                  dir="ltr"
                  lang="en"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  إلى تاريخ
                </label>
                <Input
                  type="date"
                  value={filters.end_date}
                  onChange={(e) => handleFilterChange('end_date', e.target.value)}
                  className="w-full"
                  dir="ltr"
                  lang="en"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  العقد
                </label>
                <Combobox
                  options={contractOptions}
                  value={filters.contract_id}
                  onValueChange={(value) => handleFilterChange('contract_id', value)}
                  placeholder="اختر العقد..."
                  searchPlaceholder="ابحث عن عقد..."
                  emptyText="لا توجد عقود"
                />
              </div>
              <div className="flex items-end gap-2">
                <Button
                  onClick={handleApplyFilters}
                  className="bg-[#58d2c8] hover:bg-[#4AB8B3] text-white flex-1"
                >
                  <Search className="h-4 w-4 mr-2" />
                  تطبيق
                </Button>
                <Button
                  variant="ghost"
                  onClick={handleClearFilters}
                  className="flex-1"
                >
                  مسح
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* جدول المدفوعات */}
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
                    طريقة الدفع
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    تاريخ الدفع
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    المبلغ
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    رقم الشيك
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    البنك
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {payments.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                      <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>لا توجد مدفوعات</p>
                    </td>
                  </tr>
                ) : (
                  payments.map((payment) => (
                    <tr
                      key={payment.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-gray-400" />
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {payment.contractNumber}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {payment.contractTitle}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-900 dark:text-white">
                            {payment.customerName}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                          {payment.paymentMethod}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-900 dark:text-white">
                            {payment.paymentDate}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-green-600 dark:text-green-400">
                          {formatCurrency(payment.amount)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900 dark:text-white">
                          {payment.checkNumber || '-'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900 dark:text-white">
                          {payment.bankName || '-'}
                        </span>
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

