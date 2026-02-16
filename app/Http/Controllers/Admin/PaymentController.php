<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Contract;
use App\Models\ContractPayment;
use App\Models\Customer;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use App\Services\AccountingService;

class PaymentController extends Controller
{
    /**
     * Display a listing of payments with contract details.
     */
    public function index()
    {
        $contracts = Contract::with(['customer', 'user', 'contractPayments'])
            ->get()
            ->map(function ($contract) {
                // حساب المبلغ المدفوع والمتبقي
                $paidAmount = $contract->contractPayments()->sum('amount') ?? 0;
                $remainingAmount = max(0, $contract->amount - $paidAmount);
                
                // تحديد حالة الدفع
                $paymentStatus = 'غير مدفوع';
                $paymentPercentage = 0;
                if ($contract->amount > 0) {
                    $paymentPercentage = round(($paidAmount / $contract->amount) * 100, 2);
                    if ($remainingAmount == 0) {
                        $paymentStatus = 'مدفوع بالكامل';
                    } elseif ($remainingAmount < $contract->amount) {
                        $paymentStatus = 'مدفوع جزئياً';
                    }
                }

                // حساب عدد الدفعات
                $paymentsCount = $contract->contractPayments()->count();

                // آخر دفعة
                $lastPayment = $contract->contractPayments()->latest('payment_date')->first();
                $lastPaymentDate = $lastPayment ? $lastPayment->payment_date->format('Y-m-d') : null;

                return [
                    'id' => $contract->id,
                    'contractNumber' => $contract->contract_number,
                    'title' => $contract->title,
                    'customerName' => $contract->customer->name ?? 'غير معروف',
                    'customerId' => $contract->customer_id,
                    'customerPhone' => $contract->customer->phone ?? null,
                    'amount' => (float) $contract->amount,
                    'paidAmount' => (float) $paidAmount,
                    'remainingAmount' => (float) $remainingAmount,
                    'paymentStatus' => $paymentStatus,
                    'paymentPercentage' => $paymentPercentage,
                    'paymentsCount' => $paymentsCount,
                    'lastPaymentDate' => $lastPaymentDate,
                    'status' => $this->getStatusLabel($contract->status),
                    'startDate' => $contract->start_date?->format('Y-m-d'),
                    'endDate' => $contract->end_date?->format('Y-m-d'),
                    'paymentType' => $contract->payment_type,
                    'installmentCount' => $contract->installment_count,
                ];
            });

        // إحصائيات المدفوعات
        $totalContracts = Contract::count();
        $totalAmount = Contract::sum('amount') ?? 0;
        $totalPaid = Contract::with('contractPayments')->get()->sum(function ($contract) {
            return $contract->contractPayments()->sum('amount') ?? 0;
        });
        $totalRemaining = $totalAmount - $totalPaid;
        
        $fullyPaidContracts = $contracts->where('paymentStatus', 'مدفوع بالكامل')->count();
        $partiallyPaidContracts = $contracts->where('paymentStatus', 'مدفوع جزئياً')->count();
        $unpaidContracts = $contracts->where('paymentStatus', 'غير مدفوع')->count();

        $stats = [
            'totalContracts' => $totalContracts,
            'totalAmount' => (float) $totalAmount,
            'totalPaid' => (float) $totalPaid,
            'totalRemaining' => (float) $totalRemaining,
            'fullyPaidContracts' => $fullyPaidContracts,
            'partiallyPaidContracts' => $partiallyPaidContracts,
            'unpaidContracts' => $unpaidContracts,
        ];

        // جلب جميع المدفوعات الفردية
        $allPayments = ContractPayment::with(['contract.customer'])
            ->orderBy('payment_date', 'desc')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($payment) {
                return [
                    'id' => $payment->id,
                    'contractId' => $payment->contract_id,
                    'contractNumber' => $payment->contract->contract_number ?? 'غير معروف',
                    'contractTitle' => $payment->contract->title ?? 'غير معروف',
                    'customerName' => $payment->contract->customer->name ?? 'غير معروف',
                    'paymentMethod' => $this->getPaymentMethodLabel($payment->payment_method),
                    'paymentDate' => $payment->payment_date->format('Y-m-d'),
                    'amount' => (float) $payment->amount,
                    'checkNumber' => $payment->check_number,
                    'bankName' => $payment->bank_name,
                    'createdAt' => $payment->created_at->format('Y-m-d H:i:s'),
                ];
            });

