/** @jsxImportSource react */
import { useEffect, useMemo, useState } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { showToast } from '@/hooks/use-toast';
import { MapPin, Pencil, Plus, Trash2, X } from 'lucide-react';

interface Governorate {
  id: number;
  name: string;
}

interface PageProps {
  [key: string]: any;
  governorates: Governorate[];
  errors?: Record<string, string>;
  flash?: {
    success?: string;
    error?: string;
  };
}

export default function GovernoratesIndex() {
  const { governorates, errors, flash } = usePage<PageProps>().props;
  const [name, setName] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState('');

  const sortedGovernorates = useMemo(
    () => [...(governorates || [])].sort((a, b) => a.name.localeCompare(b.name)),
    [governorates]
  );

  useEffect(() => {
    if (flash?.success) showToast.success('تم بنجاح', flash.success);
    if (flash?.error) showToast.error('خطأ', flash.error);
  }, [flash]);

  const resetForm = () => {
    setName('');
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    router.post('/locations/governorates', { name }, {
      onSuccess: () => resetForm(),
    });
  };

  const startEdit = (governorate: Governorate) => {
    setEditingId(governorate.id);
    setEditingName(governorate.name);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingName('');
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId) return;
    router.put(`/locations/governorates/${editingId}`, { name: editingName }, {
      onSuccess: () => cancelEdit(),
    });
  };

  const handleDelete = (governorateId: number) => {
    if (!confirm('هل أنت متأكد من حذف هذه المحافظة؟ سيتم حذف الولايات والمناطق التابعة لها.')) {
      return;
    }
    router.delete(`/locations/governorates/${governorateId}`);
  };

  return (
    <DashboardLayout>
      <Head title="المحافظات" />
      <div className="space-y-6 mt-2 -mx-1 sm:-mx-2 lg:-mx-3 xl:-mx-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">المحافظات</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">إدارة محافظات سلطنة عمان</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              إضافة محافظة
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreate} className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1">
                  اسم المحافظة <span className="text-red-500">*</span>
                </label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="مثال: محافظة الداخلية"
                  className={errors?.name ? 'border-red-500' : ''}
                />
                {errors?.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>
              <div className="flex items-end">
                <Button type="submit" className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  إضافة
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              قائمة المحافظات
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {sortedGovernorates.length === 0 ? (
              <div className="text-sm text-gray-500">لا توجد محافظات بعد.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="text-gray-500 border-b">
                      <th className="text-right py-2 px-3">المحافظة</th>
                      <th className="text-right py-2 px-3 w-40">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedGovernorates.map((governorate) => (
                      <tr key={governorate.id} className="border-b last:border-0">
                        <td className="py-3 px-3">
                          {editingId === governorate.id ? (
                            <form onSubmit={handleUpdate} className="flex items-center gap-2">
                              <Input
                                value={editingName}
                                onChange={(e) => setEditingName(e.target.value)}
                                className="h-9"
                              />
                              <Button type="submit" size="sm">حفظ</Button>
                              <Button type="button" variant="ghost" size="sm" onClick={cancelEdit}>
                                <X className="h-4 w-4" />
                              </Button>
                            </form>
                          ) : (
                            <span className="font-medium text-gray-900 dark:text-gray-100">
                              {governorate.name}
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-3">
                          {editingId === governorate.id ? null : (
                            <div className="flex items-center gap-2">
                              <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                onClick={() => startEdit(governorate)}
                                className="flex items-center gap-1"
                              >
                                <Pencil className="h-3 w-3" />
                                تعديل
                              </Button>
                              <Button
                                type="button"
                                size="sm"
                                variant="destructive"
                                onClick={() => handleDelete(governorate.id)}
                                className="flex items-center gap-1"
                              >
                                <Trash2 className="h-3 w-3" />
                                حذف
                              </Button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

