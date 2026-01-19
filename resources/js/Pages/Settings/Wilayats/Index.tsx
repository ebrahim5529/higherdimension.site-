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

interface Wilayat {
  id: number;
  name: string;
  governorate_id: number;
  governorate?: Governorate;
}

interface PageProps {
  [key: string]: any;
  governorates: Governorate[];
  wilayats: Wilayat[];
  errors?: Record<string, string>;
  flash?: {
    success?: string;
    error?: string;
  };
}

export default function WilayatsIndex() {
  const { governorates, wilayats, errors, flash } = usePage<PageProps>().props;
  const [name, setName] = useState('');
  const [governorateId, setGovernorateId] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState('');
  const [editingGovernorateId, setEditingGovernorateId] = useState('');

  const sortedWilayats = useMemo(
    () => [...(wilayats || [])].sort((a, b) => a.name.localeCompare(b.name)),
    [wilayats]
  );

  useEffect(() => {
    if (flash?.success) showToast.success('تم بنجاح', flash.success);
    if (flash?.error) showToast.error('خطأ', flash.error);
  }, [flash]);

  const resetForm = () => {
    setName('');
    setGovernorateId('');
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    router.post('/locations/wilayats', {
      name,
      governorate_id: Number(governorateId),
    }, {
      onSuccess: () => resetForm(),
    });
  };

  const startEdit = (wilayat: Wilayat) => {
    setEditingId(wilayat.id);
    setEditingName(wilayat.name);
    setEditingGovernorateId(String(wilayat.governorate_id));
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingName('');
    setEditingGovernorateId('');
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId) return;
    router.put(`/locations/wilayats/${editingId}`, {
      name: editingName,
      governorate_id: Number(editingGovernorateId),
    }, {
      onSuccess: () => cancelEdit(),
    });
  };

  const handleDelete = (wilayatId: number) => {
    if (!confirm('هل أنت متأكد من حذف هذه الولاية؟ سيتم حذف المناطق التابعة لها.')) {
      return;
    }
    router.delete(`/locations/wilayats/${wilayatId}`);
  };

  return (
    <DashboardLayout>
      <Head title="الولايات" />
      <div className="space-y-6 mt-2 -mx-1 sm:-mx-2 lg:-mx-3 xl:-mx-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">الولايات</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">إدارة الولايات المرتبطة بالمحافظات</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              إضافة ولاية
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">
                  اسم الولاية <span className="text-red-500">*</span>
                </label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="مثال: ولاية سمائل"
                  className={errors?.name ? 'border-red-500' : ''}
                />
                {errors?.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  المحافظة <span className="text-red-500">*</span>
                </label>
                <select
                  value={governorateId}
                  onChange={(e) => setGovernorateId(e.target.value)}
                  className={`w-full h-10 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 text-sm ${
                    errors?.governorate_id ? 'border-red-500' : ''
                  }`}
                >
                  <option value="">اختر المحافظة</option>
                  {governorates?.map((governorate) => (
                    <option key={governorate.id} value={governorate.id}>
                      {governorate.name}
                    </option>
                  ))}
                </select>
                {errors?.governorate_id && (
                  <p className="text-red-500 text-xs mt-1">{errors.governorate_id}</p>
                )}
              </div>
              <div className="md:col-span-3">
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
              قائمة الولايات
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {sortedWilayats.length === 0 ? (
              <div className="text-sm text-gray-500">لا توجد ولايات بعد.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="text-gray-500 border-b">
                      <th className="text-right py-2 px-3">الولاية</th>
                      <th className="text-right py-2 px-3">المحافظة</th>
                      <th className="text-right py-2 px-3 w-40">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedWilayats.map((wilayat) => (
                      <tr key={wilayat.id} className="border-b last:border-0">
                        <td className="py-3 px-3">
                          {editingId === wilayat.id ? (
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
                              {wilayat.name}
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-3">
                          {editingId === wilayat.id ? (
                            <select
                              value={editingGovernorateId}
                              onChange={(e) => setEditingGovernorateId(e.target.value)}
                              className="h-9 w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-2 text-sm"
                            >
                              {governorates?.map((governorate) => (
                                <option key={governorate.id} value={governorate.id}>
                                  {governorate.name}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <span className="text-gray-700 dark:text-gray-300">
                              {wilayat.governorate?.name || '—'}
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-3">
                          {editingId === wilayat.id ? null : (
                            <div className="flex items-center gap-2">
                              <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                onClick={() => startEdit(wilayat)}
                                className="flex items-center gap-1"
                              >
                                <Pencil className="h-3 w-3" />
                                تعديل
                              </Button>
                              <Button
                                type="button"
                                size="sm"
                                variant="destructive"
                                onClick={() => handleDelete(wilayat.id)}
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

