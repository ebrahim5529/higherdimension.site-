/** @jsxImportSource react */
import { Head, Link, router } from '@inertiajs/react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Combobox } from '@/components/ui/combobox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { FileText, Printer, User, ExternalLink } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

interface CustomerOption {
  id: number;
  customerNumber: string;
  name: string;
  phone: string;
}

interface ContractPaymentRow {
  id: number;
  paymentDate: string;
  paymentMethod: string;
  amount: number;
  checkNumber: string | null;
  bankName: string | null;
  notes: string | null;
}

interface ContractReportRow {
  id: number;
  contractNumber: string;
  title: string;
  status: string;
  statusLabel: string;
  startDate: string | null;
  endDate: string | null;
  amount: number;
  totalPaid: number;
  remaining: number;
  payments: ContractPaymentRow[];
}

interface SelectedCustomer {
  id: number;
  customerNumber: string;
  name: string;
  phone: string;
  email: string;
}

interface Props {
  customerOptions: CustomerOption[];
  selectedCustomerId: number | null;
  selectedCustomer: SelectedCustomer | null;
  contracts: ContractReportRow[];
}

const REPORT_PATH = '/dashboard/customer-contracts-payments-report';

export default function ContractsPaymentsReport({
  customerOptions,
  selectedCustomerId,
  selectedCustomer,
  contracts,
}: Props) {
  const [contractScope, setContractScope] = useState<string>('all');

  useEffect(() => {
    setContractScope('all');
  }, [selectedCustomerId]);

  const comboboxOptions = useMemo(
    () =>
      customerOptions.map((c) => ({
        value: String(c.id),
        label: `${c.name} — ${c.customerNumber}${c.phone ? ` — ${c.phone}` : ''}`,
      })),
    [customerOptions]
  );

  const visibleContracts = useMemo(() => {
    if (!contracts.length) {
      return [];
    }
    if (contractScope === 'all') {
      return contracts;
    }
    const id = Number(contractScope);
    return contracts.filter((c) => c.id === id);
  }, [contracts, contractScope]);

  const handleCustomerChange = (value: string) => {
    if (!value) {
      router.get(REPORT_PATH, {}, { preserveScroll: true });
      return;
    }
    router.get(REPORT_PATH, { customer_id: value }, { preserveScroll: true });
  };

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'OMR',
    }).format(Number(amount || 0));

  const formatDatePrint = () =>
    new Date().toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

  const handlePrint = () => window.print();

  return (
    <DashboardLayout>
      <Head title="تقرير عقود ومدفوعات عميل" />
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
            font-size: 11px;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .no-print { display: none !important; }
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
          body { background: #fff !important; }
          table { page-break-inside: auto; }
          tr { page-break-inside: avoid; page-break-after: auto; }
          .print-only { display: block !important; }
          .print-report { display: block !important; }
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
          .print-table {
            width: 100%;
            border-collapse: collapse;
          }
          .print-table td,
          .print-table th {
            border: 1px solid #000;
            padding: 4px;
            vertical-align: top;
            text-align: right;
          }
        }
        @media screen {
          .print-only { display: none; }
          .print-report { display: none; }
        }
      `}</style>

      <div className="print-layout-root space-y-6 mt-2 -mx-1 sm:-mx-2 lg:-mx-3 xl:-mx-4 print:mx-0 print:mt-0">
        <div className="flex flex-wrap items-start justify-between gap-4 no-print">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <FileText className="h-8 w-8 text-[#58d2c8]" />
              تقرير عقود ومدفوعات عميل
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              اختر عميلاً لعرض جميع عقوده ودفعات كل عقد، مع إمكانية تقييد العرض لعقد واحد أو طباعة التقرير.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {selectedCustomer && (
              <Button type="button" className="bg-[#58d2c8] hover:bg-[#4AB8B3] gap-2" onClick={handlePrint}>
                <Printer className="h-4 w-4" />
                طباعة التقرير
              </Button>
            )}
          </div>
        </div>

        <Card className="no-print">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <User className="h-5 w-5" />
              اختيار العميل
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="max-w-xl">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                ابحث واختر عميلاً
              </label>
              <Combobox
                options={comboboxOptions}
                value={selectedCustomerId ? String(selectedCustomerId) : undefined}
                onValueChange={handleCustomerChange}
                placeholder="اكتب للبحث بالاسم أو الرقم أو الجوال..."
                searchPlaceholder="بحث..."
                emptyText="لا يوجد عميل مطابق"
              />
            </div>
            {selectedCustomerId ? (
              <Button type="button" variant="outline" size="sm" onClick={() => handleCustomerChange('')}>
                إلغاء اختيار العميل
              </Button>
            ) : null}
          </CardContent>
        </Card>

        {selectedCustomer && (
          <>
            <Card className="no-print">
              <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-3 space-y-0">
                <CardTitle className="text-base">نطاق العقود المعروضة</CardTitle>
                <Link
                  href={`/customers/${selectedCustomer.id}`}
                  className="text-sm text-[#58d2c8] hover:underline inline-flex items-center gap-1"
                >
                  صفحة العميل
                  <ExternalLink className="h-3.5 w-3.5" />
                </Link>
              </CardHeader>
              <CardContent>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">العقود</label>
                <select
                  value={contractScope}
                  onChange={(e) => setContractScope(e.target.value)}
                  className="w-full max-w-md border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                >
                  <option value="all">كل العقود ({contracts.length})</option>
                  {contracts.map((c) => (
                    <option key={c.id} value={String(c.id)}>
                      {c.contractNumber} — {c.statusLabel} — {formatCurrency(c.amount)}
                    </option>
                  ))}
                </select>
              </CardContent>
            </Card>

            <Card className="no-print">
              <CardHeader>
                <CardTitle className="text-base">بيانات العميل</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">الاسم:</span>{' '}
                    <span className="font-semibold text-gray-900 dark:text-white">{selectedCustomer.name}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">رقم العميل:</span>{' '}
                    <span className="font-mono">{selectedCustomer.customerNumber}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">الجوال:</span>{' '}
                    <span>{selectedCustomer.phone || '—'}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">البريد:</span>{' '}
                    <span>{selectedCustomer.email || '—'}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {visibleContracts.length === 0 ? (
              <Card className="no-print">
                <CardContent className="py-10 text-center text-gray-600 dark:text-gray-400">
                  لا توجد عقود لهذا العميل.
                </CardContent>
              </Card>
            ) : (
              visibleContracts.map((contract) => (
                <Card key={contract.id} className="no-print">
                  <CardHeader>
                    <CardTitle className="text-base flex flex-wrap items-center gap-2 justify-between">
                      <span>
                        عقد {contract.contractNumber}
                        <span className="text-sm font-normal text-gray-500 dark:text-gray-400 mr-2">
                          ({contract.statusLabel})
                        </span>
                      </span>
                      <Link
                        href={`/contracts/${contract.id}`}
                        className="text-sm text-[#58d2c8] hover:underline inline-flex items-center gap-1 font-normal"
                      >
                        فتح العقد
                        <ExternalLink className="h-3.5 w-3.5" />
                      </Link>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                      <div>
                        <div className="text-gray-500 dark:text-gray-400 text-xs">عنوان العقد</div>
                        <div className="font-medium">{contract.title || '—'}</div>
                      </div>
                      <div>
                        <div className="text-gray-500 dark:text-gray-400 text-xs">من — إلى</div>
                        <div className="font-mono text-xs">
                          {contract.startDate || '—'} ← {contract.endDate || '—'}
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-500 dark:text-gray-400 text-xs">قيمة العقد</div>
                        <div className="font-semibold tabular-nums">{formatCurrency(contract.amount)}</div>
                      </div>
                      <div>
                        <div className="text-gray-500 dark:text-gray-400 text-xs">المدفوع / المتبقي</div>
                        <div className="tabular-nums">
                          <span className="text-green-700 dark:text-green-400">{formatCurrency(contract.totalPaid)}</span>
                          {' / '}
                          <span className="text-amber-700 dark:text-amber-300">{formatCurrency(contract.remaining)}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold mb-2">دفعات العقد</h4>
                      {contract.payments.length === 0 ? (
                        <p className="text-sm text-gray-500">لا توجد دفعات مسجلة لهذا العقد.</p>
                      ) : (
                        <div className="rounded-md border border-gray-200 dark:border-gray-700 overflow-x-auto">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead className="text-right">التاريخ</TableHead>
                                <TableHead className="text-right">الطريقة</TableHead>
                                <TableHead className="text-right">المبلغ</TableHead>
                                <TableHead className="text-right">شيك / بنك</TableHead>
                                <TableHead className="text-right">ملاحظات</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {contract.payments.map((p) => (
                                <TableRow key={p.id}>
                                  <TableCell className="text-right font-mono text-sm">{p.paymentDate}</TableCell>
                                  <TableCell className="text-right text-sm">{p.paymentMethod}</TableCell>
                                  <TableCell className="text-right tabular-nums font-medium text-green-700 dark:text-green-400">
                                    {formatCurrency(p.amount)}
                                  </TableCell>
                                  <TableCell className="text-right text-sm text-gray-600 dark:text-gray-400">
                                    {[p.checkNumber, p.bankName].filter(Boolean).join(' — ') || '—'}
                                  </TableCell>
                                  <TableCell className="text-right text-sm max-w-[200px] break-words">
                                    {p.notes || '—'}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </>
        )}

        {!selectedCustomer && (
          <Card className="no-print">
            <CardContent className="py-12 text-center text-gray-600 dark:text-gray-400">
              اختر عميلاً من القائمة أعلاه لعرض العقود والدفعات.
            </CardContent>
          </Card>
        )}

        {/* نسخة الطباعة */}
        {selectedCustomer && (
          <div className="print-report print-container">
            <div className="border border-black rounded-md p-3 mb-3">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-lg font-bold text-black">تقرير عقود ومدفوعات عميل</div>
                  <div className="text-sm text-black font-bold">{selectedCustomer.name}</div>
                  <div className="text-xs text-black">
                    رقم العميل: {selectedCustomer.customerNumber} — الجوال: {selectedCustomer.phone || '—'}
                  </div>
                  <div className="text-xs text-black mt-1">
                    نطاق العقود:{' '}
                    {contractScope === 'all'
                      ? 'كل العقود'
                      : visibleContracts[0]
                        ? `عقد ${visibleContracts[0].contractNumber}`
                        : 'عقد محدد'}
                  </div>
                </div>
                <div className="text-xs text-black">تاريخ الطباعة: {formatDatePrint()}</div>
              </div>
            </div>

            {visibleContracts.map((contract) => (
              <div key={`print-c-${contract.id}`} className="mb-6 print-break">
                <table className="print-table mb-2">
                  <tbody>
                    <tr>
                      <th colSpan={4} className="font-bold bg-gray-100">
                        بيانات العقد {contract.contractNumber}
                      </th>
                    </tr>
                    <tr>
                      <th>رقم العقد</th>
                      <td>{contract.contractNumber}</td>
                      <th>الحالة</th>
                      <td>{contract.statusLabel}</td>
                    </tr>
                    <tr>
                      <th>العنوان</th>
                      <td colSpan={3}>{contract.title || '—'}</td>
                    </tr>
                    <tr>
                      <th>تاريخ البدء</th>
                      <td>{contract.startDate || '—'}</td>
                      <th>تاريخ الانتهاء</th>
                      <td>{contract.endDate || '—'}</td>
                    </tr>
                    <tr>
                      <th>قيمة العقد</th>
                      <td>{formatCurrency(contract.amount)}</td>
                      <th>المدفوع / المتبقي</th>
                      <td>
                        {formatCurrency(contract.totalPaid)} / {formatCurrency(contract.remaining)}
                      </td>
                    </tr>
                  </tbody>
                </table>

                <table className="print-table">
                  <thead>
                    <tr>
                      <th colSpan={5} className="text-right font-bold">
                        دفعات العقد {contract.contractNumber}
                      </th>
                    </tr>
                    <tr>
                      <th>التاريخ</th>
                      <th>طريقة الدفع</th>
                      <th>المبلغ</th>
                      <th>شيك / بنك</th>
                      <th>ملاحظات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {contract.payments.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="text-center">
                          لا توجد دفعات
                        </td>
                      </tr>
                    ) : (
                      contract.payments.map((p) => (
                        <tr key={`print-p-${p.id}`}>
                          <td>{p.paymentDate}</td>
                          <td>{p.paymentMethod}</td>
                          <td>{formatCurrency(p.amount)}</td>
                          <td>{[p.checkNumber, p.bankName].filter(Boolean).join(' — ') || '—'}</td>
                          <td>{p.notes || '—'}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
