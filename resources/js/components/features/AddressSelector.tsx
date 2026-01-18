/** @jsxImportSource react */
import React, { useState, useEffect } from 'react';
import { Combobox } from '@/components/ui/combobox';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { MapPin } from 'lucide-react';
import { getAllGovernorates, getWilayatsByGovernorate, getRegionsByWilayat } from '@/data/omanRegions';

interface AddressSelectorProps {
  value?: {
    governorate?: string;
    wilayat?: string;
    region?: string;
    details?: string;
  };
  onChange: (address: {
    governorate?: string;
    wilayat?: string;
    region?: string;
    details?: string;
    fullAddress?: string;
  }) => void;
  label?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  error?: string;
}

export function AddressSelector({
  value = {},
  onChange,
  label = 'العنوان',
  required = false,
  disabled = false,
  className = '',
  error
}: AddressSelectorProps) {
  const [selectedGovernorate, setSelectedGovernorate] = useState<string>(value.governorate || '');
  const [selectedWilayat, setSelectedWilayat] = useState<string>(value.wilayat || '');
  const [selectedRegion, setSelectedRegion] = useState<string>(value.region || '');
  const [details, setDetails] = useState<string>(value.details || '');

  const governorates = getAllGovernorates();
  const wilayats = selectedGovernorate ? getWilayatsByGovernorate(selectedGovernorate) : [];
  const regions = (selectedGovernorate && selectedWilayat)
    ? getRegionsByWilayat(selectedGovernorate, selectedWilayat)
    : [];

  // تحويل البيانات إلى تنسيق Combobox
  const governorateOptions = governorates.map(gov => ({ value: gov, label: gov }));
  const wilayatOptions = wilayats.map(wilayat => ({ value: wilayat.name, label: wilayat.name }));
  const regionOptions = regions.map(region => ({ value: region, label: region }));

  // تحديث القيم عند تغيير value من الخارج
  useEffect(() => {
    setSelectedGovernorate(value.governorate || '');
    setSelectedWilayat(value.wilayat || '');
    setSelectedRegion(value.region || '');
    setDetails(value.details || '');
  }, [value]);

  const handleGovernorateChange = (governorate: string) => {
    setSelectedGovernorate(governorate);
    setSelectedWilayat('');
    setSelectedRegion('');
    updateAddress({
      governorate,
      wilayat: '',
      region: '',
      details
    });
  };

  const handleWilayatChange = (wilayat: string) => {
    setSelectedWilayat(wilayat);
    setSelectedRegion('');
    updateAddress({
      governorate: selectedGovernorate,
      wilayat,
      region: '',
      details
    });
  };

  const handleRegionChange = (region: string) => {
    setSelectedRegion(region);
    updateAddress({
      governorate: selectedGovernorate,
      wilayat: selectedWilayat,
      region,
      details
    });
  };

  const handleDetailsChange = (details: string) => {
    setDetails(details);
    updateAddress({
      governorate: selectedGovernorate,
      wilayat: selectedWilayat,
      region: selectedRegion,
      details
    });
  };

  const updateAddress = (addressData: {
    governorate: string;
    wilayat: string;
    region: string;
    details: string;
  }) => {
    // بناء العنوان الكامل
    const addressParts = [];
    if (addressData.governorate) addressParts.push(addressData.governorate);
    if (addressData.wilayat) addressParts.push(addressData.wilayat);
    if (addressData.region) addressParts.push(addressData.region);
    if (addressData.details) addressParts.push(addressData.details);

    const fullAddress = addressParts.join('، ');

    onChange({
      ...addressData,
      fullAddress
    });
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {label && (
        <Label className="block text-sm font-medium mb-4">
          {label} {required && <span className="text-red-500">*</span>}
        </Label>
      )}

      {/* اختيار المحافظة */}
      <div>
        <Label className="block text-sm font-medium mb-1">
          المحافظة {required && <span className="text-red-500">*</span>}
        </Label>
        <div className="relative">
          <MapPin className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
          <div className="pr-10">
            <Combobox
              options={governorateOptions}
              value={selectedGovernorate}
              onValueChange={handleGovernorateChange}
              placeholder="اختر المحافظة"
              searchPlaceholder="اكتب للبحث في المحافظات..."
              emptyText="لم يتم العثور على محافظة"
              disabled={disabled}
              className="rtl:text-right"
            />
          </div>
        </div>
      </div>

      {/* اختيار الولاية */}
      {selectedGovernorate && (
        <div>
          <Label className="block text-sm font-medium mb-1">الولاية</Label>
          <div className="relative">
            <MapPin className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
            <div className="pr-10">
              <Combobox
                options={wilayatOptions}
                value={selectedWilayat}
                onValueChange={handleWilayatChange}
                placeholder="اختر الولاية"
                searchPlaceholder="اكتب للبحث في الولايات..."
                emptyText="لم يتم العثور على ولاية"
                disabled={disabled || !selectedGovernorate}
                className="rtl:text-right"
              />
            </div>
          </div>
        </div>
      )}

      {/* اختيار المنطقة */}
      {selectedWilayat && regions.length > 0 && (
        <div>
          <Label className="block text-sm font-medium mb-1">المنطقة</Label>
          <div className="relative">
            <MapPin className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
            <div className="pr-10">
              <Combobox
                options={regionOptions}
                value={selectedRegion}
                onValueChange={handleRegionChange}
                placeholder="اختر المنطقة"
                searchPlaceholder="اكتب للبحث في المناطق..."
                emptyText="لم يتم العثور على منطقة"
                disabled={disabled || !selectedWilayat}
                className="rtl:text-right"
              />
            </div>
          </div>
        </div>
      )}

      {/* تفاصيل إضافية للعنوان */}
      <div>
        <Label className="block text-sm font-medium mb-1">
          تفاصيل العنوان الإضافية (اختياري)
        </Label>
        <Textarea
          value={details}
          onChange={(e) => handleDetailsChange(e.target.value)}
          disabled={disabled}
          placeholder="أدخل تفاصيل إضافية للعنوان مثل الشارع، الرقم، إلخ..."
          rows={2}
          className="rtl:text-right resize-none"
        />
      </div>

      {/* رسالة الخطأ */}
      {error && (
        <p className="text-red-500 text-xs mt-1">{error}</p>
      )}

      {/* معاينة العنوان الكامل */}
      {(selectedGovernorate || selectedWilayat || selectedRegion || details) && (
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 border">
          <Label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
            معاينة العنوان:
          </Label>
          <p className="text-sm text-gray-900 dark:text-gray-100 rtl:text-right">
            {selectedGovernorate || selectedWilayat || selectedRegion || details
              ? [selectedGovernorate, selectedWilayat, selectedRegion, details].filter(Boolean).join('، ')
              : 'لم يتم تحديد عنوان بعد'
            }
          </p>
        </div>
      )}
    </div>
  );
}
