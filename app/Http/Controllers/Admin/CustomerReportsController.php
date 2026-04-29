<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Contract;
use App\Models\Customer;
use Illuminate\Support\Facades\DB;
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

        $from = request()->query('from');
        $to = request()->query('to');
        $fromDate = is_string($from) && preg_match('/^\\d{4}-\\d{2}-\\d{2}$/', $from) ? $from : null;
        $toDate = is_string($to) && preg_match('/^\\d{4}-\\d{2}-\\d{2}$/', $to) ? $to : null;
        $contractStatus = request()->query('contract_status');
        $contractStatusFilter = is_string($contractStatus) && $contractStatus !== '' ? $contractStatus : null;

        $totalsSub = Contract::query()
            ->selectRaw('customer_id, COALESCE(SUM(amount - COALESCE(total_discount, 0)), 0) as total_amount')
            ->when($fromDate, function ($q) use ($fromDate) {
                $q->whereDate('start_date', '>=', $fromDate);
            })
            ->when($toDate, function ($q) use ($toDate) {
                $q->whereDate('start_date', '<=', $toDate);
            })
            ->groupBy('customer_id');

        $paidSub = DB::table('contract_payments')
            ->join('contracts', 'contracts.id', '=', 'contract_payments.contract_id')
            ->selectRaw('contracts.customer_id as customer_id, COALESCE(SUM(contract_payments.amount), 0) as paid_amount')
            ->when($fromDate, function ($q) use ($fromDate) {
                $q->whereDate('contract_payments.payment_date', '>=', $fromDate);
            })
            ->when($toDate, function ($q) use ($toDate) {
                $q->whereDate('contract_payments.payment_date', '<=', $toDate);
            })
            ->groupBy('contracts.customer_id');

        $customers = Customer::query()
            ->select([
                'customers.id',
                'customers.customer_number',
                'customers.name',
                'customers.phone',
                'customers.notes',
            ])
            ->leftJoinSub($totalsSub, 'totals', function ($join) {
                $join->on('totals.customer_id', '=', 'customers.id');
            })
            ->leftJoinSub($paidSub, 'paid', function ($join) {
                $join->on('paid.customer_id', '=', 'customers.id');
            })
            ->selectRaw('COALESCE(totals.total_amount, 0) as total_amount')
            ->selectRaw('COALESCE(paid.paid_amount, 0) as paid_amount')
            ->selectRaw('GREATEST(COALESCE(totals.total_amount, 0) - COALESCE(paid.paid_amount, 0), 0) as remaining_amount')
            ->orderBy('customers.name')
            ->get()
            ->map(function ($row) {
                return [
                    'id' => (int) $row->id,
                    'customerNumber' => (string) ($row->customer_number ?? ''),
                    'name' => (string) ($row->name ?? ''),
                    'phone' => (string) ($row->phone ?? ''),
                    'totalAmount' => (float) ($row->total_amount ?? 0),
                    'paidAmount' => (float) ($row->paid_amount ?? 0),
                    'remainingAmount' => (float) ($row->remaining_amount ?? 0),
                    'notes' => (string) ($row->notes ?? ''),
                ];
            })
            ->values();

        $today = now()->toDateString();

        $contracts = Contract::query()
            ->with(['customer'])
            ->when($fromDate, function ($q) use ($fromDate) {
                $q->whereDate('start_date', '>=', $fromDate);
            })
            ->when($toDate, function ($q) use ($toDate) {
                $q->whereDate('start_date', '<=', $toDate);
            })
            ->when($contractStatusFilter, function ($q) use ($contractStatusFilter) {
                $q->where('status', $contractStatusFilter);
            })
            ->orderByRaw(
                "CASE
                    WHEN status IN ('ACTIVE', 'OPEN') AND end_date IS NOT NULL AND end_date < ? THEN 0
                    WHEN status IN ('ACTIVE', 'OPEN') THEN 1
                    ELSE 2
                END",
                [$today]
            )
            ->orderByRaw('CASE WHEN end_date IS NULL THEN 1 ELSE 0 END')
            ->orderBy('end_date')
            ->orderByDesc('id')
            ->paginate(10)
            ->withQueryString()
            ->through(function ($contract) {
                return [
                    'id' => (int) $contract->id,
                    'contractNumber' => (string) ($contract->contract_number ?? ''),
                    'status' => (string) ($contract->status ?? ''),
                    'startDate' => $contract->start_date?->format('Y-m-d'),
                    'endDate' => $contract->end_date?->format('Y-m-d'),
                    'customerName' => (string) ($contract->customer?->name ?? 'غير معروف'),
                    'amount' => (float) ($contract->amount ?? 0),
                ];
            });

        return Inertia::render('CustomerReports', [
            'stats' => $stats,
            'customers' => $customers,
            'contracts' => $contracts,
            'filters' => [
                'from' => $fromDate,
                'to' => $toDate,
                'contractStatus' => $contractStatusFilter,
            ],
        ]);
    }
}
