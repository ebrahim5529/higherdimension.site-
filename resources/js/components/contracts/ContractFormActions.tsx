/** @jsxImportSource react */
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Save, MessageSquare, FileText } from 'lucide-react';
import { router } from '@inertiajs/react';
import { showToast } from '@/hooks/use-toast';

interface ContractFormActionsProps {
    processing: boolean;
    isValid: boolean;
    onPreview: () => void;
    onSubmit: (e: React.FormEvent) => void;
    selectedCustomer: any;
}

export function ContractFormActions({
    processing,
    isValid,
    onPreview,
    onSubmit,
    selectedCustomer,
}: ContractFormActionsProps) {
    return (
        <Card className="p-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex flex-wrap gap-3">
                    <Button
                        type="submit"
                        disabled={processing}
                        className="bg-[#58d2c8] hover:bg-[#4AB8B3] text-white flex items-center gap-2"
                    >
                        <Save className="h-4 w-4" />
                        {processing ? 'جاري الحفظ...' : 'تخزين بيانات العقد'}
                    </Button>

                    <Button
                        type="button"
                        disabled={processing}
                        className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
                        onClick={async (e) => {
                            e.preventDefault();
                            if (!selectedCustomer) {
                                showToast.error('خطأ', 'يرجى اختيار العميل أولاً');
                                return;
                            }
                            onSubmit(e);
                        }}
                    >
                        <MessageSquare className="h-4 w-4" />
                        إرسال للعميل عبر الواتساب
                    </Button>

                    <Button
                        type="button"
                        onClick={onPreview}
                        disabled={processing}
                        className="bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-2"
                    >
                        <FileText className="h-4 w-4" />
                        عرض نموذج الفاتورة
                    </Button>
                </div>

                <Button
                    type="button"
                    onClick={() => router.visit('/contracts')}
                    disabled={processing}
                    className="bg-gray-500 hover:bg-gray-600 text-white"
                >
                    إلغاء
                </Button>
            </div>

            {!isValid && (
                <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-yellow-800 text-sm">
                        ⚠️ يرجى ملء جميع الحقول المطلوبة (*) وإضافة معدة واحدة على الأقل
                    </p>
                </div>
            )}
        </Card>
    );
}
