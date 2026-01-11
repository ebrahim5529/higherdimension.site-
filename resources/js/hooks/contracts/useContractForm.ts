import { useForm, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { Customer, Scaffold, RentalDetail, PaymentDetail } from '@/types/contracts';
import { showToast } from '@/hooks/use-toast';
import { convertArabicToEnglishNumbers } from '@/lib/utils';

export function useContractForm(customers: Customer[]) {
    const { flash } = usePage().props as any;
    const [customerSearchQuery, setCustomerSearchQuery] = useState('');
    const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
    const [contractNumber, setContractNumber] = useState(() => `CON-${Date.now()}`);
    const [transportCost, setTransportCost] = useState(0);
    const [totalDiscount, setTotalDiscount] = useState(0);
    const [whatsappModalOpen, setWhatsappModalOpen] = useState(false);
    const [previewModalOpen, setPreviewModalOpen] = useState(false);
    const [deliveryAddress, setDeliveryAddress] = useState('');
    const [locationMapLink, setLocationMapLink] = useState('');
    const [nationality, setNationality] = useState('');
    const [createdContract, setCreatedContract] = useState<any>(null);

    const contractDate = new Date().toISOString().split('T')[0];
    const initialStartDate = new Date().toISOString().split('T')[0];

    const calculateEndDate = (startDate: string, duration: number, durationType: 'daily' | 'monthly'): string => {
        if (!startDate || !duration) return '';
        const start = new Date(startDate);
        if (durationType === 'daily') {
            start.setDate(start.getDate() + duration);
        } else {
            start.setMonth(start.getMonth() + duration);
        }
        return start.toISOString().split('T')[0];
    };

    const initialEndDate = calculateEndDate(initialStartDate, 1, 'monthly');

    const [rentalDetails, setRentalDetails] = useState<RentalDetail[]>([
        {
            id: Date.now().toString(),
            scaffoldId: undefined,
            scaffold: null,
            itemCode: '',
            itemDescription: '',
            startDate: initialStartDate,
            endDate: initialEndDate,
            duration: 1,
            durationType: 'monthly',
            quantity: 1,
            dailyRate: 0,
            monthlyRate: 0,
            total: 0,
        },
    ]);

    const [payments, setPayments] = useState<PaymentDetail[]>([
        {
            id: Date.now().toString(),
            paymentMethod: 'cash',
            paymentDate: new Date().toISOString().split('T')[0],
            amount: 0,
        },
    ]);

    const calculateRentalTotal = (rental: RentalDetail): number => {
        if (rental.durationType === 'daily') {
            return rental.quantity * rental.dailyRate * rental.duration;
        } else {
            return rental.quantity * rental.monthlyRate * rental.duration;
        }
    };

    const updateRentalDetail = (id: string, field: keyof RentalDetail, value: any) => {
        setRentalDetails((prev) =>
            prev.map((rental) => {
                if (rental.id === id) {
                    const updated = { ...rental, [field]: value };
                    if (field === 'startDate' || field === 'duration' || field === 'durationType') {
                        updated.endDate = calculateEndDate(
                            field === 'startDate' ? value : updated.startDate,
                            field === 'duration' ? value : updated.duration,
                            field === 'durationType' ? value : updated.durationType
                        );
                    }
                    if (field === 'quantity' || field === 'dailyRate' || field === 'monthlyRate' || field === 'duration' || field === 'durationType') {
                        updated.total = calculateRentalTotal(updated);
                    }
                    return updated;
                }
                return rental;
            })
        );
    };

    const handleScaffoldChange = (id: string, scaffold: Scaffold | null) => {
        setRentalDetails((prev) =>
            prev.map((rental) => {
                if (rental.id === id && scaffold) {
                    return {
                        ...rental,
                        scaffoldId: scaffold.id,
                        scaffold: scaffold,
                        itemCode: scaffold.scaffold_number,
                        itemDescription: scaffold.description_ar || scaffold.description_en || '',
                        dailyRate: scaffold.daily_rental_price || 0,
                        monthlyRate: scaffold.monthly_rental_price || 0,
                        total: calculateRentalTotal({
                            ...rental,
                            dailyRate: scaffold.daily_rental_price || 0,
                            monthlyRate: scaffold.monthly_rental_price || 0,
                        }),
                    };
                }
                return rental;
            })
        );
    };

    const handleAddRentalItem = () => {
        const startDate = new Date().toISOString().split('T')[0];
        const newRental: RentalDetail = {
            id: Date.now().toString(),
            scaffoldId: undefined,
            scaffold: null,
            itemCode: '',
            itemDescription: '',
            startDate: startDate,
            endDate: calculateEndDate(startDate, 1, 'monthly'),
            duration: 1,
            durationType: 'monthly',
            quantity: 1,
            dailyRate: 0,
            monthlyRate: 0,
            total: 0,
        };
        setRentalDetails((prev) => [...prev, newRental]);
    };

    const handleDeleteRentalItem = (id: string) => {
        setRentalDetails((prev) => prev.filter((rental) => rental.id !== id));
    };

    const handleAddPayment = () => {
        setPayments((prev) => [
            ...prev,
            {
                id: Date.now().toString(),
                paymentMethod: 'cash',
                paymentDate: new Date().toISOString().split('T')[0],
                amount: 0,
                checkNumber: '',
                bankName: '',
                checkDate: '',
                checkImage: null,
                checkImagePath: null,
            },
        ]);
    };

    const updatePayment = (id: string, field: keyof PaymentDetail, value: any) => {
        setPayments((prev) =>
            prev.map((payment) => {
                if (payment.id === id) {
                    const updated = { ...payment, [field]: value };
                    if (field === 'paymentMethod' && value !== 'check') {
                        updated.checkNumber = '';
                        updated.bankName = '';
                        updated.checkDate = '';
                        updated.checkImage = null;
                    }
                    return updated;
                }
                return payment;
            })
        );
    };

    const handleCheckImageChange = (id: string, file: File | null) => {
        setPayments((prev) =>
            prev.map((payment) => (payment.id === id ? { ...payment, checkImage: file } : payment))
        );
    };

    const handleDeletePayment = (id: string) => {
        setPayments((prev) => prev.filter((payment) => payment.id !== id));
    };

    const rentalTotal = rentalDetails.reduce((sum, rental) => sum + rental.total, 0);
    const totalContractValue = rentalTotal + transportCost;
    const totalAfterDiscount = totalContractValue - totalDiscount;
    const totalPayments = payments.reduce((sum, payment) => sum + payment.amount, 0);
    const remainingAmount = totalAfterDiscount - totalPayments;

    const isFormValid = () => {
        if (!selectedCustomer || !contractDate || !contractNumber || !deliveryAddress) return false;
        if (rentalDetails.length === 0) return false;
        return rentalDetails.every(
            (rental) =>
                rental.scaffoldId &&
                rental.startDate &&
                rental.duration > 0 &&
                rental.quantity > 0
        );
    };

    const { data, setData, post, processing, errors, clearErrors } = useForm({
        contract_number: contractNumber,
        contract_date: contractDate,
        customer_id: selectedCustomer?.id || null,
        delivery_address: deliveryAddress,
        location_map_link: locationMapLink,
        nationality: nationality,
        transport_and_installation_cost: transportCost,
        total_discount: totalDiscount,
        contract_notes: '',
        rental_details: rentalDetails,
        payments: payments,
    });

    useEffect(() => {
        setData((prev: any) => ({
            ...prev,
            contract_number: contractNumber,
            contract_date: contractDate,
            customer_id: selectedCustomer?.id || null,
            delivery_address: deliveryAddress,
            location_map_link: locationMapLink,
            nationality: nationality,
            transport_and_installation_cost: transportCost,
            total_discount: totalDiscount,
            rental_details: rentalDetails.map((rental) => ({
                scaffold_id: rental.scaffoldId || null,
                item_code: rental.itemCode,
                item_description: rental.itemDescription,
                start_date: rental.startDate,
                end_date: rental.endDate,
                duration: rental.duration,
                duration_type: rental.durationType,
                quantity: rental.quantity,
                daily_rate: rental.dailyRate,
                monthly_rate: rental.monthlyRate,
                total: rental.total,
            })),
            payments: payments.map((payment) => ({
                payment_method: payment.paymentMethod,
                payment_date: payment.paymentDate,
                amount: payment.amount,
                check_number: payment.checkNumber || null,
                bank_name: payment.bankName || null,
                check_date: payment.checkDate || null,
                check_image: payment.checkImage || null,
            })),
        }));
    }, [
        contractNumber,
        contractDate,
        selectedCustomer,
        deliveryAddress,
        locationMapLink,
        nationality,
        transportCost,
        totalDiscount,
        rentalDetails,
        payments,
    ]);

    useEffect(() => {
        if (selectedCustomer && (selectedCustomer as any).nationality) {
            setNationality((selectedCustomer as any).nationality);
        }
    }, [selectedCustomer]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        post('/contracts', {
            preserveScroll: true,
            onSuccess: (page) => {
                showToast.success('تم الإنشاء بنجاح', 'تم إضافة العقد بنجاح');

                const flash = (page.props as any)?.flash || {};
                const contractData = flash.contract || null;

                if (contractData && contractData.contract_number) {
                    setContractNumber(contractData.contract_number);

                    setCreatedContract({
                        id: contractData.id,
                        contract_number: contractData.contract_number,
                        customer_name: selectedCustomer?.name || contractData.customer_name || '',
                        total_amount: contractData.total_amount || totalAfterDiscount,
                        contract_date: contractData.contract_date || contractDate,
                        contract_type: contractData.contract_type || 'تأجير معدات بناء',
                    });
                }
                setWhatsappModalOpen(true);
            },
            onError: (errors) => {
                const errorLabels: Record<string, string> = {
                    'customer_id': 'العميل',
                    'contract_number': 'رقم العقد',
                    'contract_date': 'تاريخ العقد',
                    'delivery_address': 'عنوان الموقع',
                    'location_map_link': 'رابط الموقع',
                    'transport_and_installation_cost': 'تكلفة النقل والتركيب',
                    'total_discount': 'الخصم الإجمالي',
                    'contract_notes': 'ملاحظات العقد',
                    'rental_details': 'تفاصيل الإيجار',
                    'scaffold_id': 'المعدة',
                    'item_code': 'رمز المعدة',
                    'item_description': 'وصف المعدة',
                    'start_date': 'تاريخ بداية الإيجار',
                    'end_date': 'تاريخ نهاية الإيجار',
                    'duration': 'المدة',
                    'duration_type': 'نوع المدة',
                    'quantity': 'الكمية',
                    'daily_rate': 'السعر اليومي',
                    'monthly_rate': 'السعر الشهري',
                    'total': 'الإجمالي',
                    'payments': 'المدفوعات',
                    'payment_method': 'طريقة الدفع',
                    'payment_date': 'تاريخ الدفع',
                    'amount': 'المبلغ',
                    'check_number': 'رقم الشيك',
                    'bank_name': 'البنك',
                    'check_date': 'تاريخ الشيك',
                    'check_image': 'صورة الشيك',
                };

                const translateErrorMessage = (message: string): string => {
                    if (message.includes('field is required') || message.includes('is required')) return 'هذا الحقل مطلوب';
                    if (message.includes('must be a valid date') || message.includes('valid date')) return 'يرجى إدخال تاريخ صحيح';
                    if (message.includes('must be a valid number') || message.includes('must be numeric')) return 'يرجى إدخال رقم صحيح';
                    if (message.includes('must be unique')) return 'هذه القيمة مستخدمة مسبقاً';
                    if (message.includes('is invalid') || message.includes('invalid')) return 'القيمة غير صحيحة';
                    return message;
                };

                const extractErrors = (obj: any, parentKey = ''): string[] => {
                    const errorMessages: string[] = [];
                    Object.keys(obj).forEach((key) => {
                        const value = obj[key];
                        const fullKey = parentKey ? `${parentKey}.${key}` : key;
                        if (Array.isArray(value)) {
                            value.forEach((item) => {
                                if (typeof item === 'string') {
                                    let label = errorLabels[key] || key;
                                    const rentalMatch = fullKey.match(/^rental_details\.(\d+)\.(.+)$/);
                                    if (rentalMatch) {
                                        const rentalIndex = parseInt(rentalMatch[1]) + 1;
                                        const fieldName = errorLabels[rentalMatch[2]] || rentalMatch[2];
                                        label = `${fieldName} (المعدة رقم ${rentalIndex})`;
                                    }
                                    errorMessages.push(`${label}: ${translateErrorMessage(item)}`);
                                }
                            });
                        } else if (typeof value === 'string') {
                            let label = errorLabels[key] || key;
                            errorMessages.push(`${label}: ${translateErrorMessage(value)}`);
                        }
                    });
                    return errorMessages;
                };

                const errorMessages = extractErrors(errors);
                if (errorMessages.length > 0) {
                    showToast.error('خطأ في البيانات', errorMessages[0]);
                } else {
                    showToast.error('خطأ في البيانات', 'يرجى التحقق من جميع الحقول المطلوبة وإعادة المحاولة');
                }
            },
        });
    };

    const filteredCustomers = customers.filter(
        (customer) =>
            customer.name?.toLowerCase().includes(customerSearchQuery.toLowerCase()) ||
            customer.phone?.includes(customerSearchQuery) ||
            customer.customer_number?.includes(customerSearchQuery)
    );

    return {
        state: {
            customerSearchQuery,
            showCustomerDropdown,
            selectedCustomer,
            contractNumber,
            contractDate,
            rentalDetails,
            payments,
            transportCost,
            totalDiscount,
            whatsappModalOpen,
            previewModalOpen,
            deliveryAddress,
            locationMapLink,
            nationality,
            createdContract,
            rentalTotal,
            totalAfterDiscount,
            remainingAmount,
            processing,
            errors,
            filteredCustomers,
            isFormValid,
        },
        actions: {
            setCustomerSearchQuery,
            setShowCustomerDropdown,
            setSelectedCustomer,
            setContractNumber,
            setTransportCost,
            setTotalDiscount,
            setWhatsappModalOpen,
            setPreviewModalOpen,
            setDeliveryAddress,
            setLocationMapLink,
            setNationality,
            setContractDate: (val: string) => setData('contract_date' as any, val),
            updateRentalDetail,
            handleScaffoldChange,
            handleAddRentalItem,
            handleDeleteRentalItem,
            handleAddPayment,
            updatePayment,
            handleCheckImageChange,
            handleDeletePayment,
            handleSubmit,
            clearErrors,
        },
    };
}
