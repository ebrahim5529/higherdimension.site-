/** @jsxImportSource react */
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
  Save,
  ArrowLeft,
  Building,
} from 'lucide-react';
import { availableNationalities, supplierTypes, supplierStatuses } from '@/data/suppliersData';

export default function CreateSupplier() {
  const { flash } = usePage().props as any;

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
    address: '',
    nationality: '',
    supplierType: 'INDIVIDUAL' as 'INDIVIDUAL' | 'COMPANY',
    idNumber: '',
    commercialRecord: '',
    taxNumber: '',
    status: 'ACTIVE' as 'ACTIVE' | 'INACTIVE' | 'SUSPENDED',
    registrationDate: new Date().toISOString().split('T')[0],
    contactPerson: '',
    contactPersonPhone: '',
    contactPersonEmail: '',
    bankName: '',
    bankAccount: '',
    iban: '',
    swiftCode: '',
    notes: '',
    warnings: '',
    rating: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post('/suppliers', {
      onSuccess: () => {
        showToast.success('تم الإنشاء بنجاح', 'تم إنشاء المورد بنجاح');
        router.visit('/suppliers');
      },
      onError: (errors) => {
        if (errors.message) {
          showToast.error('خطأ في الإنشاء', errors.message);
        } else {
          showToast.error('خطأ في الإنشاء', 'يرجى التحقق من البيانات المدخلة');
        }
      },
    });
  };

  return (
    <DashboardLayout>
      <Head title="إضافة مورد جديد" />
      <div className="space-y-6 mt-2 -mx-1 sm:-mx-2 lg:-mx-3 xl:-mx-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => router.visit('/suppliers')}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <User className="h-6 w-6" />
                إضافة مورد جديد
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
                {/* اسم المورد */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    اسم المورد <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="text"
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                    placeholder="أدخل اسم المورد"
                    className={errors.name ? 'border-red-500' : ''}
                  />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                </div>

                {/* نوع المورد */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    نوع المورد <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-2">
                    {supplierTypes.map((type) => (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() => setData('supplierType', type.value)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                          data.supplierType === type.value
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
                </div>

                {/* رقم الهوية */}
                {data.supplierType === 'INDIVIDUAL' && (
                  <div>
                    <label className="block text-sm font-medium mb-1">رقم الهوية</label>
                    <div className="relative">
                      <CreditCard className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        type="text"
                        value={data.idNumber}
                        onChange={(e) => setData('idNumber', e.target.value)}
                        className="pr-10"
                        placeholder="أدخل رقم الهوية"
                      />
                    </div>
                  </div>
                )}

                {/* السجل التجاري */}
                {data.supplierType === 'COMPANY' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium mb-1">السجل التجاري</label>
                      <div className="relative">
                        <Building2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          type="text"
                          value={data.commercialRecord}
                          onChange={(e) => setData('commercialRecord', e.target.value)}
                          className="pr-10"
                          placeholder="أدخل السجل التجاري"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">الرقم الضريبي</label>
                      <Input
                        type="text"
                        value={data.taxNumber}
                        onChange={(e) => setData('taxNumber', e.target.value)}
                        placeholder="أدخل الرقم الضريبي"
                      />
                    </div>
                  </>
                )}

                {/* الجنسية */}
                <div>
                  <label className="block text-sm font-medium mb-1">الجنسية</label>
                  <select
                    value={data.nationality}
                    onChange={(e) => setData('nationality', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-800 dark:text-white"
                  >
                    <option value="">اختر الجنسية</option>
                    {availableNationalities.map((nationality) => (
                      <option key={nationality} value={nationality}>
                        {nationality}
                      </option>
                    ))}
                  </select>
                </div>

                {/* الهاتف */}
                <div>
                  <label className="block text-sm font-medium mb-1">رقم الهاتف</label>
                  <div className="relative">
                    <Phone className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      type="tel"
                      value={data.phone}
                      onChange={(e) => setData('phone', e.target.value)}
                      className="pr-10"
                      placeholder="أدخل رقم الهاتف"
                    />
                  </div>
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
                  <label className="block text-sm font-medium mb-1">العنوان</label>
                  <div className="relative">
                    <MapPin className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                    <textarea
                      value={data.address}
                      onChange={(e) => setData('address', e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-800 dark:text-white"
                      placeholder="أدخل العنوان الكامل"
                    />
                  </div>
                </div>

                {/* حالة المورد */}
                <div>
                  <label className="block text-sm font-medium mb-1">حالة المورد</label>
                  <select
                    value={data.status}
                    onChange={(e) => setData('status', e.target.value as 'ACTIVE' | 'INACTIVE' | 'SUSPENDED')}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-800 dark:text-white"
                  >
                    {supplierStatuses.map((status) => (
                      <option key={status.value} value={status.value}>
                        {status.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* التقييم */}
                <div>
                  <label className="block text-sm font-medium mb-1">التقييم</label>
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <select
                      value={data.rating}
                      onChange={(e) => setData('rating', e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-800 dark:text-white"
                    >
                      <option value="">اختر التقييم</option>
                      <option value="1">1 - ضعيف</option>
                      <option value="2">2 - مقبول</option>
                      <option value="3">3 - جيد</option>
                      <option value="4">4 - جيد جداً</option>
                      <option value="5">5 - ممتاز</option>
                    </select>
                  </div>
                </div>

                {/* تاريخ التسجيل */}
                <div>
                  <label className="block text-sm font-medium mb-1">تاريخ التسجيل</label>
                  <Input
                    type="date"
                    value={data.registrationDate}
                    onChange={(e) => setData('registrationDate', e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* معلومات الشخص المسؤول */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCheck className="h-5 w-5" />
                معلومات الشخص المسؤول
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">اسم الشخص المسؤول</label>
                  <Input
                    type="text"
                    value={data.contactPerson}
                    onChange={(e) => setData('contactPerson', e.target.value)}
                    placeholder="أدخل اسم الشخص المسؤول"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">هاتف الشخص المسؤول</label>
                  <Input
                    type="tel"
                    value={data.contactPersonPhone}
                    onChange={(e) => setData('contactPersonPhone', e.target.value)}
                    placeholder="أدخل هاتف الشخص المسؤول"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">بريد الشخص المسؤول</label>
                  <Input
                    type="email"
                    value={data.contactPersonEmail}
                    onChange={(e) => setData('contactPersonEmail', e.target.value)}
                    placeholder="أدخل بريد الشخص المسؤول"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* معلومات البنك */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                معلومات البنك
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">اسم البنك</label>
                  <Input
                    type="text"
                    value={data.bankName}
                    onChange={(e) => setData('bankName', e.target.value)}
                    placeholder="أدخل اسم البنك"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">رقم الحساب</label>
                  <Input
                    type="text"
                    value={data.bankAccount}
                    onChange={(e) => setData('bankAccount', e.target.value)}
                    placeholder="أدخل رقم الحساب"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">رقم الآيبان</label>
                  <Input
                    type="text"
                    value={data.iban}
                    onChange={(e) => setData('iban', e.target.value)}
                    placeholder="أدخل رقم الآيبان"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">رمز السويفت</label>
                  <Input
                    type="text"
                    value={data.swiftCode}
                    onChange={(e) => setData('swiftCode', e.target.value)}
                    placeholder="أدخل رمز السويفت"
                  />
                </div>
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
                    placeholder="أدخل أي ملاحظات عامة عن المورد"
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
                    placeholder="أدخل أي تحذيرات خاصة عن المورد"
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
              onClick={() => router.visit('/suppliers')}
              disabled={processing}
            >
              إلغاء
            </Button>
            <Button type="submit" disabled={processing} className="flex items-center gap-2">
              <Save className="h-4 w-4" />
              {processing ? 'جاري الحفظ...' : 'حفظ المورد'}
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}

