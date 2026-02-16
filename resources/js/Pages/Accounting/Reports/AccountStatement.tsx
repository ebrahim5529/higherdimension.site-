/** @jsxImportSource react */
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Filter, FileText } from 'lucide-react';

interface StatementItem {
  id: number;
  date: string;
  entry_number: string;
  description: string;
  debit: number;
  credit: number;
  balance: number;
}

interface AccountOption {
  id: number;
  code: string;
  name: string;
  type: string;
}

interface SelectedAccount {
  id: number;
  code: string;
  name: string;
  type: string;
}

interface Props {
  items: StatementItem[];
  accounts: AccountOption[];
  selectedAccount: SelectedAccount | null;
  openingBalance: number;
  filters: { account_id?: string; date_from?: string; date_to?: string };
}

export default function AccountStatement({ items, accounts, selectedAccount, openingBalance, filters }: Props) {
  const [accountId, setAccountId] = useState(filters.account_id || '');
  const [dateFrom, setDateFrom] = useState(filters.date_from || '');
  const [dateTo, setDateTo] = useState(filters.date_to || '');

  const applyFilters = () => {
    router.get('/accounting/reports/account-statement', {
      account_id: accountId || undefined,
      date_from: dateFrom || undefined,
      date_to: dateTo || undefined,
    }, { preserveState: true });
  };

  const fmt = (n: number) => n.toLocaleString('ar-SA', { minimumFractionDigits: 2 });

  const totalDebit = items.reduce((sum, i) => sum + i.debit, 0);
  const totalCredit = items.reduce((sum, i) => sum + i.credit, 0);
  const closingBalance = items.length > 0 ? items[items.length - 1].balance : openingBalance;

  return (
    <DashboardLayout>
      <Head title="كشف حساب" />
      <div className="space-y-6 mt-2 -mx-1 sm:-mx-2 lg:-mx-3 xl:-mx-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">كشف حساب</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">عرض حركات حساب محدد مع الرصيد التراكمي</p>
        </div>

        <Card>
          <CardContent className="p-4">
            <div className="flex flex-wrap items-end gap-4">
              <div className="min-w-[280px]">
                <label className="text-sm text-gray-600 dark:text-gray-400 mb-1 block">الحساب *</label>
                <select
                  className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm"
                  value={accountId}
                  onChange={(e) => setAccountId(e.target.value)}
                >
                  <option value="">اختر الحساب</option>
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
              <Button onClick={applyFilters} className="bg-[#58d2c8] hover:bg-[#4AB8B3] text-white" disabled={!accountId}>
                <Filter className="h-4 w-4 ml-1" />
                عرض
              </Button>
            </div>
          </CardContent>
        </Card>

        {selectedAccount && (
          <>
            {/* معلومات الحساب */}
            <Card>
              <CardContent className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <div className="text-sm text-gray-500">رمز الحساب</div>
                    <div className="font-mono font-bold text-lg">{selectedAccount.code}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">اسم الحساب</div>
                    <div className="font-bold text-lg">{selectedAccount.name}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">الرصيد الافتتاحي</div>
                    <div className="font-mono font-bold text-lg">{fmt(openingBalance)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">الرصيد الختامي</div>
                    <div className={`font-mono font-bold text-lg ${closingBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {fmt(closingBalance)}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* جدول الحركات */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  حركات الحساب
                  <span className="text-sm font-normal text-gray-500">({items.length} حركة)</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {items.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>لا توجد حركات لهذا الحساب في الفترة المحددة</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b-2 border-gray-300 dark:border-gray-600">
                          <th className="text-right py-3 px-3 font-bold text-gray-700 dark:text-gray-300">التاريخ</th>
                          <th className="text-right py-3 px-3 font-bold text-gray-700 dark:text-gray-300">رقم القيد</th>
                          <th className="text-right py-3 px-3 font-bold text-gray-700 dark:text-gray-300">الوصف</th>
                          <th className="text-right py-3 px-3 font-bold text-gray-700 dark:text-gray-300">مدين</th>
                          <th className="text-right py-3 px-3 font-bold text-gray-700 dark:text-gray-300">دائن</th>
                          <th className="text-right py-3 px-3 font-bold text-gray-700 dark:text-gray-300">الرصيد</th>
                        </tr>
                      </thead>
                      <tbody>
                        {/* الرصيد الافتتاحي */}
                        {openingBalance !== 0 && (
                          <tr className="bg-gray-50 dark:bg-gray-800/50 font-medium">
                            <td colSpan={5} className="py-2 px-3">الرصيد الافتتاحي</td>
                            <td className="py-2 px-3 font-mono">{fmt(openingBalance)}</td>
                          </tr>
                        )}
                        {items.map((item) => (
                          <tr key={item.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                            <td className="py-2 px-3">{new Date(item.date).toLocaleDateString('ar-SA')}</td>
                            <td className="py-2 px-3 font-mono text-[#58d2c8]">{item.entry_number}</td>
                            <td className="py-2 px-3 max-w-[250px] truncate">{item.description}</td>
                            <td className="py-2 px-3 font-mono">{item.debit > 0 ? fmt(item.debit) : '-'}</td>
                            <td className="py-2 px-3 font-mono">{item.credit > 0 ? fmt(item.credit) : '-'}</td>
                            <td className={`py-2 px-3 font-mono font-medium ${item.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {fmt(item.balance)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr className="border-t-2 border-gray-400 dark:border-gray-500 font-bold bg-gray-50 dark:bg-gray-800">
                          <td colSpan={3} className="py-3 px-3">الإجمالي</td>
                          <td className="py-3 px-3 font-mono">{fmt(totalDebit)}</td>
                          <td className="py-3 px-3 font-mono">{fmt(totalCredit)}</td>
                          <td className={`py-3 px-3 font-mono ${closingBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {fmt(closingBalance)}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}

        {!selectedAccount && (
          <Card>
            <CardContent className="p-12 text-center text-gray-500">
              <FileText className="h-16 w-16 mx-auto mb-4 opacity-30" />
              <p className="text-lg">اختر حساباً لعرض كشف الحساب</p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
