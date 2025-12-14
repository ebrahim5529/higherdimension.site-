<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Supplier;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;

class SupplierController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $suppliers = Supplier::query()
            ->get()
            ->map(function ($supplier) {
                return [
                    'id' => $supplier->id,
                    'supplierNumber' => $supplier->supplier_number,
                    'name' => $supplier->name,
                    'nationality' => $supplier->nationality,
                    'supplierType' => $supplier->supplier_type,
                    'idNumber' => $supplier->id_number ?? $supplier->commercial_record,
                    'phone' => $supplier->phone,
                    'email' => $supplier->email,
                    'status' => $supplier->status,
                    'registrationDate' => $supplier->registration_date,
                    'invoicesCount' => 0, // سيتم إضافتها لاحقاً
                    'totalInvoices' => 0,
                    'paidAmount' => 0,
                    'pendingAmount' => 0,
                    'overdueAmount' => 0,
                    'purchasesCount' => 0, // سيتم إضافتها لاحقاً
                    'totalPurchases' => 0,
                    'rating' => $supplier->rating,
                    'hasWarnings' => ! empty($supplier->warnings),
                ];
            });

        // إحصائيات الموردين
        $totalSuppliers = Supplier::count();
        $activeSuppliers = Supplier::where('status', 'ACTIVE')->count();
        $inactiveSuppliers = Supplier::where('status', 'INACTIVE')->count();
        $suspendedSuppliers = Supplier::where('status', 'SUSPENDED')->count();
        $individualSuppliers = Supplier::where('supplier_type', 'INDIVIDUAL')->count();
        $companySuppliers = Supplier::where('supplier_type', 'COMPANY')->count();

        // إحصائيات الفواتير (سيتم إضافتها لاحقاً)
        $totalInvoices = 0;
        $totalInvoiceAmount = 0;
        $paidAmount = 0;
        $pendingAmount = 0;
        $overdueAmount = 0;

        // إحصائيات المشتريات (سيتم إضافتها لاحقاً)
        $totalPurchases = 0;
        $totalPurchaseAmount = 0;

        $suppliersWithWarnings = Supplier::whereNotNull('warnings')
            ->where('warnings', '!=', '')
            ->count();
        $averageRating = Supplier::whereNotNull('rating')->avg('rating') ?? 0;

        // توزيع الجنسيات
        $nationalityDistribution = Supplier::query()
            ->selectRaw('nationality, COUNT(*) as count')
            ->whereNotNull('nationality')
            ->groupBy('nationality')
            ->pluck('count', 'nationality')
            ->toArray();

        // التسجيلات الشهرية
        $monthlyRegistrations = Supplier::query()
            ->selectRaw('DATE_FORMAT(registration_date, "%Y-%m") as month, COUNT(*) as count')
            ->whereNotNull('registration_date')
            ->groupBy('month')
            ->orderBy('month')
            ->pluck('count', 'month')
            ->toArray();

        $stats = [
            'totalSuppliers' => $totalSuppliers,
            'activeSuppliers' => $activeSuppliers,
            'inactiveSuppliers' => $inactiveSuppliers,
            'suspendedSuppliers' => $suspendedSuppliers,
            'individualSuppliers' => $individualSuppliers,
            'companySuppliers' => $companySuppliers,
            'totalInvoices' => $totalInvoices,
            'totalInvoiceAmount' => $totalInvoiceAmount,
            'paidAmount' => $paidAmount,
            'pendingAmount' => $pendingAmount,
            'overdueAmount' => $overdueAmount,
            'totalPurchases' => $totalPurchases,
            'totalPurchaseAmount' => $totalPurchaseAmount,
            'suppliersWithWarnings' => $suppliersWithWarnings,
            'averageRating' => round($averageRating, 2),
            'nationalityDistribution' => $nationalityDistribution,
            'monthlyRegistrations' => $monthlyRegistrations,
        ];

        return Inertia::render('Suppliers/Index', [
            'suppliers' => $suppliers,
            'stats' => $stats,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Suppliers/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // تحويل supplierType إلى supplier_type إذا كان موجوداً
        $requestData = $request->all();
        if (isset($requestData['supplierType'])) {
            $requestData['supplier_type'] = $requestData['supplierType'];
        }
        if (isset($requestData['idNumber'])) {
            $requestData['id_number'] = $requestData['idNumber'];
        }
        if (isset($requestData['commercialRecord'])) {
            $requestData['commercial_record'] = $requestData['commercialRecord'];
        }
        if (isset($requestData['taxNumber'])) {
            $requestData['tax_number'] = $requestData['taxNumber'];
        }
        if (isset($requestData['contactPerson'])) {
            $requestData['contact_person'] = $requestData['contactPerson'];
        }
        if (isset($requestData['contactPersonPhone'])) {
            $requestData['contact_person_phone'] = $requestData['contactPersonPhone'];
        }
        if (isset($requestData['contactPersonEmail'])) {
            $requestData['contact_person_email'] = $requestData['contactPersonEmail'];
        }
        if (isset($requestData['bankName'])) {
            $requestData['bank_name'] = $requestData['bankName'];
        }
        if (isset($requestData['bankAccount'])) {
            $requestData['bank_account'] = $requestData['bankAccount'];
        }
        if (isset($requestData['swiftCode'])) {
            $requestData['swift_code'] = $requestData['swiftCode'];
        }
        if (isset($requestData['registrationDate'])) {
            $requestData['registration_date'] = $requestData['registrationDate'];
        }

        // دمج البيانات المحولة مع البيانات الأصلية
        $request->merge($requestData);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'nullable|email|unique:suppliers,email',
            'phone' => 'nullable|string',
            'address' => 'nullable|string',
            'nationality' => 'nullable|string',
            'supplier_type' => 'required|in:INDIVIDUAL,COMPANY',
            'id_number' => 'nullable|string',
            'commercial_record' => 'nullable|string',
            'tax_number' => 'nullable|string',
            'status' => 'required|in:ACTIVE,INACTIVE,SUSPENDED',
            'registration_date' => 'nullable|date',
            'contact_person' => 'nullable|string',
            'contact_person_phone' => 'nullable|string',
            'contact_person_email' => 'nullable|email',
            'bank_name' => 'nullable|string',
            'bank_account' => 'nullable|string',
            'iban' => 'nullable|string',
            'swift_code' => 'nullable|string',
            'notes' => 'nullable|string',
            'warnings' => 'nullable|string',
            'rating' => 'nullable|integer|min:1|max:5',
        ]);

        // إنشاء رقم المورد
        $validated['supplier_number'] = 'SUPP-' . str_pad((Supplier::count() + 1), 3, '0', STR_PAD_LEFT);

        // إضافة تاريخ التسجيل إذا لم يتم إرساله
        if (! isset($validated['registration_date'])) {
            $validated['registration_date'] = now();
        }

        $supplier = Supplier::create($validated);

        return redirect()->route('suppliers.index')
            ->with('success', 'تم إضافة المورد بنجاح');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $supplier = Supplier::findOrFail($id);

        // حساب إحصائيات الفواتير (سيتم إضافتها لاحقاً)
        $invoicesSummary = [
            'total' => 0,
            'pending' => 0,
            'paid' => 0,
            'overdue' => 0,
            'totalAmount' => 0,
        ];

        // حساب إحصائيات المشتريات (سيتم إضافتها لاحقاً)
        $purchasesSummary = [
            'total' => 0,
            'pending' => 0,
            'confirmed' => 0,
            'delivered' => 0,
            'totalAmount' => 0,
        ];

        return Inertia::render('Suppliers/Show', [
            'supplier' => [
                'id' => $supplier->id,
                'supplierNumber' => $supplier->supplier_number,
                'name' => $supplier->name,
                'email' => $supplier->email,
                'phone' => $supplier->phone,
                'address' => $supplier->address,
                'nationality' => $supplier->nationality,
                'supplierType' => $supplier->supplier_type,
                'idNumber' => $supplier->id_number,
                'commercialRecord' => $supplier->commercial_record,
                'taxNumber' => $supplier->tax_number,
                'status' => $supplier->status,
                'registrationDate' => $supplier->registration_date,
                'contactPerson' => $supplier->contact_person,
                'contactPersonPhone' => $supplier->contact_person_phone,
                'contactPersonEmail' => $supplier->contact_person_email,
                'bankName' => $supplier->bank_name,
                'bankAccount' => $supplier->bank_account,
                'iban' => $supplier->iban,
                'swiftCode' => $supplier->swift_code,
                'notes' => $supplier->notes,
                'warnings' => $supplier->warnings,
                'rating' => $supplier->rating,
                'invoices' => [], // سيتم إضافتها لاحقاً
                'purchases' => [], // سيتم إضافتها لاحقاً
                'invoicesSummary' => $invoicesSummary,
                'purchasesSummary' => $purchasesSummary,
            ],
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $supplier = Supplier::findOrFail($id);

        return Inertia::render('Suppliers/Edit', [
            'supplier' => [
                'id' => $supplier->id,
                'supplierNumber' => $supplier->supplier_number,
                'name' => $supplier->name,
                'email' => $supplier->email,
                'phone' => $supplier->phone,
                'address' => $supplier->address,
                'nationality' => $supplier->nationality,
                'supplierType' => $supplier->supplier_type,
                'idNumber' => $supplier->id_number,
                'commercialRecord' => $supplier->commercial_record,
                'taxNumber' => $supplier->tax_number,
                'status' => $supplier->status,
                'registrationDate' => $supplier->registration_date?->format('Y-m-d'),
                'contactPerson' => $supplier->contact_person,
                'contactPersonPhone' => $supplier->contact_person_phone,
                'contactPersonEmail' => $supplier->contact_person_email,
                'bankName' => $supplier->bank_name,
                'bankAccount' => $supplier->bank_account,
                'iban' => $supplier->iban,
                'swiftCode' => $supplier->swift_code,
                'notes' => $supplier->notes,
                'warnings' => $supplier->warnings,
                'rating' => $supplier->rating ? String($supplier->rating) : '',
            ],
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $supplier = Supplier::findOrFail($id);

        // تحويل supplierType إلى supplier_type إذا كان موجوداً
        $requestData = $request->all();
        if (isset($requestData['supplierType'])) {
            $requestData['supplier_type'] = $requestData['supplierType'];
        }
        if (isset($requestData['idNumber'])) {
            $requestData['id_number'] = $requestData['idNumber'];
        }
        if (isset($requestData['commercialRecord'])) {
            $requestData['commercial_record'] = $requestData['commercialRecord'];
        }
        if (isset($requestData['taxNumber'])) {
            $requestData['tax_number'] = $requestData['taxNumber'];
        }
        if (isset($requestData['contactPerson'])) {
            $requestData['contact_person'] = $requestData['contactPerson'];
        }
        if (isset($requestData['contactPersonPhone'])) {
            $requestData['contact_person_phone'] = $requestData['contactPersonPhone'];
        }
        if (isset($requestData['contactPersonEmail'])) {
            $requestData['contact_person_email'] = $requestData['contactPersonEmail'];
        }
        if (isset($requestData['bankName'])) {
            $requestData['bank_name'] = $requestData['bankName'];
        }
        if (isset($requestData['bankAccount'])) {
            $requestData['bank_account'] = $requestData['bankAccount'];
        }
        if (isset($requestData['swiftCode'])) {
            $requestData['swift_code'] = $requestData['swiftCode'];
        }
        if (isset($requestData['registrationDate'])) {
            $requestData['registration_date'] = $requestData['registrationDate'];
        }

        // دمج البيانات المحولة مع البيانات الأصلية
        $request->merge($requestData);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'nullable|email|unique:suppliers,email,'.$id,
            'phone' => 'nullable|string',
            'address' => 'nullable|string',
            'nationality' => 'nullable|string',
            'supplier_type' => 'required|in:INDIVIDUAL,COMPANY',
            'id_number' => 'nullable|string',
            'commercial_record' => 'nullable|string',
            'tax_number' => 'nullable|string',
            'status' => 'required|in:ACTIVE,INACTIVE,SUSPENDED',
            'registration_date' => 'nullable|date',
            'contact_person' => 'nullable|string',
            'contact_person_phone' => 'nullable|string',
            'contact_person_email' => 'nullable|email',
            'bank_name' => 'nullable|string',
            'bank_account' => 'nullable|string',
            'iban' => 'nullable|string',
            'swift_code' => 'nullable|string',
            'notes' => 'nullable|string',
            'warnings' => 'nullable|string',
            'rating' => 'nullable|integer|min:1|max:5',
        ]);

        $supplier->update($validated);

        return redirect()->route('suppliers.index')
            ->with('success', 'تم تحديث المورد بنجاح');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $supplier = Supplier::findOrFail($id);
        $supplier->delete();

        return redirect()->route('suppliers.index')
            ->with('success', 'تم حذف المورد بنجاح');
    }
}
