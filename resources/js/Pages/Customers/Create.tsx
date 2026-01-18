/** @jsxImportSource react */
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { showToast } from '@/hooks/use-toast';
import {
  User,
  Building2,
  Phone,
  Mail,
  MapPin,
  CreditCard,
  FileText,
  AlertTriangle,
  Star,
  UserCheck,
  X,
  Save,
  Upload,
  Image,
  ArrowLeft,
  Plus,
  Trash2,
} from 'lucide-react';
import { availableNationalities, customerTypes, customerStatuses } from '@/data/customersData';
import { NationalitySelector } from '@/components/features/NationalitySelector';
import { AddressSelector } from '@/components/features/AddressSelector';
import { convertArabicToEnglishNumbers } from '@/lib/utils';

interface PhoneNumber {
  number: string;
  type: 'MOBILE' | 'LANDLINE' | 'WHATSAPP';
  label: string;
  isPrimary: boolean;
}

export default function CreateCustomer() {
  const { flash } = usePage().props as any;
  const [phones, setPhones] = useState<PhoneNumber[]>([]);
  const [showGuarantorData, setShowGuarantorData] = useState(false);
  const [previewUrls, setPreviewUrls] = useState<{
    idCardCopy?: string;
    guarantorIdCardCopy?: string;
    commercialRecordCopy?: string;
  }>({});
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // عرض رسائل Flash من Laravel
  useEffect(() => {
    if (flash?.success) {
      showToast.success('نجح', flash.success);
    }
    if (flash?.error) {
      showToast.error('خطأ', flash.error);
    }
  }, [flash]);

  const { data, setData, post, processing, errors } = useForm({
    name: '',
    email: '',
    phone: '',
    phones: [] as PhoneNumber[],
    address: '',
    addressDetails: {
      governorate: '',
      wilayat: '',
      region: '',
      details: '',
      fullAddress: '',
    },
    nationality: '',
    customerType: 'INDIVIDUAL' as 'INDIVIDUAL' | 'COMPANY',
    idNumber: '',
    commercialRecord: '',
    status: 'ACTIVE' as 'ACTIVE' | 'INACTIVE',
    guarantorName: '',
    guarantorPhone: '',
    guarantorId: '',
    guarantorData: {
      name: '',
      phone: '',
      idNumber: '',
      nationality: '',
      address: '',
      relationship: '',
      workPlace: '',
      workPhone: '',
    },
    notes: '',
    warnings: '',
    rating: '3', // القيمة الافتراضية: جيد
    idCardCopy: null as File | null,
    guarantorIdCardCopy: null as File | null,
    commercialRecordCopy: null as File | null,
  });

  // إضافة رقم هاتف جديد
  const addPhoneNumber = () => {
    if (phones.length < 3) {
      const newPhone: PhoneNumber = {
        number: '',
        type: 'MOBILE',
        label: '',
        isPrimary: phones.length === 0,
      };
      const updatedPhones = [...phones, newPhone];
      setPhones(updatedPhones);
      setData('phones', updatedPhones);
    }
  };

  // حذف رقم هاتف
  const removePhone = (index: number) => {
    const updatedPhones = phones.filter((_, i) => i !== index);
    setPhones(updatedPhones);
    setData('phones', updatedPhones);
  };

  // تعيين رقم هاتف كرئيسي
  const setPrimaryPhone = (index: number) => {
    const updatedPhones = phones.map((phone, i) => ({
      ...phone,
      isPrimary: i === index,
    }));
    setPhones(updatedPhones);
    setData('phones', updatedPhones);
  };

  // تحديث رقم هاتف
  const updatePhone = (index: number, field: keyof PhoneNumber, value: any) => {
    const updatedPhones = phones.map((phone, i) =>
      i === index ? { ...phone, [field]: value } : phone
    );
    setPhones(updatedPhones);
    setData('phones', updatedPhones);
  };

  const handleFileChange = (fieldName: string, file: File | null) => {
    if (fieldName === 'idCardCopy') {
      setData('idCardCopy', file);
      if (file && file.type.startsWith('image/')) {
        setPreviewUrls(prev => ({ ...prev, idCardCopy: URL.createObjectURL(file) }));
      } else {
        setPreviewUrls(prev => {
          const newUrls = { ...prev };
          delete newUrls.idCardCopy;
          return newUrls;
        });
      }
    } else if (fieldName === 'guarantorIdCardCopy') {
      setData('guarantorIdCardCopy', file);
      if (file && file.type.startsWith('image/')) {
        setPreviewUrls(prev => ({ ...prev, guarantorIdCardCopy: URL.createObjectURL(file) }));
      } else {
        setPreviewUrls(prev => {
          const newUrls = { ...prev };
          delete newUrls.guarantorIdCardCopy;
          return newUrls;
        });
      }
    } else if (fieldName === 'commercialRecordCopy') {
      setData('commercialRecordCopy', file);
      if (file && file.type.startsWith('image/')) {
        setPreviewUrls(prev => ({ ...prev, commercialRecordCopy: URL.createObjectURL(file) }));
      } else {
        setPreviewUrls(prev => {
          const newUrls = { ...prev };
          delete newUrls.commercialRecordCopy;
          return newUrls;
        });
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // التحقق من صحة النماذج من جانب العميل
    if (!validateForm()) {
      showToast.error('خطأ في التحقق', 'يرجى تصحيح الأخطاء الموجودة في النموذج');
      return;
    }

    post('/customers', {
      forceFormData: true,
      onSuccess: () => {
        showToast.success('تم الإنشاء بنجاح', 'تم إنشاء العميل بنجاح');
        router.visit('/customers');
      },
      onError: (serverErrors) => {
        // دمج أخطاء الخادم مع أخطاء العميل
        setValidationErrors(prev => ({ ...prev, ...serverErrors }));

        if (serverErrors.message) {
          showToast.error('خطأ في الإنشاء', serverErrors.message);
        } else {
          showToast.error('خطأ في الإنشاء', 'يرجى التحقق من البيانات المدخلة');
        }
      },
    });
  };

  // التحقق من إظهار بيانات الضامن
  useEffect(() => {
    const shouldShowGuarantor = Boolean(
      data.nationality &&
      data.nationality !== 'عماني' &&
      data.customerType === 'INDIVIDUAL'
    );
    setShowGuarantorData(shouldShowGuarantor);
  }, [data.nationality, data.customerType]);

  // تنظيف URLs عند إلغاء المكون
  useEffect(() => {
    return () => {
      Object.values(previewUrls).forEach(url => {
        if (url) URL.revokeObjectURL(url);
      });
    };
  }, [previewUrls]);

  // دالة التحقق من صحة النماذج
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    // التحقق من الاسم
    if (!data.name.trim()) {
      errors.name = 'اسم العميل مطلوب';
    }

    // التحقق من رقم الهوية
    if (!data.idNumber.trim()) {
      errors.idNumber = 'رقم الهوية مطلوب';
    }

    // التحقق من رقم الهاتف الرئيسي
    if (!data.phone.trim()) {
      errors.phone = 'رقم الهاتف الرئيسي مطلوب';
    }

    // التحقق من وجود رقم هاتف إضافي واحد على الأقل
    const hasValidAdditionalPhone = phones.some(phone => phone.number.trim() !== '');
    if (!hasValidAdditionalPhone) {
      errors.additionalPhone = 'يجب إضافة رقم هاتف إضافي واحد على الأقل';
    }

    // التحقق من العنوان (يجب اختيار المحافظة على الأقل)
    if (!data.addressDetails.governorate) {
      errors.address = 'يجب اختيار المحافظة في العنوان';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  return (
    <DashboardLayout>
      <Head title="إضافة عميل جديد" />
      <div className="space-y-6 mt-2 -mx-1 sm:-mx-2 lg:-mx-3 xl:-mx-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => router.visit('/customers')}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <User className="h-6 w-6" />
                إضافة عميل جديد
              </h1>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* المعلومات الأساسية */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                المعلومات الأساسية
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* اسم العميل */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    اسم العميل <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="text"
                    value={data.name}
                    onChange={(e) => {
                      setData('name', e.target.value);
                      // إزالة خطأ التحقق عند الكتابة
                      if (validationErrors.name) {
                        setValidationErrors(prev => {
                          const newErrors = { ...prev };
                          delete newErrors.name;
                          return newErrors;
                        });
                      }
                    }}
                    placeholder="أدخل اسم العميل"
                    className={(errors.name || validationErrors.name) ? 'border-red-500' : ''}
                  />
                  {(errors.name || validationErrors.name) && (
                    <p className="text-red-500 text-xs mt-1">{errors.name || validationErrors.name}</p>
                  )}
                </div>

                {/* نوع العميل */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    نوع العميل
                  </label>
                  <div className="flex gap-2">
                    {customerTypes.map((type) => (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() => setData('customerType', type.value)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                          data.customerType === type.value
                            ? 'bg-primary text-white border-primary'
                            : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                        }`}
                      >
                        {type.value === 'COMPANY' ? (
                          <Building2 className="h-4 w-4" />
                        ) : (
                          <User className="h-4 w-4" />
                        )}
                        {type.label}
                      </button>
                    ))}
                  </div>
                  {errors.customer_type && (
                    <p className="text-red-500 text-xs mt-1">{errors.customer_type}</p>
                  )}
                </div>

                {/* رقم الهوية */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    رقم الهوية <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <CreditCard className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      type="text"
                      value={data.idNumber}
                      onChange={(e) => {
                        const convertedValue = convertArabicToEnglishNumbers(e.target.value);
                        e.target.value = convertedValue;
                        setData('idNumber', convertedValue);
                        // إزالة خطأ التحقق عند الكتابة
                        if (validationErrors.idNumber) {
                          setValidationErrors(prev => {
                            const newErrors = { ...prev };
                            delete newErrors.idNumber;
                            return newErrors;
                          });
                        }
                      }}
                      className={`pr-10 ${(errors.idNumber || validationErrors.idNumber) ? 'border-red-500' : ''}`}
                      placeholder="أدخل رقم الهوية"
                    />
                  </div>
                  {(errors.idNumber || validationErrors.idNumber) && (
                    <p className="text-red-500 text-xs mt-1">{errors.idNumber || validationErrors.idNumber}</p>
                  )}
                </div>

                {/* السجل التجاري */}
                {data.customerType === 'COMPANY' && (
                  <div>
                    <label className="block text-sm font-medium mb-1">السجل التجاري</label>
                    <div className="relative">
                      <Building2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        type="text"
                        value={data.commercialRecord}
                        onChange={(e) => {
                          const convertedValue = convertArabicToEnglishNumbers(e.target.value);
                          e.target.value = convertedValue;
                          setData('commercialRecord', convertedValue);
                        }}
                        className="pr-10"
                        placeholder="أدخل السجل التجاري"
                      />
                    </div>
                  </div>
                )}

                {/* الجنسية */}
                <div>
                  <NationalitySelector
                    value={data.nationality}
                    onChange={(value) => setData('nationality', value)}
                    disabled={processing}
                    label="الجنسية"
                    required={false}
                  />
                  {errors.nationality && (
                    <p className="text-red-500 text-xs mt-1">{errors.nationality}</p>
                  )}
                </div>

                {/* الهاتف الرئيسي */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    رقم الهاتف الرئيسي <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      type="tel"
                      value={data.phone}
                      onChange={(e) => {
                        const convertedValue = convertArabicToEnglishNumbers(e.target.value);
                        e.target.value = convertedValue;
                        setData('phone', convertedValue);
                        // إزالة خطأ التحقق عند الكتابة
                        if (validationErrors.phone) {
                          setValidationErrors(prev => {
                            const newErrors = { ...prev };
                            delete newErrors.phone;
                            return newErrors;
                          });
                        }
                      }}
                      className={`pr-10 ${(errors.phone || validationErrors.phone) ? 'border-red-500' : ''}`}
                      placeholder="أدخل رقم الهاتف الرئيسي"
                    />
                  </div>
                  {(errors.phone || validationErrors.phone) && (
                    <p className="text-red-500 text-xs mt-1">{errors.phone || validationErrors.phone}</p>
                  )}
                </div>

                {/* أرقام الهواتف الإضافية */}
                <div className="md:col-span-2">
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium">
                      رقم هاتف إضافي <span className="text-red-500">*</span>
                    </label>
                    {phones.length < 3 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={addPhoneNumber}
                        className="flex items-center gap-1"
                      >
                        <Plus className="h-3 w-3" />
                        إضافة رقم
                      </Button>
                    )}
                  </div>
                  {(errors.additionalPhone || validationErrors.additionalPhone) && (
                    <p className="text-red-500 text-xs mb-2">{errors.additionalPhone || validationErrors.additionalPhone}</p>
                  )}

                  {phones.map((phone, index) => (
                    <div key={index} className="flex items-center gap-2 mb-2">
                      <div className="flex-1">
                        <Input
                          type="tel"
                          value={phone.number}
                          onChange={(e) => {
                            const convertedValue = convertArabicToEnglishNumbers(e.target.value);
                            e.target.value = convertedValue;
                            updatePhone(index, 'number', convertedValue);
                          }}
                          placeholder="رقم الهاتف"
                        />
                      </div>
                      <div className="w-32">
                        <select
                          value={phone.type}
                          onChange={(e) => updatePhone(index, 'type', e.target.value)}
                          className="w-full px-2 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm dark:bg-gray-800 dark:text-white"
                        >
                          <option value="MOBILE">جوال</option>
                          <option value="LANDLINE">أرضي</option>
                          <option value="WHATSAPP">واتساب</option>
                        </select>
                      </div>
                      <div className="w-24">
                        <Input
                          type="text"
                          value={phone.label}
                          onChange={(e) => updatePhone(index, 'label', e.target.value)}
                          className="text-sm"
                          placeholder="تسمية"
                        />
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setPrimaryPhone(index)}
                          className={`h-8 w-8 p-0 ${
                            phone.isPrimary
                              ? 'bg-primary text-white'
                              : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                          }`}
                          title="رقم رئيسي"
                        >
                          <Star className="h-3 w-3" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removePhone(index)}
                          className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                          title="حذف"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* البريد الإلكتروني */}
                <div>
                  <label className="block text-sm font-medium mb-1">البريد الإلكتروني</label>
                  <div className="relative">
                    <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      type="email"
                      value={data.email}
                      onChange={(e) => setData('email', e.target.value)}
                      className="pr-10"
                      placeholder="أدخل البريد الإلكتروني"
                    />
                  </div>
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>

                {/* العنوان */}
                <div className="md:col-span-2">
                  <AddressSelector
                    value={data.addressDetails}
                    onChange={(addressData) => {
                      setData('addressDetails', addressData);
                      setData('address', addressData.fullAddress || '');
                      // إزالة خطأ التحقق عند اختيار العنوان
                      if (validationErrors.address) {
                        setValidationErrors(prev => {
                          const newErrors = { ...prev };
                          delete newErrors.address;
                          return newErrors;
                        });
                      }
                    }}
                    label="العنوان"
                    required={true}
                    disabled={processing}
                    error={errors.address || validationErrors.address}
                  />
                  {(errors.address || validationErrors.address) && (
                    <p className="text-red-500 text-xs mt-1">{errors.address || validationErrors.address}</p>
                  )}
                </div>

                {/* الحقول المخفية - القيم الافتراضية */}
                {/* حالة العميل: ACTIVE (جديد) - مخفي */}
                {/* التقييم: 3 (جيد) - مخفي */}
              </div>
            </CardContent>
          </Card>

          {/* معلومات الضامن */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCheck className="h-5 w-5" />
                معلومات الضامن (اختياري)
              </CardTitle>
            </CardHeader>
            <CardContent>
              {showGuarantorData ? (
                // بيانات الضامن الكاملة للعملاء غير العمانيين
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      اسم الضامن
                    </label>
                    <Input
                      type="text"
                      value={data.guarantorData.name}
                      onChange={(e) => setData('guarantorData', { ...data.guarantorData, name: e.target.value })}
                      placeholder="أدخل اسم الضامن"
                      className={errors['guarantorData.name'] ? 'border-red-500' : ''}
                    />
                    {errors['guarantorData.name'] && (
                      <p className="text-red-500 text-xs mt-1">{errors['guarantorData.name']}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      هاتف الضامن
                    </label>
                    <Input
                      type="tel"
                      value={data.guarantorData.phone}
                      onChange={(e) => {
                        const convertedValue = convertArabicToEnglishNumbers(e.target.value);
                        e.target.value = convertedValue;
                        setData('guarantorData', { ...data.guarantorData, phone: convertedValue });
                      }}
                      placeholder="أدخل هاتف الضامن"
                      className={errors['guarantorData.phone'] ? 'border-red-500' : ''}
                    />
                    {errors['guarantorData.phone'] && (
                      <p className="text-red-500 text-xs mt-1">{errors['guarantorData.phone']}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      رقم هوية الضامن
                    </label>
                    <Input
                      type="text"
                      value={data.guarantorData.idNumber}
                      onChange={(e) => {
                        const convertedValue = convertArabicToEnglishNumbers(e.target.value);
                        e.target.value = convertedValue;
                        setData('guarantorData', { ...data.guarantorData, idNumber: convertedValue });
                      }}
                      placeholder="أدخل رقم هوية الضامن"
                      className={errors['guarantorData.idNumber'] ? 'border-red-500' : ''}
                    />
                    {errors['guarantorData.idNumber'] && (
                      <p className="text-red-500 text-xs mt-1">{errors['guarantorData.idNumber']}</p>
                    )}
                  </div>

                  <div>
                    <NationalitySelector
                      value={data.guarantorData.nationality}
                      onChange={(value) => setData('guarantorData', { ...data.guarantorData, nationality: value })}
                      disabled={processing}
                      label="جنسية الضامن"
                      required={false}
                    />
                    {errors['guarantorData.nationality'] && (
                      <p className="text-red-500 text-xs mt-1">{errors['guarantorData.nationality']}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      صلة القرابة
                    </label>
                    <Input
                      type="text"
                      value={data.guarantorData.relationship}
                      onChange={(e) => setData('guarantorData', { ...data.guarantorData, relationship: e.target.value })}
                      placeholder="مثل: أخ، أب، صديق"
                      className={errors['guarantorData.relationship'] ? 'border-red-500' : ''}
                    />
                    {errors['guarantorData.relationship'] && (
                      <p className="text-red-500 text-xs mt-1">{errors['guarantorData.relationship']}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">مكان العمل</label>
                    <Input
                      type="text"
                      value={data.guarantorData.workPlace}
                      onChange={(e) => setData('guarantorData', { ...data.guarantorData, workPlace: e.target.value })}
                      placeholder="أدخل مكان العمل"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-1">
                      عنوان الضامن
                    </label>
                    <textarea
                      value={data.guarantorData.address}
                      onChange={(e) => setData('guarantorData', { ...data.guarantorData, address: e.target.value })}
                      rows={3}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-800 dark:text-white ${
                        errors['guarantorData.address'] 
                          ? 'border-red-500' 
                          : 'border-gray-300 dark:border-gray-600'
                      }`}
                      placeholder="أدخل عنوان الضامن الكامل"
                    />
                    {errors['guarantorData.address'] && (
                      <p className="text-red-500 text-xs mt-1">{errors['guarantorData.address']}</p>
                    )}
                  </div>
                </div>
              ) : (
                // بيانات الضامن البسيطة
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">اسم الضامن</label>
                    <Input
                      type="text"
                      value={data.guarantorName}
                      onChange={(e) => setData('guarantorName', e.target.value)}
                      placeholder="أدخل اسم الضامن"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">هاتف الضامن</label>
                    <Input
                      type="tel"
                      value={data.guarantorPhone}
                      onChange={(e) => setData('guarantorPhone', e.target.value)}
                      placeholder="أدخل هاتف الضامن"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">رقم هوية الضامن</label>
                    <Input
                      type="text"
                      value={data.guarantorId}
                      onChange={(e) => {
                        const convertedValue = convertArabicToEnglishNumbers(e.target.value);
                        e.target.value = convertedValue;
                        setData('guarantorId', convertedValue);
                      }}
                      placeholder="أدخل رقم هوية الضامن"
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* المرفقات */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Image className="h-5 w-5" />
                المرفقات
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    نسخة البطاقة الشخصية للعميل
                  </label>
                  <div className={`border-2 border-dashed rounded-lg p-4 text-center ${
                    errors.idCardCopy 
                      ? 'border-red-500 dark:border-red-700' 
                      : 'border-gray-300 dark:border-gray-600'
                  }`}>
                    {previewUrls.idCardCopy ? (
                      <div className="space-y-2">
                        <img
                          src={previewUrls.idCardCopy}
                          alt="معاينة البطاقة الشخصية"
                          className="max-w-full h-32 object-contain mx-auto rounded border"
                        />
                        <button
                          type="button"
                          onClick={() => handleFileChange('idCardCopy', null)}
                          className="text-sm text-red-600 hover:text-red-700"
                        >
                          إزالة الصورة
                        </button>
                      </div>
                    ) : (
                      <>
                        <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                        <input
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          className="hidden"
                          id="customer-id-card"
                          onChange={(e) => handleFileChange('idCardCopy', e.target.files?.[0] || null)}
                        />
                        <label
                          htmlFor="customer-id-card"
                          className="cursor-pointer text-sm text-gray-600 dark:text-gray-400 hover:text-primary"
                        >
                          اضغط لرفع نسخة البطاقة الشخصية (PDF أو صورة)
                        </label>
                      </>
                    )}
                  </div>
                  {errors.idCardCopy && (
                    <p className="text-red-500 text-xs mt-1">{errors.idCardCopy}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    نسخة بطاقة الضامن الشخصية
                  </label>
                  <div className={`border-2 border-dashed rounded-lg p-4 text-center ${
                    errors.guarantorIdCardCopy 
                      ? 'border-red-500 dark:border-red-700' 
                      : 'border-gray-300 dark:border-gray-600'
                  }`}>
                    {previewUrls.guarantorIdCardCopy ? (
                      <div className="space-y-2">
                        <img
                          src={previewUrls.guarantorIdCardCopy}
                          alt="معاينة بطاقة الضامن"
                          className="max-w-full h-32 object-contain mx-auto rounded border"
                        />
                        <button
                          type="button"
                          onClick={() => handleFileChange('guarantorIdCardCopy', null)}
                          className="text-sm text-red-600 hover:text-red-700"
                        >
                          إزالة الصورة
                        </button>
                      </div>
                    ) : (
                      <>
                        <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                        <input
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          className="hidden"
                          id="guarantor-id-card"
                          onChange={(e) => handleFileChange('guarantorIdCardCopy', e.target.files?.[0] || null)}
                        />
                        <label
                          htmlFor="guarantor-id-card"
                          className="cursor-pointer text-sm text-gray-600 dark:text-gray-400 hover:text-primary"
                        >
                          اضغط لرفع نسخة بطاقة الضامن (PDF أو صورة)
                        </label>
                      </>
                    )}
                  </div>
                  {errors.guarantorIdCardCopy && (
                    <p className="text-red-500 text-xs mt-1">{errors.guarantorIdCardCopy}</p>
                  )}
                </div>

                {data.customerType === 'COMPANY' && (
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-1">
                      نسخة السجل التجاري
                    </label>
                    <div className={`border-2 border-dashed rounded-lg p-4 text-center ${
                      errors.commercialRecordCopy 
                        ? 'border-red-500 dark:border-red-700' 
                        : 'border-gray-300 dark:border-gray-600'
                    }`}>
                      {previewUrls.commercialRecordCopy ? (
                        <div className="space-y-2">
                          <img
                            src={previewUrls.commercialRecordCopy}
                            alt="معاينة السجل التجاري"
                            className="max-w-full h-32 object-contain mx-auto rounded border"
                          />
                          <button
                            type="button"
                            onClick={() => handleFileChange('commercialRecordCopy', null)}
                            className="text-sm text-red-600 hover:text-red-700"
                          >
                            إزالة الصورة
                          </button>
                        </div>
                      ) : (
                        <>
                          <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                          <input
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            className="hidden"
                            id="commercial-record"
                            onChange={(e) => handleFileChange('commercialRecordCopy', e.target.files?.[0] || null)}
                          />
                          <label
                            htmlFor="commercial-record"
                            className="cursor-pointer text-sm text-gray-600 dark:text-gray-400 hover:text-primary"
                          >
                            اضغط لرفع نسخة السجل التجاري (PDF أو صورة)
                          </label>
                        </>
                      )}
                    </div>
                    {errors.commercialRecordCopy && (
                      <p className="text-red-500 text-xs mt-1">{errors.commercialRecordCopy}</p>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* الملاحظات والتحذيرات */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                الملاحظات والتحذيرات
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">ملاحظات عامة</label>
                  <textarea
                    value={data.notes}
                    onChange={(e) => setData('notes', e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-800 dark:text-white"
                    placeholder="أدخل أي ملاحظات عامة عن العميل"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                    تحذيرات خاصة
                  </label>
                  <textarea
                    value={data.warnings}
                    onChange={(e) => setData('warnings', e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-red-300 dark:border-red-700 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                    placeholder="أدخل أي تحذيرات خاصة عن العميل"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* أزرار الإجراءات */}
          <div className="flex items-center justify-end gap-4 pt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.visit('/customers')}
              disabled={processing}
            >
              إلغاء
            </Button>
            <Button type="submit" disabled={processing} className="flex items-center gap-2">
              <Save className="h-4 w-4" />
              {processing ? 'جاري الحفظ...' : 'إضافة العميل'}
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
