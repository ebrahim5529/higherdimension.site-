/** @jsxImportSource react */
import { useEffect } from 'react';
import { router, usePage } from '@inertiajs/react';

interface PageProps {
  auth?: {
    user?: any;
  };
}

export default function Home() {
  const { auth } = usePage<PageProps>().props;

  useEffect(() => {
    if (auth?.user) {
      router.visit('/dashboard');
    } else {
      router.visit('/login');
    }
  }, [auth]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-400">جاري التحميل...</p>
      </div>
    </div>
  );
}
