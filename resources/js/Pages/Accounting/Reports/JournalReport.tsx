/** @jsxImportSource react */
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Filter, BookOpen } from 'lucide-react';

interface EntryItem {
  account_code: string;
  account_name: string;
  debit: number;
  credit: number;
  description: string | null;
}

interface JournalReportEntry {
  id: number;
  entry_number: string;
  date: string;
  description: string;
  total_debit: number;
  total_credit: number;
  created_by: string;
  items: EntryItem[];
}

interface Props {
  entries: JournalReportEntry[];
  filters: { date_from?: string; date_to?: string };
  totals: { debit: number; credit: number };
}

export default function JournalReport({ entries, filters, totals }: Props) {
  const [dateFrom, setDateFrom] = useState(filters.date_from || '');
  const [dateTo, setDateTo] = useState(filters.date_to || '');

  const applyFilters = () => {
    router.get('/accounting/reports/journal-report', {
      date_from: dateFrom || undefined,
      date_to: dateTo || undefined,
    }, { preserveState: true });
  };

  const clearFilters = () => {
    setDateFrom('');
    setDateTo('');
    router.get('/accounting/reports/journal-report');
  };

  const fmt = (n: number) => n.toLocaleString('ar-SA', { minimumFractionDigits: 2 });

  return (
    <DashboardLayout>
      <Head title="تقرير اليومية" />
      <div className="space-y-6 mt-2 -mx-1 sm:-mx-2 lg:-mx-3 xl:-mx-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">تقرير اليومية</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">عرض جميع القيود المرحّلة مع تفاصيل البنود</p>
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
              <Button variant="outline" onClick={clearFilters}>مسح</Button>
            </div>
          </CardContent>
        </Card>

        {/* ملخص */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{entries.length}</div>
              <div className="text-sm text-gray-500">عدد القيود</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600 font-mono">{fmt(totals.debit)}</div>
              <div className="text-sm text-gray-500">إجمالي المدين</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600 font-mono">{fmt(totals.credit)}</div>
              <div className="text-sm text-gray-500">إجمالي الدائن</div>
            </CardContent>
          </Card>
        </div>

        {/* القيود */}
        {entries.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center text-gray-500">
              <BookOpen className="h-16 w-16 mx-auto mb-4 opacity-30" />
              <p className="text-lg">لا توجد قيود مرحّلة في الفترة المحددة</p>
            </CardContent>
          </Card>
        ) : (
          entries.map((entry) => (
            <Card key={entry.id}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-3">
                    <span className="font-mono text-[#58d2c8]">{entry.entry_number}</span>
                    <span className="text-gray-400">|</span>
                    <span>{new Date(entry.date).toLocaleDateString('ar-SA')}</span>
                  </CardTitle>
                  <span className="text-sm text-gray-500">بواسطة: {entry.created_by}</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{entry.description}</p>
              </CardHeader>
              <CardContent>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-right py-2 px-3 font-medium text-gray-500">رمز الحساب</th>
                      <th className="text-right py-2 px-3 font-medium text-gray-500">اسم الحساب</th>
                      <th className="text-right py-2 px-3 font-medium text-gray-500">ملاحظة</th>
                      <th className="text-right py-2 px-3 font-medium text-gray-500">مدين</th>
                      <th className="text-right py-2 px-3 font-medium text-gray-500">دائن</th>
                    </tr>
                  </thead>
                  <tbody>
                    {entry.items.map((item, idx) => (
                      <tr key={idx} className="border-b border-gray-100 dark:border-gray-800">
                        <td className="py-2 px-3 font-mono">{item.account_code}</td>
                        <td className="py-2 px-3">{item.account_name}</td>
                        <td className="py-2 px-3 text-gray-500">{item.description || '-'}</td>
                        <td className="py-2 px-3 font-mono">{item.debit > 0 ? fmt(item.debit) : '-'}</td>
                        <td className="py-2 px-3 font-mono">{item.credit > 0 ? fmt(item.credit) : '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t border-gray-300 dark:border-gray-600 font-bold">
                      <td colSpan={3} className="py-2 px-3 text-left">الإجمالي</td>
                      <td className="py-2 px-3 font-mono">{fmt(entry.total_debit)}</td>
                      <td className="py-2 px-3 font-mono">{fmt(entry.total_credit)}</td>
                    </tr>
                  </tfoot>
                </table>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </DashboardLayout>
  );
}
