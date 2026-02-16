<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Account;
use App\Models\JournalEntry;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class JournalEntryController extends Controller
{
    public function index(Request $request)
    {
        $query = JournalEntry::with(['creator', 'items.account'])
            ->orderByDesc('date')
            ->orderByDesc('id');

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('date_from')) {
            $query->whereDate('date', '>=', $request->date_from);
        }

        if ($request->filled('date_to')) {
            $query->whereDate('date', '<=', $request->date_to);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('entry_number', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        $entries = $query->paginate(20)->withQueryString();

        return Inertia::render('Accounting/JournalEntries/Index', [
            'entries' => $entries,
            'filters' => $request->only(['status', 'date_from', 'date_to', 'search']),
        ]);
    }

    public function create()
    {
        $accounts = Account::where('is_parent', false)
            ->where('is_active', true)
            ->orderBy('code')
            ->get(['id', 'code', 'name', 'type']);

        $entryNumber = JournalEntry::generateEntryNumber();

        return Inertia::render('Accounting/JournalEntries/Create', [
            'accounts' => $accounts,
            'entryNumber' => $entryNumber,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'date' => 'required|date',
            'description' => 'required|string',
            'reference_type' => 'nullable|string',
            'reference_id' => 'nullable|integer',
            'items' => 'required|array|min:2',
            'items.*.account_id' => 'required|exists:accounts,id',
            'items.*.debit' => 'required|numeric|min:0',
            'items.*.credit' => 'required|numeric|min:0',
            'items.*.description' => 'nullable|string',
        ]);

        $totalDebit = collect($validated['items'])->sum('debit');
        $totalCredit = collect($validated['items'])->sum('credit');

        if (abs($totalDebit - $totalCredit) > 0.01) {
            return redirect()->back()
                ->withErrors(['items' => 'إجمالي المدين يجب أن يساوي إجمالي الدائن'])
                ->withInput();
        }

        DB::transaction(function () use ($validated, $totalDebit, $totalCredit) {
            $entry = JournalEntry::create([
                'entry_number' => JournalEntry::generateEntryNumber(),
                'date' => $validated['date'],
                'description' => $validated['description'],
                'reference_type' => $validated['reference_type'] ?? null,
                'reference_id' => $validated['reference_id'] ?? null,
                'status' => 'draft',
                'total_debit' => $totalDebit,
                'total_credit' => $totalCredit,
                'created_by' => Auth::id(),
            ]);

            foreach ($validated['items'] as $item) {
                $entry->items()->create([
                    'account_id' => $item['account_id'],
                    'debit' => $item['debit'],
                    'credit' => $item['credit'],
                    'description' => $item['description'] ?? null,
                ]);
            }
        });

        return redirect()->route('accounting.journal-entries.index')
            ->with('success', 'تم إنشاء القيد المحاسبي بنجاح');
    }

    public function show($id)
    {
        $entry = JournalEntry::with(['creator', 'items.account'])->findOrFail($id);

        return Inertia::render('Accounting/JournalEntries/Show', [
            'entry' => $entry,
        ]);
    }

    public function edit($id)
    {
        $entry = JournalEntry::with('items.account')->findOrFail($id);

        if ($entry->status !== 'draft') {
            return redirect()->back()->with('error', 'لا يمكن تعديل قيد مرحّل أو ملغي');
        }

        $accounts = Account::where('is_parent', false)
            ->where('is_active', true)
            ->orderBy('code')
            ->get(['id', 'code', 'name', 'type']);

        return Inertia::render('Accounting/JournalEntries/Edit', [
            'entry' => $entry,
            'accounts' => $accounts,
        ]);
    }

    public function update(Request $request, $id)
    {
        $entry = JournalEntry::findOrFail($id);

        if ($entry->status !== 'draft') {
            return redirect()->back()->with('error', 'لا يمكن تعديل قيد مرحّل أو ملغي');
        }

        $validated = $request->validate([
            'date' => 'required|date',
            'description' => 'required|string',
            'reference_type' => 'nullable|string',
            'reference_id' => 'nullable|integer',
            'items' => 'required|array|min:2',
            'items.*.account_id' => 'required|exists:accounts,id',
            'items.*.debit' => 'required|numeric|min:0',
            'items.*.credit' => 'required|numeric|min:0',
            'items.*.description' => 'nullable|string',
        ]);

        $totalDebit = collect($validated['items'])->sum('debit');
        $totalCredit = collect($validated['items'])->sum('credit');

        if (abs($totalDebit - $totalCredit) > 0.01) {
            return redirect()->back()
                ->withErrors(['items' => 'إجمالي المدين يجب أن يساوي إجمالي الدائن'])
                ->withInput();
        }

        DB::transaction(function () use ($entry, $validated, $totalDebit, $totalCredit) {
            $entry->update([
                'date' => $validated['date'],
                'description' => $validated['description'],
                'reference_type' => $validated['reference_type'] ?? null,
                'reference_id' => $validated['reference_id'] ?? null,
                'total_debit' => $totalDebit,
                'total_credit' => $totalCredit,
            ]);

            $entry->items()->delete();

            foreach ($validated['items'] as $item) {
                $entry->items()->create([
                    'account_id' => $item['account_id'],
                    'debit' => $item['debit'],
                    'credit' => $item['credit'],
                    'description' => $item['description'] ?? null,
                ]);
            }
        });

        return redirect()->route('accounting.journal-entries.index')
            ->with('success', 'تم تحديث القيد المحاسبي بنجاح');
    }

    public function destroy($id)
    {
        $entry = JournalEntry::findOrFail($id);

        if ($entry->status !== 'draft') {
            return redirect()->back()->with('error', 'لا يمكن حذف قيد مرحّل أو ملغي');
        }

        $entry->delete();

        return redirect()->route('accounting.journal-entries.index')
            ->with('success', 'تم حذف القيد المحاسبي بنجاح');
    }

    public function post($id)
    {
        $entry = JournalEntry::findOrFail($id);

        if ($entry->status !== 'draft') {
            return redirect()->back()->with('error', 'هذا القيد مرحّل بالفعل أو ملغي');
        }

        $entry->update(['status' => 'posted']);

        return redirect()->back()->with('success', 'تم ترحيل القيد بنجاح');
    }
}
