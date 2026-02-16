<?php

namespace Database\Seeders;

use App\Models\Account;
use Illuminate\Database\Seeder;

class AccountSeeder extends Seeder
{
    public function run(): void
    {
        $accounts = [
            // 1 - الموجودات (الأصول)
            ['code' => '1', 'name' => 'الموجودات', 'type' => 'asset', 'level' => 1, 'is_parent' => true, 'parent_code' => null],

            // 11 - الموجودات الثابتة
            ['code' => '11', 'name' => 'الموجودات الثابتة', 'type' => 'asset', 'level' => 2, 'is_parent' => true, 'parent_code' => '1'],

            // 111 - الأراضي
            ['code' => '111', 'name' => 'الأراضي', 'type' => 'asset', 'level' => 3, 'is_parent' => false, 'parent_code' => '11'],

            // 112 - مباني و انشاءات و مرافق و طرق
            ['code' => '112', 'name' => 'مباني و انشاءات و مرافق و طرق', 'type' => 'asset', 'level' => 3, 'is_parent' => true, 'parent_code' => '11'],
            ['code' => '1121', 'name' => 'عقار المحل', 'type' => 'asset', 'level' => 4, 'is_parent' => false, 'parent_code' => '112'],
            ['code' => '1122', 'name' => 'عقار المستودع', 'type' => 'asset', 'level' => 4, 'is_parent' => false, 'parent_code' => '112'],

            // 113 - آلات و تجهيزات
            ['code' => '113', 'name' => 'آلات و تجهيزات', 'type' => 'asset', 'level' => 3, 'is_parent' => true, 'parent_code' => '11'],
            ['code' => '1131', 'name' => 'آلات و تجهيزات مراكز الانتاج', 'type' => 'asset', 'level' => 4, 'is_parent' => false, 'parent_code' => '113'],
            ['code' => '1132', 'name' => 'آلات و تجهيزات مراكز الخدمات', 'type' => 'asset', 'level' => 4, 'is_parent' => false, 'parent_code' => '113'],

            // 114 - وسائل نقل و انتقال
            ['code' => '114', 'name' => 'وسائل نقل و انتقال', 'type' => 'asset', 'level' => 3, 'is_parent' => true, 'parent_code' => '11'],
            ['code' => '1141', 'name' => 'سيارة نقل', 'type' => 'asset', 'level' => 4, 'is_parent' => false, 'parent_code' => '114'],

            // 115 - عدد و أدوات و قوالب
            ['code' => '115', 'name' => 'عدد و أدوات و قوالب', 'type' => 'asset', 'level' => 3, 'is_parent' => false, 'parent_code' => '11'],

            // 116 - أثاث و معدات مكاتب
            ['code' => '116', 'name' => 'أثاث و معدات مكاتب', 'type' => 'asset', 'level' => 3, 'is_parent' => true, 'parent_code' => '11'],
            ['code' => '1161', 'name' => 'أثاث', 'type' => 'asset', 'level' => 4, 'is_parent' => false, 'parent_code' => '116'],
            ['code' => '1162', 'name' => 'آلات كتابية وحاسبية', 'type' => 'asset', 'level' => 4, 'is_parent' => true, 'parent_code' => '116'],
            ['code' => '11621', 'name' => 'آلة حاسبة CASO', 'type' => 'asset', 'level' => 5, 'is_parent' => false, 'parent_code' => '1162'],
            ['code' => '1163', 'name' => 'مهمات مكتبية', 'type' => 'asset', 'level' => 4, 'is_parent' => false, 'parent_code' => '116'],

            // 1164 - تركيبات
            ['code' => '1164', 'name' => 'تركيبات', 'type' => 'asset', 'level' => 4, 'is_parent' => true, 'parent_code' => '116'],
            ['code' => '11641', 'name' => 'هواتف باناسونيك', 'type' => 'asset', 'level' => 5, 'is_parent' => false, 'parent_code' => '1164'],
            ['code' => '11642', 'name' => 'هاتف لا سلكي فيلبس', 'type' => 'asset', 'level' => 5, 'is_parent' => false, 'parent_code' => '1164'],
            ['code' => '11643', 'name' => 'طاولة مكتب', 'type' => 'asset', 'level' => 5, 'is_parent' => false, 'parent_code' => '1164'],
            ['code' => '11644', 'name' => 'كراسي بلاستيك', 'type' => 'asset', 'level' => 5, 'is_parent' => false, 'parent_code' => '1164'],
            ['code' => '11645', 'name' => 'اجهزة انارة', 'type' => 'asset', 'level' => 5, 'is_parent' => false, 'parent_code' => '1164'],

            // 1165 - تجهيزات
            ['code' => '1165', 'name' => 'تجهيزات', 'type' => 'asset', 'level' => 4, 'is_parent' => false, 'parent_code' => '116'],

            // 1166 - كمبيوتر
            ['code' => '1166', 'name' => 'كمبيوتر', 'type' => 'asset', 'level' => 4, 'is_parent' => true, 'parent_code' => '116'],
            ['code' => '11661', 'name' => 'قيمة جهاز الكمبيوتر', 'type' => 'asset', 'level' => 5, 'is_parent' => false, 'parent_code' => '1166'],
            ['code' => '11662', 'name' => 'قيمة برنامج الاداري', 'type' => 'asset', 'level' => 5, 'is_parent' => false, 'parent_code' => '1166'],
            ['code' => '11663', 'name' => 'قيمة الطابعة', 'type' => 'asset', 'level' => 5, 'is_parent' => false, 'parent_code' => '1166'],

            // 117 - بدر ماء رامكو
            ['code' => '117', 'name' => 'بدر ماء رامكو', 'type' => 'asset', 'level' => 3, 'is_parent' => false, 'parent_code' => '11'],

            // 118 - مروحة
            ['code' => '118', 'name' => 'مروحة', 'type' => 'asset', 'level' => 3, 'is_parent' => false, 'parent_code' => '11'],

            // 119 - تلفزيون LG
            ['code' => '119', 'name' => 'تلفزيون LG', 'type' => 'asset', 'level' => 3, 'is_parent' => false, 'parent_code' => '11'],

            // 12 - الموجودات المتداولة
            ['code' => '12', 'name' => 'الموجودات المتداولة', 'type' => 'asset', 'level' => 2, 'is_parent' => true, 'parent_code' => '1'],
            ['code' => '121', 'name' => 'النقدية (الصندوق)', 'type' => 'asset', 'level' => 3, 'is_parent' => false, 'parent_code' => '12'],
            ['code' => '122', 'name' => 'البنك', 'type' => 'asset', 'level' => 3, 'is_parent' => false, 'parent_code' => '12'],
            ['code' => '123', 'name' => 'العملاء (المدينون)', 'type' => 'asset', 'level' => 3, 'is_parent' => false, 'parent_code' => '12'],
            ['code' => '124', 'name' => 'المخزون', 'type' => 'asset', 'level' => 3, 'is_parent' => false, 'parent_code' => '12'],
            ['code' => '125', 'name' => 'مصروفات مدفوعة مقدماً', 'type' => 'asset', 'level' => 3, 'is_parent' => false, 'parent_code' => '12'],

            // 2 - الالتزامات
            ['code' => '2', 'name' => 'الالتزامات', 'type' => 'liability', 'level' => 1, 'is_parent' => true, 'parent_code' => null],
            ['code' => '21', 'name' => 'الالتزامات المتداولة', 'type' => 'liability', 'level' => 2, 'is_parent' => true, 'parent_code' => '2'],
            ['code' => '211', 'name' => 'الموردون (الدائنون)', 'type' => 'liability', 'level' => 3, 'is_parent' => false, 'parent_code' => '21'],
            ['code' => '212', 'name' => 'مستحقات الموظفين', 'type' => 'liability', 'level' => 3, 'is_parent' => false, 'parent_code' => '21'],
            ['code' => '213', 'name' => 'إيرادات مقبوضة مقدماً', 'type' => 'liability', 'level' => 3, 'is_parent' => false, 'parent_code' => '21'],
            ['code' => '214', 'name' => 'ضرائب مستحقة', 'type' => 'liability', 'level' => 3, 'is_parent' => false, 'parent_code' => '21'],
            ['code' => '22', 'name' => 'الالتزامات طويلة الأجل', 'type' => 'liability', 'level' => 2, 'is_parent' => true, 'parent_code' => '2'],
            ['code' => '221', 'name' => 'قروض طويلة الأجل', 'type' => 'liability', 'level' => 3, 'is_parent' => false, 'parent_code' => '22'],

            // 3 - حقوق الملكية
            ['code' => '3', 'name' => 'حقوق الملكية', 'type' => 'equity', 'level' => 1, 'is_parent' => true, 'parent_code' => null],
            ['code' => '31', 'name' => 'رأس المال', 'type' => 'equity', 'level' => 2, 'is_parent' => false, 'parent_code' => '3'],
            ['code' => '32', 'name' => 'الأرباح المحتجزة', 'type' => 'equity', 'level' => 2, 'is_parent' => false, 'parent_code' => '3'],
            ['code' => '33', 'name' => 'أرباح / خسائر العام', 'type' => 'equity', 'level' => 2, 'is_parent' => false, 'parent_code' => '3'],

            // 4 - الإيرادات
            ['code' => '4', 'name' => 'الإيرادات', 'type' => 'revenue', 'level' => 1, 'is_parent' => true, 'parent_code' => null],
            ['code' => '41', 'name' => 'إيرادات العقود', 'type' => 'revenue', 'level' => 2, 'is_parent' => false, 'parent_code' => '4'],
            ['code' => '42', 'name' => 'إيرادات تأجير السقالات', 'type' => 'revenue', 'level' => 2, 'is_parent' => false, 'parent_code' => '4'],
            ['code' => '43', 'name' => 'إيرادات أخرى', 'type' => 'revenue', 'level' => 2, 'is_parent' => false, 'parent_code' => '4'],

            // 5 - المصروفات
            ['code' => '5', 'name' => 'المصروفات', 'type' => 'expense', 'level' => 1, 'is_parent' => true, 'parent_code' => null],
            ['code' => '51', 'name' => 'الرواتب والأجور', 'type' => 'expense', 'level' => 2, 'is_parent' => false, 'parent_code' => '5'],
            ['code' => '52', 'name' => 'مصروفات تشغيلية', 'type' => 'expense', 'level' => 2, 'is_parent' => true, 'parent_code' => '5'],
            ['code' => '521', 'name' => 'مصروفات النقل', 'type' => 'expense', 'level' => 3, 'is_parent' => false, 'parent_code' => '52'],
            ['code' => '522', 'name' => 'مصروفات الصيانة', 'type' => 'expense', 'level' => 3, 'is_parent' => false, 'parent_code' => '52'],
            ['code' => '523', 'name' => 'مصروفات الوقود', 'type' => 'expense', 'level' => 3, 'is_parent' => false, 'parent_code' => '52'],
            ['code' => '53', 'name' => 'مصروفات إدارية', 'type' => 'expense', 'level' => 2, 'is_parent' => true, 'parent_code' => '5'],
            ['code' => '531', 'name' => 'إيجار المكتب', 'type' => 'expense', 'level' => 3, 'is_parent' => false, 'parent_code' => '53'],
            ['code' => '532', 'name' => 'مصروفات الاتصالات', 'type' => 'expense', 'level' => 3, 'is_parent' => false, 'parent_code' => '53'],
            ['code' => '533', 'name' => 'مصروفات مكتبية', 'type' => 'expense', 'level' => 3, 'is_parent' => false, 'parent_code' => '53'],
            ['code' => '54', 'name' => 'مصروفات الإهلاك', 'type' => 'expense', 'level' => 2, 'is_parent' => false, 'parent_code' => '5'],
            ['code' => '55', 'name' => 'مصروفات المشتريات', 'type' => 'expense', 'level' => 2, 'is_parent' => false, 'parent_code' => '5'],
        ];

        // إنشاء الحسابات بالترتيب (الآباء أولاً)
        $createdAccounts = [];
        foreach ($accounts as $accountData) {
            $parentCode = $accountData['parent_code'];
            unset($accountData['parent_code']);

            if ($parentCode && isset($createdAccounts[$parentCode])) {
                $accountData['parent_id'] = $createdAccounts[$parentCode]->id;
            }

            $account = Account::create($accountData);
            $createdAccounts[$account->code] = $account;
        }
    }
}
