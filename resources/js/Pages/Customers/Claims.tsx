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
  AlertCircle,
  CreditCard,
  Calendar,
} from 'lucide-react';
import { useState, useMemo } from 'react';

interface Payment {
  id: number;
  contractId: number;
  contractNumber: string;
  paymentMethod: string;
  paymentDate: string;
  amount: number;
}

interface Customer {
  id: number;
  customerNumber: string;
  name: string;
  phone: string;
  email: string;
  totalContractsValue: number;
  totalPaid: number;
  totalRemaining: number;
  overdueAmount: number;
  contractsCount: number;
  payments: Payment[];
}

interface CustomersClaimsProps {
  customers: Customer[];
}

export default function CustomersClaims({ customers }: CustomersClaimsProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'overview' | 'payments'>('overview');

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

  const totalRemaining = filteredCustomers.reduce((sum, c) => sum + c.totalRemaining, 0);
  const totalOverdue = filteredCustomers.reduce((sum, c) => sum + c.overdueAmount, 0);
  const totalPaid = filteredCustomers.reduce((sum, c) => sum + c.totalPaid, 0);

  return (
    <DashboardLayout>
      <Head title="إدارة المطالبات" />
      <div className="space-y-6 pb-8 mt-2 -mx-1 sm:-mx-2 lg:-mx-3 xl:-mx-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              إدارة المطالبات
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              عرض المدفوعات والمبالغ المتبقية للعملاء
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">إجمالي المتبقي</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {formatCurrency(totalRemaining)}
                  </p>
                </div>
                <div className="p-3 bg-red-100 dark:bg-red-900 rounded-lg">
                  <DollarSign className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">المتأخر</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {formatCurrency(totalOverdue)}
                  </p>
                </div>
                <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                  <AlertCircle className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">إجمالي المدفوع</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {formatCurrency(totalPaid)}
                  </p>
                </div>
                <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                  <CreditCard className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <CardTitle>العملاء والمطالبات</CardTitle>
                <div className="flex gap-2">
                  <Button
                    variant={activeTab === 'overview' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setActiveTab('overview')}
                  >
                    نظرة عامة
                  </Button>
                  <Button
                    variant={activeTab === 'payments' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setActiveTab('payments')}
                  >
                    المدفوعات
                  </Button>
                </div>
              </div>
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
            {activeTab === 'overview' && (
              <div className="space-y-4">
                {filteredCustomers.map((customer) => (
                  <Card key={customer.id} className="border-2">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between mb-4">
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
                            </div>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          onClick={() => router.visit(`/customers/${customer.id}`)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          عرض العميل
                        </Button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                        {customer.overdueAmount > 0 && (
                          <div className="p-3 bg-yellow-50 dark:bg-yellow-900 rounded-lg">
                            <div className="text-sm text-gray-600 dark:text-gray-400">المتأخر</div>
                            <div className="text-lg font-bold text-yellow-600 dark:text-yellow-400">
                              {formatCurrency(customer.overdueAmount)}
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {filteredCustomers.length === 0 && (
                  <div className="text-center py-12">
                    <AlertCircle className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                    <p className="text-gray-500 dark:text-gray-400">
                      {searchTerm ? 'لا توجد نتائج للبحث' : 'لا توجد مطالبات'}
                    </p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'payments' && (
              <div className="space-y-4">
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
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {customer.customerNumber}
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {customer.payments.length > 0 ? (
                        <div className="overflow-x-auto">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>رقم الدفعة</TableHead>
                                <TableHead>رقم العقد</TableHead>
                                <TableHead>طريقة الدفع</TableHead>
                                <TableHead>تاريخ الدفع</TableHead>
                                <TableHead>المبلغ</TableHead>
                                <TableHead className="text-right">الإجراءات</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {customer.payments.map((payment) => (
                                <TableRow key={payment.id}>
                                  <TableCell className="font-medium">
                                    #{payment.id}
                                  </TableCell>
                                  <TableCell>
                                    <div className="flex items-center gap-2">
                                      <FileText className="h-4 w-4 text-gray-500" />
                                      {payment.contractNumber}
                                    </div>
                                  </TableCell>
                                  <TableCell>{payment.paymentMethod}</TableCell>
                                  <TableCell>
                                    <div className="flex items-center gap-1">
                                      <Calendar className="h-4 w-4 text-gray-500" />
                                      {formatDate(payment.paymentDate)}
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    <span className="font-semibold text-green-600">
                                      {formatCurrency(payment.amount)}
                                    </span>
                                  </TableCell>
                                  <TableCell className="text-right">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => router.visit(`/payments/${payment.id}`)}
                                    >
                                      <Eye className="h-4 w-4" />
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      ) : (
                        <p className="text-center py-8 text-gray-500 dark:text-gray-400">
                          لا توجد مدفوعات لهذا العميل
                        </p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

