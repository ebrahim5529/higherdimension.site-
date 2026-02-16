<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RolesAndPermissionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // إنشاء صلاحيات لكل قائمة في لوحة التحكم
        $menuPermissions = [
            // الرئيسية
            'access-main-dashboard',
            // لوحة التحكم والتقارير
            'access-dashboard-reports',
            'access-dashboard-interactive',
            'access-financial-reports',
            'access-operations-reports',
            'access-customer-reports',
            // إدارة العملاء
            'access-customers',
            'manage-customers',
            'view-customer-contracts',
            'manage-customer-claims',
            // إدارة الموردين
            'access-suppliers',
            'manage-suppliers',
            'view-supplier-invoices',
            'manage-supplier-purchases',
            // إدارة المخزون
            'access-inventory',
            'manage-inventory',
            'purchase-equipment',
            'manage-purchases',
            // إدارة العقود والاتفاقيات
            'access-contracts',
            'manage-contracts',
            'view-active-contracts',
            'view-expired-contracts',
            'view-cancelled-contracts',
            // إدارة التشغيل والنقليات
            'access-operations',
            'manage-delivery-orders',
            'track-shipping',
            'manage-delivery-receipt',
            'manage-return-inspection',
            // إدارة المالية
            'access-financial',
            'manage-payment-transactions',
            'manage-purchases',
            'manage-invoices',
            'view-financial-reports',
            // إدارة الموظفين
            'access-employees',
            'manage-employees',
            'manage-salaries',
            'manage-incentives',
            'manage-attendance',
            'manage-departments',
            'manage-leaves',
            // إدارة الصلاحيات
            'access-permissions',
            'manage-user-roles',
            'manage-permission-groups',
            'manage-roles',
            // المدفوعات
            'access-payments',
            'view-all-payments',
            'view-late-payments',
            'view-payment-reports',
            // الإعدادات
            'access-settings',
            'manage-electronic-signature',
            // المحاسبة
            'access-accounting',
            'manage-chart-of-accounts',
            'manage-journal-entries',
            'view-accounting-reports',
        ];

        foreach ($menuPermissions as $permission) {
            Permission::firstOrCreate([
                'name' => $permission,
                'guard_name' => 'web',
            ]);
        }

        // إنشاء الأدوار الأساسية
        $adminRole = Role::firstOrCreate([
            'name' => 'admin',
            'guard_name' => 'web',
        ]);

        $userRole = Role::firstOrCreate([
            'name' => 'user',
            'guard_name' => 'web',
        ]);

        // تعيين جميع الصلاحيات لدور المدير
        $adminRole->syncPermissions(Permission::all());

        // تعيين صلاحيات محدودة لدور المستخدم
        $userPermissions = Permission::whereIn('name', [
            'access-main-dashboard',
            'access-dashboard-reports',
        ])->get();

        if ($userPermissions->isNotEmpty()) {
            $userRole->syncPermissions($userPermissions);
        }

        // تعيين دور المدير للمستخدم الأول (إن وجد)
        $firstUser = User::first();
        if ($firstUser && ! $firstUser->hasRole('admin')) {
            $firstUser->assignRole('admin');
        }
    }
}
