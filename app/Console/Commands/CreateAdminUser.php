<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

class CreateAdminUser extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'user:create-admin {email} {password}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Create an admin user with specified email and password';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $email = $this->argument('email');
        $password = $this->argument('password');

        // التحقق من وجود دور admin
        $adminRole = Role::firstOrCreate([
            'name' => 'admin',
            'guard_name' => 'web',
        ]);

        // التحقق من وجود المستخدم
        $user = User::where('email', $email)->first();

        if ($user) {
            // تحديث المستخدم الموجود
            $user->update([
                'password' => Hash::make($password),
            ]);
            $this->info('تم تحديث المستخدم الموجود');
        } else {
            // إنشاء مستخدم جديد
            $user = User::create([
                'name' => 'مدير النظام',
                'email' => $email,
                'password' => Hash::make($password),
                'phone' => null,
                'role' => 'ADMIN',
            ]);
            $this->info('تم إنشاء مستخدم جديد');
        }

        // تعيين دور admin
        if (! $user->hasRole('admin')) {
            $user->assignRole('admin');
            $this->info('تم تعيين دور admin للمستخدم');
        } else {
            $this->info('المستخدم لديه بالفعل دور admin');
        }

        $this->info('تم إنشاء/تحديث حساب المدير بنجاح!');
        $this->info("البريد الإلكتروني: {$email}");
        $this->info("كلمة المرور: {$password}");

        return Command::SUCCESS;
    }
}
