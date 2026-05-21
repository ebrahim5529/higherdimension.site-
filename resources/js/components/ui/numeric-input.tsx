/** @jsxImportSource react */
import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { convertArabicToEnglishNumbers } from '@/lib/utils';
import { cn } from '@/lib/utils';

type NumericInputProps = Omit<React.ComponentProps<typeof Input>, 'type' | 'value' | 'onChange'> & {
  value: number;
  onValueChange: (value: number) => void;
};

/**
 * حقل عدد صحيح (نصي) — يمنع تغيّر القيمة بعجلة الماوس على حقول type="number".
 */
export function IntegerInput({ value, onValueChange, className, onBlur, ...props }: NumericInputProps) {
  const [displayValue, setDisplayValue] = useState<string>(
    value !== undefined && value !== null ? String(value) : '',
  );

  useEffect(() => {
    const parsed = displayValue === '' ? NaN : Number.parseInt(displayValue, 10);
    if (Number.isNaN(parsed) ? value !== 0 : parsed !== value) {
      setDisplayValue(value !== undefined && value !== null ? String(value) : '');
    }
  }, [value]);

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
  const [displayValue, setDisplayValue] = useState<string>(
    value !== undefined && value !== null ? String(value) : '',
  );

  useEffect(() => {
    const parsed = displayValue === '' || displayValue === '.' ? NaN : Number.parseFloat(displayValue);
    if (Number.isNaN(parsed) ? value !== 0 : parsed !== value) {
      setDisplayValue(value !== undefined && value !== null ? String(value) : '');
    }
  }, [value]);

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
