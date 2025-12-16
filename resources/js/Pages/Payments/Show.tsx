/** @jsxImportSource react */
import { Head, router, usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { showToast } from '@/hooks/use-toast';
import {
  ArrowLeft,
  FileText,
  User,
  Calendar,
  DollarSign,
  CreditCard,
  Building2,
  CheckCircle,
  Image as ImageIcon,
  Download,
  Eye,
} from 'lucide-react';

interface Payment {
  id: number;
  contractId: number;
  contractNumber: string;
  contractTitle: string;
  customerName: string;
  customerPhone?: string;
  customerAddress?: string;
  paymentMethod: string;
  paymentMethodValue: string;
  paymentDate: string;
  paymentDateAr: string;
  amount: number;
  checkNumber?: string;
  bankName?: string;
  checkDate?: string;
  checkImagePath?: string;
  notes?: string;
  createdAt: string;
  createdAtAr: string;
}

interface Contract {
  id: number;
  contractNumber: string;
  title: string;
  amount: number;
  paidAmount: number;
  remainingAmount: number;
  startDate: string;
  endDate: string;
}

interface PaymentShowProps {
  payment: Payment;
  contract: Contract;
}

export default function PaymentShow({ payment, contract }: PaymentShowProps) {
  const { flash } = usePage().props as any;

  useEffect(() => {
    if (flash?.success) {
      showToast.success('نجح', flash.success);
    }
    if (flash?.error) {
      showToast.error('خطأ', flash.error);
    }
  }, [flash]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'OMR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <DashboardLayout>
      <Head title={`تفاصيل الدفعة #${payment.id}`} />
      <div className="space-y-6 pb-8 mt-2 -mx-1 sm:-mx-2 lg:-mx-3 xl:-mx-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.visit('/payments')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              العودة
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                تفاصيل الدفعة
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                رقم الدفعة: #{payment.id}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* معلومات الدفعة */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-[#58d2c8]" />
                  معلومات الدفعة
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                      رقم الدفعة
                    </label>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      #{payment.id}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                      المبلغ
                    </label>
                    <p className="text-lg font-semibold text-green-600 dark:text-green-400">
                      {formatCurrency(payment.amount)}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                      طريقة الدفع
                    </label>
                    <p className="text-base font-medium text-gray-900 dark:text-white">
                      {payment.paymentMethod}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                      تاريخ الدفع
                    </label>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <p className="text-base text-gray-900 dark:text-white">
                        {payment.paymentDate}
                      </p>
                    </div>
                  </div>
                  {payment.checkNumber && (
                    <div>
                      <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                        رقم الشيك
                      </label>
                      <p className="text-base text-gray-900 dark:text-white">
                        {payment.checkNumber}
                      </p>
                    </div>
                  )}
                  {payment.bankName && (
                    <div>
                      <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                        البنك
                      </label>
                      <p className="text-base text-gray-900 dark:text-white">
                        {payment.bankName}
                      </p>
                    </div>
                  )}
                  {payment.checkDate && (
                    <div>
                      <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                        تاريخ الشيك
                      </label>
                      <p className="text-base text-gray-900 dark:text-white">
                        {payment.checkDate}
                      </p>
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                      تاريخ الإنشاء
                    </label>
                    <p className="text-base text-gray-900 dark:text-white">
                      {payment.createdAt}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* صورة الشيك */}
            {payment.checkImagePath && (
              <Card className="p-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ImageIcon className="h-5 w-5 text-[#58d2c8]" />
                    صورة الشيك
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative">
                    <img
                      src={payment.checkImagePath}
                      alt="صورة الشيك"
                      className="max-w-full h-auto rounded-lg border border-gray-200 dark:border-gray-700"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => window.open(payment.checkImagePath, '_blank')}
                      className="absolute top-2 left-2 bg-white/90 hover:bg-white"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      تحميل
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* الملاحظات */}
            {payment.notes && (
              <Card className="p-6">
                <CardHeader>
                  <CardTitle>ملاحظات</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-base text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                    {payment.notes}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* معلومات العقد والعميل */}
          <div className="space-y-6">
            {/* معلومات العقد */}
            <Card className="p-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-[#58d2c8]" />
                  معلومات العقد
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                    رقم العقد
                  </label>
                  <p className="text-base font-medium text-gray-900 dark:text-white">
                    {contract.contractNumber}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                    عنوان العقد
                  </label>
                  <p className="text-base text-gray-900 dark:text-white">
                    {contract.title}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                    المبلغ الإجمالي
                  </label>
                  <p className="text-base font-semibold text-gray-900 dark:text-white">
                    {formatCurrency(contract.amount)}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                    المبلغ المدفوع
                  </label>
                  <p className="text-base font-semibold text-green-600 dark:text-green-400">
                    {formatCurrency(contract.paidAmount)}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                    المبلغ المتبقي
                  </label>
                  <p className="text-base font-semibold text-orange-600 dark:text-orange-400">
                    {formatCurrency(contract.remainingAmount)}
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => router.visit(`/contracts/${contract.id}`)}
                  className="w-full"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  عرض العقد
                </Button>
              </CardContent>
            </Card>

            {/* معلومات العميل */}
            <Card className="p-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-[#58d2c8]" />
                  معلومات العميل
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                    اسم العميل
                  </label>
                  <p className="text-base font-medium text-gray-900 dark:text-white">
                    {payment.customerName}
                  </p>
                </div>
                {payment.customerPhone && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                      رقم الهاتف
                    </label>
                    <p className="text-base text-gray-900 dark:text-white">
                      {payment.customerPhone}
                    </p>
                  </div>
                )}
                {payment.customerAddress && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                      العنوان
                    </label>
                    <p className="text-base text-gray-900 dark:text-white">
                      {payment.customerAddress}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

