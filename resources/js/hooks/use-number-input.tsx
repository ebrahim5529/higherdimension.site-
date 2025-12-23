/** @jsxImportSource react */
import { useState, useCallback } from 'react';
import { convertArabicToEnglishNumbers } from '@/lib/utils';

/**
 * Hook لتحويل الأرقام العربية إلى إنجليزية تلقائياً في حقول الإدخال
 * @param initialValue القيمة الأولية
 * @returns [value, onChange handler, setValue]
 */
export function useNumberInput(initialValue: string | number = '') {
  const [value, setValue] = useState<string>(String(initialValue || ''));

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    // تحويل الأرقام العربية إلى إنجليزية
    const convertedValue = convertArabicToEnglishNumbers(inputValue);
    setValue(convertedValue);
    // تحديث قيمة input مباشرة
    e.target.value = convertedValue;
  }, []);

  const handleChangeValue = useCallback((newValue: string | number) => {
    const stringValue = String(newValue || '');
    const convertedValue = convertArabicToEnglishNumbers(stringValue);
    setValue(convertedValue);
  }, []);

  return [value, handleChange, handleChangeValue, setValue] as const;
}

/**
 * Hook بسيط لتحويل النص في onChange handler
 */
export function useArabicToEnglishConverter() {
  return useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const inputValue = e.target.value;
    const convertedValue = convertArabicToEnglishNumbers(inputValue);
    if (inputValue !== convertedValue) {
      e.target.value = convertedValue;
      // إطلاق حدث input لضمان تحديث React
      const event = new Event('input', { bubbles: true });
      e.target.dispatchEvent(event);
    }
    return convertedValue;
  }, []);
}

