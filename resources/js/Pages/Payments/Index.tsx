/** @jsxImportSource react */
import { Head, router, usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { PaymentStats } from '@/components/features/PaymentStats';
import { PaymentsTable } from '@/components/features/PaymentsTable';
import { Button } from '@/components/ui/button';
import { showToast } from '@/hooks/use-toast';
import { Plus, DollarSign } from 'lucide-react';

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

interface PaymentStatsType {
  totalContracts: number;
  totalAmount: number;
  totalPaid: number;
  totalRemaining: number;
  fullyPaidContracts: number;
  partiallyPaidContracts: number;
  unpaidContracts: number;
}

interface PaymentsIndexProps {
  contracts: Contract[];
  stats: PaymentStatsType;
}

export default function PaymentsIndex({ contracts, stats }: PaymentsIndexProps) {
  const { flash } = usePage().props as any;

  useEffect(() => {
    if (flash?.success) {
      showToast.success('نجح', flash.success);
    }
    if (flash?.error) {
      showToast.error('خطأ', flash.error);
    }
  }, [flash]);

  const handleAddPayment = (contract?: Contract) => {
    if (contract) {
      router.visit(`/payments/create?contract_id=${contract.id}`);
    } else {
      router.visit('/payments/create');
    }
  };

  const handleViewContract = (contract: Contract) => {
    router.visit(`/contracts/${contract.id}`);
  };

  return (
    <DashboardLayout>
      <Head title="إدارة المدفوعات" />
      <div className="space-y-6 mt-2 -mx-1 sm:-mx-2 lg:-mx-3 xl:-mx-4">
        {/* عنوان الصفحة */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              إدارة المدفوعات
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              عرض وإدارة مدفوعات العقود
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              onClick={() => handleAddPayment()}
              className="bg-[#58d2c8] hover:bg-[#4AB8B3] text-white flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              تسديد دفعة جديدة
            </Button>
          </div>
        </div>

        {/* الإحصائيات */}
        <PaymentStats stats={stats} />

        {/* جدول المدفوعات */}
        <PaymentsTable
          contracts={contracts}
          onViewContract={handleViewContract}
          onAddPayment={handleAddPayment}
        />
      </div>
    </DashboardLayout>
  );
}

