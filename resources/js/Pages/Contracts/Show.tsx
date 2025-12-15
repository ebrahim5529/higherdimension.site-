/** @jsxImportSource react */
import { Head, router, usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { showToast } from '@/hooks/use-toast';
import {
  FileText,
  ArrowLeft,
  Edit,
  Download,
  Calendar,
  User,
  DollarSign,
  Package,
  CheckCircle,
  AlertCircle,
  Clock,
} from 'lucide-react';

interface Contract {
  id: number;
  contractNumber: string;
  title: string;
  customerName: string;
  type: string;
  amount: number;
  totalPayments: number;
  remainingAmount: number;
  status: string;
  paymentStatus: string;
  startDate: string;
  endDate: string;
  createdDate: string;
  equipment: string;
  notes?: string | null;
}

interface ShowContractProps {
  contract: Contract;
}

export default function ShowContract({ contract }: ShowContractProps) {
  const { flash } = usePage().props as any;

  useEffect(() => {
    if (flash?.success) {
      showToast.success('نجح', flash.success);
    }
    if (flash?.error) {
      showToast.error('خطأ', flash.error);
    }
  }, [flash]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'نشط':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'منتهي':
        return <Clock className="h-5 w-5 text-gray-500" />;
      case 'ملغي':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'نشط':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'منتهي':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
      case 'ملغي':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'تأجير':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'بيع':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      default:
        return 'bg-gray-100 text-gray-800';
    }
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const calculateDuration = () => {
    const start = new Date(contract.startDate);
    const end = new Date(contract.endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <DashboardLayout>
      <Head title={`عقد ${contract.contractNumber}`} />
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => router.visit('/contracts')}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-3">
              <FileText className="h-6 w-6 text-[#58d2c8]" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  تفاصيل العقد
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  رقم العقد: {contract.contractNumber}
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => window.print()}>
              <Download className="h-4 w-4 ml-2" />
              طباعة
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.visit(`/contracts/${contract.id}/edit`)}
            >
              <Edit className="h-4 w-4 ml-2" />
              تعديل
            </Button>
          </div>
        </div>

        {/* Contract Status and Type */}
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            {getStatusIcon(contract.status)}
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(contract.status)}`}
            >
              {contract.status}
            </span>
          </div>
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(contract.type)}`}
          >
            {contract.type}
          </span>
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getPaymentStatusColor(contract.paymentStatus)}`}
          >
            {contract.paymentStatus}
          </span>
        </div>

        {/* Main Information Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Customer Information */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center">
                <User className="h-4 w-4 ml-2" />
                معلومات العميل
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">اسم العميل</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {contract.customerName}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">رقم العقد</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {contract.contractNumber}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Financial Information */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center">
                <DollarSign className="h-4 w-4 ml-2" />
                المعلومات المالية
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">المبلغ الإجمالي</p>
                  <p className="font-medium text-gray-900 dark:text-white text-lg">
                    {Number(contract.amount).toFixed(2)} ر.ع
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">المدفوع</p>
                  <p className="font-medium text-green-600 dark:text-green-400">
                    {Number(contract.totalPayments).toFixed(2)} ر.ع
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">المتبقي</p>
                  <p className="font-medium text-orange-600 dark:text-orange-400">
                    {Number(contract.remainingAmount).toFixed(2)} ر.ع
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">نوع العقد</p>
                  <p className="font-medium text-gray-900 dark:text-white">{contract.type}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Duration Information */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center">
                <Calendar className="h-4 w-4 ml-2" />
                مدة العقد
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">تاريخ البداية</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {formatDate(contract.startDate)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">تاريخ النهاية</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {formatDate(contract.endDate)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">المدة</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {calculateDuration()} يوم
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Equipment Information */}
        {contract.equipment && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center">
                <Package className="h-4 w-4 ml-2" />
                المعدات / الوصف
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-900 dark:text-white whitespace-pre-wrap">
                {contract.equipment}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Notes */}
        {contract.notes && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                ملاحظات
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-900 dark:text-white whitespace-pre-wrap">
                {contract.notes}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Contract Timeline */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              سجل العقد
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-[#58d2c8] rounded-full"></div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    تم إنشاء العقد
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {formatDate(contract.createdDate)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    تاريخ بداية العقد
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {formatDate(contract.startDate)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    تاريخ انتهاء العقد
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {formatDate(contract.endDate)}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

