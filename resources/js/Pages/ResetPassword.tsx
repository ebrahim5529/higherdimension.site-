/** @jsxImportSource react */
import { FormEvent, useEffect, useState } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { AlertCircle, Lock, Mail, ArrowLeft } from 'lucide-react';
import { showToast } from '@/hooks/use-toast';

interface PageProps {
  [key: string]: any;
  token: string;
  email: string;
  errors?: Record<string, string>;
  flash?: {
    success?: string;
    error?: string;
  };
}

export default function ResetPassword() {
  const { token, email: initialEmail, errors, flash } = usePage<PageProps>().props;
  const [email, setEmail] = useState(initialEmail || '');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (flash?.success) showToast.success('تم بنجاح', flash.success);
    if (flash?.error) showToast.error('خطأ', flash.error);
  }, [flash]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    router.post(
      '/reset-password',
      {
        token,
        email,
        password,
        password_confirmation: passwordConfirmation,
      },
      {
        onFinish: () => setIsLoading(false),
      }
    );
  };

  return (
    <>
      <Head title="إعادة تعيين كلمة المرور" />
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
        <div className="w-full max-w-md">
          <Card className="shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardHeader className="space-y-2">
              <div className="flex items-center justify-between">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => router.visit('/login')}
                  className="p-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <div className="flex-1 text-center">
                  <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                    إعادة تعيين كلمة المرور
                  </CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-400">
                    أدخل كلمة مرور جديدة لحسابك
                  </CardDescription>
                </div>
                <div className="w-9" />
              </div>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {errors && Object.keys(errors).length > 0 && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg dark:bg-red-900/20 dark:border-red-800">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                      <div className="text-sm text-red-800 dark:text-red-200">
                        <div className="font-semibold mb-1">تعذر حفظ كلمة المرور</div>
                        <ul className="list-disc pr-6 space-y-1">
                          {Object.entries(errors).map(([k, v]) => (
                            <li key={k}>{v}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    البريد الإلكتروني
                  </label>
                  <div className="relative">
                    <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pr-10 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    كلمة المرور الجديدة
                  </label>
                  <div className="relative">
                    <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pr-10 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    تأكيد كلمة المرور
                  </label>
                  <div className="relative">
                    <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      type="password"
                      value={passwordConfirmation}
                      onChange={(e) => setPasswordConfirmation(e.target.value)}
                      className="pr-10 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  disabled={isLoading}
                >
                  {isLoading ? 'جاري الحفظ...' : 'حفظ كلمة المرور الجديدة'}
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="mt-8 text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              © 2024 البعد العالي عمان - نظام إدارة السقالات
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
