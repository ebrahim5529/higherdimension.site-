/** @jsxImportSource react */
import { Head } from '@inertiajs/react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

interface FinancialReportsProps {
  stats: Array<{
    title: string;
    value: string | number;
    change: string;
  }>;

  summary: {
    totalContractsAmount: number;
    totalPaid: number;
    outstanding: number;
    contractsCount: number;
    paymentsCount: number;
    avgContractAmount: number;
  };

  monthly: Array<{
    month: string;
    contractsAmount: number;
    contractsCount: number;
    paymentsAmount: number;
  }>;

  paymentMethods: Array<{
    name: string;
    value: number;
  }>;
}

const PIE_COLORS = ['#58d2c8', '#4AB8B3', '#2F9E99', '#1F7A75', '#0E4A47', '#9CA3AF'];

export default function FinancialReports({ stats, summary, monthly, paymentMethods }: FinancialReportsProps) {
  return (
    <DashboardLayout>
      <Head title="التقارير المالية" />
      <div className="space-y-6 mt-2 -mx-1 sm:-mx-2 lg:-mx-3 xl:-mx-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            التقارير المالية
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            نظرة شاملة على الوضع المالي والإيرادات
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">عدد العقود</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summary.contractsCount}</div>
              <p className="text-xs text-muted-foreground">إجمالي العقود في النظام</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">عدد المدفوعات</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summary.paymentsCount}</div>
              <p className="text-xs text-muted-foreground">إجمالي عمليات الدفع</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">متوسط قيمة العقد</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summary.avgContractAmount.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">متوسط مبلغ العقد</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>الإيرادات والمدفوعات (آخر 12 شهر)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[320px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthly} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="contractsAmount" name="قيمة العقود" stroke="#111827" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="paymentsAmount" name="المدفوعات" stroke="#58d2c8" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>عدد العقود (آخر 12 شهر)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[320px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthly} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="contractsCount" name="عدد العقود" fill="#4AB8B3" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>قيمة العقود مقابل المدفوعات شهرياً</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[320px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthly} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="contractsAmount" name="قيمة العقود" fill="#111827" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="paymentsAmount" name="المدفوعات" fill="#58d2c8" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>توزيع طرق الدفع</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[320px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={paymentMethods}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={110}
                      label
                    >
                      {paymentMethods.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}

