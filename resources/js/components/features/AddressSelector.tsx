/** @jsxImportSource react */
import React, { useState, useEffect } from 'react';
import { Combobox } from '@/components/ui/combobox';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { MapPin } from 'lucide-react';

interface AddressSelectorProps {
  value?: {
    governorate?: string;
    wilayat?: string;
    details?: string;
  };
  onChange: (address: {
    governorate?: string;
    wilayat?: string;
    details?: string;
    fullAddress?: string;
  }) => void;
  label?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  error?: string;
}

interface GovernorateOption {
  id: number;
  name: string;
}

interface WilayatOption {
  id: number;
  name: string;
  governorate_id: number;
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
  const [details, setDetails] = useState<string>(value.details || '');
  const [governorates, setGovernorates] = useState<GovernorateOption[]>([]);
  const [wilayats, setWilayats] = useState<WilayatOption[]>([]);

  const selectedGovernorateId = governorates.find((g) => g.name === selectedGovernorate)?.id;

  // تحويل البيانات إلى تنسيق Combobox
  const governorateOptions = governorates.map((gov) => ({ value: gov.name, label: gov.name }));
  const wilayatOptions = wilayats.map((wilayat) => ({ value: wilayat.name, label: wilayat.name }));

  // تحديث القيم عند تغيير value من الخارج
  useEffect(() => {
    setSelectedGovernorate(value.governorate || '');
    setSelectedWilayat(value.wilayat || '');
    setDetails(value.details || '');
  }, [value]);

  useEffect(() => {
    const controller = new AbortController();

    const loadGovernorates = async () => {
      try {
        const response = await fetch('/api/locations/governorates', { signal: controller.signal });
        if (!response.ok) return;
        const data = (await response.json()) as GovernorateOption[];
        setGovernorates(data);
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          console.error('Failed to load governorates', error);
        }
      }
    };

    loadGovernorates();

    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (!selectedGovernorateId) {
      setWilayats([]);
      return;
    }

    const controller = new AbortController();
    const loadWilayats = async () => {
      try {
        const response = await fetch(`/api/locations/governorates/${selectedGovernorateId}/wilayats`, {
          signal: controller.signal,
        });
        if (!response.ok) return;
        const data = (await response.json()) as WilayatOption[];
        setWilayats(data);
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          console.error('Failed to load wilayats', error);
        }
      }
    };

    loadWilayats();

    return () => controller.abort();
  }, [selectedGovernorateId]);



  const handleGovernorateChange = (governorate: string) => {
    setSelectedGovernorate(governorate);
    setSelectedWilayat('');
    updateAddress({
      governorate,
      wilayat: '',
      details
    });
  };

  const handleWilayatChange = (wilayat: string) => {
    setSelectedWilayat(wilayat);
    updateAddress({
      governorate: selectedGovernorate,
      wilayat,
      details
    });
  };



  const handleDetailsChange = (details: string) => {
    setDetails(details);
    updateAddress({
      governorate: selectedGovernorate,
      wilayat: selectedWilayat,
      details
    });
  };

  const updateAddress = (addressData: {
    governorate: string;
    wilayat: string;
    details: string;
  }) => {
    // بناء العنوان الكامل
    const addressParts = [];
    if (addressData.governorate) addressParts.push(addressData.governorate);
    if (addressData.wilayat) addressParts.push(addressData.wilayat);
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
      {(selectedGovernorate || selectedWilayat || details) && (
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 border">
          <Label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
            معاينة العنوان:
          </Label>
          <p className="text-sm text-gray-900 dark:text-gray-100 rtl:text-right">
            {selectedGovernorate || selectedWilayat || details
              ? [selectedGovernorate, selectedWilayat, details].filter(Boolean).join('، ')
              : 'لم يتم تحديد عنوان بعد'
            }
          </p>
        </div>
      )}
    </div>
  );
}
