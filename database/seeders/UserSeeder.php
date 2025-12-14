<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::create([
            'name' => 'مدير النظام',
            'email' => 'admin@easyloman.com',
            'phone' => '+968501234567',
            'password' => Hash::make('123456'),
            'role' => 'ADMIN',
        ]);

        $this->command->info('✅ تم إنشاء المستخدم الافتراضي بنجاح!');
        $this->command->info('   البريد الإلكتروني: admin@easyloman.com');
        $this->command->info('   كلمة المرور: 123456');
    }
}

