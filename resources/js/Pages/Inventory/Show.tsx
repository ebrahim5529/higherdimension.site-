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
  MapPin,
  Calendar,
  DollarSign,
  FileText,
  Ruler,
  Wrench,
} from 'lucide-react';

interface Scaffold {
  id: number;
  scaffoldNumber: string;
  type: string;
  size: { height: number; width: number; length: number };
  material: string;
  condition: string;
  status: string;
  quantity: number;
  availableQuantity: number;
  location: string;
  warehouseLocation: string;
  sellingPrice: number;
  dailyRentalPrice: number;
  monthlyRentalPrice: number;
  entryDate: string;
  lastMaintenanceDate?: string;
  nextMaintenanceDate?: string;
  descriptionAr: string;
  descriptionEn: string;
  notes?: string;
  supplier?: {
    id: number;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface ShowScaffoldProps {
  scaffold: Scaffold;
}

export default function ShowScaffold({ scaffold }: ShowScaffoldProps) {
  const getTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      FIXED: 'مثبتة',
      MOBILE: 'متحركة',
      TOWER: 'برجية',
      CANTILEVER: 'كابولية',
      SUSPENDED: 'معلقة',
    };
    return types[type] || type;
  };

  const getMaterialLabel = (material: string) => {
    const materials: Record<string, string> = {
      STEEL: 'حديد',
      ALUMINUM: 'ألومنيوم',
      WOOD: 'خشب',
      COMPOSITE: 'مركب',
    };
    return materials[material] || material;
  };

  const getConditionLabel = (condition: string) => {
    const conditions: Record<string, string> = {
      NEW: 'جديد',
      USED: 'مستعمل',
      REFURBISHED: 'معاد تأهيله',
    };
    return conditions[condition] || condition;
  };

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

  const formatDate = (date: string) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <DashboardLayout>
      <Head title={`تفاصيل المعدة: ${scaffold.scaffoldNumber}`} />
      <div className="space-y-6">
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
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">النوع</label>
                <p className="text-sm text-gray-900 dark:text-white">{getTypeLabel(scaffold.type)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">المادة</label>
                <p className="text-sm text-gray-900 dark:text-white">{getMaterialLabel(scaffold.material)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">الحالة</label>
                <p className="text-sm text-gray-900 dark:text-white">{getConditionLabel(scaffold.condition)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* الأبعاد */}
        {scaffold.size && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Ruler className="h-5 w-5" />
                الأبعاد
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">الارتفاع</label>
                  <p className="text-sm text-gray-900 dark:text-white">{scaffold.size.height} متر</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">العرض</label>
                  <p className="text-sm text-gray-900 dark:text-white">{scaffold.size.width} متر</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">الطول</label>
                  <p className="text-sm text-gray-900 dark:text-white">{scaffold.size.length} متر</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* الوصف */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              الوصف
            </CardTitle>
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">سعر البيع</label>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {scaffold.sellingPrice.toLocaleString()} ر.ع
                </p>
              </div>
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

        {/* الموقع */}
        {(scaffold.location || scaffold.warehouseLocation) && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                الموقع
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {scaffold.location && (
                  <div>
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-400">الموقع</label>
                    <p className="text-sm text-gray-900 dark:text-white">{scaffold.location}</p>
                  </div>
                )}
                {scaffold.warehouseLocation && (
                  <div>
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-400">موقع المخزن</label>
                    <p className="text-sm text-gray-900 dark:text-white">{scaffold.warehouseLocation}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* التواريخ */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              التواريخ
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">تاريخ الدخول</label>
                <p className="text-sm text-gray-900 dark:text-white flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {formatDate(scaffold.entryDate)}
                </p>
              </div>
              {scaffold.lastMaintenanceDate && (
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">تاريخ آخر صيانة</label>
                  <p className="text-sm text-gray-900 dark:text-white flex items-center gap-1">
                    <Wrench className="h-3 w-3" />
                    {formatDate(scaffold.lastMaintenanceDate)}
                  </p>
                </div>
              )}
              {scaffold.nextMaintenanceDate && (
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">تاريخ الصيانة القادمة</label>
                  <p className="text-sm text-gray-900 dark:text-white flex items-center gap-1">
                    <Wrench className="h-3 w-3" />
                    {formatDate(scaffold.nextMaintenanceDate)}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* المورد */}
        {scaffold.supplier && (
          <Card>
            <CardHeader>
              <CardTitle>المورد</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-900 dark:text-white">{scaffold.supplier.name}</p>
            </CardContent>
          </Card>
        )}

        {/* الملاحظات */}
        {scaffold.notes && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                الملاحظات
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-900 dark:text-white whitespace-pre-wrap">{scaffold.notes}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}

