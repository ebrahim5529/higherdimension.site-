/** @jsxImportSource react */
import { Head, router, usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { showToast } from '@/hooks/use-toast';
import {
  FileText,
  ArrowRight,
  Send,
  User,
  Calendar,
  DollarSign,
  MapPin,
  Package,
  Clock,
  CreditCard,
  Activity,
  GitBranch,
  Paperclip,
  Eye,
  Download,
  TrendingUp,
} from 'lucide-react';

interface Contract {
  id: number;
  contractNumber: string;
  title: string;
  customerName: string;
  customerNumber: string;
  type: string;
  amount: number;
  totalPayments: number;
  remainingAmount: number;
  status: string;
  paymentStatus: string;
  paymentPercentage: number;
  startDate: string;
  endDate: string;
  startDateAr: string;
  endDateAr: string;
  createdDate: string;
  createdDateAr: string;
  updatedDate: string;
  updatedDateAr: string;
  duration: number;
  deliveryAddress: string;
  locationMapLink?: string;
  equipmentCount: number;
  daysRemaining: number;
  daysElapsed: number;
  progressPercentage: number;
  dailyValue: number;
  stages: {
    signed: boolean;
    delivered: boolean;
    inactive: boolean;
    completed: boolean;
  };
  signedAt?: string;
  contractNotes?: string;
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ar-OM', {
      minimumFractionDigits: 3,
      maximumFractionDigits: 3,
    }).format(amount);
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'نشط':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'منتهي':
        return 'bg-gray-100 text-gray-800 border-gray-300';
      case 'ملغي':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getPaymentStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'مدفوع':
        return 'bg-green-100 text-green-800';
      case 'غير مدفوع':
        return 'bg-red-100 text-red-800';
      case 'مدفوع جزئياً':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <DashboardLayout>
      <Head title={`عقد ${contract.contractNumber}`} />
      <main className="flex-1 p-3 sm:p-4 lg:p-6 xl:p-8 overflow-x-auto">
        <div className="max-w-full">
          <div className="min-h-screen bg-gray-50 pb-12">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => router.visit('/contracts')}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <ArrowRight className="h-6 w-6 text-gray-600" />
                    </Button>
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-[#58d2c8]/10 rounded-lg">
                        <FileText className="h-7 w-7 text-[#58d2c8]" />
                      </div>
                      <div>
                        <h1 className="text-3xl font-bold text-gray-900">تفاصيل العقد</h1>
                        <p className="text-sm text-gray-600 mt-1">{contract.contractNumber}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button
                      className="px-6 py-3 bg-[#58d2c8] hover:bg-[#4AB8B3] text-white font-medium rounded-lg transition-colors flex items-center gap-2"
                    >
                      <Send className="h-4 w-4" />
                      إرسال سند استلام
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="space-y-6">
                {/* معلومات العميل ومعلومات العقد */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* معلومات العميل */}
                  <div className="bg-white border-2 border-blue-200 rounded-lg p-6 shadow-sm">
                    <div className="flex items-center gap-2 mb-4">
                      <User className="h-6 w-6 text-blue-600" />
                      <h3 className="text-lg font-bold text-gray-900">معلومات العميل</h3>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-600">اسم العميل</p>
                        <p className="text-lg font-semibold text-gray-900">{contract.customerName}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">رقم العميل</p>
                        <p className="text-lg font-semibold text-gray-900">{contract.customerNumber}</p>
                      </div>
                    </div>
                  </div>

                  {/* معلومات العقد */}
                  <div className="bg-white border-2 border-purple-200 rounded-lg p-6 shadow-sm">
                    <div className="flex items-center gap-2 mb-4">
                      <FileText className="h-6 w-6 text-purple-600" />
                      <h3 className="text-lg font-bold text-gray-900">معلومات العقد</h3>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-600">رقم العقد</p>
                        <p className="text-lg font-semibold text-gray-900">{contract.contractNumber}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">نوع العقد</p>
                        <p className="text-lg font-semibold text-gray-900">{contract.type}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">الحالة</p>
                        <span
                          className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium border-2 ${getStatusBadgeClass(contract.status)}`}
                        >
                          {contract.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* التواريخ والمدة */}
                <div className="bg-white border-2 border-green-200 rounded-lg p-6 shadow-sm">
                  <div className="flex items-center gap-2 mb-4">
                    <Calendar className="h-6 w-6 text-green-600" />
                    <h3 className="text-lg font-bold text-gray-900">التواريخ والمدة</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <p className="text-sm text-gray-600">تاريخ البدء</p>
                      <p className="text-lg font-semibold text-gray-900">{contract.startDateAr || contract.startDate}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">تاريخ الانتهاء</p>
                      <p className="text-lg font-semibold text-gray-900">{contract.endDateAr || contract.endDate}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">مدة العقد</p>
                      <p className="text-lg font-semibold text-gray-900">{contract.duration} يوم</p>
                    </div>
                  </div>
                </div>

                {/* المعلومات المالية */}
                <div className="bg-white border-2 border-yellow-200 rounded-lg p-6 shadow-sm">
                  <div className="flex items-center gap-2 mb-4">
                    <DollarSign className="h-6 w-6 text-yellow-600" />
                    <h3 className="text-lg font-bold text-gray-900">المعلومات المالية</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <p className="text-sm text-gray-600">إجمالي العقد</p>
                      <p className="text-2xl font-bold text-[#58d2c8]">
                        {formatCurrency(contract.amount)} ر.ع.
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">المبلغ المدفوع</p>
                      <p className="text-2xl font-bold text-green-600">
                        {formatCurrency(contract.totalPayments)} ر.ع.
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">المبلغ المتبقي</p>
                      <p className="text-2xl font-bold text-orange-600">
                        {formatCurrency(contract.remainingAmount)} ر.ع.
                      </p>
                    </div>
                  </div>
                </div>

                {/* الموقع والمعدات */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white border-2 border-gray-200 rounded-lg p-6 shadow-sm">
                    <div className="flex items-center gap-2 mb-4">
                      <MapPin className="h-6 w-6 text-gray-600" />
                      <h3 className="text-lg font-bold text-gray-900">الموقع</h3>
                    </div>
                    <p className="text-lg text-gray-900">{contract.deliveryAddress || 'غير محدد'}</p>
                  </div>
                  <div className="bg-white border-2 border-gray-200 rounded-lg p-6 shadow-sm">
                    <div className="flex items-center gap-2 mb-4">
                      <Package className="h-6 w-6 text-gray-600" />
                      <h3 className="text-lg font-bold text-gray-900">المعدات</h3>
                    </div>
                    <p className="text-gray-900">
                      <span className="text-3xl font-semibold text-[#58d2c8]">{contract.equipmentCount}</span>{' '}
                      <span className="text-lg text-gray-600">قطعة</span>
                    </p>
                  </div>
                </div>

                {/* معلومات النظام */}
                <div className="bg-white border-2 border-gray-200 rounded-lg p-6 shadow-sm">
                  <div className="flex items-center gap-2 mb-4">
                    <Clock className="h-6 w-6 text-gray-600" />
                    <h3 className="text-lg font-bold text-gray-900">معلومات النظام</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm text-gray-600">تاريخ الإنشاء</p>
                      <p className="text-lg font-semibold text-gray-900">{contract.createdDateAr || contract.createdDate}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">آخر تحديث</p>
                      <p className="text-lg font-semibold text-gray-900">{contract.updatedDateAr || contract.updatedDate}</p>
                    </div>
                  </div>
                </div>

                {/* تفاصيل حالة الدفع */}
                <div className="bg-white border-2 border-indigo-200 rounded-lg p-6 shadow-sm">
                  <div className="flex items-center gap-2 mb-4">
                    <CreditCard className="h-6 w-6 text-indigo-600" />
                    <h3 className="text-lg font-bold text-gray-900">تفاصيل حالة الدفع</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm text-gray-600">حالة الدفع</p>
                      <span
                        className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${getPaymentStatusBadgeClass(contract.paymentStatus)}`}
                      >
                        {contract.paymentStatus}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-2">نسبة الدفع</p>
                      <div className="flex items-center gap-3">
                        <div className="flex-1 bg-gray-200 rounded-full h-3">
                          <div
                            className="bg-green-500 h-3 rounded-full transition-all duration-300"
                            style={{ width: `${contract.paymentPercentage}%` }}
                          ></div>
                        </div>
                        <span className="font-semibold text-lg">{contract.paymentPercentage}%</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* معلومات إضافية */}
                <div className="bg-white border-2 border-teal-200 rounded-lg p-6 shadow-sm">
                  <div className="flex items-center gap-2 mb-4">
                    <Activity className="h-6 w-6 text-teal-600" />
                    <h3 className="text-lg font-bold text-gray-900">معلومات إضافية</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div>
                      <p className="text-sm text-gray-600">عدد الأيام المتبقية</p>
                      <p className="text-2xl font-semibold text-gray-900">{contract.daysRemaining} يوم</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">عدد الأيام المنقضية</p>
                      <p className="text-2xl font-semibold text-gray-900">{contract.daysElapsed} يوم</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">القيمة اليومية</p>
                      <p className="text-xl font-semibold text-gray-900">
                        {formatCurrency(contract.dailyValue)} ر.ع.
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">حالة التقدم</p>
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-teal-600" />
                        <span className="text-2xl font-semibold">{contract.progressPercentage}%</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* مراحل العقد */}
                <div className="bg-white border-2 border-purple-200 rounded-lg p-6 shadow-sm">
                  <div className="flex items-center gap-2 mb-6">
                    <GitBranch className="h-6 w-6 text-purple-600" />
                    <h3 className="text-lg font-bold text-gray-900">مراحل العقد</h3>
                  </div>
                  <div className="flex items-center justify-center mb-6">
                    <div className="flex items-center gap-1 w-full justify-center flex-wrap">
                      {/* توقيع العقد */}
                      <div className="flex items-center">
                        <div className="flex flex-col items-center">
                          <div
                            className={`relative w-16 h-16 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                              contract.stages.signed
                                ? 'bg-gradient-to-r from-green-400 to-green-500 border-green-500 shadow-lg shadow-green-200'
                                : 'bg-gray-100 border-gray-300'
                            }`}
                          >
                            {contract.stages.signed ? (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="lucide lucide-check-circle w-8 h-8 text-white"
                              >
                                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                <path d="m9 11 3 3L22 4"></path>
                              </svg>
                            ) : (
                              <div className="w-4 h-4 bg-gray-400 rounded-full"></div>
                            )}
                          </div>
                          <span
                            className={`text-sm mt-3 text-center font-medium transition-colors duration-200 max-w-[100px] leading-tight ${
                              contract.stages.signed ? 'text-green-600' : 'text-gray-500'
                            }`}
                          >
                            توقيع العقد
                          </span>
                        </div>
                        <div
                          className={`h-2 w-16 mx-3 rounded-full transition-all duration-500 ${
                            contract.stages.signed ? 'bg-green-400' : 'bg-gray-200'
                          }`}
                        ></div>
                      </div>

                      {/* التسليم */}
                      <div className="flex items-center">
                        <div className="flex flex-col items-center">
                          <div
                            className={`relative w-16 h-16 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                              contract.stages.delivered
                                ? 'bg-gradient-to-r from-green-400 to-green-500 border-green-500 shadow-lg shadow-green-200'
                                : 'bg-gray-100 border-gray-300'
                            }`}
                          >
                            {contract.stages.delivered ? (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="lucide lucide-check-circle w-8 h-8 text-white"
                              >
                                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                <path d="m9 11 3 3L22 4"></path>
                              </svg>
                            ) : (
                              <div className="w-4 h-4 bg-gray-400 rounded-full"></div>
                            )}
                          </div>
                          <span
                            className={`text-sm mt-3 text-center font-medium transition-colors duration-200 max-w-[100px] leading-tight ${
                              contract.stages.delivered ? 'text-green-600' : 'text-gray-500'
                            }`}
                          >
                            التسليم
                          </span>
                        </div>
                        <div
                          className={`h-2 w-16 mx-3 rounded-full transition-all duration-500 ${
                            contract.stages.delivered ? 'bg-green-400' : 'bg-gray-200'
                          }`}
                        ></div>
                      </div>

                      {/* غير نشط */}
                      <div className="flex items-center">
                        <div className="flex flex-col items-center">
                          <div
                            className={`relative w-16 h-16 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                              contract.stages.inactive
                                ? 'bg-gradient-to-r from-red-400 to-red-500 border-red-500 shadow-lg shadow-red-200'
                                : 'bg-gray-100 border-gray-300'
                            }`}
                          >
                            {contract.stages.inactive ? (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="lucide lucide-x-circle w-8 h-8 text-white"
                              >
                                <circle cx="12" cy="12" r="10"></circle>
                                <path d="m15 9-6 6"></path>
                                <path d="m9 9 6 6"></path>
                              </svg>
                            ) : (
                              <div className="w-4 h-4 bg-gray-400 rounded-full"></div>
                            )}
                          </div>
                          <span
                            className={`text-sm mt-3 text-center font-medium transition-colors duration-200 max-w-[100px] leading-tight ${
                              contract.stages.inactive ? 'text-red-600' : 'text-gray-500'
                            }`}
                          >
                            غير نشط
                          </span>
                        </div>
                        <div
                          className={`h-2 w-16 mx-3 rounded-full transition-all duration-500 ${
                            contract.stages.completed ? 'bg-green-400' : 'bg-gray-200'
                          }`}
                        ></div>
                      </div>

                      {/* انتهاء العقد */}
                      <div className="flex items-center">
                        <div className="flex flex-col items-center">
                          <div
                            className={`relative w-16 h-16 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                              contract.stages.completed
                                ? 'bg-gradient-to-r from-green-400 to-green-500 border-green-500 shadow-lg shadow-green-200'
                                : 'bg-gray-100 border-gray-300'
                            }`}
                          >
                            {contract.stages.completed ? (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="lucide lucide-check-circle w-8 h-8 text-white"
                              >
                                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                <path d="m9 11 3 3L22 4"></path>
                              </svg>
                            ) : (
                              <div className="w-4 h-4 bg-gray-400 rounded-full"></div>
                            )}
                          </div>
                          <span
                            className={`text-sm mt-3 text-center font-medium transition-colors duration-200 max-w-[100px] leading-tight ${
                              contract.stages.completed ? 'text-green-600' : 'text-gray-500'
                            }`}
                          >
                            انتهاء العقد
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <p className="text-base text-gray-700">
                      <span className="font-semibold">الحالة الحالية:</span> {contract.status}
                    </p>
                  </div>
                </div>

                {/* المرفقات والمستندات */}
                <div className="bg-white border-2 border-orange-200 rounded-lg p-6 shadow-sm">
                  <div className="flex items-center gap-2 mb-4">
                    <Paperclip className="h-6 w-6 text-orange-600" />
                    <h3 className="text-lg font-bold text-gray-900">المرفقات والمستندات</h3>
                  </div>
                  <div className="space-y-3">
                    {/* عقد الإيجار الموقع */}
                    <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg border border-orange-200 hover:border-orange-300 transition-colors">
                      <div className="flex items-center gap-3">
                        <FileText className="h-6 w-6 text-orange-600" />
                        <div>
                          <p className="font-medium text-gray-900">عقد الإيجار الموقع</p>
                          <p className="text-sm text-gray-500">PDF • 2.2 MB</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" className="p-2 hover:bg-orange-100">
                          <Eye className="h-5 w-5 text-orange-600" />
                        </Button>
                        <Button variant="ghost" size="icon" className="p-2 hover:bg-orange-100">
                          <Download className="h-5 w-5 text-orange-600" />
                        </Button>
                      </div>
                    </div>

                    {/* صور المعدات */}
                    <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg border border-orange-200 hover:border-orange-300 transition-colors">
                      <div className="flex items-center gap-3">
                        <FileText className="h-6 w-6 text-orange-600" />
                        <div>
                          <p className="font-medium text-gray-900">صور المعدات</p>
                          <p className="text-sm text-gray-500">ZIP • 6.9 MB</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" className="p-2 hover:bg-orange-100">
                          <Eye className="h-5 w-5 text-orange-600" />
                        </Button>
                        <Button variant="ghost" size="icon" className="p-2 hover:bg-orange-100">
                          <Download className="h-5 w-5 text-orange-600" />
                        </Button>
                      </div>
                    </div>

                    {/* هوية العميل */}
                    <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg border border-orange-200 hover:border-orange-300 transition-colors">
                      <div className="flex items-center gap-3">
                        <FileText className="h-6 w-6 text-orange-600" />
                        <div>
                          <p className="font-medium text-gray-900">هوية العميل</p>
                          <p className="text-sm text-gray-500">PDF • 0.9 MB</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" className="p-2 hover:bg-orange-100">
                          <Eye className="h-5 w-5 text-orange-600" />
                        </Button>
                        <Button variant="ghost" size="icon" className="p-2 hover:bg-orange-100">
                          <Download className="h-5 w-5 text-orange-600" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </DashboardLayout>
  );
}
