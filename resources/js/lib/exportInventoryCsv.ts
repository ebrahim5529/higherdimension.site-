import {
  scaffoldTypes,
  scaffoldMaterials,
  scaffoldConditions,
  scaffoldStatuses,
} from '@/data/inventoryData';

export interface InventoryExportRow {
  scaffoldNumber: string;
  type: string;
  size: string;
  material: string;
  condition: string;
  status: string;
  quantity: number;
  availableQuantity: number;
  location: string;
  sellingPrice: number;
  dailyRentalPrice: number;
  monthlyRentalPrice: number;
  entryDate: string;
  supplierName?: string;
  descriptionAr?: string;
  descriptionEn?: string;
  notes?: string;
}

function labelFrom<T extends { value: string; label: string }>(arr: T[], value: string): string {
  return arr.find((x) => x.value === value)?.label ?? value ?? '';
}

function csvCell(value: string | number | undefined | null): string {
  const s = value === undefined || value === null ? '' : String(value);
  if (/[",\r\n]/.test(s)) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

/**
 * تنزيل مخزون السقالات كملف CSV (UTF-8 مع BOM لدعم العربية في Excel).
 */
export function exportInventoryScaffoldsCsv(rows: InventoryExportRow[]): void {
  const headers = [
    'كود الصنف',
    'النوع',
    'المقاس',
    'المادة',
    'الحالة الفنية',
    'حالة التوفر',
    'الكمية',
    'المتاح',
    'الموقع',
    'سعر البيع',
    'الإيجار اليومي',
    'الإيجار الشهري',
    'تاريخ الإدخال',
    'المورد',
    'الوصف (عربي)',
    'الوصف (إنجليزي)',
    'ملاحظات',
  ];

  const lines = [
    headers.join(','),
    ...rows.map((r) =>
      [
        csvCell(r.scaffoldNumber),
        csvCell(labelFrom(scaffoldTypes, r.type)),
        csvCell(r.size),
        csvCell(labelFrom(scaffoldMaterials, r.material)),
        csvCell(labelFrom(scaffoldConditions, r.condition)),
        csvCell(labelFrom(scaffoldStatuses, r.status)),
        csvCell(r.quantity),
        csvCell(r.availableQuantity),
        csvCell(r.location),
        csvCell(r.sellingPrice),
        csvCell(r.dailyRentalPrice),
        csvCell(r.monthlyRentalPrice),
        csvCell(r.entryDate),
        csvCell(r.supplierName),
        csvCell(r.descriptionAr),
        csvCell(r.descriptionEn),
        csvCell(r.notes),
      ].join(','),
    ),
  ];

  const csv = `\uFEFF${lines.join('\r\n')}`;
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const stamp = new Date().toISOString().slice(0, 10);
  a.href = url;
  a.download = `inventory-${stamp}.csv`;
  a.rel = 'noopener';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
