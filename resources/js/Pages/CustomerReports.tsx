/** @jsxImportSource react */
import { Head } from '@inertiajs/react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface CustomerReportsProps {
  stats: Array<{
    title: string;
    value: string | number;
    change: string;
  }>;
}

export default function CustomerReports({ stats }: CustomerReportsProps) {
  return (
    <DashboardLayout>
      <Head title="تقارير العملاء" />
      <div className="space-y-6 mt-2 -mx-1 sm:-mx-2 lg:-mx-3 xl:-mx-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            تقارير العملاء
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            نظرة شاملة على بيانات العملاء وإحصائياتهم
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.change}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>التقارير التفصيلية</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              سيتم إضافة التقارير التفصيلية قريباً
            </p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

