/** @jsxImportSource react */
/**
 * جدول الموردين مع البحث والفلترة
 */

import React, { useState, useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  ColumnDef,
  flexRender,
  SortingState,
  ColumnFiltersState,
} from '@tanstack/react-table';
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
  User,
  Building2,
  Star,
  Mail,
  Phone,
  Calendar,
  FileText,
  ShoppingCart,
  AlertTriangle,
} from 'lucide-react';

interface SupplierTableData {
  id: string;
  supplierNumber: string;
  name: string;
  supplierType: 'INDIVIDUAL' | 'COMPANY';
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  rating: number;
  registrationDate: Date | string;
  email?: string;
  phone?: string;
  invoicesCount?: number;
  purchasesCount?: number;
  hasWarnings?: boolean;
}

interface SuppliersTableProps {
  data: SupplierTableData[];
  onAddSupplier: () => void;
  onEditSupplier: (supplier: SupplierTableData) => void;
  onDeleteSupplier: (supplier: SupplierTableData) => void;
  onViewSupplier: (supplier: SupplierTableData) => void;
  onExportSuppliers: () => void;
}

export function SuppliersTable({
  data,
  onAddSupplier,
  onEditSupplier,
  onDeleteSupplier,
  onViewSupplier,
  onExportSuppliers,
}: SuppliersTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // تعريف أعمدة الجدول
  const columns: ColumnDef<SupplierTableData>[] = useMemo(
    () => [
      {
        accessorKey: 'supplierNumber',
        header: 'رقم المورد',
        cell: ({ row }) => (
          <div className="font-medium text-primary">
            {row.getValue('supplierNumber')}
          </div>
        ),
      },
      {
        accessorKey: 'name',
        header: 'اسم المورد',
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            {row.original.supplierType === 'COMPANY' ? (
              <Building2 className="h-4 w-4 text-blue-600" />
            ) : (
              <User className="h-4 w-4 text-green-600" />
            )}
            <span className="font-medium">{row.getValue('name')}</span>
            {row.original.hasWarnings && (
              <AlertTriangle className="h-4 w-4 text-red-500" />
            )}
          </div>
        ),
      },
      {
        accessorKey: 'supplierType',
        header: 'نوع المورد',
        cell: ({ row }) => {
          const type = row.getValue('supplierType') as string;
          return (
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                type === 'COMPANY'
                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                  : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
              }`}
            >
              {type === 'COMPANY' ? 'شركة' : 'فرد'}
            </span>
          );
        },
      },
      {
        accessorKey: 'status',
        header: 'الحالة',
        cell: ({ row }) => {
          const status = row.getValue('status') as string;
          const statusConfig = {
            ACTIVE: { label: 'نشط', className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' },
            INACTIVE: { label: 'غير نشط', className: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200' },
            SUSPENDED: { label: 'معلق', className: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' },
          };
          const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.INACTIVE;
          return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.className}`}>
              {config.label}
            </span>
          );
        },
      },
      {
        accessorKey: 'rating',
        header: 'التقييم',
        cell: ({ row }) => {
          const rating = row.getValue('rating') as number;
          return rating ? (
            <div className="flex items-center gap-1">
              <Star className="h-3 w-3 text-yellow-500 fill-current" />
              <span className="text-sm">{rating}/5</span>
            </div>
          ) : (
            <span className="text-sm text-muted-foreground">-</span>
          );
        },
      },
      {
        accessorKey: 'invoicesCount',
        header: 'الفواتير',
        cell: ({ row }) => {
          const count = row.getValue('invoicesCount') as number;
          return (
            <div className="flex items-center gap-1">
              <FileText className="h-3 w-3 text-blue-600" />
              <span className="text-sm">{count || 0}</span>
            </div>
          );
        },
      },
      {
        accessorKey: 'purchasesCount',
        header: 'المشتريات',
        cell: ({ row }) => {
          const count = row.getValue('purchasesCount') as number;
          return (
            <div className="flex items-center gap-1">
              <ShoppingCart className="h-3 w-3 text-purple-600" />
              <span className="text-sm">{count || 0}</span>
            </div>
          );
        },
      },
      {
        accessorKey: 'registrationDate',
        header: 'تاريخ التسجيل',
        cell: ({ row }) => {
          const date = row.getValue('registrationDate') as Date | string;
          return (
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span className="text-sm">
                {new Date(date).toLocaleDateString('ar-SA')}
              </span>
            </div>
          );
        },
      },
      {
        id: 'actions',
        header: 'الإجراءات',
        cell: ({ row }) => {
          const supplier = row.original;
          return (
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onViewSupplier(supplier)}
                className="h-8 w-8 p-0"
                title="عرض التفاصيل"
              >
                <Eye className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEditSupplier(supplier)}
                className="h-8 w-8 p-0"
                title="تعديل"
              >
                <Edit className="h-4 w-4" />
              </Button>
              {supplier.phone && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => window.open(`tel:${supplier.phone}`)}
                  className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700"
                  title={`اتصال: ${supplier.phone}`}
                >
                  <Phone className="h-4 w-4" />
                </Button>
              )}
              {supplier.email && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => window.open(`mailto:${supplier.email}`)}
                  className="h-8 w-8 p-0 text-green-600 hover:text-green-700"
                  title={`إرسال بريد: ${supplier.email}`}
                >
                  <Mail className="h-4 w-4" />
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDeleteSupplier(supplier)}
                className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                title="حذف"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          );
        },
      },
    ],
    [onViewSupplier, onEditSupplier, onDeleteSupplier]
  );

  // إنشاء الجدول
  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>قائمة الموردين</CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onExportSuppliers}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              تصدير
            </Button>
            <Button
              onClick={onAddSupplier}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              إضافة مورد
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
                placeholder="البحث في الموردين..."
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

          {/* فلاتر متقدمة */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div>
                <label className="block text-sm font-medium mb-1">الحالة</label>
                <select
                  value={(table.getColumn('status')?.getFilterValue() as string) ?? ''}
                  onChange={(e) =>
                    table.getColumn('status')?.setFilterValue(e.target.value || undefined)
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700"
                >
                  <option value="">جميع الحالات</option>
                  <option value="ACTIVE">نشط</option>
                  <option value="INACTIVE">غير نشط</option>
                  <option value="SUSPENDED">معلق</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">نوع المورد</label>
                <select
                  value={(table.getColumn('supplierType')?.getFilterValue() as string) ?? ''}
                  onChange={(e) =>
                    table.getColumn('supplierType')?.setFilterValue(e.target.value || undefined)
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700"
                >
                  <option value="">جميع الأنواع</option>
                  <option value="INDIVIDUAL">فرد</option>
                  <option value="COMPANY">شركة</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">الترتيب حسب</label>
                <select
                  onChange={(e) => {
                    const sortOption = e.target.value;
                    if (sortOption) {
                      switch (sortOption) {
                        case 'newest':
                          table.getColumn('registrationDate')?.toggleSorting(false);
                          break;
                        case 'oldest':
                          table.getColumn('registrationDate')?.toggleSorting(true);
                          break;
                        case 'rating-high':
                          table.getColumn('rating')?.toggleSorting(false);
                          break;
                        case 'rating-low':
                          table.getColumn('rating')?.toggleSorting(true);
                          break;
                      }
                    }
                  }}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700"
                >
                  <option value="">اختر الترتيب</option>
                  <option value="newest">الأحدث أولاً</option>
                  <option value="oldest">الأقدم أولاً</option>
                  <option value="rating-high">أعلى تقييم أولاً</option>
                  <option value="rating-low">أقل تقييم أولاً</option>
                </select>
              </div>
              <div className="flex items-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    table.resetColumnFilters();
                    setGlobalFilter('');
                  }}
                  className="w-full"
                >
                  مسح جميع الفلاتر
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* الجدول */}
        <div className="rounded-md border overflow-x-auto">
          <table className="w-full min-w-[1000px]">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} className="border-b bg-gray-50 dark:bg-gray-800">
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-4 py-3 text-right text-sm font-medium text-gray-900 dark:text-gray-100 whitespace-nowrap"
                    >
                      {header.isPlaceholder ? null : (
                        <div
                          className={
                            header.column.getCanSort()
                              ? 'cursor-pointer select-none flex items-center gap-1'
                              : ''
                          }
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {header.column.getCanSort() && (
                            <div className="flex flex-col">
                              {header.column.getIsSorted() === 'asc' ? (
                                <ChevronUp className="h-3 w-3" />
                              ) : header.column.getIsSorted() === 'desc' ? (
                                <ChevronDown className="h-3 w-3" />
                              ) : (
                                <div className="h-3 w-3" />
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className="border-b hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-4 py-3 text-sm whitespace-nowrap">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length} className="h-24 text-center text-muted-foreground">
                    لا توجد بيانات للعرض
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* التنقل بين الصفحات */}
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              عرض {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} إلى{' '}
              {Math.min(
                (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
                table.getFilteredRowModel().rows.length
              )}{' '}
              من {table.getFilteredRowModel().rows.length} مورد
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronLeft className="h-4 w-4" />
              السابق
            </Button>
            <span className="text-sm">
              صفحة {table.getState().pagination.pageIndex + 1} من {table.getPageCount()}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              التالي
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

