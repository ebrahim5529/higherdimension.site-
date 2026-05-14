/** @jsxImportSource react */
/**
 * مكون إحصائيات المخزون (مجاميع الكمية)
 */

import React from 'react';
import { Package, FileText, Warehouse } from 'lucide-react';

interface InventoryStatsType {
  totalQuantity: number;
  quantityLinkedToContract: number;
  availableQuantity: number;
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
  if (!stats) {
    return (
      <div className="w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

  const totalQty = stats.totalQuantity ?? 0;
  const contractQty = stats.quantityLinkedToContract ?? 0;
  const availableQty = stats.availableQuantity ?? 0;

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:bg-primary/5 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/20 hover:scale-105 transition-all duration-300 cursor-pointer group min-h-[100px]">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h3 className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-primary transition-colors duration-300 font-almarai mb-2">
                الكمية الإجمالية
              </h3>
              <div className="text-2xl font-bold text-primary group-hover:text-primary/80 transition-colors duration-300 font-tajawal">
                {totalQty.toLocaleString()}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">مجموع كميات الأصناف</p>
            </div>
            <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-all duration-300">
              <Package className="h-5 w-5 text-primary group-hover:scale-110 transition-transform duration-300" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:bg-primary/5 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/20 hover:scale-105 transition-all duration-300 cursor-pointer group min-h-[100px]">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h3 className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-primary transition-colors duration-300 font-almarai mb-2">
                المرتبط بعقد
              </h3>
              <div className="text-2xl font-bold text-primary group-hover:text-primary/80 transition-colors duration-300 font-tajawal">
                {contractQty.toLocaleString()}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">مجموع الكميات في بنود العقود</p>
            </div>
            <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-all duration-300">
              <FileText className="h-5 w-5 text-primary group-hover:scale-110 transition-transform duration-300" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:bg-primary/5 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/20 hover:scale-105 transition-all duration-300 cursor-pointer group min-h-[100px]">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h3 className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-primary transition-colors duration-300 font-almarai mb-2">
                المتاح
              </h3>
              <div className="text-2xl font-bold text-primary group-hover:text-primary/80 transition-colors duration-300 font-tajawal">
                {availableQty.toLocaleString()}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">مجموع «المتاح» لكل صنف</p>
            </div>
            <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-all duration-300">
              <Warehouse className="h-5 w-5 text-primary group-hover:scale-110 transition-transform duration-300" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
