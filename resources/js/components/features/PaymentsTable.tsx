/** @jsxImportSource react */
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Eye,
  Plus,
  Search,
  Filter,
  DollarSign,
  Calendar,
  User,
  FileText,
} from 'lucide-react';

interface Contract {
  id: number;
  contractNumber: string;
  title: string;
  customerName: string;
  customerId: number;
  customerPhone?: string;
  amount: number;
  paidAmount: number;
  remainingAmount: number;
  paymentStatus: string;
  paymentPercentage: number;
  paymentsCount: number;
  lastPaymentDate?: string;
  status: string;
  startDate: string;
  endDate: string;
  paymentType: string;
  installmentCount?: number;
}

interface PaymentsTableProps {
  contracts: Contract[];
  onViewContract: (contract: Contract) => void;
  onAddPayment: (contract: Contract) => void;
}

export function PaymentsTable({ contracts, onViewContract, onAddPayment }: PaymentsTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredContracts = contracts.filter((contract) => {
    const matchesSearch =
      contract.contractNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.title.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter =
      filterStatus === 'all' ||
      (filterStatus === 'fully_paid' && contract.paymentStatus === 'مدفوع بالكامل') ||
      (filterStatus === 'partially_paid' && contract.paymentStatus === 'مدفوع جزئياً') ||
      (filterStatus === 'unpaid' && contract.paymentStatus === 'غير مدفوع');

    return matchesSearch && matchesFilter;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'OMR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'مدفوع بالكامل':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'مدفوع جزئياً':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'غير مدفوع':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      {/* Header with Search and Filters */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex-1 w-full sm:w-auto">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="ابحث عن عقد أو عميل..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10 w-full sm:w-80"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#58d2c8] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="all">جميع الحالات</option>
              <option value="fully_paid">مدفوع بالكامل</option>
              <option value="partially_paid">مدفوع جزئياً</option>
              <option value="unpaid">غير مدفوع</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
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
                المتبقي
              </th>
              <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                حالة الدفع
              </th>
              <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                آخر دفعة
              </th>
              <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                الإجراءات
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {filteredContracts.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                  <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>لا توجد عقود</p>
                </td>
              </tr>
            ) : (
              filteredContracts.map((contract) => (
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
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {contract.paymentPercentage.toFixed(1)}%
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-orange-600 dark:text-orange-400">
                      {formatCurrency(contract.remainingAmount)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPaymentStatusColor(
                        contract.paymentStatus
                      )}`}
                    >
                      {contract.paymentStatus}
                    </span>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {contract.paymentsCount} دفعة
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {contract.lastPaymentDate ? (
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-900 dark:text-white">
                          {contract.lastPaymentDate}
                        </span>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onViewContract(contract)}
                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                        title="عرض العقد"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      {contract.remainingAmount > 0 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onAddPayment(contract)}
                          className="text-green-600 hover:text-green-700 hover:bg-green-50"
                          title="تسديد دفعة"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

