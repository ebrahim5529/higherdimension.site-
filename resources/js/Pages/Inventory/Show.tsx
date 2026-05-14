/** @jsxImportSource react */
import { Head, Link, router } from '@inertiajs/react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Package,
  ArrowRight,
  Printer,
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
  const num = (v: unknown) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
  };

  const contractUsages = scaffold.contractUsages ?? [];
  const qtyTotal = num(scaffold.quantity);
  const qtyAvail = num(scaffold.availableQuantity);
  const qtyUsed =
    scaffold.usedQuantityDifference != null
      ? num(scaffold.usedQuantityDifference)
      : Math.max(0, qtyTotal - qtyAvail);
  const usedFromContracts =
    scaffold.usedQuantityFromContracts != null
      ? num(scaffold.usedQuantityFromContracts)
      : contractUsages.reduce((s, r) => s + num(r.quantityUsed), 0);

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'OMR',
    }).format(amount);

  /** بدون فواصل آلاف لتفادي قراءة 21,320 كـ «21 و320» */
  const formatQty = (n: number) =>
    new Intl.NumberFormat('en-US', { useGrouping: false, maximumFractionDigits: 0 }).format(n);

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
      <style>{`
        @media print {
          @page {
            size: A4;
            margin: 14mm 12mm;
          }

          html, body {
            margin: 0 !important;
            padding: 0 !important;
            width: 100% !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
            font-size: 11px;
          }

          header,
          aside,
          .fixed.inset-y-0.right-0.z-50,
          .fixed.inset-0.z-40 {
            display: none !important;
          }

          main {
            padding: 0 !important;
            margin: 0 !important;
            overflow: visible !important;
            max-width: 100% !important;
          }

          main > div.max-w-full {
            margin: 0 !important;
            padding: 0 !important;
            max-width: 100% !important;
          }

          .print-layout-root {
            margin: 0 !important;
            padding: 0 !important;
            max-width: 100% !important;
            box-sizing: border-box !important;
          }

          .no-print {
            display: none !important;
          }

          .print-only {
            display: block !important;
          }

          .inventory-screen {
            display: none !important;
          }

          .print-report {
            display: block !important;
          }

          .print-container {
            margin: 0 !important;
            padding: 0 !important;
            max-width: 100% !important;
            box-sizing: border-box !important;
          }

          .print-container .shadow,
          .print-container .shadow-sm,
          .print-container .shadow-md,
          .print-container .shadow-lg {
            box-shadow: none !important;
          }

          .print-break {
            page-break-inside: avoid;
          }

          .print-table {
            width: 100%;
            border-collapse: collapse;
          }

          .print-table td,
          .print-table th {
            border: 1px solid #000;
            padding: 4px;
            vertical-align: top;
          }
        }

        @media screen {
          .print-only {
            display: none;
          }

          .print-report {
            display: none;
          }
        }
      `}</style>
      <div className="print-layout-root space-y-6 mt-2 -mx-1 sm:-mx-2 lg:-mx-3 xl:-mx-4 print:mx-0 print:mt-0">
        <div className="print-report print-container">
          <div className="border border-black rounded-md p-3 mb-3">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-lg font-bold text-black">تقرير بيانات المعدة</div>
                <div className="text-sm text-black">كود الصنف: {scaffold.scaffoldNumber}</div>
                <div className="text-xs text-black">
                  {scaffold.descriptionAr ? scaffold.descriptionAr : '—'}
                </div>
              </div>
              <div className="text-xs text-black">تاريخ الطباعة: {new Date().toLocaleDateString('ar-SA')}</div>
            </div>
          </div>

          <table className="print-table">
            <tbody>
              <tr>
                <th className="w-1/4">كود الصنف</th>
                <td className="w-1/4">{scaffold.scaffoldNumber}</td>
                <th className="w-1/4">الحالة</th>
                <td className="w-1/4">{getStatusLabel(scaffold.status)}</td>
              </tr>
              <tr>
                <th className="font-bold" colSpan={4}>
                  الكميات
                </th>
              </tr>
              <tr>
                <th>إجمالي الكمية</th>
                <td colSpan={3}>{formatQty(qtyTotal)}</td>
              </tr>
              <tr>
                <th>الكمية المستخدمة</th>
                <td colSpan={3}>{formatQty(qtyUsed)}</td>
              </tr>
              <tr>
                <th>الكمية المتاحة</th>
                <td colSpan={3}>{formatQty(qtyAvail)}</td>
              </tr>
              <tr>
                <th className="font-bold" colSpan={4}>
                  الوصف
                </th>
              </tr>
              <tr>
                <th>الوصف العربي</th>
                <td colSpan={3}>{scaffold.descriptionAr || '—'}</td>
              </tr>
              <tr>
                <th>الوصف الإنجليزي</th>
                <td colSpan={3}>{scaffold.descriptionEn || '—'}</td>
              </tr>
              <tr>
                <th className="font-bold" colSpan={4}>
                  الأسعار
                </th>
              </tr>
              <tr>
                <th>الإيجار اليومي</th>
                <td>{formatCurrency(scaffold.dailyRentalPrice)}</td>
                <th>الإيجار الشهري</th>
                <td>{formatCurrency(scaffold.monthlyRentalPrice)}</td>
              </tr>
              <tr>
                <th className="font-bold" colSpan={4}>
                  الكمية في العقود (جميع الحالات)
                </th>
              </tr>
              <tr>
                <th>اسم العقد</th>
                <th>العميل</th>
                <th>رقم العقد</th>
                <th>الكمية المستخدمة</th>
              </tr>
              {contractUsages.length > 0 ? (
                contractUsages.map((row) => (
                  <tr key={`print-${row.contractId}`}>
                    <td>{row.contractTitle}</td>
                    <td>{row.customerName ?? '—'}</td>
                    <td>{row.contractNumber}</td>
                    <td>{formatQty(num(row.quantityUsed))}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4}>لا توجد بنود عقد مرتبطة بهذه المعدة.</td>
                </tr>
              )}
              <tr>
                <th colSpan={3}>الإجمالي</th>
                <td>{formatQty(usedFromContracts)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="inventory-screen space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between no-print">
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
              <Button variant="outline" onClick={() => window.print()} className="flex items-center gap-2">
                <Printer className="h-4 w-4" />
                طباعة
              </Button>
              <Button onClick={() => router.visit(`/inventory/${scaffold.id}/edit`)} className="flex items-center gap-2">
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
            <CardContent className="pt-0">
              <div className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                <Table>
                  <TableBody>
                    <TableRow className="hover:bg-transparent border-b border-gray-200 dark:border-gray-700">
                      <TableCell className="w-[22%] align-middle bg-gray-50 dark:bg-gray-800/80 text-right text-sm font-semibold text-gray-700 dark:text-gray-300">
                        كود الصنف
                      </TableCell>
                      <TableCell className="align-middle text-right font-mono text-sm text-gray-900 dark:text-white">
                        {scaffold.scaffoldNumber}
                      </TableCell>
                      <TableCell className="w-[22%] align-middle bg-gray-50 dark:bg-gray-800/80 text-right text-sm font-semibold text-gray-700 dark:text-gray-300">
                        الحالة
                      </TableCell>
                      <TableCell className="align-middle text-right">
                        <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(scaffold.status)}`}>
                          {getStatusLabel(scaffold.status)}
                        </span>
                      </TableCell>
                    </TableRow>
                    <TableRow className="hover:bg-transparent border-b border-gray-200 dark:border-gray-700">
                      <TableCell className="align-middle bg-gray-50 dark:bg-gray-800/80 text-right text-sm font-semibold text-gray-700 dark:text-gray-300">
                        إجمالي الكمية
                      </TableCell>
                      <TableCell className="align-middle text-right tabular-nums text-sm font-medium text-gray-900 dark:text-white" colSpan={3}>
                        {formatQty(qtyTotal)}
                      </TableCell>
                    </TableRow>
                    <TableRow className="hover:bg-transparent border-b border-gray-200 dark:border-gray-700">
                      <TableCell className="align-middle bg-gray-50 dark:bg-gray-800/80 text-right text-sm font-semibold text-gray-700 dark:text-gray-300">
                        الكمية المستخدمة
                      </TableCell>
                      <TableCell className="align-middle text-right tabular-nums text-sm font-medium text-amber-700 dark:text-amber-300" colSpan={3}>
                        {formatQty(qtyUsed)}
                      </TableCell>
                    </TableRow>
                    <TableRow className="hover:bg-transparent border-0">
                      <TableCell className="align-middle bg-gray-50 dark:bg-gray-800/80 text-right text-sm font-semibold text-gray-700 dark:text-gray-300">
                        الكمية المتاحة
                      </TableCell>
                      <TableCell className="align-middle text-right tabular-nums text-sm font-medium text-green-700 dark:text-green-400" colSpan={3}>
                        {formatQty(qtyAvail)}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

        {/* استخدام الكمية في العقود */}
        <Card>
          <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-3 space-y-0">
            <div className="space-y-1.5">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <FileText className="h-5 w-5 shrink-0" />
                الكمية المؤجرة (جميع العقود)
              </CardTitle>
              <CardDescription className="text-right text-xs leading-relaxed max-w-xl">
                يُحسب المجموع من كل بنود العقود المرتبطة بهذه المعدة، لجميع حالات العقد.
              </CardDescription>
            </div>
            {contractUsages.length > 0 && (
              <Button type="button" variant="outline" size="sm" onClick={() => window.print()} className="no-print shrink-0 gap-2">
                <Printer className="h-4 w-4" />
                طباعة
              </Button>
            )}
          </CardHeader>
          <CardContent>
            {contractUsages.length === 0 ? (
              <p className="text-sm text-gray-600 dark:text-gray-400">
                لا توجد بنود عقد مرتبطة بهذه المعدة.
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
                        <Link href={`/contracts/${row.contractId}`} className="text-[#58d2c8] hover:underline font-mono">
                          {row.contractNumber}
                        </Link>
                      </TableCell>
                      <TableCell className="text-right tabular-nums font-medium">
                        {formatQty(num(row.quantityUsed))}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TableCell colSpan={3} className="text-right font-bold text-gray-900 dark:text-white">
                      الإجمالي
                    </TableCell>
                    <TableCell className="text-right tabular-nums font-bold text-gray-900 dark:text-white">
                      {formatQty(usedFromContracts)}
                    </TableCell>
                  </TableRow>
                </TableFooter>
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
      </div>
    </DashboardLayout>
  );
}
