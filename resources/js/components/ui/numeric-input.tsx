/** @jsxImportSource react */
import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { convertArabicToEnglishNumbers } from '@/lib/utils';
import { cn } from '@/lib/utils';

type NumericInputProps = Omit<React.ComponentProps<typeof Input>, 'type' | 'value' | 'onChange'> & {
  value: number | string;
  onValueChange: (value: number) => void;
};

function toNumber(value: number | string | undefined | null, fallback = 0): number {
  if (value === undefined || value === null || value === '') {
    return fallback;
  }

  const parsed = typeof value === 'number' ? value : Number(value);

  return Number.isFinite(parsed) ? parsed : fallback;
}

/**
 * حقل عدد صحيح (نصي) — يمنع تغيّر القيمة بعجلة الماوس على حقول type="number".
 */
export function IntegerInput({ value, onValueChange, className, onBlur, ...props }: NumericInputProps) {
  const numericValue = toNumber(value, 0);

  const [displayValue, setDisplayValue] = useState<string>(
    numericValue !== 0 ? String(Math.trunc(numericValue)) : '',
  );

  useEffect(() => {
    const parsed = displayValue === '' ? NaN : Number.parseInt(displayValue, 10);
    const current = Math.trunc(numericValue);
    if (Number.isNaN(parsed) ? current !== 0 : parsed !== current) {
      setDisplayValue(current !== 0 ? String(current) : '');
    }
  }, [numericValue]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = convertArabicToEnglishNumbers(e.target.value);

    if (rawValue !== '' && !/^\d+$/.test(rawValue)) {
      return;
    }

    setDisplayValue(rawValue);

    if (rawValue === '') {
      return;
    }

    const parsed = Number.parseInt(rawValue, 10);
    if (!Number.isNaN(parsed)) {
      onValueChange(parsed);
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const parsed = displayValue === '' ? NaN : Number.parseInt(displayValue, 10);
    const min = props.min !== undefined ? Number(props.min) : 1;
    const finalValue = Number.isNaN(parsed) || parsed < min ? min : parsed;

    onValueChange(finalValue);
    setDisplayValue(String(finalValue));
    onBlur?.(e);
  };

  return (
    <Input
      {...props}
      type="text"
      inputMode="numeric"
      value={displayValue}
      onChange={handleChange}
      onBlur={handleBlur}
      className={cn(className)}
    />
  );
}

/**
 * حقل عدد عشري (نصي) — يمنع فقدان القيمة أثناء الكتابة وتغيّرها بعجلة الماوس.
 */
export function DecimalInput({ value, onValueChange, className, onBlur, ...props }: NumericInputProps) {
  const numericValue = toNumber(value, 0);

  const [displayValue, setDisplayValue] = useState<string>(
    numericValue !== 0 ? String(numericValue) : '',
  );

  useEffect(() => {
    const parsed = displayValue === '' || displayValue === '.' ? NaN : Number.parseFloat(displayValue);
    if (Number.isNaN(parsed) ? numericValue !== 0 : parsed !== numericValue) {
      setDisplayValue(numericValue !== 0 ? String(numericValue) : '');
    }
  }, [numericValue]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = convertArabicToEnglishNumbers(e.target.value);

    if (rawValue !== '' && rawValue !== '.' && !/^\d*\.?\d*$/.test(rawValue)) {
      return;
    }

    setDisplayValue(rawValue);

    if (rawValue === '' || rawValue === '.') {
      onValueChange(0);
      return;
    }

    const parsed = Number.parseFloat(rawValue);
    if (!Number.isNaN(parsed) && Number.isFinite(parsed)) {
      onValueChange(parsed);
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const parsed = displayValue === '' || displayValue === '.' ? 0 : Number.parseFloat(displayValue);
    const min = props.min !== undefined ? Number(props.min) : 0;
    const finalValue = Number.isNaN(parsed) || parsed < min ? min : parsed;

    onValueChange(finalValue);
    setDisplayValue(String(finalValue));
    onBlur?.(e);
  };

  return (
    <Input
      {...props}
      type="text"
      inputMode="decimal"
      value={displayValue}
      onChange={handleChange}
      onBlur={handleBlur}
      className={cn(className)}
    />
  );
}
