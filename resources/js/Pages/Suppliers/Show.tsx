/** @jsxImportSource react */
import { Head, router } from '@inertiajs/react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
  ShoppingCart,
  Download,
  Printer,
  Edit,
  ArrowLeft,
  UserCheck,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  Building,
  CreditCard,
} from 'lucide-react';
import { useState } from 'react';

interface Supplier {
  id: number;
  supplierNumber: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  nationality?: string;
  supplierType: 'INDIVIDUAL' | 'COMPANY';
  idNumber?: string;
  commercialRecord?: string;
  taxNumber?: string;
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  registrationDate: string;
  contactPerson?: string;
  contactPersonPhone?: string;
  contactPersonEmail?: string;
  bankName?: string;
  bankAccount?: string;
  iban?: string;
  swiftCode?: string;
  notes?: string;
  warnings?: string;
  rating?: number;
  invoices?: any[];
  purchases?: any[];
  invoicesSummary: {
    total: number;
    pending: number;
    paid: number;
    overdue: number;
    totalAmount: number;
  };
  purchasesSummary: {
    total: number;
    pending: number;
    confirmed: number;
    delivered: number;
    totalAmount: number;
  };
}

interface SupplierShowProps {
  supplier: Supplier;
}

export default function SupplierShow({ supplier }: SupplierShowProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'invoices' | 'purchases' | 'notes'>('overview');

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
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      case 'SUSPENDED':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'PAID':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'OVERDUE':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'DELIVERED':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'CONFIRMED':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
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
      case 'SUSPENDED':
        return <AlertTriangle className="h-4 w-4" />;
      case 'PAID':
      case 'DELIVERED':
        return <CheckCircle className="h-4 w-4" />;
      case 'PENDING':
      case 'CONFIRMED':
        return <Clock className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'نشط';
      case 'INACTIVE':
        return 'غير نشط';
      case 'SUSPENDED':
        return 'معلق';
      case 'PAID':
        return 'مدفوع';
      case 'PENDING':
        return 'معلق';
      case 'OVERDUE':
        return 'متأخر';
      case 'DELIVERED':
        return 'مسلم';
      case 'CONFIRMED':
        return 'مؤكد';
      default:
        return status;
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExport = () => {
    alert('سيتم تصدير ملف المورد');
  };

  return (
    <DashboardLayout>
      <Head title={`${supplier.name} - تفاصيل المورد`} />
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => router.visit('/suppliers')}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                {supplier.supplierType === 'COMPANY' ? (
                  <Building2 className="h-6 w-6" />
                ) : (
                  <User className="h-6 w-6" />
                )}
                {supplier.name}
              </h1>
              <p className="text-muted-foreground">
                رقم المورد: {supplier.supplierNumber}
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
            <Button onClick={() => router.visit(`/suppliers/${supplier.id}/edit`)}>
              <Edit className="h-4 w-4" />
              تعديل
            </Button>
          </div>
        </div>

        {/* Status and Rating */}
        <div className="flex items-center gap-4">
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2 ${getStatusColor(
              supplier.status
            )}`}
          >
            {getStatusIcon(supplier.status)}
            {getStatusText(supplier.status)}
          </span>
          {supplier.rating && (
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 text-yellow-500 fill-current" />
              <span className="text-sm font-medium">{supplier.rating}/5</span>
            </div>
          )}
          {supplier.warnings && (
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
              { id: 'invoices', label: 'الفواتير', icon: FileText },
              { id: 'purchases', label: 'المشتريات', icon: ShoppingCart },
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
                      <p className="text-sm">{supplier.name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">نوع المورد</label>
                      <p className="text-sm">
                        {supplier.supplierType === 'COMPANY' ? 'شركة' : 'فرد'}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">رقم الهوية/السجل</label>
                      <p className="text-sm font-mono">
                        {supplier.idNumber || supplier.commercialRecord || '-'}
                      </p>
                    </div>
                    {supplier.taxNumber && (
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">الرقم الضريبي</label>
                        <p className="text-sm font-mono">{supplier.taxNumber}</p>
                      </div>
                    )}
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">الجنسية</label>
                      <p className="text-sm">{supplier.nationality || '-'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">رقم الهاتف</label>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        <p className="text-sm">{supplier.phone || '-'}</p>
                      </div>
                    </div>
                    {supplier.email && (
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">البريد الإلكتروني</label>
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          <p className="text-sm">{supplier.email}</p>
                        </div>
                      </div>
                    )}
                    <div className="md:col-span-2">
                      <label className="text-sm font-medium text-muted-foreground">العنوان</label>
                      <div className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 mt-0.5" />
                        <p className="text-sm">{supplier.address || '-'}</p>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">تاريخ التسجيل</label>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <p className="text-sm">{formatDate(supplier.registrationDate)}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Contact Person Information */}
              {(supplier.contactPerson || supplier.contactPersonPhone || supplier.contactPersonEmail) && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <UserCheck className="h-5 w-5" />
                      معلومات الشخص المسؤول
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {supplier.contactPerson && (
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">اسم الشخص المسؤول</label>
                          <p className="text-sm">{supplier.contactPerson}</p>
                        </div>
                      )}
                      {supplier.contactPersonPhone && (
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">هاتف الشخص المسؤول</label>
                          <p className="text-sm">{supplier.contactPersonPhone}</p>
                        </div>
                      )}
                      {supplier.contactPersonEmail && (
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">بريد الشخص المسؤول</label>
                          <p className="text-sm">{supplier.contactPersonEmail}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Bank Information */}
              {(supplier.bankName || supplier.bankAccount || supplier.iban || supplier.swiftCode) && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building className="h-5 w-5" />
                      معلومات البنك
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {supplier.bankName && (
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">اسم البنك</label>
                          <p className="text-sm">{supplier.bankName}</p>
                        </div>
                      )}
                      {supplier.bankAccount && (
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">رقم الحساب</label>
                          <p className="text-sm font-mono">{supplier.bankAccount}</p>
                        </div>
                      )}
                      {supplier.iban && (
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">رقم الآيبان</label>
                          <p className="text-sm font-mono">{supplier.iban}</p>
                        </div>
                      )}
                      {supplier.swiftCode && (
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">رمز السويفت</label>
                          <p className="text-sm font-mono">{supplier.swiftCode}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Notes and Warnings */}
              {(supplier.notes || supplier.warnings) && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      الملاحظات والتحذيرات
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {supplier.notes && (
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">ملاحظات عامة</label>
                        <p className="text-sm mt-1 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          {supplier.notes}
                        </p>
                      </div>
                    )}
                    {supplier.warnings && (
                      <div>
                        <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4 text-red-500" />
                          تحذيرات خاصة
                        </label>
                        <p className="text-sm mt-1 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-800 dark:text-red-200">
                          {supplier.warnings}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Summary Cards */}
            <div className="space-y-6">
              {/* Invoices Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    ملخص الفواتير
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">إجمالي الفواتير</span>
                    <span className="font-medium">{supplier.invoicesSummary.total}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">فواتير مدفوعة</span>
                    <span className="font-medium text-green-600">{supplier.invoicesSummary.paid}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">فواتير معلقة</span>
                    <span className="font-medium text-yellow-600">{supplier.invoicesSummary.pending}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">فواتير متأخرة</span>
                    <span className="font-medium text-red-600">{supplier.invoicesSummary.overdue}</span>
                  </div>
                  <div className="pt-2 border-t">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">إجمالي المبلغ</span>
                      <span className="font-bold text-primary">
                        {formatCurrency(supplier.invoicesSummary.totalAmount)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Purchases Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ShoppingCart className="h-5 w-5" />
                    ملخص المشتريات
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">إجمالي المشتريات</span>
                    <span className="font-medium">{supplier.purchasesSummary.total}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">مشتريات مسلمة</span>
                    <span className="font-medium text-green-600">{supplier.purchasesSummary.delivered}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">مشتريات مؤكدة</span>
                    <span className="font-medium text-blue-600">{supplier.purchasesSummary.confirmed}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">مشتريات معلقة</span>
                    <span className="font-medium text-yellow-600">{supplier.purchasesSummary.pending}</span>
                  </div>
                  <div className="pt-2 border-t">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">إجمالي المبلغ</span>
                      <span className="font-bold text-primary">
                        {formatCurrency(supplier.purchasesSummary.totalAmount)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeTab === 'invoices' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  قائمة الفواتير
                </CardTitle>
              </CardHeader>
              <CardContent>
                {supplier.invoices && supplier.invoices.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">رقم الفاتورة</th>
                          <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">المبلغ</th>
                          <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">تاريخ الاستحقاق</th>
                          <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">الحالة</th>
                        </tr>
                      </thead>
                      <tbody>
                        {supplier.invoices.map((invoice: any) => (
                          <tr
                            key={invoice.id}
                            className="border-b hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                          >
                            <td className="py-3 px-4">
                              <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                {invoice.invoiceNumber || invoice.id}
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                {formatCurrency(invoice.amount || 0)}
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <div className="text-sm text-gray-600 dark:text-gray-400">
                                {invoice.dueDate ? formatDate(invoice.dueDate) : '-'}
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <span
                                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                  invoice.status
                                )}`}
                              >
                                {getStatusIcon(invoice.status)}
                                {getStatusText(invoice.status)}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">لا توجد فواتير لهذا المورد</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'purchases' && (
          <Card>
            <CardHeader>
              <CardTitle>مشتريات المورد</CardTitle>
            </CardHeader>
            <CardContent>
              {supplier.purchases && supplier.purchases.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">رقم الشراء</th>
                        <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">المبلغ</th>
                        <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">تاريخ الشراء</th>
                        <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">الحالة</th>
                      </tr>
                    </thead>
                    <tbody>
                      {supplier.purchases.map((purchase: any) => (
                        <tr
                          key={purchase.id}
                          className="border-b hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                        >
                          <td className="py-3 px-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                              {purchase.purchaseNumber || purchase.id}
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                              {formatCurrency(purchase.totalAmount || 0)}
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              {purchase.purchaseDate ? formatDate(purchase.purchaseDate) : '-'}
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                purchase.status
                              )}`}
                            >
                              {getStatusIcon(purchase.status)}
                              {getStatusText(purchase.status)}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-muted-foreground">لا توجد مشتريات لهذا المورد</p>
              )}
            </CardContent>
          </Card>
        )}

        {activeTab === 'notes' && (
          <Card>
            <CardHeader>
              <CardTitle>ملاحظات المورد</CardTitle>
            </CardHeader>
            <CardContent>
              {supplier.notes ? (
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400">{supplier.notes}</p>
                </div>
              ) : (
                <p className="text-muted-foreground">لا توجد ملاحظات لهذا المورد</p>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}

