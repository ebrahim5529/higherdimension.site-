<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Contract;
use App\Models\ContractPayment;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class FinancialReportsController extends Controller
{
    public function index()
    {
        $totalContractsAmount = (float) (Contract::sum('amount') ?? 0);
        $totalPaid = (float) (ContractPayment::sum('amount') ?? 0);
        $outstanding = max(0, $totalContractsAmount - $totalPaid);
        $contractsCount = (int) (Contract::count() ?? 0);
        $paymentsCount = (int) (ContractPayment::count() ?? 0);
        $avgContractAmount = (float) (Contract::avg('amount') ?? 0);

        $start = Carbon::now()->startOfMonth()->subMonths(11);
        $end = Carbon::now()->endOfMonth();

        $paymentsMonthly = ContractPayment::query()
            ->whereBetween('payment_date', [$start, $end])
            ->selectRaw("DATE_FORMAT(payment_date, '%Y-%m') as ym, SUM(amount) as total")
            ->groupBy('ym')
            ->orderBy('ym')
            ->pluck('total', 'ym');

        $contractsMonthly = Contract::query()
            ->whereBetween('created_at', [$start, $end])
            ->selectRaw("DATE_FORMAT(created_at, '%Y-%m') as ym, SUM(amount) as total, COUNT(*) as count")
            ->groupBy('ym')
            ->orderBy('ym')
            ->get()
            ->keyBy('ym');

        $monthly = [];
        $cursor = $start->copy();
        while ($cursor->lte($end)) {
            $ym = $cursor->format('Y-m');
            $monthly[] = [
                'month' => $cursor->format('m/Y'),
                'contractsAmount' => (float) ($contractsMonthly[$ym]->total ?? 0),
                'contractsCount' => (int) ($contractsMonthly[$ym]->count ?? 0),
                'paymentsAmount' => (float) ($paymentsMonthly[$ym] ?? 0),
            ];
            $cursor->addMonth();
        }

        $paymentMethods = ContractPayment::query()
            ->select('payment_method', DB::raw('SUM(amount) as total'))
            ->groupBy('payment_method')
            ->orderByDesc('total')
            ->get()
            ->map(function ($row) {
                return [
                    'name' => $row->payment_method ?: 'غير محدد',
                    'value' => (float) ($row->total ?? 0),
                ];
            })
            ->values();

        $stats = [
            [
                'title' => 'إجمالي قيمة العقود',
                'value' => number_format($totalContractsAmount, 2),
                'change' => 'حسب جدول العقود',
            ],
            [
                'title' => 'إجمالي المدفوعات',
                'value' => number_format($totalPaid, 2),
                'change' => 'حسب جدول المدفوعات',
            ],
            [
                'title' => 'المتبقي',
                'value' => number_format($outstanding, 2),
                'change' => 'قيمة العقود - المدفوعات',
            ],
        ];

        return Inertia::render('FinancialReports', [
            'stats' => $stats,
            'summary' => [
                'totalContractsAmount' => $totalContractsAmount,
                'totalPaid' => $totalPaid,
                'outstanding' => $outstanding,
                'contractsCount' => $contractsCount,
                'paymentsCount' => $paymentsCount,
                'avgContractAmount' => $avgContractAmount,
            ],
            'monthly' => $monthly,
            'paymentMethods' => $paymentMethods,
        ]);
    }
}
