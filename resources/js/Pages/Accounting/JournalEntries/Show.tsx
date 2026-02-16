/** @jsxImportSource react */
import { Head, router, usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { showToast } from '@/hooks/use-toast';
import { ArrowRight, Edit2, CheckCircle, Trash2, Printer } from 'lucide-react';

interface Account {
  id: number;
  code: string;
  name: string;
}

interface JournalEntryItem {
  id: number;
  account_id: number;
  debit: number;
  credit: number;
  description: string | null;
  account: Account;
}

interface JournalEntry {
  id: number;
  entry_number: string;
  date: string;
  description: string;
  reference_type: string | null;
  reference_id: number | null;
  status: 'draft' | 'posted' | 'cancelled';
  total_debit: number;
  total_credit: number;
  created_by: number;
  creator: { id: number; name: string } | null;
  items: JournalEntryItem[];
  created_at: string;
}

interface Props {
  entry: JournalEntry;
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

const referenceTypeLabels: Record<string, string> = {
  payment: 'دفعة',
  contract: 'عقد',
  salary: 'راتب',
  purchase: 'مشتريات',
  other: 'أخرى',
};

export default function JournalEntryShow({ entry }: Props) {
  const { flash } = usePage().props as any;

  useEffect(() => {
    if (flash?.success) showToast.success('نجح', flash.success);
    if (flash?.error) showToast.error('خطأ', flash.error);
  }, [flash]);

  const handlePost = () => {
    if (confirm('هل أنت متأكد من ترحيل هذا القيد؟ لا يمكن التراجع عن هذا الإجراء.')) {
      router.post(`/accounting/journal-entries/${entry.id}/post`);
    }
  };

  const handleDelete = () => {
    if (confirm('هل أنت متأكد من حذف هذا القيد؟')) {
      router.delete(`/accounting/journal-entries/${entry.id}`);
    }
  };

  return (
    <DashboardLayout>
      <Head title={`قيد ${entry.entry_number}`} />
      <div className="space-y-6 mt-2 -mx-1 sm:-mx-2 lg:-mx-3 xl:-mx-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => router.visit('/accounting/journal-entries')}
              className="p-2"
            >
              <ArrowRight className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                قيد {entry.entry_number}
                <span className={`text-sm px-3 py-1 rounded-full ${statusColors[entry.status]}`}>
                  {statusLabels[entry.status]}
                </span>
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                {entry.description}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {entry.status === 'draft' && (
              <>
                <Button
                  variant="outline"
                  onClick={() => router.visit(`/accounting/journal-entries/${entry.id}/edit`)}
                  className="flex items-center gap-2"
                >
                  <Edit2 className="h-4 w-4" />
                  تعديل
                </Button>
                <Button
                  onClick={handlePost}
                  className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
                >
                  <CheckCircle className="h-4 w-4" />
                  ترحيل
                </Button>
                <Button
                  variant="outline"
                  onClick={handleDelete}
                  className="text-red-600 border-red-300 hover:bg-red-50 flex items-center gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  حذف
                </Button>
              </>
            )}
            <Button
              variant="outline"
              onClick={() => window.print()}
              className="flex items-center gap-2"
            >
              <Printer className="h-4 w-4" />
              طباعة
            </Button>
          </div>
        </div>

        {/* بيانات القيد */}
        <Card>
          <CardHeader>
            <CardTitle>بيانات القيد</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <div className="text-sm text-gray-500 dark:text-gray-400">رقم القيد</div>
                <div className="font-mono font-bold text-lg">{entry.entry_number}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500 dark:text-gray-400">التاريخ</div>
                <div className="font-bold">{new Date(entry.date).toLocaleDateString('ar-SA')}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500 dark:text-gray-400">أنشئ بواسطة</div>
                <div className="font-bold">{entry.creator?.name || '-'}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500 dark:text-gray-400">تاريخ الإنشاء</div>
                <div className="font-bold">
                  {new Date(entry.created_at).toLocaleDateString('ar-SA')}
                </div>
              </div>
              {entry.reference_type && (
                <>
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">نوع المرجع</div>
                    <div className="font-bold">
                      {referenceTypeLabels[entry.reference_type] || entry.reference_type}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">رقم المرجع</div>
                    <div className="font-bold">{entry.reference_id || '-'}</div>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* بنود القيد */}
        <Card>
          <CardHeader>
            <CardTitle>بنود القيد</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-right py-3 px-4 font-medium text-gray-500 w-8">#</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-500">رمز الحساب</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-500">اسم الحساب</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-500">مدين</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-500">دائن</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-500">ملاحظة</th>
                  </tr>
                </thead>
                <tbody>
                  {entry.items.map((item, index) => (
                    <tr
                      key={item.id}
                      className="border-b border-gray-100 dark:border-gray-800"
                    >
                      <td className="py-3 px-4 text-gray-400">{index + 1}</td>
                      <td className="py-3 px-4 font-mono">{item.account.code}</td>
                      <td className="py-3 px-4">{item.account.name}</td>
                      <td className="py-3 px-4 font-mono">
                        {Number(item.debit) > 0
                          ? Number(item.debit).toLocaleString('ar-SA', { minimumFractionDigits: 2 })
                          : '-'}
                      </td>
                      <td className="py-3 px-4 font-mono">
                        {Number(item.credit) > 0
                          ? Number(item.credit).toLocaleString('ar-SA', { minimumFractionDigits: 2 })
                          : '-'}
                      </td>
                      <td className="py-3 px-4 text-gray-500">{item.description || '-'}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-gray-300 dark:border-gray-600 font-bold">
                    <td colSpan={3} className="py-3 px-4">الإجمالي</td>
                    <td className="py-3 px-4 font-mono">
                      {Number(entry.total_debit).toLocaleString('ar-SA', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3 px-4 font-mono">
                      {Number(entry.total_credit).toLocaleString('ar-SA', { minimumFractionDigits: 2 })}
                    </td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
