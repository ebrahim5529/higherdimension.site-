/** @jsxImportSource react */
import { Head } from '@inertiajs/react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useState } from 'react';
import { BarChart3, Activity, Clock, AlertTriangle } from 'lucide-react';

interface DashboardInteractiveProps {
  stats: Array<{
    title: string;
    value: string | number;
    change: string;
    trend?: string;
  }>;
}

export default function DashboardInteractive({ stats }: DashboardInteractiveProps) {
  const [selectedTimeRange, setSelectedTimeRange] = useState('today');

  return (
    <DashboardLayout>
      <Head title="لوحة التحكم التفاعلية" />
      <div className="space-y-6 mt-2 -mx-1 sm:-mx-2 lg:-mx-3 xl:-mx-4">
        {/* العنوان والوصف */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              لوحة التحكم التفاعلية
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              نظرة عامة تفاعلية على جميع العمليات والإحصائيات المباشرة
            </p>
          </div>

          {/* اختيار الفترة الزمنية */}
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <select
              value={selectedTimeRange}
              onChange={(e) => setSelectedTimeRange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg bg-white dark:bg-gray-800 dark:border-gray-600"
            >
              <option value="today">اليوم</option>
              <option value="week">هذا الأسبوع</option>
              <option value="month">هذا الشهر</option>
              <option value="quarter">هذا الربع</option>
            </select>
          </div>
        </div>

        {/* الإحصائيات المباشرة */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            <h2 className="text-lg font-semibold">الإحصائيات المباشرة</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">
                    {stat.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground">
                    {stat.change}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* الرسوم البيانية */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              الرسوم البيانية
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              سيتم إضافة الرسوم البيانية قريباً
            </p>
          </CardContent>
        </Card>

        {/* الأنشطة الأخيرة */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              الأنشطة الأخيرة
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              سيتم إضافة الأنشطة الأخيرة قريباً
            </p>
          </CardContent>
        </Card>

        {/* التنبيهات */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              التنبيهات
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              لا توجد تنبيهات حالياً
            </p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

