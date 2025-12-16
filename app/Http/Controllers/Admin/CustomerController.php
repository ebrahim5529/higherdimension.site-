<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CustomerController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $customers = Customer::with(['contracts', 'payments'])
            ->get()
            ->map(function ($customer) {
                return [
                    'id' => $customer->id,
                    'customerNumber' => $customer->customer_number,
                    'name' => $customer->name,
                    'nationality' => $customer->nationality,
                    'customerType' => $customer->customer_type,
                    'idNumber' => $customer->id_number ?? $customer->commercial_record,
                    'phone' => $customer->phone,
                    'email' => $customer->email,
                    'status' => $customer->status,
                    'registrationDate' => $customer->registration_date,
                    'contractsCount' => $customer->contracts->count(),
                    'totalPayments' => $customer->payments->sum('amount') ?? 0,
                    'pendingAmount' => $customer->contracts()
                        ->where('status', 'ACTIVE')
                        ->withSum('payments as paid_amount', 'amount')
                        ->get()
                        ->sum(function ($contract) {
                            $paidAmount = $contract->paid_amount ?? 0;

                            return max(0, ($contract->amount ?? 0) - $paidAmount);
                        }),
                    'rating' => $customer->rating,
                    'hasWarnings' => ! empty($customer->warnings),
                ];
            });

        // إحصائيات العملاء من قاعدة البيانات
        $totalCustomers = Customer::count();
        $activeCustomers = Customer::where('status', 'ACTIVE')->count();
        $inactiveCustomers = Customer::where('status', 'INACTIVE')->count();
        $individualCustomers = Customer::where('customer_type', 'INDIVIDUAL')->count();
        $companyCustomers = Customer::where('customer_type', 'COMPANY')->count();

        // إحصائيات العقود والمدفوعات من قاعدة البيانات
        $totalContracts = \App\Models\Contract::count();
        $totalPayments = \App\Models\Payment::sum('amount') ?? 0;

        // حساب المبلغ المتبقي بشكل فعال من قاعدة البيانات
        $totalPendingAmount = \App\Models\Contract::query()
            ->where('status', 'ACTIVE')
            ->withSum('payments as paid_amount', 'amount')
            ->get()
            ->sum(function ($contract) {
                $paidAmount = $contract->paid_amount ?? 0;

                return max(0, ($contract->amount ?? 0) - $paidAmount);
            });

        $customersWithWarnings = Customer::whereNotNull('warnings')
            ->where('warnings', '!=', '')
            ->count();
        $averageRating = Customer::whereNotNull('rating')->avg('rating') ?? 0;

        // توزيع الجنسيات من قاعدة البيانات
        $nationalityDistribution = Customer::query()
            ->selectRaw('nationality, COUNT(*) as count')
            ->whereNotNull('nationality')
            ->groupBy('nationality')
            ->pluck('count', 'nationality')
            ->toArray();

        // التسجيلات الشهرية من قاعدة البيانات
        $monthlyRegistrations = Customer::query()
            ->selectRaw('DATE_FORMAT(registration_date, "%Y-%m") as month, COUNT(*) as count')
            ->whereNotNull('registration_date')
            ->groupBy('month')
            ->orderBy('month')
            ->pluck('count', 'month')
            ->toArray();

        $stats = [
            'totalCustomers' => $totalCustomers,
            'activeCustomers' => $activeCustomers,
            'inactiveCustomers' => $inactiveCustomers,
            'individualCustomers' => $individualCustomers,
            'companyCustomers' => $companyCustomers,
            'totalContracts' => $totalContracts,
            'totalPayments' => $totalPayments,
            'totalPendingAmount' => $totalPendingAmount,
            'customersWithWarnings' => $customersWithWarnings,
            'averageRating' => round($averageRating, 2),
            'nationalityDistribution' => $nationalityDistribution,
            'monthlyRegistrations' => $monthlyRegistrations,
        ];

        return Inertia::render('Customers/Index', [
            'customers' => $customers,
            'stats' => $stats,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Customers/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // توليد رقم العميل تلقائياً إذا لم يتم إرساله
        $customerNumber = $request->input('customer_number');
        if (! $customerNumber) {
            $lastCustomer = Customer::orderBy('id', 'desc')->first();
            $lastNumber = $lastCustomer ? (int) str_replace('CUST-', '', $lastCustomer->customer_number) : 0;
            $customerNumber = 'CUST-'.str_pad((string) ($lastNumber + 1), 3, '0', STR_PAD_LEFT);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'nullable|email|unique:customers,email',
            'phone' => 'nullable|string',
            'phones' => 'nullable|array',
            'phones.*.number' => 'nullable|string',
            'phones.*.type' => 'nullable|in:MOBILE,LANDLINE,WHATSAPP',
            'phones.*.label' => 'nullable|string',
            'phones.*.isPrimary' => 'nullable|boolean',
            'address' => 'nullable|string',
            'nationality' => 'nullable|string',
            'customer_type' => 'required|in:INDIVIDUAL,COMPANY',
            'id_number' => 'nullable|string',
            'commercial_record' => 'nullable|string',
            'status' => 'required|in:ACTIVE,INACTIVE',
            'registration_date' => 'nullable|date',
            'guarantor_name' => 'nullable|string',
            'guarantor_phone' => 'nullable|string',
            'guarantor_id' => 'nullable|string',
            'guarantorData' => 'nullable|array',
            'guarantorData.name' => 'nullable|string',
            'guarantorData.phone' => 'nullable|string',
            'guarantorData.idNumber' => 'nullable|string',
            'guarantorData.nationality' => 'nullable|string',
            'guarantorData.address' => 'nullable|string',
            'guarantorData.relationship' => 'nullable|string',
            'guarantorData.workPlace' => 'nullable|string',
            'guarantorData.workPhone' => 'nullable|string',
            'notes' => 'nullable|string',
            'warnings' => 'nullable|string',
            'rating' => 'nullable|integer|min:1|max:5',
            'idCardCopy' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:10240',
            'guarantorIdCardCopy' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:10240',
            'commercialRecordCopy' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:10240',
        ]);

        // إضافة رقم العميل
        $validated['customer_number'] = $customerNumber;

        // إضافة تاريخ التسجيل إذا لم يتم إرساله
        if (! isset($validated['registration_date'])) {
            $validated['registration_date'] = now();
        }

        // حفظ الملفات المرفوعة
        if ($request->hasFile('idCardCopy')) {
            $validated['id_card_copy_path'] = $request->file('idCardCopy')->store('customers/id-cards', 'public');
        }

        if ($request->hasFile('guarantorIdCardCopy')) {
            $validated['guarantor_id_card_copy_path'] = $request->file('guarantorIdCardCopy')->store('customers/guarantor-id-cards', 'public');
        }

        if ($request->hasFile('commercialRecordCopy')) {
            $validated['commercial_record_copy_path'] = $request->file('commercialRecordCopy')->store('customers/commercial-records', 'public');
        }

        // حفظ بيانات الضامن الكاملة في JSON إذا كانت موجودة
        if (isset($validated['guarantorData']) && ! empty($validated['guarantorData'])) {
            $validated['guarantor_name'] = $validated['guarantorData']['name'] ?? $validated['guarantor_name'] ?? null;
            $validated['guarantor_phone'] = $validated['guarantorData']['phone'] ?? $validated['guarantor_phone'] ?? null;
            $validated['guarantor_id'] = $validated['guarantorData']['idNumber'] ?? $validated['guarantor_id'] ?? null;
        }

        // حفظ أرقام الهواتف في JSON
        if (isset($validated['phones']) && ! empty($validated['phones'])) {
            $validated['phones'] = json_encode($validated['phones']);
        }

        // إزالة الحقول غير المطلوبة من $validated قبل الحفظ
        unset($validated['guarantorData']);

        $customer = Customer::create($validated);

        return redirect()->route('customers.index')
            ->with('success', 'تم إنشاء العميل بنجاح');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $customer = Customer::with(['contracts.contractPayments', 'contracts.customer', 'payments', 'customerNotes'])
            ->findOrFail($id);

        // حساب إحصائيات العقود
        $contractsSummary = [
            'total' => $customer->contracts->count(),
            'active' => $customer->contracts->where('status', 'ACTIVE')->count(),
            'completed' => $customer->contracts->where('status', 'COMPLETED')->count(),
            'cancelled' => $customer->contracts->where('status', 'CANCELLED')->count(),
            'totalValue' => $customer->contracts->sum('amount') ?? 0,
        ];

        // حساب إحصائيات المدفوعات
        $paymentsSummary = [
            'total' => $customer->payments->count(),
            'paid' => $customer->payments->where('status', 'PAID')->count(),
            'pending' => $customer->payments->where('status', 'PENDING')->count(),
            'overdue' => $customer->payments->where('status', 'OVERDUE')->count(),
            'totalAmount' => $customer->payments->sum('amount') ?? 0,
        ];

        // استخراج بيانات الضامن من attachments إذا كانت موجودة
        $guarantorData = null;
        if ($customer->attachments) {
            $attachments = is_string($customer->attachments) ? json_decode($customer->attachments, true) : $customer->attachments;
            if (isset($attachments['guarantorData'])) {
                $guarantorData = $attachments['guarantorData'];
            }
        }

        // إذا لم تكن موجودة في attachments، استخدم الحقول البسيطة
        if (! $guarantorData && ($customer->guarantor_name || $customer->guarantor_phone || $customer->guarantor_id)) {
            $guarantorData = [
                'name' => $customer->guarantor_name,
                'phone' => $customer->guarantor_phone,
                'idNumber' => $customer->guarantor_id,
            ];
        }

        return Inertia::render('Customers/Show', [
            'customer' => [
                'id' => $customer->id,
                'customer_number' => $customer->customer_number,
                'name' => $customer->name,
                'email' => $customer->email,
                'phone' => $customer->phone,
                'phones' => $customer->phones ?? [],
                'address' => $customer->address,
                'nationality' => $customer->nationality,
                'customer_type' => $customer->customer_type,
                'id_number' => $customer->id_number,
                'commercial_record' => $customer->commercial_record,
                'status' => $customer->status,
                'registration_date' => $customer->registration_date,
                'guarantor_name' => $customer->guarantor_name,
                'guarantor_phone' => $customer->guarantor_phone,
                'guarantor_id' => $customer->guarantor_id,
                'guarantorData' => $guarantorData,
                'notes' => $customer->notes,
                'warnings' => $customer->warnings,
                'rating' => $customer->rating,
                'id_card_copy_path' => $customer->id_card_copy_path ? asset('storage/'.$customer->id_card_copy_path) : null,
                'guarantor_id_card_copy_path' => $customer->guarantor_id_card_copy_path ? asset('storage/'.$customer->guarantor_id_card_copy_path) : null,
                'commercial_record_copy_path' => $customer->commercial_record_copy_path ? asset('storage/'.$customer->commercial_record_copy_path) : null,
                'contracts' => $customer->contracts->map(function ($contract) {
                    return [
                        'id' => $contract->id,
                        'contract_number' => $contract->contract_number,
                        'contract_type' => $contract->title ?? '-',
                        'status' => $contract->status,
                        'start_date' => $contract->start_date,
                        'end_date' => $contract->end_date,
                        'total_value' => $contract->amount ?? 0,
                        'paid_amount' => $contract->payments->sum('amount') ?? 0,
                        'remaining_amount' => max(0, ($contract->amount ?? 0) - ($contract->payments->sum('amount') ?? 0)),
                    ];
                }),
                'payments' => $customer->payments->map(function ($payment) {
                    return [
                        'id' => $payment->id,
                        'payment_number' => $payment->payment_number ?? $payment->id,
                        'amount' => $payment->amount,
                        'payment_date' => $payment->payment_date,
                        'status' => $payment->status,
                    ];
                }),
                'contractPayments' => $customer->contracts->flatMap(function ($contract) {
                    return $contract->contractPayments->map(function ($payment) use ($contract) {
                        return [
                            'id' => $payment->id,
                            'contractId' => $contract->id,
                            'contractNumber' => $contract->contract_number,
                            'contractTitle' => $contract->title,
                            'paymentMethod' => $this->getPaymentMethodLabel($payment->payment_method),
                            'paymentMethodValue' => $payment->payment_method,
                            'paymentDate' => $payment->payment_date->format('Y-m-d'),
                            'amount' => (float) $payment->amount,
                            'checkNumber' => $payment->check_number,
                            'bankName' => $payment->bank_name,
                            'checkDate' => $payment->check_date ? $payment->check_date->format('Y-m-d') : null,
                            'checkImagePath' => $payment->check_image_path ? \Illuminate\Support\Facades\Storage::url($payment->check_image_path) : null,
                            'notes' => $payment->notes,
                            'createdAt' => $payment->created_at->format('Y-m-d H:i:s'),
                        ];
                    });
                })->values()->toArray(),
                'customerNotes' => $customer->customerNotes->map(function ($note) {
                    return [
                        'id' => $note->id,
                        'title' => $note->title,
                        'content' => $note->content ?? $note->note,
                        'created_at' => $note->created_at,
                    ];
                }),
                'contractsSummary' => $contractsSummary,
                'paymentsSummary' => $paymentsSummary,
            ],
        ]);
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

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $customer = Customer::findOrFail($id);

        // استخراج بيانات الضامن من attachments إذا كانت موجودة
        $guarantorData = null;
        if ($customer->attachments) {
            $attachments = is_string($customer->attachments) ? json_decode($customer->attachments, true) : $customer->attachments;
            if (isset($attachments['guarantorData'])) {
                $guarantorData = $attachments['guarantorData'];
            }
        }

        // إذا لم تكن موجودة في attachments، استخدم الحقول البسيطة
        if (! $guarantorData && ($customer->guarantor_name || $customer->guarantor_phone || $customer->guarantor_id)) {
            $guarantorData = [
                'name' => $customer->guarantor_name,
                'phone' => $customer->guarantor_phone,
                'idNumber' => $customer->guarantor_id,
            ];
        }

        return Inertia::render('Customers/Edit', [
            'customer' => [
                'id' => $customer->id,
                'customer_number' => $customer->customer_number,
                'name' => $customer->name,
                'email' => $customer->email,
                'phone' => $customer->phone,
                'phones' => $customer->phones ?? [],
                'address' => $customer->address,
                'nationality' => $customer->nationality,
                'customer_type' => $customer->customer_type,
                'id_number' => $customer->id_number,
                'commercial_record' => $customer->commercial_record,
                'status' => $customer->status,
                'registration_date' => $customer->registration_date?->format('Y-m-d'),
                'guarantor_name' => $customer->guarantor_name,
                'guarantor_phone' => $customer->guarantor_phone,
                'guarantor_id' => $customer->guarantor_id,
                'guarantorData' => $guarantorData,
                'notes' => $customer->notes,
                'warnings' => $customer->warnings,
                'rating' => $customer->rating,
                'id_card_copy_path' => $customer->id_card_copy_path ? asset('storage/'.$customer->id_card_copy_path) : null,
                'guarantor_id_card_copy_path' => $customer->guarantor_id_card_copy_path ? asset('storage/'.$customer->guarantor_id_card_copy_path) : null,
                'commercial_record_copy_path' => $customer->commercial_record_copy_path ? asset('storage/'.$customer->commercial_record_copy_path) : null,
            ],
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $customer = Customer::findOrFail($id);

        // تحويل customerType إلى customer_type إذا كان موجوداً
        $requestData = $request->all();
        if (isset($requestData['customerType'])) {
            $requestData['customer_type'] = $requestData['customerType'];
        }
        if (isset($requestData['idNumber'])) {
            $requestData['id_number'] = $requestData['idNumber'];
        }
        if (isset($requestData['commercialRecord'])) {
            $requestData['commercial_record'] = $requestData['commercialRecord'];
        }
        if (isset($requestData['guarantorName'])) {
            $requestData['guarantor_name'] = $requestData['guarantorName'];
        }
        if (isset($requestData['guarantorPhone'])) {
            $requestData['guarantor_phone'] = $requestData['guarantorPhone'];
        }
        if (isset($requestData['guarantorId'])) {
            $requestData['guarantor_id'] = $requestData['guarantorId'];
        }
        if (isset($requestData['registration_date'])) {
            $requestData['registration_date'] = $requestData['registration_date'];
        }

        // دمج البيانات المحولة مع البيانات الأصلية
        $request->merge($requestData);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'nullable|email|unique:customers,email,'.$id,
            'phone' => 'nullable|string',
            'phones' => 'nullable|array',
            'phones.*.number' => 'nullable|string',
            'phones.*.type' => 'nullable|in:MOBILE,LANDLINE,WHATSAPP',
            'phones.*.label' => 'nullable|string',
            'phones.*.isPrimary' => 'nullable|boolean',
            'address' => 'nullable|string',
            'nationality' => 'nullable|string',
            'customer_type' => 'required|in:INDIVIDUAL,COMPANY',
            'id_number' => 'nullable|string',
            'commercial_record' => 'nullable|string',
            'status' => 'required|in:ACTIVE,INACTIVE',
            'registration_date' => 'nullable|date',
            'guarantor_name' => 'nullable|string',
            'guarantor_phone' => 'nullable|string',
            'guarantor_id' => 'nullable|string',
            'guarantorData' => 'nullable|array',
            'guarantorData.name' => 'nullable|string',
            'guarantorData.phone' => 'nullable|string',
            'guarantorData.idNumber' => 'nullable|string',
            'guarantorData.nationality' => 'nullable|string',
            'guarantorData.address' => 'nullable|string',
            'guarantorData.relationship' => 'nullable|string',
            'guarantorData.workPlace' => 'nullable|string',
            'guarantorData.workPhone' => 'nullable|string',
            'notes' => 'nullable|string',
            'warnings' => 'nullable|string',
            'rating' => 'nullable|integer|min:1|max:5',
            'idCardCopy' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:10240',
            'guarantorIdCardCopy' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:10240',
            'commercialRecordCopy' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:10240',
        ]);

        // إضافة تاريخ التسجيل إذا لم يتم إرساله
        if (! isset($validated['registration_date'])) {
            $validated['registration_date'] = $customer->registration_date ?? now();
        }

        // حفظ الملفات المرفوعة (فقط إذا تم رفع ملفات جديدة)
        if ($request->hasFile('idCardCopy')) {
            // حذف الملف القديم إذا كان موجوداً
            if ($customer->id_card_copy_path && \Storage::disk('public')->exists($customer->id_card_copy_path)) {
                \Storage::disk('public')->delete($customer->id_card_copy_path);
            }
            $validated['id_card_copy_path'] = $request->file('idCardCopy')->store('customers/id-cards', 'public');
        }

        if ($request->hasFile('guarantorIdCardCopy')) {
            // حذف الملف القديم إذا كان موجوداً
            if ($customer->guarantor_id_card_copy_path && \Storage::disk('public')->exists($customer->guarantor_id_card_copy_path)) {
                \Storage::disk('public')->delete($customer->guarantor_id_card_copy_path);
            }
            $validated['guarantor_id_card_copy_path'] = $request->file('guarantorIdCardCopy')->store('customers/guarantor-id-cards', 'public');
        }

        if ($request->hasFile('commercialRecordCopy')) {
            // حذف الملف القديم إذا كان موجوداً
            if ($customer->commercial_record_copy_path && \Storage::disk('public')->exists($customer->commercial_record_copy_path)) {
                \Storage::disk('public')->delete($customer->commercial_record_copy_path);
            }
            $validated['commercial_record_copy_path'] = $request->file('commercialRecordCopy')->store('customers/commercial-records', 'public');
        }

        // حفظ بيانات الضامن الكاملة في JSON إذا كانت موجودة
        if (isset($validated['guarantorData']) && ! empty($validated['guarantorData'])) {
            $validated['guarantor_name'] = $validated['guarantorData']['name'] ?? $validated['guarantor_name'] ?? null;
            $validated['guarantor_phone'] = $validated['guarantorData']['phone'] ?? $validated['guarantor_phone'] ?? null;
            $validated['guarantor_id'] = $validated['guarantorData']['idNumber'] ?? $validated['guarantor_id'] ?? null;
        }

        // حفظ أرقام الهواتف في JSON
        if (isset($validated['phones']) && ! empty($validated['phones'])) {
            $validated['phones'] = json_encode($validated['phones']);
        }

        // إزالة الحقول غير المطلوبة من $validated قبل الحفظ
        unset($validated['guarantorData']);

        $customer->update($validated);

        return redirect()->route('customers.show', $id)
            ->with('success', 'تم تحديث العميل بنجاح');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $customer = Customer::findOrFail($id);
        $customer->delete();

        return redirect()->route('customers.index')
            ->with('success', 'تم حذف العميل بنجاح');
    }

    /**
     * Display customer contracts with count.
     */
    public function contracts()
    {
        $customers = Customer::with(['contracts', 'contracts.contractPayments'])
            ->get()
            ->map(function ($customer) {
                $contracts = $customer->contracts;
                $totalPaid = $contracts->sum(function ($contract) {
                    return $contract->contractPayments->sum('amount') ?? 0;
                });
                $totalRemaining = $contracts->sum(function ($contract) {
                    $paid = $contract->contractPayments->sum('amount') ?? 0;
                    return max(0, ($contract->amount ?? 0) - $paid);
                });

                return [
                    'id' => $customer->id,
                    'customerNumber' => $customer->customer_number,
                    'name' => $customer->name,
                    'phone' => $customer->phone,
                    'email' => $customer->email,
                    'contractsCount' => $contracts->count(),
                    'activeContractsCount' => $contracts->where('status', 'ACTIVE')->count(),
                    'totalContractsValue' => $contracts->sum('amount') ?? 0,
                    'totalPaid' => $totalPaid,
                    'totalRemaining' => $totalRemaining,
                    'contracts' => $contracts->map(function ($contract) {
                        $paid = $contract->contractPayments->sum('amount') ?? 0;
                        return [
                            'id' => $contract->id,
                            'contractNumber' => $contract->contract_number,
                            'title' => $contract->title,
                            'status' => $contract->status,
                            'amount' => $contract->amount ?? 0,
                            'paidAmount' => $paid,
                            'remainingAmount' => max(0, ($contract->amount ?? 0) - $paid),
                            'startDate' => $contract->start_date,
                            'endDate' => $contract->end_date,
                        ];
                    })->toArray(),
                ];
            })
            ->sortByDesc('contractsCount')
            ->values();

        return Inertia::render('Customers/Contracts', [
            'customers' => $customers,
        ]);
    }

    /**
     * Display customer claims (payments and remaining amounts).
     */
    public function claims()
    {
        $customers = Customer::with(['contracts.contractPayments'])
            ->get()
            ->map(function ($customer) {
                $contracts = $customer->contracts;
                $totalPaid = $contracts->sum(function ($contract) {
                    return $contract->contractPayments->sum('amount') ?? 0;
                });
                $totalRemaining = $contracts->sum(function ($contract) {
                    $paid = $contract->contractPayments->sum('amount') ?? 0;
                    return max(0, ($contract->amount ?? 0) - $paid);
                });
                $overdueAmount = $contracts->filter(function ($contract) {
                    return $contract->status === 'ACTIVE' && 
                           $contract->end_date && 
                           now()->greaterThan($contract->end_date);
                })->sum(function ($contract) {
                    $paid = $contract->contractPayments->sum('amount') ?? 0;
                    return max(0, ($contract->amount ?? 0) - $paid);
                });

                return [
                    'id' => $customer->id,
                    'customerNumber' => $customer->customer_number,
                    'name' => $customer->name,
                    'phone' => $customer->phone,
                    'email' => $customer->email,
                    'totalContractsValue' => $contracts->sum('amount') ?? 0,
                    'totalPaid' => $totalPaid,
                    'totalRemaining' => $totalRemaining,
                    'overdueAmount' => $overdueAmount,
                    'contractsCount' => $contracts->count(),
                    'payments' => $contracts->flatMap(function ($contract) {
                        return $contract->contractPayments->map(function ($payment) use ($contract) {
                            return [
                                'id' => $payment->id,
                                'contractId' => $contract->id,
                                'contractNumber' => $contract->contract_number,
                                'paymentMethod' => $this->getPaymentMethodLabel($payment->payment_method),
                                'paymentDate' => $payment->payment_date->format('Y-m-d'),
                                'amount' => (float) $payment->amount,
                            ];
                        });
                    })->values()->toArray(),
                ];
            })
            ->filter(function ($customer) {
                return $customer['totalRemaining'] > 0;
            })
            ->sortByDesc('totalRemaining')
            ->values();

        return Inertia::render('Customers/Claims', [
            'customers' => $customers,
        ]);
    }

    /**
     * Store a new customer note.
     */
    public function storeNote(Request $request, string $id)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
        ]);

        $customer = Customer::findOrFail($id);
        
        $note = $customer->customerNotes()->create([
            'title' => $validated['title'],
            'content' => $validated['content'],
            'user_id' => auth()->id(),
        ]);

        return redirect()->back()
            ->with('success', 'تم إضافة الملاحظة بنجاح');
    }
}
