/** @jsxImportSource react */
import { Head, router } from '@inertiajs/react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Printer, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { PaginationLinks } from '@/components/features/PaginationLinks';

interface CustomerReportsProps {
  stats: Array<{
    title: string;
    value: string | number;
    change: string;
  }>;
  filters?: {
    from: string | null;
    to: string | null;
    contractStatus?: string | null;
  };
  customers: Array<{
    id: number;
    customerNumber: string;
    name: string;
    phone: string;
    totalAmount: number;
    paidAmount: number;
    remainingAmount: number;
    notes: string;
  }>;
  contracts: {
    data: Array<{
      id: number;
      contractNumber: string;
      status: string;
      startDate: string | null;
      endDate: string | null;
      customerName: string;
      amount: number;
    }>;
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: Array<{ url: string | null; label: string; active: boolean }>;
  };
}

const CONTRACT_STATUS_LABELS: Record<string, string> = {
  ACTIVE: 'نشط',
  OPEN: 'نشط',
  EXPIRED: 'منتهي',
  CANCELLED: 'ملغي',
  COMPLETED: 'مكتمل',
  CLOSED: 'مغلق',
  CLOSED_NOT_RECEIVED: 'مغلق ولم يتم استلام الأصناف',
  DRAFT: 'مسودة',
};

