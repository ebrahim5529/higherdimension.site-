/** @jsxImportSource react */
import { Head, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { showToast } from '@/hooks/use-toast';
import { Plus, Trash2, Save, ArrowRight } from 'lucide-react';

interface AccountOption {
  id: number;
  code: string;
  name: string;
  type: string;
}

interface ExistingItem {
  id: number;
  account_id: number;
  debit: number;
  credit: number;
  description: string | null;
  account: AccountOption;
}

interface JournalEntry {
  id: number;
  entry_number: string;
  date: string;
  description: string;
  reference_type: string | null;
  reference_id: number | null;
  status: string;
  items: ExistingItem[];
}

interface ItemRow {
  account_id: string;
  debit: string;
  credit: string;
  description: string;
}

interface Props {
  entry: JournalEntry;
  accounts: AccountOption[];
}

export default function JournalEntryEdit({ entry, accounts }: Props) {
  const { errors } = usePage().props as any;
  const [date, setDate] = useState(entry.date.split('T')[0]);
  const [description, setDescription] = useState(entry.description);
  const [referenceType, setReferenceType] = useState(entry.reference_type || '');
  const [referenceId, setReferenceId] = useState(entry.reference_id ? String(entry.reference_id) : '');
  const [items, setItems] = useState<ItemRow[]>(
    entry.items.map((item) => ({
      account_id: String(item.account_id),
      debit: String(item.debit),
      credit: String(item.credit),
      description: item.description || '',
    }))
  );

  const addRow = () => {
    setItems([...items, { account_id: '', debit: '', credit: '', description: '' }]);
  };

  const removeRow = (index: number) => {
    if (items.length <= 2) return;
    setItems(items.filter((_, i) => i !== index));
  };

  const updateRow = (index: number, field: keyof ItemRow, value: string) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: value };

    if (field === 'debit' && parseFloat(value) > 0) {
      updated[index].credit = '0';
    } else if (field === 'credit' && parseFloat(value) > 0) {
      updated[index].debit = '0';
    }

    setItems(updated);
  };

  const totalDebit = items.reduce((sum, item) => sum + (parseFloat(item.debit) || 0), 0);
  const totalCredit = items.reduce((sum, item) => sum + (parseFloat(item.credit) || 0), 0);
  const isBalanced = Math.abs(totalDebit - totalCredit) < 0.01;
  const difference = totalDebit - totalCredit;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!isBalanced) {
      showToast.error('خطأ', 'إجمالي المدين يجب أن يساوي إجمالي الدائن');
      return;
    }

    const formattedItems = items
      .filter((item) => item.account_id)
      .map((item) => ({
        account_id: Number(item.account_id),
        debit: parseFloat(item.debit) || 0,
        credit: parseFloat(item.credit) || 0,
        description: item.description || null,
      }));

    if (formattedItems.length < 2) {
      showToast.error('خطأ', 'يجب إضافة بندين على الأقل');
      return;
    }

    router.put(`/accounting/journal-entries/${entry.id}`, {
      date,
      description,
      reference_type: referenceType || null,
      reference_id: referenceId ? Number(referenceId) : null,
      items: formattedItems,
    });
  };

  return (
    <DashboardLayout>
      <Head title={`تعديل قيد ${entry.entry_number}`} />
      <div className="space-y-6 mt-2 -mx-1 sm:-mx-2 lg:-mx-3 xl:-mx-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => router.visit(`/accounting/journal-entries/${entry.id}`)}
            className="p-2"
          >
            <ArrowRight className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              تعديل قيد {entry.entry_number}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              تعديل بيانات وبنود القيد المحاسبي
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>بيانات القيد</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label>التاريخ *</Label>
                  <Input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <Label>الوصف *</Label>
                  <Input
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="وصف القيد المحاسبي"
                    required
                  />
                </div>
                <div>
                  <Label>نوع المرجع</Label>
                  <select
                    className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm"
                    value={referenceType}
                    onChange={(e) => setReferenceType(e.target.value)}
                  >
                    <option value="">بدون مرجع</option>
                    <option value="payment">دفعة</option>
                    <option value="contract">عقد</option>
                    <option value="salary">راتب</option>
                    <option value="purchase">مشتريات</option>
                    <option value="other">أخرى</option>
                  </select>
                </div>
                {referenceType && (
                  <div>
                    <Label>رقم المرجع</Label>
                    <Input
                      value={referenceId}
                      onChange={(e) => setReferenceId(e.target.value)}
                      placeholder="رقم المرجع"
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>بنود القيد</CardTitle>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addRow}
                  className="flex items-center gap-1"
                >
                  <Plus className="h-4 w-4" />
                  إضافة بند
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {errors?.items && (
                <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm">
                  {errors.items}
                </div>
              )}

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-right py-3 px-2 font-medium text-gray-500 w-8">#</th>
                      <th className="text-right py-3 px-2 font-medium text-gray-500 min-w-[250px]">الحساب</th>
                      <th className="text-right py-3 px-2 font-medium text-gray-500 w-[150px]">مدين</th>
                      <th className="text-right py-3 px-2 font-medium text-gray-500 w-[150px]">دائن</th>
                      <th className="text-right py-3 px-2 font-medium text-gray-500 min-w-[200px]">ملاحظة</th>
                      <th className="w-10"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item, index) => (
                      <tr key={index} className="border-b border-gray-100 dark:border-gray-800">
                        <td className="py-2 px-2 text-gray-400">{index + 1}</td>
                        <td className="py-2 px-2">
                          <select
                            className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-2 py-1.5 text-sm"
                            value={item.account_id}
                            onChange={(e) => updateRow(index, 'account_id', e.target.value)}
                            required
                          >
                            <option value="">اختر الحساب</option>
                            {accounts.map((acc) => (
                              <option key={acc.id} value={acc.id}>
                                {acc.code} - {acc.name}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="py-2 px-2">
                          <Input
                            type="number"
                            step="0.01"
                            min="0"
                            value={item.debit}
                            onChange={(e) => updateRow(index, 'debit', e.target.value)}
                            placeholder="0.00"
                            className="text-left font-mono"
                          />
                        </td>
                        <td className="py-2 px-2">
                          <Input
                            type="number"
                            step="0.01"
                            min="0"
                            value={item.credit}
                            onChange={(e) => updateRow(index, 'credit', e.target.value)}
                            placeholder="0.00"
                            className="text-left font-mono"
                          />
                        </td>
                        <td className="py-2 px-2">
                          <Input
                            value={item.description}
                            onChange={(e) => updateRow(index, 'description', e.target.value)}
                            placeholder="ملاحظة اختيارية"
                          />
                        </td>
                        <td className="py-2 px-2">
                          {items.length > 2 && (
                            <button
                              type="button"
                              onClick={() => removeRow(index)}
                              className="p-1 rounded hover:bg-red-100 dark:hover:bg-red-900/30"
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t-2 border-gray-300 dark:border-gray-600 font-bold">
                      <td colSpan={2} className="py-3 px-2 text-left">الإجمالي</td>
                      <td className="py-3 px-2 font-mono text-left">
                        {totalDebit.toLocaleString('ar-SA', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-3 px-2 font-mono text-left">
                        {totalCredit.toLocaleString('ar-SA', { minimumFractionDigits: 2 })}
                      </td>
                      <td colSpan={2} className="py-3 px-2">
                        {!isBalanced && totalDebit > 0 && (
                          <span className="text-red-500 text-sm font-normal">
                            الفرق: {Math.abs(difference).toLocaleString('ar-SA', { minimumFractionDigits: 2 })}
                            {difference > 0 ? ' (مدين أكثر)' : ' (دائن أكثر)'}
                          </span>
                        )}
                        {isBalanced && totalDebit > 0 && (
                          <span className="text-green-500 text-sm font-normal">متوازن ✓</span>
                        )}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-3 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.visit(`/accounting/journal-entries/${entry.id}`)}
            >
              إلغاء
            </Button>
            <Button
              type="submit"
              className="bg-[#58d2c8] hover:bg-[#4AB8B3] text-white flex items-center gap-2"
              disabled={!isBalanced || totalDebit === 0}
            >
              <Save className="h-4 w-4" />
              حفظ التعديلات
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
