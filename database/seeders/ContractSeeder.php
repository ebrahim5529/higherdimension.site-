<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Contract;
use App\Models\Customer;
use App\Models\User;
use Carbon\Carbon;

class ContractSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $customers = Customer::all();
        $users = User::all();

        if ($customers->isEmpty() || $users->isEmpty()) {
            $this->command->warn('لا توجد عملاء أو مستخدمين. يرجى تشغيل CustomerSeeder و UserSeeder أولاً.');
            return;
        }

        $contractTypes = ['CASH', 'INSTALLMENT', 'MONTHLY', 'QUARTERLY', 'YEARLY'];
        $statuses = ['ACTIVE', 'EXPIRED', 'CANCELLED', 'COMPLETED'];
        $contractTitles = [
            'عقد تأجير معدات بناء',
            'عقد شراء سقالات',
            'عقد صيانة معدات',
            'عقد تركيب معدات',
            'عقد تأجير رافعات',
            'عقد شراء أدوات',
            'عقد صيانة دورية',
            'عقد تأجير طويلة الأمد',
        ];

        for ($i = 1; $i <= 50; $i++) {
            $customer = $customers->random();
            $user = $users->random();
            $paymentType = $contractTypes[array_rand($contractTypes)];
            $status = $statuses[array_rand($statuses)];
            
            $startDate = Carbon::now()->subMonths(rand(0, 12));
            $endDate = $startDate->copy()->addMonths(rand(1, 24));
            
            $amount = rand(1000, 50000);
            $installmentCount = $paymentType === 'INSTALLMENT' ? rand(3, 12) : null;

            Contract::create([
                'contract_number' => 'CNT-' . str_pad($i, 6, '0', STR_PAD_LEFT),
                'title' => $contractTitles[array_rand($contractTitles)],
                'description' => 'عقد ' . ($paymentType === 'CASH' ? 'شراء' : 'تأجير') . ' معدات بناء مع صيانة دورية وضمان لمدة ' . rand(6, 24) . ' شهر.',
                'amount' => $amount,
                'start_date' => $startDate,
                'end_date' => $endDate,
                'status' => $status,
                'payment_type' => $paymentType,
                'installment_count' => $installmentCount,
                'customer_id' => $customer->id,
                'user_id' => $user->id,
            ]);
        }

        $this->command->info('تم إنشاء 50 عقد بنجاح!');
    }
}
