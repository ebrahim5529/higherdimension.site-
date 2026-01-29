/** @jsxImportSource react */
import { useState, useRef, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell } from 'lucide-react';
import { usePage } from '@inertiajs/react';

interface PageProps {
  unreadNotificationsCount?: number;
}

export default function NotificationBell() {
  const { unreadNotificationsCount = 0 } = usePage<PageProps>().props;
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        variant="ghost"
        size="sm"
        className="relative p-2"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bell className="h-5 w-5" />
        {unreadNotificationsCount > 0 && (
          <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-xs flex items-center justify-center text-white">
            {unreadNotificationsCount > 9 ? '9+' : unreadNotificationsCount}
          </span>
        )}
      </Button>

      {isOpen && (
        <div className="absolute left-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                الإشعارات الأمنية
              </h3>
              {unreadNotificationsCount > 0 && (
                <Badge variant="destructive">{unreadNotificationsCount}</Badge>
              )}
            </div>
          </div>
          <div className="p-4">
            {unreadNotificationsCount > 0 ? (
              <div className="text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  لديك {unreadNotificationsCount} إشعار غير مقروء
                </p>
                <Link
                  href="/dashboard/notifications"
                  className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400"
                  onClick={() => setIsOpen(false)}
                >
                  عرض جميع الإشعارات
                </Link>
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  لا توجد إشعارات جديدة
                </p>
              </div>
            )}
          </div>
          <div className="p-2 border-t border-gray-200 dark:border-gray-700">
            <Link
              href="/dashboard/notifications"
              className="block w-full text-center text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 py-2"
              onClick={() => setIsOpen(false)}
            >
              عرض جميع الإشعارات
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

