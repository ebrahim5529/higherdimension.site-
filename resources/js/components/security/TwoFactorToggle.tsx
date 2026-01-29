/** @jsxImportSource react */
import { useState } from 'react';
import { router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Shield, ShieldCheck, ShieldOff, AlertCircle } from 'lucide-react';
import { showToast } from '@/hooks/use-toast';

interface TwoFactorToggleProps {
  enabled: boolean;
}

export default function TwoFactorToggle({ enabled }: TwoFactorToggleProps) {
  const [showDisableDialog, setShowDisableDialog] = useState(false);
  const [password, setPassword] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleEnable = () => {
    setIsProcessing(true);
    router.post(
      '/profile/two-factor/enable',
      {},
      {
        onSuccess: () => {
          showToast.success('نجح', 'تم تفعيل المصادقة الثنائية بنجاح');
        },
        onError: () => {
          showToast.error('خطأ', 'فشل تفعيل المصادقة الثنائية');
        },
        onFinish: () => {
          setIsProcessing(false);
        },
      }
    );
  };

  const handleDisable = () => {
    if (!password) {
      showToast.error('خطأ', 'يرجى إدخال كلمة المرور');
      return;
    }

    setIsProcessing(true);
    router.post(
      '/profile/two-factor/disable',
      { password },
      {
        onSuccess: () => {
          showToast.success('نجح', 'تم إلغاء تفعيل المصادقة الثنائية بنجاح');
          setShowDisableDialog(false);
          setPassword('');
        },
        onError: (errors) => {
          if (errors.password) {
            showToast.error('خطأ', errors.password);
          } else {
            showToast.error('خطأ', 'فشل إلغاء تفعيل المصادقة الثنائية');
          }
        },
        onFinish: () => {
          setIsProcessing(false);
        },
      }
    );
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {enabled ? (
              <ShieldCheck className="h-5 w-5 text-green-600" />
            ) : (
              <Shield className="h-5 w-5 text-gray-400" />
            )}
            المصادقة الثنائية (2FA)
          </CardTitle>
          <CardDescription>
            {enabled
              ? 'المصادقة الثنائية مفعّلة. سيتم إرسال رمز OTP للبريد عند تسجيل الدخول من أجهزة جديدة.'
              : 'قم بتفعيل المصادقة الثنائية لحماية حسابك بشكل أفضل.'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {enabled ? (
            <>
              <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-green-800 dark:text-green-200">
                      المصادقة الثنائية مفعّلة
                    </p>
                    <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                      عند تسجيل الدخول من جهاز جديد، سيتم إرسال رمز OTP (6 أرقام) إلى بريدك
                      الإلكتروني. الرمز صالح لمدة 10 دقائق فقط.
                    </p>
                  </div>
                </div>
              </div>
              <Button
                variant="destructive"
                onClick={() => setShowDisableDialog(true)}
                disabled={isProcessing}
                className="w-full"
              >
                <ShieldOff className="h-4 w-4 ml-2" />
                إلغاء تفعيل المصادقة الثنائية
              </Button>
            </>
          ) : (
            <>
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                      كيف تعمل المصادقة الثنائية؟
                    </p>
                    <ul className="text-sm text-blue-700 dark:text-blue-300 mt-2 space-y-1 list-disc list-inside">
                      <li>عند تفعيلها، سيتم إرسال رمز OTP للبريد عند تسجيل الدخول من أجهزة جديدة</li>
                      <li>الرمز صالح لمدة 10 دقائق فقط</li>
                      <li>الأجهزة المعروفة لن تحتاج لرمز OTP</li>
                    </ul>
                  </div>
                </div>
              </div>
              <Button
                onClick={handleEnable}
                disabled={isProcessing}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                <Shield className="h-4 w-4 ml-2" />
                {isProcessing ? 'جاري التفعيل...' : 'تفعيل المصادقة الثنائية'}
              </Button>
            </>
          )}
        </CardContent>
      </Card>

      {/* Dialog لإلغاء التفعيل */}
      <Dialog open={showDisableDialog} onOpenChange={setShowDisableDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>إلغاء تفعيل المصادقة الثنائية</DialogTitle>
            <DialogDescription>
              يرجى إدخال كلمة المرور لتأكيد إلغاء تفعيل المصادقة الثنائية. سيتم إلغاء الحماية
              الإضافية لحسابك.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="password">كلمة المرور</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="أدخل كلمة المرور"
                disabled={isProcessing}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowDisableDialog(false);
                setPassword('');
              }}
              disabled={isProcessing}
            >
              إلغاء
            </Button>
            <Button variant="destructive" onClick={handleDisable} disabled={isProcessing}>
              {isProcessing ? 'جاري الإلغاء...' : 'إلغاء التفعيل'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

