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

const EN_NUMBER_LOCALE = 'en-US' as const;

/**
 * تنسيق رقم بأرقام لاتينية (إنجليزية) — مناسب للعرض داخل واجهة عربية (RTL).
 */
export function formatNumberEn(value: number, options?: Intl.NumberFormatOptions): string {
  return new Intl.NumberFormat(EN_NUMBER_LOCALE, options).format(value);
}

/**
 * تنسيق عملة ريال عماني بأرقام لاتينية.
 */
export function formatCurrencyOmrEn(
  value: number,
  options?: { minimumFractionDigits?: number; maximumFractionDigits?: number }
): string {
  return new Intl.NumberFormat(EN_NUMBER_LOCALE, {
    style: 'currency',
    currency: 'OMR',
    minimumFractionDigits: options?.minimumFractionDigits ?? 2,
    maximumFractionDigits: options?.maximumFractionDigits ?? 2,
  }).format(value);
}

