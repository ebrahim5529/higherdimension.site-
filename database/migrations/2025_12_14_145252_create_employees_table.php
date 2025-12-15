<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // إذا كان الجدول موجوداً بالفعل، استخدم update migration بدلاً من ذلك
        if (Schema::hasTable('employees')) {
            return;
        }
        
        Schema::create('employees', function (Blueprint $table) {
            $table->id();
            $table->string('employee_number')->unique();
            $table->string('name');
            $table->string('arabic_name')->nullable();
            $table->string('email')->unique();
            $table->string('phone')->nullable();
            $table->string('mobile')->nullable();
            $table->text('address')->nullable();
            $table->string('city')->nullable();
            $table->string('nationality')->nullable();
            $table->date('date_of_birth')->nullable();
            $table->enum('gender', ['male', 'female'])->nullable();
            $table->enum('marital_status', ['single', 'married', 'divorced', 'widowed'])->nullable();
            $table->string('id_number')->nullable();
            $table->string('passport_number')->nullable();
            
            // معلومات العمل
            $table->string('position');
            $table->string('department');
            $table->string('manager')->nullable();
            $table->string('location')->nullable();
            $table->date('hire_date');
            $table->enum('contract_type', ['full_time', 'part_time', 'contract', 'intern'])->default('full_time');
            $table->string('work_schedule')->nullable();
            $table->enum('status', ['active', 'inactive', 'on_leave'])->default('active');
            
            // معلومات الراتب
            $table->decimal('basic_salary', 10, 2)->default(0);
            $table->decimal('allowances', 10, 2)->default(0);
            $table->decimal('total_salary', 10, 2)->default(0);
            $table->string('currency', 10)->default('ر.ع');
            $table->enum('payment_method', ['bank_transfer', 'cash', 'check'])->default('bank_transfer');
            $table->string('bank_account')->nullable();
            
            // ملفات ومرفقات (JSON)
            $table->json('documents')->nullable();
            
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('employees');
    }
};
