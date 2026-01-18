/** @jsxImportSource react */
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
  Plus,
  Edit,
  Trash2,
  Eye,
  Download,
  Calendar,
  User,
  DollarSign,
  Package,
  ChevronLeft,
  ChevronRight,
  GitBranch,
  Printer,
  Receipt,
  PenSquare,
} from 'lucide-react';
import { Combobox } from '@/components/ui/combobox';

interface Contract {
  id: number;
  contractNumber: string;
  customerName: string;
  customerPhone: string;
  type: 'تأجير' | 'بيع';
  amount: number;
  totalAfterDiscount: number;
  totalPayments: number;
  remainingAmount: number;
  status: string;
  paymentStatus: string;
  startDate: string;
  endDate: string;
  deliveryAddress: string;
  locationMapLink?: string | null;
}

interface ContractsTableProps {
  data: Contract[];
  onAddContract: () => void;
  onEditContract: (contract: Contract) => void;
  onDeleteContract: (contract: Contract) => void;
  onViewContract: (contract: Contract) => void;
  onViewStages?: (contract: Contract) => void;
  onPrint?: (contract: Contract) => void;
  onIssueInvoice?: (contract: Contract) => void;
  isLoading?: boolean;
}

export function ContractsTable({
  data,
  onAddContract,
  onEditContract,
  onDeleteContract,
  onViewContract,
  onViewStages,
  onPrint,
  onIssueInvoice,
  isLoading = false,
}: ContractsTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'عقود مفتوحة':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'عقود مغلقة':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'عقود مغلقة ولم يتم استلام الأصناف':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // تقسيم البيانات إلى 3 مجموعات
  const openContracts = data.filter(contract => contract.status === 'عقود مفتوحة');
  const closedNotReceivedContracts = data.filter(contract => contract.status === 'عقود مغلقة ولم يتم استلام الأصناف');
  const closedContracts = data.filter(contract => contract.status === 'عقود مغلقة');

  // دالة لإنشاء جدول منفصل
  const renderContractTable = (contracts: Contract[], title: string, bgColor: string, borderColor: string) => {
    if (contracts.length === 0) return null;

    const table = useReactTable({
      data: contracts,
      columns,
      getCoreRowModel: getCoreRowModel(),
      getFilteredRowModel: getFilteredRowModel(),
      getSortedRowModel: getSortedRowModel(),
      getPaginationRowModel: getPaginationRowModel(),
      onSortingChange: setSorting,
      onColumnFiltersChange: setColumnFilters,
      onGlobalFilterChange: setGlobalFilter,
      state: {
        sorting,
        columnFilters,
        globalFilter,
      },
    });

    return (
      <Card key={title} className={`mb-6 ${borderColor}`}>
        <CardHeader className={`${bgColor} border-b`}>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            {title} ({contracts.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                      >
                        {header.isPlaceholder ? null : (
                          <div
                            className="cursor-pointer select-none flex items-center gap-1"
                            onClick={header.column.getToggleSortingHandler()}
                          >
                            {flexRender(header.column.columnDef.header, header.getContext())}
                            {{
                              asc: <ChevronRight className="h-4 w-4 rotate-90" />,
                              desc: <ChevronRight className="h-4 w-4 -rotate-90" />,
                            }[header.column.getIsSorted() as string] ?? null}
                          </div>
                        )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                {table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800/50"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        className="py-3 px-2 sm:px-4"
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    );
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'مدفوعة':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'غير مدفوعة':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'مدفوعة جزئياً':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // فلترة البيانات
  const filteredData = useMemo(() => {
    return data.filter((contract) => {
      const matchesSearch =
        contract.customerName.toLowerCase().includes(globalFilter.toLowerCase()) ||
        contract.contractNumber.toLowerCase().includes(globalFilter.toLowerCase()) ||
        contract.status.toLowerCase().includes(globalFilter.toLowerCase());

      const matchesStatus = statusFilter === 'all' || contract.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [data, globalFilter, statusFilter]);


  const columns: ColumnDef<Contract>[] = useMemo(
    () => [
      {
        accessorKey: 'contractNumber',
        header: 'رقم العقد',
        cell: ({ row }) => {
          const contractNumber = row.getValue('contractNumber') as string;
          return (
            <a
              href={`/contract/sign/${contractNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-[#58d2c8] hover:text-[#4AB8B3] hover:underline transition-colors cursor-pointer"
              onClick={(e) => {
                e.preventDefault();
                window.open(`/contract/sign/${contractNumber}`, '_blank');
              }}
            >
              {contractNumber}
            </a>
          );
        },
      },
      {
        accessorKey: 'customerName',
        header: 'العميل',
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-gray-400" />
            <span className="text-gray-900 dark:text-white">
              {row.getValue('customerName')}
            </span>
          </div>
        ),
      },
      {
        accessorKey: 'customerPhone',
        header: 'رقم الجوال',
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <span className="text-gray-900 dark:text-white">
              {row.getValue('customerPhone') || '-'}
            </span>
          </div>
        ),
      },
      {
        accessorKey: 'totalAfterDiscount',
        header: 'الإجمالي',
        cell: ({ row }) => (
          <div className="flex items-center gap-1">
            <DollarSign className="h-4 w-4 text-gray-400" />
            <span className="font-medium text-gray-900 dark:text-white">
              {Number(row.getValue('totalAfterDiscount')).toFixed(2)} ر.ع
            </span>
          </div>
        ),
      },
      {
        accessorKey: 'totalPayments',
        header: 'المدفوع',
        cell: ({ row }) => (
          <span className="font-medium text-green-600 dark:text-green-400">
            {Number(row.getValue('totalPayments')).toFixed(2)} ر.ع
          </span>
        ),
      },
      {
        accessorKey: 'remainingAmount',
        header: 'المتبقي',
        cell: ({ row }) => {
          const amount = Number(row.getValue('remainingAmount'));
          return (
            <span
              className={`font-medium ${amount > 0
                ? 'text-orange-600 dark:text-orange-400'
                : 'text-green-600 dark:text-green-400'
                }`}
            >
              {amount.toFixed(2)} ر.ع
            </span>
          );
        },
      },
      {
        accessorKey: 'status',
        header: 'الحالة',
        cell: ({ row }) => {
          const status = row.getValue('status') as string;
          return (
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(status)}`}
            >
              {status}
            </span>
          );
        },
      },
      {
        accessorKey: 'startDate',
        header: 'التواريخ',
        cell: ({ row }) => (
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4 text-gray-400" />
            <div className="text-sm text-gray-600 dark:text-gray-400">
              <div>من: {row.original.startDate}</div>
              <div>إلى: {row.original.endDate}</div>
            </div>
          </div>
        ),
      },
      {
        id: 'actions',
        header: 'الإجراءات',
        cell: ({ row }) => {
          const contract = row.original;
          return (
            <div className="px-6 py-4 whitespace-nowrap text-sm font-medium">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  {onViewStages && (
                    <button
                      onClick={() => onViewStages(contract)}
                      className="text-purple-600 hover:text-purple-700 transition-colors p-1"
                      title="عرض المراحل"
                    >
                      <GitBranch className="h-4 w-4" />
                    </button>
                  )}
                  <button
                    onClick={() => onViewContract(contract)}
                    className="text-[#58d2c8] hover:text-[#4AB8B3] transition-colors p-1"
                    title="عرض التفاصيل"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => onEditContract(contract)}
                    className="text-blue-600 hover:text-blue-700 transition-colors p-1"
                    title="تعديل"
                  >
                    <PenSquare className="h-4 w-4" />
                  </button>
                  {onPrint && (
                    <button
                      onClick={() => onPrint(contract)}
                      className="text-green-600 hover:text-green-700 transition-colors p-1"
                      title="طباعة"
                    >
                      <Printer className="h-4 w-4" />
                    </button>
                  )}
                  <button
                    onClick={() => onDeleteContract(contract)}
                    className="text-red-600 hover:text-red-700 transition-colors p-1"
                    title="حذف"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                {onIssueInvoice && (
                  <button
                    onClick={() => onIssueInvoice(contract)}
                    className="flex items-center justify-center gap-2 px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-medium rounded-lg transition-colors whitespace-nowrap"
                    title="إصدار فاتورة"
                  >
                    <Receipt className="h-3.5 w-3.5" />
                    إصدار فاتورة
                  </button>
                )}
              </div>
            </div>
          );
        },
      },
    ],
    [onViewContract, onEditContract, onDeleteContract, onViewStages, onPrint, onIssueInvoice]
  );

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
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
    <div className="space-y-6">
      {/* Header with search */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
              العقود
            </CardTitle>
            <Button
              onClick={onAddContract}
              className="flex items-center gap-2 bg-[#58d2c8] hover:bg-[#4AB8B3]"
            >
              <Plus className="h-4 w-4" />
              إضافة عقد جديد
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search */}
          <div className="relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="البحث في جميع العقود..."
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="w-full pr-10 pl-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#58d2c8] focus:border-transparent"
            />
          </div>
        </CardContent>
      </Card>

      {/* جدول العقود المفتوحة */}
      {renderContractTable(openContracts, 'عقود مفتوحة', 'bg-green-50 dark:bg-green-900/10', 'border-green-200 dark:border-green-800')}

      {/* جدول العقود المغلقة ولم يتم استلام الأصناف */}
      {renderContractTable(closedNotReceivedContracts, 'عقود مغلقة ولم يتم استلام الأصناف', 'bg-orange-50 dark:bg-orange-900/10', 'border-orange-200 dark:border-orange-800')}

      {/* جدول العقود المغلقة */}
      {renderContractTable(closedContracts, 'عقود مغلقة', 'bg-blue-50 dark:bg-blue-900/10', 'border-blue-200 dark:border-blue-800')}

      {/* رسالة إذا لم تكن هناك عقود */}
      {data.length === 0 && !isLoading && (
        <Card>
          <CardContent className="p-8 text-center">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              لا توجد عقود
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              لم يتم العثور على أي عقود في النظام
            </p>
            <Button
              onClick={onAddContract}
              className="bg-[#58d2c8] hover:bg-[#4AB8B3]"
            >
              <Plus className="h-4 w-4 ml-2" />
              إضافة عقد جديد
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

