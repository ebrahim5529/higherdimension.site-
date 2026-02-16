<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Account;
use App\Models\JournalEntry;
use App\Models\JournalEntryItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class AccountingReportController extends Controller
{
    public function trialBalance(Request $request)
    {
        $dateFrom = $request->get('date_from');
        $dateTo = $request->get('date_to');

        $query = JournalEntryItem::query()
            ->join('accounts', 'journal_entry_items.account_id', '=', 'accounts.id')
            ->join('journal_entries', 'journal_entry_items.journal_entry_id', '=', 'journal_entries.id')
            ->where('journal_entries.status', 'posted')
            ->select(
                'accounts.id',
                'accounts.code',
                'accounts.name',
                'accounts.type',
                DB::raw('SUM(journal_entry_items.debit) as total_debit'),
                DB::raw('SUM(journal_entry_items.credit) as total_credit')
            )
            ->groupBy('accounts.id', 'accounts.code', 'accounts.name', 'accounts.type')
            ->orderBy('accounts.code');

        if ($dateFrom) {
            $query->whereDate('journal_entries.date', '>=', $dateFrom);
        }
        if ($dateTo) {
            $query->whereDate('journal_entries.date', '<=', $dateTo);
        }

        $data = $query->get()->map(function ($row) {
            $balance = (float) $row->total_debit - (float) $row->total_credit;
            return [
                'id' => $row->id,
                'code' => $row->code,
                'name' => $row->name,
                'type' => $row->type,
                'total_debit' => (float) $row->total_debit,
                'total_credit' => (float) $row->total_credit,
                'debit_balance' => $balance > 0 ? $balance : 0,
                'credit_balance' => $balance < 0 ? abs($balance) : 0,
            ];
        });

        return Inertia::render('Accounting/Reports/TrialBalance', [
            'data' => $data,
            'filters' => $request->only(['date_from', 'date_to']),
            'totals' => [
                'total_debit' => $data->sum('total_debit'),
                'total_credit' => $data->sum('total_credit'),
                'debit_balance' => $data->sum('debit_balance'),
                'credit_balance' => $data->sum('credit_balance'),
            ],
        ]);
    }

    public function balanceSheet(Request $request)
    {
        $dateTo = $request->get('date_to', now()->format('Y-m-d'));

        $accounts = Account::where('is_parent', false)
            ->whereIn('type', ['asset', 'liability', 'equity'])
            ->orderBy('code')
            ->get()
            ->map(function ($account) use ($dateTo) {
                $debit = JournalEntryItem::where('account_id', $account->id)
                    ->whereHas('journalEntry', function ($q) use ($dateTo) {
                        $q->where('status', 'posted')->whereDate('date', '<=', $dateTo);
                    })->sum('debit');

                $credit = JournalEntryItem::where('account_id', $account->id)
                    ->whereHas('journalEntry', function ($q) use ($dateTo) {
                        $q->where('status', 'posted')->whereDate('date', '<=', $dateTo);
                    })->sum('credit');

                $balance = in_array($account->type, ['asset'])
                    ? (float) $debit - (float) $credit
                    : (float) $credit - (float) $debit;

                return [
                    'id' => $account->id,
                    'code' => $account->code,
                    'name' => $account->name,
                    'type' => $account->type,
                    'balance' => $balance,
                ];
            })
            ->filter(fn($a) => abs($a['balance']) > 0.01);

        $assets = $accounts->where('type', 'asset')->values();
        $liabilities = $accounts->where('type', 'liability')->values();
        $equity = $accounts->where('type', 'equity')->values();

        return Inertia::render('Accounting/Reports/BalanceSheet', [
            'assets' => $assets,
            'liabilities' => $liabilities,
            'equity' => $equity,
            'totals' => [
                'assets' => $assets->sum('balance'),
                'liabilities' => $liabilities->sum('balance'),
                'equity' => $equity->sum('balance'),
            ],
            'filters' => ['date_to' => $dateTo],
        ]);
    }

    public function incomeStatement(Request $request)
    {
        $dateFrom = $request->get('date_from', now()->startOfYear()->format('Y-m-d'));
        $dateTo = $request->get('date_to', now()->format('Y-m-d'));

        $accounts = Account::where('is_parent', false)
            ->whereIn('type', ['revenue', 'expense'])
            ->orderBy('code')
            ->get()
            ->map(function ($account) use ($dateFrom, $dateTo) {
                $debit = JournalEntryItem::where('account_id', $account->id)
                    ->whereHas('journalEntry', function ($q) use ($dateFrom, $dateTo) {
                        $q->where('status', 'posted')
                          ->whereDate('date', '>=', $dateFrom)
                          ->whereDate('date', '<=', $dateTo);
                    })->sum('debit');

                $credit = JournalEntryItem::where('account_id', $account->id)
                    ->whereHas('journalEntry', function ($q) use ($dateFrom, $dateTo) {
                        $q->where('status', 'posted')
                          ->whereDate('date', '>=', $dateFrom)
                          ->whereDate('date', '<=', $dateTo);
                    })->sum('credit');

                $balance = $account->type === 'revenue'
                    ? (float) $credit - (float) $debit
                    : (float) $debit - (float) $credit;

                return [
                    'id' => $account->id,
                    'code' => $account->code,
                    'name' => $account->name,
                    'type' => $account->type,
                    'balance' => $balance,
                ];
            })
            ->filter(fn($a) => abs($a['balance']) > 0.01);

        $revenues = $accounts->where('type', 'revenue')->values();
        $expenses = $accounts->where('type', 'expense')->values();
        $totalRevenue = $revenues->sum('balance');
        $totalExpenses = $expenses->sum('balance');

        return Inertia::render('Accounting/Reports/IncomeStatement', [
            'revenues' => $revenues,
            'expenses' => $expenses,
            'totals' => [
                'revenue' => $totalRevenue,
                'expenses' => $totalExpenses,
                'netIncome' => $totalRevenue - $totalExpenses,
            ],
            'filters' => ['date_from' => $dateFrom, 'date_to' => $dateTo],
        ]);
    }

    public function generalLedger(Request $request)
    {
        $dateFrom = $request->get('date_from');
        $dateTo = $request->get('date_to');
        $accountId = $request->get('account_id');

        $query = JournalEntryItem::with(['journalEntry', 'account'])
            ->whereHas('journalEntry', function ($q) {
                $q->where('status', 'posted');
            })
            ->join('journal_entries', 'journal_entry_items.journal_entry_id', '=', 'journal_entries.id')
            ->select('journal_entry_items.*')
            ->orderBy('journal_entries.date')
            ->orderBy('journal_entries.id');

        if ($dateFrom) {
            $query->whereDate('journal_entries.date', '>=', $dateFrom);
        }
        if ($dateTo) {
            $query->whereDate('journal_entries.date', '<=', $dateTo);
        }
        if ($accountId) {
            $query->where('journal_entry_items.account_id', $accountId);
        }

        $items = $query->get()->map(function ($item) {
            return [
                'id' => $item->id,
                'date' => $item->journalEntry->date->format('Y-m-d'),
                'entry_number' => $item->journalEntry->entry_number,
                'entry_description' => $item->journalEntry->description,
                'account_code' => $item->account->code,
                'account_name' => $item->account->name,
                'debit' => (float) $item->debit,
                'credit' => (float) $item->credit,
                'description' => $item->description,
            ];
        });

        $accounts = Account::where('is_parent', false)
            ->where('is_active', true)
            ->orderBy('code')
            ->get(['id', 'code', 'name']);

        return Inertia::render('Accounting/Reports/GeneralLedger', [
            'items' => $items,
            'accounts' => $accounts,
            'filters' => $request->only(['date_from', 'date_to', 'account_id']),
        ]);
    }

    public function accountStatement(Request $request)
    {
        $accountId = $request->get('account_id');
        $dateFrom = $request->get('date_from');
        $dateTo = $request->get('date_to');

        $accounts = Account::where('is_parent', false)
            ->where('is_active', true)
            ->orderBy('code')
            ->get(['id', 'code', 'name', 'type']);

        $items = collect();
        $account = null;
        $openingBalance = 0;

        if ($accountId) {
            $account = Account::find($accountId);

            if ($dateFrom && $account) {
                $obDebit = JournalEntryItem::where('account_id', $accountId)
                    ->whereHas('journalEntry', function ($q) use ($dateFrom) {
                        $q->where('status', 'posted')->whereDate('date', '<', $dateFrom);
                    })->sum('debit');

                $obCredit = JournalEntryItem::where('account_id', $accountId)
                    ->whereHas('journalEntry', function ($q) use ($dateFrom) {
                        $q->where('status', 'posted')->whereDate('date', '<', $dateFrom);
                    })->sum('credit');

                $openingBalance = in_array($account->type, ['asset', 'expense'])
                    ? (float) $obDebit - (float) $obCredit
                    : (float) $obCredit - (float) $obDebit;
            }

            $query = JournalEntryItem::with('journalEntry')
                ->where('account_id', $accountId)
                ->whereHas('journalEntry', function ($q) {
                    $q->where('status', 'posted');
                })
                ->join('journal_entries', 'journal_entry_items.journal_entry_id', '=', 'journal_entries.id')
                ->select('journal_entry_items.*')
                ->orderBy('journal_entries.date')
                ->orderBy('journal_entries.id');

            if ($dateFrom) {
                $query->whereDate('journal_entries.date', '>=', $dateFrom);
            }
            if ($dateTo) {
                $query->whereDate('journal_entries.date', '<=', $dateTo);
            }

            $runningBalance = $openingBalance;
            $items = $query->get()->map(function ($item) use (&$runningBalance, $account) {
                if (in_array($account->type, ['asset', 'expense'])) {
                    $runningBalance += (float) $item->debit - (float) $item->credit;
                } else {
                    $runningBalance += (float) $item->credit - (float) $item->debit;
                }

                return [
                    'id' => $item->id,
                    'date' => $item->journalEntry->date->format('Y-m-d'),
                    'entry_number' => $item->journalEntry->entry_number,
                    'description' => $item->journalEntry->description,
                    'debit' => (float) $item->debit,
                    'credit' => (float) $item->credit,
                    'balance' => $runningBalance,
                ];
            });
        }

        return Inertia::render('Accounting/Reports/AccountStatement', [
            'items' => $items,
            'accounts' => $accounts,
            'selectedAccount' => $account ? [
                'id' => $account->id,
                'code' => $account->code,
                'name' => $account->name,
                'type' => $account->type,
            ] : null,
            'openingBalance' => $openingBalance,
            'filters' => $request->only(['account_id', 'date_from', 'date_to']),
        ]);
    }

    public function journalReport(Request $request)
    {
        $dateFrom = $request->get('date_from');
        $dateTo = $request->get('date_to');

        $query = JournalEntry::with(['items.account', 'creator'])
            ->where('status', 'posted')
            ->orderBy('date')
            ->orderBy('id');

        if ($dateFrom) {
            $query->whereDate('date', '>=', $dateFrom);
        }
        if ($dateTo) {
            $query->whereDate('date', '<=', $dateTo);
        }

        $entries = $query->get()->map(function ($entry) {
            return [
                'id' => $entry->id,
                'entry_number' => $entry->entry_number,
                'date' => $entry->date->format('Y-m-d'),
                'description' => $entry->description,
                'total_debit' => (float) $entry->total_debit,
                'total_credit' => (float) $entry->total_credit,
                'created_by' => $entry->creator->name ?? '',
                'items' => $entry->items->map(function ($item) {
                    return [
                        'account_code' => $item->account->code,
                        'account_name' => $item->account->name,
                        'debit' => (float) $item->debit,
                        'credit' => (float) $item->credit,
                        'description' => $item->description,
                    ];
                }),
            ];
        });

        return Inertia::render('Accounting/Reports/JournalReport', [
            'entries' => $entries,
            'filters' => $request->only(['date_from', 'date_to']),
            'totals' => [
                'debit' => $entries->sum('total_debit'),
                'credit' => $entries->sum('total_credit'),
            ],
        ]);
    }
}
