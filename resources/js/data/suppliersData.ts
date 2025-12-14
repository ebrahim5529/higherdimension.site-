/**
 * بيانات الموردين
 */

export type SupplierType = 'INDIVIDUAL' | 'COMPANY';
export type SupplierStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';

// أنواع الموردين
export const supplierTypes: { value: SupplierType; label: string }[] = [
  { value: 'INDIVIDUAL', label: 'فرد' },
  { value: 'COMPANY', label: 'شركة' },
];

// حالات الموردين
export const supplierStatuses: { value: SupplierStatus; label: string }[] = [
  { value: 'ACTIVE', label: 'نشط' },
  { value: 'INACTIVE', label: 'غير نشط' },
  { value: 'SUSPENDED', label: 'معلق' },
];

// الجنسيات المتاحة
export const availableNationalities = [
  'عماني',
  'سعودي',
  'إماراتي',
  'كويتي',
  'قطري',
  'بحريني',
  'مصري',
  'سوري',
  'لبناني',
  'أردني',
  'فلسطيني',
  'عراقي',
  'يمني',
  'سوداني',
  'مغربي',
  'تونسي',
  'جزائري',
  'ليبي',
  'أخرى',
];

