/** @jsxImportSource react */
import { Head, Link, router } from '@inertiajs/react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Package,
  ArrowRight,
  Printer,
  Download,
  Edit,
  DollarSign,
  FileText,
} from 'lucide-react';

interface ContractUsageRow {
  contractId: number;
  contractNumber: string;
  contractTitle: string;
  customerName: string | null;
  quantityUsed: number;
}

interface Scaffold {
  id: number;
  scaffoldNumber: string;
  quantity: number;
  availableQuantity: number;
  usedQuantityDifference: number;
  usedQuantityFromContracts: number;
  contractUsages: ContractUsageRow[];
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
  const contractUsages = scaffold.contractUsages ?? [];
  const usedDiff = scaffold.usedQuantityDifference ?? Math.max(0, scaffold.quantity - scaffold.availableQuantity);
  const usedFromContracts = scaffold.usedQuantityFromContracts ?? contractUsages.reduce((s, r) => s + r.quantityUsed, 0);
  const hasContractUsageData = contractUsages.length > 0;
  const usageMismatch = hasContractUsageData && usedDiff !== usedFromContracts;
  const usedButNoContractLines = usedDiff > 0 && !hasContractUsageData;

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
              <div className="md:col-span-2 lg:col-span-3">
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">الكمية</label>
                <div className="mt-1 space-y-1 text-sm text-gray-900 dark:text-white">
                  <p>
                    <span className="text-gray-600 dark:text-gray-400">الإجمالي:</span>{' '}
                    <span className="font-medium tabular-nums">{scaffold.quantity.toLocaleString('en-US')}</span>
                  </p>
                  <p>
                    <span className="text-gray-600 dark:text-gray-400">المتاح:</span>{' '}
                    <span className="font-medium tabular-nums text-green-700 dark:text-green-400">
                      {scaffold.availableQuantity.toLocaleString('en-US')}
                    </span>
                  </p>
                  <p>
                    <span className="text-gray-600 dark:text-gray-400">المستخدم (فرق الكمية):</span>{' '}
                    <span className="font-medium tabular-nums text-amber-700 dark:text-amber-300">
                      {usedDiff.toLocaleString('en-US')}
                    </span>
                    <span className="text-gray-500 dark:text-gray-400 text-xs mr-2">
                      (الإجمالي − المتاح)
                    </span>
                  </p>
                  {contractUsages.length > 0 && (
                    <p>
                      <span className="text-gray-600 dark:text-gray-400">مجموع المسجل في العقود:</span>{' '}
                      <span className="font-medium tabular-nums">{usedFromContracts.toLocaleString('en-US')}</span>
                    </p>
                  )}
                  {usageMismatch && (
                    <p className="text-xs text-amber-700 dark:text-amber-300 pt-1">
                      ملاحظة: مجموع الكميات في جدول العقود لا يساوي فرق الكمية أعلاه؛ قد يكون هناك تعديل يدوي أو بيانات قديمة.
                    </p>
                  )}
                  {usedButNoContractLines && (
                    <p className="text-xs text-amber-700 dark:text-amber-300 pt-1">
                      يوجد فرق كمية لكن لا توجد بنود عقد مرتبطة بهذه المعدة في النظام (قد تكون المعدة أُضيفت للعقد قبل ربط السجل أو حُدّثت الكميات يدوياً).
                    </p>
                  )}
                </div>
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

        {/* استخدام الكمية في العقود */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              الكمية المستخدمة في العقود
            </CardTitle>
          </CardHeader>
          <CardContent>
            {contractUsages.length === 0 ? (
              <p className="text-sm text-gray-600 dark:text-gray-400">
                لا توجد بنود عقد مرتبطة بهذه المعدة حالياً.
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right">اسم العقد</TableHead>
                    <TableHead className="text-right">العميل</TableHead>
                    <TableHead className="text-right">رقم العقد</TableHead>
                    <TableHead className="text-right w-[120px]">الكمية المستخدمة</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {contractUsages.map((row) => (
                    <TableRow key={row.contractId}>
                      <TableCell className="text-right font-medium">{row.contractTitle}</TableCell>
                      <TableCell className="text-right text-gray-700 dark:text-gray-300">
                        {row.customerName ?? '—'}
                      </TableCell>
                      <TableCell className="text-right">
                        <Link
                          href={`/contracts/${row.contractId}`}
                          className="text-[#58d2c8] hover:underline font-mono"
                        >
                          {row.contractNumber}
                        </Link>
                      </TableCell>
                      <TableCell className="text-right tabular-nums font-medium">
                        {row.quantityUsed.toLocaleString('en-US')}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
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
