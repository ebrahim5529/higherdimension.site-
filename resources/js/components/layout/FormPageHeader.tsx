/** @jsxImportSource react */
import { router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import type { LucideIcon } from 'lucide-react';
import { ArrowLeft } from 'lucide-react';

interface FormPageHeaderProps {
  title: string;
  subtitle?: string;
  backHref: string;
  icon?: LucideIcon;
}

/**
 * ترويسة موحّدة لصفحات الإنشاء/التعديل (مرجع: إدارة الموردين).
 */
export function FormPageHeader({ title, subtitle, backHref, icon: Icon }: FormPageHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => router.visit(backHref)}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            {Icon && <Icon className="h-6 w-6" />}
            {title}
          </h1>
          {subtitle && (
            <p className="text-gray-600 dark:text-gray-400 mt-1">{subtitle}</p>
          )}
        </div>
      </div>
    </div>
  );
}
