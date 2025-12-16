/** @jsxImportSource react */
import { Head, router } from '@inertiajs/react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  FileText,
  User,
  Phone,
  Mail,
  Search,
  Eye,
  Hash,
  DollarSign,
  Calendar,
} from 'lucide-react';
import { useState, useMemo } from 'react';

interface Contract {
  id: number;
  contractNumber: string;
  title: string;
  status: string;
  amount: number;
  paidAmount: number;
  remainingAmount: number;
  startDate: string;
  endDate: string;
}

interface Customer {
  id: number;
  customerNumber: string;
  name: string;
  phone: string;
  email: string;
  contractsCount: number;
  activeContractsCount: number;
  totalContractsValue: number;
  totalPaid: number;
  totalRemaining: number;
  contracts: Contract[];
}

interface CustomersContractsProps {
  customers: Customer[];
}

export default function CustomersContracts({ customers }: CustomersContractsProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCustomers = useMemo(() => {
    if (!searchTerm) return customers;
    
    return customers.filter(
      (customer) =>
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.customerNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [customers, searchTerm]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'OMR',
    }).format(amount);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'COMPLETED':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'EXPIRED':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'نشط';
      case 'COMPLETED':
        return 'مكتمل';
      case 'CANCELLED':
        return 'ملغي';
      case 'EXPIRED':
        return 'منتهي';
      default:
        return status;
    }
  };

  return (
    <DashboardLayout>
      <Head title="سجل العقود الخاصة بالعملاء" />
      <div className="space-y-6 pb-8 mt-2 -mx-1 sm:-mx-2 lg:-mx-3 xl:-mx-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              سجل العقود الخاصة بالعملاء
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              عرض جميع العملاء مع عدد العقود الخاصة بكل عميل
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>العملاء والعقود</CardTitle>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="ابحث عن عميل..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {filteredCustomers.map((customer) => (
                <Card key={customer.id} className="border-2">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                          <User className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                            {customer.name}
                          </h3>
                          <div className="flex items-center gap-4 mt-1 text-sm text-gray-600 dark:text-gray-400">
                            <div className="flex items-center gap-1">
                              <Hash className="h-4 w-4" />
                              <span>{customer.customerNumber}</span>
                            </div>
                            {customer.phone && (
                              <div className="flex items-center gap-1">
                                <Phone className="h-4 w-4" />
                                <span>{customer.phone}</span>
                              </div>
                            )}
                            {customer.email && (
                              <div className="flex items-center gap-1">
                                <Mail className="h-4 w-4" />
                                <span>{customer.email}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-left">
                        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                          {customer.contractsCount}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          عقد {customer.activeContractsCount > 0 && `(${customer.activeContractsCount} نشط)`}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="text-sm text-gray-600 dark:text-gray-400">إجمالي قيمة العقود</div>
                        <div className="text-lg font-bold text-gray-900 dark:text-white">
                          {formatCurrency(customer.totalContractsValue)}
                        </div>
                      </div>
                      <div className="p-3 bg-green-50 dark:bg-green-900 rounded-lg">
                        <div className="text-sm text-gray-600 dark:text-gray-400">المبلغ المدفوع</div>
                        <div className="text-lg font-bold text-green-600 dark:text-green-400">
                          {formatCurrency(customer.totalPaid)}
                        </div>
                      </div>
                      <div className="p-3 bg-red-50 dark:bg-red-900 rounded-lg">
                        <div className="text-sm text-gray-600 dark:text-gray-400">المبلغ المتبقي</div>
                        <div className="text-lg font-bold text-red-600 dark:text-red-400">
                          {formatCurrency(customer.totalRemaining)}
                        </div>
                      </div>
                    </div>

                    {customer.contracts.length > 0 && (
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>رقم العقد</TableHead>
                              <TableHead>عنوان العقد</TableHead>
                              <TableHead>الحالة</TableHead>
                              <TableHead>المبلغ الإجمالي</TableHead>
                              <TableHead>المدفوع</TableHead>
                              <TableHead>المتبقي</TableHead>
                              <TableHead>تاريخ البدء</TableHead>
                              <TableHead>تاريخ الانتهاء</TableHead>
                              <TableHead className="text-right">الإجراءات</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {customer.contracts.map((contract) => (
                              <TableRow key={contract.id}>
                                <TableCell className="font-medium">
                                  <div className="flex items-center gap-2">
                                    <FileText className="h-4 w-4 text-gray-500" />
                                    {contract.contractNumber}
                                  </div>
                                </TableCell>
                                <TableCell>{contract.title}</TableCell>
                                <TableCell>
                                  <span
                                    className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                      contract.status
                                    )}`}
                                  >
                                    {getStatusLabel(contract.status)}
                                  </span>
                                </TableCell>
                                <TableCell>
                                  <span className="font-semibold">
                                    {formatCurrency(contract.amount)}
                                  </span>
                                </TableCell>
                                <TableCell>
                                  <span className="font-semibold text-green-600">
                                    {formatCurrency(contract.paidAmount)}
                                  </span>
                                </TableCell>
                                <TableCell>
                                  <span className="font-semibold text-red-600">
                                    {formatCurrency(contract.remainingAmount)}
                                  </span>
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-1">
                                    <Calendar className="h-4 w-4 text-gray-500" />
                                    {formatDate(contract.startDate)}
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-1">
                                    <Calendar className="h-4 w-4 text-gray-500" />
                                    {contract.endDate ? formatDate(contract.endDate) : '-'}
                                  </div>
                                </TableCell>
                                <TableCell className="text-right">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => router.visit(`/contracts/${contract.id}`)}
                                  >
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}

              {filteredCustomers.length === 0 && (
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                  <p className="text-gray-500 dark:text-gray-400">
                    {searchTerm ? 'لا توجد نتائج للبحث' : 'لا توجد عملاء'}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

