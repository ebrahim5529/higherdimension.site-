/** @jsxImportSource react */
import { Head, router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { showToast } from '@/hooks/use-toast';
import { Clock, BarChart3, FileText, Download, Calendar, User, TrendingUp, TrendingDown, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { Combobox } from '@/components/ui/combobox';

interface Attendance {
  id: number;
  employeeId: string;
  employeeName: string;
  position: string;
  department: string;
  date: string;
  checkIn: string | null;
  checkOut: string | null;
  totalHours: number | null;
  overtime: number | null;
  status: 'present' | 'absent' | 'late' | 'half_day' | 'on_leave';
  notes: string | null;
}

interface Employee {
  id: number;
  employee_number: string;
  name: string;
  position: string;
  department: string;
}

interface EmployeeStats {
  employeeId?: string;
  employeeName?: string;
  position?: string;
  department?: string;
  totalDays?: number;
  presentCount?: number;
  absentCount?: number;
  lateCount?: number;
  halfDayCount?: number;
  onLeaveCount?: number;
  totalHours?: number;
  totalOvertime?: number;
  attendanceRate?: number;
  // General stats
  totalRecords?: number;
}

interface Filters {
  employee_id: string | null;
  period: 'daily' | 'weekly' | 'monthly';
  start_date: string;
  end_date: string;
}

interface AttendanceReportsProps {
  attendances: Attendance[];
  employees: Employee[];
  employeeStats: EmployeeStats;
  filters: Filters;
}

const statusLabels: Record<string, string> = {
  present: 'حاضر',
  absent: 'غائب',
  late: 'متأخر',
  half_day: 'نصف يوم',
  on_leave: 'في إجازة',
};

const statusColors: Record<string, string> = {
  present: 'bg-green-100 text-green-800',
  absent: 'bg-red-100 text-red-800',
  late: 'bg-yellow-100 text-yellow-800',
  half_day: 'bg-blue-100 text-blue-800',
  on_leave: 'bg-purple-100 text-purple-800',
};

export default function AttendanceReports({ attendances, employees, employeeStats, filters: initialFilters }: AttendanceReportsProps) {
  const { flash } = usePage().props as any;
  const [filters, setFilters] = useState<Filters>(initialFilters);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (flash?.success) {
      showToast.success('نجح', flash.success);
    }
    if (flash?.error) {
      showToast.error('خطأ', flash.error);
    }
  }, [flash]);

  const handleFilterChange = () => {
    setLoading(true);
    router.get('/employees/attendance/reports', filters, {
      preserveState: true,
      preserveScroll: true,
      onFinish: () => setLoading(false),
    });
  };

  const handlePeriodChange = (period: 'daily' | 'weekly' | 'monthly') => {
    const now = new Date();
    let startDate = '';
    let endDate = '';

    switch (period) {
      case 'daily':
        startDate = now.toISOString().split('T')[0];
        endDate = now.toISOString().split('T')[0];
        break;
      case 'weekly':
        const weekStart = new Date(now);
        weekStart.setDate(now.getDate() - now.getDay());
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        startDate = weekStart.toISOString().split('T')[0];
        endDate = weekEnd.toISOString().split('T')[0];
        break;
      case 'monthly':
      default:
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        startDate = monthStart.toISOString().split('T')[0];
        endDate = monthEnd.toISOString().split('T')[0];
        break;
    }

    const newFilters = { ...filters, period, start_date: startDate, end_date: endDate };
    setFilters(newFilters);
    // تحديث البيانات مباشرة
    setLoading(true);
    router.get('/employees/attendance/reports', newFilters, {
      preserveState: true,
      preserveScroll: true,
      onFinish: () => setLoading(false),
    });
  };

  // لا نستخدم useEffect هنا لتجنب loop، سنستخدم handleFilterChange يدوياً

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleExport = () => {
    showToast.success('نجح', 'سيتم تصدير التقرير قريباً');
  };

  return (
    <DashboardLayout>
      <Head title="تقارير الحضور والانصراف" />
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">تقارير الحضور والانصراف</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleExport}>
              <Download className="h-4 w-4" />
              تصدير التقرير
            </Button>
            <Button variant="outline" onClick={() => router.visit('/employees/attendance')}>
              العودة
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              الفلاتر
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* الموظف */}
              <div>
                <label className="block text-sm font-medium mb-1">الموظف</label>
                <Combobox
                  options={[
                    { value: '', label: 'جميع الموظفين' },
                    ...employees.map((emp) => ({
                      value: emp.id.toString(),
                      label: `${emp.name} (${emp.employee_number})`,
                    })),
                  ]}
                  value={filters.employee_id || ''}
                  onValueChange={(value) => {
                    const newFilters = { ...filters, employee_id: value || null };
                    setFilters(newFilters);
                    setLoading(true);
                    router.get('/employees/attendance/reports', newFilters, {
                      preserveState: true,
                      preserveScroll: true,
                      onFinish: () => setLoading(false),
                    });
                  }}
                  placeholder="اختر الموظف"
                  searchPlaceholder="ابحث عن الموظف..."
                  emptyText="لا يوجد موظفين"
                />
              </div>

              {/* الفترة */}
              <div>
                <label className="block text-sm font-medium mb-1">الفترة</label>
                <Combobox
                  options={[
                    { value: 'daily', label: 'يومي' },
                    { value: 'weekly', label: 'أسبوعي' },
                    { value: 'monthly', label: 'شهري' },
                  ]}
                  value={filters.period}
                  onValueChange={(value) => handlePeriodChange(value as 'daily' | 'weekly' | 'monthly')}
                  placeholder="اختر الفترة"
                  searchPlaceholder="ابحث..."
                  emptyText="لا توجد نتائج"
                />
              </div>

              {/* تاريخ البدء */}
              <div>
                <label className="block text-sm font-medium mb-1">تاريخ البدء</label>
                <div className="relative">
                  <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="date"
                    value={filters.start_date}
                    onChange={(e) => {
                      const newFilters = { ...filters, start_date: e.target.value };
                      setFilters(newFilters);
                      setLoading(true);
                      router.get('/employees/attendance/reports', newFilters, {
                        preserveState: true,
                        preserveScroll: true,
                        onFinish: () => setLoading(false),
                      });
                    }}
                    className="pr-10"
                  />
                </div>
              </div>

              {/* تاريخ الانتهاء */}
              <div>
                <label className="block text-sm font-medium mb-1">تاريخ الانتهاء</label>
                <div className="relative">
                  <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="date"
                    value={filters.end_date}
                    onChange={(e) => {
                      const newFilters = { ...filters, end_date: e.target.value };
                      setFilters(newFilters);
                      setLoading(true);
                      router.get('/employees/attendance/reports', newFilters, {
                        preserveState: true,
                        preserveScroll: true,
                        onFinish: () => setLoading(false),
                      });
                    }}
                    className="pr-10"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Employee Stats */}
        {employeeStats.employeeName && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">معدل الحضور</p>
                    <p className="text-2xl font-bold text-[#913D95]">{employeeStats.attendanceRate?.toFixed(1) || 0}%</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-[#913D95]" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">حاضر</p>
                    <p className="text-2xl font-bold text-green-600">{employeeStats.presentCount || 0}</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">غائب</p>
                    <p className="text-2xl font-bold text-red-600">{employeeStats.absentCount || 0}</p>
                  </div>
                  <XCircle className="h-8 w-8 text-red-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">إجمالي الساعات</p>
                    <p className="text-2xl font-bold text-[#913D95]">{employeeStats.totalHours || 0}</p>
                  </div>
                  <Clock className="h-8 w-8 text-[#913D95]" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Detailed Stats */}
        {employeeStats.employeeName && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                إحصائيات تفصيلية - {employeeStats.employeeName}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">إجمالي الأيام</p>
                  <p className="text-xl font-bold">{employeeStats.totalDays || 0}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">حاضر</p>
                  <p className="text-xl font-bold text-green-600">{employeeStats.presentCount || 0}</p>
                </div>
                <div className="bg-red-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">غائب</p>
                  <p className="text-xl font-bold text-red-600">{employeeStats.absentCount || 0}</p>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">متأخر</p>
                  <p className="text-xl font-bold text-yellow-600">{employeeStats.lateCount || 0}</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">نصف يوم</p>
                  <p className="text-xl font-bold text-blue-600">{employeeStats.halfDayCount || 0}</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">في إجازة</p>
                  <p className="text-xl font-bold text-purple-600">{employeeStats.onLeaveCount || 0}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">إجمالي الساعات</p>
                  <p className="text-xl font-bold">{employeeStats.totalHours || 0} ساعة</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">ساعات إضافية</p>
                  <p className="text-xl font-bold text-green-600">{employeeStats.totalOvertime || 0} ساعة</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Attendance Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              تفاصيل الحضور والانصراف
            </CardTitle>
          </CardHeader>
          <CardContent>
            {attendances.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-right text-sm font-medium text-gray-900">التاريخ</th>
                      <th className="px-4 py-3 text-right text-sm font-medium text-gray-900">الموظف</th>
                      <th className="px-4 py-3 text-right text-sm font-medium text-gray-900">وقت الدخول</th>
                      <th className="px-4 py-3 text-right text-sm font-medium text-gray-900">وقت الخروج</th>
                      <th className="px-4 py-3 text-right text-sm font-medium text-gray-900">إجمالي الساعات</th>
                      <th className="px-4 py-3 text-right text-sm font-medium text-gray-900">ساعات إضافية</th>
                      <th className="px-4 py-3 text-right text-sm font-medium text-gray-900">الحالة</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {attendances.map((attendance) => (
                      <tr key={attendance.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm">{formatDate(attendance.date)}</td>
                        <td className="px-4 py-3 text-sm">
                          <div>
                            <div className="font-medium">{attendance.employeeName}</div>
                            <div className="text-xs text-gray-500">{attendance.employeeId}</div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm">{attendance.checkIn || '-'}</td>
                        <td className="px-4 py-3 text-sm">{attendance.checkOut || '-'}</td>
                        <td className="px-4 py-3 text-sm">{attendance.totalHours || 0} ساعة</td>
                        <td className="px-4 py-3 text-sm">{attendance.overtime || 0} ساعة</td>
                        <td className="px-4 py-3 text-sm">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[attendance.status]}`}
                          >
                            {statusLabels[attendance.status]}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12">
                <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">لا توجد سجلات حضور في الفترة المحددة</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

