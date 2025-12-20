<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CompanySignature;
use App\Models\Contract;
use App\Models\Customer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ContractController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $contracts = Contract::with(['customer', 'user'])
            ->get()
            ->map(function ($contract) {
                // حساب المبلغ المدفوع والمتبقي
                $paidAmount = $contract->payments()->sum('amount') ?? 0;
                $remainingAmount = max(0, $contract->amount - $paidAmount);

                // تحديد حالة الدفع
                $paymentStatus = 'غير مدفوعة';
                if ($remainingAmount == 0 && $contract->amount > 0) {
                    $paymentStatus = 'مدفوعة';
                } elseif ($remainingAmount > 0 && $remainingAmount < $contract->amount) {
                    $paymentStatus = 'مدفوعة جزئياً';
                }

                // تحديد نوع العقد من payment_type
                $contractType = 'تأجير';
                if ($contract->payment_type === 'CASH') {
                    $contractType = 'بيع';
                }

                return [
                    'id' => $contract->id,
                    'contractNumber' => $contract->contract_number,
                    'title' => $contract->title,
                    'description' => $contract->description,
                    'customerName' => $contract->customer->name ?? 'غير معروف',
                    'customerId' => $contract->customer_id,
                    'type' => $contractType,
                    'amount' => $contract->amount,
                    'totalAfterDiscount' => $contract->amount,
                    'totalPayments' => $paidAmount,
                    'remainingAmount' => $remainingAmount,
                    'status' => $this->getStatusLabel($contract->status),
                    'paymentStatus' => $paymentStatus,
                    'startDate' => $contract->start_date?->format('Y-m-d'),
                    'endDate' => $contract->end_date?->format('Y-m-d'),
                    'createdDate' => $contract->created_at?->format('Y-m-d'),
                    'paymentType' => $contract->payment_type,
                    'installmentCount' => $contract->installment_count,
                    'deliveryAddress' => $contract->customer->address ?? '',
                    'locationMapLink' => null,
                ];
            });

        // إحصائيات العقود
        $totalContracts = Contract::count();
        $activeContracts = Contract::where('status', 'ACTIVE')->count();
        $expiredContracts = Contract::where('status', 'EXPIRED')->count();
        $cancelledContracts = Contract::where('status', 'CANCELLED')->count();
        $totalValue = Contract::sum('amount') ?? 0;

        // حساب العقود المدفوعة وغير المدفوعة
        $paidContracts = 0;
        $pendingContracts = 0;
        $partialPaymentContracts = 0;

        foreach ($contracts as $contract) {
            if ($contract['remainingAmount'] == 0 && $contract['amount'] > 0) {
                $paidContracts++;
            } elseif ($contract['remainingAmount'] == $contract['amount'] && $contract['amount'] > 0) {
                $pendingContracts++;
            } elseif ($contract['remainingAmount'] > 0 && $contract['remainingAmount'] < $contract['amount']) {
                $partialPaymentContracts++;
            }
        }

        $stats = [
            'totalContracts' => $totalContracts,
            'activeContracts' => $activeContracts,
            'expiredContracts' => $expiredContracts,
            'cancelledContracts' => $cancelledContracts,
            'totalValue' => $totalValue,
            'paidContracts' => $paidContracts,
            'pendingContracts' => $pendingContracts,
            'partialPaymentContracts' => $partialPaymentContracts,
        ];

        return Inertia::render('Contracts/Index', [
            'contracts' => $contracts,
            'stats' => $stats,
        ]);
    }

    /**
     * Display active contracts.
     */
    public function active()
    {
        $contracts = Contract::with(['customer', 'user', 'contractPayments'])
            ->where('status', 'ACTIVE')
            ->get()
            ->map(function ($contract) {
                $paidAmount = $contract->contractPayments()->sum('amount') ?? 0;
                $remainingAmount = max(0, $contract->amount - $paidAmount);

                $contractType = $contract->payment_type === 'rental' ? 'تأجير' : ($contract->payment_type === 'sale' ? 'شراء' : 'تأجير');

                return [
                    'id' => $contract->id,
                    'contractNumber' => $contract->contract_number,
                    'title' => $contract->title,
                    'customerName' => $contract->customer->name ?? 'غير معروف',
                    'customerId' => $contract->customer_id,
                    'type' => $contractType,
                    'amount' => (float) $contract->amount,
                    'totalPayments' => (float) $paidAmount,
                    'remainingAmount' => (float) $remainingAmount,
                    'status' => $this->getStatusLabel($contract->status),
                    'startDate' => $contract->start_date?->format('Y-m-d'),
                    'endDate' => $contract->end_date?->format('Y-m-d'),
                    'createdDate' => $contract->created_at?->format('Y-m-d'),
                ];
            });

        $stats = [
            'total' => $contracts->count(),
            'totalValue' => $contracts->sum('amount'),
            'totalPaid' => $contracts->sum('totalPayments'),
            'totalRemaining' => $contracts->sum('remainingAmount'),
        ];

        return Inertia::render('Contracts/Active', [
            'contracts' => $contracts,
            'stats' => $stats,
        ]);
    }

    /**
     * Display expired contracts.
     */
    public function expired()
    {
        $contracts = Contract::with(['customer', 'user', 'contractPayments'])
            ->where('status', 'EXPIRED')
            ->get()
            ->map(function ($contract) {
                $paidAmount = $contract->contractPayments()->sum('amount') ?? 0;
                $remainingAmount = max(0, $contract->amount - $paidAmount);

                $contractType = $contract->payment_type === 'rental' ? 'تأجير' : ($contract->payment_type === 'sale' ? 'شراء' : 'تأجير');

                return [
                    'id' => $contract->id,
                    'contractNumber' => $contract->contract_number,
                    'title' => $contract->title,
                    'customerName' => $contract->customer->name ?? 'غير معروف',
                    'customerId' => $contract->customer_id,
                    'type' => $contractType,
                    'amount' => (float) $contract->amount,
                    'totalPayments' => (float) $paidAmount,
                    'remainingAmount' => (float) $remainingAmount,
                    'status' => $this->getStatusLabel($contract->status),
                    'startDate' => $contract->start_date?->format('Y-m-d'),
                    'endDate' => $contract->end_date?->format('Y-m-d'),
                    'createdDate' => $contract->created_at?->format('Y-m-d'),
                ];
            });

        $stats = [
            'total' => $contracts->count(),
            'totalValue' => $contracts->sum('amount'),
            'totalPaid' => $contracts->sum('totalPayments'),
            'totalRemaining' => $contracts->sum('remainingAmount'),
        ];

        return Inertia::render('Contracts/Expired', [
            'contracts' => $contracts,
            'stats' => $stats,
        ]);
    }

    /**
     * Display cancelled contracts.
     */
    public function cancelled()
    {
        $contracts = Contract::with(['customer', 'user', 'contractPayments'])
            ->where('status', 'CANCELLED')
            ->get()
            ->map(function ($contract) {
                $paidAmount = $contract->contractPayments()->sum('amount') ?? 0;
                $remainingAmount = max(0, $contract->amount - $paidAmount);

                $contractType = $contract->payment_type === 'rental' ? 'تأجير' : ($contract->payment_type === 'sale' ? 'شراء' : 'تأجير');

                return [
                    'id' => $contract->id,
                    'contractNumber' => $contract->contract_number,
                    'title' => $contract->title,
                    'customerName' => $contract->customer->name ?? 'غير معروف',
                    'customerId' => $contract->customer_id,
                    'type' => $contractType,
                    'amount' => (float) $contract->amount,
                    'totalPayments' => (float) $paidAmount,
                    'remainingAmount' => (float) $remainingAmount,
                    'status' => $this->getStatusLabel($contract->status),
                    'startDate' => $contract->start_date?->format('Y-m-d'),
                    'endDate' => $contract->end_date?->format('Y-m-d'),
                    'createdDate' => $contract->created_at?->format('Y-m-d'),
                ];
            });

        $stats = [
            'total' => $contracts->count(),
            'totalValue' => $contracts->sum('amount'),
            'totalPaid' => $contracts->sum('totalPayments'),
            'totalRemaining' => $contracts->sum('remainingAmount'),
        ];

        return Inertia::render('Contracts/Cancelled', [
            'contracts' => $contracts,
            'stats' => $stats,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $customers = Customer::select('id', 'name', 'customer_number', 'phone')->get();

        return Inertia::render('Contracts/Create', [
            'customers' => $customers,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'contract_number' => 'required|string|unique:contracts,contract_number',
            'contract_date' => 'required|date',
            'customer_id' => 'required|exists:customers,id',
            'delivery_address' => 'required|string',
            'location_map_link' => 'nullable|url',
            'transport_and_installation_cost' => 'nullable|numeric|min:0',
            'total_discount' => 'nullable|numeric|min:0',
            'contract_notes' => 'nullable|string',
            'rental_details' => 'required|array|min:1',
            'rental_details.*.scaffold_id' => 'nullable|exists:scaffolds,id',
            'rental_details.*.item_code' => 'required|string',
            'rental_details.*.item_description' => 'required|string',
            'rental_details.*.start_date' => 'required|date',
            'rental_details.*.end_date' => 'required|date',
            'rental_details.*.duration' => 'required|integer|min:1',
            'rental_details.*.duration_type' => 'required|in:daily,monthly',
            'rental_details.*.quantity' => 'required|integer|min:1',
            'rental_details.*.daily_rate' => 'required|numeric|min:0',
            'rental_details.*.monthly_rate' => 'required|numeric|min:0',
            'rental_details.*.total' => 'required|numeric|min:0',
            'payments' => 'nullable|array',
            'payments.*.payment_method' => 'required|in:cash,check,credit_card,bank_transfer',
            'payments.*.payment_date' => 'required|date',
            'payments.*.amount' => 'required|numeric|min:0',
        ]);

        // حساب التواريخ من rental_details
        $startDate = collect($validated['rental_details'])->min('start_date');
        $endDate = collect($validated['rental_details'])->max('end_date');

        // حساب المبلغ الإجمالي
        $rentalTotal = collect($validated['rental_details'])->sum('total');
        $totalAmount = $rentalTotal + ($validated['transport_and_installation_cost'] ?? 0) - ($validated['total_discount'] ?? 0);

        // إنشاء العقد
        $contract = Contract::create([
            'contract_number' => $validated['contract_number'],
            'title' => 'عقد تأجير - '.$validated['contract_number'],
            'description' => $validated['contract_notes'] ?? '',
            'amount' => $totalAmount,
            'start_date' => $startDate,
            'end_date' => $endDate,
            'status' => 'ACTIVE',
            'payment_type' => 'INSTALLMENT',
            'delivery_address' => $validated['delivery_address'],
            'location_map_link' => $validated['location_map_link'] ?? null,
            'transport_and_installation_cost' => $validated['transport_and_installation_cost'] ?? 0,
            'total_discount' => $validated['total_discount'] ?? 0,
            'contract_notes' => $validated['contract_notes'] ?? null,
            'customer_id' => $validated['customer_id'],
            'user_id' => Auth::id(),
        ]);

        // إضافة المعدات
        foreach ($validated['rental_details'] as $rentalDetail) {
            \App\Models\ContractEquipment::create([
                'contract_id' => $contract->id,
                'scaffold_id' => $rentalDetail['scaffold_id'] ?? null,
                'item_code' => $rentalDetail['item_code'],
                'item_description' => $rentalDetail['item_description'],
                'start_date' => $rentalDetail['start_date'],
                'end_date' => $rentalDetail['end_date'],
                'duration' => $rentalDetail['duration'],
                'duration_type' => $rentalDetail['duration_type'],
                'quantity' => $rentalDetail['quantity'],
                'daily_rate' => $rentalDetail['daily_rate'],
                'monthly_rate' => $rentalDetail['monthly_rate'],
                'total' => $rentalDetail['total'],
            ]);
        }

        // إضافة المدفوعات
        if (isset($validated['payments']) && is_array($validated['payments'])) {
            foreach ($validated['payments'] as $payment) {
                if ($payment['amount'] > 0) {
                    $checkImagePath = null;

                    // رفع صورة الشيك إذا كانت موجودة
                    if (isset($payment['check_image']) && $payment['check_image']->isValid()) {
                        $checkImagePath = $payment['check_image']->store('contracts/checks', 'public');
                    }

                    \App\Models\ContractPayment::create([
                        'contract_id' => $contract->id,
                        'payment_method' => $payment['payment_method'],
                        'payment_date' => $payment['payment_date'],
                        'amount' => $payment['amount'],
                        'check_number' => $payment['check_number'] ?? null,
                        'bank_name' => $payment['bank_name'] ?? null,
                        'check_date' => $payment['check_date'] ?? null,
                        'check_image_path' => $checkImagePath,
                    ]);
                }
            }
        }

        // إرجاع بيانات العقد في الـ response
        return redirect()->back()->with([
            'success' => 'تم إنشاء العقد بنجاح',
            'contract' => [
                'id' => $contract->id,
                'contract_number' => $contract->contract_number,
                'customer_name' => $contract->customer->name ?? 'غير معروف',
                'total_amount' => $contract->amount,
                'contract_date' => $contract->contract_date?->format('Y-m-d') ?? $contract->start_date?->format('Y-m-d'),
                'contract_type' => 'تأجير معدات بناء',
            ],
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $contract = Contract::with(['customer', 'user', 'equipment', 'contractPayments', 'attachments'])->findOrFail($id);

        $paidAmount = $contract->contractPayments()->sum('amount') ?? 0;
        $remainingAmount = max(0, $contract->amount - $paidAmount);

        $paymentStatus = 'غير مدفوع';
        $paymentPercentage = 0;
        if ($contract->amount > 0) {
            $paymentPercentage = round(($paidAmount / $contract->amount) * 100, 2);
            if ($remainingAmount == 0) {
                $paymentStatus = 'مدفوع';
            } elseif ($remainingAmount < $contract->amount) {
                $paymentStatus = 'مدفوع جزئياً';
            }
        }

        $contractType = 'تأجير';
        if ($contract->payment_type === 'CASH') {
            $contractType = 'بيع';
        }

        // حساب المدة بالأيام
        $duration = 0;
        if ($contract->start_date && $contract->end_date) {
            $duration = $contract->start_date->diffInDays($contract->end_date);
        }

        // حساب الأيام المتبقية والمنقضية
        $now = now();
        $daysRemaining = 0;
        $daysElapsed = 0;
        $progressPercentage = 0;
        $dailyValue = 0;

        if ($contract->start_date && $contract->end_date) {
            if ($now < $contract->start_date) {
                $daysRemaining = $contract->start_date->diffInDays($now);
            } elseif ($now > $contract->end_date) {
                $daysElapsed = $contract->start_date->diffInDays($contract->end_date);
                $progressPercentage = 100;
            } else {
                $daysElapsed = $contract->start_date->diffInDays($now);
                $daysRemaining = $now->diffInDays($contract->end_date);
                $progressPercentage = round(($daysElapsed / $duration) * 100, 2);
            }

            if ($duration > 0) {
                $dailyValue = round($contract->amount / $duration, 3);
            }
        }

        // حساب عدد المعدات
        $equipmentCount = $contract->equipment()->sum('quantity') ?? 0;

        // تحديد مراحل العقد
        $stages = [
            'signed' => $contract->signed_at !== null,
            'delivered' => false, // يمكن إضافة منطق للتسليم
            'inactive' => $contract->status === 'CANCELLED',
            'completed' => $contract->status === 'EXPIRED' || $contract->status === 'COMPLETED',
        ];

        return Inertia::render('Contracts/Show', [
            'contract' => [
                'id' => $contract->id,
                'contractNumber' => $contract->contract_number,
                'title' => $contract->title,
                'description' => $contract->description,
                'customerName' => $contract->customer->name ?? 'غير معروف',
                'customerNumber' => $contract->customer->customer_number ?? '',
                'customerId' => $contract->customer_id,
                'type' => $contractType,
                'amount' => $contract->amount,
                'totalPayments' => $paidAmount,
                'remainingAmount' => $remainingAmount,
                'status' => $this->getStatusLabel($contract->status),
                'paymentStatus' => $paymentStatus,
                'paymentPercentage' => $paymentPercentage,
                'startDate' => $contract->start_date?->format('Y-m-d'),
                'endDate' => $contract->end_date?->format('Y-m-d'),
                'startDateAr' => $contract->start_date ? $this->formatDateArabic($contract->start_date) : '',
                'endDateAr' => $contract->end_date ? $this->formatDateArabic($contract->end_date) : '',
                'createdDate' => $contract->created_at?->format('Y-m-d'),
                'createdDateAr' => $contract->created_at ? $this->formatDateArabic($contract->created_at) : '',
                'updatedDate' => $contract->updated_at?->format('Y-m-d'),
                'updatedDateAr' => $contract->updated_at ? $this->formatDateArabic($contract->updated_at) : '',
                'duration' => $duration,
                'deliveryAddress' => $contract->delivery_address ?? '',
                'locationMapLink' => $contract->location_map_link,
                'equipmentCount' => $equipmentCount,
                'daysRemaining' => $daysRemaining,
                'daysElapsed' => $daysElapsed,
                'progressPercentage' => $progressPercentage,
                'dailyValue' => $dailyValue,
                'stages' => $stages,
                'signedAt' => $contract->signed_at?->format('Y-m-d H:i:s'),
                'contractNotes' => $contract->contract_notes,
                'attachments' => $contract->attachments->map(function ($attachment) {
                    return [
                        'id' => $attachment->id,
                        'name' => $attachment->name,
                        'file_path' => $attachment->file_path,
                        'file_type' => $attachment->file_type,
                        'file_size' => $attachment->file_size,
                        'file_size_human' => $attachment->file_size_human,
                        'mime_type' => $attachment->mime_type,
                        'description' => $attachment->description,
                        'created_at' => $attachment->created_at?->format('Y-m-d H:i:s'),
                    ];
                })->toArray(),
                'payments' => $contract->contractPayments->map(function ($payment) {
                    return [
                        'id' => $payment->id,
                        'paymentMethod' => $this->getPaymentMethodLabel($payment->payment_method),
                        'paymentMethodValue' => $payment->payment_method,
                        'paymentDate' => $payment->payment_date->format('Y-m-d'),
                        'amount' => (float) $payment->amount,
                        'checkNumber' => $payment->check_number,
                        'bankName' => $payment->bank_name,
                        'checkDate' => $payment->check_date ? $payment->check_date->format('Y-m-d') : null,
                        'checkImagePath' => $payment->check_image_path ? Storage::url($payment->check_image_path) : null,
                        'notes' => $payment->notes,
                        'createdAt' => $payment->created_at->format('Y-m-d H:i:s'),
                    ];
                })->toArray(),
            ],
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $contract = Contract::with(['customer', 'equipment.scaffold', 'contractPayments'])->findOrFail($id);
        $customers = Customer::select('id', 'name', 'customer_number', 'phone')->get();

        // تحويل المعدات إلى الصيغة المطلوبة
        $equipment = $contract->equipment->map(function ($item) {
            return [
                'id' => $item->id,
                'scaffold_id' => $item->scaffold_id,
                'scaffold' => $item->scaffold ? [
                    'id' => $item->scaffold->id,
                    'scaffold_number' => $item->scaffold->scaffold_number,
                    'description_ar' => $item->scaffold->description_ar,
                    'description_en' => $item->scaffold->description_en,
                    'daily_rental_price' => $item->scaffold->daily_rental_price,
                    'monthly_rental_price' => $item->scaffold->monthly_rental_price,
                    'available_quantity' => $item->scaffold->available_quantity,
                ] : null,
                'item_code' => $item->item_code,
                'item_description' => $item->item_description,
                'start_date' => $item->start_date?->format('Y-m-d'),
                'end_date' => $item->end_date?->format('Y-m-d'),
                'duration' => $item->duration,
                'duration_type' => $item->duration_type,
                'quantity' => $item->quantity,
                'daily_rate' => $item->daily_rate,
                'monthly_rate' => $item->monthly_rate,
                'total' => $item->total,
            ];
        });

        // تحويل المدفوعات إلى الصيغة المطلوبة
        $payments = $contract->contractPayments->map(function ($payment) {
            return [
                'id' => $payment->id,
                'payment_method' => $payment->payment_method,
                'payment_date' => $payment->payment_date?->format('Y-m-d'),
                'amount' => $payment->amount,
                'check_number' => $payment->check_number,
                'bank_name' => $payment->bank_name,
                'check_date' => $payment->check_date?->format('Y-m-d'),
                'check_image_path' => $payment->check_image_path ? asset('storage/'.$payment->check_image_path) : null,
            ];
        });

        return Inertia::render('Contracts/Edit', [
            'contract' => [
                'id' => $contract->id,
                'contract_number' => $contract->contract_number,
                'contract_date' => $contract->start_date?->format('Y-m-d'),
                'title' => $contract->title,
                'description' => $contract->description,
                'amount' => $contract->amount,
                'start_date' => $contract->start_date?->format('Y-m-d'),
                'end_date' => $contract->end_date?->format('Y-m-d'),
                'status' => $contract->status,
                'payment_type' => $contract->payment_type,
                'installment_count' => $contract->installment_count,
                'customer_id' => $contract->customer_id,
                'delivery_address' => $contract->delivery_address,
                'location_map_link' => $contract->location_map_link,
                'transport_and_installation_cost' => $contract->transport_and_installation_cost ?? 0,
                'total_discount' => $contract->total_discount ?? 0,
                'contract_notes' => $contract->contract_notes,
                'equipment' => $equipment,
                'payments' => $payments,
            ],
            'customers' => $customers,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $contract = Contract::findOrFail($id);

        $validated = $request->validate([
            'contract_number' => 'required|string|unique:contracts,contract_number,'.$id,
            'contract_date' => 'required|date',
            'customer_id' => 'required|exists:customers,id',
            'delivery_address' => 'required|string',
            'location_map_link' => 'nullable|url',
            'transport_and_installation_cost' => 'nullable|numeric|min:0',
            'total_discount' => 'nullable|numeric|min:0',
            'contract_notes' => 'nullable|string',
            'rental_details' => 'required|array|min:1',
            'rental_details.*.scaffold_id' => 'nullable|exists:scaffolds,id',
            'rental_details.*.item_code' => 'nullable|string',
            'rental_details.*.item_description' => 'nullable|string',
            'rental_details.*.start_date' => 'required|date',
            'rental_details.*.end_date' => 'required|date',
            'rental_details.*.duration' => 'required|integer|min:1',
            'rental_details.*.duration_type' => 'required|in:daily,monthly',
            'rental_details.*.quantity' => 'required|integer|min:1',
            'rental_details.*.daily_rate' => 'required|numeric|min:0',
            'rental_details.*.monthly_rate' => 'required|numeric|min:0',
            'rental_details.*.total' => 'required|numeric|min:0',
            'payments' => 'nullable|array',
            'payments.*.payment_method' => 'required|in:cash,check,credit_card,bank_transfer',
            'payments.*.payment_date' => 'required|date',
            'payments.*.amount' => 'required|numeric|min:0',
            'payments.*.check_number' => 'nullable|string',
            'payments.*.bank_name' => 'nullable|string',
            'payments.*.check_date' => 'nullable|date',
            'payments.*.check_image' => 'nullable|file|image|max:5120',
        ]);

        // حساب المبلغ الإجمالي
        $equipmentTotal = collect($validated['rental_details'])->sum('total');
        $transportCost = $validated['transport_and_installation_cost'] ?? 0;
        $discount = $validated['total_discount'] ?? 0;
        $totalAmount = $equipmentTotal + $transportCost - $discount;

        // تحديث بيانات العقد
        $contract->update([
            'contract_number' => $validated['contract_number'],
            'start_date' => $validated['contract_date'],
            'end_date' => collect($validated['rental_details'])->max('end_date'),
            'customer_id' => $validated['customer_id'],
            'delivery_address' => $validated['delivery_address'],
            'location_map_link' => $validated['location_map_link'] ?? null,
            'transport_and_installation_cost' => $transportCost,
            'total_discount' => $discount,
            'contract_notes' => $validated['contract_notes'] ?? null,
            'amount' => $totalAmount,
            'status' => $contract->status, // الحفاظ على الحالة الحالية
        ]);

        // حذف المعدات القديمة وإضافة الجديدة
        $contract->equipment()->delete();
        foreach ($validated['rental_details'] as $rental) {
            $contract->equipment()->create([
                'scaffold_id' => $rental['scaffold_id'] ?? null,
                'item_code' => $rental['item_code'] ?? null,
                'item_description' => $rental['item_description'] ?? null,
                'start_date' => $rental['start_date'],
                'end_date' => $rental['end_date'],
                'duration' => $rental['duration'],
                'duration_type' => $rental['duration_type'],
                'quantity' => $rental['quantity'],
                'daily_rate' => $rental['daily_rate'],
                'monthly_rate' => $rental['monthly_rate'],
                'total' => $rental['total'],
            ]);
        }

        // حذف المدفوعات القديمة وإضافة الجديدة
        $contract->contractPayments()->delete();
        if (isset($validated['payments'])) {
            foreach ($validated['payments'] as $payment) {
                $checkImagePath = null;

                // رفع صورة الشيك إذا كانت موجودة
                if (isset($payment['check_image']) && $payment['check_image']->isValid()) {
                    $checkImagePath = $payment['check_image']->store('contracts/checks', 'public');
                }

                $contract->contractPayments()->create([
                    'payment_method' => $payment['payment_method'],
                    'payment_date' => $payment['payment_date'],
                    'amount' => $payment['amount'],
                    'check_number' => $payment['check_number'] ?? null,
                    'bank_name' => $payment['bank_name'] ?? null,
                    'check_date' => $payment['check_date'] ?? null,
                    'check_image_path' => $checkImagePath,
                ]);
            }
        }

        return redirect()->route('contracts.index')
            ->with('success', 'تم تحديث العقد بنجاح');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $contract = Contract::findOrFail($id);
        $contract->delete();

        return redirect()->route('contracts.index')
            ->with('success', 'تم حذف العقد بنجاح');
    }

    /**
     * Get status label in Arabic
     */
    /**
     * Get contract data for invoice generation
     */
    public function invoice(string $id)
    {
        $contract = Contract::with(['customer', 'equipment.scaffold', 'contractPayments'])->findOrFail($id);

        $companySignature = CompanySignature::where('is_active', true)->first();

        // حساب المبلغ الإجمالي
        $equipmentTotal = $contract->equipment()->sum('total') ?? 0;
        $transportCost = $contract->transport_and_installation_cost ?? 0;
        $discount = $contract->total_discount ?? 0;
        $totalAmount = $equipmentTotal + $transportCost - $discount;

        // بيانات المعدات
        $equipmentData = $contract->equipment->map(function ($item) {
            $startDate = $item->start_date ? \Carbon\Carbon::parse($item->start_date) : null;
            $endDate = $item->end_date ? \Carbon\Carbon::parse($item->end_date) : null;
            $duration = $startDate && $endDate ? $startDate->diffInDays($endDate) : 0;

            return [
                'id' => $item->id,
                'type' => $item->scaffold ? $item->scaffold->scaffold_number : ($item->item_description ?? 'غير محدد'),
                'quantity' => $item->quantity ?? 0,
                'start_date' => $startDate ? $startDate->format('d/m/Y') : '',
                'end_date' => $endDate ? $endDate->format('d/m/Y') : '',
                'duration' => $duration,
                'duration_text' => $duration > 0 ? $duration.' يوم' : '',
                'total' => $item->total ?? 0,
            ];
        });

        return response()->json([
            'contract' => [
                'id' => $contract->id,
                'contract_number' => $contract->contract_number,
                'contract_date' => $contract->start_date ? \Carbon\Carbon::parse($contract->start_date)->format('Y-m-d') : now()->format('Y-m-d'),
                'contract_date_ar' => $contract->start_date ? $this->formatDateArabic($contract->start_date) : $this->formatDateArabic(now()),
                'contract_date_en' => $contract->start_date ? \Carbon\Carbon::parse($contract->start_date)->format('d/m/Y') : now()->format('d/m/Y'),
                'customer_name' => $contract->customer->name ?? 'غير معروف',
                'customer_number' => $contract->customer->customer_number ?? '',
                'delivery_address' => $contract->delivery_address ?? '',
                'equipment' => $equipmentData,
                'equipment_total' => $equipmentTotal,
                'transport_cost' => $transportCost,
                'discount' => $discount,
                'total_amount' => $totalAmount,
            ],
            'company' => [
                'name_ar' => $companySignature->company_name ?? 'الـبعد الـعالي للتجـارة',
                'name_en' => 'HIGHER DIMENSION TRD',
                'address_ar' => 'سلطنة عمان | ص.ب: 215 | الرمز البريدي: 619 | نقال: 93099914',
                'address_en' => 'Sultanate of Oman | P.O. Box: 215 | P.C: 619 | GSM: 93099914',
                'commercial_register' => '1208502',
                'phone' => '93099914',
            ],
        ]);
    }

    private function formatDateArabic($date)
    {
        $months = [
            1 => 'يناير', 2 => 'فبراير', 3 => 'مارس', 4 => 'أبريل',
            5 => 'مايو', 6 => 'يونيو', 7 => 'يوليو', 8 => 'أغسطس',
            9 => 'سبتمبر', 10 => 'أكتوبر', 11 => 'نوفمبر', 12 => 'ديسمبر',
        ];

        $carbon = \Carbon\Carbon::parse($date);
        $day = $carbon->day;
        $month = $months[$carbon->month] ?? $carbon->month;
        $year = $carbon->year;

        return "$day $month $year";
    }

    /**
     * عرض صفحة توقيع العقد
     */
    public function sign(string $contractNumber)
    {
        $contract = Contract::where('contract_number', $contractNumber)
            ->with(['customer', 'equipment.scaffold'])
            ->first();

        if (! $contract) {
            return Inertia::render('Errors/404', [
                'message' => 'العقد المطلوب غير موجود',
                'contractNumber' => $contractNumber,
            ])->toResponse(request())->setStatusCode(404);
        }

        // تحضير بيانات العقد
        $customer = $contract->customer;

        // التحقق من وجود المعدات
        $rentalDetails = [];
        if ($contract->equipment && $contract->equipment->count() > 0) {
            $rentalDetails = $contract->equipment->map(function ($equipment) {
                return [
                    'id' => $equipment->id,
                    'item_description' => $equipment->item_description ?? '',
                    'quantity' => $equipment->quantity ?? 0,
                    'daily_rate' => $equipment->daily_rate ?? 0,
                    'monthly_rate' => $equipment->monthly_rate ?? 0,
                    'duration' => $equipment->duration ?? 0,
                    'duration_type' => $equipment->duration_type ?? 'daily',
                    'start_date' => $equipment->start_date?->format('Y-m-d') ?? '',
                    'end_date' => $equipment->end_date?->format('Y-m-d') ?? '',
                    'total' => $equipment->total ?? 0,
                ];
            })->toArray();
        }

        $contractData = [
            'id' => $contract->id,
            'contract_number' => $contract->contract_number,
            'customer_name' => $customer->name ?? 'غير معروف',
            'customer_id' => $contract->customer_id,
            'customer_number' => $customer->customer_number ?? '',
            'customer_type' => $customer->customer_type ?? 'INDIVIDUAL',
            'customer_commercial_record' => $customer->commercial_record ?? '',
            'customer_id_number' => $customer->id_number ?? '',
            'contract_date' => $contract->contract_date?->format('Y-m-d') ?? $contract->start_date?->format('Y-m-d') ?? now()->format('Y-m-d'),
            'start_date' => $contract->start_date?->format('Y-m-d') ?? now()->format('Y-m-d'),
            'end_date' => $contract->end_date?->format('Y-m-d') ?? now()->format('Y-m-d'),
            'amount' => $contract->amount ?? 0,
            'total_after_discount' => ($contract->amount ?? 0) - ($contract->total_discount ?? 0),
            'total_discount' => $contract->total_discount ?? 0,
            'contract_type' => $contract->payment_type === 'CASH' ? 'بيع' : 'تأجير',
            'delivery_address' => $contract->delivery_address ?? '',
            'location_map_link' => $contract->location_map_link,
            'transport_and_installation_cost' => $contract->transport_and_installation_cost ?? 0,
            'contract_notes' => $contract->contract_notes,
            'rental_details' => $rentalDetails,
            'status' => $this->getStatusLabel($contract->status ?? 'ACTIVE'),
            'customer_signature' => $contract->customer_signature,
            'signed_at' => $contract->signed_at?->format('Y-m-d H:i:s'),
        ];

        return Inertia::render('Contracts/Sign', [
            'contract' => $contractData,
        ]);
    }

    /**
     * حفظ توقيع العقد
     */
    public function saveSignature(Request $request, string $contractNumber)
    {
        $validated = $request->validate([
            'signature' => 'required|string',
        ]);

        $contract = Contract::where('contract_number', $contractNumber)->firstOrFail();

        $contract->update([
            'customer_signature' => $validated['signature'],
            'signed_at' => now(),
        ]);

        return redirect()->back()->with('success', 'تم حفظ التوقيع بنجاح');
    }

    /**
     * رفع مرفق جديد للعقد
     */
    public function uploadAttachment(Request $request, string $id)
    {
        $validated = $request->validate([
            'file' => 'required|file|max:10240', // 10MB max
            'description' => 'nullable|string|max:500',
        ]);

        $contract = Contract::findOrFail($id);

        $file = $validated['file'];
        $originalName = $file->getClientOriginalName();
        $extension = $file->getClientOriginalExtension();
        $mimeType = $file->getMimeType();
        $fileSize = $file->getSize();

        // تحديد نوع الملف
        $fileType = strtoupper($extension);

        // حفظ الملف
        $filePath = $file->store('contracts/attachments', 'public');

        // إنشاء سجل المرفق
        $attachment = \App\Models\ContractAttachment::create([
            'contract_id' => $contract->id,
            'name' => $originalName,
            'file_path' => $filePath,
            'file_type' => $fileType,
            'file_size' => $fileSize,
            'mime_type' => $mimeType,
            'description' => $validated['description'] ?? null,
        ]);

        return redirect()->back()->with('success', 'تم رفع المرفق بنجاح');
    }

    /**
     * حذف مرفق
     */
    public function deleteAttachment(string $contractId, string $attachmentId)
    {
        $contract = Contract::findOrFail($contractId);
        $attachment = \App\Models\ContractAttachment::where('contract_id', $contract->id)
            ->findOrFail($attachmentId);

        // حذف الملف من التخزين
        if (\Storage::disk('public')->exists($attachment->file_path)) {
            \Storage::disk('public')->delete($attachment->file_path);
        }

        // حذف السجل من قاعدة البيانات
        $attachment->delete();

        return redirect()->back()->with('success', 'تم حذف المرفق بنجاح');
    }

    /**
     * تحميل مرفق
     */
    public function downloadAttachment(string $contractId, string $attachmentId)
    {
        $contract = Contract::findOrFail($contractId);
        $attachment = \App\Models\ContractAttachment::where('contract_id', $contract->id)
            ->findOrFail($attachmentId);

        if (! \Storage::disk('public')->exists($attachment->file_path)) {
            abort(404, 'الملف غير موجود');
        }

        return \Storage::disk('public')->download($attachment->file_path, $attachment->name);
    }

    private function getStatusLabel(string $status): string
    {
        return match ($status) {
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
        return match ($method) {
            'cash' => 'نقداً',
            'check' => 'شيك',
            'credit_card' => 'بطاقة ائتمان',
            'bank_transfer' => 'تحويل بنكي',
            default => $method,
        };
    }
}
