/** @jsxImportSource react */
import { Head, router } from '@inertiajs/react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Package,
  ArrowRight,
  Printer,
  Download,
  Edit,
  DollarSign,
} from 'lucide-react';

interface Scaffold {
  id: number;
  scaffoldNumber: string;
  quantity: number;
  availableQuantity: number;
  descriptionAr: string;
  descriptionEn: string;
  dailyRentalPrice: number;
  monthlyRentalPrice: number;
  status: string;
}

interface ShowScaffoldProps {
  scaffold: Scaffold;
}

export default function ShowScaffold({ scaffold }: ShowScaffoldProps) {
  const getStatusLabel = (status: string) => {
    const statuses: Record<string, string> = {
      AVAILABLE: 'متوفرة',
      RENTED: 'مستأجرة',
      SOLD: 'مباعة',
      MAINTENANCE: 'تحت الصيانة',
      RESERVED: 'محجوزة',
    };
    return statuses[status] || status;
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      AVAILABLE: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      RENTED: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      SOLD: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      MAINTENANCE: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      RESERVED: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
    };
    return colors[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
  };

  return (
    <DashboardLayout>
      <Head title={`تفاصيل المعدة: ${scaffold.scaffoldNumber}`} />
      <div className="space-y-6 mt-2 -mx-1 sm:-mx-2 lg:-mx-3 xl:-mx-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => router.visit('/inventory')}>
              <ArrowRight className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Package className="h-6 w-6" />
                تفاصيل المعدة: {scaffold.scaffoldNumber}
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => window.print()}
              className="flex items-center gap-2"
            >
              <Printer className="h-4 w-4" />
              طباعة
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                // TODO: Implement export
                console.log('Export scaffold');
              }}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              تصدير
            </Button>
            <Button
              onClick={() => router.visit(`/inventory/${scaffold.id}/edit`)}
              className="flex items-center gap-2"
            >
              <Edit className="h-4 w-4" />
              تعديل
            </Button>
          </div>
        </div>

        {/* المعلومات الأساسية */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              المعلومات الأساسية
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">كود الصنف</label>
                <p className="text-sm font-mono text-gray-900 dark:text-white">{scaffold.scaffoldNumber}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">الكمية</label>
                <p className="text-sm text-gray-900 dark:text-white">
                  {scaffold.quantity} (متاح: {scaffold.availableQuantity})
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">الحالة</label>
                <p>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(scaffold.status)}`}>
                    {getStatusLabel(scaffold.status)}
                  </span>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* الوصف */}
        <Card>
          <CardHeader>
            <CardTitle>الوصف</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">الوصف العربي</label>
                <p className="text-sm text-gray-900 dark:text-white">{scaffold.descriptionAr || '-'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">الوصف الإنجليزي</label>
                <p className="text-sm text-gray-900 dark:text-white">{scaffold.descriptionEn || '-'}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* الأسعار */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              الأسعار
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">الإيجار اليومي</label>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {scaffold.dailyRentalPrice.toLocaleString()} ر.ع
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">الإيجار الشهري</label>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {scaffold.monthlyRentalPrice.toLocaleString()} ر.ع
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