        return Inertia::render('Payments/Index', [
            'contracts' => $contracts,
            'payments' => $allPayments,
            'stats' => $stats,
        ]);
    }

    /**
     * Show the form for creating a new payment.
     */
    public function create(Request $request)
    {
        $contractId = $request->query('contract_id');
        $contract = null;
        
        if ($contractId) {
            $contract = Contract::with(['customer', 'contractPayments'])->find($contractId);
            if ($contract) {
                $paidAmount = $contract->contractPayments()->sum('amount') ?? 0;
                $remainingAmount = max(0, $contract->amount - $paidAmount);
                
                $contract = [
                    'id' => $contract->id,
                    'contractNumber' => $contract->contract_number,
                    'title' => $contract->title,
                    'customerName' => $contract->customer->name ?? 'غير معروف',
                    'amount' => (float) $contract->amount,
                    'paidAmount' => (float) $paidAmount,
                    'remainingAmount' => (float) $remainingAmount,
                ];
            }
        }

        // جلب جميع العقود للاختيار
        $allContracts = Contract::with('customer')
            ->get()
            ->map(function ($contract) {
                $paidAmount = $contract->contractPayments()->sum('amount') ?? 0;
                $remainingAmount = max(0, $contract->amount - $paidAmount);
                
                return [
                    'id' => $contract->id,
                    'contractNumber' => $contract->contract_number,
                    'title' => $contract->title,
                    'customerName' => $contract->customer->name ?? 'غير معروف',
                    'amount' => (float) $contract->amount,
                    'paidAmount' => (float) $paidAmount,
                    'remainingAmount' => (float) $remainingAmount,
                ];
            })
            ->filter(function ($contract) {
                return $contract['remainingAmount'] > 0; // فقط العقود التي لديها مبلغ متبقي
            })
            ->values();

        return Inertia::render('Payments/Create', [
            'contract' => $contract,
            'contracts' => $allContracts,
        ]);
    }

    /**
     * Store a newly created payment.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'contract_id' => 'required|exists:contracts,id',
            'payment_method' => 'required|in:cash,check,credit_card,bank_transfer',
            'payment_date' => 'required|date',
            'amount' => 'required|numeric|min:0.01',
            'check_number' => 'nullable|string|max:255',
            'bank_name' => 'nullable|string|max:255',
            'check_date' => 'nullable|date',
            'check_image' => 'nullable|image|max:10240', // 10MB
            'notes' => 'nullable|string|max:1000',
        ]);

        // التحقق من أن المبلغ لا يتجاوز المتبقي
        $contract = Contract::findOrFail($validated['contract_id']);
        $paidAmount = $contract->contractPayments()->sum('amount') ?? 0;
        $remainingAmount = max(0, $contract->amount - $paidAmount);

        if ($validated['amount'] > $remainingAmount) {
            return redirect()->back()->withErrors([
                'amount' => 'المبلغ المدخل يتجاوز المبلغ المتبقي (' . number_format($remainingAmount, 2) . ' ر.ع)'
            ]);
        }

        // رفع صورة الشيك إن وجدت
        $checkImagePath = null;
        if ($request->hasFile('check_image') && $request->file('check_image')->isValid()) {
            $checkImagePath = $request->file('check_image')->store('contracts/checks', 'public');
        }

        // إنشاء الدفعة
        $payment = ContractPayment::create([
            'contract_id' => $validated['contract_id'],
            'payment_method' => $validated['payment_method'],
            'payment_date' => $validated['payment_date'],
            'amount' => $validated['amount'],
            'check_number' => $validated['check_number'] ?? null,
            'bank_name' => $validated['bank_name'] ?? null,
            'check_date' => $validated['check_date'] ?? null,
            'check_image_path' => $checkImagePath,
            'notes' => $validated['notes'] ?? null,
        ]);

        // إنشاء قيد محاسبي تلقائي
        $payment->load('contract.customer');
        (new AccountingService())->onContractPaymentCreated($payment);

        return redirect()->route('payments.index')->with('success', 'تم تسديد الدفعة بنجاح');
    }

    /**
     * Display the specified payment.
     */
    public function show(string $id)
    {
        $payment = ContractPayment::with(['contract.customer', 'contract.user'])->findOrFail($id);
        
        $contract = $payment->contract;
        $paidAmount = $contract->contractPayments()->sum('amount') ?? 0;
        $remainingAmount = max(0, $contract->amount - $paidAmount);
        
        return Inertia::render('Payments/Show', [
            'payment' => [
                'id' => $payment->id,
                'contractId' => $payment->contract_id,
                'contractNumber' => $contract->contract_number,
                'contractTitle' => $contract->title,
                'customerName' => $contract->customer->name ?? 'غير معروف',
                'customerPhone' => $contract->customer->phone ?? null,
                'customerAddress' => $contract->customer->address ?? null,
                'paymentMethod' => $this->getPaymentMethodLabel($payment->payment_method),
                'paymentMethodValue' => $payment->payment_method,
                'paymentDate' => $payment->payment_date->format('Y-m-d'),
                'paymentDateAr' => $payment->payment_date->format('Y-m-d'),
                'amount' => (float) $payment->amount,
                'checkNumber' => $payment->check_number,
                'bankName' => $payment->bank_name,
                'checkDate' => $payment->check_date ? $payment->check_date->format('Y-m-d') : null,
                'checkImagePath' => $payment->check_image_path ? \Illuminate\Support\Facades\Storage::url($payment->check_image_path) : null,
                'notes' => $payment->notes,
                'createdAt' => $payment->created_at->format('Y-m-d H:i:s'),
                'createdAtAr' => $payment->created_at->format('Y-m-d H:i:s'),
            ],
            'contract' => [
                'id' => $contract->id,
                'contractNumber' => $contract->contract_number,
                'title' => $contract->title,
                'amount' => (float) $contract->amount,
                'paidAmount' => (float) $paidAmount,
                'remainingAmount' => (float) $remainingAmount,
                'startDate' => $contract->start_date->format('Y-m-d'),
                'endDate' => $contract->end_date->format('Y-m-d'),
            ],
            'journalEntries' => AccountingService::getRelatedEntries('contract_payment', $payment->id)
                ->map(function ($entry) {
                    return [
                        'id' => $entry->id,
                        'entryNumber' => $entry->entry_number,
                        'date' => $entry->date->format('Y-m-d'),
                        'description' => $entry->description,
                        'status' => $entry->status,
                        'totalDebit' => (float) $entry->total_debit,
                        'totalCredit' => (float) $entry->total_credit,
                        'items' => $entry->items->map(function ($item) {
                            return [
                                'accountName' => $item->account->name ?? '',
                                'accountCode' => $item->account->code ?? '',
                                'debit' => (float) $item->debit,
                                'credit' => (float) $item->credit,
                            ];
                        }),
                    ];
                })->values()->toArray(),
        ]);
    }

    /**
     * Display late payments (contracts with overdue payments).
     */
    public function latePayments()
    {
        $contracts = Contract::with(['customer', 'contractPayments'])
            ->where('status', 'ACTIVE')
            ->get()
            ->map(function ($contract) {
                $paidAmount = $contract->contractPayments()->sum('amount') ?? 0;
                $remainingAmount = max(0, $contract->amount - $paidAmount);
                
                // حساب المبلغ المتأخر بناءً على نوع الدفع
                $isOverdue = false;
                $overdueAmount = 0;
                $overdueDays = 0;
                
                if ($contract->payment_type === 'MONTHLY' && $contract->installment_count) {
                    // حساب المبلغ المتوقع لكل دفعة شهرية
                    $expectedPaymentPerMonth = $contract->amount / $contract->installment_count;
                    $monthsElapsed = $contract->start_date->diffInMonths(now());
                    $expectedPaid = $monthsElapsed * $expectedPaymentPerMonth;
                    
                    if ($paidAmount < $expectedPaid) {
                        $isOverdue = true;
                        $overdueAmount = $expectedPaid - $paidAmount;
                        // حساب الأيام المتأخرة (افتراضياً 30 يوم لكل شهر)
                        $overdueDays = max(0, ($monthsElapsed * 30) - ($contract->start_date->diffInDays(now())));
                    }
                } elseif ($contract->payment_type === 'INSTALLMENT' && $contract->installment_count) {
                    // حساب المبلغ المتوقع لكل دفعة
                    $expectedPaymentPerInstallment = $contract->amount / $contract->installment_count;
                    $expectedInstallments = floor($paidAmount / $expectedPaymentPerInstallment);
                    $expectedPaid = $expectedInstallments * $expectedPaymentPerInstallment;
                    
                    if ($paidAmount < $expectedPaid) {
                        $isOverdue = true;
                        $overdueAmount = $expectedPaid - $paidAmount;
                    }
                }

                return [
                    'id' => $contract->id,
                    'contractNumber' => $contract->contract_number,
                    'title' => $contract->title,
                    'customerName' => $contract->customer->name ?? 'غير معروف',
                    'customerPhone' => $contract->customer->phone ?? null,
                    'amount' => (float) $contract->amount,
                    'paidAmount' => (float) $paidAmount,
                    'remainingAmount' => (float) $remainingAmount,
                    'isOverdue' => $isOverdue,
                    'overdueAmount' => (float) $overdueAmount,
                    'overdueDays' => $overdueDays,
                    'startDate' => $contract->start_date?->format('Y-m-d'),
                    'endDate' => $contract->end_date?->format('Y-m-d'),
                    'paymentType' => $contract->payment_type,
                    'installmentCount' => $contract->installment_count,
                ];
            })
            ->filter(function ($contract) {
                return $contract['isOverdue'] === true;
            })
            ->values();

        $stats = [
            'totalOverdueContracts' => $contracts->count(),
            'totalOverdueAmount' => $contracts->sum('overdueAmount'),
        ];

        return Inertia::render('Payments/LatePayments', [
            'contracts' => $contracts,
            'stats' => $stats,
        ]);
    }

    /**
     * Display payment reports.
     */
    public function reports(Request $request)
    {
        $startDate = $request->query('start_date');
        $endDate = $request->query('end_date');
        $contractId = $request->query('contract_id');

        $query = ContractPayment::with(['contract.customer']);

        if ($startDate) {
            $query->where('payment_date', '>=', $startDate);
        }
        if ($endDate) {
            $query->where('payment_date', '<=', $endDate);
        }
        if ($contractId) {
            $query->where('contract_id', $contractId);
        }

        $payments = $query->orderBy('payment_date', 'desc')->get()->map(function ($payment) {
            return [
                'id' => $payment->id,
                'contractNumber' => $payment->contract->contract_number ?? 'غير معروف',
                'contractTitle' => $payment->contract->title ?? 'غير معروف',
                'customerName' => $payment->contract->customer->name ?? 'غير معروف',
                'paymentMethod' => $this->getPaymentMethodLabel($payment->payment_method),
                'paymentDate' => $payment->payment_date->format('Y-m-d'),
                'amount' => (float) $payment->amount,
                'checkNumber' => $payment->check_number,
                'bankName' => $payment->bank_name,
                'notes' => $payment->notes,
            ];
        });

        // إحصائيات التقارير
        $totalPayments = $payments->sum('amount');
        $paymentsByMethod = $payments->groupBy('paymentMethod')->map(function ($group) {
            return [
                'count' => $group->count(),
                'total' => $group->sum('amount'),
            ];
        });

        // جلب جميع العقود للفلترة
        $contracts = Contract::with('customer')->get()->map(function ($contract) {
            return [
                'id' => $contract->id,
                'contractNumber' => $contract->contract_number,
                'title' => $contract->title,
                'customerName' => $contract->customer->name ?? 'غير معروف',
            ];
        });

        return Inertia::render('Payments/Reports', [
            'payments' => $payments,
            'stats' => [
                'totalPayments' => (float) $totalPayments,
                'paymentsCount' => $payments->count(),
                'paymentsByMethod' => $paymentsByMethod,
            ],
            'contracts' => $contracts,
            'filters' => [
                'start_date' => $startDate,
                'end_date' => $endDate,
                'contract_id' => $contractId,
            ],
        ]);
    }

    /**
     * Get status label in Arabic.
     */
    private function getStatusLabel($status)
    {
        return match($status) {
            'ACTIVE' => 'نشط',
            'EXPIRED' => 'منتهي',
            'CANCELLED' => 'ملغي',
            'COMPLETED' => 'مكتمل',
            default => $status,
        };
    }

    /**
     * Get payment method label in Arabic.
     */
    private function getPaymentMethodLabel($method)
    {
        return match($method) {
            'cash' => 'نقداً',
            'check' => 'شيك',
            'credit_card' => 'بطاقة ائتمان',
            'bank_transfer' => 'تحويل بنكي',
            default => $method,
        };
    }
}
