<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Contract;
use App\Models\ContractPayment;
use App\Models\Customer;
use App\Models\Scaffold;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        // إجمالي المكاتب (افتراضي 4 مكاتب)
        $totalOffices = 4;
        $officesLastMonth = 4; // يمكن تحديثه لاحقاً
        $officesChange = $officesLastMonth > 0 ? round((($totalOffices - $officesLastMonth) / $officesLastMonth) * 100) : 0;

        // إجمالي المستخدمين
        $totalUsers = User::count();
        $usersLastMonth = User::where('created_at', '<', now()->subMonth())->count();
        $usersChange = $usersLastMonth > 0 ? round((($totalUsers - $usersLastMonth) / $usersLastMonth) * 100) : 0;

        // إجمالي الإيرادات الشهرية
        $currentMonthRevenue = ContractPayment::whereMonth('payment_date', now()->month)
            ->whereYear('payment_date', now()->year)
            ->sum('amount') ?? 0;
        $lastMonthRevenue = ContractPayment::whereMonth('payment_date', now()->subMonth()->month)
            ->whereYear('payment_date', now()->subMonth()->year)
            ->sum('amount') ?? 0;
        $revenueChange = $lastMonthRevenue > 0 ? round((($currentMonthRevenue - $lastMonthRevenue) / $lastMonthRevenue) * 100) : 0;

        // إجمالي العقود
        $totalContracts = Contract::count();
        $contractsLastMonth = Contract::where('created_at', '<', now()->subMonth())->count();
        $contractsChange = $contractsLastMonth > 0 ? round((($totalContracts - $contractsLastMonth) / $contractsLastMonth) * 100) : 0;

        $stats = [
            [
                'id' => '1',
                'title' => 'إجمالي المكاتب',
                'value' => $totalOffices,
                'change' => $officesChange,
                'icon' => 'Building2',
                'color' => 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300',
            ],
            [
                'id' => '2',
                'title' => 'إجمالي المستخدمين',
                'value' => $totalUsers,
                'change' => $usersChange,
                'icon' => 'Users',
                'color' => 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300',
            ],
            [
                'id' => '3',
                'title' => 'إجمالي الإيرادات الشهرية',
                'value' => number_format($currentMonthRevenue, 0, '.', ','),
                'change' => $revenueChange,
                'icon' => 'DollarSign',
                'color' => 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-300',
            ],
            [
                'id' => '4',
                'title' => 'إجمالي العقود',
                'value' => $totalContracts,
                'change' => $contractsChange,
                'icon' => 'FileText',
                'color' => 'bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300',
            ],
        ];

        // توزيع المستخدمين حسب المكاتب (بيانات وهمية - يمكن تحديثها لاحقاً)
        $usersByOffice = [
            ['name' => 'المكتب الرئيسي', 'value' => round($totalUsers * 0.32)],
            ['name' => 'مكتب الشمال', 'value' => round($totalUsers * 0.23)],
            ['name' => 'مكتب الجنوب', 'value' => round($totalUsers * 0.20)],
            ['name' => 'مكتب الشرق', 'value' => round($totalUsers * 0.25)],
        ];

        // الإيرادات الشهرية للمكاتب (آخر 6 أشهر)
        $monthlyRevenue = [];
        $months = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو'];
        for ($i = 5; $i >= 0; $i--) {
            $month = now()->subMonths($i);
            $revenue = ContractPayment::whereMonth('payment_date', $month->month)
                ->whereYear('payment_date', $month->year)
                ->sum('amount') ?? 0;
            
            $monthlyRevenue[] = [
                'month' => $months[$month->month - 1] ?? $month->format('M'),
                'المكتب الرئيسي' => round($revenue * 0.32),
                'مكتب الشمال' => round($revenue * 0.23),
                'مكتب الجنوب' => round($revenue * 0.20),
                'مكتب الشرق' => round($revenue * 0.25),
            ];
        }

        // النشاط الأسبوعي للمكاتب
        $weeklyActivity = [];
        $days = ['السبت', 'الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الجمعة'];
        for ($i = 6; $i >= 0; $i--) {
            $day = now()->subDays($i);
            $dayName = $days[$day->dayOfWeek] ?? $day->format('D');
            $contractsCount = Contract::whereDate('created_at', $day->format('Y-m-d'))->count();
            
            $weeklyActivity[] = [
                'day' => $dayName,
                'المكتب الرئيسي' => round($contractsCount * 0.32),
                'مكتب الشمال' => round($contractsCount * 0.23),
                'مكتب الجنوب' => round($contractsCount * 0.20),
                'مكتب الشرق' => round($contractsCount * 0.25),
            ];
        }

        // توزيع المعدات حسب المكاتب
        $equipmentByOffice = [];
        $totalAvailable = Scaffold::where('status', 'available')->count();
        $totalRented = Scaffold::where('status', 'rented')->count();
        $totalMaintenance = Scaffold::where('status', 'maintenance')->count();
        
        $offices = ['مكتب الشمال', 'مكتب الشرق'];
        foreach ($offices as $office) {
            $equipmentByOffice[] = [
                'office' => $office,
                'متاح' => round($totalAvailable * 0.25),
                'مؤجر' => round($totalRented * 0.25),
                'صيانة' => round($totalMaintenance * 0.25),
            ];
        }

        // النشاط الأخير
        $activities = [];
        
        // آخر العقود
        $recentContracts = Contract::with(['customer', 'user'])
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get();
        
        foreach ($recentContracts as $contract) {
            $timeAgo = $this->formatTimeAgo($contract->created_at);
            $contractType = $contract->payment_type === 'rental' ? 'تأجير' : ($contract->payment_type === 'sale' ? 'شراء' : 'تأجير');
            $activities[] = [
                'description' => "تم إنشاء عقد {$contractType} سقالات - {$contract->title}",
                'time' => $timeAgo,
                'user' => $contract->user->name ?? 'غير معروف',
                'timestamp' => $contract->created_at->timestamp,
            ];
        }

        // آخر المدفوعات
        $recentPayments = ContractPayment::with(['contract.customer', 'contract.user'])
            ->orderBy('created_at', 'desc')
            ->limit(3)
            ->get();
        
        foreach ($recentPayments as $payment) {
            $timeAgo = $this->formatTimeAgo($payment->created_at);
            $customerName = $payment->contract->customer->name ?? 'غير معروف';
            $userName = $payment->contract->user->name ?? 'غير معروف';
            $activities[] = [
                'description' => "تم استلام دفعة بقيمة " . number_format($payment->amount, 2) . " ر.ع. من {$customerName}",
                'time' => $timeAgo,
                'user' => $userName,
                'timestamp' => $payment->created_at->timestamp,
            ];
        }

        // آخر العملاء
        $recentCustomers = Customer::orderBy('created_at', 'desc')->limit(2)->get();
        foreach ($recentCustomers as $customer) {
            $timeAgo = $this->formatTimeAgo($customer->created_at);
            $activities[] = [
                'description' => "تم تسجيل عميل جديد: {$customer->name}",
                'time' => $timeAgo,
                'user' => 'النظام',
                'timestamp' => $customer->created_at->timestamp,
            ];
        }

        // ترتيب حسب التاريخ
        usort($activities, function($a, $b) {
            return ($b['timestamp'] ?? 0) - ($a['timestamp'] ?? 0);
        });
        $activities = array_slice($activities, 0, 5);

        // آخر العقود للجدول
        $recentContractsForTable = Contract::with(['customer'])
            ->orderBy('created_at', 'desc')
            ->limit(7)
            ->get()
            ->map(function ($contract) {
                $paidAmount = $contract->contractPayments()->sum('amount') ?? 0;
                $remainingAmount = max(0, ($contract->amount ?? 0) - $paidAmount);
                
                $contractType = $contract->payment_type === 'rental' ? 'تأجير' : ($contract->payment_type === 'sale' ? 'شراء' : 'تأجير');
                return [
                    'id' => $contract->id,
                    'contractNumber' => $contract->contract_number,
                    'customerName' => $contract->customer->name ?? 'غير معروف',
                    'contractType' => $contractType,
                    'status' => $contract->status,
                    'progress' => $this->getContractProgress($contract),
                    'totalAmount' => (float) $contract->amount,
                ];
            });

        return Inertia::render('Dashboard', [
            'stats' => $stats,
            'activities' => $activities,
            'lastUpdated' => now()->format('d/m/Y, H:i'),
            'usersByOffice' => $usersByOffice,
            'monthlyRevenue' => $monthlyRevenue,
            'weeklyActivity' => $weeklyActivity,
            'equipmentByOffice' => $equipmentByOffice,
            'recentContracts' => $recentContractsForTable,
        ]);
    }

    private function getContractProgress($contract)
    {
        // تحديد مراحل العقد
        $stages = ['في المخزن', 'خرج للتسليم', 'لدى العميل', 'عاد إلى المخزن'];
        
        // منطق بسيط لتحديد المرحلة (يمكن تحسينه لاحقاً)
        if ($contract->status === 'ACTIVE') {
            return [
                ['stage' => 'في المخزن', 'completed' => true],
                ['stage' => 'خرج للتسليم', 'completed' => true],
                ['stage' => 'لدى العميل', 'completed' => true],
                ['stage' => 'عاد إلى المخزن', 'completed' => false],
            ];
        } elseif ($contract->status === 'COMPLETED') {
            return [
                ['stage' => 'في المخزن', 'completed' => true],
                ['stage' => 'خرج للتسليم', 'completed' => true],
                ['stage' => 'لدى العميل', 'completed' => true],
                ['stage' => 'عاد إلى المخزن', 'completed' => true],
            ];
        } else {
            return [
                ['stage' => 'في المخزن', 'completed' => true],
                ['stage' => 'خرج للتسليم', 'completed' => false],
                ['stage' => 'لدى العميل', 'completed' => false],
                ['stage' => 'عاد إلى المخزن', 'completed' => false],
            ];
        }
    }

    private function formatTimeAgo($date)
    {
        $diff = $date->diffInMinutes(now());
        
        if ($diff < 1) {
            return 'الآن';
        } elseif ($diff < 60) {
            return "منذ " . round($diff) . " دقيقة";
        } elseif ($diff < 1440) {
            $hours = floor($diff / 60);
            return "منذ {$hours} " . ($hours === 1 ? 'ساعة' : 'ساعات');
        } elseif ($diff < 10080) {
            $days = floor($diff / 1440);
            return "منذ {$days} " . ($days === 1 ? 'يوم' : 'أيام');
        } else {
            $weeks = floor($diff / 10080);
            return "منذ {$weeks} " . ($weeks === 1 ? 'أسبوع' : 'أسابيع');
        }
    }
}
