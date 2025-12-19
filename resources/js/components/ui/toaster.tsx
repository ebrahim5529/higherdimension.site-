/** @jsxImportSource react */
import { Toaster as Sonner } from 'sonner';
import type { ComponentProps } from 'react';

type ToasterProps = ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      position="top-center"
      dir="rtl"
      toastOptions={{
        classNames: {
          toast:
            'group toast group-[.toaster]:bg-white group-[.toaster]:text-gray-950 group-[.toaster]:border-gray-200 group-[.toaster]:shadow-lg dark:group-[.toaster]:bg-gray-950 dark:group-[.toaster]:text-gray-50 dark:group-[.toaster]:border-gray-800',
          description: 'group-[.toast]:text-gray-500 dark:group-[.toast]:text-gray-400',
          actionButton:
            'group-[.toast]:bg-blue-900 group-[.toast]:text-gray-50 dark:group-[.toast]:bg-blue-50 dark:group-[.toast]:text-gray-900',
          cancelButton:
            'group-[.toast]:bg-gray-100 group-[.toast]:text-gray-500 dark:group-[.toast]:bg-gray-800 dark:group-[.toast]:text-gray-400',
          error:
            'group-[.toaster]:bg-red-50 group-[.toaster]:text-red-900 group-[.toaster]:border-red-200',
          success:
            'group-[.toaster]:bg-green-50 group-[.toaster]:text-green-900 group-[.toaster]:border-green-200',
          warning:
            'group-[.toaster]:bg-yellow-50 group-[.toaster]:text-yellow-900 group-[.toaster]:border-yellow-200',
          info:
            'group-[.toaster]:bg-blue-50 group-[.toaster]:text-blue-900 group-[.toaster]:border-blue-200',
        },
        style: {
          fontFamily: 'Cairo, Almarai, sans-serif',
          fontSize: '14px',
          padding: '16px',
          borderRadius: '8px',
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
