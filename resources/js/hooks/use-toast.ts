/**
 * Hook للإشعارات باستخدام مكتبة sonner
 * يوفر واجهة موحدة لعرض الإشعارات في جميع أنحاء التطبيق
 */

import { toast as sonnerToast } from 'sonner';

export interface ToastProps {
  title: string;
  description?: string;
  variant?: 'default' | 'success' | 'error' | 'warning' | 'info' | 'destructive';
  duration?: number;
}

/**
 * Hook لعرض الإشعارات
 */
export function useToast() {
  const toast = ({ title, description, variant = 'default', duration = 4000 }: ToastProps) => {
    const message = description ? 
      `${title}\n${description}` : 
      title;

    switch (variant) {
      case 'success':
        return sonnerToast.success(message, { duration });

      case 'error':
      case 'destructive':
        return sonnerToast.error(message, { duration });

      case 'warning':
        return sonnerToast.warning(message, { duration });

      case 'info':
        return sonnerToast.info(message, { duration });

      default:
        return sonnerToast(message, { duration });
    }
  };

  return {
    toast,
    // إضافة دوال مباشرة للراحة
    success: (title: string, description?: string, duration?: number) =>
      toast({ title, description, variant: 'success', duration }),
    error: (title: string, description?: string, duration?: number) =>
      toast({ title, description, variant: 'error', duration }),
    warning: (title: string, description?: string, duration?: number) =>
      toast({ title, description, variant: 'warning', duration }),
    info: (title: string, description?: string, duration?: number) =>
      toast({ title, description, variant: 'info', duration }),
  };
}

/**
 * دوال مساعدة يمكن استخدامها مباشرة دون Hook
 */
export const showToast = {
  success: (title: string, description?: string) => {
    const message = description ? `${title}\n${description}` : title;
    sonnerToast.success(message);
  },

  error: (title: string, description?: string) => {
    const message = description ? `${title}\n${description}` : title;
    sonnerToast.error(message);
  },

  warning: (title: string, description?: string) => {
    const message = description ? `${title}\n${description}` : title;
    sonnerToast.warning(message);
  },

  info: (title: string, description?: string) => {
    const message = description ? `${title}\n${description}` : title;
    sonnerToast.info(message);
  },

  loading: (title: string) => {
    return sonnerToast.loading(title);
  },

  promise: <T,>(
    promise: Promise<T>,
    msgs: {
      loading: string;
      success: string;
      error: string;
    }
  ) => {
    return sonnerToast.promise(promise, {
      loading: msgs.loading,
      success: msgs.success,
      error: msgs.error,
    });
  },
};

/**
 * دالة لإظهار رسالة حذف احترافية مع تأكيد
 */
export const showDeleteConfirm = (
  itemName: string,
  onConfirm: () => void | Promise<void>,
  options?: {
    title?: string;
    description?: string;
  }
) => {
  sonnerToast.error(
    options?.title || `حذف ${itemName}`,
    {
      description: options?.description || `هل أنت متأكد من حذف "${itemName}"؟ لا يمكن التراجع عن هذا الإجراء.`,
      duration: 5000,
      action: {
        label: 'حذف',
        onClick: async () => {
          try {
            await onConfirm();
            sonnerToast.success('تم الحذف بنجاح', {
              description: `تم حذف ${itemName} بنجاح`,
            });
          } catch (error: any) {
            sonnerToast.error('فشل الحذف', {
              description: error?.message || 'حدث خطأ أثناء الحذف',
            });
          }
        },
      },
      cancel: {
        label: 'إلغاء',
        onClick: () => {},
      },
    }
  );
};
