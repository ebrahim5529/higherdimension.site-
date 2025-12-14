/** @jsxImportSource react */
/**
 * مكون جدول السقالات
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Search, 
  Filter, 
  Download, 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

interface ScaffoldTableData {
  id: string;
  scaffoldNumber: string;
  type: string;
  size: string;
  material: string;
  condition: string;
  status: string;
  quantity: number;
  availableQuantity: number;
  location: string;
  sellingPrice: number;
  dailyRentalPrice: number;
  monthlyRentalPrice: number;
  entryDate: string;
  lastMaintenanceDate?: string;
  nextMaintenanceDate?: string;
  hasImages: boolean;
  hasAttachments: boolean;
  notes?: string;
  supplierName?: string;
  createdAt: string;
  updatedAt: string;
  descriptionAr?: string;
  descriptionEn?: string;
}

interface ScaffoldsTableProps {
  data: ScaffoldTableData[];
  onAddScaffold: () => void;
  onEditScaffold: (scaffold: ScaffoldTableData) => void;
  onDeleteScaffold: (scaffold: ScaffoldTableData) => void;
  onViewScaffold: (scaffold: ScaffoldTableData) => void;
  onExportScaffolds: () => void;
}

export function ScaffoldsTable({
  data,
  onAddScaffold,
  onEditScaffold,
  onDeleteScaffold,
  onViewScaffold,
  onExportScaffolds,
}: ScaffoldsTableProps) {
  const [globalFilter, setGlobalFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // تطبيق الفلاتر
  const filteredData = data.filter((item) => {
    const itemAny = item as any;
    // فلترة النص العام (البحث في كود الصنف والوصف العربي والإنجليزي)
    if (globalFilter) {
      const searchTerm = globalFilter.toLowerCase();
      const scaffoldNumber = item.scaffoldNumber?.toLowerCase() || '';
      const descriptionAr = itemAny.description_ar?.toLowerCase() || itemAny.descriptionAr?.toLowerCase() || '';
      const descriptionEn = itemAny.description_en?.toLowerCase() || itemAny.descriptionEn?.toLowerCase() || '';
      
      if (!scaffoldNumber.includes(searchTerm) && 
          !descriptionAr.includes(searchTerm) && 
          !descriptionEn.includes(searchTerm)) {
        return false;
      }
    }
    
    return true;
  });

  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  const getTypeLabel = (type: string) => {
    const typeLabels: Record<string, string> = {
      FIXED: 'مثبتة',
      MOBILE: 'متحركة',
      TOWER: 'برجية',
      CANTILEVER: 'كابولية',
      SUSPENDED: 'معلقة',
    };
    return typeLabels[type] || type;
  };

  const getMaterialLabel = (material: string) => {
    const materialLabels: Record<string, string> = {
      STEEL: 'حديد',
      ALUMINUM: 'ألومنيوم',
      WOOD: 'خشب',
      COMPOSITE: 'مركب',
    };
    return materialLabels[material] || material;
  };

  const getConditionLabel = (condition: string) => {
    const conditionLabels: Record<string, string> = {
      NEW: 'جديد',
      USED: 'مستعمل',
      REFURBISHED: 'معاد تأهيله',
    };
    return conditionLabels[condition] || condition;
  };

  const getStatusLabel = (status: string) => {
    const statusLabels: Record<string, string> = {
      AVAILABLE: 'متوفرة',
      RENTED: 'مستأجرة',
      SOLD: 'مباعة',
      MAINTENANCE: 'صيانة',
      RESERVED: 'محجوزة',
    };
    return statusLabels[status] || status;
  };

  const getStatusColor = (status: string) => {
    const statusColors: Record<string, string> = {
      AVAILABLE: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      RENTED: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      SOLD: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      MAINTENANCE: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      RESERVED: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
    };
    return statusColors[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>قائمة السقالات</CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onExportScaffolds}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              تصدير
            </Button>
            <Button
              onClick={onAddScaffold}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              إضافة معدة
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* شريط البحث والفلترة */}
        <div className="mb-4 space-y-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="البحث في السقالات..."
                value={globalFilter}
                onChange={(e) => setGlobalFilter(e.target.value)}
                className="w-full pr-10 pl-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-800"
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              فلترة
              {showFilters ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </div>

          {/* الفلاتر المتقدمة */}
          {showFilters && (
            <div className="p-3 sm:p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400">لا توجد فلاتر متاحة حالياً</p>
            </div>
          )}
        </div>

        {/* الجدول */}
        <div className="rounded-md border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead>
                <tr className="border-b bg-gray-50 dark:bg-gray-800">
                  <th className="px-2 py-3 text-right text-sm font-medium text-gray-900 dark:text-gray-100 whitespace-nowrap">
                    كود الصنف
                  </th>
                  <th className="px-2 py-3 text-right text-sm font-medium text-gray-900 dark:text-gray-100 whitespace-nowrap">
                    الكمية
                  </th>
                  <th className="px-2 py-3 text-right text-sm font-medium text-gray-900 dark:text-gray-100 whitespace-nowrap">
                    الوصف العربي
                  </th>
                  <th className="px-2 py-3 text-right text-sm font-medium text-gray-900 dark:text-gray-100 whitespace-nowrap">
                    الوصف الإنجليزي
                  </th>
                  <th className="px-2 py-3 text-right text-sm font-medium text-gray-900 dark:text-gray-100 whitespace-nowrap">
                    الإيجار اليومي
                  </th>
                  <th className="px-2 py-3 text-right text-sm font-medium text-gray-900 dark:text-gray-100 whitespace-nowrap">
                    الإيجار الشهري
                  </th>
                  <th className="px-2 py-3 text-right text-sm font-medium text-gray-900 dark:text-gray-100 whitespace-nowrap">
                    الحالة
                  </th>
                  <th className="px-2 py-3 text-right text-sm font-medium text-gray-900 dark:text-gray-100 whitespace-nowrap">
                    الإجراءات
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentData.length > 0 ? (
                  currentData.map((row) => {
                    const rowAny = row as any;
                    return (
                      <tr
                        key={row.id}
                        className="border-b hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      >
                        <td className="px-2 py-3 text-sm">
                          <div className="font-medium text-primary">
                            {row.scaffoldNumber}
                          </div>
                        </td>
                        <td className="px-2 py-3 text-sm">
                          <div className="text-center">
                            <div className="text-sm font-medium">{row.quantity}</div>
                            <div className="text-xs text-gray-500">متاح: {row.availableQuantity}</div>
                          </div>
                        </td>
                        <td className="px-2 py-3 text-sm">
                          <div className="text-sm text-gray-700 dark:text-gray-300 max-w-xs truncate" title={rowAny.descriptionAr || rowAny.description_ar || ''}>
                            {rowAny.descriptionAr || rowAny.description_ar || '—'}
                          </div>
                        </td>
                        <td className="px-2 py-3 text-sm">
                          <div className="text-sm text-gray-700 dark:text-gray-300 max-w-xs truncate" title={rowAny.descriptionEn || rowAny.description_en || ''}>
                            {rowAny.descriptionEn || rowAny.description_en || '—'}
                          </div>
                        </td>
                        <td className="px-2 py-3 text-sm">
                          <div className="text-sm font-medium text-primary">
                            {row.dailyRentalPrice.toLocaleString()} ر.ع
                          </div>
                        </td>
                        <td className="px-2 py-3 text-sm">
                          <div className="text-sm font-medium text-primary">
                            {row.monthlyRentalPrice.toLocaleString()} ر.ع
                          </div>
                        </td>
                        <td className="px-2 py-3 text-sm">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(row.status)}`}>
                            {getStatusLabel(row.status)}
                          </span>
                        </td>
                        <td className="px-2 py-3 text-sm">
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onViewScaffold(row)}
                              className="h-8 w-8 p-0 hover:bg-blue-100 dark:hover:bg-blue-900"
                              title="عرض التفاصيل"
                            >
                              <Eye className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onEditScaffold(row)}
                              className="h-8 w-8 p-0 hover:bg-green-100 dark:hover:bg-green-900"
                              title="تعديل"
                            >
                              <Edit className="h-4 w-4 text-green-600 dark:text-green-400" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onDeleteScaffold(row)}
                              className="h-8 w-8 p-0 hover:bg-red-100 dark:hover:bg-red-900"
                              title="حذف"
                            >
                              <Trash2 className="h-4 w-4 text-red-600 dark:text-red-400" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={8} className="h-24 text-center text-muted-foreground">
                      لا توجد سقالات
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* التحكم في الصفحات */}
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-muted-foreground">
            عرض {startIndex + 1} إلى{' '}
            {Math.min(endIndex, filteredData.length)}{' '}
            من {filteredData.length} معدة
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="flex items-center gap-1"
            >
              <ChevronRight className="h-4 w-4" />
              السابق
            </Button>
            <div className="flex items-center gap-1">
              <span className="text-sm">صفحة</span>
              <span className="font-medium">
                {currentPage} من {totalPages}
              </span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="flex items-center gap-1"
            >
              التالي
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

