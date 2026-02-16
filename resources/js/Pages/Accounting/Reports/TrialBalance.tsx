/** @jsxImportSource react */
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Filter, FileText } from 'lucide-react';

interface TrialBalanceRow {
  id: number;
  code: string;
  name: string;
  type: string;
  total_debit: number;
  total_credit: number;
  debit_balance: number;
  credit_balance: number;
}

interface Props {
  data: TrialBalanceRow[];
  filters: { date_from?: string; date_to?: string };
  totals: {
    total_debit: number;
    total_credit: number;
    debit_balance: number;
    credit_balance: number;
  };
}

const typeLabels: Record<string, string> = {
  asset: 'أصول',
  liability: 'التزامات',
  equity: 'حقوق ملكية',
  revenue: 'إيرادات',
  expense: 'مصروفات',
};

export default function TrialBalance({ data, filters, totals }: Props) {
  const [dateFrom, setDateFrom] = useState(filters.date_from || '');
  const [dateTo, setDateTo] = useState(filters.date_to || '');

  const applyFilters = () => {
    router.get('/accounting/reports/trial-balance', {
      date_from: dateFrom || undefined,
      date_to: dateTo || undefined,
    }, { preserveState: true });
  };

  const fmt = (n: number) =>
    n.toLocaleString('ar-SA', { minimumFractionDigits: 2 });

  return (
    <DashboardLayout>
      <Head title="ميزان المراجعة" />
      <div className="space-y-6 mt-2 -mx-1 sm:-mx-2 lg:-mx-3 xl:-mx-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            ميزان المراجعة
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            عرض أرصدة جميع الحسابات المحاسبية
          </p>
        </div>

        {/* الفلاتر */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-wrap items-end gap-4">
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
              <Button variant="outline" onClick={() => { setDateFrom(''); setDateTo(''); router.get('/accounting/reports/trial-balance'); }}>
                مسح
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* الجدول */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              ميزان المراجعة
            </CardTitle>
          </CardHeader>
          <CardContent>
            {data.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>لا توجد بيانات لعرضها. تأكد من وجود قيود مرحّلة.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b-2 border-gray-300 dark:border-gray-600">
                      <th className="text-right py-3 px-4 font-bold text-gray-700 dark:text-gray-300">رمز الحساب</th>
                      <th className="text-right py-3 px-4 font-bold text-gray-700 dark:text-gray-300">اسم الحساب</th>
                      <th className="text-right py-3 px-4 font-bold text-gray-700 dark:text-gray-300">النوع</th>
                      <th className="text-right py-3 px-4 font-bold text-gray-700 dark:text-gray-300">إجمالي مدين</th>
                      <th className="text-right py-3 px-4 font-bold text-gray-700 dark:text-gray-300">إجمالي دائن</th>
                      <th className="text-right py-3 px-4 font-bold text-gray-700 dark:text-gray-300">رصيد مدين</th>
                      <th className="text-right py-3 px-4 font-bold text-gray-700 dark:text-gray-300">رصيد دائن</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((row) => (
                      <tr key={row.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                        <td className="py-3 px-4 font-mono">{row.code}</td>
                        <td className="py-3 px-4">{row.name}</td>
                        <td className="py-3 px-4 text-gray-500">{typeLabels[row.type] || row.type}</td>
                        <td className="py-3 px-4 font-mono">{fmt(row.total_debit)}</td>
                        <td className="py-3 px-4 font-mono">{fmt(row.total_credit)}</td>
                        <td className="py-3 px-4 font-mono">{row.debit_balance > 0 ? fmt(row.debit_balance) : '-'}</td>
                        <td className="py-3 px-4 font-mono">{row.credit_balance > 0 ? fmt(row.credit_balance) : '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t-2 border-gray-400 dark:border-gray-500 font-bold bg-gray-50 dark:bg-gray-800">
                      <td colSpan={3} className="py-3 px-4">الإجمالي</td>
                      <td className="py-3 px-4 font-mono">{fmt(totals.total_debit)}</td>
                      <td className="py-3 px-4 font-mono">{fmt(totals.total_credit)}</td>
                      <td className="py-3 px-4 font-mono">{fmt(totals.debit_balance)}</td>
                      <td className="py-3 px-4 font-mono">{fmt(totals.credit_balance)}</td>
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
