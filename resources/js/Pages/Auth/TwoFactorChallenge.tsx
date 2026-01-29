/** @jsxImportSource react */
import { useState, useEffect, FormEvent } from 'react';
import { router, useForm, Head, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Mail, Shield, RefreshCw, AlertCircle } from 'lucide-react';
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
  const { auth } = usePage().props as any;
  const [code, setCode] = useState('');
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [isResending, setIsResending] = useState(false);

  const form = useForm({
    code: '',
  });

  // منع إعادة التوجيه التلقائية - الصفحة تبقى دائماً
  useEffect(() => {
    // لا نقوم بأي إعادة توجيه تلقائية
    // الصفحة تبقى حتى يتم إدخال الرمز بنجاح أو المستخدم يغادر يدوياً
    console.log('TwoFactorChallenge page loaded - staying on page');
  }, []);

  // حساب الوقت المتبقي (للعرض فقط - لا يؤثر على بقاء الصفحة)
  useEffect(() => {
    if (expires_at && expires_at > 0) {
      const updateTimer = () => {
        const now = Math.floor(Date.now() / 1000);
        const remaining = expires_at - now;
        // نعرض الوقت حتى لو كان سالباً (للعرض فقط)
        setTimeRemaining(remaining);
      };

      updateTimer();
      const interval = setInterval(updateTimer, 1000);

      return () => clearInterval(interval);
    } else {
      // إذا لم يكن هناك expires_at، نعرض رسالة
      setTimeRemaining(null);
    }
  }, [expires_at]);

  // عرض رسائل Flash
  useEffect(() => {
    if (flash?.success) {
      showToast.success('نجح', flash.success);
    }
    if (flash?.error) {
      showToast.error('خطأ', flash.error);
    }
  }, [flash]);

  const formatTime = (seconds: number): string => {
    // التعامل مع الأوقات السالبة (انتهى الوقت)
    const absSeconds = Math.abs(seconds);
    const mins = Math.floor(absSeconds / 60);
    const secs = absSeconds % 60;
    const sign = seconds < 0 ? '-' : '';
    return `${sign}${mins}:${secs.toString().padStart(2, '0')}`;
  };

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
    setIsResending(true);
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
        onFinish: () => {
          setIsResending(false);
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

                {/* عداد الوقت */}
                {timeRemaining !== null && timeRemaining > 0 && (
                  <div className="text-center">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      الوقت المتبقي:
                    </p>
                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {formatTime(timeRemaining)}
                    </p>
                  </div>
                )}

                {/* رسالة انتهاء الوقت - لكن الصفحة تبقى */}
                {timeRemaining !== null && timeRemaining <= 0 && (
                  <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                          انتهت صلاحية الرمز
                        </p>
                        <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                          يمكنك طلب رمز جديد أو المحاولة بالرمز القديم
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {timeRemaining === null && !expires_at && (
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                          جاري إرسال رمز التحقق...
                        </p>
                        <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                          يرجى الانتظار قليلاً
                        </p>
                      </div>
                    </div>
                  </div>
                )}

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
                    disabled={form.processing}
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
                    disabled={isResending || form.processing}
                    className="text-sm"
                  >
                    <RefreshCw
                      className={`h-4 w-4 ml-2 ${isResending ? 'animate-spin' : ''}`}
                    />
                    {isResending ? 'جاري الإرسال...' : 'إعادة إرسال الرمز'}
                  </Button>
                </div>

                {/* زر التحقق */}
                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  disabled={form.processing || code.length !== 6}
                >
                  {form.processing ? 'جاري التحقق...' : 'تحقق'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}

