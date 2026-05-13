/** @jsxImportSource react */
import { FileText, CheckCircle, Clock, DollarSign, Banknote, AlertCircle } from 'lucide-react';
import { EnglishNumerals } from '@/components/ui/english-numerals';
import { formatCurrencyOmrEn, formatNumberEn } from '@/lib/utils';

interface Contract {
  id: number;
  contractNumber: string;
  customerName: string;
  type: string;
  amount: number;
  totalAfterDiscount: number;
  totalPayments: number;
  remainingAmount: number;
  status: string;
  paymentStatus: string;
  startDate: string;
  endDate: string;
}

interface ContractsStatsProps {
  contracts: Contract[];
  stats: {
    totalContracts: number;
    activeContracts: number;
    expiredContracts: number;
    cancelledContracts: number;
    totalValue: number;
    totalPaid: number;
    totalRemaining: number;
    paidContracts: number;
    pendingContracts: number;
    partialPaymentContracts: number;
  };
}

export function ContractsStats({ contracts, stats }: ContractsStatsProps) {
  const statsCards = [
    {
      title: 'إجمالي العقود',
      value: formatNumberEn(stats.totalContracts, { maximumFractionDigits: 0 }),
      icon: FileText,
      color: 'text-[#58d2c8]',
      bgColor: 'bg-[#58d2c8]/10',
      change: `${formatNumberEn(stats.activeContracts, { maximumFractionDigits: 0 })} مفتوحة، ${formatNumberEn(stats.expiredContracts, { maximumFractionDigits: 0 })} مغلقة، ${formatNumberEn(stats.cancelledContracts, { maximumFractionDigits: 0 })} مغلقة دون استلام`,
      changeType: 'positive' as const,
    },
    {
      title: 'عقود مفتوحة',
      value: formatNumberEn(stats.activeContracts, { maximumFractionDigits: 0 }),
      icon: CheckCircle,
      color: 'text-[#58d2c8]',
      bgColor: 'bg-[#58d2c8]/10',
      change: `${formatNumberEn(stats.partialPaymentContracts, { maximumFractionDigits: 0 })} مدفوع جزئياً`,
      changeType: 'positive' as const,
    },
    {
      title: 'عقود مغلقة',
      value: formatNumberEn(stats.expiredContracts, { maximumFractionDigits: 0 }),
      icon: Clock,
      color: 'text-[#58d2c8]',
      bgColor: 'bg-[#58d2c8]/10',
      change: `${formatNumberEn(stats.paidContracts, { maximumFractionDigits: 0 })} مدفوع بالكامل`,
      changeType: 'neutral' as const,
    },
    {
      title: 'القيمة الإجمالية',
      value: formatCurrencyOmrEn(stats.totalValue, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }),
      icon: DollarSign,
      color: 'text-[#58d2c8]',
      bgColor: 'bg-[#58d2c8]/10',
      change: `${formatNumberEn(stats.pendingContracts, { maximumFractionDigits: 0 })} غير مدفوع`,
      changeType: 'positive' as const,
    },
    {
      title: 'إجمالي المدفوع',
      value: formatCurrencyOmrEn(stats.totalPaid),
      icon: Banknote,
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-500/10',
      change: 'مجموع المبالغ المحصّلة من جميع العقود',
      changeType: 'positive' as const,
    },
    {
      title: 'إجمالي المتبقي',
      value: formatCurrencyOmrEn(stats.totalRemaining),
      icon: AlertCircle,
      color: 'text-orange-600 dark:text-orange-400',
      bgColor: 'bg-orange-500/10',
      change: 'المبلغ المستحق على العقود بعد خصم المدفوع',
      changeType: 'neutral' as const,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <FileText className="h-5 w-5" />
        <h2 className="text-xl font-semibold">إحصائيات العقود</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:bg-[#58d2c8]/5 hover:border-[#58d2c8]/30 hover:shadow-lg hover:shadow-[#58d2c8]/20 hover:scale-105 transition-all duration-300 cursor-pointer group min-h-[120px]"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-sm text-gray-600 group-hover:text-[#58d2c8] transition-colors duration-300 font-almarai mb-2">
                    {stat.title}
                  </h3>
                  <div className="text-2xl font-bold text-[#58d2c8] group-hover:text-[#4AB8B3] transition-colors duration-300 font-tajawal">
                    <EnglishNumerals>{stat.value}</EnglishNumerals>
                  </div>
                  <p className="text-xs text-gray-500 mt-1 tabular-nums">
                    {stat.change}
                  </p>
                </div>
                <div className="p-2 bg-[#58d2c8]/10 rounded-lg group-hover:bg-[#58d2c8]/20 transition-all duration-300">
                  <Icon className={`h-6 w-6 ${stat.color} group-hover:scale-110 transition-transform duration-300`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

