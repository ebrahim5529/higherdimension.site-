/** @jsxImportSource react */
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
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
import { showToast } from '@/hooks/use-toast';
import { Key, Plus, Edit, Trash2, Shield } from 'lucide-react';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';

interface Role {
  id: number;
  name: string;
}

interface Permission {
  id: number;
  name: string;
  guard_name: string;
  roles_count: number;
  roles: Role[];
  created_at: string;
}

interface PermissionsIndexProps {
  permissions: Permission[];
  allRoles: Role[];
  stats: {
    totalPermissions: number;
    totalRoles: number;
  };
}

export default function PermissionsIndex({ permissions, allRoles, stats }: PermissionsIndexProps) {
  const { flash } = usePage().props as any;
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedPermission, setSelectedPermission] = useState<Permission | null>(null);

  const createForm = useForm({
    name: '',
  });

  const updateForm = useForm({
    name: '',
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
    createForm.post('/permissions', {
      onSuccess: () => {
        createForm.reset();
      },
    });
  };

  const handleEdit = (permission: Permission) => {
    setSelectedPermission(permission);
    updateForm.setData({
      name: permission.name,
    });
    setEditDialogOpen(true);
  };

  const handleUpdate = () => {
    if (!selectedPermission) return;
    updateForm.put(`/permissions/${selectedPermission.id}`, {
      onSuccess: () => {
        setEditDialogOpen(false);
        setSelectedPermission(null);
        updateForm.reset();
      },
    });
  };

  const handleDelete = (permission: Permission) => {
    setSelectedPermission(permission);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (!selectedPermission) return;
    router.delete(`/permissions/${selectedPermission.id}`, {
      onSuccess: () => {
        showToast.success('تم الحذف بنجاح', `تم حذف الصلاحية "${selectedPermission.name}" بنجاح`);
        setDeleteDialogOpen(false);
        setSelectedPermission(null);
      },
      onError: (errors) => {
        showToast.error('فشل الحذف', errors?.message || 'حدث خطأ أثناء حذف الصلاحية');
      },
    });
  };

  return (
    <DashboardLayout>
      <Head title="إدارة الصلاحيات" />
      <div className="w-full space-y-6 mt-2">
        {/* العنوان */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            <h2 className="text-xl font-semibold">إدارة الصلاحيات</h2>
          </div>
          <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4" />
                إضافة صلاحية جديدة
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>إضافة صلاحية جديدة</DialogTitle>
                <DialogDescription>قم بإنشاء صلاحية جديدة</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">اسم الصلاحية</label>
                  <Input
                    value={createForm.data.name}
                    onChange={(e) => createForm.setData('name', e.target.value)}
                    placeholder="مثال: create-users, edit-contracts"
                  />
                  {createForm.errors.name && (
                    <p className="text-sm text-red-500 mt-1">{createForm.errors.name}</p>
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <CardTitle className="text-sm font-medium">إجمالي الأدوار</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalRoles}</div>
            </CardContent>
          </Card>
        </div>

        {/* جدول الصلاحيات */}
        <Card>
          <CardHeader>
            <CardTitle>قائمة الصلاحيات</CardTitle>
            <CardDescription>إدارة جميع الصلاحيات في النظام</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>اسم الصلاحية</TableHead>
                  <TableHead>عدد الأدوار</TableHead>
                  <TableHead>الأدوار المرتبطة</TableHead>
                  <TableHead>تاريخ الإنشاء</TableHead>
                  <TableHead className="text-left">الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {permissions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      لا توجد صلاحيات
                    </TableCell>
                  </TableRow>
                ) : (
                  permissions.map((permission) => (
                    <TableRow key={permission.id}>
                      <TableCell className="font-medium">{permission.name}</TableCell>
                      <TableCell>{permission.roles_count}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {permission.roles.length > 0 ? (
                            permission.roles.map((role) => (
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
                      <TableCell>{new Date(permission.created_at).toLocaleDateString('ar-SA')}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(permission)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(permission)}
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
          <DialogContent>
            <DialogHeader>
              <DialogTitle>تعديل الصلاحية</DialogTitle>
              <DialogDescription>قم بتعديل اسم الصلاحية</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">اسم الصلاحية</label>
                <Input
                  value={updateForm.data.name}
                  onChange={(e) => updateForm.setData('name', e.target.value)}
                  placeholder="مثال: create-users, edit-contracts"
                />
                {updateForm.errors.name && (
                  <p className="text-sm text-red-500 mt-1">{updateForm.errors.name}</p>
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
          title="حذف الصلاحية"
          description={`هل أنت متأكد من حذف الصلاحية "${selectedPermission?.name}"؟`}
        />
      </div>
    </DashboardLayout>
  );
}

