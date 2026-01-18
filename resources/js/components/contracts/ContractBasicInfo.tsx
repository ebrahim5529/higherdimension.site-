/** @jsxImportSource react */
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { NationalitySelector } from '@/components/features/NationalitySelector';
import { AddressSelector } from '@/components/features/AddressSelector';
import { Customer } from '@/types/contracts';

interface ContractBasicInfoProps {
    contractDate: string;
    contractNumber: string;
    customerSearchQuery: string;
    showCustomerDropdown: boolean;
    filteredCustomers: Customer[];
    nationality: string;
    deliveryAddress: string;
    deliveryAddressDetails: {
        governorate?: string;
        wilayat?: string;
        region?: string;
        details?: string;
        fullAddress?: string;
    };
    locationMapLink: string;
    processing: boolean;
    errors: any;
    actions: {
        setCustomerSearchQuery: (val: string) => void;
        setShowCustomerDropdown: (val: boolean) => void;
        setSelectedCustomer: (customer: Customer | null) => void;
        setContractNumber: (val: string) => void;
        setNationality: (val: string) => void;
        setDeliveryAddress: (val: string) => void;
        setDeliveryAddressDetails: (address: {
            governorate?: string;
            wilayat?: string;
            region?: string;
            details?: string;
            fullAddress?: string;
        }) => void;
        setLocationMapLink: (val: string) => void;
        setContractDate: (val: string) => void;
        clearErrors: (field?: string) => void;
    };
}

export function ContractBasicInfo({
    contractDate,
    contractNumber,
    customerSearchQuery,
    showCustomerDropdown,
    filteredCustomers,
    nationality,
    deliveryAddress,
    deliveryAddressDetails,
    locationMapLink,
    processing,
    errors,
    actions,
}: ContractBasicInfoProps) {
    return (
        <Card className="p-6 mb-6">
            <div className="border-b border-gray-200 pb-4 mb-6">
                <h2 className="text-xl font-bold text-gray-900">معلومات العقد الأساسية</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* تاريخ العقد */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">تاريخ العقد *</label>
                    <Input
                        type="date"
                        value={contractDate}
                        onChange={(e) => actions.setContractDate(e.target.value)}
                        className={`w-full bg-white ${errors.contract_date ? 'border-red-500' : ''}`}
                        dir="ltr"
                        lang="en"
                        required
                    />
                    {errors.contract_date && (
                        <div className="text-red-500 text-sm mt-1 font-medium">{errors.contract_date}</div>
                    )}
                </div>

                {/* رقم العقد */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">رقم العقد *</label>
                    <Input
                        type="text"
                        value={contractNumber}
                        onChange={(e) => actions.setContractNumber(e.target.value)}
                        placeholder="رقم العقد"
                        className={`w-full bg-white ${errors.contract_number ? 'border-red-500' : ''}`}
                        required
                    />
                    {errors.contract_number && (
                        <div className="text-red-500 text-sm mt-1 font-medium">{errors.contract_number}</div>
                    )}
                </div>

                {/* العميل */}
                <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-2">العميل *</label>
                    <div className="relative">
                        <Input
                            type="text"
                            value={customerSearchQuery}
                            onChange={(e) => {
                                actions.setCustomerSearchQuery(e.target.value);
                                actions.setShowCustomerDropdown(true);
                                if (!e.target.value) {
                                    actions.setSelectedCustomer(null);
                                }
                            }}
                            onFocus={() => actions.setShowCustomerDropdown(true)}
                            placeholder="ابحث عن العميل بالاسم أو الهاتف..."
                            required
                            className={`w-full ${errors.customer_id ? 'border-red-500' : ''}`}
                        />
                        {errors.customer_id && (
                            <div className="text-red-500 text-sm mt-1 font-medium">{errors.customer_id}</div>
                        )}
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>

                        {showCustomerDropdown && (
                            <>
                                <div
                                    className="fixed inset-0 z-10"
                                    onClick={() => actions.setShowCustomerDropdown(false)}
                                />
                                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto z-20">
                                    {filteredCustomers.length > 0 ? (
                                        filteredCustomers.map((customer) => (
                                            <button
                                                key={customer.id}
                                                type="button"
                                                onClick={() => {
                                                    actions.setSelectedCustomer(customer);
                                                    actions.setCustomerSearchQuery(customer.name);
                                                    actions.setShowCustomerDropdown(false);
                                                    actions.clearErrors('customer_id');
                                                }}
                                                className="w-full text-right px-4 py-3 hover:bg-[#58d2c8]/10 transition-colors border-b border-gray-100 last:border-b-0"
                                            >
                                                <div className="font-medium text-gray-900">{customer.name}</div>
                                                <div className="flex items-center justify-between mt-1">
                                                    {customer.customer_number && (
                                                        <div className="text-xs text-gray-600">{customer.customer_number}</div>
                                                    )}
                                                    {customer.phone && (
                                                        <div className="text-sm text-gray-500" dir="ltr">
                                                            {customer.phone}
                                                        </div>
                                                    )}
                                                </div>
                                            </button>
                                        ))
                                    ) : (
                                        <div className="px-4 py-3 text-center text-gray-500">لا توجد نتائج</div>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* الجنسية - تلقائية من بيانات العميل */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">الجنسية</label>
                    <div className="relative">
                        <Input
                            type="text"
                            value={nationality || 'سيتم تحديدها تلقائياً من بيانات العميل'}
                            readOnly
                            className="w-full bg-gray-50 text-gray-500 cursor-not-allowed"
                        />
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">تُحدد تلقائياً من بيانات العميل المختار</p>
                </div>

                {/* عنوان الموقع */}
                <div className="md:col-span-2">
                    <AddressSelector
                        value={deliveryAddressDetails}
                        onChange={(addressData) => {
                            actions.setDeliveryAddressDetails(addressData);
                            actions.setDeliveryAddress(addressData.fullAddress || '');
                            actions.clearErrors('delivery_address');
                        }}
                        label="عنوان الموقع (موقع تنزيل المعدات)"
                        required={true}
                        disabled={processing}
                        error={errors.delivery_address}
                    />
                    {errors.delivery_address && (
                        <div className="text-red-500 text-sm mt-1 font-medium">{errors.delivery_address}</div>
                    )}
                </div>

                {/* رابط الموقع قوقل ماب */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">رابط الموقع قوقل ماب</label>
                    <Input
                        type="url"
                        value={locationMapLink}
                        onChange={(e) => actions.setLocationMapLink(e.target.value)}
                        placeholder="https://maps.google.com/..."
                        dir="ltr"
                        lang="en"
                        className={errors.location_map_link ? 'border-red-500' : ''}
                    />
                    {errors.location_map_link && (
                        <div className="text-red-500 text-sm mt-1 font-medium">{errors.location_map_link}</div>
                    )}
                    <p className="text-xs text-gray-500 mt-1">اختياري - يمكنك لصق رابط الموقع من قوقل ماب</p>
                </div>
            </div>
        </Card>
    );
}
