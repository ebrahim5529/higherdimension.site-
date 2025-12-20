/** @jsxImportSource react */
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { useEffect, useState, useMemo } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { showToast } from '@/hooks/use-toast';
import { Shield, Plus, Edit, Trash2, Key, Users } from 'lucide-react';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';

interface Permission {
  id: number;
  name: string;
}

interface Role {
  id: number;
  name: string;
  guard_name: string;
  permissions_count: number;
  users_count: number;
  permissions: Permission[];
  created_at: string;
}

interface RolesIndexProps {
  roles: Role[];
  allPermissions: Permission[];
  stats: {
    totalRoles: number;
    totalPermissions: number;
    totalUsers: number;
  };
}

export default function RolesIndex({ roles, allPermissions, stats }: RolesIndexProps) {
  const { flash } = usePage().props as any;
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  const createForm = useForm({
    name: '',
    permissions: [] as number[],
  });

  const updateForm = useForm({
    name: '',
    permissions: [] as number[],
  });

  useEffect(() => {
    if (flash?.success) {
      showToast.success('نجح', flash.success);
      setCreateDialogOpen(false);
      setEditDialogOpen(false);
      createForm.reset();
      updateForm.reset();
    }
    if (flash?.error) {
      showToast.error('خطأ', flash.error);
    }
  }, [flash]);

  const handleCreate = () => {
    createForm.post('/roles', {
      onSuccess: () => {
        createForm.reset();
      },
    });
  };

  const handleEdit = (role: Role) => {
    setSelectedRole(role);
    updateForm.setData({
      name: role.name,
      permissions: role.permissions.map((p) => p.id),
    });
    setEditDialogOpen(true);
  };

  const handleUpdate = () => {
    if (!selectedRole) return;
    updateForm.put(`/roles/${selectedRole.id}`, {
      onSuccess: () => {
        setEditDialogOpen(false);
        setSelectedRole(null);
        updateForm.reset();
      },
    });
  };

  const handleDelete = (role: Role) => {
    setSelectedRole(role);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (!selectedRole) return;
    router.delete(`/roles/${selectedRole.id}`, {
      onSuccess: () => {
        showToast.success('تم الحذف بنجاح', `تم حذف الدور "${selectedRole.name}" بنجاح`);
        setDeleteDialogOpen(false);
        setSelectedRole(null);
      },
      onError: (errors) => {
        showToast.error('فشل الحذف', errors?.message || 'حدث خطأ أثناء حذف الدور');
      },
    });
  };

  const togglePermission = (permissionId: number, form: typeof createForm | typeof updateForm) => {
    const currentPermissions = form.data.permissions || [];
    if (currentPermissions.includes(permissionId)) {
      form.setData('permissions', currentPermissions.filter((id) => id !== permissionId));
    } else {
      form.setData('permissions', [...currentPermissions, permissionId]);
    }
  };

  // خريطة ترجمة الصلاحيات
  const permissionTranslations: Record<string, string> = {
    'access-main-dashboard': 'الوصول إلى الرئيسية',
    'access-dashboard-reports': 'الوصول إلى لوحة التحكم والتقارير',
    'access-dashboard-interactive': 'لوحة التحكم التفاعلية',
    'access-financial-reports': 'التقارير المالية',
    'access-operations-reports': 'تقارير التشغيل والمخزون',
    'access-customer-reports': 'تقارير العملاء',
    'access-customers': 'الوصول إلى إدارة العملاء',
    'manage-customers': 'إدارة بيانات العملاء',
    'view-customer-contracts': 'عرض عقود العملاء',
    'manage-customer-claims': 'إدارة مطالبات العملاء',
    'access-suppliers': 'الوصول إلى إدارة الموردين',
    'manage-suppliers': 'إدارة بيانات الموردين',
    'view-supplier-invoices': 'عرض فواتير الموردين',
    'manage-supplier-purchases': 'إدارة مشتريات الموردين',
    'access-inventory': 'الوصول إلى إدارة المخزون',
    'manage-inventory': 'إدارة المخزون',
    'purchase-equipment': 'شراء معدات جديدة',
    'manage-purchases': 'إدارة المشتريات',
    'access-contracts': 'الوصول إلى إدارة العقود',
    'manage-contracts': 'إدارة العقود والاتفاقيات',
    'view-active-contracts': 'عرض العقود النشطة',
    'view-expired-contracts': 'عرض العقود المنتهية',
    'view-cancelled-contracts': 'عرض العقود الملغاة',
    'access-operations': 'الوصول إلى إدارة التشغيل',
    'manage-delivery-orders': 'إدارة طلبات التوصيل',
    'track-shipping': 'تتبع الشحن',
    'manage-delivery-receipt': 'إدارة إيصالات التسليم',
    'manage-return-inspection': 'إدارة فحص الاسترجاع',
    'access-financial': 'الوصول إلى إدارة المالية',
    'manage-payment-transactions': 'إدارة المعاملات المالية',
    'manage-invoices': 'إدارة الفواتير',
    'view-financial-reports': 'عرض التقارير المالية',
    'access-employees': 'الوصول إلى إدارة الموظفين',
    'manage-employees': 'إدارة بيانات الموظفين',
    'manage-salaries': 'إدارة الرواتب',
    'manage-incentives': 'إدارة الحوافز',
    'manage-attendance': 'إدارة الحضور والانصراف',
    'manage-departments': 'إدارة الأقسام',
    'manage-leaves': 'إدارة الإجازات',
    'access-permissions': 'الوصول إلى إدارة الصلاحيات',
    'manage-user-roles': 'إدارة أدوار المستخدمين',
    'manage-permission-groups': 'إدارة مجموعات الصلاحيات',
    'manage-roles': 'إدارة الأدوار',
    'access-payments': 'الوصول إلى المدفوعات',
    'view-all-payments': 'عرض جميع المدفوعات',
    'view-late-payments': 'عرض المدفوعات المتأخرة',
    'view-payment-reports': 'عرض تقارير المدفوعات',
    'access-settings': 'الوصول إلى الإعدادات',
    'manage-electronic-signature': 'إدارة التوقيع الإلكتروني',
  };

  // تجميع الصلاحيات حسب القوائم
  const groupedPermissions = useMemo(() => {
    const groups: Record<string, Permission[]> = {
      'الرئيسية': [],
      'لوحة التحكم والتقارير': [],
      'إدارة العملاء': [],
      'إدارة الموردين': [],
      'إدارة المخزون': [],
      'إدارة العقود والاتفاقيات': [],
      'إدارة التشغيل والنقليات': [],
      'إدارة المالية': [],
      'إدارة الموظفين': [],
      'إدارة الصلاحيات': [],
      'المدفوعات': [],
      'الإعدادات': [],
    };

    allPermissions.forEach((permission) => {
      if (permission.name.startsWith('access-main-dashboard')) {
        groups['الرئيسية'].push(permission);
      } else if (permission.name.includes('dashboard') || permission.name.includes('reports')) {
        groups['لوحة التحكم والتقارير'].push(permission);
      } else if (permission.name.includes('customer')) {
        groups['إدارة العملاء'].push(permission);
      } else if (permission.name.includes('supplier')) {
        groups['إدارة الموردين'].push(permission);
      } else if (permission.name.includes('inventory') || permission.name.includes('purchase-equipment') || permission.name.includes('purchases')) {
        groups['إدارة المخزون'].push(permission);
      } else if (permission.name.includes('contract')) {
        groups['إدارة العقود والاتفاقيات'].push(permission);
      } else if (permission.name.includes('operation') || permission.name.includes('delivery') || permission.name.includes('shipping') || permission.name.includes('return')) {
        groups['إدارة التشغيل والنقليات'].push(permission);
      } else if (permission.name.includes('financial') || permission.name.includes('invoice') || permission.name.includes('payment-transaction')) {
        groups['إدارة المالية'].push(permission);
      } else if (permission.name.includes('employee') || permission.name.includes('salary') || permission.name.includes('incentive') || permission.name.includes('attendance') || permission.name.includes('department') || permission.name.includes('leave')) {
        groups['إدارة الموظفين'].push(permission);
      } else if (permission.name.includes('permission') || permission.name.includes('role') || permission.name.includes('user-role')) {
        groups['إدارة الصلاحيات'].push(permission);
      } else if (permission.name.includes('payment') && !permission.name.includes('transaction')) {
        groups['المدفوعات'].push(permission);
      } else if (permission.name.includes('setting') || permission.name.includes('electronic-signature')) {
        groups['الإعدادات'].push(permission);
      }
    });

    return groups;
  }, [allPermissions]);

  // دالة للحصول على الاسم العربي للصلاحية
  const getPermissionLabel = (permissionName: string): string => {
    return permissionTranslations[permissionName] || permissionName.replace(/-/g, ' ');
  };

  return (
    <DashboardLayout>
      <Head title="إدارة الأدوار" />
      <div className="w-full space-y-6 mt-2">
        {/* روابط التنقل بين الصفحات */}
        <div className="flex items-center gap-2 flex-wrap">
          <Link
            href="/dashboard/user-roles"
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors flex items-center gap-2"
          >
            <Users className="h-4 w-4" />
            أدوار المستخدمين
          </Link>
          <Link
            href="/dashboard/roles"
            className="px-4 py-2 bg-[rgb(30,64,175)] text-white rounded-lg hover:bg-[rgb(25,55,150)] transition-colors flex items-center gap-2"
          >
            <Shield className="h-4 w-4" />
            الأدوار
          </Link>
          <Link
            href="/dashboard/permission-groups"
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors flex items-center gap-2"
          >
            <Key className="h-4 w-4" />
            مجموعات الصلاحيات
          </Link>
        </div>

        {/* العنوان */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            <h2 className="text-xl font-semibold">إدارة الأدوار</h2>
          </div>
          <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4" />
                إضافة دور جديد
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>إضافة دور جديد</DialogTitle>
                <DialogDescription>قم بإنشاء دور جديد وتعيين الصلاحيات له</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">اسم الدور</label>
                  <Input
                    value={createForm.data.name}
                    onChange={(e) => createForm.setData('name', e.target.value)}
                    placeholder="مثال: مدير، محرر، مشاهد"
                  />
                  {createForm.errors.name && (
                    <p className="text-sm text-red-500 mt-1">{createForm.errors.name}</p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">الصلاحيات</label>
                  <div className="border rounded-lg p-4 max-h-96 overflow-y-auto space-y-4">
                    {Object.entries(groupedPermissions).map(([groupName, permissions]) => {
                      if (permissions.length === 0) return null;
                      return (
                        <div key={groupName} className="space-y-2">
                          <h4 className="font-semibold text-sm text-primary border-b pb-1">{groupName}</h4>
                          <div className="space-y-2 pr-4">
                            {permissions.map((permission) => (
                              <div key={permission.id} className="flex items-center space-x-2 space-x-reverse">
                                <Checkbox
                                  id={`create-permission-${permission.id}`}
                                  checked={createForm.data.permissions?.includes(permission.id)}
                                  onCheckedChange={() => togglePermission(permission.id, createForm)}
                                />
                                <label
                                  htmlFor={`create-permission-${permission.id}`}
                                  className="text-sm cursor-pointer"
                                >
                                  {getPermissionLabel(permission.name)}
                                </label>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  {createForm.errors.permissions && (
                    <p className="text-sm text-red-500 mt-1">{createForm.errors.permissions}</p>
                  )}
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
                  إلغاء
                </Button>
                <Button onClick={handleCreate} disabled={createForm.processing}>
                  {createForm.processing ? 'جاري الحفظ...' : 'حفظ'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* الإحصائيات */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">إجمالي الأدوار</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalRoles}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">إجمالي الصلاحيات</CardTitle>
              <Key className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalPermissions}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">إجمالي المستخدمين</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
            </CardContent>
          </Card>
        </div>

        {/* جدول الأدوار */}
        <Card>
          <CardHeader>
            <CardTitle>قائمة الأدوار</CardTitle>
            <CardDescription>إدارة جميع الأدوار والصلاحيات في النظام</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>اسم الدور</TableHead>
                  <TableHead>عدد الصلاحيات</TableHead>
                  <TableHead>عدد المستخدمين</TableHead>
                  <TableHead>تاريخ الإنشاء</TableHead>
                  <TableHead className="text-left">الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {roles.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      لا توجد أدوار
                    </TableCell>
                  </TableRow>
                ) : (
                  roles.map((role) => (
                    <TableRow key={role.id}>
                      <TableCell className="font-medium">{role.name}</TableCell>
                      <TableCell>{role.permissions_count}</TableCell>
                      <TableCell>{role.users_count}</TableCell>
                      <TableCell>{new Date(role.created_at).toLocaleDateString('ar-SA')}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(role)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(role)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Edit Dialog */}
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>تعديل الدور</DialogTitle>
              <DialogDescription>قم بتعديل الدور وتعيين الصلاحيات</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">اسم الدور</label>
                <Input
                  value={updateForm.data.name}
                  onChange={(e) => updateForm.setData('name', e.target.value)}
                  placeholder="مثال: مدير، محرر، مشاهد"
                />
                {updateForm.errors.name && (
                  <p className="text-sm text-red-500 mt-1">{updateForm.errors.name}</p>
                )}
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">الصلاحيات</label>
                <div className="border rounded-lg p-4 max-h-96 overflow-y-auto space-y-4">
                  {Object.entries(groupedPermissions).map(([groupName, permissions]) => {
                    if (permissions.length === 0) return null;
                    return (
                      <div key={groupName} className="space-y-2">
                        <h4 className="font-semibold text-sm text-primary border-b pb-1">{groupName}</h4>
                        <div className="space-y-2 pr-4">
                          {permissions.map((permission) => (
                            <div key={permission.id} className="flex items-center space-x-2 space-x-reverse">
                              <Checkbox
                                id={`edit-permission-${permission.id}`}
                                checked={updateForm.data.permissions?.includes(permission.id)}
                                onCheckedChange={() => togglePermission(permission.id, updateForm)}
                              />
                              <label
                                htmlFor={`edit-permission-${permission.id}`}
                                className="text-sm cursor-pointer"
                              >
                                {getPermissionLabel(permission.name)}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
                {updateForm.errors.permissions && (
                  <p className="text-sm text-red-500 mt-1">{updateForm.errors.permissions}</p>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
                إلغاء
              </Button>
              <Button onClick={handleUpdate} disabled={updateForm.processing}>
                {updateForm.processing ? 'جاري الحفظ...' : 'حفظ'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirm Dialog */}
        <ConfirmDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          onConfirm={confirmDelete}
          title="حذف الدور"
          description={`هل أنت متأكد من حذف الدور "${selectedRole?.name}"؟`}
        />
      </div>
    </DashboardLayout>
  );
}

