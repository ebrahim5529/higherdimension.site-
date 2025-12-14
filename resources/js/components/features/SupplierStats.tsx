/** @jsxImportSource react */
/**
 * مكون إحصائيات الموردين
 */

import React from 'react';
import {
  Users,
  Building2,
  User,
  MapPin,
  FileText,
  DollarSign,
  ShoppingCart,
} from 'lucide-react';

interface SupplierStatsType {
  totalSuppliers: number;
  activeSuppliers: number;
  inactiveSuppliers: number;
  suspendedSuppliers: number;
  individualSuppliers: number;
  companySuppliers: number;
  totalInvoices: number;
  totalInvoiceAmount: number;
  paidAmount: number;
  pendingAmount: number;
  overdueAmount: number;
  totalPurchases: number;
  totalPurchaseAmount: number;
  suppliersWithWarnings: number;
  averageRating: number;
  nationalityDistribution: Record<string, number>;
  monthlyRegistrations: Record<string, number>;
}

interface SupplierStatsProps {
  stats: SupplierStatsType;
}

export function SupplierStats({ stats }: SupplierStatsProps) {
  // التحقق من وجود البيانات
  if (!stats) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* إجمالي الموردين */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:bg-primary/5 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/20 hover:scale-105 transition-all duration-300 cursor-pointer group min-h-[120px]">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h3 className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-primary transition-colors duration-300 font-almarai mb-2">
                إجمالي الموردين
              </h3>
              <div className="text-2xl font-bold text-primary group-hover:text-primary/80 transition-colors duration-300 font-tajawal">
                {stats.totalSuppliers || 0}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {stats.activeSuppliers || 0} نشط، {stats.inactiveSuppliers || 0} غير نشط
              </p>
            </div>
            <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-all duration-300">
              <Users className="h-6 w-6 text-primary group-hover:scale-110 transition-transform duration-300" />
            </div>
          </div>
        </div>

        {/* أنواع الموردين */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:bg-primary/5 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/20 hover:scale-105 transition-all duration-300 cursor-pointer group min-h-[120px]">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h3 className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-primary transition-colors duration-300 font-almarai mb-2">
                أنواع الموردين
              </h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-green-600" />
                    <span className="text-sm">أفراد</span>
                  </div>
                  <span className="text-sm font-medium text-primary">{stats.individualSuppliers || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-blue-600" />
                    <span className="text-sm">شركات</span>
                  </div>
                  <span className="text-sm font-medium text-primary">{stats.companySuppliers || 0}</span>
                </div>
              </div>
            </div>
            <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-all duration-300">
              <Building2 className="h-6 w-6 text-primary group-hover:scale-110 transition-transform duration-300" />
            </div>
          </div>
        </div>

        {/* توزيع الجنسيات */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:bg-primary/5 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/20 hover:scale-105 transition-all duration-300 cursor-pointer group min-h-[120px]">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h3 className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-primary transition-colors duration-300 font-almarai mb-2">
                توزيع الجنسيات
              </h3>
              <div className="space-y-2">
                {stats.nationalityDistribution && Object.entries(stats.nationalityDistribution).slice(0, 3).map(([nationality, count]) => (
                  <div key={nationality} className="flex items-center justify-between">
                    <span className="text-sm truncate">{nationality}</span>
                    <span className="text-sm font-medium text-primary">{count}</span>
                  </div>
                ))}
                {(!stats.nationalityDistribution || Object.keys(stats.nationalityDistribution).length === 0) && (
                  <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
                    لا توجد بيانات
                  </div>
                )}
                {stats.nationalityDistribution && Object.keys(stats.nationalityDistribution).length > 3 && (
                  <div className="text-xs text-gray-500 dark:text-gray-400 text-center pt-1">
                    +{Object.keys(stats.nationalityDistribution).length - 3} أخرى
                  </div>
                )}
              </div>
            </div>
            <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-all duration-300">
              <MapPin className="h-6 w-6 text-primary group-hover:scale-110 transition-transform duration-300" />
            </div>
          </div>
        </div>

        {/* الفواتير */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:bg-primary/5 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/20 hover:scale-105 transition-all duration-300 cursor-pointer group min-h-[120px]">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h3 className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-primary transition-colors duration-300 font-almarai mb-2">
                الفواتير
              </h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-blue-600" />
                    <span className="text-sm">إجمالي الفواتير</span>
                  </div>
                  <span className="text-sm font-medium text-primary">{stats.totalInvoices || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-green-600" />
                    <span className="text-sm">إجمالي المبلغ</span>
                  </div>
                  <span className="text-sm font-medium text-primary">{stats.totalInvoiceAmount?.toLocaleString() || 0} ر.ع</span>
                </div>
              </div>
            </div>
            <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-all duration-300">
              <FileText className="h-6 w-6 text-primary group-hover:scale-110 transition-transform duration-300" />
            </div>
          </div>
        </div>

        {/* المشتريات */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:bg-primary/5 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/20 hover:scale-105 transition-all duration-300 cursor-pointer group min-h-[120px]">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h3 className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-primary transition-colors duration-300 font-almarai mb-2">
                المشتريات
              </h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShoppingCart className="h-4 w-4 text-purple-600" />
                    <span className="text-sm">إجمالي المشتريات</span>
                  </div>
                  <span className="text-sm font-medium text-primary">{stats.totalPurchases || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-green-600" />
                    <span className="text-sm">إجمالي المبلغ</span>
                  </div>
                  <span className="text-sm font-medium text-primary">{stats.totalPurchaseAmount?.toLocaleString() || 0} ر.ع</span>
                </div>
              </div>
            </div>
            <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-all duration-300">
              <ShoppingCart className="h-6 w-6 text-primary group-hover:scale-110 transition-transform duration-300" />
            </div>
          </div>
        </div>

        {/* التقييم */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:bg-primary/5 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/20 hover:scale-105 transition-all duration-300 cursor-pointer group min-h-[120px]">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h3 className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-primary transition-colors duration-300 font-almarai mb-2">
                التقييم المتوسط
              </h3>
              <div className="text-2xl font-bold text-primary group-hover:text-primary/80 transition-colors duration-300 font-tajawal">
                {stats.averageRating ? stats.averageRating.toFixed(1) : '0.0'}/5
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {stats.suppliersWithWarnings || 0} مورد لديه تحذيرات
              </p>
            </div>
            <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-all duration-300">
              <Users className="h-6 w-6 text-primary group-hover:scale-110 transition-transform duration-300" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

