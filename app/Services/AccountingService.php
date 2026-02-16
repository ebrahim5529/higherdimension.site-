<?php

namespace App\Services;

use App\Models\Account;
use App\Models\AccountingSetting;
use App\Models\JournalEntry;
use App\Models\JournalEntryItem;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class AccountingService
{
    /**
     * إنشاء قيد محاسبي تلقائي
     *
     * @param string $date تاريخ القيد
     * @param string $description وصف القيد
     * @param array $items بنود القيد [['account_id' => x, 'debit' => 0, 'credit' => 0, 'description' => ''], ...]
     * @param string $referenceType نوع المرجع (contract, contract_payment, salary, purchase)
     * @param int $referenceId معرف المرجع
     * @return JournalEntry|null
     */
    public function createJournalEntry(
        string $date,
        string $description,
        array $items,
        string $referenceType,
        int $referenceId
    ): ?JournalEntry {
        // التحقق من وجود بنود
        if (empty($items)) {
            Log::warning("AccountingService: No items provided for journal entry", [
                'reference_type' => $referenceType,
                'reference_id' => $referenceId,
            ]);
            return null;
        }

        // التحقق من أن جميع الحسابات موجودة
        foreach ($items as $item) {
            if (!$item['account_id'] || !Account::find($item['account_id'])) {
                Log::warning("AccountingService: Invalid account_id in journal entry items", [
                    'account_id' => $item['account_id'] ?? null,
                    'reference_type' => $referenceType,
                    'reference_id' => $referenceId,
                ]);
                return null;
            }
        }

        $totalDebit = collect($items)->sum('debit');
        $totalCredit = collect($items)->sum('credit');

        // التحقق من توازن القيد
        if (round($totalDebit, 2) !== round($totalCredit, 2)) {
            Log::warning("AccountingService: Unbalanced journal entry", [
                'total_debit' => $totalDebit,
                'total_credit' => $totalCredit,
                'reference_type' => $referenceType,
                'reference_id' => $referenceId,
            ]);
            return null;
        }

        $autoPost = AccountingSetting::get('auto_post_entries', '0') === '1';

        try {
            return DB::transaction(function () use ($date, $description, $items, $referenceType, $referenceId, $totalDebit, $totalCredit, $autoPost) {
                $entry = JournalEntry::create([
                    'entry_number' => JournalEntry::generateEntryNumber(),
                    'date' => $date,
                    'description' => $description,
                    'reference_type' => $referenceType,
                    'reference_id' => $referenceId,
                    'status' => $autoPost ? 'posted' : 'draft',
                    'total_debit' => $totalDebit,
                    'total_credit' => $totalCredit,
                    'created_by' => Auth::id(),
                ]);

                foreach ($items as $item) {
                    JournalEntryItem::create([
                        'journal_entry_id' => $entry->id,
                        'account_id' => $item['account_id'],
                        'debit' => $item['debit'] ?? 0,
                        'credit' => $item['credit'] ?? 0,
                        'description' => $item['description'] ?? $description,
                    ]);
                }

                return $entry;
            });
        } catch (\Exception $e) {
            Log::error("AccountingService: Failed to create journal entry", [
                'error' => $e->getMessage(),
                'reference_type' => $referenceType,
                'reference_id' => $referenceId,
            ]);
            return null;
        }
    }

    /**
     * عند تسجيل دفعة على عقد
     * مدين: النقدية/البنك | دائن: العملاء (المدينون)
     */
    public function onContractPaymentCreated($contractPayment): ?JournalEntry
    {
        $customersAccountId = AccountingSetting::getAccountId('customers_receivable_account_id');

        // تحديد حساب الدفع حسب طريقة الدفع
        $paymentAccountId = $this->getPaymentAccountId($contractPayment->payment_method);

        if (!$customersAccountId || !$paymentAccountId) {
            Log::info("AccountingService: Skipping contract payment - settings not configured", [
                'payment_id' => $contractPayment->id,
            ]);
            return null;
        }

        $contract = $contractPayment->contract;
        $customerName = $contract->customer->name ?? 'عميل';
        $contractNumber = $contract->contract_number ?? $contract->id;

        return $this->createJournalEntry(
            date: $contractPayment->payment_date->format('Y-m-d'),
            description: "تحصيل دفعة من العميل {$customerName} - عقد رقم {$contractNumber}",
            items: [
                [
                    'account_id' => $paymentAccountId,
                    'debit' => (float) $contractPayment->amount,
                    'credit' => 0,
                    'description' => "تحصيل دفعة - {$this->getPaymentMethodLabel($contractPayment->payment_method)}",
                ],
                [
                    'account_id' => $customersAccountId,
                    'debit' => 0,
                    'credit' => (float) $contractPayment->amount,
                    'description' => "تسوية ذمة العميل {$customerName}",
                ],
            ],
            referenceType: 'contract_payment',
            referenceId: $contractPayment->id
        );
    }

    /**
     * عند إنشاء عقد جديد
     * مدين: العملاء (المدينون) | دائن: إيرادات العقود
     */
    public function onContractCreated($contract): ?JournalEntry
    {
        $customersAccountId = AccountingSetting::getAccountId('customers_receivable_account_id');
        $revenueAccountId = AccountingSetting::getAccountId('contract_revenue_account_id');

        if (!$customersAccountId || !$revenueAccountId) {
            Log::info("AccountingService: Skipping contract creation - settings not configured", [
                'contract_id' => $contract->id,
            ]);
            return null;
        }

        $customerName = $contract->customer->name ?? 'عميل';

        return $this->createJournalEntry(
            date: $contract->start_date ? $contract->start_date->format('Y-m-d') : now()->format('Y-m-d'),
            description: "إثبات إيراد عقد رقم {$contract->contract_number} - العميل {$customerName}",
            items: [
                [
                    'account_id' => $customersAccountId,
                    'debit' => (float) $contract->amount,
                    'credit' => 0,
                    'description' => "ذمة العميل {$customerName} - عقد {$contract->contract_number}",
                ],
                [
                    'account_id' => $revenueAccountId,
                    'debit' => 0,
                    'credit' => (float) $contract->amount,
                    'description' => "إيراد عقد {$contract->contract_number}",
                ],
            ],
            referenceType: 'contract',
            referenceId: $contract->id
        );
    }

    /**
     * عند دفع راتب
     * مدين: الرواتب والأجور (مصروف) | دائن: النقدية/البنك
     */
    public function onSalaryPaid($salary): ?JournalEntry
    {
        $salaryExpenseAccountId = AccountingSetting::getAccountId('salary_expense_account_id');
        $paymentAccountId = $this->getPaymentAccountId($salary->payment_method ?? 'cash');

        if (!$salaryExpenseAccountId || !$paymentAccountId) {
            Log::info("AccountingService: Skipping salary payment - settings not configured", [
                'salary_id' => $salary->id,
            ]);
            return null;
        }

        $employeeName = $salary->employee->name ?? 'موظف';

        return $this->createJournalEntry(
            date: $salary->payment_date ? $salary->payment_date->format('Y-m-d') : now()->format('Y-m-d'),
            description: "صرف راتب الموظف {$employeeName} - {$salary->payment_date?->format('Y-m')}",
            items: [
                [
                    'account_id' => $salaryExpenseAccountId,
                    'debit' => (float) $salary->total_salary,
                    'credit' => 0,
                    'description' => "راتب {$employeeName}",
                ],
                [
                    'account_id' => $paymentAccountId,
                    'debit' => 0,
                    'credit' => (float) $salary->total_salary,
                    'description' => "صرف راتب {$employeeName}",
                ],
            ],
            referenceType: 'salary',
            referenceId: $salary->id
        );
    }

    /**
     * عند تسجيل مشتريات من مورد
     * مدين: مصروفات المشتريات | دائن: الموردون (الدائنون) أو النقدية
     */
    public function onPurchaseCreated($purchase, string $paymentMethod = 'cash'): ?JournalEntry
    {
        $purchaseExpenseAccountId = AccountingSetting::getAccountId('purchase_expense_account_id');
        $suppliersAccountId = AccountingSetting::getAccountId('suppliers_payable_account_id');

        if (!$purchaseExpenseAccountId || !$suppliersAccountId) {
            Log::info("AccountingService: Skipping purchase - settings not configured", [
                'purchase_id' => $purchase->id,
            ]);
            return null;
        }

        $supplierName = $purchase->supplier->name ?? 'مورد';

        // إذا كانت المشتريات نقدية، نستخدم حساب النقدية بدلاً من الموردين
        $creditAccountId = $suppliersAccountId;
        $creditDescription = "مستحقات المورد {$supplierName}";

        if ($paymentMethod === 'cash' || $paymentMethod === 'bank_transfer') {
            $cashAccountId = $this->getPaymentAccountId($paymentMethod);
            if ($cashAccountId) {
                $creditAccountId = $cashAccountId;
                $creditDescription = "دفع نقدي للمورد {$supplierName}";
            }
        }

        return $this->createJournalEntry(
            date: $purchase->purchase_date ? $purchase->purchase_date->format('Y-m-d') : now()->format('Y-m-d'),
            description: "مشتريات من المورد {$supplierName} - فاتورة {$purchase->purchase_number}",
            items: [
                [
                    'account_id' => $purchaseExpenseAccountId,
                    'debit' => (float) $purchase->amount,
                    'credit' => 0,
                    'description' => "مشتريات - {$purchase->title}",
                ],
                [
                    'account_id' => $creditAccountId,
                    'debit' => 0,
                    'credit' => (float) $purchase->amount,
                    'description' => $creditDescription,
                ],
            ],
            referenceType: 'purchase',
            referenceId: $purchase->id
        );
    }

    /**
     * حذف القيد المرتبط بمرجع معين
     */
    public function deleteRelatedEntry(string $referenceType, int $referenceId): bool
    {
        $entry = JournalEntry::where('reference_type', $referenceType)
            ->where('reference_id', $referenceId)
            ->where('status', 'draft')
            ->first();

        if ($entry) {
            $entry->items()->delete();
            $entry->delete();
            return true;
        }

        return false;
    }

    /**
     * جلب القيود المرتبطة بمرجع
     */
    public static function getRelatedEntries(string $referenceType, int $referenceId)
    {
        return JournalEntry::with('items.account')
            ->where('reference_type', $referenceType)
            ->where('reference_id', $referenceId)
            ->get();
    }

    /**
     * تحديد حساب الدفع حسب طريقة الدفع
     */
    private function getPaymentAccountId(?string $paymentMethod): ?int
    {
        return match ($paymentMethod) {
            'cash' => AccountingSetting::getAccountId('cash_account_id'),
            'bank_transfer', 'check', 'credit_card' => AccountingSetting::getAccountId('bank_account_id'),
            default => AccountingSetting::getAccountId('cash_account_id'),
        };
    }

    /**
     * تسمية طريقة الدفع
     */
    private function getPaymentMethodLabel(?string $method): string
    {
        return match ($method) {
            'cash' => 'نقداً',
            'check' => 'شيك',
            'credit_card' => 'بطاقة ائتمان',
            'bank_transfer' => 'تحويل بنكي',
            default => $method ?? 'نقداً',
        };
    }
}
