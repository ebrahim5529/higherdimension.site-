/** @jsxImportSource react */
import type { ComponentType } from 'react';
import { Head } from '@inertiajs/react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, Users, DollarSign, FileText } from 'lucide-react';

interface Stat {
  id: string;
  title: string;
  value: string | number;
  change: number;
  icon: string;
  color: string;
}

interface Activity {
  description: string;
  time: string;
  user: string;
}

interface DashboardProps {
  stats: Stat[];
  activities: Activity[];
  lastUpdated: string;
}

const iconMap: Record<string, ComponentType<{ className?: string }>> = {
  Building2,
  Users,
  DollarSign,
  FileText,
};

export default function Dashboard({ stats, activities, lastUpdated }: DashboardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <DashboardLayout>
      <Head title="لوحة التحكم" />
      <div className="space-y-6">
        {/* عنوان الصفحة */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              لوحة التحكم
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              نظرة عامة على عملياتك اليومية
            </p>
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            آخر تحديث: {formatDate(lastUpdated)}
          </div>
        </div>

        {/* بطاقات الإحصائيات العامة */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => {
            const Icon = iconMap[stat.icon] || Building2;
            return (
              <Card
                key={stat.id}
                className="hover:shadow-lg transition-shadow duration-200"
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {stat.title}
                  </CardTitle>
                  <div className={`p-2 rounded-lg ${stat.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stat.value}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {stat.change > 0 ? '+' : ''}
                    {stat.change}% من الشهر الماضي
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* بطاقة النشاط الأخير */}
        <Card>
          <CardHeader>
            <CardTitle>النشاط الأخير</CardTitle>
            <CardDescription>آخر الأنشطة في النظام</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activities.slice(0, 5).map((activity, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-4 rtl:space-x-reverse"
                >
                  <div className="w-2 h-2 bg-primary rounded-full" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.description}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                  <div className="text-xs text-muted-foreground">{activity.user}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

