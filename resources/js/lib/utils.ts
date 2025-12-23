import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * تحويل الأرقام العربية إلى إنجليزية
 * @param text النص الذي يحتوي على أرقام (عربية أو إنجليزية)
 * @returns النص مع تحويل الأرقام العربية إلى إنجليزية
 */
export function convertArabicToEnglishNumbers(text: string): string {
  if (!text) return text;
  
  const arabicNumbers: { [key: string]: string } = {
    '٠': '0',
    '١': '1',
    '٢': '2',
    '٣': '3',
    '٤': '4',
    '٥': '5',
    '٦': '6',
    '٧': '7',
    '٨': '8',
    '٩': '9',
  };

  return text
    .split('')
    .map((char) => arabicNumbers[char] || char)
    .join('');
}

/**
 * التحقق من أن القيمة رقمية (بعد التحويل)
 * @param value القيمة للتحقق
 * @returns true إذا كانت القيمة رقمية أو قابلة للتحويل إلى رقم
 */
export function isValidNumber(value: string | number): boolean {
  if (value === '' || value === null || value === undefined) return true; // السماح بالقيم الفارغة
  const converted = typeof value === 'string' ? convertArabicToEnglishNumbers(value) : String(value);
  const num = Number(converted);
  return !isNaN(num) && converted.trim() !== '';
}

