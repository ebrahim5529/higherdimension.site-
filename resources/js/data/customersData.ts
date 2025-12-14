/**
 * بيانات العملاء
 */

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

// أنواع العملاء
export const customerTypes: { value: 'INDIVIDUAL' | 'COMPANY'; label: string }[] = [
  { value: 'INDIVIDUAL', label: 'فرد' },
  { value: 'COMPANY', label: 'شركة' },
];

// حالات العملاء
export const customerStatuses: { value: 'ACTIVE' | 'INACTIVE'; label: string }[] = [
  { value: 'ACTIVE', label: 'نشط' },
  { value: 'INACTIVE', label: 'غير نشط' },
];
