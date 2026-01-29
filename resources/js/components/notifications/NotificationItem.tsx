/** @jsxImportSource react */
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Trash2, Bell, AlertCircle, ShieldCheck } from 'lucide-react';

interface NotificationItemProps {
  notification: {
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
  };
  onMarkAsRead?: (id: number) => void;
  onDelete?: (id: number) => void;
}

export default function NotificationItem({
  notification,
  onMarkAsRead,
  onDelete,
}: NotificationItemProps) {
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

  return (
    <div
      className={`p-4 rounded-lg border ${
        !notification.read_at
          ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
          : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-1">{getNotificationIcon(notification.type)}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                  {notification.title}
                </h4>
                {!notification.read_at && (
                  <Badge variant="default" className="bg-blue-600 text-xs">
                    جديد
                  </Badge>
                )}
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                {notification.message}
              </p>
              {notification.device_info && (
                <div className="mt-2 p-2 bg-gray-50 dark:bg-gray-700/50 rounded text-xs">
                  {notification.device_info.device_name && (
                    <span className="block text-gray-600 dark:text-gray-400">
                      {notification.device_info.device_name}
                    </span>
                  )}
                </div>
              )}
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                {new Date(notification.created_at).toLocaleString('ar-SA', {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
            <div className="flex items-center gap-1">
              {!notification.read_at && onMarkAsRead && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onMarkAsRead(notification.id)}
                  className="h-8 w-8 p-0"
                  title="تحديد كمقروء"
                >
                  <CheckCircle className="h-4 w-4" />
                </Button>
              )}
              {onDelete && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(notification.id)}
                  className="h-8 w-8 p-0"
                  title="حذف"
                >
                  <Trash2 className="h-4 w-4 text-red-600" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