export default function CustomerReports({ stats, customers, contracts, filters }: CustomerReportsProps) {
  const handlePrint = () => {
    window.print()
  }

  const [from, setFrom] = useState(filters?.from || '')
  const [to, setTo] = useState(filters?.to || '')
  const [customerQuery, setCustomerQuery] = useState('')
  const [contractStatus, setContractStatus] = useState(filters?.contractStatus || '')
  const [selectedContractIds, setSelectedContractIds] = useState<Record<number, boolean>>({})

  useEffect(() => {
    setFrom(filters?.from || '')
    setTo(filters?.to || '')
    setContractStatus(filters?.contractStatus || '')
  }, [filters?.from, filters?.to, filters?.contractStatus])

  const applyFilters = () => {
    router.get('/dashboard/customer-reports', {
      from: from || undefined,
      to: to || undefined,
      contract_status: contractStatus || undefined,
    }, {
      preserveScroll: true,
      preserveState: true,
    })
  }

  const clearFilters = () => {
    setFrom('')
    setTo('')
    setContractStatus('')
    router.get('/dashboard/customer-reports', {}, { preserveScroll: true, preserveState: true })
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'OMR',
    }).format(Number(amount || 0))
  }

  const normalized = (value: unknown) => String(value || '').toLowerCase().trim()

  const filteredCustomers = customers.filter((c) => {
    const q = normalized(customerQuery)
    if (!q) return true
    return (
      normalized(c.customerNumber).includes(q) ||
      normalized(c.name).includes(q) ||
      normalized(c.phone).includes(q)
    )
  })

  const totals = filteredCustomers.reduce(
    (acc, c) => {
      acc.totalAmount += Number(c.totalAmount || 0)
      acc.paidAmount += Number(c.paidAmount || 0)
      acc.remainingAmount += Number(c.remainingAmount || 0)
      return acc
    },
    { totalAmount: 0, paidAmount: 0, remainingAmount: 0 }
  )

  const isExpiredContract = (c: CustomerReportsProps['contracts']['data'][number]) => {
    if (!c?.endDate) return false
    if (!(c.status === 'ACTIVE' || c.status === 'OPEN')) return false
    const [y, m, d] = String(c.endDate).split('T')[0].split('-').map((x) => parseInt(x, 10))
    if (!y || !m || !d) return false
    const endUtc = Date.UTC(y, m - 1, d, 23, 59, 59)
    return Date.now() > endUtc
  }

  const toggleSelectAllContractsInPage = (isSelected: boolean) => {
    const next = { ...selectedContractIds }
    for (const c of contracts.data) {
      next[c.id] = isSelected
    }
    setSelectedContractIds(next)
  }

  const selectedContracts = contracts.data.filter((c) => selectedContractIds[c.id])

  const printSelectedContracts = () => {
    if (selectedContracts.length === 0) return
    window.print()
  }
  return (
    <DashboardLayout>
      <Head title="تقارير العملاء" />
      <style>{`
        @media print {
          @page {
            size: A4;
            margin: 8mm;
          }
          body {
            margin: 0 !important;
            padding: 0 !important;
            font-size: 11px;
          }
          .no-print { display: none !important; }
          /* إخفاء مكونات لوحة التحكم أثناء الطباعة */
          header,
          aside,
          .fixed.inset-y-0.right-0.z-50,
          .fixed.inset-0.z-40 {
            display: none !important;
          }
          main { padding: 0 !important; overflow: visible !important; }
          body { background: #fff !important; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          table { page-break-inside: auto; }
          tr { page-break-inside: avoid; page-break-after: auto; }

          .print-only { display: block !important; }
          .print-report { display: block !important; }
          .print-container { margin: 0 !important; padding: 0 !important; }
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
      <div className="space-y-6 mt-2 -mx-1 sm:-mx-2 lg:-mx-3 xl:-mx-4">
        <div className="flex items-start justify-between gap-4 no-print">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              تقارير العملاء
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              تقرير ملخص لكل عميل مع إجمالياته
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              className="flex items-center gap-2"
              onClick={() => router.visit('/customers')}
            >
              <Users className="h-4 w-4" />
              العملاء
            </Button>
            <Button
              type="button"
              className="flex items-center gap-2 bg-[#58d2c8] hover:bg-[#4AB8B3]"
              onClick={handlePrint}
              title="طباعة تقرير العملاء"
            >
              <Printer className="h-4 w-4" />
              طباعة
            </Button>
          </div>
        </div>

        <Card className="no-print">
          <CardHeader>
            <CardTitle className="text-sm font-medium">فلترة بين تاريخين</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-3">
              <div className="w-full sm:w-auto">
                <label className="block text-xs text-gray-600 dark:text-gray-300 mb-1">من</label>
                <input
                  type="date"
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                  className="w-full sm:w-[180px] border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                />
              </div>
              <div className="w-full sm:w-auto">
                <label className="block text-xs text-gray-600 dark:text-gray-300 mb-1">إلى</label>
                <input
                  type="date"
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  className="w-full sm:w-[180px] border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                />
              </div>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  className="bg-[#58d2c8] hover:bg-[#4AB8B3]"
                  onClick={applyFilters}
                >
                  تطبيق
                </Button>
                <Button type="button" variant="outline" onClick={clearFilters}>
                  مسح
                </Button>
              </div>
              <div className="w-full sm:w-auto">
                <label className="block text-xs text-gray-600 dark:text-gray-300 mb-1">حالة العقد</label>
                <select
                  value={contractStatus}
                  onChange={(e) => setContractStatus(e.target.value)}
                  className="w-full sm:w-[220px] border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                >
                  <option value="">الكل</option>
                  <option value="ACTIVE">نشط</option>
                  <option value="EXPIRED">منتهي</option>
                  <option value="CANCELLED">ملغي</option>
                  <option value="COMPLETED">مكتمل</option>
                  <option value="CLOSED">مغلق</option>
                  <option value="CLOSED_NOT_RECEIVED">مغلق ولم يتم استلام الأصناف</option>
                  <option value="DRAFT">مسودة</option>
                </select>
              </div>
              {(from || to) ? (
                <div className="text-xs text-gray-600 dark:text-gray-300 sm:mr-auto">
                  الفترة: {from || '—'} → {to || '—'}
                </div>
              ) : null}
            </div>
          </CardContent>
        </Card>

        <Card className="no-print">
          <CardHeader>
            <div className="flex items-center justify-between gap-3">
              <CardTitle className="text-sm font-medium">قائمة العقود</CardTitle>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => toggleSelectAllContractsInPage(true)}
                  disabled={contracts.data.length === 0}
                >
                  تحديد الكل (هذه الصفحة)
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => toggleSelectAllContractsInPage(false)}
                  disabled={contracts.data.length === 0}
                >
                  إلغاء التحديد
                </Button>
                <Button
                  type="button"
                  className="bg-[#58d2c8] hover:bg-[#4AB8B3]"
                  onClick={printSelectedContracts}
                  disabled={selectedContracts.length === 0}
                  title="قد تحتاج للسماح بالنوافذ المنبثقة"
                >
                  <Printer className="h-4 w-4 ml-2" />
                  طباعة المحدد ({selectedContracts.length})
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-200 dark:border-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-3 py-2 text-right text-xs font-semibold text-gray-700 dark:text-gray-200">تحديد</th>
                    <th className="px-3 py-2 text-right text-xs font-semibold text-gray-700 dark:text-gray-200">رقم العقد</th>
                    <th className="px-3 py-2 text-right text-xs font-semibold text-gray-700 dark:text-gray-200">العميل</th>
                    <th className="px-3 py-2 text-right text-xs font-semibold text-gray-700 dark:text-gray-200">الحالة</th>
                    <th className="px-3 py-2 text-right text-xs font-semibold text-gray-700 dark:text-gray-200">تاريخ البدء</th>
                    <th className="px-3 py-2 text-right text-xs font-semibold text-gray-700 dark:text-gray-200">تاريخ الانتهاء</th>
                    <th className="px-3 py-2 text-right text-xs font-semibold text-gray-700 dark:text-gray-200">المبلغ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {contracts.data.map((c) => (
                    <tr
                      key={c.id}
                      className={
                        isExpiredContract(c)
                          ? 'bg-red-600 text-white hover:bg-red-700 [&_*]:text-white'
                          : 'bg-white dark:bg-gray-900'
                      }
                    >
                      <td className="px-3 py-2 text-sm">
                        <input
                          type="checkbox"
                          checked={Boolean(selectedContractIds[c.id])}
                          onChange={(e) => setSelectedContractIds({ ...selectedContractIds, [c.id]: e.target.checked })}
                        />
                      </td>
                      <td className="px-3 py-2 text-sm font-mono whitespace-nowrap">{c.contractNumber}</td>
                      <td className="px-3 py-2 text-sm">{c.customerName}</td>
                      <td className="px-3 py-2 text-sm whitespace-nowrap">
                        {CONTRACT_STATUS_LABELS[c.status] || c.status}
                      </td>
                      <td className="px-3 py-2 text-sm whitespace-nowrap">{c.startDate || '—'}</td>
                      <td className="px-3 py-2 text-sm whitespace-nowrap">{c.endDate || '—'}</td>
                      <td className="px-3 py-2 text-sm whitespace-nowrap">{formatCurrency(c.amount)}</td>
                    </tr>
                  ))}
                  {contracts.data.length === 0 && (
                    <tr>
                      <td colSpan={7} className="px-3 py-6 text-center text-sm text-gray-500 dark:text-gray-400">
                        لا توجد عقود
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="pt-4">
              <PaginationLinks links={contracts.links} />
            </div>
          </CardContent>
        </Card>

        <Card className="no-print">
          <CardHeader>
            <CardTitle className="text-sm font-medium">بحث حسب العميل</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-3">
              <div className="w-full sm:flex-1">
                <label className="block text-xs text-gray-600 dark:text-gray-300 mb-1">رقم العميل / اسم العميل / رقم الجوال</label>
                <input
                  type="text"
                  value={customerQuery}
                  onChange={(e) => setCustomerQuery(e.target.value)}
                  placeholder="ابحث..."
                  className="w-full border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                />
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-300">
                النتائج: {filteredCustomers.length} / {customers.length}
              </div>
              <Button type="button" variant="outline" onClick={() => setCustomerQuery('')}>
                مسح البحث
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* نسخة الطباعة (بنفس أسلوب /customers/26) */}
        <div className="print-report print-container">
          <div className="border border-black rounded-md p-3 mb-3">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-lg font-bold text-black">تقرير العملاء</div>
                <div className="text-sm text-black">ملخص لكل عميل</div>
              </div>
              <div className="text-xs text-black">
                <div>تاريخ الطباعة: {formatDate(new Date())}</div>
                {(from || to) ? <div>الفترة: {from || '—'} → {to || '—'}</div> : null}
                {customerQuery ? <div>البحث: {customerQuery}</div> : null}
                {contractStatus ? <div>حالة العقد: {CONTRACT_STATUS_LABELS[contractStatus] || contractStatus}</div> : null}
              </div>
            </div>
          </div>

          <table className="print-table">
            <thead>
              <tr>
                <th className="w-[12%]">رقم العميل</th>
                <th className="w-[18%]">اسم العميل</th>
                <th className="w-[14%]">رقم الجوال</th>
                <th className="w-[12%]">الإجمالي</th>
                <th className="w-[12%]">المدفوع</th>
                <th className="w-[12%]">المتبقي</th>
                <th className="w-[20%]">الملاحظات</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map((c) => (
                <tr key={`print-${c.id}`}>
                  <td>{c.customerNumber || '-'}</td>
                  <td>{c.name}</td>
                  <td>{c.phone || '-'}</td>
                  <td>{formatCurrency(c.totalAmount)}</td>
                  <td>{formatCurrency(c.paidAmount)}</td>
                  <td>{formatCurrency(c.remainingAmount)}</td>
                  <td>{c.notes || '-'}</td>
                </tr>
              ))}
              {filteredCustomers.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center">لا توجد بيانات</td>
                </tr>
              )}
            </tbody>
            <tfoot>
              <tr>
                <th colSpan={3}>الإجمالي</th>
                <th>{formatCurrency(totals.totalAmount)}</th>
                <th>{formatCurrency(totals.paidAmount)}</th>
                <th>{formatCurrency(totals.remainingAmount)}</th>
                <th></th>
              </tr>
            </tfoot>
          </table>

          <div className="border border-black rounded-md p-3 mt-4 mb-3">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-lg font-bold text-black">قائمة العقود (المحدد)</div>
                <div className="text-sm text-black">حسب اختيارك من الصفحة</div>
              </div>
              <div className="text-xs text-black">
                <div>عدد العقود المحددة: {selectedContracts.length}</div>
                {contractStatus ? <div>حالة العقد: {CONTRACT_STATUS_LABELS[contractStatus] || contractStatus}</div> : null}
              </div>
            </div>
          </div>

          <table className="print-table">
            <thead>
              <tr>
                <th className="w-[16%]">رقم العقد</th>
                <th className="w-[22%]">العميل</th>
                <th className="w-[14%]">الحالة</th>
                <th className="w-[14%]">تاريخ البدء</th>
                <th className="w-[14%]">تاريخ الانتهاء</th>
                <th className="w-[20%]">المبلغ</th>
              </tr>
            </thead>
            <tbody>
              {selectedContracts.map((c) => (
                <tr key={`print-contract-${c.id}`}>
                  <td>{c.contractNumber || '-'}</td>
                  <td>{c.customerName}</td>
                  <td>{CONTRACT_STATUS_LABELS[c.status] || c.status}</td>
                  <td>{c.startDate || '—'}</td>
                  <td>{c.endDate || '—'}</td>
                  <td>{formatCurrency(c.amount)}</td>
                </tr>
              ))}
              {selectedContracts.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center">لا توجد عقود محددة</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 no-print">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.change}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="no-print">
          <CardHeader>
            <CardTitle>ملخص لكل عميل</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-200 dark:border-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-3 py-2 text-right text-xs font-semibold text-gray-700 dark:text-gray-200">رقم العميل</th>
                    <th className="px-3 py-2 text-right text-xs font-semibold text-gray-700 dark:text-gray-200">اسم العميل</th>
                    <th className="px-3 py-2 text-right text-xs font-semibold text-gray-700 dark:text-gray-200">رقم الجوال</th>
                    <th className="px-3 py-2 text-right text-xs font-semibold text-gray-700 dark:text-gray-200">الإجمالي</th>
                    <th className="px-3 py-2 text-right text-xs font-semibold text-gray-700 dark:text-gray-200">المدفوع</th>
                    <th className="px-3 py-2 text-right text-xs font-semibold text-gray-700 dark:text-gray-200">المتبقي</th>
                    <th className="px-3 py-2 text-right text-xs font-semibold text-gray-700 dark:text-gray-200">الملاحظات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredCustomers.map((c) => (
                    <tr key={c.id} className="bg-white dark:bg-gray-900">
                      <td className="px-3 py-2 text-sm text-gray-900 dark:text-white whitespace-nowrap">{c.customerNumber || '-'}</td>
                      <td className="px-3 py-2 text-sm text-gray-900 dark:text-white">{c.name}</td>
                      <td className="px-3 py-2 text-sm text-gray-900 dark:text-white whitespace-nowrap">{c.phone || '-'}</td>
                      <td className="px-3 py-2 text-sm text-gray-900 dark:text-white whitespace-nowrap">{formatCurrency(c.totalAmount)}</td>
                      <td className="px-3 py-2 text-sm text-green-700 dark:text-green-400 whitespace-nowrap">{formatCurrency(c.paidAmount)}</td>
                      <td className="px-3 py-2 text-sm text-red-700 dark:text-red-400 whitespace-nowrap">{formatCurrency(c.remainingAmount)}</td>
                      <td className="px-3 py-2 text-sm text-gray-700 dark:text-gray-300 max-w-[420px] break-words">{c.notes || '-'}</td>
                    </tr>
                  ))}
                  {filteredCustomers.length === 0 && (
                    <tr>
                      <td colSpan={7} className="px-3 py-6 text-center text-sm text-gray-500 dark:text-gray-400">
                        لا توجد بيانات
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 bg-white dark:bg-gray-900">
                <div className="text-xs text-gray-600 dark:text-gray-300">الإجمالي</div>
                <div className="text-lg font-bold text-gray-900 dark:text-white">{formatCurrency(totals.totalAmount)}</div>
              </div>
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 bg-white dark:bg-gray-900">
                <div className="text-xs text-gray-600 dark:text-gray-300">المدفوع</div>
                <div className="text-lg font-bold text-green-700 dark:text-green-400">{formatCurrency(totals.paidAmount)}</div>
              </div>
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 bg-white dark:bg-gray-900">
                <div className="text-xs text-gray-600 dark:text-gray-300">المتبقي</div>
                <div className="text-lg font-bold text-red-700 dark:text-red-400">{formatCurrency(totals.remainingAmount)}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

