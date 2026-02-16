<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Account;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AccountController extends Controller
{
    public function index()
    {
        $accounts = Account::with('childrenRecursive')
            ->roots()
            ->orderBy('code')
            ->get();

        $flatAccounts = Account::orderBy('code')->get();

        return Inertia::render('Accounting/ChartOfAccounts/Index', [
            'accounts' => $accounts,
            'flatAccounts' => $flatAccounts,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'code' => 'required|string|max:20|unique:accounts,code',
            'name' => 'required|string|max:255',
            'parent_id' => 'nullable|exists:accounts,id',
            'type' => 'required|in:asset,liability,equity,revenue,expense',
            'description' => 'nullable|string',
            'is_parent' => 'boolean',
        ]);

        if ($validated['parent_id']) {
            $parent = Account::findOrFail($validated['parent_id']);
            $validated['level'] = $parent->level + 1;
            $validated['type'] = $parent->type;
        } else {
            $validated['level'] = 1;
        }

        Account::create($validated);

        return redirect()->back()->with('success', 'تم إضافة الحساب بنجاح');
    }

    public function update(Request $request, $id)
    {
        $account = Account::findOrFail($id);

        $validated = $request->validate([
            'code' => 'required|string|max:20|unique:accounts,code,' . $id,
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'is_active' => 'boolean',
            'is_parent' => 'boolean',
        ]);

        $account->update($validated);

        return redirect()->back()->with('success', 'تم تحديث الحساب بنجاح');
    }

    public function destroy($id)
    {
        $account = Account::findOrFail($id);

        if ($account->children()->count() > 0) {
            return redirect()->back()->with('error', 'لا يمكن حذف حساب لديه حسابات فرعية');
        }

        if ($account->journalEntryItems()->count() > 0) {
            return redirect()->back()->with('error', 'لا يمكن حذف حساب مرتبط بقيود محاسبية');
        }

        $account->delete();

        return redirect()->back()->with('success', 'تم حذف الحساب بنجاح');
    }
}
