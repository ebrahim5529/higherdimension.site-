/** @jsxImportSource react */
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, CheckCircle, Clock, DollarSign } from 'lucide-react';

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
    paidContracts: number;
    pendingContracts: number;
    partialPaymentContracts: number;
  };
}

export function ContractsStats({ contracts, stats }: ContractsStatsProps) {
  // حساب العقود حسب النوع
  const rentalContracts = contracts.filter(c => c.type === 'تأجير').length;
  const saleContracts = contracts.filter(c => c.type === 'بيع').length;

  const statsCards = [
    {
      title: 'إجمالي العقود',
      value: stats.totalContracts,
      icon: FileText,
      color: 'text-[#58d2c8]',
      bgColor: 'bg-[#58d2c8]/10',
      change: `${stats.activeContracts} نشط، ${stats.expiredContracts} منتهي`,
      changeType: 'positive' as const,
    },
    {
      title: 'العقود النشطة',
      value: stats.activeContracts,
      icon: CheckCircle,
      color: 'text-[#58d2c8]',
      bgColor: 'bg-[#58d2c8]/10',
      change: `${stats.partialPaymentContracts} مدفوع جزئياً`,
      changeType: 'positive' as const,
    },
    {
      title: 'العقود المنتهية',
      value: stats.expiredContracts,
      icon: Clock,
      color: 'text-[#58d2c8]',
      bgColor: 'bg-[#58d2c8]/10',
      change: `${stats.paidContracts} مدفوع بالكامل`,
      changeType: 'neutral' as const,
    },
    {
      title: 'القيمة الإجمالية',
      value: new Intl.NumberFormat('ar-SA', {
        style: 'currency',
        currency: 'OMR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(stats.totalValue),
      icon: DollarSign,
      color: 'text-[#58d2c8]',
      bgColor: 'bg-[#58d2c8]/10',
      change: `${stats.pendingContracts} غير مدفوع`,
      changeType: 'positive' as const,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <FileText className="h-5 w-5" />
        <h2 className="text-xl font-semibold">إحصائيات العقود</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                    {stat.value}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
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

      {/* أنواع العقود */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          <h2 className="text-xl font-semibold">أنواع العقود</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* عقود التأجير */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">عقود التأجير</h3>
                <p className="text-sm text-gray-600">عقود تأجير المعدات</p>
              </div>
            </div>
            <div className="text-sm text-gray-600">
              <div className="flex items-center justify-between">
                <span>عدد العقود:</span>
                <span className="font-medium text-[#58d2c8]">
                  {rentalContracts}
                </span>
              </div>
            </div>
          </div>

          {/* عقود الشراء */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">عقود الشراء</h3>
                <p className="text-sm text-gray-600">عقود شراء المعدات</p>
              </div>
            </div>
            <div className="text-sm text-gray-600">
              <div className="flex items-center justify-between">
                <span>عدد العقود:</span>
                <span className="font-medium text-[#58d2c8]">
                  {saleContracts}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

