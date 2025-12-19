/** @jsxImportSource react */
import { Head, router, useForm, usePage } from '@inertiajs/react';
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
import { Users, Shield, Key, Edit, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';

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

export default function UserRolesIndex({ users, allRoles, allPermissions, stats }: UserRolesIndexProps) {
  const { flash } = usePage().props as any;
  const [rolesDialogOpen, setRolesDialogOpen] = useState(false);
  const [permissionsDialogOpen, setPermissionsDialogOpen] = useState(false);
  const [createUserDialogOpen, setCreateUserDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

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

  useEffect(() => {
    if (flash?.success) {
      showToast.success('نجح', flash.success);
      setRolesDialogOpen(false);
      setPermissionsDialogOpen(false);
      setCreateUserDialogOpen(false);
      rolesForm.reset();
      permissionsForm.reset();
      createUserForm.reset();
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
                                {permission.name}
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
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

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

