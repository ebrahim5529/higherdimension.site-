/** @jsxImportSource react */
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Filter, BookOpen } from 'lucide-react';

interface LedgerItem {
  id: number;
  date: string;
  entry_number: string;
  entry_description: string;
  account_code: string;
  account_name: string;
  debit: number;
  credit: number;
  description: string | null;
}

interface AccountOption {
  id: number;
  code: string;
  name: string;
}

interface Props {
  items: LedgerItem[];
  accounts: AccountOption[];
  filters: { date_from?: string; date_to?: string; account_id?: string };
}

export default function GeneralLedger({ items, accounts, filters }: Props) {
  const [dateFrom, setDateFrom] = useState(filters.date_from || '');
  const [dateTo, setDateTo] = useState(filters.date_to || '');
  const [accountId, setAccountId] = useState(filters.account_id || '');

  const applyFilters = () => {
    router.get('/accounting/reports/general-ledger', {
      date_from: dateFrom || undefined,
      date_to: dateTo || undefined,
      account_id: accountId || undefined,
    }, { preserveState: true });
  };

  const clearFilters = () => {
    setDateFrom('');
    setDateTo('');
    setAccountId('');
    router.get('/accounting/reports/general-ledger');
  };

  const fmt = (n: number) => n.toLocaleString('ar-SA', { minimumFractionDigits: 2 });

  const totalDebit = items.reduce((sum, i) => sum + i.debit, 0);
  const totalCredit = items.reduce((sum, i) => sum + i.credit, 0);

  return (
    <DashboardLayout>
      <Head title="دفتر الأستاذ العام" />
      <div className="space-y-6 mt-2 -mx-1 sm:-mx-2 lg:-mx-3 xl:-mx-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">دفتر الأستاذ العام</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">عرض جميع الحركات المحاسبية المرحّلة</p>
        </div>

        <Card>
          <CardContent className="p-4">
            <div className="flex flex-wrap items-end gap-4">
              <div className="min-w-[250px]">
                <label className="text-sm text-gray-600 dark:text-gray-400 mb-1 block">الحساب</label>
                <select
                  className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm"
                  value={accountId}
                  onChange={(e) => setAccountId(e.target.value)}
                >
                  <option value="">جميع الحسابات</option>
                  {accounts.map((acc) => (
                    <option key={acc.id} value={acc.id}>
                      {acc.code} - {acc.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="min-w-[180px]">
                <label className="text-sm text-gray-600 dark:text-gray-400 mb-1 block">من تاريخ</label>
                <Input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
              </div>
              <div className="min-w-[180px]">
                <label className="text-sm text-gray-600 dark:text-gray-400 mb-1 block">إلى تاريخ</label>
                <Input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
              </div>
              <Button onClick={applyFilters} className="bg-[#58d2c8] hover:bg-[#4AB8B3] text-white">
                <Filter className="h-4 w-4 ml-1" />
                تصفية
              </Button>
              <Button variant="outline" onClick={clearFilters}>مسح</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              دفتر الأستاذ العام
              <span className="text-sm font-normal text-gray-500">({items.length} حركة)</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {items.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>لا توجد حركات محاسبية لعرضها</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b-2 border-gray-300 dark:border-gray-600">
                      <th className="text-right py-3 px-3 font-bold text-gray-700 dark:text-gray-300">التاريخ</th>
                      <th className="text-right py-3 px-3 font-bold text-gray-700 dark:text-gray-300">رقم القيد</th>
                      <th className="text-right py-3 px-3 font-bold text-gray-700 dark:text-gray-300">رمز الحساب</th>
                      <th className="text-right py-3 px-3 font-bold text-gray-700 dark:text-gray-300">اسم الحساب</th>
                      <th className="text-right py-3 px-3 font-bold text-gray-700 dark:text-gray-300">الوصف</th>
                      <th className="text-right py-3 px-3 font-bold text-gray-700 dark:text-gray-300">مدين</th>
                      <th className="text-right py-3 px-3 font-bold text-gray-700 dark:text-gray-300">دائن</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item) => (
                      <tr key={item.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                        <td className="py-2 px-3">{new Date(item.date).toLocaleDateString('ar-SA')}</td>
                        <td className="py-2 px-3 font-mono">
                          <button
                            onClick={() => router.visit(`/accounting/journal-entries/${item.id}`)}
                            className="text-[#58d2c8] hover:underline"
                          >
                            {item.entry_number}
                          </button>
                        </td>
                        <td className="py-2 px-3 font-mono">{item.account_code}</td>
                        <td className="py-2 px-3">{item.account_name}</td>
                        <td className="py-2 px-3 text-gray-500 max-w-[200px] truncate">{item.entry_description}</td>
                        <td className="py-2 px-3 font-mono">{item.debit > 0 ? fmt(item.debit) : '-'}</td>
                        <td className="py-2 px-3 font-mono">{item.credit > 0 ? fmt(item.credit) : '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t-2 border-gray-400 dark:border-gray-500 font-bold bg-gray-50 dark:bg-gray-800">
                      <td colSpan={5} className="py-3 px-3">الإجمالي</td>
                      <td className="py-3 px-3 font-mono">{fmt(totalDebit)}</td>
                      <td className="py-3 px-3 font-mono">{fmt(totalCredit)}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
