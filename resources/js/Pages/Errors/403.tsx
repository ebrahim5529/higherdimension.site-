import { Head, Link } from '@inertiajs/react';
import { AlertTriangle, Home, ArrowRight } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';

export default function Error403() {
  return (
    <DashboardLayout>
      <Head title="غير مصرح - 403" />
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)] p-4">
        <div className="text-center max-w-md w-full">
          <div className="mb-6 flex justify-center">
            <div className="rounded-full bg-red-100 dark:bg-red-900/20 p-4">
              <AlertTriangle className="h-16 w-16 text-red-600 dark:text-red-400" />
            </div>
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            403
          </h1>
          
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
            غير مصرح لك بالوصول
          </h2>
          
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            عذراً، ليس لديك الصلاحية للوصول إلى هذه الصفحة. يرجى التواصل مع المسؤول إذا كنت تعتقد أن هذا خطأ.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              <Home className="h-5 w-5 ml-2" />
              العودة إلى لوحة التحكم
            </Link>
            
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center justify-center px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              <ArrowRight className="h-5 w-5 ml-2" />
              العودة للخلف
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

