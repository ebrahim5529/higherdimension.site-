/** @jsxImportSource react */
import { Head, router, useForm } from '@inertiajs/react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  User,
  Building2,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Star,
  AlertTriangle,
  FileText,
  DollarSign,
  TrendingUp,
  Download,
  Printer,
  Edit,
  ArrowLeft,
  UserCheck,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  Plus,
} from 'lucide-react';
import { useState } from 'react';
import { showToast } from '@/hooks/use-toast';

interface PhoneNumber {
  number: string;
  type: 'MOBILE' | 'LANDLINE' | 'WHATSAPP';
  label?: string;
  isPrimary?: boolean;
}

interface GuarantorData {
  name?: string;
  phone?: string;
  idNumber?: string;
  nationality?: string;
  address?: string;
  relationship?: string;
  workPlace?: string;
  workPhone?: string;
}

interface Customer {
  id: number;
  customer_number: string;
  name: string;
  email?: string;
  phone?: string;
  phones?: PhoneNumber[];
  address?: string;
  nationality?: string;
  customer_type: 'INDIVIDUAL' | 'COMPANY';
  id_number?: string;
  commercial_record?: string;
  status: 'ACTIVE' | 'INACTIVE';
  registration_date: string;
  guarantor_name?: string;
  guarantor_phone?: string;
  guarantor_id?: string;
  guarantorData?: GuarantorData;
  notes?: string;
  warnings?: string;
  rating?: number;
  id_card_copy_path?: string;
  guarantor_id_card_copy_path?: string;
  commercial_record_copy_path?: string;
  contracts?: any[];
  payments?: any[];
  contractPayments?: ContractPayment[];
  customerNotes?: any[];
  contractsSummary?: {
    total: number;
    active: number;
    completed: number;
    cancelled: number;
    totalValue: number;
  };
  paymentsSummary?: {
    total: number;
    paid: number;
    pending: number;
    overdue: number;
    totalAmount: number;
  };
}

interface ContractPayment {
  id: number;
  contractId: number;
  contractNumber: string;
  contractTitle: string;
  paymentMethod: string;
  paymentMethodValue: string;
  paymentDate: string;
  amount: number;
  checkNumber?: string;
  bankName?: string;
  checkDate?: string;
  checkImagePath?: string;
  notes?: string;
  createdAt: string;
}

interface CustomerShowProps {
  customer: Customer;
}

