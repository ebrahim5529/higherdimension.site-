<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use App\Models\Contract;
use App\Models\Payment;
use Inertia\Inertia;

class DashboardInteractiveController extends Controller
{
    public function index()
    {
        $stats = [
            [
                'title' => 'إجمالي العملاء',
                'value' => Customer::count(),
                'change' => '+5',
                'trend' => 'up',
            ],
            [
                'title' => 'إجمالي العقود',
                'value' => Contract::count(),
                'change' => '+3',
                'trend' => 'up',
            ],
            [
                'title' => 'إجمالي المدفوعات',
                'value' => number_format(Payment::sum('amount'), 0),
                'change' => '+12%',
                'trend' => 'up',
            ],
            [
                'title' => 'العقود النشطة',
                'value' => Contract::where('status', 'ACTIVE')->count(),
                'change' => '+2',
                'trend' => 'up',
            ],
        ];

        return Inertia::render('DashboardInteractive', [
            'stats' => $stats,
        ]);
    }
}
