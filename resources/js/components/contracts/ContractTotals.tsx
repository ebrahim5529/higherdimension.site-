/** @jsxImportSource react */
import { Input } from '@/components/ui/input';
import { convertArabicToEnglishNumbers } from '@/lib/utils';

interface ContractTotalsProps {
    transportCost: number;
    totalDiscount: number;
    totalAfterDiscount: number;
    actions: {
        setTransportCost: (val: number) => void;
        setTotalDiscount: (val: number) => void;
    };
}

export function ContractTotals({
    transportCost,
    totalDiscount,
    totalAfterDiscount,
    actions,
}: ContractTotalsProps) {
    const handleTransportChange = (val: string) => {
        const convertedValue = convertArabicToEnglishNumbers(val);
        const value = convertedValue === '' ? 0 : Number(convertedValue) || 0;
        actions.setTransportCost(value);
    };

    const handleDiscountChange = (val: string) => {
        const convertedValue = convertArabicToEnglishNumbers(val);
        const value = convertedValue === '' ? 0 : Number(convertedValue) || 0;
        actions.setTotalDiscount(value);
    };

    return (
        <div className="mt-6 p-6 bg-blue-50 rounded-lg border border-blue-200 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        قيمة النقل والتحميل والتنزيل (ر.ع)
                    </label>
                    <Input
                        type="text"
                        value={transportCost}
                        onChange={(e) => handleTransportChange(e.target.value)}
                        dir="ltr"
                        lang="en"
                        className="bg-white"
                        placeholder="0"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        إجمالي الخصم (ر.ع)
                    </label>
                    <Input
                        type="text"
                        value={totalDiscount}
                        onChange={(e) => handleDiscountChange(e.target.value)}
                        dir="ltr"
                        lang="en"
                        className="bg-white"
                        placeholder="0"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        إجمالي العقد بعد الخصم (ر.ع)
                    </label>
                    <Input
                        type="text"
                        value={totalAfterDiscount.toFixed(2)}
                        className="w-full bg-gray-100 font-bold text-[#58d2c8] text-lg"
                        dir="ltr"
                        lang="en"
                        readOnly
                    />
                </div>
            </div>
        </div>
    );
}