export default function CustomerShow({ customer }: CustomerShowProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'contracts' | 'payments' | 'notes'>('overview');

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'OMR',
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'INACTIVE':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'COMPLETED':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return <CheckCircle className="h-4 w-4" />;
      case 'INACTIVE':
        return <XCircle className="h-4 w-4" />;
      case 'COMPLETED':
        return <CheckCircle className="h-4 w-4" />;
      case 'PENDING':
        return <Clock className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  // استخدام الإحصائيات من الـ controller إذا كانت موجودة
  const contractsSummary = customer.contractsSummary || {
    total: customer.contracts?.length || 0,
    active: customer.contracts?.filter((c: any) => c.status === 'ACTIVE').length || 0,
    completed: customer.contracts?.filter((c: any) => c.status === 'COMPLETED').length || 0,
    cancelled: customer.contracts?.filter((c: any) => c.status === 'CANCELLED').length || 0,
    totalValue: customer.contracts?.reduce((sum: number, c: any) => sum + (c.total_value || 0), 0) || 0,
  };

  const paymentsSummary = customer.paymentsSummary || {
    total: customer.payments?.length || 0,
    paid: customer.payments?.filter((p: any) => p.status === 'PAID').length || 0,
    pending: customer.payments?.filter((p: any) => p.status === 'PENDING').length || 0,
    overdue: customer.payments?.filter((p: any) => p.status === 'OVERDUE').length || 0,
    totalAmount: customer.payments?.reduce((sum: number, p: any) => sum + (p.amount || 0), 0) || 0,
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExport = () => {
    alert('سيتم تصدير ملف العميل');
  };

  return (
    <DashboardLayout>
      <Head title={`${customer.name} - تفاصيل العميل`} />
      <div className="space-y-6 mt-2 -mx-1 sm:-mx-2 lg:-mx-3 xl:-mx-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => router.visit('/customers')}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                {customer.customer_type === 'COMPANY' ? (
                  <Building2 className="h-6 w-6" />
                ) : (
                  <User className="h-6 w-6" />
                )}
                {customer.name}
              </h1>
              <p className="text-muted-foreground">
                رقم العميل: {customer.customer_number}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handlePrint}>
              <Printer className="h-4 w-4" />
              طباعة
            </Button>
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="h-4 w-4" />
              تصدير
            </Button>
            <Button onClick={() => router.visit(`/customers/${customer.id}/edit`)}>
              <Edit className="h-4 w-4" />
              تعديل
            </Button>
          </div>
        </div>

        {/* Status and Rating */}
        <div className="flex items-center gap-4">
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2 ${getStatusColor(
              customer.status
            )}`}
          >
            {getStatusIcon(customer.status)}
            {customer.status === 'ACTIVE' ? 'نشط' : 'غير نشط'}
          </span>
          {customer.rating && (
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 text-yellow-500 fill-current" />
              <span className="text-sm font-medium">{customer.rating}/5</span>
            </div>
          )}
          {customer.warnings && (
            <div className="flex items-center gap-1 text-red-600">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-sm font-medium">تحذيرات</span>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="border-b">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'نظرة عامة', icon: Eye },
              { id: 'contracts', label: 'العقود', icon: FileText },
              { id: 'payments', label: 'المدفوعات', icon: DollarSign },
              { id: 'notes', label: 'الملاحظات', icon: FileText },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-primary text-primary'
                      : 'border-transparent text-muted-foreground hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Basic Information */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    المعلومات الأساسية
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">الاسم الكامل</label>
                      <p className="text-sm">{customer.name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">نوع العميل</label>
                      <p className="text-sm">
                        {customer.customer_type === 'COMPANY' ? 'شركة' : 'فرد'}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">رقم الهوية/السجل</label>
                      <p className="text-sm font-mono">
                        {customer.id_number || customer.commercial_record || '-'}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">الجنسية</label>
                      <p className="text-sm">{customer.nationality || '-'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">رقم الهاتف الرئيسي</label>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        <p className="text-sm">{customer.phone || '-'}</p>
                      </div>
                    </div>
                    {customer.phones && customer.phones.length > 0 && (
                      <div className="md:col-span-2">
                        <label className="text-sm font-medium text-muted-foreground mb-2 block">أرقام الهواتف الإضافية</label>
                        <div className="space-y-2">
                          {customer.phones.map((phone: PhoneNumber, index: number) => (
                            <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                              <Phone className="h-4 w-4 text-gray-400" />
                              <span className="text-sm">{phone.number}</span>
                              <span className="text-xs text-muted-foreground">
                                ({phone.type === 'MOBILE' ? 'جوال' : phone.type === 'LANDLINE' ? 'أرضي' : 'واتساب'})
                              </span>
                              {phone.label && (
                                <span className="text-xs text-muted-foreground">- {phone.label}</span>
                              )}
                              {phone.isPrimary && (
                                <span className="text-xs bg-primary text-white px-2 py-0.5 rounded-full">رئيسي</span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">البريد الإلكتروني</label>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        <p className="text-sm">{customer.email || '-'}</p>
                      </div>
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-sm font-medium text-muted-foreground">العنوان</label>
                      <div className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 mt-0.5" />
                        <p className="text-sm">{customer.address || '-'}</p>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">تاريخ التسجيل</label>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <p className="text-sm">{formatDate(customer.registration_date)}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Guarantor Information */}
              {(customer.guarantorData || customer.guarantor_name || customer.guarantor_phone || customer.guarantor_id) && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <UserCheck className="h-5 w-5" />
                      معلومات الضامن
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {customer.guarantorData ? (
                      // عرض بيانات الضامن الكاملة
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">اسم الضامن</label>
                          <p className="text-sm">{customer.guarantorData.name || customer.guarantor_name || '-'}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">هاتف الضامن</label>
                          <p className="text-sm">{customer.guarantorData.phone || customer.guarantor_phone || '-'}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">رقم هوية الضامن</label>
                          <p className="text-sm font-mono">{customer.guarantorData.idNumber || customer.guarantor_id || '-'}</p>
                        </div>
                        {customer.guarantorData.nationality && (
                          <div>
                            <label className="text-sm font-medium text-muted-foreground">جنسية الضامن</label>
                            <p className="text-sm">{customer.guarantorData.nationality}</p>
                          </div>
                        )}
                        {customer.guarantorData.relationship && (
                          <div>
                            <label className="text-sm font-medium text-muted-foreground">صلة القرابة</label>
                            <p className="text-sm">{customer.guarantorData.relationship}</p>
                          </div>
                        )}
                        {customer.guarantorData.workPlace && (
                          <div>
                            <label className="text-sm font-medium text-muted-foreground">مكان العمل</label>
                            <p className="text-sm">{customer.guarantorData.workPlace}</p>
                          </div>
                        )}
                        {customer.guarantorData.workPhone && (
                          <div>
                            <label className="text-sm font-medium text-muted-foreground">هاتف العمل</label>
                            <p className="text-sm">{customer.guarantorData.workPhone}</p>
                          </div>
                        )}
                        {customer.guarantorData.address && (
                          <div className="md:col-span-2">
                            <label className="text-sm font-medium text-muted-foreground">عنوان الضامن</label>
                            <p className="text-sm">{customer.guarantorData.address}</p>
                          </div>
                        )}
                      </div>
                    ) : (
                      // عرض بيانات الضامن البسيطة
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">اسم الضامن</label>
                          <p className="text-sm">{customer.guarantor_name || '-'}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">هاتف الضامن</label>
                          <p className="text-sm">{customer.guarantor_phone || '-'}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">رقم هوية الضامن</label>
                          <p className="text-sm font-mono">{customer.guarantor_id || '-'}</p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Notes and Warnings */}
              {(customer.notes || customer.warnings) && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      الملاحظات والتحذيرات
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {customer.notes && (
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">ملاحظات عامة</label>
                        <p className="text-sm mt-1 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          {customer.notes}
                        </p>
                      </div>
                    )}
                    {customer.warnings && (
                      <div>
                        <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4 text-red-500" />
                          تحذيرات خاصة
                        </label>
                        <p className="text-sm mt-1 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-800 dark:text-red-200">
                          {customer.warnings}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Summary Cards */}
            <div className="space-y-6 mt-2 -mx-1 sm:-mx-2 lg:-mx-3 xl:-mx-4">
              {/* Contracts Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    ملخص العقود
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">إجمالي العقود</span>
                    <span className="font-medium">{contractsSummary.total}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">عقود نشطة</span>
                    <span className="font-medium text-green-600">{contractsSummary.active}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">عقود مكتملة</span>
                    <span className="font-medium text-blue-600">{contractsSummary.completed}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">عقود ملغاة</span>
                    <span className="font-medium text-red-600">{contractsSummary.cancelled}</span>
                  </div>
                  <div className="pt-2 border-t">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">إجمالي القيمة</span>
                      <span className="font-bold text-primary">
                        {formatCurrency(contractsSummary.totalValue)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Payments Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    ملخص المدفوعات
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">إجمالي المدفوعات</span>
                    <span className="font-medium">{paymentsSummary.total}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">مدفوعات مكتملة</span>
                    <span className="font-medium text-green-600">{paymentsSummary.paid}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">مدفوعات معلقة</span>
                    <span className="font-medium text-yellow-600">{paymentsSummary.pending}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">مدفوعات متأخرة</span>
                    <span className="font-medium text-red-600">{paymentsSummary.overdue}</span>
                  </div>
                  <div className="pt-2 border-t">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">إجمالي المبلغ</span>
                      <span className="font-bold text-primary">
                        {formatCurrency(paymentsSummary.totalAmount)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeTab === 'contracts' && (
          <div className="space-y-6 mt-2 -mx-1 sm:-mx-2 lg:-mx-3 xl:-mx-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  قائمة العقود
                </CardTitle>
              </CardHeader>
              <CardContent>
                {customer.contracts && customer.contracts.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">رقم العقد</th>
                          <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">نوع العقد</th>
                          <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">الحالة</th>
                          <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">تاريخ البدء</th>
                          <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">تاريخ الانتهاء</th>
                          <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">القيمة الإجمالية</th>
                        </tr>
                      </thead>
                      <tbody>
                        {customer.contracts.map((contract: any) => (
                          <tr
                            key={contract.id}
                            className="border-b hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                          >
                            <td className="py-3 px-4">
                              <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                {contract.contract_number || contract.id}
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <div className="text-sm text-gray-600 dark:text-gray-400">
                                {contract.contract_type || '-'}
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <span
                                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                  contract.status
                                )}`}
                              >
                                {contract.status === 'ACTIVE' ? 'نشط' : contract.status === 'EXPIRED' ? 'منتهي' : contract.status === 'CANCELLED' ? 'ملغي' : 'معلق'}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <div className="text-sm text-gray-600 dark:text-gray-400">
                                {contract.start_date ? formatDate(contract.start_date) : '-'}
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <div className="text-sm text-gray-600 dark:text-gray-400">
                                {contract.end_date ? formatDate(contract.end_date) : '-'}
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                {formatCurrency(contract.total_value ?? contract.amount ?? 0)}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">لا توجد عقود لهذا العميل</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'payments' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-[#58d2c8]" />
                  مدفوعات العميل
                </CardTitle>
              </CardHeader>
              <CardContent>
                {customer.contractPayments && customer.contractPayments.length > 0 ? (
                  <div className="space-y-3">
                    {customer.contractPayments.map((payment: ContractPayment) => (
                      <div
                        key={payment.id}
                        className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-[#58d2c8] transition-colors cursor-pointer"
                        onClick={() => router.visit(`/payments/${payment.id}`)}
                      >
                        <div className="flex items-center gap-4 flex-1">
                          <div className="p-2 bg-[#58d2c8]/10 rounded-lg">
                            <DollarSign className="h-5 w-5 text-[#58d2c8]" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-3">
                              <p className="font-semibold text-gray-900 dark:text-white">
                                #{payment.id}
                              </p>
                              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                                {payment.paymentMethod}
                              </span>
                            </div>
                            <div className="flex items-center gap-4 mt-1 text-sm text-gray-600 dark:text-gray-400">
                              <div className="flex items-center gap-1">
                                <FileText className="h-4 w-4" />
                                <span>{payment.contractNumber}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                <span>{payment.paymentDate}</span>
                              </div>
                              {payment.checkNumber && (
                                <div className="flex items-center gap-1">
                                  <FileText className="h-4 w-4" />
                                  <span>رقم الشيك: {payment.checkNumber}</span>
                                </div>
                              )}
                              {payment.bankName && (
                                <div className="flex items-center gap-1">
                                  <Building2 className="h-4 w-4" />
                                  <span>{payment.bankName}</span>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="text-left">
                            <p className="text-lg font-bold text-green-600 dark:text-green-400">
                              {formatCurrency(payment.amount)}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              {payment.createdAt}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 mr-4">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="p-2 hover:bg-[#58d2c8]/10"
                            onClick={(e) => {
                              e.stopPropagation();
                              router.visit(`/payments/${payment.id}`);
                            }}
                            title="عرض التفاصيل"
                          >
                            <Eye className="h-5 w-5 text-[#58d2c8]" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <DollarSign className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                    <p>لا توجد مدفوعات لهذا العميل</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'notes' && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>ملاحظات العميل</CardTitle>
                <AddNoteDialog customerId={customer.id} />
              </div>
            </CardHeader>
            <CardContent>
              {customer.customerNotes && customer.customerNotes.length > 0 ? (
                <div className="space-y-4">
                  {customer.customerNotes.map((note: any) => (
                    <div key={note.id} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">{note.title || 'ملاحظة'}</span>
                        <span className="text-xs text-muted-foreground">
                          {note.created_at ? formatDate(note.created_at) : '-'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{note.content || note.note || '-'}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                  <p className="text-muted-foreground mb-4">لا توجد ملاحظات لهذا العميل</p>
                  <AddNoteDialog customerId={customer.id} />
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}

function AddNoteDialog({ customerId }: { customerId: number }) {
  const [open, setOpen] = useState(false);
  const { data, setData, post, processing, errors, reset } = useForm({
    title: '',
    content: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(`/customers/${customerId}/notes`, {
      onSuccess: () => {
        showToast.success('نجح', 'تم إضافة الملاحظة بنجاح');
        reset();
        setOpen(false);
      },
      onError: (errors) => {
        if (errors.title) {
          showToast.error('خطأ', errors.title);
        }
        if (errors.content) {
          showToast.error('خطأ', errors.content);
        }
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[#58d2c8] hover:bg-[#4AB8B3] text-white flex items-center gap-2">
          <Plus className="h-4 w-4" />
          إضافة ملاحظة
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>إضافة ملاحظة جديدة</DialogTitle>
          <DialogDescription>
            أضف ملاحظة جديدة للعميل
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">
                العنوان
              </label>
              <Input
                id="title"
                value={data.title}
                onChange={(e) => setData('title', e.target.value)}
                placeholder="عنوان الملاحظة"
                className={errors.title ? 'border-red-500' : ''}
              />
              {errors.title && (
                <p className="text-sm text-red-500">{errors.title}</p>
              )}
            </div>
            <div className="space-y-2">
              <label htmlFor="content" className="text-sm font-medium">
                المحتوى
              </label>
              <Textarea
                id="content"
                value={data.content}
                onChange={(e) => setData('content', e.target.value)}
                placeholder="محتوى الملاحظة"
                rows={5}
                className={errors.content ? 'border-red-500' : ''}
              />
              {errors.content && (
                <p className="text-sm text-red-500">{errors.content}</p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setOpen(false);
                reset();
              }}
            >
              إلغاء
            </Button>
            <Button type="submit" disabled={processing} className="bg-[#58d2c8] hover:bg-[#4AB8B3] text-white">
              {processing ? 'جاري الحفظ...' : 'حفظ'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

