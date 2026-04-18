<?php

namespace Database\Seeders;

use App\Models\CompanySignature;
use Illuminate\Database\Seeder;

class CompanySignatureSeeder extends Seeder
{
    public function run(): void
    {
        // التحقق من وجود توقيع نشط
        $existingSignature = CompanySignature::where('is_active', true)->first();

        if ($existingSignature) {
            $existingSignature->update([
                'company_name' => 'شركة البعد العالي',
                'signer_name' => 'اسحاق',
                'signer_title' => 'المدير العام',
                // يجب أن يكون تحت company-signatures/ فقط (انظر CompanySignature::allowedPublicDiskPath)
                'signature_path' => 'company-signatures/default_signature.png',
                'signature_data' => null,
                'is_active' => true,
            ]);
            $this->command->info('✅ تم تحديث بيانات التوقيع بنجاح');
        } else {
            CompanySignature::create([
                'company_name' => 'شركة البعد العالي',
                'signer_name' => 'اسحاق',
                'signer_title' => 'المدير العام',
                // يجب أن يكون تحت company-signatures/ فقط (انظر CompanySignature::allowedPublicDiskPath)
                'signature_path' => 'company-signatures/default_signature.png',
                'signature_data' => null,
                'is_active' => true,
            ]);
            $this->command->info('✅ تم إضافة بيانات التوقيع بنجاح');
        }

        $this->command->info('📝 البيانات المضافة:');
        $this->command->info('   - اسم الشركة: شركة البعد العالي');
        $this->command->info('   - اسم المدير: اسحاق');
        $this->command->info('   - المنصب: المدير العام');
    }
}
