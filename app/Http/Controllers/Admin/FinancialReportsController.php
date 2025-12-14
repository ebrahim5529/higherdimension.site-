<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use App\Models\Contract;
use Inertia\Inertia;

class FinancialReportsController extends Controller
{
    public function index()
    {
        $stats = [
            [
                'title' => 'إجمالي الإيرادات',
                'value' => number_format(Payment::sum('amount'), 0),
                'change' => '+15%',
            ],
            [
                'title' => 'إجمالي المدفوعات',
                'value' => Payment::count(),
                'change' => '+8',
            ],
            [
                'title' => 'متوسط قيمة العقد',
                'value' => number_format(Contract::avg('amount') ?? 0, 0),
                'change' => '+5%',
            ],
        ];

        return Inertia::render('FinancialReports', [
            'stats' => $stats,
        ]);
    }
}
