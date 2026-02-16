/** @jsxImportSource react */
import { Head, router, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { showToast } from '@/hooks/use-toast';
import {
  ChevronDown,
  ChevronLeft,
  Plus,
  Edit2,
  Trash2,
  FolderTree,
  Search,
} from 'lucide-react';

interface Account {
  id: number;
  code: string;
  name: string;
  parent_id: number | null;
  type: string;
  is_active: boolean;
  description: string | null;
  level: number;
  is_parent: boolean;
  children_recursive?: Account[];
}

interface Props {
  accounts: Account[];
  flatAccounts: Account[];
}

const typeLabels: Record<string, string> = {
  asset: 'أصول',
  liability: 'التزامات',
  equity: 'حقوق ملكية',
  revenue: 'إيرادات',
  expense: 'مصروفات',
};

const typeColors: Record<string, string> = {
  asset: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  liability: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
  equity: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
  revenue: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  expense: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
};

function AccountTreeNode({
  account,
  onEdit,
  onDelete,
  searchTerm,
}: {
  account: Account;
  onEdit: (account: Account) => void;
  onDelete: (id: number) => void;
  searchTerm: string;
}) {
  const [isExpanded, setIsExpanded] = useState(true);
  const hasChildren = account.children_recursive && account.children_recursive.length > 0;

  const matchesSearch =
    !searchTerm ||
    account.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    account.code.includes(searchTerm);

  const childMatchesSearch = (acc: Account): boolean => {
    if (
      acc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      acc.code.includes(searchTerm)
    )
      return true;
    return (acc.children_recursive || []).some(childMatchesSearch);
  };

  if (searchTerm && !matchesSearch && !childMatchesSearch(account)) {
    return null;
  }

  return (
    <div>
      <div
        className={`flex items-center gap-2 py-2 px-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group ${
          !account.is_active ? 'opacity-50' : ''
        }`}
        style={{ paddingRight: `${account.level * 24 + 12}px` }}
      >
        {hasChildren ? (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-0.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            {isExpanded ? (
              <ChevronDown className="h-4 w-4 text-gray-500" />
            ) : (
              <ChevronLeft className="h-4 w-4 text-gray-500" />
            )}
          </button>
        ) : (
          <span className="w-5" />
        )}

        <span className="font-mono text-sm text-gray-500 dark:text-gray-400 min-w-[60px]">
          {account.code}
        </span>

        <span
          className={`flex-1 text-sm ${
            account.is_parent
              ? 'font-bold text-gray-900 dark:text-white'
              : 'text-gray-700 dark:text-gray-300'
          }`}
        >
          {account.name}
        </span>

        <span
          className={`text-xs px-2 py-0.5 rounded-full ${typeColors[account.type]}`}
        >
          {typeLabels[account.type]}
        </span>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(account)}
            className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            <Edit2 className="h-3.5 w-3.5 text-gray-500" />
          </button>
          {!account.is_parent && (
            <button
              onClick={() => onDelete(account.id)}
              className="p-1 rounded hover:bg-red-100 dark:hover:bg-red-900/30"
            >
              <Trash2 className="h-3.5 w-3.5 text-red-500" />
            </button>
          )}
        </div>
      </div>

      {hasChildren && isExpanded && (
        <div>
          {account.children_recursive!.map((child) => (
            <AccountTreeNode
              key={child.id}
              account={child}
              onEdit={onEdit}
              onDelete={onDelete}
              searchTerm={searchTerm}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function ChartOfAccountsIndex({ accounts, flatAccounts }: Props) {
  const { flash } = usePage().props as any;
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    parent_id: '',
    type: 'asset',
    description: '',
    is_parent: false,
  });

  useEffect(() => {
    if (flash?.success) showToast.success('نجح', flash.success);
    if (flash?.error) showToast.error('خطأ', flash.error);
  }, [flash]);

  const resetForm = () => {
    setFormData({
      code: '',
      name: '',
      parent_id: '',
      type: 'asset',
      description: '',
      is_parent: false,
    });
    setEditingAccount(null);
    setShowForm(false);
  };

  const handleEdit = (account: Account) => {
    setEditingAccount(account);
    setFormData({
      code: account.code,
      name: account.name,
      parent_id: account.parent_id ? String(account.parent_id) : '',
      type: account.type,
      description: account.description || '',
      is_parent: account.is_parent,
    });
    setShowForm(true);
  };

  const handleDelete = (id: number) => {
    if (confirm('هل أنت متأكد من حذف هذا الحساب؟')) {
      router.delete(`/accounting/chart-of-accounts/${id}`);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      ...formData,
      parent_id: formData.parent_id ? Number(formData.parent_id) : null,
    };

    if (editingAccount) {
      router.put(`/accounting/chart-of-accounts/${editingAccount.id}`, data, {
        onSuccess: () => resetForm(),
      });
    } else {
      router.post('/accounting/chart-of-accounts', data, {
        onSuccess: () => resetForm(),
      });
    }
  };

  const parentAccounts = flatAccounts.filter((a) => a.is_parent || a.children_recursive?.length);

  return (
    <DashboardLayout>
      <Head title="شجرة الحسابات" />
      <div className="space-y-6 mt-2 -mx-1 sm:-mx-2 lg:-mx-3 xl:-mx-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              شجرة الحسابات
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              إدارة الحسابات المحاسبية وتنظيمها بشكل هرمي
            </p>
          </div>
          <Button
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            className="bg-[#58d2c8] hover:bg-[#4AB8B3] text-white flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            إضافة حساب
          </Button>
        </div>

        {/* إحصائيات */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {Object.entries(typeLabels).map(([type, label]) => {
            const count = flatAccounts.filter((a) => a.type === type).length;
            return (
              <Card key={type}>
                <CardContent className="p-4 text-center">
                  <div className={`text-2xl font-bold ${typeColors[type].split(' ')[1]}`}>
                    {count}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {label}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* نموذج الإضافة/التعديل */}
        {showForm && (
          <Card>
            <CardHeader>
              <CardTitle>
                {editingAccount ? 'تعديل حساب' : 'إضافة حساب جديد'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label>رمز الحساب</Label>
                  <Input
                    value={formData.code}
                    onChange={(e) =>
                      setFormData({ ...formData, code: e.target.value })
                    }
                    placeholder="مثال: 1110"
                    required
                    disabled={!!editingAccount}
                  />
                </div>
                <div>
                  <Label>اسم الحساب</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="اسم الحساب"
                    required
                  />
                </div>
                <div>
                  <Label>الحساب الأب</Label>
                  <select
                    className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm"
                    value={formData.parent_id}
                    onChange={(e) => {
                      const parentId = e.target.value;
                      const parent = flatAccounts.find(
                        (a) => a.id === Number(parentId)
                      );
                      setFormData({
                        ...formData,
                        parent_id: parentId,
                        type: parent ? parent.type : formData.type,
                      });
                    }}
                    disabled={!!editingAccount}
                  >
                    <option value="">بدون (حساب رئيسي)</option>
                    {flatAccounts
                      .filter((a) => a.is_parent)
                      .map((a) => (
                        <option key={a.id} value={a.id}>
                          {a.code} - {a.name}
                        </option>
                      ))}
                  </select>
                </div>
                {!formData.parent_id && (
                  <div>
                    <Label>نوع الحساب</Label>
                    <select
                      className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm"
                      value={formData.type}
                      onChange={(e) =>
                        setFormData({ ...formData, type: e.target.value })
                      }
                      disabled={!!editingAccount}
                    >
                      {Object.entries(typeLabels).map(([value, label]) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
                <div>
                  <Label>الوصف</Label>
                  <Input
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="وصف اختياري"
                  />
                </div>
                <div className="flex items-end gap-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.is_parent}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          is_parent: e.target.checked,
                        })
                      }
                      className="rounded border-gray-300"
                    />
                    <span className="text-sm">حساب رئيسي (تجميعي)</span>
                  </label>
                </div>
                <div className="md:col-span-3 flex gap-2 justify-end">
                  <Button type="button" variant="outline" onClick={resetForm}>
                    إلغاء
                  </Button>
                  <Button
                    type="submit"
                    className="bg-[#58d2c8] hover:bg-[#4AB8B3] text-white"
                  >
                    {editingAccount ? 'تحديث' : 'إضافة'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* شجرة الحسابات */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <FolderTree className="h-5 w-5" />
                شجرة الحسابات
              </CardTitle>
              <div className="relative w-64">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="بحث بالاسم أو الرمز..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-9"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {accounts.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <FolderTree className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>لا توجد حسابات بعد. قم بإضافة حسابات أو تشغيل Seeder.</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100 dark:divide-gray-800">
                {accounts.map((account) => (
                  <AccountTreeNode
                    key={account.id}
                    account={account}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    searchTerm={searchTerm}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
