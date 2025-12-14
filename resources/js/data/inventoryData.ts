/**
 * بيانات وهمية لإدارة المخزون
 */

// أنواع السقالات المتاحة
export const scaffoldTypes = [
  { value: 'FIXED', label: 'مثبتة' },
  { value: 'MOBILE', label: 'متحركة' },
  { value: 'TOWER', label: 'برجية' },
  { value: 'CANTILEVER', label: 'كابولية' },
  { value: 'SUSPENDED', label: 'معلقة' },
];

// أنواع المواد المتاحة
export const scaffoldMaterials = [
  { value: 'STEEL', label: 'حديد' },
  { value: 'ALUMINUM', label: 'ألومنيوم' },
  { value: 'WOOD', label: 'خشب' },
  { value: 'COMPOSITE', label: 'مركب' },
];

// أنواع الحالة المتاحة
export const scaffoldConditions = [
  { value: 'NEW', label: 'جديد' },
  { value: 'USED', label: 'مستعمل' },
  { value: 'REFURBISHED', label: 'معاد تأهيله' },
];

// أنواع حالة السقالة المتاحة
export const scaffoldStatuses = [
  { value: 'AVAILABLE', label: 'متوفرة' },
  { value: 'RENTED', label: 'مستأجرة' },
  { value: 'SOLD', label: 'مباعة' },
  { value: 'MAINTENANCE', label: 'تحت الصيانة' },
  { value: 'RESERVED', label: 'محجوزة' },
];

// المواقع المتاحة
export const availableLocations = [
  'المخزن الرئيسي',
  'المخزن الفرعي',
  'موقع العمل أ',
  'موقع العمل ب',
  'موقع العمل ج',
];

// مواقع المخازن المتاحة
export const availableWarehouseLocations = [
  'المنطقة أ - الرف 1',
  'المنطقة أ - الرف 2',
  'المنطقة ب - الرف 1',
  'المنطقة ب - الرف 2',
  'المنطقة ج - الرف 1',
  'المنطقة ج - الرف 2',
  'المنطقة د - الرف 1',
  'المنطقة ه - الرف 1',
];

