/** @jsxImportSource react */
import { Head } from '@inertiajs/react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Building2,
  Users,
  DollarSign,
  TrendingUp,
  Activity,
  AlertCircle,
  CheckCircle,
  BarChart3,
} from 'lucide-react';

interface MainDashboardProps {
  mainStats: Array<{
    title: string;
    value: string;
    change: string;
    icon: string;
    color: string;
  }>;
  recentActivities: Array<{
    id: string;
    type: string;
    title: string;
    description: string;
    time: string;
    user: string;
  }>;
  officePerformance: Array<{
    office: string;
    revenue: number;
    contracts: number;
    users: number;
    growth: number;
  }>;
}

const iconMap: Record<string, any> = {
  Building2,
  Users,
  DollarSign,
  TrendingUp,
  Activity,
  AlertCircle,
  CheckCircle,
  BarChart3,
};

export default function MainDashboard({ mainStats, recentActivities, officePerformance }: MainDashboardProps) {
  return (
    <DashboardLayout>
      <Head title="لوحة التحكم الرئيسية" />
      <div className="space-y-6">
        {/* عنوان الصفحة */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              لوحة التحكم الرئيسية
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              نظرة شاملة على أداء جميع المكاتب
            </p>
          </div>
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <Button variant="outline">
              <BarChart3 className="h-4 w-4 mr-2" />
              تقرير شامل
            </Button>
            <Button>
              <Activity className="h-4 w-4 mr-2" />
              تحديث البيانات
            </Button>
          </div>
        </div>

        {/* الإحصائيات الرئيسية */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {mainStats.map((stat, index) => {
            const Icon = iconMap[stat.icon] || Building2;
            return (
              <Card
                key={index}
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
                    {stat.change} من الشهر الماضي
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* النشاط الأخير */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 rtl:space-x-reverse">
                <Activity className="h-5 w-5" />
                <span>النشاط الأخير</span>
              </CardTitle>
              <CardDescription>آخر الأنشطة في جميع المكاتب</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-center space-x-4 rtl:space-x-reverse"
                  >
                    <div
                      className={`w-2 h-2 rounded-full ${
                        activity.type === 'success'
                          ? 'bg-green-500'
                          : activity.type === 'warning'
                            ? 'bg-yellow-500'
                            : activity.type === 'info'
                              ? 'bg-blue-500'
                              : 'bg-gray-500'
                      }`}
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {activity.description}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {activity.time} - {activity.user}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* أداء المكاتب */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 rtl:space-x-reverse">
                <Building2 className="h-5 w-5" />
                <span>أداء المكاتب</span>
              </CardTitle>
              <CardDescription>مقارنة أداء المكاتب المختلفة</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {officePerformance.map((office, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {office.office}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {office.users} مستخدم • {office.contracts} عقد
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {office.revenue.toLocaleString()} ريال
                      </p>
                      <div className="flex items-center space-x-2 rtl:space-x-reverse">
                        <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-green-500 h-2 rounded-full"
                            style={{ width: `${office.growth}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-500">
                          {office.growth}%
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* تنبيهات مهمة */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 rtl:space-x-reverse">
              <AlertCircle className="h-5 w-5 text-yellow-500" />
              <span>تنبيهات مهمة</span>
            </CardTitle>
            <CardDescription>
              التنبيهات التي تحتاج إلى انتباه فوري
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-3 rtl:space-x-reverse p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                <AlertCircle className="h-5 w-5 text-yellow-600" />
                <div>
                  <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                    3 عقود منتهية الصلاحية
                  </p>
                  <p className="text-xs text-yellow-600 dark:text-yellow-400">
                    تحتاج إلى تجديد
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3 rtl:space-x-reverse p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <AlertCircle className="h-5 w-5 text-red-600" />
                <div>
                  <p className="text-sm font-medium text-red-800 dark:text-red-200">
                    5 مدفوعات متأخرة
                  </p>
                  <p className="text-xs text-red-600 dark:text-red-400">
                    تحتاج إلى متابعة
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3 rtl:space-x-reverse p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <CheckCircle className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                    جميع الأنظمة تعمل بشكل طبيعي
                  </p>
                  <p className="text-xs text-blue-600 dark:text-blue-400">
                    آخر فحص: منذ 5 دقائق
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

