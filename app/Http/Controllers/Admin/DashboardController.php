<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $stats = [
            [
                'id' => '1',
                'title' => 'إجمالي المكاتب',
                'value' => '12',
                'change' => 0,
                'icon' => 'Building2',
                'color' => 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300',
            ],
            [
                'id' => '2',
                'title' => 'إجمالي المستخدمين',
                'value' => User::count(),
                'change' => 12,
                'icon' => 'Users',
                'color' => 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300',
            ],
            [
                'id' => '3',
                'title' => 'إجمالي الإيرادات الشهرية',
                'value' => '150,000',
                'change' => 15,
                'icon' => 'DollarSign',
                'color' => 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-300',
            ],
            [
                'id' => '4',
                'title' => 'إجمالي العقود',
                'value' => '45',
                'change' => 8,
                'icon' => 'FileText',
                'color' => 'bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300',
            ],
        ];

        $activities = [
            [
                'description' => 'تم إنشاء عقد جديد',
                'time' => 'منذ ساعتين',
                'user' => 'أحمد محمد',
            ],
            [
                'description' => 'تم إضافة عميل جديد',
                'time' => 'منذ 4 ساعات',
                'user' => 'فاطمة علي',
            ],
            [
                'description' => 'تم تحديث حالة الدفع',
                'time' => 'منذ 6 ساعات',
                'user' => 'محمد حسن',
            ],
        ];

        return Inertia::render('Dashboard', [
            'stats' => $stats,
            'activities' => $activities,
            'lastUpdated' => now()->toISOString(),
        ]);
    }
}
