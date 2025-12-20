/** @jsxImportSource react */
import type { ComponentType } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { showToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Building2,
  Users,
  DollarSign,
  FileText,
  Search,
  Filter,
  Eye,
  CreditCard,
  TrendingUp,
  Activity,
  Download,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  AlertTriangle,
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

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

interface OfficeData {
  name: string;
  value: number;
}

interface MonthlyRevenue {
  month: string;
  'المكتب الرئيسي': number;
  'مكتب الشمال': number;
  'مكتب الجنوب': number;
  'مكتب الشرق': number;
}

interface WeeklyActivity {
  day: string;
  'المكتب الرئيسي': number;
  'مكتب الشمال': number;
  'مكتب الجنوب': number;
  'مكتب الشرق': number;
}

interface EquipmentData {
  office: string;
  متاح: number;
  مؤجر: number;
  صيانة: number;
}

interface ContractProgress {
  stage: string;
  completed: boolean;
}

interface Contract {
  id: number;
  contractNumber: string;
  customerName: string;
  contractType: string;
  status: string;
  progress: ContractProgress[];
  totalAmount: number;
}

interface DashboardProps {
  stats: Stat[];
  activities: Activity[];
  lastUpdated: string;
  usersByOffice: OfficeData[];
  monthlyRevenue: MonthlyRevenue[];
  weeklyActivity: WeeklyActivity[];
  equipmentByOffice: EquipmentData[];
  recentContracts: Contract[];
}

const iconMap: Record<string, ComponentType<{ className?: string }>> = {
  Building2,
  Users,
  DollarSign,
  FileText,
};

const COLORS = {
  'المكتب الرئيسي': '#20B2AA',
  'مكتب الشمال': '#8A2BE2',
  'مكتب الجنوب': '#32CD32',
  'مكتب الشرق': '#FF8C00',
};

const STATUS_COLORS: Record<string, string> = {
  ACTIVE: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  COMPLETED: 'bg-blue-100 text-blue-700 border-blue-200',
  CANCELLED: 'bg-rose-100 text-rose-700 border-rose-200',
  EXPIRED: 'bg-slate-100 text-slate-700 border-slate-200',
  DRAFT: 'bg-gray-100 text-gray-700 border-gray-200',
};

const STATUS_LABELS: Record<string, string> = {
  ACTIVE: 'نشط',
  COMPLETED: 'مكتمل',
  CANCELLED: 'ملغي',
  EXPIRED: 'منتهي',
  DRAFT: 'مسودة',
};

export default function Dashboard({
  stats,
  activities,
  lastUpdated,
  usersByOffice,
  monthlyRevenue,
  weeklyActivity,
  equipmentByOffice,
  recentContracts,
}: DashboardProps) {
  const { flash } = usePage().props as any;

  // عرض رسائل Flash من Laravel
  useEffect(() => {
    if (flash?.success) {
      showToast.success('نجح', flash.success);
    }
    if (flash?.error) {
      showToast.error('خطأ', flash.error);
    }
  }, [flash]);
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'OMR',
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  return (
    <DashboardLayout>
      <Head title="لوحة التحكم" />
      <main className="flex-1 p-3 sm:p-4 lg:p-6 xl:p-8 overflow-x-auto">
        <div className="max-w-full">
          <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">لوحة التحكم</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">نظرة عامة على عملياتك اليومية</p>
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">آخر تحديث: {lastUpdated}</div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat) => {
                const Icon = iconMap[stat.icon] || Building2;
                return (
                  <Card key={stat.id} className="hover:shadow-lg transition-shadow duration-200">
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
                        {typeof stat.value === 'number' ? formatNumber(stat.value) : stat.value}
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

            {/* Charts Section */}
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  إحصائيات استخدام المكاتب
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  نظرة شاملة على أداء المكاتب المختلفة مع الرسوم البيانية التفاعلية
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Pie Chart - Users by Office */}
                <Card className="hover:shadow-md transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg font-semibold">توزيع المستخدمين حسب المكاتب</CardTitle>
                      <Users className="h-5 w-5 text-blue-600" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={usersByOffice}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {usersByOffice.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={Object.values(COLORS)[index % 4]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="flex justify-center space-x-6 rtl:space-x-reverse mt-4">
                      {usersByOffice.map((office, index) => (
                        <div key={office.name} className="flex items-center space-x-2 rtl:space-x-reverse">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: Object.values(COLORS)[index % 4] }}
                          />
                          <span className="text-sm text-gray-600 dark:text-gray-400">{office.name}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Area Chart - Monthly Revenue */}
                <Card className="hover:shadow-md transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg font-semibold">الإيرادات الشهرية للمكاتب</CardTitle>
                      <TrendingUp className="h-5 w-5 text-green-600" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={monthlyRevenue}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Area
                            type="monotone"
                            dataKey="المكتب الرئيسي"
                            stackId="1"
                            stroke={COLORS['المكتب الرئيسي']}
                            fill={COLORS['المكتب الرئيسي']}
                            fillOpacity={0.6}
                          />
                          <Area
                            type="monotone"
                            dataKey="مكتب الشمال"
                            stackId="1"
                            stroke={COLORS['مكتب الشمال']}
                            fill={COLORS['مكتب الشمال']}
                            fillOpacity={0.6}
                          />
                          <Area
                            type="monotone"
                            dataKey="مكتب الجنوب"
                            stackId="1"
                            stroke={COLORS['مكتب الجنوب']}
                            fill={COLORS['مكتب الجنوب']}
                            fillOpacity={0.6}
                          />
                          <Area
                            type="monotone"
                            dataKey="مكتب الشرق"
                            stackId="1"
                            stroke={COLORS['مكتب الشرق']}
                            fill={COLORS['مكتب الشرق']}
                            fillOpacity={0.6}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                {/* Line Chart - Weekly Activity */}
                <Card className="hover:shadow-md transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg font-semibold">النشاط الأسبوعي للمكاتب</CardTitle>
                      <Activity className="h-5 w-5 text-purple-600" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={weeklyActivity}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="day" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Line
                            type="monotone"
                            dataKey="المكتب الرئيسي"
                            stroke={COLORS['المكتب الرئيسي']}
                            strokeWidth={2}
                            dot={{ fill: COLORS['المكتب الرئيسي'], r: 3 }}
                          />
                          <Line
                            type="monotone"
                            dataKey="مكتب الشمال"
                            stroke={COLORS['مكتب الشمال']}
                            strokeWidth={2}
                            dot={{ fill: COLORS['مكتب الشمال'], r: 3 }}
                          />
                          <Line
                            type="monotone"
                            dataKey="مكتب الجنوب"
                            stroke={COLORS['مكتب الجنوب']}
                            strokeWidth={2}
                            dot={{ fill: COLORS['مكتب الجنوب'], r: 3 }}
                          />
                          <Line
                            type="monotone"
                            dataKey="مكتب الشرق"
                            stroke={COLORS['مكتب الشرق']}
                            strokeWidth={2}
                            dot={{ fill: COLORS['مكتب الشرق'], r: 3 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                {/* Bar Chart - Equipment by Office */}
                <Card className="hover:shadow-md transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg font-semibold">توزيع المعدات حسب المكاتب</CardTitle>
                      <Building2 className="h-5 w-5 text-orange-600" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={equipmentByOffice}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="office" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="متاح" fill="#32CD32" />
                          <Bar dataKey="مؤجر" fill="#20B2AA" />
                          <Bar dataKey="صيانة" fill="#FF8C00" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-semibold">النشاط الأخير</CardTitle>
                <CardDescription>آخر الأنشطة في النظام</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activities.map((activity, index) => (
                    <div key={index} className="flex items-center space-x-4 rtl:space-x-reverse">
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

            {/* Contracts Table */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl font-semibold">جدول العقود</CardTitle>
                    <div className="text-sm text-gray-600">إجمالي العقود: {recentContracts.length}</div>
                  </div>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    تصدير
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-4 space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="relative flex-1">
                      <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input placeholder="البحث في العقود..." className="pr-10" />
                    </div>
                    <Button variant="outline" size="sm">
                      <Filter className="h-4 w-4 mr-2" />
                      فلترة
                    </Button>
                  </div>
                </div>
                <div className="rounded-md border">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b bg-gray-50 dark:bg-gray-800">
                          <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                            رقم العقد
                          </th>
                          <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                            اسم العميل
                          </th>
                          <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                            نوع العقد
                          </th>
                          <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                            الحالة
                          </th>
                          <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                            التقدم
                          </th>
                          <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                            المبلغ الإجمالي
                          </th>
                          <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                            الإجراءات
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {recentContracts.map((contract) => (
                          <tr key={contract.id} className="border-b hover:bg-gray-50 transition-colors">
                            <td className="px-4 py-3 text-sm">
                              <div className="font-mono text-sm text-gray-600">{contract.id}</div>
                            </td>
                            <td className="px-4 py-3 text-sm">
                              <div className="text-sm font-medium text-gray-900">{contract.customerName}</div>
                            </td>
                            <td className="px-4 py-3 text-sm">
                              <span className="inline-flex items-center justify-center rounded-md border px-2 py-0.5 font-medium text-xs bg-indigo-100 text-indigo-700 border-indigo-200">
                                {contract.contractType}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-sm">
                              <div className="flex items-center gap-2">
                                <span
                                  className={`inline-flex items-center justify-center rounded-md border px-2 py-0.5 font-medium text-xs ${
                                    STATUS_COLORS[contract.status] || STATUS_COLORS.DRAFT
                                  }`}
                                >
                                  {STATUS_LABELS[contract.status] || contract.status}
                                </span>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-sm">
                              <div className="flex items-center gap-1 min-w-[250px]">
                                {contract.progress.map((stage, index) => (
                                  <div key={index} className="flex items-center">
                                    <div className="flex flex-col items-center">
                                      <div
                                        className={`relative w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                                          stage.completed
                                            ? 'bg-gradient-to-r from-green-400 to-green-500 border-green-500 shadow-lg shadow-green-200'
                                            : 'bg-gray-100 border-gray-300 hover:border-gray-400'
                                        }`}
                                      >
                                        {stage.completed ? (
                                          <CheckCircle className="w-3 h-3 text-white" />
                                        ) : (
                                          <div className="w-2 h-2 bg-gray-400 rounded-full" />
                                        )}
                                      </div>
                                      <span
                                        className={`text-[9px] mt-1 text-center font-medium transition-colors duration-200 max-w-[50px] leading-tight ${
                                          stage.completed ? 'text-green-600' : 'text-gray-500'
                                        }`}
                                      >
                                        {stage.stage}
                                      </span>
                                    </div>
                                    {index < contract.progress.length - 1 && (
                                      <div
                                        className={`h-1 w-4 mx-0.5 rounded-full transition-all duration-500 ${
                                          stage.completed
                                            ? 'bg-gradient-to-r from-green-400 to-green-500 shadow-sm'
                                            : 'bg-gray-200'
                                        }`}
                                      />
                                    )}
                                  </div>
                                ))}
                              </div>
                            </td>
                            <td className="px-4 py-3 text-sm">
                              <div className="text-sm font-medium text-gray-900">
                                {formatCurrency(contract.totalAmount)}
                              </div>
                            </td>
                            <td className="px-4 py-3 text-sm">
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => router.visit(`/contracts/${contract.id}`)}
                                  title="عرض التفاصيل"
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => router.visit(`/contracts/${contract.id}/edit`)}
                                  title="تعديل العقد"
                                >
                                  <CreditCard className="h-4 w-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      عرض 1 إلى {recentContracts.length} من {recentContracts.length} عقود
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" disabled>
                        <ChevronLeft className="h-4 w-4 mr-2" />
                        السابق
                      </Button>
                      <span className="text-sm text-gray-600">صفحة 1 من 1</span>
                      <Button variant="outline" size="sm" disabled>
                        التالي
                        <ChevronRight className="h-4 w-4 ml-2" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </DashboardLayout>
  );
}
