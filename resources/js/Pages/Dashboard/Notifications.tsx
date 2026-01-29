/** @jsxImportSource react */
import { Head, router, Link } from '@inertiajs/react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Bell,
  CheckCircle,
  Trash2,
  CheckCheck,
  AlertCircle,
  Shield,
  ShieldCheck,
} from 'lucide-react';
import { showToast } from '@/hooks/use-toast';

interface SecurityNotification {
  id: number;
  type: string;
  title: string;
  message: string;
  device_info?: {
    device_name?: string;
    ip_address?: string;
    user_agent?: string;
  };
  ip_address?: string;
  read_at: string | null;
  created_at: string;
}

interface NotificationsProps {
  notifications: {
    data: SecurityNotification[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export default function Notifications({ notifications }: NotificationsProps) {
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'new_device':
        return <AlertCircle className="h-5 w-5 text-yellow-600" />;
      case 'two_factor_enabled':
        return <ShieldCheck className="h-5 w-5 text-green-600" />;
      default:
        return <Bell className="h-5 w-5 text-blue-600" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'new_device':
        return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800';
      case 'two_factor_enabled':
        return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800';
      default:
        return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800';
    }
  };

  const handleMarkAsRead = (notificationId: number) => {
    router.post(
      `/notifications/${notificationId}/read`,
      {},
      {
        onSuccess: () => {
          showToast.success('نجح', 'تم تحديد الإشعار كمقروء');
        },
        onError: () => {
          showToast.error('خطأ', 'فشل تحديد الإشعار كمقروء');
        },
      }
    );
  };

  const handleMarkAllAsRead = () => {
    router.post(
      '/notifications/read-all',
      {},
      {
        onSuccess: () => {
          showToast.success('نجح', 'تم تحديد جميع الإشعارات كمقروءة');
        },
        onError: () => {
          showToast.error('خطأ', 'فشل تحديد الإشعارات كمقروءة');
        },
      }
    );
  };

  const handleDelete = (notificationId: number) => {
    if (confirm('هل أنت متأكد من حذف هذا الإشعار؟')) {
      router.delete(`/notifications/${notificationId}`, {
        onSuccess: () => {
          showToast.success('نجح', 'تم حذف الإشعار');
        },
        onError: () => {
          showToast.error('خطأ', 'فشل حذف الإشعار');
        },
      });
    }
  };

  const unreadCount = notifications.data.filter((n) => !n.read_at).length;

  return (
    <DashboardLayout>
      <Head title="الإشعارات الأمنية" />
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="h-6 w-6 text-[#58d2c8]" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              الإشعارات الأمنية
            </h1>
            {unreadCount > 0 && (
              <Badge variant="destructive" className="mr-2">
                {unreadCount} غير مقروء
              </Badge>
            )}
          </div>
          {unreadCount > 0 && (
            <Button onClick={handleMarkAllAsRead} variant="outline" size="sm">
              <CheckCheck className="h-4 w-4 ml-2" />
              تحديد الكل كمقروء
            </Button>
          )}
        </div>

        {/* Notifications List */}
        {notifications.data.length > 0 ? (
          <div className="space-y-4">
            {notifications.data.map((notification) => (
              <Card
                key={notification.id}
                className={`${
                  !notification.read_at
                    ? getNotificationColor(notification.type)
                    : 'bg-white dark:bg-gray-800'
                }`}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                              {notification.title}
                            </h3>
                            {!notification.read_at && (
                              <Badge variant="default" className="bg-blue-600">
                                جديد
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                            {notification.message}
                          </p>
                          {notification.device_info && (
                            <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                              <p className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                                {notification.device_info.device_name && (
                                  <span className="block">
                                    الجهاز: {notification.device_info.device_name}
                                  </span>
                                )}
                                {notification.ip_address && (
                                  <span className="block">IP: {notification.ip_address}</span>
                                )}
                              </p>
                            </div>
                          )}
                          <p className="text-xs text-gray-500 dark:text-gray-500 mt-3">
                            {new Date(notification.created_at).toLocaleString('ar-SA', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {!notification.read_at && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleMarkAsRead(notification.id)}
                              title="تحديد كمقروء"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(notification.id)}
                            title="حذف"
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                لا توجد إشعارات
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                لم يتم العثور على أي إشعارات أمنية حتى الآن.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}

