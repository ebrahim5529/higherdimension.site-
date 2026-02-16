/** @jsxImportSource react */
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Filter, TrendingUp, TrendingDown, FileText } from 'lucide-react';

interface AccountRow {
  id: number;
  code: string;
  name: string;
  type: string;
  balance: number;
}

interface Props {
  revenues: AccountRow[];
  expenses: AccountRow[];
  totals: { revenue: number; expenses: number; netIncome: number };
  filters: { date_from?: string; date_to?: string };
}

export default function IncomeStatement({ revenues, expenses, totals, filters }: Props) {
  const [dateFrom, setDateFrom] = useState(filters.date_from || '');
  const [dateTo, setDateTo] = useState(filters.date_to || '');

  const applyFilters = () => {
    router.get('/accounting/reports/income-statement', {
      date_from: dateFrom || undefined,
      date_to: dateTo || undefined,
    }, { preserveState: true });
  };

  const fmt = (n: number) => n.toLocaleString('ar-SA', { minimumFractionDigits: 2 });

  return (
    <DashboardLayout>
      <Head title="قائمة الدخل" />
      <div className="space-y-6 mt-2 -mx-1 sm:-mx-2 lg:-mx-3 xl:-mx-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">قائمة الدخل</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">عرض الإيرادات والمصروفات وصافي الربح</p>
        </div>

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
            </div>
          </CardContent>
        </Card>

        {/* ملخص */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <TrendingUp className="h-8 w-8 mx-auto mb-2 text-green-500" />
              <div className="text-sm text-gray-500">إجمالي الإيرادات</div>
              <div className="text-2xl font-bold text-green-600">{fmt(totals.revenue)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <TrendingDown className="h-8 w-8 mx-auto mb-2 text-red-500" />
              <div className="text-sm text-gray-500">إجمالي المصروفات</div>
              <div className="text-2xl font-bold text-red-600">{fmt(totals.expenses)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <FileText className="h-8 w-8 mx-auto mb-2 text-blue-500" />
              <div className="text-sm text-gray-500">صافي الربح / الخسارة</div>
              <div className={`text-2xl font-bold ${totals.netIncome >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {fmt(totals.netIncome)}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* الإيرادات */}
        <Card>
          <CardHeader>
            <CardTitle className="text-green-600 dark:text-green-400">الإيرادات</CardTitle>
          </CardHeader>
          <CardContent>
            {revenues.length === 0 ? (
              <p className="text-gray-500 text-sm text-center py-4">لا توجد إيرادات في الفترة المحددة</p>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-right py-2 px-3 font-medium text-gray-500">رمز الحساب</th>
                    <th className="text-right py-2 px-3 font-medium text-gray-500">اسم الحساب</th>
                    <th className="text-right py-2 px-3 font-medium text-gray-500">المبلغ</th>
                  </tr>
                </thead>
                <tbody>
                  {revenues.map((row) => (
                    <tr key={row.id} className="border-b border-gray-100 dark:border-gray-800">
                      <td className="py-2 px-3 font-mono">{row.code}</td>
                      <td className="py-2 px-3">{row.name}</td>
                      <td className="py-2 px-3 font-mono text-green-600">{fmt(row.balance)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-gray-300 dark:border-gray-600 font-bold">
                    <td colSpan={2} className="py-3 px-3">إجمالي الإيرادات</td>
                    <td className="py-3 px-3 font-mono text-green-600">{fmt(totals.revenue)}</td>
                  </tr>
                </tfoot>
              </table>
            )}
          </CardContent>
        </Card>

        {/* المصروفات */}
        <Card>
          <CardHeader>
            <CardTitle className="text-red-600 dark:text-red-400">المصروفات</CardTitle>
          </CardHeader>
          <CardContent>
            {expenses.length === 0 ? (
              <p className="text-gray-500 text-sm text-center py-4">لا توجد مصروفات في الفترة المحددة</p>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-right py-2 px-3 font-medium text-gray-500">رمز الحساب</th>
                    <th className="text-right py-2 px-3 font-medium text-gray-500">اسم الحساب</th>
                    <th className="text-right py-2 px-3 font-medium text-gray-500">المبلغ</th>
                  </tr>
                </thead>
                <tbody>
                  {expenses.map((row) => (
                    <tr key={row.id} className="border-b border-gray-100 dark:border-gray-800">
                      <td className="py-2 px-3 font-mono">{row.code}</td>
                      <td className="py-2 px-3">{row.name}</td>
                      <td className="py-2 px-3 font-mono text-red-600">{fmt(row.balance)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-gray-300 dark:border-gray-600 font-bold">
                    <td colSpan={2} className="py-3 px-3">إجمالي المصروفات</td>
                    <td className="py-3 px-3 font-mono text-red-600">{fmt(totals.expenses)}</td>
                  </tr>
                </tfoot>
              </table>
            )}
          </CardContent>
        </Card>

        {/* صافي الربح */}
        <Card className={totals.netIncome >= 0 ? 'border-green-200 dark:border-green-800' : 'border-red-200 dark:border-red-800'}>
          <CardContent className="p-6 text-center">
            <div className="text-lg text-gray-500 mb-2">صافي الربح / الخسارة</div>
            <div className={`text-4xl font-bold ${totals.netIncome >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {fmt(totals.netIncome)}
            </div>
            <div className="text-sm text-gray-400 mt-2">
              {totals.netIncome >= 0 ? 'ربح' : 'خسارة'}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
