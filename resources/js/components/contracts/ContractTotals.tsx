/** @jsxImportSource react */
import { useState, useEffect } from 'react';
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
    const [localTransport, setLocalTransport] = useState<string>(transportCost !== undefined && transportCost !== null ? transportCost.toString() : '');
    const [localDiscount, setLocalDiscount] = useState<string>(totalDiscount !== undefined && totalDiscount !== null ? totalDiscount.toString() : '');

    useEffect(() => {
        const numericLocalTransport = parseFloat(localTransport);
        if (isNaN(numericLocalTransport) ? transportCost !== 0 : numericLocalTransport !== transportCost) {
            setLocalTransport(transportCost !== undefined && transportCost !== null ? transportCost.toString() : '');
        }
    }, [transportCost]);

    useEffect(() => {
        const numericLocalDiscount = parseFloat(localDiscount);
        if (isNaN(numericLocalDiscount) ? totalDiscount !== 0 : numericLocalDiscount !== totalDiscount) {
            setLocalDiscount(totalDiscount !== undefined && totalDiscount !== null ? totalDiscount.toString() : '');
        }
    }, [totalDiscount]);

    const handleTransportChange = (val: string) => {
        const convertedValue = convertArabicToEnglishNumbers(val);
        setLocalTransport(convertedValue);
        
        if (convertedValue === '' || convertedValue === '.') {
            actions.setTransportCost(0);
            return;
        }

        const value = parseFloat(convertedValue);
        if (!isNaN(value) && isFinite(value) && value >= 0) {
            actions.setTransportCost(value);
        }
    };

    const handleDiscountChange = (val: string) => {
        const convertedValue = convertArabicToEnglishNumbers(val);
        setLocalDiscount(convertedValue);

        if (convertedValue === '' || convertedValue === '.') {
            actions.setTotalDiscount(0);
            return;
        }

        const value = parseFloat(convertedValue);
        if (!isNaN(value) && isFinite(value) && value >= 0) {
            actions.setTotalDiscount(value);
        }
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
                        value={localTransport}
                        onChange={(e) => handleTransportChange(e.target.value)}
                        dir="ltr"
                        lang="en"
                        className="bg-white"
                        placeholder="0.00"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        إجمالي الخصم (ر.ع)
                    </label>
                    <Input
                        type="text"
                        value={localDiscount}
                        onChange={(e) => handleDiscountChange(e.target.value)}
                        dir="ltr"
                        lang="en"
                        className="bg-white"
                        placeholder="0.00"
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
