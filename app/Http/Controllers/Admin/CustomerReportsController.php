<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use Inertia\Inertia;

class CustomerReportsController extends Controller
{
    public function index()
    {
        $stats = [
            [
                'title' => 'إجمالي العملاء',
                'value' => Customer::count(),
                'change' => '+5',
            ],
            [
                'title' => 'العملاء النشطون',
                'value' => Customer::where('status', 'ACTIVE')->count(),
                'change' => '+3',
            ],
            [
                'title' => 'العملاء غير النشطين',
                'value' => Customer::where('status', 'INACTIVE')->count(),
                'change' => '+2',
            ],
        ];

        return Inertia::render('CustomerReports', [
            'stats' => $stats,
        ]);
    }
}
