/** @jsxImportSource react */
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

type EnglishNumeralsProps = {
  children: ReactNode;
  className?: string;
};

/**
 * يعرض الأرقام والنصوص الرقمية باتجاه LTR وبأرقام لاتينية ضمن واجهة عربية.
 */
export function EnglishNumerals({ children, className }: EnglishNumeralsProps) {
  return (
    <span className={cn('tabular-nums inline-block', className)} dir="ltr" lang="en">
      {children}
    </span>
  );
}
