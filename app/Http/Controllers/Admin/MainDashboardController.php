<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Contract;
use App\Models\Payment;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class MainDashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        $canViewFinancial = $user?->hasPermissionTo('access-financial') ?? false;
        $canViewContracts = $user?->hasPermissionTo('access-contracts') ?? false;
        $canViewEmployees = $user?->hasPermissionTo('access-employees') ?? false;

        $mainStats = [
            [
                'title' => 'إجمالي المكاتب',
                'value' => '4',
                'change' => '+0%',
                'icon' => 'Building2',
                'color' => 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300',
            ],
            [
                'title' => 'إجمالي المستخدمين',
                'value' => (string) User::count(),
                'change' => '+12%',
                'icon' => 'Users',
                'color' => 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300',
            ],
        ];

        if ($canViewFinancial) {
            $mainStats[] = [
                'title' => 'إجمالي الإيرادات',
                'value' => number_format((float) (Payment::sum('amount') ?? 0), 0),
                'change' => '+15%',
                'icon' => 'DollarSign',
                'color' => 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-300',
            ];
        }

        if ($canViewContracts || $canViewFinancial) {
            $mainStats[] = [
                'title' => 'نمو الأعمال',
                'value' => '18.5%',
                'change' => '+3.2%',
                'icon' => 'TrendingUp',
                'color' => 'bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300',
            ];
        }

        $recentActivities = [];
        if ($canViewContracts || $canViewFinancial) {
            $recentActivities = [
                [
                    'id' => '1',
                    'type' => 'success',
                    'title' => 'تم إنشاء عقد جديد',
                    'description' => 'عقد تأجير سقالات لمشروع البناء التجاري',
                    'time' => 'منذ 5 دقائق',
                    'user' => $canViewEmployees ? 'أحمد محمد' : 'غير معروف',
                ],
                [
                    'id' => '2',
                    'type' => 'warning',
                    'title' => 'دفعة متأخرة',
                    'description' => 'دفعة متأخرة من شركة المقاولات الكبرى',
                    'time' => 'منذ 15 دقيقة',
                    'user' => $canViewEmployees ? 'فاطمة علي' : 'غير معروف',
                ],
                [
                    'id' => '3',
                    'type' => 'info',
                    'title' => 'تحديث المخزون',
                    'description' => 'تم إضافة 50 وحدة سقالات جديدة',
                    'time' => 'منذ ساعة',
                    'user' => $canViewEmployees ? 'محمد السعد' : 'غير معروف',
                ],
                [
                    'id' => '4',
                    'type' => 'success',
                    'title' => 'عميل جديد',
                    'description' => 'تم تسجيل عميل جديد: شركة الإنشاءات المتقدمة',
                    'time' => 'منذ ساعتين',
                    'user' => $canViewEmployees ? 'سارة أحمد' : 'غير معروف',
                ],
            ];
        }

        $officePerformance = [
            [
                'office' => 'المكتب الرئيسي',
                'revenue' => $canViewFinancial ? 125000 : 0,
                'contracts' => $canViewContracts ? Contract::count() : 0,
                'users' => User::count(),
                'growth' => 12.5,
            ],
        ];

        return Inertia::render('MainDashboard', [
            'mainStats' => $mainStats,
            'recentActivities' => $recentActivities,
            'officePerformance' => $officePerformance,
        ]);
    }
}
