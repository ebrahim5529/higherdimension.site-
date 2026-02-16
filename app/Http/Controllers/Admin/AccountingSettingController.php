<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Account;
use App\Models\AccountingSetting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AccountingSettingController extends Controller
{
    private array $settingDefinitions = [
        [
            'key' => 'cash_account_id',
            'label' => 'حساب النقدية (الصندوق)',
            'group' => 'payment',
        ],
        [
            'key' => 'bank_account_id',
            'label' => 'حساب البنك',
            'group' => 'payment',
        ],
        [
            'key' => 'customers_receivable_account_id',
            'label' => 'حساب العملاء (المدينون)',
            'group' => 'customers',
        ],
        [
            'key' => 'contract_revenue_account_id',
            'label' => 'حساب إيرادات العقود',
            'group' => 'customers',
        ],
        [
            'key' => 'suppliers_payable_account_id',
            'label' => 'حساب الموردون (الدائنون)',
            'group' => 'suppliers',
        ],
        [
            'key' => 'purchase_expense_account_id',
            'label' => 'حساب مصروفات المشتريات',
            'group' => 'suppliers',
        ],
        [
            'key' => 'salary_expense_account_id',
            'label' => 'حساب مصروف الرواتب والأجور',
            'group' => 'employees',
        ],
        [
            'key' => 'employee_payable_account_id',
            'label' => 'حساب مستحقات الموظفين',
            'group' => 'employees',
        ],
        [
            'key' => 'auto_post_entries',
            'label' => 'ترحيل القيود تلقائياً',
            'group' => 'general',
        ],
    ];

    public function index()
    {
        $settings = [];
        foreach ($this->settingDefinitions as $def) {
            $settings[$def['key']] = [
                'key' => $def['key'],
                'label' => $def['label'],
                'group' => $def['group'],
                'value' => AccountingSetting::get($def['key']),
            ];
        }

        $accounts = Account::where('is_active', true)
            ->orderBy('code')
            ->get(['id', 'code', 'name', 'type', 'is_parent'])
            ->map(fn($a) => [
                'id' => $a->id,
                'code' => $a->code,
                'name' => $a->name,
                'type' => $a->type,
                'is_parent' => $a->is_parent,
                'display' => $a->code . ' - ' . $a->name,
            ]);

        return Inertia::render('Accounting/Settings/Index', [
            'settings' => $settings,
            'accounts' => $accounts,
        ]);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'settings' => 'required|array',
            'settings.*' => 'nullable|string',
        ]);

        foreach ($validated['settings'] as $key => $value) {
            $def = collect($this->settingDefinitions)->firstWhere('key', $key);
            if ($def) {
                AccountingSetting::set($key, $value, $def['label'], $def['group']);
            }
        }

        return redirect()->back()->with('success', 'تم حفظ إعدادات الربط المحاسبي بنجاح');
    }
}
