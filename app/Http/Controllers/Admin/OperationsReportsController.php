<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Inertia\Inertia;

class OperationsReportsController extends Controller
{
    public function index()
    {
        $stats = [
            [
                'title' => 'إجمالي طلبات التسليم',
                'value' => '45',
                'change' => '+5',
            ],
            [
                'title' => 'طلبات قيد التنفيذ',
                'value' => '12',
                'change' => '+2',
            ],
            [
                'title' => 'طلبات مكتملة',
                'value' => '33',
                'change' => '+3',
            ],
        ];

        return Inertia::render('OperationsReports', [
            'stats' => $stats,
        ]);
    }
}
