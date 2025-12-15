<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Scaffold;
use Illuminate\Http\Request;
use Inertia\Inertia;

class InventoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $scaffolds = Scaffold::with('supplier')
            ->get()
            ->map(function ($scaffold) {
                $size = is_array($scaffold->size) ? $scaffold->size : json_decode($scaffold->size ?? '{}', true);
                return [
                    'id' => $scaffold->id,
                    'scaffoldNumber' => $scaffold->scaffold_number,
                    'type' => $scaffold->type,
                    'size' => $size ? sprintf('%sx%sx%s متر', $size['height'] ?? 0, $size['width'] ?? 0, $size['length'] ?? 0) : '0x0x0 متر',
                    'height' => $size['height'] ?? 0,
                    'width' => $size['width'] ?? 0,
                    'length' => $size['length'] ?? 0,
                    'material' => $scaffold->material,
                    'condition' => $scaffold->condition,
                    'status' => $scaffold->status,
                    'quantity' => $scaffold->quantity,
                    'availableQuantity' => $scaffold->available_quantity,
                    'location' => $scaffold->location,
                    'warehouseLocation' => $scaffold->warehouse_location,
                    'sellingPrice' => $scaffold->selling_price,
                    'dailyRentalPrice' => $scaffold->daily_rental_price,
                    'monthlyRentalPrice' => $scaffold->monthly_rental_price,
                    'entryDate' => $scaffold->entry_date?->format('Y-m-d'),
                    'lastMaintenanceDate' => $scaffold->last_maintenance_date?->format('Y-m-d'),
                    'nextMaintenanceDate' => $scaffold->next_maintenance_date?->format('Y-m-d'),
                    'descriptionAr' => $scaffold->description_ar,
                    'descriptionEn' => $scaffold->description_en,
                    'notes' => $scaffold->notes,
                    'supplierName' => $scaffold->supplier?->name,
                    'supplierId' => $scaffold->supplier_id,
                    'hasImages' => false, // سيتم إضافتها لاحقاً
                    'hasAttachments' => false, // سيتم إضافتها لاحقاً
                    'createdAt' => $scaffold->created_at?->format('Y-m-d H:i:s'),
                    'updatedAt' => $scaffold->updated_at?->format('Y-m-d H:i:s'),
                ];
            });

        // إحصائيات المخزون
        $totalScaffolds = Scaffold::count();
        $availableScaffolds = Scaffold::where('status', 'AVAILABLE')->count();
        $rentedScaffolds = Scaffold::where('status', 'RENTED')->count();
        $soldScaffolds = Scaffold::where('status', 'SOLD')->count();
        $maintenanceScaffolds = Scaffold::where('status', 'MAINTENANCE')->count();
        $reservedScaffolds = Scaffold::where('status', 'RESERVED')->count();

        // توزيع حسب النوع
        $typeDistribution = Scaffold::query()
            ->selectRaw('type, COUNT(*) as count')
            ->groupBy('type')
            ->pluck('count', 'type')
            ->toArray();

        // توزيع حسب المادة
        $materialDistribution = Scaffold::query()
            ->selectRaw('material, COUNT(*) as count')
            ->groupBy('material')
            ->pluck('count', 'material')
            ->toArray();

        // توزيع حسب الحالة
        $conditionDistribution = Scaffold::query()
            ->selectRaw('`condition`, COUNT(*) as count')
            ->groupBy('condition')
            ->pluck('count', 'condition')
            ->toArray();

        // السقالات التي تحتاج صيانة
        $maintenanceDueItems = Scaffold::whereNotNull('next_maintenance_date')
            ->where('next_maintenance_date', '<=', now()->addDays(30))
            ->count();

        $stats = [
            'totalScaffolds' => $totalScaffolds,
            'availableScaffolds' => $availableScaffolds,
            'rentedScaffolds' => $rentedScaffolds,
            'soldScaffolds' => $soldScaffolds,
            'maintenanceScaffolds' => $maintenanceScaffolds,
            'reservedScaffolds' => $reservedScaffolds,
            'totalValue' => 0, // سيتم حسابه لاحقاً
            'availableValue' => 0,
            'rentedValue' => 0,
            'soldValue' => 0,
            'maintenanceValue' => 0,
            'lowStockItems' => 0,
            'maintenanceDueItems' => $maintenanceDueItems,
            'typeDistribution' => $typeDistribution,
            'materialDistribution' => $materialDistribution,
            'conditionDistribution' => $conditionDistribution,
            'statusDistribution' => [
                'AVAILABLE' => $availableScaffolds,
                'RENTED' => $rentedScaffolds,
                'SOLD' => $soldScaffolds,
                'MAINTENANCE' => $maintenanceScaffolds,
                'RESERVED' => $reservedScaffolds,
            ],
            'monthlyAdditions' => [],
            'monthlyRentals' => [],
            'monthlySales' => [],
        ];

        return Inertia::render('Inventory/Index', [
            'scaffolds' => $scaffolds,
            'stats' => $stats,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $suppliers = \App\Models\Supplier::select('id', 'name')->get();
        return Inertia::render('Inventory/Create', [
            'suppliers' => $suppliers,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // تحويل camelCase إلى snake_case
        $requestData = $request->all();
        if (isset($requestData['scaffoldNumber'])) {
            $requestData['scaffold_number'] = $requestData['scaffoldNumber'];
        }
        if (isset($requestData['availableQuantity'])) {
            $requestData['available_quantity'] = $requestData['availableQuantity'];
        }
        if (isset($requestData['sellingPrice'])) {
            $requestData['selling_price'] = $requestData['sellingPrice'];
        }
        if (isset($requestData['dailyRentalPrice'])) {
            $requestData['daily_rental_price'] = $requestData['dailyRentalPrice'];
        }
        if (isset($requestData['monthlyRentalPrice'])) {
            $requestData['monthly_rental_price'] = $requestData['monthlyRentalPrice'];
        }
        if (isset($requestData['entryDate'])) {
            $requestData['entry_date'] = $requestData['entryDate'];
        }
        if (isset($requestData['lastMaintenanceDate'])) {
            $requestData['last_maintenance_date'] = $requestData['lastMaintenanceDate'];
        }
        if (isset($requestData['nextMaintenanceDate'])) {
            $requestData['next_maintenance_date'] = $requestData['nextMaintenanceDate'];
        }
        if (isset($requestData['descriptionAr'])) {
            $requestData['description_ar'] = $requestData['descriptionAr'];
        }
        if (isset($requestData['descriptionEn'])) {
            $requestData['description_en'] = $requestData['descriptionEn'];
        }
        if (isset($requestData['warehouseLocation'])) {
            $requestData['warehouse_location'] = $requestData['warehouseLocation'];
        }
        if (isset($requestData['supplierId'])) {
            $requestData['supplier_id'] = $requestData['supplierId'];
        }

        $request->merge($requestData);

        $validated = $request->validate([
            'scaffold_number' => 'required|string|unique:scaffolds,scaffold_number|max:255',
            'quantity' => 'required|integer|min:1',
            'description_ar' => 'required|string|max:500',
            'description_en' => 'required|string|max:500',
            'daily_rental_price' => 'required|numeric|min:0',
            'monthly_rental_price' => 'required|numeric|min:0',
            // حقول اختيارية
            'type' => 'nullable|in:FIXED,MOBILE,TOWER,CANTILEVER,SUSPENDED',
            'size' => 'nullable|array',
            'size.height' => 'nullable|numeric|min:0|max:100',
            'size.width' => 'nullable|numeric|min:0|max:100',
            'size.length' => 'nullable|numeric|min:0|max:100',
            'material' => 'nullable|in:STEEL,ALUMINUM,WOOD,COMPOSITE',
            'condition' => 'nullable|in:NEW,USED,REFURBISHED',
            'status' => 'nullable|in:AVAILABLE,RENTED,SOLD,MAINTENANCE,RESERVED',
            'available_quantity' => 'nullable|integer|min:0',
            'location' => 'nullable|string|max:255',
            'warehouse_location' => 'nullable|string|max:255',
            'selling_price' => 'nullable|numeric|min:0',
            'entry_date' => 'nullable|date',
            'last_maintenance_date' => 'nullable|date',
            'next_maintenance_date' => 'nullable|date',
            'notes' => 'nullable|string',
            'supplier_id' => 'nullable|exists:suppliers,id',
        ]);

        // تعيين القيم الافتراضية
        $dataToCreate = [
            'scaffold_number' => $validated['scaffold_number'],
            'quantity' => $validated['quantity'],
            'available_quantity' => $validated['available_quantity'] ?? $validated['quantity'],
            'description_ar' => $validated['description_ar'],
            'description_en' => $validated['description_en'],
            'daily_rental_price' => $validated['daily_rental_price'],
            'monthly_rental_price' => $validated['monthly_rental_price'],
            'type' => $validated['type'] ?? 'FIXED',
            'material' => $validated['material'] ?? 'STEEL',
            'condition' => $validated['condition'] ?? 'NEW',
            'status' => $validated['status'] ?? 'AVAILABLE',
            'location' => $validated['location'] ?? null,
            'warehouse_location' => $validated['warehouse_location'] ?? null,
            'selling_price' => $validated['selling_price'] ?? 0,
            'entry_date' => $validated['entry_date'] ?? now(),
            'last_maintenance_date' => $validated['last_maintenance_date'] ?? null,
            'next_maintenance_date' => $validated['next_maintenance_date'] ?? null,
            'notes' => $validated['notes'] ?? null,
            'supplier_id' => $validated['supplier_id'] ?? null,
        ];

        // تحويل size إلى JSON إذا كان array
        if (isset($validated['size']) && is_array($validated['size'])) {
            $dataToCreate['size'] = json_encode($validated['size']);
        } else {
            $dataToCreate['size'] = json_encode(['height' => 0, 'width' => 0, 'length' => 0]);
        }

        $scaffold = Scaffold::create($dataToCreate);

        return redirect()->route('inventory.index')
            ->with('success', 'تم إضافة المعدة بنجاح');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $scaffold = Scaffold::with('supplier')->findOrFail($id);
        $size = is_array($scaffold->size) ? $scaffold->size : json_decode($scaffold->size ?? '{}', true);

        return Inertia::render('Inventory/Show', [
            'scaffold' => [
                'id' => $scaffold->id,
                'scaffoldNumber' => $scaffold->scaffold_number,
                'type' => $scaffold->type,
                'size' => $size,
                'material' => $scaffold->material,
                'condition' => $scaffold->condition,
                'status' => $scaffold->status,
                'quantity' => $scaffold->quantity,
                'availableQuantity' => $scaffold->available_quantity,
                'location' => $scaffold->location,
                'warehouseLocation' => $scaffold->warehouse_location,
                'sellingPrice' => $scaffold->selling_price,
                'dailyRentalPrice' => $scaffold->daily_rental_price,
                'monthlyRentalPrice' => $scaffold->monthly_rental_price,
                'entryDate' => $scaffold->entry_date?->format('Y-m-d'),
                'lastMaintenanceDate' => $scaffold->last_maintenance_date?->format('Y-m-d'),
                'nextMaintenanceDate' => $scaffold->next_maintenance_date?->format('Y-m-d'),
                'descriptionAr' => $scaffold->description_ar,
                'descriptionEn' => $scaffold->description_en,
                'notes' => $scaffold->notes,
                'supplier' => $scaffold->supplier ? [
                    'id' => $scaffold->supplier->id,
                    'name' => $scaffold->supplier->name,
                ] : null,
                'createdAt' => $scaffold->created_at?->format('Y-m-d H:i:s'),
                'updatedAt' => $scaffold->updated_at?->format('Y-m-d H:i:s'),
            ],
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $scaffold = Scaffold::with('supplier')->findOrFail($id);
        $size = is_array($scaffold->size) ? $scaffold->size : json_decode($scaffold->size ?? '{}', true);
        $suppliers = \App\Models\Supplier::select('id', 'name')->get();

        return Inertia::render('Inventory/Edit', [
            'scaffold' => [
                'id' => $scaffold->id,
                'scaffoldNumber' => $scaffold->scaffold_number,
                'quantity' => $scaffold->quantity,
                'descriptionAr' => $scaffold->description_ar,
                'descriptionEn' => $scaffold->description_en,
                'dailyRentalPrice' => $scaffold->daily_rental_price,
                'monthlyRentalPrice' => $scaffold->monthly_rental_price,
                'status' => $scaffold->status,
            ],
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $scaffold = Scaffold::findOrFail($id);

        $validated = $request->validate([
            'scaffold_number' => 'required|string|unique:scaffolds,scaffold_number,'.$id.'|max:255',
            'quantity' => 'required|integer|min:1',
            'description_ar' => 'required|string|max:500',
            'description_en' => 'required|string|max:500',
            'daily_rental_price' => 'required|numeric|min:0',
            'monthly_rental_price' => 'required|numeric|min:0',
            'status' => 'required|in:AVAILABLE,RENTED,SOLD,MAINTENANCE,RESERVED',
        ]);

        // تحويل size إلى JSON إذا كان array
        if (isset($validated['size']) && is_array($validated['size'])) {
            $validated['size'] = json_encode($validated['size']);
        }

        // تحديث الحقول الأساسية
        $scaffold->update([
            'scaffold_number' => $validated['scaffold_number'],
            'quantity' => $validated['quantity'],
            'description_ar' => $validated['description_ar'],
            'description_en' => $validated['description_en'],
            'daily_rental_price' => $validated['daily_rental_price'],
            'monthly_rental_price' => $validated['monthly_rental_price'],
            'status' => $validated['status'],
        ]);

        return redirect()->route('inventory.index')
            ->with('success', 'تم تحديث المعدة بنجاح');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $scaffold = Scaffold::findOrFail($id);
        $scaffold->delete();

        return redirect()->route('inventory.index')
            ->with('success', 'تم حذف المعدة بنجاح');
    }

    /**
     * Get inventory statistics
     */
    public function stats()
    {
        $totalScaffolds = Scaffold::count();
        $availableScaffolds = Scaffold::where('status', 'AVAILABLE')->count();
        $rentedScaffolds = Scaffold::where('status', 'RENTED')->count();
        $soldScaffolds = Scaffold::where('status', 'SOLD')->count();
        $maintenanceScaffolds = Scaffold::where('status', 'MAINTENANCE')->count();
        $reservedScaffolds = Scaffold::where('status', 'RESERVED')->count();

        return response()->json([
            'success' => true,
            'data' => [
                'total' => $totalScaffolds,
                'available' => $availableScaffolds,
                'rented' => $rentedScaffolds,
                'sold' => $soldScaffolds,
                'maintenance' => $maintenanceScaffolds,
                'reserved' => $reservedScaffolds,
                'needs_maintenance' => Scaffold::whereNotNull('next_maintenance_date')
                    ->where('next_maintenance_date', '<=', now()->addDays(30))
                    ->count(),
                'by_type' => Scaffold::query()
                    ->selectRaw('type, COUNT(*) as count')
                    ->groupBy('type')
                    ->get()
                    ->map(fn($item) => ['type' => $item->type, 'count' => $item->count]),
                'by_material' => Scaffold::query()
                    ->selectRaw('material, COUNT(*) as count')
                    ->groupBy('material')
                    ->get()
                    ->map(fn($item) => ['material' => $item->material, 'count' => $item->count]),
                'by_condition' => Scaffold::query()
                    ->selectRaw('condition, COUNT(*) as count')
                    ->groupBy('condition')
                    ->get()
                    ->map(fn($item) => ['condition' => $item->condition, 'count' => $item->count]),
            ],
        ]);
    }
}
