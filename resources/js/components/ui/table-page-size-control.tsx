/** @jsxImportSource react */
import * as React from 'react';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

const DEFAULT_PRESETS = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];

export interface TablePageSizeControlProps {
  /** القيمة الحالية لعدد الصفوف في الصفحة */
  value: number;
  /** عند تغيير العدد (بعد التحقق والحدّ) */
  onChange: (pageSize: number) => void;
  /** أقل عدد مسموح (افتراضي 1) */
  min?: number;
  /** أعلى عدد مسموح (افتراضي 100) */
  max?: number;
  /** خيارات القائمة المنسدلة السريعة (افتراضي 10…100 بخطوة 10) */
  presetOptions?: number[];
  /** نص التسمية */
  label?: string;
  /** تعطيل التحكم */
  disabled?: boolean;
  className?: string;
  /** معرف للربط مع aria-labelledby */
  id?: string;
}

function clampInt (n: number, min: number, max: number): number {
  if (!Number.isFinite(n)) {
    return min;
  }
  const t = Math.trunc(n);
  return Math.min(max, Math.max(min, t));
}

/**
 * تحكم بعدد الصفوف المعروضة في الجدول: قائمة سريعة (10…100) أو إدخال رقم يدوي.
 * قابل لإعادة الاستخدام مع أي جدول يستخدم pagination محلياً.
 */
export function TablePageSizeControl ({
  value,
  onChange,
  min = 1,
  max = 100,
  presetOptions = DEFAULT_PRESETS,
  label = 'عدد الصفوف',
  disabled = false,
  className,
  id = 'table-page-size',
}: TablePageSizeControlProps) {
  const presets = React.useMemo(
    () => presetOptions.filter((n) => n >= min && n <= max),
    [presetOptions, min, max]
  );

  const [draft, setDraft] = React.useState(String(value));

  React.useEffect(() => {
    setDraft(String(value));
  }, [value]);

  const applySize = React.useCallback(
    (raw: number) => {
      const next = clampInt(raw, min, max);
      onChange(next);
      setDraft(String(next));
    },
    [min, max, onChange]
  );

  const selectValue = presets.includes(value) ? String(value) : '';

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const v = e.target.value;
    if (v === '') {
      return;
    }
    applySize(Number(v));
  };

  const commitDraft = () => {
    const parsed = Number.parseInt(String(draft).trim(), 10);
    applySize(Number.isNaN(parsed) ? value : parsed);
  };

  return (
    <div
      className={cn(
        'flex flex-wrap items-center gap-2 sm:gap-3 shrink-0',
        className
      )}
      dir="rtl"
    >
      <Label htmlFor={`${id}-input`} className="text-sm text-muted-foreground whitespace-nowrap m-0">
        {label}
      </Label>
      <select
        id={`${id}-select`}
        aria-label={`${label} — اختيار سريع`}
        disabled={disabled}
        value={selectValue}
        onChange={handleSelectChange}
        className={cn(
          'h-9 rounded-md border border-input bg-background px-2 py-1 text-sm',
          'ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          'disabled:cursor-not-allowed disabled:opacity-50 min-w-[4.5rem]'
        )}
      >
        <option value="">سريع…</option>
        {presets.map((n) => (
          <option key={n} value={n}>
            {n}
          </option>
        ))}
      </select>
      <span className="text-xs text-muted-foreground hidden sm:inline">أو</span>
      <Input
        id={`${id}-input`}
        type="number"
        min={min}
        max={max}
        disabled={disabled}
        className="h-9 w-[4.5rem] text-center"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commitDraft}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            commitDraft();
          }
        }}
        aria-label={`${label} — إدخال يدوي بين ${min} و${max}`}
      />
    </div>
  );
}
