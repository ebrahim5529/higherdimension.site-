<?php

namespace Database\Seeders;

use App\Models\Employee;
use Illuminate\Database\Seeder;

class EmployeeSeeder extends Seeder
{
    public function run(): void
    {
        $employees = [
            [
                'name' => 'أحمد محمد العلي',
                'email' => 'ahmed.ali@company.com',
                'phone' => '+96891234567',
                'position' => 'مدير عام',
                'department' => 'الإدارة',
                'salary' => 5000.00,
                'hire_date' => '2023-01-15',
                'status' => 'ACTIVE',
            ],
            [
                'name' => 'فاطمة سالم الحارثي',
                'email' => 'fatima.harithi@company.com',
                'phone' => '+96824567890',
                'position' => 'محاسبة',
                'department' => 'المحاسبة',
                'salary' => 2500.00,
                'hire_date' => '2023-02-20',
                'status' => 'ACTIVE',
            ],
            [
                'name' => 'خالد عبدالله الشنفري',
                'email' => 'khalid.shanfari@company.com',
                'phone' => '+96837890123',
                'position' => 'مندوب مبيعات',
                'department' => 'المبيعات',
                'salary' => 2000.00,
                'hire_date' => '2023-03-10',
                'status' => 'ACTIVE',
            ],
        ];

        foreach ($employees as $employee) {
            Employee::create($employee);
        }

        $this->command->info('✅ تم إنشاء ' . count($employees) . ' موظف بنجاح!');
    }
}
