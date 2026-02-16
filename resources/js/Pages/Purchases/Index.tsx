/** @jsxImportSource react */
import { Head, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { showToast } from '@/hooks/use-toast';
import {
  ShoppingCart,
  Plus,
  Trash2,
  Edit2,
  Package,
  DollarSign,
  Clock,
  CheckCircle,
} from 'lucide-react';

interface Purchase {
  id: number;
  purchaseNumber: string;
  title: string;
  description: string | null;
  amount: number;
  purchaseDate: string;
  status: string;
  supplierName: string;
  supplierId: number;
  notes: string | null;
}

interface Supplier {
  id: number;
  name: string;
  supplier_number: string;
}

interface Stats {
  totalPurchases: number;
  totalAmount: number;
  pendingPurchases: number;
  completedPurchases: number;
}

interface Props {
  purchases: Purchase[];
  stats: Stats;
  suppliers: Supplier[];
}

const statusLabels: Record<string, string> = {
  pending: 'قيد الانتظار',
  completed: 'مكتمل',
  cancelled: 'ملغي',
};

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  completed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
};

export default function PurchasesIndex({ purchases, stats, suppliers }: Props) {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({
    title: '',
    description: '',
    amount: '',
    purchase_date: new Date().toISOString().split('T')[0],
    status: 'completed',
    supplier_id: '',
    payment_method: 'cash',
    notes: '',
  });

  const resetForm = () => {
    setForm({
      title: '',
      description: '',
      amount: '',
      purchase_date: new Date().toISOString().split('T')[0],
      status: 'completed',
      supplier_id: '',
      payment_method: 'cash',
      notes: '',
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      router.put(`/purchases/${editingId}`, form, {
        preserveScroll: true,
        onSuccess: () => {
          showToast.success('تم تحديث المشتريات بنجاح');
          resetForm();
        },
      });
    } else {
      router.post('/purchases', form, {
        preserveScroll: true,
        onSuccess: () => {
          showToast.success('تم تسجيل المشتريات بنجاح');
          resetForm();
        },
      });
    }
  };

  const handleEdit = (purchase: Purchase) => {
    setForm({
      title: purchase.title,
      description: purchase.description || '',
      amount: String(purchase.amount),
      purchase_date: purchase.purchaseDate,
      status: purchase.status,
      supplier_id: String(purchase.supplierId),
      payment_method: 'cash',
      notes: purchase.notes || '',
    });
    setEditingId(purchase.id);
    setShowForm(true);
  };

  const handleDelete = (id: number) => {
    if (confirm('هل أنت متأكد من حذف هذه المشتريات؟')) {
      router.delete(`/purchases/${id}`, {
        preserveScroll: true,
        onSuccess: () => showToast.success('تم حذف المشتريات بنجاح'),
      });
    }
  };

  return (
    <DashboardLayout>
      <Head title="المشتريات" />
      <div className="p-6 space-y-6" dir="rtl">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
              <ShoppingCart className="h-6 w-6 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">المشتريات</h1>
              <p className="text-sm text-gray-500">إدارة المشتريات من الموردين</p>
            </div>
          </div>
          <Button onClick={() => { resetForm(); setShowForm(!showForm); }} className="gap-2">
            <Plus className="h-4 w-4" />
            تسجيل مشتريات جديدة
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <Package className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-sm text-gray-500">إجمالي المشتريات</p>
                <p className="text-xl font-bold">{stats.totalPurchases}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <DollarSign className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-sm text-gray-500">إجمالي المبالغ</p>
                <p className="text-xl font-bold">{stats.totalAmount.toLocaleString()} ر.ع</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <Clock className="h-8 w-8 text-yellow-500" />
              <div>
                <p className="text-sm text-gray-500">قيد الانتظار</p>
                <p className="text-xl font-bold">{stats.pendingPurchases}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <CheckCircle className="h-8 w-8 text-emerald-500" />
              <div>
                <p className="text-sm text-gray-500">مكتملة</p>
                <p className="text-xl font-bold">{stats.completedPurchases}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Form */}
        {showForm && (
          <Card>
            <CardHeader>
              <CardTitle>{editingId ? 'تعديل المشتريات' : 'تسجيل مشتريات جديدة'}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>العنوان *</Label>
                  <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
                </div>
                <div className="space-y-2">
                  <Label>المورد *</Label>
                  <select
                    value={form.supplier_id}
                    onChange={(e) => setForm({ ...form, supplier_id: e.target.value })}
                    className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm"
                    required
                  >
                    <option value="">-- اختر المورد --</option>
                    {suppliers.map((s) => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>المبلغ *</Label>
                  <Input type="number" step="0.01" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} required />
                </div>
                <div className="space-y-2">
                  <Label>تاريخ الشراء *</Label>
                  <Input type="date" value={form.purchase_date} onChange={(e) => setForm({ ...form, purchase_date: e.target.value })} required />
                </div>
                <div className="space-y-2">
                  <Label>الحالة</Label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                    className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm"
                  >
                    <option value="pending">قيد الانتظار</option>
                    <option value="completed">مكتمل</option>
                    <option value="cancelled">ملغي</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>طريقة الدفع</Label>
                  <select
                    value={form.payment_method}
                    onChange={(e) => setForm({ ...form, payment_method: e.target.value })}
                    className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm"
                  >
                    <option value="cash">نقداً</option>
                    <option value="bank_transfer">تحويل بنكي</option>
                    <option value="check">شيك</option>
                  </select>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>الوصف</Label>
                  <Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>ملاحظات</Label>
                  <Input value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
                </div>
                <div className="md:col-span-2 flex gap-2">
                  <Button type="submit">{editingId ? 'تحديث' : 'حفظ'}</Button>
                  <Button type="button" variant="outline" onClick={resetForm}>إلغاء</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Table */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-4 py-3 text-right font-medium">رقم الفاتورة</th>
                    <th className="px-4 py-3 text-right font-medium">العنوان</th>
                    <th className="px-4 py-3 text-right font-medium">المورد</th>
                    <th className="px-4 py-3 text-right font-medium">المبلغ</th>
                    <th className="px-4 py-3 text-right font-medium">التاريخ</th>
                    <th className="px-4 py-3 text-right font-medium">الحالة</th>
                    <th className="px-4 py-3 text-right font-medium">إجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {purchases.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                        لا توجد مشتريات مسجلة
                      </td>
                    </tr>
                  ) : (
                    purchases.map((purchase) => (
                      <tr key={purchase.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                        <td className="px-4 py-3 font-mono text-xs">{purchase.purchaseNumber}</td>
                        <td className="px-4 py-3">{purchase.title}</td>
                        <td className="px-4 py-3">{purchase.supplierName}</td>
                        <td className="px-4 py-3 font-medium">{purchase.amount.toLocaleString()} ر.ع</td>
                        <td className="px-4 py-3">{purchase.purchaseDate}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[purchase.status] || ''}`}>
                            {statusLabels[purchase.status] || purchase.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-1">
                            <Button size="sm" variant="ghost" onClick={() => handleEdit(purchase)}>
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="ghost" className="text-red-500" onClick={() => handleDelete(purchase.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
