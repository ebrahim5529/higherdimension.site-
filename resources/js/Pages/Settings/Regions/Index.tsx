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

interface Region {
  id: number;
  name: string;
  wilayat_id: number;
  wilayat?: Wilayat;
}

interface PageProps {
  [key: string]: any;
  governorates: Governorate[];
  wilayats: Wilayat[];
  regions: Region[];
  errors?: Record<string, string>;
  flash?: {
    success?: string;
    error?: string;
  };
}

export default function RegionsIndex() {
  const { governorates, wilayats, regions, errors, flash } = usePage<PageProps>().props;
  const [name, setName] = useState('');
  const [governorateId, setGovernorateId] = useState('');
  const [wilayatId, setWilayatId] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState('');
  const [editingGovernorateId, setEditingGovernorateId] = useState('');
  const [editingWilayatId, setEditingWilayatId] = useState('');

  const sortedRegions = useMemo(
    () => [...(regions || [])].sort((a, b) => a.name.localeCompare(b.name)),
    [regions]
  );

  const filteredWilayats = useMemo(
    () => wilayats?.filter((w) => String(w.governorate_id) === governorateId),
    [wilayats, governorateId]
  );

  const editingFilteredWilayats = useMemo(
    () => wilayats?.filter((w) => String(w.governorate_id) === editingGovernorateId),
    [wilayats, editingGovernorateId]
  );

  useEffect(() => {
    if (flash?.success) showToast.success('تم بنجاح', flash.success);
    if (flash?.error) showToast.error('خطأ', flash.error);
  }, [flash]);

  const resetForm = () => {
    setName('');
    setGovernorateId('');
    setWilayatId('');
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    router.post('/locations/regions', {
      name,
      wilayat_id: Number(wilayatId),
    }, {
      onSuccess: () => resetForm(),
    });
  };

  const startEdit = (region: Region) => {
    setEditingId(region.id);
    setEditingName(region.name);
    setEditingWilayatId(String(region.wilayat_id));
    setEditingGovernorateId(String(region.wilayat?.governorate_id || ''));
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingName('');
    setEditingWilayatId('');
    setEditingGovernorateId('');
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId) return;
    router.put(`/locations/regions/${editingId}`, {
      name: editingName,
      wilayat_id: Number(editingWilayatId),
    }, {
      onSuccess: () => cancelEdit(),
    });
  };

  const handleDelete = (regionId: number) => {
    if (!confirm('هل أنت متأكد من حذف هذه المنطقة؟')) {
      return;
    }
    router.delete(`/locations/regions/${regionId}`);
  };

  return (
    <DashboardLayout>
      <Head title="المناطق" />
      <div className="space-y-6 mt-2 -mx-1 sm:-mx-2 lg:-mx-3 xl:-mx-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">المناطق</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">إدارة المناطق المرتبطة بالولايات</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              إضافة منطقة
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">
                  اسم المنطقة <span className="text-red-500">*</span>
                </label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="مثال: منطقة سمائل"
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
                  onChange={(e) => {
                    setGovernorateId(e.target.value);
                    setWilayatId('');
                  }}
                  className="w-full h-10 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 text-sm"
                >
                  <option value="">اختر المحافظة</option>
                  {governorates?.map((governorate) => (
                    <option key={governorate.id} value={governorate.id}>
                      {governorate.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  الولاية <span className="text-red-500">*</span>
                </label>
                <select
                  value={wilayatId}
                  onChange={(e) => setWilayatId(e.target.value)}
                  className={`w-full h-10 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 text-sm ${
                    errors?.wilayat_id ? 'border-red-500' : ''
                  }`}
                  disabled={!governorateId}
                >
                  <option value="">اختر الولاية</option>
                  {filteredWilayats?.map((wilayat) => (
                    <option key={wilayat.id} value={wilayat.id}>
                      {wilayat.name}
                    </option>
                  ))}
                </select>
                {errors?.wilayat_id && <p className="text-red-500 text-xs mt-1">{errors.wilayat_id}</p>}
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
              قائمة المناطق
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {sortedRegions.length === 0 ? (
              <div className="text-sm text-gray-500">لا توجد مناطق بعد.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="text-gray-500 border-b">
                      <th className="text-right py-2 px-3">المنطقة</th>
                      <th className="text-right py-2 px-3">المحافظة</th>
                      <th className="text-right py-2 px-3">الولاية</th>
                      <th className="text-right py-2 px-3 w-40">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedRegions.map((region) => (
                      <tr key={region.id} className="border-b last:border-0">
                        <td className="py-3 px-3">
                          {editingId === region.id ? (
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
                              {region.name}
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-3">
                          {editingId === region.id ? (
                            <select
                              value={editingGovernorateId}
                              onChange={(e) => {
                                setEditingGovernorateId(e.target.value);
                                setEditingWilayatId('');
                              }}
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
                              {region.wilayat?.governorate?.name || '—'}
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-3">
                          {editingId === region.id ? (
                            <select
                              value={editingWilayatId}
                              onChange={(e) => setEditingWilayatId(e.target.value)}
                              className="h-9 w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-2 text-sm"
                            >
                              {editingFilteredWilayats?.map((wilayat) => (
                                <option key={wilayat.id} value={wilayat.id}>
                                  {wilayat.name}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <span className="text-gray-700 dark:text-gray-300">
                              {region.wilayat?.name || '—'}
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-3">
                          {editingId === region.id ? null : (
                            <div className="flex items-center gap-2">
                              <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                onClick={() => startEdit(region)}
                                className="flex items-center gap-1"
                              >
                                <Pencil className="h-3 w-3" />
                                تعديل
                              </Button>
                              <Button
                                type="button"
                                size="sm"
                                variant="destructive"
                                onClick={() => handleDelete(region.id)}
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

