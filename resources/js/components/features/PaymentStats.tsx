/** @jsxImportSource react */
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, CheckCircle, Clock, DollarSign, AlertCircle, TrendingUp } from 'lucide-react';

interface PaymentStatsProps {
  stats: {
    totalContracts: number;
    totalAmount: number;
    totalPaid: number;
    totalRemaining: number;
    fullyPaidContracts: number;
    partiallyPaidContracts: number;
    unpaidContracts: number;
  };
}

export function PaymentStats({ stats }: PaymentStatsProps) {
  const paidPercentage = stats.totalAmount > 0 
    ? Math.round((stats.totalPaid / stats.totalAmount) * 100) 
    : 0;
  
  const remainingPercentage = stats.totalAmount > 0 
    ? Math.round((stats.totalRemaining / stats.totalAmount) * 100) 
    : 0;

  const statsCards = [
    {
      title: 'إجمالي العقود',
      value: stats.totalContracts,
      icon: FileText,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      change: `${stats.fullyPaidContracts} مدفوع بالكامل`,
      changeType: 'positive' as const,
    },
    {
      title: 'إجمالي المبلغ',
      value: new Intl.NumberFormat('ar-SA', {
        style: 'currency',
        currency: 'OMR',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(stats.totalAmount),
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      change: `${paidPercentage}% مدفوع`,
      changeType: 'positive' as const,
    },
    {
      title: 'المبلغ المدفوع',
      value: new Intl.NumberFormat('ar-SA', {
        style: 'currency',
        currency: 'OMR',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(stats.totalPaid),
      icon: CheckCircle,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-100',
      change: `${stats.partiallyPaidContracts} مدفوع جزئياً`,
      changeType: 'positive' as const,
    },
    {
      title: 'المبلغ المتبقي',
      value: new Intl.NumberFormat('ar-SA', {
        style: 'currency',
        currency: 'OMR',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(stats.totalRemaining),
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      change: `${stats.unpaidContracts} غير مدفوع`,
      changeType: 'negative' as const,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow duration-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stat.value}
                </div>
                <p className={`text-xs mt-1 ${
                  stat.changeType === 'positive' 
                    ? 'text-green-600 dark:text-green-400' 
                    : stat.changeType === 'negative'
                    ? 'text-red-600 dark:text-red-400'
                    : 'text-gray-500 dark:text-gray-400'
                }`}>
                  {stat.change}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

