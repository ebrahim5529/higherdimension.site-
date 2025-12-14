<?php

namespace Database\Seeders;

use App\Models\Supplier;
use Illuminate\Database\Seeder;

class SupplierSeeder extends Seeder
{
    public function run(): void
    {
        $suppliers = [
            [
                'supplier_number' => 'SUPP-001',
                'name' => 'شركة المعدات الصناعية المتقدمة',
                'email' => 'info@advancedequipment.om',
                'phone' => '+96891234567',
                'address' => 'مسقط، سلطنة عمان',
                'nationality' => 'عماني',
                'supplier_type' => 'COMPANY',
                'commercial_record' => 'CR-123456',
                'tax_number' => 'TAX-123456',
                'status' => 'ACTIVE',
                'registration_date' => '2023-01-15',
                'contact_person' => 'أحمد محمد العلي',
                'contact_person_phone' => '+96891234568',
                'contact_person_email' => 'ahmed.ali@advancedequipment.om',
                'bank_name' => 'بنك مسقط',
                'bank_account' => '1234567890',
                'iban' => 'OM12345678901234567890',
                'swift_code' => 'MUSCATMXXX',
                'notes' => 'مورد موثوق للمعدات الصناعية',
                'rating' => 5,
            ],
            [
                'supplier_number' => 'SUPP-002',
                'name' => 'محمد سالم الحارثي',
                'email' => 'mohammed.harithi@email.com',
                'phone' => '+96824567890',
                'address' => 'الرستاق، سلطنة عمان',
                'nationality' => 'عماني',
                'supplier_type' => 'INDIVIDUAL',
                'id_number' => '1234567890',
                'status' => 'ACTIVE',
                'registration_date' => '2023-02-20',
                'contact_person' => 'محمد سالم الحارثي',
                'contact_person_phone' => '+96824567890',
                'contact_person_email' => 'mohammed.harithi@email.com',
                'bank_name' => 'البنك الوطني العماني',
                'bank_account' => '0987654321',
                'iban' => 'OM09876543210987654321',
                'swift_code' => 'NBOMOMRU',
                'notes' => 'مورد للمواد الخام',
                'rating' => 4,
            ],
            [
                'supplier_number' => 'SUPP-003',
                'name' => 'شركة الخدمات التقنية',
                'email' => 'contact@techservices.om',
                'phone' => '+96837890123',
                'address' => 'صلالة، سلطنة عمان',
                'nationality' => 'عماني',
                'supplier_type' => 'COMPANY',
                'commercial_record' => 'CR-789012',
                'tax_number' => 'TAX-789012',
                'status' => 'ACTIVE',
                'registration_date' => '2023-03-10',
                'contact_person' => 'فاطمة أحمد الكندي',
                'contact_person_phone' => '+96837890124',
                'contact_person_email' => 'fatima.kindi@techservices.om',
                'bank_name' => 'بنك عمان العربي',
                'bank_account' => '1122334455',
                'iban' => 'OM11223344551122334455',
                'swift_code' => 'BOAOMRU',
                'notes' => 'خدمات تقنية وبرمجيات',
                'rating' => 4,
            ],
            [
                'supplier_number' => 'SUPP-004',
                'name' => 'خالد عبدالله الشنفري',
                'email' => 'khalid.shanfari@email.com',
                'phone' => '+96845678901',
                'address' => 'نزوى، سلطنة عمان',
                'nationality' => 'عماني',
                'supplier_type' => 'INDIVIDUAL',
                'id_number' => '2233445566',
                'status' => 'SUSPENDED',
                'registration_date' => '2022-12-05',
                'contact_person' => 'خالد عبدالله الشنفري',
                'contact_person_phone' => '+96845678901',
                'contact_person_email' => 'khalid.shanfari@email.com',
                'bank_name' => 'البنك الوطني العماني',
                'bank_account' => '2233445566',
                'iban' => 'OM2233445566789012345678',
                'swift_code' => 'NBOAOMRX',
                'notes' => 'مورد للمواد الغذائية',
                'rating' => 2,
            ],
            [
                'supplier_number' => 'SUPP-005',
                'name' => 'شركة النقل السريع',
                'email' => 'info@fasttransport.om',
                'phone' => '+96856789012',
                'address' => 'صور، سلطنة عمان',
                'nationality' => 'عماني',
                'supplier_type' => 'COMPANY',
                'commercial_record' => 'CR-345678',
                'tax_number' => 'TAX-345678',
                'status' => 'ACTIVE',
                'registration_date' => '2023-04-15',
                'contact_person' => 'عبدالرحمن سالم البوسعيدي',
                'contact_person_phone' => '+96856789013',
                'contact_person_email' => 'abdulrahman.busaidi@fasttransport.om',
                'bank_name' => 'بنك مسقط',
                'bank_account' => '3344556677',
                'iban' => 'OM33445566773344556677',
                'swift_code' => 'MUSCATMXXX',
                'notes' => 'خدمات النقل والشحن',
                'rating' => 4,
            ],
        ];

        foreach ($suppliers as $supplier) {
            Supplier::firstOrCreate(
                ['supplier_number' => $supplier['supplier_number']],
                $supplier
            );
        }

        $this->command->info('✅ تم إنشاء ' . count($suppliers) . ' مورد بنجاح!');
    }
}
