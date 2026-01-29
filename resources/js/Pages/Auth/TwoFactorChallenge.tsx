/** @jsxImportSource react */
import { useState, useEffect, FormEvent } from 'react';
import { router, useForm, Head } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Mail, Shield, RefreshCw } from 'lucide-react';
import { showToast } from '@/hooks/use-toast';

interface TwoFactorChallengeProps {
  email: string;
  expires_at?: number;
  flash?: {
    success?: string;
    error?: string;
  };
}

export default function TwoFactorChallenge({
  email,
  expires_at,
  flash,
}: TwoFactorChallengeProps) {
  const [code, setCode] = useState('');

  const form = useForm({
    code: '',
  });

  // عرض رسائل Flash
  useEffect(() => {
    if (flash?.success) {
      showToast.success('نجح', flash.success);
    }
    if (flash?.error) {
      showToast.error('خطأ', flash.error);
    }
  }, [flash]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    form.post('/two-factor/challenge', {
      preserveScroll: true,
      onSuccess: () => {
        router.visit('/dashboard');
      },
      onError: () => {
        setCode('');
      },
    });
  };

  const handleResend = () => {
    router.post(
      '/two-factor/resend',
      {},
      {
        onSuccess: () => {
          showToast.success('نجح', 'تم إرسال رمز التحقق إلى بريدك الإلكتروني');
        },
        onError: () => {
          showToast.error('خطأ', 'فشل إرسال الرمز. يرجى المحاولة مرة أخرى');
        },
      }
    );
  };

  return (
    <>
      <Head title="التحقق من المصادقة الثنائية" />
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
        <div className="w-full max-w-md">
          <Card className="shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardHeader className="space-y-1 text-center">
              <div className="mx-auto w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-4">
                <Shield className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                التحقق من المصادقة الثنائية
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                تم إرسال رمز التحقق إلى بريدك الإلكتروني
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* معلومات البريد */}
                <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <Mail className="h-5 w-5 text-gray-500" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 dark:text-gray-400">البريد الإلكتروني</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{email}</p>
                  </div>
                </div>

                {/* رسالة توضيحية */}
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <p className="text-sm text-blue-800 dark:text-blue-200 text-center">
                    يرجى فتح بريدك الإلكتروني وإدخال رمز التحقق المكون من 6 أرقام
                  </p>
                </div>

                {/* حقل إدخال الرمز */}
                <div className="space-y-2">
                  <label
                    htmlFor="code"
                    className="text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    رمز التحقق (6 أرقام)
                  </label>
                  <Input
                    id="code"
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={6}
                    placeholder="000000"
                    value={code}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                      setCode(value);
                      form.setData('code', value);
                    }}
                    className="text-center text-2xl font-mono tracking-widest bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                    required
                    autoFocus
                  />
                  {form.errors.code && (
                    <p className="text-sm text-red-500">{form.errors.code}</p>
                  )}
                </div>

                {/* زر إعادة الإرسال */}
                <div className="flex items-center justify-center">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={handleResend}
                    className="text-sm"
                  >
                    <RefreshCw className="h-4 w-4 ml-2" />
                    إعادة إرسال الرمز
                  </Button>
                </div>

                {/* زر التحقق */}
                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  disabled={code.length !== 6}
                >
                  تحقق
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}

