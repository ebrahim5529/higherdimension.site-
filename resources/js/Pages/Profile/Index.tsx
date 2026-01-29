/** @jsxImportSource react */
import { Head, useForm, router } from '@inertiajs/react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  User,
  Mail,
  Phone,
  Shield,
  Lock,
  Save,
  CheckCircle,
} from 'lucide-react';
import { useState } from 'react';
import { showToast } from '@/hooks/use-toast';
import TwoFactorToggle from '@/components/security/TwoFactorToggle';

interface UserData {
  id: number;
  name: string;
  email: string;
  phone?: string;
  roles: string[];
  permissions: string[];
  two_factor_enabled?: boolean;
}

interface ProfileProps {
  user: UserData;
  flash?: {
    success?: string;
    error?: string;
  };
}

export default function Profile({ user, flash }: ProfileProps) {
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  const profileForm = useForm({
    name: user.name,
    email: user.email,
    phone: user.phone || '',
  });

  const passwordForm = useForm({
    current_password: '',
    password: '',
    password_confirmation: '',
  });

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    profileForm.put('/profile', {
      preserveScroll: true,
      onSuccess: () => {
        showToast.success('نجح', 'تم تحديث معلومات الملف الشخصي بنجاح');
      },
      onError: () => {
        showToast.error('خطأ', 'حدث خطأ أثناء تحديث المعلومات');
      },
    });
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    passwordForm.put('/profile/password', {
      preserveScroll: true,
      onSuccess: () => {
        showToast.success('نجح', 'تم تغيير كلمة المرور بنجاح');
        passwordForm.reset();
        setShowPasswordForm(false);
      },
      onError: () => {
        showToast.error('خطأ', 'حدث خطأ أثناء تغيير كلمة المرور');
      },
    });
  };

  return (
    <DashboardLayout>
      <Head title="الملف الشخصي" />
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-2">
          <User className="h-6 w-6 text-[#58d2c8]" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            الملف الشخصي
          </h1>
        </div>

        {/* Success Message */}
        {flash?.success && (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
            <p className="text-green-800 dark:text-green-200">{flash.success}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  المعلومات الشخصية
                </CardTitle>
                <CardDescription>
                  قم بتحديث معلوماتك الشخصية
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleProfileSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">الاسم</Label>
                    <Input
                      id="name"
                      type="text"
                      value={profileForm.data.name}
                      onChange={(e) => profileForm.setData('name', e.target.value)}
                      className={profileForm.errors.name ? 'border-red-500' : ''}
                    />
                    {profileForm.errors.name && (
                      <p className="text-sm text-red-500">{profileForm.errors.name}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      البريد الإلكتروني
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileForm.data.email}
                      onChange={(e) => profileForm.setData('email', e.target.value)}
                      className={profileForm.errors.email ? 'border-red-500' : ''}
                    />
                    {profileForm.errors.email && (
                      <p className="text-sm text-red-500">{profileForm.errors.email}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      رقم الهاتف
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={profileForm.data.phone}
                      onChange={(e) => profileForm.setData('phone', e.target.value)}
                      className={profileForm.errors.phone ? 'border-red-500' : ''}
                    />
                    {profileForm.errors.phone && (
                      <p className="text-sm text-red-500">{profileForm.errors.phone}</p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    disabled={profileForm.processing}
                    className="w-full sm:w-auto"
                  >
                    <Save className="h-4 w-4 ml-2" />
                    {profileForm.processing ? 'جاري الحفظ...' : 'حفظ التغييرات'}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Change Password */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5" />
                  تغيير كلمة المرور
                </CardTitle>
                <CardDescription>
                  قم بتغيير كلمة المرور الخاصة بك
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!showPasswordForm ? (
                  <Button
                    onClick={() => setShowPasswordForm(true)}
                    variant="outline"
                    className="w-full"
                  >
                    <Lock className="h-4 w-4 ml-2" />
                    تغيير كلمة المرور
                  </Button>
                ) : (
                  <form onSubmit={handlePasswordSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="current_password">كلمة المرور الحالية</Label>
                      <Input
                        id="current_password"
                        type="password"
                        value={passwordForm.data.current_password}
                        onChange={(e) => passwordForm.setData('current_password', e.target.value)}
                        className={passwordForm.errors.current_password ? 'border-red-500' : ''}
                      />
                      {passwordForm.errors.current_password && (
                        <p className="text-sm text-red-500">
                          {passwordForm.errors.current_password}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password">كلمة المرور الجديدة</Label>
                      <Input
                        id="password"
                        type="password"
                        value={passwordForm.data.password}
                        onChange={(e) => passwordForm.setData('password', e.target.value)}
                        className={passwordForm.errors.password ? 'border-red-500' : ''}
                      />
                      {passwordForm.errors.password && (
                        <p className="text-sm text-red-500">
                          {passwordForm.errors.password}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password_confirmation">تأكيد كلمة المرور</Label>
                      <Input
                        id="password_confirmation"
                        type="password"
                        value={passwordForm.data.password_confirmation}
                        onChange={(e) =>
                          passwordForm.setData('password_confirmation', e.target.value)
                        }
                        className={passwordForm.errors.password_confirmation ? 'border-red-500' : ''}
                      />
                      {passwordForm.errors.password_confirmation && (
                        <p className="text-sm text-red-500">
                          {passwordForm.errors.password_confirmation}
                        </p>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <Button
                        type="submit"
                        disabled={passwordForm.processing}
                        className="flex-1"
                      >
                        <Save className="h-4 w-4 ml-2" />
                        {passwordForm.processing ? 'جاري الحفظ...' : 'حفظ كلمة المرور'}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setShowPasswordForm(false);
                          passwordForm.reset();
                        }}
                      >
                        إلغاء
                      </Button>
                    </div>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Roles & Permissions */}
          <div className="space-y-6">
            {/* Roles */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  الأدوار
                </CardTitle>
              </CardHeader>
              <CardContent>
                {user.roles && user.roles.length > 0 ? (
                  <div className="space-y-2">
                    {user.roles.map((role) => (
                      <div
                        key={role}
                        className="px-3 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-sm font-medium text-blue-700 dark:text-blue-300"
                      >
                        {role}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    لا توجد أدوار محددة
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Permissions Count */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  الصلاحيات
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#58d2c8]">
                    {user.permissions?.length || 0}
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    صلاحية متاحة
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Two Factor Authentication */}
        <div className="mt-6">
          <TwoFactorToggle enabled={user.two_factor_enabled || false} />
        </div>
      </div>
    </DashboardLayout>
  );
}

