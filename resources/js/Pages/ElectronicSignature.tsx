/** @jsxImportSource react */
import { Head, useForm, usePage } from '@inertiajs/react';
import { useEffect, useMemo, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { showToast } from '@/hooks/use-toast';
import DigitalSignature from '@/components/features/DigitalSignature';

type SignaturePayload = {
  id: number;
  company_name: string;
  signer_name: string;
  signer_title: string;
  signature_url: string | null;
  is_active: boolean;
};

interface ElectronicSignaturePageProps {
  signature: SignaturePayload | null;
}

export default function ElectronicSignature({ signature }: ElectronicSignaturePageProps) {
  const { flash } = usePage().props as any;
  const [previewUrl, setPreviewUrl] = useState<string | null>(signature?.signature_url ?? null);

  const { data, setData, post, processing, errors, reset } = useForm({
    company_name: signature?.company_name ?? '',
    signer_name: signature?.signer_name ?? '',
    signer_title: signature?.signer_title ?? '',
    signature_file: null as File | null,
    signature: '' as string,
  });

  useEffect(() => {
    if (flash?.success) {
      showToast.success('نجح', flash.success);
    }
    if (flash?.error) {
      showToast.error('خطأ', flash.error);
    }
  }, [flash]);

  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const hasDrawnSignature = useMemo(() => Boolean(data.signature), [data.signature]);

  const onFileChange = (file: File | null) => {
    setData('signature_file', file);
    setData('signature', '');

    if (previewUrl && previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl);
    }

    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setPreviewUrl(signature?.signature_url ?? null);
    }
  };

  const onDrawSignature = (dataUrl: string) => {
    setData('signature', dataUrl);
    setData('signature_file', null);

    if (previewUrl && previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl);
    }

    setPreviewUrl(dataUrl);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    post('/dashboard/electronic-signature', {
      forceFormData: true,
      onSuccess: () => {
        reset('signature_file');
      },
    });
  };

  return (
    <DashboardLayout>
      <Head title="التوقيع الإلكتروني" />

      <div className="space-y-6 mt-2 -mx-1 sm:-mx-2 lg:-mx-3 xl:-mx-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">التوقيع الإلكتروني</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">إعدادات توقيع الشركة</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">اسم الشركة</label>
                  <Input
                    value={data.company_name}
                    onChange={(e) => setData('company_name', e.target.value)}
                    disabled={processing}
                  />
                  {errors.company_name && (
                    <p className="text-red-500 text-xs mt-1">{errors.company_name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">اسم الموقّع</label>
                  <Input
                    value={data.signer_name}
                    onChange={(e) => setData('signer_name', e.target.value)}
                    disabled={processing}
                  />
                  {errors.signer_name && (
                    <p className="text-red-500 text-xs mt-1">{errors.signer_name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">منصب الموقّع</label>
                  <Input
                    value={data.signer_title}
                    onChange={(e) => setData('signer_title', e.target.value)}
                    disabled={processing}
                  />
                  {errors.signer_title && (
                    <p className="text-red-500 text-xs mt-1">{errors.signer_title}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="block text-sm font-medium">رفع صورة التوقيع</label>
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/jpg"
                    onChange={(e) => onFileChange(e.target.files?.[0] ?? null)}
                    disabled={processing}
                    className="block w-full text-sm text-gray-700 dark:text-gray-200"
                  />
                  {errors.signature_file && (
                    <p className="text-red-500 text-xs">{errors.signature_file}</p>
                  )}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => onFileChange(null)}
                    disabled={processing}
                  >
                    إزالة الملف
                  </Button>
                </div>

                <div className="space-y-3">
                  <label className="block text-sm font-medium">أو ارسم التوقيع</label>
                  <div className="border rounded-lg p-3 bg-white dark:bg-gray-900">
                    <DigitalSignature
                      onSignatureComplete={onDrawSignature}
                      onSignatureClear={() => {
                        setData('signature', '');
                        setPreviewUrl(signature?.signature_url ?? null);
                      }}
                      width={420}
                      height={160}
                      strokeColor="#000000"
                      strokeWidth={2}
                    />
                  </div>
                  {errors.signature && (
                    <p className="text-red-500 text-xs">{errors.signature}</p>
                  )}
                  {hasDrawnSignature && (
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      تم التقاط توقيع مرسوم وسيتم حفظه.
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium">معاينة التوقيع</label>
                <div className="border rounded-lg p-3 bg-white dark:bg-gray-900 min-h-[120px] flex items-center justify-center">
                  {previewUrl ? (
                    <img
                      src={previewUrl}
                      alt="معاينة التوقيع"
                      className="max-h-[140px] max-w-full object-contain"
                    />
                  ) : (
                    <span className="text-sm text-gray-500">لا يوجد توقيع حالياً</span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Button type="submit" className="bg-[#58d2c8] hover:bg-[#4AB8B3]" disabled={processing}>
                  {processing ? 'جاري الحفظ...' : 'حفظ'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
