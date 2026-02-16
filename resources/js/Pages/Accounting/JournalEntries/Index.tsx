/** @jsxImportSource react */
import { Head, router, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { showToast } from '@/hooks/use-toast';
import {
  Plus,
  Search,
  Eye,
  Edit2,
  Trash2,
  CheckCircle,
  FileText,
  Filter,
} from 'lucide-react';

interface JournalEntryItem {
  id: number;
  account_id: number;
  debit: number;
  credit: number;
  description: string | null;
  account: {
    id: number;
    code: string;
    name: string;
  };
}

interface JournalEntry {
  id: number;
  entry_number: string;
  date: string;
  description: string;
  status: 'draft' | 'posted' | 'cancelled';
  total_debit: number;
  total_credit: number;
  creator: { id: number; name: string } | null;
  items: JournalEntryItem[];
}

interface PaginatedData {
  data: JournalEntry[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  links: Array<{ url: string | null; label: string; active: boolean }>;
}

interface Props {
  entries: PaginatedData;
  filters: {
    status?: string;
    date_from?: string;
    date_to?: string;
    search?: string;
  };
}

const statusLabels: Record<string, string> = {
  draft: 'مسودة',
  posted: 'مرحّل',
  cancelled: 'ملغي',
};

const statusColors: Record<string, string> = {
  draft: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
  posted: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
};

export default function JournalEntriesIndex({ entries, filters }: Props) {
  const { flash } = usePage().props as any;
  const [search, setSearch] = useState(filters.search || '');
  const [status, setStatus] = useState(filters.status || '');
  const [dateFrom, setDateFrom] = useState(filters.date_from || '');
  const [dateTo, setDateTo] = useState(filters.date_to || '');

  useEffect(() => {
    if (flash?.success) showToast.success('نجح', flash.success);
    if (flash?.error) showToast.error('خطأ', flash.error);
  }, [flash]);

  const applyFilters = () => {
    router.get(
      '/accounting/journal-entries',
      {
        search: search || undefined,
        status: status || undefined,
        date_from: dateFrom || undefined,
        date_to: dateTo || undefined,
      },
      { preserveState: true }
    );
  };

  const clearFilters = () => {
    setSearch('');
    setStatus('');
    setDateFrom('');
    setDateTo('');
    router.get('/accounting/journal-entries');
  };

  const handleDelete = (id: number) => {
    if (confirm('هل أنت متأكد من حذف هذا القيد؟')) {
      router.delete(`/accounting/journal-entries/${id}`);
    }
  };

  const handlePost = (id: number) => {
    if (confirm('هل أنت متأكد من ترحيل هذا القيد؟ لا يمكن التراجع عن هذا الإجراء.')) {
      router.post(`/accounting/journal-entries/${id}/post`);
    }
  };

  return (
    <DashboardLayout>
      <Head title="القيود المحاسبية" />
      <div className="space-y-6 mt-2 -mx-1 sm:-mx-2 lg:-mx-3 xl:-mx-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              القيود المحاسبية
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              إدارة وعرض جميع القيود المحاسبية
            </p>
          </div>
          <Button
            onClick={() => router.visit('/accounting/journal-entries/create')}
            className="bg-[#58d2c8] hover:bg-[#4AB8B3] text-white flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            إنشاء قيد جديد
          </Button>
        </div>

        {/* إحصائيات */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {entries.total}
              </div>
              <div className="text-sm text-gray-500">إجمالي القيود</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {entries.data.filter((e) => e.status === 'draft').length}
              </div>
              <div className="text-sm text-gray-500">مسودات</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">
                {entries.data.filter((e) => e.status === 'posted').length}
              </div>
              <div className="text-sm text-gray-500">مرحّلة</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-red-600">
                {entries.data.filter((e) => e.status === 'cancelled').length}
              </div>
              <div className="text-sm text-gray-500">ملغاة</div>
            </CardContent>
          </Card>
        </div>

        {/* الفلاتر */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-wrap items-end gap-4">
              <div className="flex-1 min-w-[200px]">
                <label className="text-sm text-gray-600 dark:text-gray-400 mb-1 block">بحث</label>
                <div className="relative">
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="رقم القيد أو الوصف..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pr-9"
                    onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
                  />
                </div>
              </div>
              <div className="min-w-[150px]">
                <label className="text-sm text-gray-600 dark:text-gray-400 mb-1 block">الحالة</label>
                <select
                  className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="">الكل</option>
                  <option value="draft">مسودة</option>
                  <option value="posted">مرحّل</option>
                  <option value="cancelled">ملغي</option>
                </select>
              </div>
              <div className="min-w-[150px]">
                <label className="text-sm text-gray-600 dark:text-gray-400 mb-1 block">من تاريخ</label>
                <Input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                />
              </div>
              <div className="min-w-[150px]">
                <label className="text-sm text-gray-600 dark:text-gray-400 mb-1 block">إلى تاريخ</label>
                <Input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={applyFilters} className="bg-[#58d2c8] hover:bg-[#4AB8B3] text-white">
                  <Filter className="h-4 w-4 ml-1" />
                  تصفية
                </Button>
                <Button variant="outline" onClick={clearFilters}>
                  مسح
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* جدول القيود */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              قائمة القيود
            </CardTitle>
          </CardHeader>
          <CardContent>
            {entries.data.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>لا توجد قيود محاسبية</p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-700">
                        <th className="text-right py-3 px-4 font-medium text-gray-500">رقم القيد</th>
                        <th className="text-right py-3 px-4 font-medium text-gray-500">التاريخ</th>
                        <th className="text-right py-3 px-4 font-medium text-gray-500">الوصف</th>
                        <th className="text-right py-3 px-4 font-medium text-gray-500">المدين</th>
                        <th className="text-right py-3 px-4 font-medium text-gray-500">الدائن</th>
                        <th className="text-right py-3 px-4 font-medium text-gray-500">الحالة</th>
                        <th className="text-right py-3 px-4 font-medium text-gray-500">بواسطة</th>
                        <th className="text-center py-3 px-4 font-medium text-gray-500">إجراءات</th>
                      </tr>
                    </thead>
                    <tbody>
                      {entries.data.map((entry) => (
                        <tr
                          key={entry.id}
                          className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                        >
                          <td className="py-3 px-4 font-mono text-sm">
                            {entry.entry_number}
                          </td>
                          <td className="py-3 px-4">
                            {new Date(entry.date).toLocaleDateString('ar-SA')}
                          </td>
                          <td className="py-3 px-4 max-w-[200px] truncate">
                            {entry.description}
                          </td>
                          <td className="py-3 px-4 font-mono">
                            {Number(entry.total_debit).toLocaleString('ar-SA', {
                              minimumFractionDigits: 2,
                            })}
                          </td>
                          <td className="py-3 px-4 font-mono">
                            {Number(entry.total_credit).toLocaleString('ar-SA', {
                              minimumFractionDigits: 2,
                            })}
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`text-xs px-2 py-1 rounded-full ${
                                statusColors[entry.status]
                              }`}
                            >
                              {statusLabels[entry.status]}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-500">
                            {entry.creator?.name || '-'}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center justify-center gap-1">
                              <button
                                onClick={() =>
                                  router.visit(
                                    `/accounting/journal-entries/${entry.id}`
                                  )
                                }
                                className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                                title="عرض"
                              >
                                <Eye className="h-4 w-4 text-gray-500" />
                              </button>
                              {entry.status === 'draft' && (
                                <>
                                  <button
                                    onClick={() =>
                                      router.visit(
                                        `/accounting/journal-entries/${entry.id}/edit`
                                      )
                                    }
                                    className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                                    title="تعديل"
                                  >
                                    <Edit2 className="h-4 w-4 text-blue-500" />
                                  </button>
                                  <button
                                    onClick={() => handlePost(entry.id)}
                                    className="p-1.5 rounded hover:bg-green-100 dark:hover:bg-green-900/30"
                                    title="ترحيل"
                                  >
                                    <CheckCircle className="h-4 w-4 text-green-500" />
                                  </button>
                                  <button
                                    onClick={() => handleDelete(entry.id)}
                                    className="p-1.5 rounded hover:bg-red-100 dark:hover:bg-red-900/30"
                                    title="حذف"
                                  >
                                    <Trash2 className="h-4 w-4 text-red-500" />
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {entries.last_page > 1 && (
                  <div className="flex justify-center gap-1 mt-6">
                    {entries.links.map((link, i) => (
                      <button
                        key={i}
                        onClick={() => link.url && router.visit(link.url)}
                        disabled={!link.url}
                        className={`px-3 py-1.5 text-sm rounded ${
                          link.active
                            ? 'bg-[#58d2c8] text-white'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                        } ${!link.url ? 'opacity-50 cursor-not-allowed' : ''}`}
                        dangerouslySetInnerHTML={{ __html: link.label }}
                      />
                    ))}
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
