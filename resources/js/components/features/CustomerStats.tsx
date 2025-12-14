/** @jsxImportSource react */
/**
 * مكون إحصائيات العملاء
 */

import React from 'react';
import {
  Users,
  FileText,
  DollarSign,
  TrendingUp,
  Calendar,
  User,
  Building2,
} from 'lucide-react';

interface CustomerStatsType {
  totalCustomers: number;
  activeCustomers: number;
  inactiveCustomers: number;
  individualCustomers: number;
  companyCustomers: number;
  totalContracts: number;
  totalPayments: number;
  totalPendingAmount: number;
  customersWithWarnings: number;
  averageRating: number;
  nationalityDistribution: Record<string, number>;
  monthlyRegistrations: Record<string, number>;
}

interface CustomerStatsProps {
  stats: CustomerStatsType;
}

export function CustomerStats({ stats }: CustomerStatsProps) {
  // التحقق من وجود البيانات
  if (!stats) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-full"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* إجمالي العملاء */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:bg-[#58d2c8]/5 hover:border-[#58d2c8]/30 hover:shadow-lg hover:shadow-[#58d2c8]/20 hover:scale-105 transition-all duration-300 cursor-pointer group min-h-[120px]">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h3 className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-[#58d2c8] transition-colors duration-300 font-almarai mb-2">
                إجمالي العملاء
              </h3>
              <div className="text-2xl font-bold text-[#58d2c8] group-hover:text-[#4AB8B3] transition-colors duration-300 font-tajawal">
                {stats.totalCustomers || 0}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {stats.activeCustomers || 0} نشط، {stats.totalCustomers - stats.activeCustomers || 0} غير نشط
              </p>
            </div>
            <div className="p-2 bg-[#58d2c8]/10 rounded-lg group-hover:bg-[#58d2c8]/20 transition-all duration-300">
              <Users className="h-6 w-6 text-[#58d2c8] group-hover:scale-110 transition-transform duration-300" />
            </div>
          </div>
        </div>

        {/* أنواع العملاء */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:bg-[#58d2c8]/5 hover:border-[#58d2c8]/30 hover:shadow-lg hover:shadow-[#58d2c8]/20 hover:scale-105 transition-all duration-300 cursor-pointer group min-h-[120px]">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h3 className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-[#58d2c8] transition-colors duration-300 font-almarai mb-2">
                أنواع العملاء
              </h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-green-600" />
                    <span className="text-sm">أفراد</span>
                  </div>
                  <span className="text-sm font-medium text-[#58d2c8]">{stats.individualCustomers || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-blue-600" />
                    <span className="text-sm">شركات</span>
                  </div>
                  <span className="text-sm font-medium text-[#58d2c8]">{stats.companyCustomers || 0}</span>
                </div>
              </div>
            </div>
            <div className="p-2 bg-[#58d2c8]/10 rounded-lg group-hover:bg-[#58d2c8]/20 transition-all duration-300">
              <Building2 className="h-6 w-6 text-[#58d2c8] group-hover:scale-110 transition-transform duration-300" />
            </div>
          </div>
        </div>

        {/* إحصائيات العقود والمدفوعات */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:bg-[#58d2c8]/5 hover:border-[#58d2c8]/30 hover:shadow-lg hover:shadow-[#58d2c8]/20 hover:scale-105 transition-all duration-300 cursor-pointer group min-h-[120px]">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h3 className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-[#58d2c8] transition-colors duration-300 font-almarai mb-2">
                العقود والمدفوعات
              </h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-orange-600" />
                    <span className="text-sm">إجمالي العقود</span>
                  </div>
                  <span className="text-sm font-medium text-[#58d2c8]">{stats.totalContracts || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-green-600" />
                    <span className="text-sm">إجمالي المدفوعات</span>
                  </div>
                  <span className="text-sm font-medium text-[#58d2c8]">{stats.totalPayments?.toLocaleString() || 0} ر.ع</span>
                </div>
              </div>
            </div>
            <div className="p-2 bg-[#58d2c8]/10 rounded-lg group-hover:bg-[#58d2c8]/20 transition-all duration-300">
              <TrendingUp className="h-6 w-6 text-[#58d2c8] group-hover:scale-110 transition-transform duration-300" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// مكون توزيع العملاء حسب الجنسية
export function NationalityDistribution({ stats }: { stats: CustomerStatsType }) {
  const totalCustomers = stats.totalCustomers;
  
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-2 mb-4">
        <Calendar className="h-5 w-5 text-[#58d2c8]" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">توزيع العملاء حسب الجنسية</h3>
      </div>
      <div className="space-y-3">
        {Object.entries(stats.nationalityDistribution).map(([nationality, count]) => {
          const percentage = totalCustomers > 0 ? Math.round((count / totalCustomers) * 100) : 0;
          
          return (
            <div key={nationality} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#58d2c8]"></div>
                <span className="text-sm font-medium">{nationality}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">{count}</span>
                <span className="text-xs text-gray-500 dark:text-gray-500">({percentage}%)</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// مكون التسجيلات الشهرية
export function MonthlyRegistrations({ stats }: { stats: CustomerStatsType }) {
  const months = [
    'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
    'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
  ];
  
  const currentYear = new Date().getFullYear();
  const monthlyData = months.map((month, index) => {
    const monthKey = `${currentYear}-${String(index + 1).padStart(2, '0')}`;
    return {
      month,
      count: stats.monthlyRegistrations[monthKey] || 0,
    };
  });

  const maxCount = Math.max(...monthlyData.map(d => d.count));

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="h-5 w-5 text-[#58d2c8]" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">التسجيلات الشهرية</h3>
      </div>
      <div className="space-y-3">
        {monthlyData.map(({ month, count }) => {
          const percentage = maxCount > 0 ? (count / maxCount) * 100 : 0;
          
          return (
            <div key={month} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">{month}</span>
                <span className="text-gray-600 dark:text-gray-400">{count}</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-[#58d2c8] h-2 rounded-full transition-all duration-300"
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

