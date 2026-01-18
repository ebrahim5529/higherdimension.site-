/** @jsxImportSource react */
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { showToast } from '@/hooks/use-toast';
import { FileText, Save, ArrowLeft, Plus, Trash2, MessageSquare, Package } from 'lucide-react';
import { ScaffoldSelector } from '@/components/features/ScaffoldSelector';
import { AddressSelector } from '@/components/features/AddressSelector';
import { convertArabicToEnglishNumbers } from '@/lib/utils';

interface Customer {
  id: number;
  name: string;
  customer_number: string;
  phone?: string;
}

interface Scaffold {
  id: number;
  scaffold_number: string;
  description_ar?: string;
  description_en?: string;
  daily_rental_price: number;
  monthly_rental_price: number;
  available_quantity: number;
}

interface RentalDetail {
  id: string;
  scaffoldId?: number;
  scaffold?: Scaffold | null;
  itemCode: string;
  itemDescription: string;
  startDate: string;
  endDate: string;
  duration: number;
  durationType: 'daily' | 'monthly';
  quantity: number;
  dailyRate: number;
  monthlyRate: number;
  total: number;
}

interface PaymentDetail {
  id: string;
  paymentMethod: 'cash' | 'check' | 'credit_card' | 'bank_transfer';
  paymentDate: string;
  amount: number;
  checkNumber?: string;
  bankName?: string;
  checkDate?: string;
  checkImage?: File | null;
  checkImagePath?: string | null;
}

interface Contract {
  id: number;
  contract_number: string;
  contract_date: string;
  customer_id: number;
  delivery_address: string;
  delivery_address_details?: {
    governorate?: string;
    wilayat?: string;
    region?: string;
    details?: string;
    fullAddress?: string;
  };
  location_map_link?: string | null;
  transport_and_installation_cost: number;
  total_discount: number;
  contract_notes?: string | null;
  status: string;
  equipment: Array<{
    id: number;
    scaffold_id?: number | null;
    scaffold?: Scaffold | null;
    item_code?: string | null;
    item_description?: string | null;
    start_date: string;
    end_date: string;
    duration: number;
    duration_type: 'daily' | 'monthly';
    quantity: number;
    daily_rate: number;
    monthly_rate: number;
    total: number;
  }>;
  payments: Array<{
    id: number;
    payment_method: string;
    payment_date: string;
    amount: number;
  }>;
}

interface EditContractProps {
  contract: Contract;
  customers: Customer[];
}

