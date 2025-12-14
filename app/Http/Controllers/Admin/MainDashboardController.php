<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use App\Models\Contract;
use App\Models\Payment;
use App\Models\User;
use Inertia\Inertia;

class MainDashboardController extends Controller
{
    public function index()
    {
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
            [
                'title' => 'إجمالي الإيرادات',
                'value' => number_format(Payment::sum('amount'), 0),
                'change' => '+15%',
                'icon' => 'DollarSign',
                'color' => 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-300',
            ],
            [
                'title' => 'نمو الأعمال',
                'value' => '18.5%',
                'change' => '+3.2%',
                'icon' => 'TrendingUp',
                'color' => 'bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300',
            ],
        ];

        $recentActivities = [
            [
                'id' => '1',
                'type' => 'success',
                'title' => 'تم إنشاء عقد جديد',
                'description' => 'عقد تأجير سقالات لمشروع البناء التجاري',
                'time' => 'منذ 5 دقائق',
                'user' => 'أحمد محمد',
            ],
            [
                'id' => '2',
                'type' => 'warning',
                'title' => 'دفعة متأخرة',
                'description' => 'دفعة متأخرة من شركة المقاولات الكبرى',
                'time' => 'منذ 15 دقيقة',
                'user' => 'فاطمة علي',
            ],
            [
                'id' => '3',
                'type' => 'info',
                'title' => 'تحديث المخزون',
                'description' => 'تم إضافة 50 وحدة سقالات جديدة',
                'time' => 'منذ ساعة',
                'user' => 'محمد السعد',
            ],
            [
                'id' => '4',
                'type' => 'success',
                'title' => 'عميل جديد',
                'description' => 'تم تسجيل عميل جديد: شركة الإنشاءات المتقدمة',
                'time' => 'منذ ساعتين',
                'user' => 'سارة أحمد',
            ],
        ];

        $officePerformance = [
            [
                'office' => 'المكتب الرئيسي',
                'revenue' => 125000,
                'contracts' => Contract::count(),
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
