/** @jsxImportSource react */
import { Head, Link } from '@inertiajs/react';
import { AlertTriangle, Home, ArrowRight, FileText } from 'lucide-react';

interface Error404Props {
  message?: string;
  contractNumber?: string;
}

export default function Error404({ message, contractNumber }: Error404Props) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Head title="غير موجود - 404" />
      <div className="text-center max-w-md w-full">
        <div className="mb-6 flex justify-center">
          <div className="rounded-full bg-red-100 dark:bg-red-900/20 p-4">
            <AlertTriangle className="h-16 w-16 text-red-600 dark:text-red-400" />
          </div>
        </div>
        
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          404
        </h1>
        
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
          {message || 'الصفحة غير موجودة'}
        </h2>
        
        {contractNumber && (
          <div className="mb-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
            <div className="flex items-center gap-2 justify-center mb-2">
              <FileText className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
              <p className="text-sm font-medium text-yellow-800 dark:text-yellow-300">
                رقم العقد: {contractNumber}
              </p>
            </div>
            <p className="text-sm text-yellow-700 dark:text-yellow-400">
              يرجى التحقق من رقم العقد والتأكد من أنه صحيح
            </p>
          </div>
        )}
        
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          {contractNumber 
            ? 'العقد المطلوب غير موجود في النظام. يرجى التحقق من رقم العقد والمحاولة مرة أخرى.'
            : 'الصفحة التي تبحث عنها غير موجودة. يرجى التحقق من الرابط والمحاولة مرة أخرى.'}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center px-6 py-3 bg-[#58d2c8] text-white rounded-lg hover:bg-[#4AB8B3] transition-colors"
          >
            <Home className="h-5 w-5 ml-2 rtl:ml-0 rtl:mr-2" />
            العودة إلى لوحة التحكم
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            <ArrowRight className="h-5 w-5 ml-2 rtl:ml-0 rtl:mr-2" />
            العودة للخلف
          </button>
        </div>
      </div>
    </div>
  );
}

