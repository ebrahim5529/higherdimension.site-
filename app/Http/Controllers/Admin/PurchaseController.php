<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Purchase;
use App\Models\Supplier;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Services\AccountingService;

class PurchaseController extends Controller
{
    public function index()
    {
        $purchases = Purchase::with('supplier')
            ->orderByDesc('purchase_date')
            ->get()
            ->map(function ($purchase) {
                return [
                    'id' => $purchase->id,
                    'purchaseNumber' => $purchase->purchase_number,
                    'title' => $purchase->title,
                    'description' => $purchase->description,
                    'amount' => (float) $purchase->amount,
                    'purchaseDate' => $purchase->purchase_date?->format('Y-m-d'),
                    'status' => $purchase->status,
                    'supplierName' => $purchase->supplier->name ?? 'غير معروف',
                    'supplierId' => $purchase->supplier_id,
                    'notes' => $purchase->notes,
                ];
            });

        $stats = [
            'totalPurchases' => Purchase::count(),
            'totalAmount' => (float) Purchase::sum('amount'),
            'pendingPurchases' => Purchase::where('status', 'pending')->count(),
            'completedPurchases' => Purchase::where('status', 'completed')->count(),
        ];

        $suppliers = Supplier::where('status', 'ACTIVE')
            ->select('id', 'name', 'supplier_number')
            ->get();

        return Inertia::render('Purchases/Index', [
            'purchases' => $purchases,
            'stats' => $stats,
            'suppliers' => $suppliers,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'amount' => 'required|numeric|min:0.01',
            'purchase_date' => 'required|date',
            'status' => 'required|in:pending,completed,cancelled',
            'supplier_id' => 'required|exists:suppliers,id',
            'payment_method' => 'nullable|in:cash,bank_transfer,check',
            'notes' => 'nullable|string',
        ]);

        $validated['purchase_number'] = 'PUR-' . str_pad((Purchase::count() + 1), 5, '0', STR_PAD_LEFT);

        $purchase = Purchase::create($validated);

        // إنشاء قيد محاسبي تلقائي
        if ($validated['status'] === 'completed') {
            $purchase->load('supplier');
            (new AccountingService())->onPurchaseCreated($purchase, $validated['payment_method'] ?? 'cash');
        }

        return redirect()->back()->with('success', 'تم تسجيل المشتريات بنجاح');
    }

    public function update(Request $request, string $id)
    {
        $purchase = Purchase::findOrFail($id);
        $oldStatus = $purchase->status;

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'amount' => 'required|numeric|min:0.01',
            'purchase_date' => 'required|date',
            'status' => 'required|in:pending,completed,cancelled',
            'supplier_id' => 'required|exists:suppliers,id',
            'payment_method' => 'nullable|in:cash,bank_transfer,check',
            'notes' => 'nullable|string',
        ]);

        $purchase->update($validated);

        // إنشاء قيد محاسبي إذا تغيرت الحالة إلى مكتمل
        if ($oldStatus !== 'completed' && $validated['status'] === 'completed') {
            $purchase->load('supplier');
            (new AccountingService())->onPurchaseCreated($purchase, $validated['payment_method'] ?? 'cash');
        }

        return redirect()->back()->with('success', 'تم تحديث المشتريات بنجاح');
    }

    public function destroy(string $id)
    {
        $purchase = Purchase::findOrFail($id);

        // حذف القيد المحاسبي المرتبط إذا كان مسودة
        (new AccountingService())->deleteRelatedEntry('purchase', $purchase->id);

        $purchase->delete();

        return redirect()->back()->with('success', 'تم حذف المشتريات بنجاح');
    }
}
