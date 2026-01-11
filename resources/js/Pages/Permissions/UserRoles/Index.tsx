/** @jsxImportSource react */
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
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
import { Users, Shield, Key, Edit, Plus, Eye, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';

interface Role {
  id: number;
  name: string;
}

interface Permission {
  id: number;
  name: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  roles: Role[];
  permissions: Permission[];
  roles_count: number;
  permissions_count: number;
}

interface UserRolesIndexProps {
  users: User[];
  allRoles: Role[];
  allPermissions: Permission[];
  stats: {
    totalUsers: number;
    totalRoles: number;
    totalPermissions: number;
  };
}

const PERMISSION_LABELS_AR: Record<string, string> = {
  'access-main-dashboard': 'الوصول للوحة التحكم الرئيسية',
  'access-dashboard-reports': 'الوصول لتقارير لوحة التحكم',
  'access-dashboard-interactive': 'الوصول للوحة التحكم التفاعلية',
  'access-financial-reports': 'الوصول للتقارير المالية',
  'access-operations-reports': 'الوصول لتقارير التشغيل',
  'access-customer-reports': 'الوصول لتقارير العملاء',
  'access-customers': 'الوصول لإدارة العملاء',
  'manage-customers': 'إدارة العملاء',
  'view-customer-contracts': 'عرض عقود العملاء',
  'manage-customer-claims': 'إدارة مطالبات العملاء',
  'access-suppliers': 'الوصول لإدارة الموردين',
  'manage-suppliers': 'إدارة الموردين',
  'view-supplier-invoices': 'عرض فواتير الموردين',
  'manage-supplier-purchases': 'إدارة مشتريات الموردين',
  'access-inventory': 'الوصول لإدارة المخزون',
  'manage-inventory': 'إدارة المخزون',
  'purchase-equipment': 'شراء المعدات',
  'manage-purchases': 'إدارة المشتريات',
  'access-contracts': 'الوصول لإدارة العقود',
  'manage-contracts': 'إدارة العقود',
  'view-active-contracts': 'عرض العقود النشطة',
  'view-expired-contracts': 'عرض العقود المنتهية',
  'view-cancelled-contracts': 'عرض العقود الملغاة',
  'access-operations': 'الوصول لإدارة التشغيل',
  'manage-delivery-orders': 'إدارة أوامر التسليم',
  'track-shipping': 'تتبع الشحن',
  'manage-delivery-receipt': 'إدارة سند التسليم',
  'manage-return-inspection': 'إدارة فحص المرتجعات',
  'access-financial': 'الوصول لإدارة المالية',
  'manage-payment-transactions': 'إدارة معاملات الدفع',
  'manage-invoices': 'إدارة الفواتير',
  'view-financial-reports': 'عرض التقارير المالية',
  'access-employees': 'الوصول لإدارة الموظفين',
  'manage-employees': 'إدارة الموظفين',
  'manage-salaries': 'إدارة الرواتب',
  'manage-incentives': 'إدارة الحوافز',
  'manage-attendance': 'إدارة الحضور',
  'manage-departments': 'إدارة الأقسام',
  'manage-leaves': 'إدارة الإجازات',
  'access-permissions': 'الوصول لإدارة الصلاحيات',
  'manage-user-roles': 'إدارة أدوار المستخدمين',
  'manage-permission-groups': 'إدارة مجموعات الصلاحيات',
  'manage-roles': 'إدارة الأدوار',
  'access-payments': 'الوصول لإدارة المدفوعات',
  'view-all-payments': 'عرض جميع المدفوعات',
  'view-late-payments': 'عرض المدفوعات المتأخرة',
  'view-payment-reports': 'عرض تقارير المدفوعات',
  'access-settings': 'الوصول للإعدادات',
  'manage-electronic-signature': 'إدارة التوقيع الإلكتروني',
};

function permissionLabelAr(name: string): string {
  if (PERMISSION_LABELS_AR[name]) return PERMISSION_LABELS_AR[name];

  const parts = (name || '').split('-');
  const verb = parts.shift() || '';
  const rest = parts.join('-');

  const verbAr: Record<string, string> = {
    access: 'الوصول',
    manage: 'إدارة',
    view: 'عرض',
    track: 'تتبع',
  };

  const subjectAr: Record<string, string> = {
    'main-dashboard': 'لوحة التحكم الرئيسية',
    dashboard: 'لوحة التحكم',
    reports: 'التقارير',
    customers: 'العملاء',
    suppliers: 'الموردين',
    inventory: 'المخزون',
    contracts: 'العقود',
    operations: 'التشغيل',
    financial: 'المالية',
    employees: 'الموظفين',
    permissions: 'الصلاحيات',
    settings: 'الإعدادات',
    payments: 'المدفوعات',
  };

  const subject = subjectAr[rest] || rest.replace(/-/g, ' ');
  const v = verbAr[verb] || verb;

  return `${v} ${subject}`.trim();
}

export default function UserRolesIndex({ users, allRoles, allPermissions, stats }: UserRolesIndexProps) {
  const { flash, auth } = usePage().props as any;
  const [rolesDialogOpen, setRolesDialogOpen] = useState(false);
  const [permissionsDialogOpen, setPermissionsDialogOpen] = useState(false);
  const [createUserDialogOpen, setCreateUserDialogOpen] = useState(false);
  const [viewUserDialogOpen, setViewUserDialogOpen] = useState(false);
  const [editUserDialogOpen, setEditUserDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const createUserForm = useForm({
    name: '',
    email: '',
    phone: '',
    password: '',
    roles: [] as number[],
  });

  const rolesForm = useForm({
    roles: [] as number[],
  });

  const permissionsForm = useForm({
    permissions: [] as number[],
  });

  const editUserForm = useForm({
    name: '',
    email: '',
    phone: '',
    password: '',
  });

  const handleViewUser = async (user: User) => {
    try {
      const res = await fetch(`/user-roles/${user.id}`, {
        headers: {
          Accept: 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
        credentials: 'same-origin',
      });

      if (!res.ok) {
        setSelectedUser(user);
      } else {
        const data = await res.json();
        setSelectedUser(data);
      }
    } catch (e) {
      setSelectedUser(user);
    }

    setViewUserDialogOpen(true);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    editUserForm.setData({
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
      password: '',
    });
    setEditUserDialogOpen(true);
  };

  const handleUpdateUser = () => {
    if (!selectedUser) return;
    editUserForm.put(`/user-roles/${selectedUser.id}`, {
      onSuccess: () => {
        setEditUserDialogOpen(false);
        setSelectedUser(null);
        editUserForm.reset();
      },
    });
  };

  const handleAskDeleteUser = (user: User) => {
    setSelectedUser(user);
    setDeleteDialogOpen(true);
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    setIsDeleting(true);
    return new Promise<void>((resolve, reject) => {
      router.delete(`/user-roles/${selectedUser.id}`, {
        onFinish: () => {
          setIsDeleting(false);
          resolve();
        },
        onError: () => {
          setIsDeleting(false);
          reject();
        },
      });
    });
  };

  useEffect(() => {
    if (flash?.success) {
      showToast.success('نجح', flash.success);
      setRolesDialogOpen(false);
      setPermissionsDialogOpen(false);
      setCreateUserDialogOpen(false);
      setViewUserDialogOpen(false);
      setEditUserDialogOpen(false);
      setDeleteDialogOpen(false);
      rolesForm.reset();
      permissionsForm.reset();
      createUserForm.reset();
      editUserForm.reset();
      setSelectedUser(null);
    }
    if (flash?.error) {
      showToast.error('خطأ', flash.error);
    }
  }, [flash]);

  const handleCreateUser = () => {
    createUserForm.post('/user-roles', {
      onSuccess: () => {
        createUserForm.reset();
      },
    });
  };

  const toggleCreateUserRole = (roleId: number) => {
    const currentRoles = createUserForm.data.roles || [];
    if (currentRoles.includes(roleId)) {
      createUserForm.setData('roles', currentRoles.filter((id) => id !== roleId));
    } else {
      createUserForm.setData('roles', [...currentRoles, roleId]);
    }
  };

  const handleEditRoles = (user: User) => {
    setSelectedUser(user);
    rolesForm.setData({
      roles: user.roles.map((r) => r.id),
    });
    setRolesDialogOpen(true);
  };

  const handleUpdateRoles = () => {
    if (!selectedUser) return;
    rolesForm.put(`/user-roles/${selectedUser.id}/roles`, {
      onSuccess: () => {
        setRolesDialogOpen(false);
        setSelectedUser(null);
        rolesForm.reset();
      },
    });
  };

  const handleEditPermissions = (user: User) => {
    setSelectedUser(user);
    permissionsForm.setData({
      permissions: user.permissions.map((p) => p.id),
    });
    setPermissionsDialogOpen(true);
  };

  const handleUpdatePermissions = () => {
    if (!selectedUser) return;
    permissionsForm.put(`/user-roles/${selectedUser.id}/permissions`, {
      onSuccess: () => {
        setPermissionsDialogOpen(false);
        setSelectedUser(null);
        permissionsForm.reset();
      },
    });
  };

  const toggleRole = (roleId: number) => {
    const currentRoles = rolesForm.data.roles || [];
    if (currentRoles.includes(roleId)) {
      rolesForm.setData('roles', currentRoles.filter((id) => id !== roleId));
    } else {
      rolesForm.setData('roles', [...currentRoles, roleId]);
    }
  };

  const togglePermission = (permissionId: number) => {
    const currentPermissions = permissionsForm.data.permissions || [];
    if (currentPermissions.includes(permissionId)) {
      permissionsForm.setData('permissions', currentPermissions.filter((id) => id !== permissionId));
    } else {
      permissionsForm.setData('permissions', [...currentPermissions, permissionId]);
    }
  };

  return (
    <DashboardLayout>
      <Head title="أدوار المستخدمين" />
      <div className="w-full space-y-6 mt-2">
        {/* روابط التنقل بين الصفحات */}
        <div className="flex items-center gap-2 flex-wrap">
          <Link
            href="/dashboard/user-roles"
            className="px-4 py-2 bg-[rgb(30,64,175)] text-white rounded-lg hover:bg-[rgb(25,55,150)] transition-colors flex items-center gap-2"
          >
            <Users className="h-4 w-4" />
            أدوار المستخدمين
          </Link>
          <Link
            href="/dashboard/roles"
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors flex items-center gap-2"
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
            <Users className="h-5 w-5" />
            <h2 className="text-xl font-semibold">أدوار المستخدمين</h2>
          </div>
          <Dialog open={createUserDialogOpen} onOpenChange={setCreateUserDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4" />
                إضافة مستخدم جديد
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>إضافة مستخدم جديد</DialogTitle>
                <DialogDescription>قم بإنشاء مستخدم جديد وتعيين الأدوار له</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">الاسم</label>
                  <Input
                    value={createUserForm.data.name}
                    onChange={(e) => createUserForm.setData('name', e.target.value)}
                    placeholder="اسم المستخدم"
                  />
                  {createUserForm.errors.name && (
                    <p className="text-sm text-red-500 mt-1">{createUserForm.errors.name}</p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">البريد الإلكتروني</label>
                  <Input
                    type="email"
                    value={createUserForm.data.email}
                    onChange={(e) => createUserForm.setData('email', e.target.value)}
                    placeholder="example@email.com"
                  />
                  {createUserForm.errors.email && (
                    <p className="text-sm text-red-500 mt-1">{createUserForm.errors.email}</p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">رقم الهاتف</label>
                  <Input
                    value={createUserForm.data.phone}
                    onChange={(e) => createUserForm.setData('phone', e.target.value)}
                    placeholder="رقم الهاتف (اختياري)"
                  />
                  {createUserForm.errors.phone && (
                    <p className="text-sm text-red-500 mt-1">{createUserForm.errors.phone}</p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">كلمة المرور</label>
                  <Input
                    type="password"
                    value={createUserForm.data.password}
                    onChange={(e) => createUserForm.setData('password', e.target.value)}
                    placeholder="كلمة المرور"
                  />
                  {createUserForm.errors.password && (
                    <p className="text-sm text-red-500 mt-1">{createUserForm.errors.password}</p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">الأدوار</label>
                  <div className="border rounded-lg p-4 max-h-60 overflow-y-auto space-y-2">
                    {allRoles.map((role) => (
                      <div key={role.id} className="flex items-center space-x-2 space-x-reverse">
                        <Checkbox
                          id={`create-user-role-${role.id}`}
                          checked={createUserForm.data.roles?.includes(role.id)}
                          onCheckedChange={() => toggleCreateUserRole(role.id)}
                        />
                        <label
                          htmlFor={`create-user-role-${role.id}`}
                          className="text-sm cursor-pointer"
                        >
                          {role.name}
                        </label>
                      </div>
                    ))}
                  </div>
                  {createUserForm.errors.roles && (
                    <p className="text-sm text-red-500 mt-1">{createUserForm.errors.roles}</p>
                  )}
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setCreateUserDialogOpen(false)}>
                  إلغاء
                </Button>
                <Button onClick={handleCreateUser} disabled={createUserForm.processing}>
                  {createUserForm.processing ? 'جاري الحفظ...' : 'حفظ'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* الإحصائيات */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">إجمالي المستخدمين</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
            </CardContent>
          </Card>
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
        </div>

        {/* جدول المستخدمين */}
        <Card>
          <CardHeader>
            <CardTitle>قائمة المستخدمين</CardTitle>
            <CardDescription>إدارة أدوار وصلاحيات المستخدمين</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>الاسم</TableHead>
                  <TableHead>البريد الإلكتروني</TableHead>
                  <TableHead>الأدوار</TableHead>
                  <TableHead>الصلاحيات</TableHead>
                  <TableHead className="text-left">الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      لا يوجد مستخدمون
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {user.roles.length > 0 ? (
                            user.roles.map((role) => (
                              <span
                                key={role.id}
                                className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900 rounded"
                              >
                                {role.name}
                              </span>
                            ))
                          ) : (
                            <span className="text-muted-foreground text-sm">لا توجد أدوار</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {user.permissions.length > 0 ? (
                            user.permissions.slice(0, 2).map((permission) => (
                              <span
                                key={permission.id}
                                className="px-2 py-1 text-xs bg-green-100 dark:bg-green-900 rounded"
                              >
                                {permissionLabelAr(permission.name)}
                              </span>
                            ))
                          ) : (
                            <span className="text-muted-foreground text-sm">لا توجد صلاحيات</span>
                          )}
                          {user.permissions.length > 2 && (
                            <span className="text-xs text-muted-foreground">
                              +{user.permissions.length - 2} أكثر
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditRoles(user)}
                          >
                            <Shield className="h-4 w-4" />
                            أدوار
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditPermissions(user)}
                          >
                            <Key className="h-4 w-4" />
                            صلاحيات
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewUser(user)}
                            title="عرض"
                            aria-label="عرض"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditUser(user)}
                            title="تعديل"
                            aria-label="تعديل"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleAskDeleteUser(user)}
                            disabled={auth?.user?.id === user.id}
                            title="حذف"
                            aria-label="حذف"
                          >
                            <Trash2 className="h-4 w-4" />
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

        <Dialog open={viewUserDialogOpen} onOpenChange={setViewUserDialogOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>عرض المستخدم</DialogTitle>
              <DialogDescription>تفاصيل المستخدم والصلاحيات</DialogDescription>
            </DialogHeader>
            <div className="space-y-3">
              <div className="text-sm">
                <span className="font-medium">الاسم:</span> {selectedUser?.name}
              </div>
              <div className="text-sm">
                <span className="font-medium">البريد:</span> {selectedUser?.email}
              </div>
              <div className="text-sm">
                <span className="font-medium">الهاتف:</span> {selectedUser?.phone || '-'}
              </div>
              <div>
                <div className="text-sm font-medium mb-2">الأدوار</div>
                <div className="flex flex-wrap gap-1">
                  {selectedUser?.roles?.length ? (
                    selectedUser.roles.map((r) => (
                      <span key={r.id} className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900 rounded">
                        {r.name}
                      </span>
                    ))
                  ) : (
                    <span className="text-muted-foreground text-sm">لا توجد أدوار</span>
                  )}
                </div>
              </div>
              <div>
                <div className="text-sm font-medium mb-2">الصلاحيات</div>
                <div className="flex flex-wrap gap-1 max-h-40 overflow-y-auto border rounded p-2">
                  {selectedUser?.permissions?.length ? (
                    selectedUser.permissions.map((p) => (
                      <span key={p.id} className="px-2 py-1 text-xs bg-green-100 dark:bg-green-900 rounded">
                        {permissionLabelAr(p.name)}
                      </span>
                    ))
                  ) : (
                    <span className="text-muted-foreground text-sm">لا توجد صلاحيات</span>
                  )}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setViewUserDialogOpen(false)}>إغلاق</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={editUserDialogOpen} onOpenChange={setEditUserDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>تعديل المستخدم</DialogTitle>
              <DialogDescription>تعديل بيانات المستخدم الأساسية</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">الاسم</label>
                <Input
                  value={editUserForm.data.name}
                  onChange={(e) => editUserForm.setData('name', e.target.value)}
                  placeholder="اسم المستخدم"
                />
                {editUserForm.errors.name && (
                  <p className="text-sm text-red-500 mt-1">{editUserForm.errors.name}</p>
                )}
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">البريد الإلكتروني</label>
                <Input
                  type="email"
                  value={editUserForm.data.email}
                  onChange={(e) => editUserForm.setData('email', e.target.value)}
                  placeholder="example@email.com"
                />
                {editUserForm.errors.email && (
                  <p className="text-sm text-red-500 mt-1">{editUserForm.errors.email}</p>
                )}
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">رقم الهاتف</label>
                <Input
                  value={editUserForm.data.phone}
                  onChange={(e) => editUserForm.setData('phone', e.target.value)}
                  placeholder="رقم الهاتف (اختياري)"
                />
                {editUserForm.errors.phone && (
                  <p className="text-sm text-red-500 mt-1">{editUserForm.errors.phone}</p>
                )}
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">كلمة المرور (اختياري)</label>
                <Input
                  type="password"
                  value={editUserForm.data.password}
                  onChange={(e) => editUserForm.setData('password', e.target.value)}
                  placeholder="اتركه فارغاً إذا لا تريد التغيير"
                />
                {editUserForm.errors.password && (
                  <p className="text-sm text-red-500 mt-1">{editUserForm.errors.password}</p>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditUserDialogOpen(false)}>
                إلغاء
              </Button>
              <Button onClick={handleUpdateUser} disabled={editUserForm.processing}>
                {editUserForm.processing ? 'جاري الحفظ...' : 'حفظ'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <ConfirmDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          onConfirm={handleDeleteUser}
          title="حذف المستخدم"
          description={`هل أنت متأكد من حذف المستخدم: ${selectedUser?.name || ''} ؟`}
          confirmText="حذف"
          cancelText="إلغاء"
          variant="danger"
          isLoading={isDeleting}
        />

        {/* Edit Roles Dialog */}
        <Dialog open={rolesDialogOpen} onOpenChange={setRolesDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>تعديل أدوار المستخدم</DialogTitle>
              <DialogDescription>
                قم بتعيين الأدوار للمستخدم: {selectedUser?.name}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">الأدوار</label>
                <div className="border rounded-lg p-4 max-h-60 overflow-y-auto space-y-2">
                  {allRoles.map((role) => (
                    <div key={role.id} className="flex items-center space-x-2 space-x-reverse">
                      <Checkbox
                        id={`role-${role.id}`}
                        checked={rolesForm.data.roles?.includes(role.id)}
                        onCheckedChange={() => toggleRole(role.id)}
                      />
                      <label htmlFor={`role-${role.id}`} className="text-sm cursor-pointer">
                        {role.name}
                      </label>
                    </div>
                  ))}
                </div>
                {rolesForm.errors.roles && (
                  <p className="text-sm text-red-500 mt-1">{rolesForm.errors.roles}</p>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setRolesDialogOpen(false)}>
                إلغاء
              </Button>
              <Button onClick={handleUpdateRoles} disabled={rolesForm.processing}>
                {rolesForm.processing ? 'جاري الحفظ...' : 'حفظ'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Permissions Dialog */}
        <Dialog open={permissionsDialogOpen} onOpenChange={setPermissionsDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>تعديل صلاحيات المستخدم</DialogTitle>
              <DialogDescription>
                قم بتعيين الصلاحيات للمستخدم: {selectedUser?.name}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">الصلاحيات</label>
                <div className="border rounded-lg p-4 max-h-60 overflow-y-auto space-y-2">
                  {allPermissions.map((permission) => (
                    <div key={permission.id} className="flex items-center space-x-2 space-x-reverse">
                      <Checkbox
                        id={`permission-${permission.id}`}
                        checked={permissionsForm.data.permissions?.includes(permission.id)}
                        onCheckedChange={() => togglePermission(permission.id)}
                      />
                      <label htmlFor={`permission-${permission.id}`} className="text-sm cursor-pointer">
                        {permission.name}
                      </label>
                    </div>
                  ))}
                </div>
                {permissionsForm.errors.permissions && (
                  <p className="text-sm text-red-500 mt-1">{permissionsForm.errors.permissions}</p>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setPermissionsDialogOpen(false)}>
                إلغاء
              </Button>
              <Button onClick={handleUpdatePermissions} disabled={permissionsForm.processing}>
                {permissionsForm.processing ? 'جاري الحفظ...' : 'حفظ'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}

