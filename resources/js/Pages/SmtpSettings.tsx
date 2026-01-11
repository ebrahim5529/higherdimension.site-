/** @jsxImportSource react */
import { FormEvent, useEffect, useMemo, useState } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AlertCircle, Mail, Server, Shield, User, Lock } from 'lucide-react';
import { showToast } from '@/hooks/use-toast';

type SmtpSettingsData = {
  mail_mailer: 'smtp';
  mail_host: string;
  mail_port: string | number;
  mail_username: string;
  mail_password: string;
  mail_encryption: 'tls' | 'ssl' | 'null' | '';
  mail_from_address: string;
  mail_from_name: string;
};

interface PageProps {
  [key: string]: any;
  settings: SmtpSettingsData;
  errors?: Record<string, string>;
  flash?: {
    success?: string;
    error?: string;
  };
};

export default function SmtpSettings() {
  const { settings, errors, flash } = usePage<PageProps>().props;

  const initial = useMemo<SmtpSettingsData>(() => ({
    mail_mailer: settings?.mail_mailer ?? 'smtp',
    mail_host: settings?.mail_host ?? '',
    mail_port: settings?.mail_port ?? '',
    mail_username: settings?.mail_username ?? '',
    mail_password: settings?.mail_password ?? '',
    mail_encryption: (settings?.mail_encryption as any) ?? 'tls',
    mail_from_address: settings?.mail_from_address ?? '',
    mail_from_name: settings?.mail_from_name ?? '',
  }), [settings]);

  const [data, setData] = useState<SmtpSettingsData>(initial);
  const [isSaving, setIsSaving] = useState(false);
  const [testEmail, setTestEmail] = useState('');
  const [isTesting, setIsTesting] = useState(false);

  useEffect(() => {
    setData(initial);
  }, [initial]);

  useEffect(() => {
    if (flash?.success) showToast.success('تم بنجاح', flash.success);
    if (flash?.error) showToast.error('خطأ', flash.error);
  }, [flash]);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    router.post('/dashboard/smtp-settings', data, {
      onFinish: () => setIsSaving(false),
    });
  };

  const onTest = (e: FormEvent) => {
    e.preventDefault();
    setIsTesting(true);

    router.post(
      '/dashboard/smtp-settings/test',
      { to: testEmail },
      {
        onFinish: () => setIsTesting(false),
      }
    );
  };

  return (
    <DashboardLayout>
      <Head title="إعدادات SMTP" />

      <div className="space-y-6 mt-2 -mx-1 sm:-mx-2 lg:-mx-3 xl:-mx-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">إعدادات SMTP</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            إدارة إعدادات إرسال البريد الإلكتروني
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-6">
          {errors && Object.keys(errors).length > 0 && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg dark:bg-red-900/20 dark:border-red-800">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-red-800 dark:text-red-200">
                  <div className="font-semibold mb-1">تعذر حفظ الإعدادات</div>
                  <ul className="list-disc pr-6 space-y-1">
                    {Object.entries(errors).map(([k, v]) => (
                      <li key={k}>{v}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Server className="h-5 w-5" />
                إعدادات الخادم
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">SMTP Host</label>
                  <Input
                    value={data.mail_host}
                    onChange={(e) => setData((p) => ({ ...p, mail_host: e.target.value }))}
                    placeholder="smtp.gmail.com"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">SMTP Port</label>
                  <Input
                    value={data.mail_port}
                    onChange={(e) => setData((p) => ({ ...p, mail_port: e.target.value }))}
                    placeholder="587"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Username
                  </label>
                  <Input
                    value={data.mail_username}
                    onChange={(e) => setData((p) => ({ ...p, mail_username: e.target.value }))}
                    placeholder="user@example.com"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Lock className="h-4 w-4" />
                    Password
                  </label>
                  <Input
                    type="password"
                    value={data.mail_password}
                    onChange={(e) => setData((p) => ({ ...p, mail_password: e.target.value }))}
                    placeholder="••••••••"
                    autoComplete="new-password"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Encryption
                  </label>
                  <select
                    value={data.mail_encryption}
                    onChange={(e) => setData((p) => ({ ...p, mail_encryption: e.target.value as any }))}
                    className="w-full h-10 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 text-sm"
                  >
                    <option value="tls">TLS</option>
                    <option value="ssl">SSL</option>
                    <option value="null">بدون</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    From Address
                  </label>
                  <Input
                    type="email"
                    value={data.mail_from_address}
                    onChange={(e) => setData((p) => ({ ...p, mail_from_address: e.target.value }))}
                    placeholder="noreply@domain.com"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium">From Name</label>
                  <Input
                    value={data.mail_from_name}
                    onChange={(e) => setData((p) => ({ ...p, mail_from_name: e.target.value }))}
                    placeholder="اسم المرسل"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setData(initial)}
                  disabled={isSaving}
                >
                  إعادة تعيين
                </Button>
                <Button type="submit" disabled={isSaving} className="bg-primary hover:bg-primary/90">
                  {isSaving ? 'جاري الحفظ...' : 'حفظ'}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                اختبار الربط
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={onTest} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium">إرسال بريد اختبار إلى</label>
                  <Input
                    type="email"
                    value={testEmail}
                    onChange={(e) => setTestEmail(e.target.value)}
                    placeholder="example@domain.com"
                    required
                    disabled={isTesting}
                  />
                </div>
                <Button type="submit" disabled={isTesting} className="bg-blue-600 hover:bg-blue-700 text-white">
                  {isTesting ? 'جاري الاختبار...' : 'إرسال اختبار'}
                </Button>
              </form>
              <p className="text-xs text-muted-foreground">
                تأكد من حفظ إعدادات SMTP أولاً قبل الاختبار.
              </p>
            </CardContent>
          </Card>
        </form>
      </div>
    </DashboardLayout>
  );
}