export default function EditContract({ contract, customers }: EditContractProps) {
  const { flash } = usePage().props as any;
  const initialCustomer = customers.find((c) => c.id === contract.customer_id) || null;
  const [customerSearchQuery, setCustomerSearchQuery] = useState(initialCustomer?.name || '');
  const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(initialCustomer);
  const [rentalDetails, setRentalDetails] = useState<RentalDetail[]>(
    contract.equipment.map((item) => ({
      id: `equipment-${item.id}`,
      scaffoldId: item.scaffold_id || undefined,
      scaffold: item.scaffold || null,
      itemCode: item.item_code || '',
      itemDescription: item.item_description || '',
      startDate: item.start_date,
      endDate: item.end_date,
      duration: Number(item.duration) || 1,
      durationType: item.duration_type,
      quantity: Number(item.quantity) || 1,
      dailyRate: Number(item.daily_rate) || 0,
      monthlyRate: Number(item.monthly_rate) || 0,
      discount: Number(item.discount) || 0,
      total: Number(item.total) || 0,
    }))
  );
  const [payments, setPayments] = useState<PaymentDetail[]>(
    contract.payments.length > 0
      ? contract.payments.map((payment: any) => ({
        id: `payment-${payment.id}`,
        paymentMethod: payment.payment_method as any,
        paymentDate: payment.payment_date,
        amount: Number(payment.amount) || 0,
        checkNumber: payment.check_number || '',
        bankName: payment.bank_name || '',
        checkDate: payment.check_date || '',
        checkImage: null,
        checkImagePath: payment.check_image_path || null,
      }))
      : [
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
      ]
  );
  const [transportCost, setTransportCost] = useState(Number(contract.transport_and_installation_cost) || 0);
  const [totalDiscount, setTotalDiscount] = useState(Number(contract.total_discount) || 0);
  const [deliveryAddress, setDeliveryAddress] = useState(contract.delivery_address || '');
  const [deliveryAddressDetails, setDeliveryAddressDetails] = useState<{
    governorate?: string;
    wilayat?: string;
    region?: string;
    details?: string;
    fullAddress?: string;
  }>(contract.delivery_address_details || {});
  const [locationMapLink, setLocationMapLink] = useState(contract.location_map_link || '');

  useEffect(() => {
    if (flash?.success) {
      showToast.success('نجح', flash.success);
    }
    if (flash?.error) {
      showToast.error('خطأ', flash.error);
    }
  }, [flash]);

  // حساب تاريخ النهاية
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

  // حساب الإجمالي لكل معدة
  const calculateRentalTotal = (rental: RentalDetail): number => {
    if (rental.durationType === 'daily') {
      return rental.quantity * rental.dailyRate * rental.duration;
    } else {
      return rental.quantity * rental.monthlyRate * rental.duration;
    }
  };

  // تحديث معدة
  const updateRentalDetail = (id: string, field: keyof RentalDetail, value: any) => {
    setRentalDetails((prev) =>
      prev.map((rental) => {
        if (rental.id === id) {
          const updated = { ...rental, [field]: value };

          // حساب تاريخ النهاية تلقائياً
          if (field === 'startDate' || field === 'duration' || field === 'durationType') {
            updated.endDate = calculateEndDate(
              field === 'startDate' ? value : updated.startDate,
              field === 'duration' ? value : updated.duration,
              field === 'durationType' ? value : updated.durationType
            );
          }

          // حساب الإجمالي تلقائياً
          if (field === 'quantity' || field === 'dailyRate' || field === 'monthlyRate' || field === 'duration' || field === 'durationType') {
            updated.total = calculateRentalTotal(updated);
          }

          return updated;
        }
        return rental;
      })
    );
  };

  // تحديث السقالة المختارة
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

  // إضافة معدة جديدة
  const handleAddRentalItem = () => {
    setRentalDetails((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        scaffoldId: undefined,
        scaffold: null,
        itemCode: '',
        itemDescription: '',
        startDate: new Date().toISOString().split('T')[0],
        endDate: '',
        duration: 1,
        durationType: 'monthly',
        quantity: 1,
        dailyRate: 0,
        monthlyRate: 0,
        total: 0,
      },
    ]);
  };

  // حذف معدة
  const handleDeleteRentalItem = (id: string) => {
    setRentalDetails((prev) => prev.filter((rental) => rental.id !== id));
  };

  // إضافة دفعة جديدة
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

  // تحديث دفعة
  const updatePayment = (id: string, field: keyof PaymentDetail, value: any) => {
    setPayments((prev) =>
      prev.map((payment) => {
        if (payment.id === id) {
          const updated = { ...payment, [field]: value };
          // إذا تم تغيير طريقة الدفع إلى غير شيكات، احذف بيانات الشيك
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

  // معالجة رفع صورة الشيك
  const handleCheckImageChange = (id: string, file: File | null) => {
    setPayments((prev) =>
      prev.map((payment) => (payment.id === id ? { ...payment, checkImage: file } : payment))
    );
  };

  // حذف دفعة
  const handleDeletePayment = (id: string) => {
    setPayments((prev) => prev.filter((payment) => payment.id !== id));
  };

  // حساب الإجماليات
  const rentalTotal = rentalDetails.reduce((sum, rental) => sum + rental.total, 0);
  const totalContractValue = rentalTotal + transportCost;
  const totalAfterDiscount = totalContractValue - totalDiscount;
  const totalPayments = payments.reduce((sum, payment) => sum + payment.amount, 0);
  const remainingAmount = totalAfterDiscount - totalPayments;

  // التحقق من صحة البيانات
  const isFormValid = () => {
    if (!selectedCustomer || !contract.contract_date || !contract.contract_number || !deliveryAddress) return false;
    if (rentalDetails.length === 0) return false;
    return rentalDetails.every(
      (rental) =>
        rental.scaffoldId &&
        rental.startDate &&
        rental.duration > 0 &&
        rental.quantity > 0
    );
  };

  const { data, setData, put, processing, errors } = useForm({
    contract_number: contract.contract_number,
    contract_date: contract.contract_date,
    customer_id: selectedCustomer?.id || '',
    delivery_address: deliveryAddress,
    delivery_address_details: deliveryAddressDetails,
    location_map_link: locationMapLink,
    transport_and_installation_cost: transportCost,
    total_discount: totalDiscount,
    contract_notes: contract.contract_notes || '',
    rental_details: rentalDetails.map((rental) => ({
      scaffold_id: rental.scaffoldId,
      item_code: rental.itemCode,
      item_description: rental.itemDescription,
      start_date: rental.startDate,
      end_date: rental.endDate,
      duration: rental.duration,
      duration_type: rental.durationType,
      quantity: rental.quantity,
      daily_rate: rental.dailyRate,
      monthly_rate: rental.monthlyRate,
      discount: rental.discount || 0,
      total: rental.total,
    })),
    payments: payments.map((payment) => ({
      payment_method: payment.paymentMethod,
      payment_date: payment.paymentDate,
      amount: payment.amount,
    })),
    status: contract.status || 'ACTIVE',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid() || !deliveryAddress) {
      showToast.error('خطأ', 'يرجى ملء جميع الحقول المطلوبة وإضافة معدة واحدة على الأقل');
      return;
    }

    setData('customer_id', selectedCustomer?.id || '');
    setData('delivery_address', deliveryAddress);
    setData('delivery_address_details', deliveryAddressDetails);
    setData('location_map_link', locationMapLink);
    setData('transport_and_installation_cost', transportCost);
    setData('total_discount', totalDiscount);
    setData('rental_details', rentalDetails.map((rental) => ({
      scaffold_id: rental.scaffoldId,
      item_code: rental.itemCode,
      item_description: rental.itemDescription,
      start_date: rental.startDate,
      end_date: rental.endDate,
      duration: rental.duration,
      duration_type: rental.durationType,
      quantity: rental.quantity,
      daily_rate: rental.dailyRate,
      monthly_rate: rental.monthlyRate,
      discount: rental.discount || 0,
      total: rental.total,
    })));
    setData('payments', payments.map((payment) => ({
      payment_method: payment.paymentMethod,
      payment_date: payment.paymentDate,
      amount: payment.amount,
      check_number: payment.checkNumber || null,
      bank_name: payment.bankName || null,
      check_date: payment.checkDate || null,
      check_image: payment.checkImage || null,
    })));

    put(`/contracts/${contract.id}`, {
      onSuccess: () => {
        showToast.success('تم التحديث بنجاح', 'تم تحديث العقد بنجاح');
        router.visit('/contracts');
      },
      onError: (errors) => {
        // عرض رسائل خطأ محددة لكل حقل
        const errorMessages: string[] = [];

        // رسائل الأخطاء بالعربية
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

        // دالة لاستخراج رسائل الخطأ
        const extractErrors = (obj: any, prefix = ''): void => {
          Object.keys(obj).forEach((key) => {
            const fullKey = prefix ? `${prefix}.${key}` : key;
            const value = obj[key];

            if (Array.isArray(value)) {
              // إذا كانت مصفوفة، فهي رسائل خطأ
              value.forEach((msg) => {
                const label = errorLabels[key] || errorLabels[fullKey] || key;
                errorMessages.push(`${label}: ${msg}`);
              });
            } else if (typeof value === 'string') {
              // إذا كانت نص، فهي رسالة خطأ واحدة
              const label = errorLabels[key] || errorLabels[fullKey] || key;
              errorMessages.push(`${label}: ${value}`);
            } else if (value && typeof value === 'object') {
              // إذا كانت كائن، فهي أخطاء متداخلة
              extractErrors(value, fullKey);
            }
          });
        };

        // استخراج جميع رسائل الخطأ
        extractErrors(errors);

        // عرض رسالة الخطأ الأولى أو رسالة عامة
        if (errorMessages.length > 0) {
          showToast.error('خطأ في التحديث', errorMessages[0]);
        } else if (errors.message) {
          showToast.error('خطأ في التحديث', errors.message);
        } else {
          showToast.error('خطأ في التحديث', 'يرجى التحقق من البيانات المدخلة');
        }
      },
    });
  };

  // فلترة العملاء
  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name?.toLowerCase().includes(customerSearchQuery.toLowerCase()) ||
      customer.phone?.includes(customerSearchQuery) ||
      customer.customer_number?.includes(customerSearchQuery)
  );

  return (
    <DashboardLayout>
      <Head title="تعديل العقد" />
      <div className="space-y-6 pb-8 mt-2 -mx-1 sm:-mx-2 lg:-mx-3 xl:-mx-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.visit('/contracts')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              العودة
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                تعديل عقد
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">تعديل عقد تأجير</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* معلومات العقد الأساسية */}
          <Card className="p-6 mb-6">
            <div className="border-b border-gray-200 pb-4 mb-6">
              <h2 className="text-xl font-bold text-gray-900">معلومات العقد الأساسية</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* تاريخ العقد */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  تاريخ العقد *
                </label>
                <Input
                  type="date"
                  value={contract.contract_date}
                  readOnly
                  className="w-full"
                  dir="ltr"
                  lang="en"
                  required
                />
              </div>

              {/* رقم العقد */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  رقم العقد *
                </label>
                <Input
                  type="text"
                  value={contract.contract_number}
                  readOnly
                  className="w-full"
                  dir="ltr"
                  lang="en"
                  required
                />
              </div>

              {/* العميل */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  العميل *
                </label>
                <div className="relative">
                  <Input
                    type="text"
                    value={customerSearchQuery || selectedCustomer?.name || ''}
                    onChange={(e) => {
                      setCustomerSearchQuery(e.target.value);
                      setShowCustomerDropdown(true);
                      if (!e.target.value) {
                        setSelectedCustomer(null);
                      }
                    }}
                    onFocus={() => setShowCustomerDropdown(true)}
                    placeholder="ابحث عن العميل بالاسم أو الهاتف..."
                    required
                  />
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>

                  {showCustomerDropdown && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setShowCustomerDropdown(false)}
                      />
                      <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto z-20">
                        {filteredCustomers.length > 0 ? (
                          filteredCustomers.map((customer) => (
                            <button
                              key={customer.id}
                              type="button"
                              onClick={() => {
                                setSelectedCustomer(customer);
                                setCustomerSearchQuery(customer.name);
                                setShowCustomerDropdown(false);
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

              {/* حالة العقد */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  حالة العقد *
                </label>
                <select
                  value={data.status}
                  onChange={(e) => setData('status', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#58d2c8] focus:border-transparent bg-white"
                  required
                >
                  <option value="ACTIVE">عقود مفتوحة</option>
                  <option value="CLOSED">عقود مغلقة</option>
                  <option value="CLOSED_NOT_RECEIVED">عقود مغلقة ولم يتم استلام الأصناف</option>
                </select>
              </div>

                {/* عنوان الموقع */}
                <div className="md:col-span-2">
                  <AddressSelector
                    value={deliveryAddressDetails}
                    onChange={(addressData) => {
                      setDeliveryAddressDetails(addressData);
                      setDeliveryAddress(addressData.fullAddress || '');
                    }}
                    label="عنوان الموقع (موقع تنزيل المعدات)"
                    required={true}
                    disabled={processing}
                  />
                </div>

              {/* رابط الموقع قوقل ماب */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  رابط الموقع قوقل ماب
                </label>
                <Input
                  type="url"
                  value={locationMapLink}
                  onChange={(e) => setLocationMapLink(e.target.value)}
                  placeholder="https://maps.google.com/..."
                  dir="ltr"
                  lang="en"
                />
                <p className="text-xs text-gray-500 mt-1">
                  اختياري - يمكنك لصق رابط الموقع من قوقل ماب
                </p>
              </div>
            </div>
          </Card>

          {/* تفاصيل الإيجار */}
          <Card className="p-6 mb-6">
            <div className="border-b border-gray-200 pb-4 mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">تفاصيل الإيجار</h2>
              <Button
                type="button"
                onClick={handleAddRentalItem}
                className="bg-[#58d2c8] hover:bg-[#4AB8B3] text-white flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                إضافة معدة
              </Button>
            </div>

            <div className="space-y-6">
              {rentalDetails.map((rental, index) => (
                <div key={rental.id} className="border border-gray-200 rounded-lg p-6 bg-gray-50">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-lg">المعدة {index + 1}</h3>
                    <button
                      type="button"
                      onClick={() => handleDeleteRentalItem(rental.id)}
                      className="text-red-600 hover:text-red-800 hover:bg-red-50 p-2 rounded-lg transition-colors"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* المعدة */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        المعدة *
                      </label>
                      <ScaffoldSelector
                        value={rental.scaffoldId}
                        onChange={(scaffold) => handleScaffoldChange(rental.id, scaffold)}
                        disabled={processing}
                      />
                    </div>

                    {/* تاريخ بداية الإيجار */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        تاريخ بداية الإيجار *
                      </label>
                      <Input
                        type="date"
                        value={rental.startDate}
                        onChange={(e) => updateRentalDetail(rental.id, 'startDate', e.target.value)}
                        className="w-full bg-white"
                        dir="ltr"
                        lang="en"
                        required
                      />
                    </div>

                    {/* المدة */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        المدة *
                      </label>
                      <select
                        value={rental.durationType}
                        onChange={(e) => updateRentalDetail(rental.id, 'durationType', e.target.value as 'daily' | 'monthly')}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#58d2c8] focus:border-transparent bg-white"
                        required
                      >
                        <option value="monthly">شهري</option>
                        <option value="daily">يومي</option>
                      </select>
                    </div>

                    {/* عدد المدة */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {rental.durationType === 'monthly' ? 'اختر عدد الأشهر' : 'اختر عدد الأيام'} *
                      </label>
                      <Input
                        type="text"
                        value={rental.duration}
                        onChange={(e) => {
                          const convertedValue = convertArabicToEnglishNumbers(e.target.value);
                          e.target.value = convertedValue;
                          const value = convertedValue === '' ? 0 : Number(convertedValue) || 0;
                          updateRentalDetail(rental.id, 'duration', value);
                        }}
                        placeholder={rental.durationType === 'monthly' ? 'بالأشهر' : 'بالأيام'}
                        dir="ltr"
                        lang="en"
                        required
                        className="bg-white"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        {rental.durationType === 'monthly' ? '(1 شهر = 30 يوم)' : 'حساب يومي'}
                      </p>
                    </div>

                    {/* الكمية */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        الكمية *
                      </label>
                      <Input
                        type="text"
                        value={rental.quantity}
                        onChange={(e) => {
                          const convertedValue = convertArabicToEnglishNumbers(e.target.value);
                          e.target.value = convertedValue;
                          const value = convertedValue === '' ? 0 : Number(convertedValue) || 0;
                          if (!isNaN(value) && value >= 0) {
                            updateRentalDetail(rental.id, 'quantity', value);
                          }
                        }}
                        dir="ltr"
                        lang="en"
                        required
                        className="bg-white"
                      />
                    </div>

                    {/* الإيجار اليومي */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        الإيجار اليومي (ر.ع)
                      </label>
                      <Input
                        type="text"
                        value={rental.dailyRate}
                        onChange={(e) => {
                          const convertedValue = convertArabicToEnglishNumbers(e.target.value);
                          e.target.value = convertedValue;
                          const value = convertedValue === '' ? 0 : Number(convertedValue) || 0;
                          updateRentalDetail(rental.id, 'dailyRate', value);
                        }}
                        dir="ltr"
                        lang="en"
                        className="bg-white"
                      />
                    </div>

                    {/* الإيجار الشهري */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        الإيجار الشهري (ر.ع)
                      </label>
                      <Input
                        type="text"
                        value={rental.monthlyRate}
                        onChange={(e) => {
                          const convertedValue = convertArabicToEnglishNumbers(e.target.value);
                          e.target.value = convertedValue;
                          const value = convertedValue === '' ? 0 : Number(convertedValue) || 0;
                          updateRentalDetail(rental.id, 'monthlyRate', value);
                        }}
                        dir="ltr"
                        lang="en"
                        className="bg-white"
                      />
                    </div>

                    {/* تاريخ النهاية */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        تاريخ النهاية
                      </label>
                      <Input
                        type="date"
                        value={rental.endDate}
                        className="w-full bg-gray-100"
                        dir="ltr"
                        lang="en"
                        readOnly
                      />
                      <p className="text-xs text-gray-500 mt-1">محسوب تلقائياً</p>
                    </div>

                    {/* الإجمالي */}
                    <div className="md:col-span-2 lg:col-span-1">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        الإجمالي (ر.ع)
                      </label>
                      <Input
                        type="text"
                        value={typeof rental.total === 'number' ? rental.total.toFixed(2) : Number(rental.total || 0).toFixed(2)}
                        className="w-full bg-gray-100 font-bold text-[#58d2c8]"
                        dir="ltr"
                        lang="en"
                        readOnly
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* ملخص التكاليف */}
            <div className="mt-6 p-6 bg-blue-50 rounded-lg border border-blue-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    قيمة النقل والتحميل والتنزيل (ر.ع)
                  </label>
                  <Input
                    type="text"
                    value={transportCost}
                    onChange={(e) => {
                      const convertedValue = convertArabicToEnglishNumbers(e.target.value);
                      e.target.value = convertedValue;
                      const value = convertedValue === '' ? 0 : Number(convertedValue) || 0;
                      setTransportCost(value);
                    }}
                    dir="ltr"
                    lang="en"
                    className="bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    إجمالي الخصم (ر.ع)
                  </label>
                  <Input
                    type="text"
                    value={totalDiscount}
                    onChange={(e) => {
                      const convertedValue = convertArabicToEnglishNumbers(e.target.value);
                      e.target.value = convertedValue;
                      const value = convertedValue === '' ? 0 : Number(convertedValue) || 0;
                      setTotalDiscount(value);
                    }}
                    dir="ltr"
                    lang="en"
                    className="bg-white"
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
          </Card>

          {/* المدفوعات */}
          <Card className="p-6 mb-6">
            <div className="border-b border-gray-200 pb-4 mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">المدفوعات</h2>
              <Button
                type="button"
                onClick={handleAddPayment}
                className="bg-[#58d2c8] hover:bg-[#4AB8B3] text-white flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                إضافة دفعة
              </Button>
            </div>

            <div className="space-y-4">
              {payments.map((payment, index) => (
                <div key={payment.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold">الدفعة {index + 1}</h3>
                    <button
                      type="button"
                      onClick={() => handleDeletePayment(payment.id)}
                      className="text-red-600 hover:text-red-800 hover:bg-red-50 p-2 rounded-lg transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* طريقة الدفع */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        طريقة الدفع
                      </label>
                      <select
                        value={payment.paymentMethod}
                        onChange={(e) => updatePayment(payment.id, 'paymentMethod', e.target.value as any)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#58d2c8] focus:border-transparent bg-white"
                      >
                        <option value="cash">نقداً</option>
                        <option value="check">شيكات</option>
                        <option value="credit_card">بطاقة ائتمان</option>
                      </select>
                    </div>

                    {/* تاريخ الدفع */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        تاريخ الدفع
                      </label>
                      <Input
                        type="date"
                        value={payment.paymentDate}
                        onChange={(e) => updatePayment(payment.id, 'paymentDate', e.target.value)}
                        className="w-full bg-white"
                        dir="ltr"
                        lang="en"
                      />
                    </div>

                    {/* المبلغ */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        المبلغ (ر.ع)
                      </label>
                      <Input
                        type="text"
                        value={payment.amount}
                        onChange={(e) => {
                          const convertedValue = convertArabicToEnglishNumbers(e.target.value);
                          e.target.value = convertedValue;
                          const value = convertedValue === '' ? 0 : Number(convertedValue) || 0;
                          updatePayment(payment.id, 'amount', value);
                        }}
                        min="0"
                        step="0.01"
                        dir="ltr"
                        lang="en"
                        className="bg-white"
                      />
                    </div>

                    {/* رقم الشيك - يظهر فقط عند اختيار شيكات */}
                    {payment.paymentMethod === 'check' && (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            رقم الشيك
                          </label>
                          <Input
                            type="text"
                            value={payment.checkNumber || ''}
                            onChange={(e) => updatePayment(payment.id, 'checkNumber', e.target.value)}
                            placeholder="أدخل رقم الشيك"
                            dir="ltr"
                            lang="en"
                            className="bg-white"
                          />
                        </div>

                        {/* البنك */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            البنك
                          </label>
                          <select
                            value={payment.bankName || ''}
                            onChange={(e) => updatePayment(payment.id, 'bankName', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#58d2c8] focus:border-transparent bg-white"
                          >
                            <option value="">اختر البنك</option>
                            <option value="بنك مسقط">بنك مسقط</option>
                            <option value="البنك الوطني العماني">البنك الوطني العماني</option>
                            <option value="بنك عمان العربي">بنك عمان العربي</option>
                            <option value="بنك الإمارات دبي الوطني">بنك الإمارات دبي الوطني</option>
                            <option value="بنك HSBC عمان">بنك HSBC عمان</option>
                            <option value="بنك ستاندرد تشارترد">بنك ستاندرد تشارترد</option>
                            <option value="بنك المشرق">بنك المشرق</option>
                            <option value="بنك أبوظبي الإسلامي">بنك أبوظبي الإسلامي</option>
                          </select>
                        </div>

                        {/* تاريخ الشيك */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            تاريخ الشيك
                          </label>
                          <Input
                            type="date"
                            value={payment.checkDate || ''}
                            onChange={(e) => updatePayment(payment.id, 'checkDate', e.target.value)}
                            className="w-full bg-white"
                            dir="ltr"
                            lang="en"
                          />
                        </div>

                        {/* صورة الشيك */}
                        <div className="md:col-span-3">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            صورة الشيك
                          </label>
                          <div className="space-y-3">
                            <div className="flex items-center gap-4">
                              <input
                                accept="image/*"
                                className="hidden"
                                id={`check-image-${payment.id}`}
                                type="file"
                                onChange={(e) => {
                                  const file = e.target.files?.[0] || null;
                                  handleCheckImageChange(payment.id, file);
                                }}
                              />
                              <label
                                htmlFor={`check-image-${payment.id}`}
                                className="cursor-pointer bg-[#58d2c8] text-white px-4 py-2 rounded-lg hover:bg-[#4AB8B3] transition-colors flex items-center gap-2"
                              >
                                <Plus className="w-4 h-4" />
                                رفع صورة الشيك
                              </label>
                              {payment.checkImage && (
                                <span className="text-sm text-gray-600">{payment.checkImage.name}</span>
                              )}
                              {payment.checkImagePath && !payment.checkImage && (
                                <span className="text-sm text-gray-600">صورة موجودة</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* ملخص المدفوعات */}
            <div className="mt-6 p-6 bg-green-50 rounded-lg border border-green-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    إجمالي المدفوعات (ر.ع)
                  </label>
                  <Input
                    type="text"
                    value={totalPayments.toFixed(2)}
                    className="w-full bg-gray-100 font-bold text-green-600"
                    dir="ltr"
                    lang="en"
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    المبلغ المتبقي (ر.ع)
                  </label>
                  <Input
                    type="text"
                    value={remainingAmount.toFixed(2)}
                    className={`w-full bg-gray-100 font-bold ${remainingAmount > 0 ? 'text-orange-600' : 'text-green-600'}`}
                    dir="ltr"
                    lang="en"
                    readOnly
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* ملاحظات */}
          <Card className="p-6 mb-6">
            <div className="border-b border-gray-200 pb-4 mb-6">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                ملاحظات العقد
              </h2>
            </div>
            <textarea
              value={data.contract_notes}
              onChange={(e) => setData('contract_notes', e.target.value)}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#58d2c8] focus:border-transparent"
              placeholder="أدخل أي ملاحظات إضافية حول العقد..."
            />
          </Card>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.visit('/contracts')}
            >
              إلغاء
            </Button>
            <Button
              type="submit"
              disabled={processing}
              className="bg-[#58d2c8] hover:bg-[#4AB8B3] text-white flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              {processing ? 'جاري الحفظ...' : 'تخزين بيانات العقد'}
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
