/** @jsxImportSource react */
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Filter, FileText } from 'lucide-react';

interface AccountRow {
  id: number;
  code: string;
  name: string;
  type: string;
  balance: number;
}

interface Props {
  assets: AccountRow[];
  liabilities: AccountRow[];
  equity: AccountRow[];
  totals: { assets: number; liabilities: number; equity: number };
  filters: { date_to?: string };
}

export default function BalanceSheet({ assets, liabilities, equity, totals, filters }: Props) {
  const [dateTo, setDateTo] = useState(filters.date_to || '');

  const applyFilters = () => {
    router.get('/accounting/reports/balance-sheet', {
      date_to: dateTo || undefined,
    }, { preserveState: true });
  };

  const fmt = (n: number) => n.toLocaleString('ar-SA', { minimumFractionDigits: 2 });

  const renderSection = (title: string, items: AccountRow[], total: number, color: string) => (
    <Card>
      <CardHeader>
        <CardTitle className={`text-lg ${color}`}>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <p className="text-gray-500 text-sm text-center py-4">لا توجد بيانات</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-right py-2 px-3 font-medium text-gray-500">رمز الحساب</th>
                <th className="text-right py-2 px-3 font-medium text-gray-500">اسم الحساب</th>
                <th className="text-right py-2 px-3 font-medium text-gray-500">الرصيد</th>
              </tr>
            </thead>
            <tbody>
              {items.map((row) => (
                <tr key={row.id} className="border-b border-gray-100 dark:border-gray-800">
                  <td className="py-2 px-3 font-mono">{row.code}</td>
                  <td className="py-2 px-3">{row.name}</td>
                  <td className="py-2 px-3 font-mono">{fmt(row.balance)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-gray-300 dark:border-gray-600 font-bold">
                <td colSpan={2} className="py-3 px-3">الإجمالي</td>
                <td className="py-3 px-3 font-mono">{fmt(total)}</td>
              </tr>
            </tfoot>
          </table>
        )}
      </CardContent>
    </Card>
  );

  return (
    <DashboardLayout>
      <Head title="الميزانية العمومية" />
      <div className="space-y-6 mt-2 -mx-1 sm:-mx-2 lg:-mx-3 xl:-mx-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">الميزانية العمومية</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">عرض المركز المالي للمنشأة</p>
        </div>

        <Card>
          <CardContent className="p-4">
            <div className="flex flex-wrap items-end gap-4">
              <div className="min-w-[180px]">
                <label className="text-sm text-gray-600 dark:text-gray-400 mb-1 block">حتى تاريخ</label>
                <Input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
              </div>
              <Button onClick={applyFilters} className="bg-[#58d2c8] hover:bg-[#4AB8B3] text-white">
                <Filter className="h-4 w-4 ml-1" />
                تصفية
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            {renderSection('الأصول', assets, totals.assets, 'text-blue-600 dark:text-blue-400')}
          </div>
          <div className="space-y-6">
            {renderSection('الالتزامات', liabilities, totals.liabilities, 'text-red-600 dark:text-red-400')}
            {renderSection('حقوق الملكية', equity, totals.equity, 'text-purple-600 dark:text-purple-400')}
          </div>
        </div>

        {/* ملخص التوازن */}
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-sm text-gray-500 mb-1">إجمالي الأصول</div>
                <div className="text-2xl font-bold text-blue-600">{fmt(totals.assets)}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-1">= الالتزامات + حقوق الملكية</div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {fmt(totals.liabilities + totals.equity)}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-1">الفرق</div>
                <div className={`text-2xl font-bold ${Math.abs(totals.assets - totals.liabilities - totals.equity) < 0.01 ? 'text-green-600' : 'text-red-600'}`}>
                  {fmt(totals.assets - totals.liabilities - totals.equity)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
