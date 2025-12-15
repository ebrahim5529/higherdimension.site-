/** @jsxImportSource react */
import React, { useState } from 'react';
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

interface EmployeeTableData {
  id: string;
  employeeId: string;
  name: string;
  position: string;
  department: string;
  email: string;
  phone: string;
  hireDate: string;
  status: 'active' | 'inactive' | 'on_leave';
  salary: number;
  manager: string;
  location: string;
}

interface EmployeesTableProps {
  data: EmployeeTableData[];
  onAddEmployee: () => void;
  onEditEmployee: (employee: EmployeeTableData) => void;
  onDeleteEmployee: (employee: EmployeeTableData) => void;
  onViewEmployee: (employee: EmployeeTableData) => void;
  onExportEmployees: () => void;
  isLoading?: boolean;
}

export function EmployeesTable({
  data,
  onAddEmployee,
  onEditEmployee,
  onDeleteEmployee,
  onViewEmployee,
  onExportEmployees,
  isLoading = false,
}: EmployeesTableProps) {
  const [globalFilter, setGlobalFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const getStatusLabel = (status: string) => {
    const statusLabels: Record<string, string> = {
      active: 'نشط',
      inactive: 'غير نشط',
      on_leave: 'في إجازة',
    };
    return statusLabels[status] || status;
  };

  const getStatusColor = (status: string) => {
    const statusColors: Record<string, string> = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-red-100 text-red-800',
      on_leave: 'bg-yellow-100 text-yellow-800',
    };
    return statusColors[status] || 'bg-gray-100 text-gray-800';
  };

  // تطبيق الفلاتر
  const filteredData = data.filter((item) => {
    if (globalFilter) {
      const searchTerm = globalFilter.toLowerCase();
      const name = item.name?.toLowerCase() || '';
      const employeeId = item.employeeId?.toLowerCase() || '';
      const position = item.position?.toLowerCase() || '';
      const department = item.department?.toLowerCase() || '';

      if (
        !name.includes(searchTerm) &&
        !employeeId.includes(searchTerm) &&
        !position.includes(searchTerm) &&
        !department.includes(searchTerm)
      ) {
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

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-4 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* شريط البحث والفلترة */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="البحث في الموظفين..."
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm sm:text-base"
            />
          </div>
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
          >
            <Filter className="h-4 w-4" />
            فلاتر
            {showFilters ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
          <Button
            onClick={onAddEmployee}
            className="flex items-center gap-2 bg-[#913D95] hover:bg-[#7A2F7D]"
          >
            <Plus className="h-4 w-4" />
            إضافة موظف
          </Button>
          <Button
            variant="outline"
            onClick={onExportEmployees}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            تصدير
          </Button>
        </div>

        {/* الفلاتر المتقدمة */}
        {showFilters && (
          <div className="p-3 sm:p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-sm text-gray-600">لا توجد فلاتر متاحة حالياً</p>
          </div>
        )}
      </div>

      {/* الجدول */}
      <div className="rounded-md border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="px-2 py-3 text-right text-sm font-medium text-gray-900 dark:text-gray-100 whitespace-nowrap">
                  الموظف
                </th>
                <th className="px-2 py-3 text-right text-sm font-medium text-gray-900 dark:text-gray-100 whitespace-nowrap">
                  المنصب
                </th>
                <th className="px-2 py-3 text-right text-sm font-medium text-gray-900 dark:text-gray-100 whitespace-nowrap">
                  القسم
                </th>
                <th className="px-2 py-3 text-right text-sm font-medium text-gray-900 dark:text-gray-100 whitespace-nowrap">
                  الراتب
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
                currentData.map((row) => (
                  <tr
                    key={row.id}
                    className="border-b hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <td className="px-2 py-3 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="flex-shrink-0 h-8 w-8">
                          <div className="h-8 w-8 rounded-full bg-[#913D95]/10 flex items-center justify-center">
                            <span className="text-[#913D95] font-medium text-xs">
                              {row.name
                                .split(' ')
                                .map((n) => n[0])
                                .join('')
                                .slice(0, 2)}
                            </span>
                          </div>
                        </div>
                        <div>
                          <div className="font-medium text-[#913D95]">{row.name}</div>
                          <div className="text-xs text-gray-500">{row.employeeId}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-2 py-3 text-sm">
                      <div className="text-sm text-gray-700">{row.position}</div>
                    </td>
                    <td className="px-2 py-3 text-sm">
                      <div className="text-sm text-gray-700">{row.department}</div>
                    </td>
                    <td className="px-2 py-3 text-sm">
                      <div className="text-sm font-medium text-[#913D95]">
                        {row.salary.toLocaleString()} ر.ع
                      </div>
                    </td>
                    <td className="px-2 py-3 text-sm">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(row.status)}`}
                      >
                        {getStatusLabel(row.status)}
                      </span>
                    </td>
                    <td className="px-2 py-3 text-sm">
                      <div className="flex items-center gap-0.5">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onViewEmployee(row)}
                          className="h-6 w-6 p-0 hover:bg-blue-100"
                          title="عرض التفاصيل"
                        >
                          <Eye className="h-3 w-3 text-blue-600" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEditEmployee(row)}
                          className="h-6 w-6 p-0 hover:bg-green-100"
                          title="تعديل"
                        >
                          <Edit className="h-3 w-3 text-green-600" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDeleteEmployee(row)}
                          className="h-6 w-6 p-0 hover:bg-red-100"
                          title="حذف"
                        >
                          <Trash2 className="h-3 w-3 text-red-600" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="h-24 text-center text-gray-500">
                    لا يوجد موظفين
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* التحكم في الصفحات */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-700">
          عرض {startIndex + 1} إلى {Math.min(endIndex, filteredData.length)} من{' '}
          {filteredData.length} موظف
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
            <span className="text-sm text-gray-700">صفحة</span>
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
    </div>
  );
}

