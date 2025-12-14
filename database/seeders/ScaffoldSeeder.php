<?php

namespace Database\Seeders;

use App\Models\Scaffold;
use App\Models\Supplier;
use Illuminate\Database\Seeder;

class ScaffoldSeeder extends Seeder
{
    public function run(): void
    {
        $suppliers = Supplier::all();
        $supplierIds = $suppliers->pluck('id')->toArray();

        $scaffolds = [
            [
                'scaffold_number' => 'SCF-001',
                'type' => 'FIXED',
                'size' => json_encode(['height' => 3, 'width' => 2, 'length' => 1]),
                'material' => 'STEEL',
                'condition' => 'NEW',
                'status' => 'AVAILABLE',
                'quantity' => 50,
                'available_quantity' => 45,
                'location' => 'المخزن الرئيسي',
                'warehouse_location' => 'المنطقة أ - الرف 1',
                'selling_price' => 2500,
                'daily_rental_price' => 50,
                'monthly_rental_price' => 1200,
                'entry_date' => '2023-01-15',
                'last_maintenance_date' => '2023-11-01',
                'next_maintenance_date' => '2024-02-01',
                'description_ar' => 'سقالة مثبتة عالية الجودة',
                'description_en' => 'High quality fixed scaffold',
                'notes' => 'سقالة مثبتة عالية الجودة',
                'supplier_id' => $supplierIds[0] ?? null,
            ],
            [
                'scaffold_number' => 'SCF-002',
                'type' => 'MOBILE',
                'size' => json_encode(['height' => 2.5, 'width' => 1.5, 'length' => 0.8]),
                'material' => 'ALUMINUM',
                'condition' => 'USED',
                'status' => 'RENTED',
                'quantity' => 30,
                'available_quantity' => 25,
                'location' => 'المخزن الفرعي',
                'warehouse_location' => 'المنطقة ب - الرف 2',
                'selling_price' => 1800,
                'daily_rental_price' => 35,
                'monthly_rental_price' => 800,
                'entry_date' => '2023-02-20',
                'last_maintenance_date' => '2023-10-15',
                'next_maintenance_date' => '2024-01-15',
                'description_ar' => 'سقالة متحركة خفيفة الوزن',
                'description_en' => 'Lightweight mobile scaffold',
                'notes' => 'سقالة متحركة خفيفة الوزن',
                'supplier_id' => $supplierIds[1] ?? null,
            ],
            [
                'scaffold_number' => 'SCF-003',
                'type' => 'TOWER',
                'size' => json_encode(['height' => 4, 'width' => 2.5, 'length' => 1.2]),
                'material' => 'STEEL',
                'condition' => 'NEW',
                'status' => 'MAINTENANCE',
                'quantity' => 20,
                'available_quantity' => 18,
                'location' => 'المخزن الرئيسي',
                'warehouse_location' => 'المنطقة ج - الرف 3',
                'selling_price' => 3200,
                'daily_rental_price' => 65,
                'monthly_rental_price' => 1500,
                'entry_date' => '2023-03-10',
                'last_maintenance_date' => '2023-12-01',
                'next_maintenance_date' => '2024-03-01',
                'description_ar' => 'سقالة برجية للاستخدام في المباني العالية',
                'description_en' => 'Tower scaffold for high-rise buildings',
                'notes' => 'سقالة برجية للاستخدام في المباني العالية',
                'supplier_id' => $supplierIds[0] ?? null,
            ],
            [
                'scaffold_number' => 'SCF-004',
                'type' => 'CANTILEVER',
                'size' => json_encode(['height' => 2, 'width' => 3, 'length' => 0.5]),
                'material' => 'ALUMINUM',
                'condition' => 'REFURBISHED',
                'status' => 'SOLD',
                'quantity' => 15,
                'available_quantity' => 0,
                'location' => 'المخزن الفرعي',
                'warehouse_location' => 'المنطقة د - الرف 4',
                'selling_price' => 2200,
                'daily_rental_price' => 45,
                'monthly_rental_price' => 1000,
                'entry_date' => '2023-04-05',
                'last_maintenance_date' => '2023-09-20',
                'next_maintenance_date' => '2024-01-20',
                'description_ar' => 'سقالة كابولية معاد تأهيلها',
                'description_en' => 'Refurbished cantilever scaffold',
                'notes' => 'سقالة كابولية معاد تأهيلها',
                'supplier_id' => $supplierIds[2] ?? null,
            ],
            [
                'scaffold_number' => 'SCF-005',
                'type' => 'SUSPENDED',
                'size' => json_encode(['height' => 1.5, 'width' => 2, 'length' => 0.6]),
                'material' => 'STEEL',
                'condition' => 'NEW',
                'status' => 'RESERVED',
                'quantity' => 25,
                'available_quantity' => 20,
                'location' => 'المخزن الرئيسي',
                'warehouse_location' => 'المنطقة ه - الرف 5',
                'selling_price' => 2800,
                'daily_rental_price' => 55,
                'monthly_rental_price' => 1300,
                'entry_date' => '2023-05-12',
                'last_maintenance_date' => '2023-11-15',
                'next_maintenance_date' => '2024-02-15',
                'description_ar' => 'سقالة معلقة للاستخدام في الواجهات',
                'description_en' => 'Suspended scaffold for facades',
                'notes' => 'سقالة معلقة للاستخدام في الواجهات',
                'supplier_id' => $supplierIds[0] ?? null,
            ],
        ];

        foreach ($scaffolds as $scaffold) {
            Scaffold::firstOrCreate(
                ['scaffold_number' => $scaffold['scaffold_number']],
                $scaffold
            );
        }

        $this->command->info('✅ تم إنشاء ' . count($scaffolds) . ' معدة بنجاح!');
    }
}
