/** @jsxImportSource react */
/**
 * مكون إحصائيات المخزون
 */

import React from 'react';
import {
  CheckCircle,
  DollarSign,
  Wrench,
  TrendingUp,
  Package,
  AlertTriangle,
} from 'lucide-react';

interface InventoryStatsType {
  totalScaffolds: number;
  availableScaffolds: number;
  rentedScaffolds: number;
  soldScaffolds: number;
  maintenanceScaffolds: number;
  reservedScaffolds: number;
  totalValue: number;
  availableValue: number;
  rentedValue: number;
  soldValue: number;
  maintenanceValue: number;
  lowStockItems: number;
  maintenanceDueItems: number;
  typeDistribution: Record<string, number>;
  materialDistribution: Record<string, number>;
  conditionDistribution: Record<string, number>;
  statusDistribution: Record<string, number>;
  monthlyAdditions: Record<string, number>;
  monthlyRentals: Record<string, number>;
  monthlySales: Record<string, number>;
}

interface InventoryStatsProps {
  stats: InventoryStatsType;
}

export function InventoryStats({ stats }: InventoryStatsProps) {
  // التحقق من وجود البيانات
  if (!stats) {
    return (
      <div className="w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* السقالات المتوفرة */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:bg-primary/5 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/20 hover:scale-105 transition-all duration-300 cursor-pointer group min-h-[100px]">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h3 className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-primary transition-colors duration-300 font-almarai mb-2">
                السقالات المتوفرة
              </h3>
              <div className="text-2xl font-bold text-primary group-hover:text-primary/80 transition-colors duration-300 font-tajawal">
                {stats.availableScaffolds || 0}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                من إجمالي {stats.totalScaffolds || 0} سقالة
              </p>
            </div>
            <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-all duration-300">
              <CheckCircle className="h-5 w-5 text-primary group-hover:scale-110 transition-transform duration-300" />
            </div>
          </div>
        </div>

        {/* السقالات المستأجرة */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:bg-primary/5 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/20 hover:scale-105 transition-all duration-300 cursor-pointer group min-h-[100px]">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h3 className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-primary transition-colors duration-300 font-almarai mb-2">
                السقالات المستأجرة
              </h3>
              <div className="text-2xl font-bold text-primary group-hover:text-primary/80 transition-colors duration-300 font-tajawal">
                {stats.rentedScaffolds || 0}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                بقيمة {stats.rentedValue?.toLocaleString() || 0} ر.ع
              </p>
            </div>
            <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-all duration-300">
              <TrendingUp className="h-5 w-5 text-primary group-hover:scale-110 transition-transform duration-300" />
            </div>
          </div>
        </div>

        {/* السقالات المباعة */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:bg-primary/5 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/20 hover:scale-105 transition-all duration-300 cursor-pointer group min-h-[100px]">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h3 className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-primary transition-colors duration-300 font-almarai mb-2">
                السقالات المباعة
              </h3>
              <div className="text-2xl font-bold text-primary group-hover:text-primary/80 transition-colors duration-300 font-tajawal">
                {stats.soldScaffolds || 0}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                بقيمة {stats.soldValue?.toLocaleString() || 0} ر.ع
              </p>
            </div>
            <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-all duration-300">
              <DollarSign className="h-5 w-5 text-primary group-hover:scale-110 transition-transform duration-300" />
            </div>
          </div>
        </div>

        {/* السقالات تحت الصيانة */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:bg-primary/5 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/20 hover:scale-105 transition-all duration-300 cursor-pointer group min-h-[100px]">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h3 className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-primary transition-colors duration-300 font-almarai mb-2">
                تحت الصيانة
              </h3>
              <div className="text-2xl font-bold text-primary group-hover:text-primary/80 transition-colors duration-300 font-tajawal">
                {stats.maintenanceScaffolds || 0}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {stats.maintenanceDueItems || 0} تحتاج صيانة
              </p>
            </div>
            <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-all duration-300">
              <Wrench className="h-5 w-5 text-primary group-hover:scale-110 transition-transform duration-300" />
            </div>
          </div>
        </div>

        {/* السقالات المحجوزة */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:bg-primary/5 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/20 hover:scale-105 transition-all duration-300 cursor-pointer group min-h-[100px]">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h3 className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-primary transition-colors duration-300 font-almarai mb-2">
                السقالات المحجوزة
              </h3>
              <div className="text-2xl font-bold text-primary group-hover:text-primary/80 transition-colors duration-300 font-tajawal">
                {stats.reservedScaffolds || 0}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                محجوزة للعملاء
              </p>
            </div>
            <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-all duration-300">
              <Package className="h-5 w-5 text-primary group-hover:scale-110 transition-transform duration-300" />
            </div>
          </div>
        </div>

        {/* المخزون المنخفض */}
        {stats.lowStockItems > 0 && (
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-orange-200 dark:border-orange-700 hover:bg-orange-50 dark:hover:bg-orange-900/20 hover:border-orange-300 dark:hover:border-orange-600 hover:shadow-lg hover:shadow-orange-200/20 hover:scale-105 transition-all duration-300 cursor-pointer group min-h-[100px]">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="text-sm text-orange-600 dark:text-orange-400 group-hover:text-orange-700 dark:group-hover:text-orange-300 transition-colors duration-300 font-almarai mb-2">
                  مخزون منخفض
                </h3>
                <div className="text-2xl font-bold text-orange-600 dark:text-orange-400 group-hover:text-orange-700 dark:group-hover:text-orange-300 transition-colors duration-300 font-tajawal">
                  {stats.lowStockItems || 0}
                </div>
                <p className="text-xs text-orange-500 dark:text-orange-400 mt-1">
                  يحتاج إعادة تزويد
                </p>
              </div>
              <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg group-hover:bg-orange-200 dark:group-hover:bg-orange-900/50 transition-all duration-300">
                <AlertTriangle className="h-5 w-5 text-orange-600 dark:text-orange-400 group-hover:scale-110 transition-transform duration-300" />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

