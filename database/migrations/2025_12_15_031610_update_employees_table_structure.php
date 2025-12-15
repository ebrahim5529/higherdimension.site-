<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // التحقق من وجود الجدول
        if (!Schema::hasTable('employees')) {
            return;
        }

        Schema::table('employees', function (Blueprint $table) {
            // إضافة الأعمدة المفقودة
            if (!Schema::hasColumn('employees', 'employee_number')) {
                $table->string('employee_number')->nullable()->unique()->after('id');
            }
            
            if (!Schema::hasColumn('employees', 'arabic_name')) {
                $table->string('arabic_name')->nullable()->after('name');
            }
            if (!Schema::hasColumn('employees', 'mobile')) {
                $table->string('mobile')->nullable()->after('phone');
            }
            if (!Schema::hasColumn('employees', 'address')) {
                $table->text('address')->nullable()->after('mobile');
            }
            if (!Schema::hasColumn('employees', 'city')) {
                $table->string('city')->nullable()->after('address');
            }
            if (!Schema::hasColumn('employees', 'nationality')) {
                $table->string('nationality')->nullable()->after('city');
            }
            if (!Schema::hasColumn('employees', 'date_of_birth')) {
                $table->date('date_of_birth')->nullable()->after('nationality');
            }
            if (!Schema::hasColumn('employees', 'gender')) {
                $table->enum('gender', ['male', 'female'])->nullable()->after('date_of_birth');
            }
            if (!Schema::hasColumn('employees', 'marital_status')) {
                $table->enum('marital_status', ['single', 'married', 'divorced', 'widowed'])->nullable()->after('gender');
            }
            if (!Schema::hasColumn('employees', 'id_number')) {
                $table->string('id_number')->nullable()->after('marital_status');
            }
            if (!Schema::hasColumn('employees', 'passport_number')) {
                $table->string('passport_number')->nullable()->after('id_number');
            }
            if (!Schema::hasColumn('employees', 'manager')) {
                $table->string('manager')->nullable()->after('department');
            }
            if (!Schema::hasColumn('employees', 'location')) {
                $table->string('location')->nullable()->after('manager');
            }
            if (!Schema::hasColumn('employees', 'contract_type')) {
                $table->enum('contract_type', ['full_time', 'part_time', 'contract', 'intern'])->default('full_time')->after('hire_date');
            }
            if (!Schema::hasColumn('employees', 'work_schedule')) {
                $table->string('work_schedule')->nullable()->after('contract_type');
            }
            if (!Schema::hasColumn('employees', 'basic_salary')) {
                $table->decimal('basic_salary', 10, 2)->default(0)->after('status');
            }
            if (!Schema::hasColumn('employees', 'allowances')) {
                $table->decimal('allowances', 10, 2)->default(0)->after('basic_salary');
            }
            if (!Schema::hasColumn('employees', 'total_salary')) {
                // إذا كان هناك عمود salary، انقله إلى total_salary
                if (Schema::hasColumn('employees', 'salary')) {
                    DB::statement('ALTER TABLE employees CHANGE salary total_salary DECIMAL(10, 2) DEFAULT 0');
                } else {
                    $table->decimal('total_salary', 10, 2)->default(0)->after('allowances');
                }
            }
            if (!Schema::hasColumn('employees', 'currency')) {
                $table->string('currency', 10)->default('ر.ع')->after('total_salary');
            }
            if (!Schema::hasColumn('employees', 'payment_method')) {
                $table->enum('payment_method', ['bank_transfer', 'cash', 'check'])->default('bank_transfer')->after('currency');
            }
            if (!Schema::hasColumn('employees', 'bank_account')) {
                $table->string('bank_account')->nullable()->after('payment_method');
            }
            if (!Schema::hasColumn('employees', 'documents')) {
                $table->json('documents')->nullable()->after('bank_account');
            }
            if (!Schema::hasColumn('employees', 'notes')) {
                $table->text('notes')->nullable()->after('documents');
            }
        });
        
        // توليد employee_number للموظفين الموجودين
        $employees = DB::table('employees')->whereNull('employee_number')->get();
        foreach ($employees as $index => $employee) {
            $employeeNumber = 'EMP' . str_pad($index + 1, 3, '0', STR_PAD_LEFT);
            // التحقق من عدم وجود رقم مكرر
            $existing = DB::table('employees')->where('employee_number', $employeeNumber)->first();
            if (!$existing) {
                DB::table('employees')
                    ->where('id', $employee->id)
                    ->update(['employee_number' => $employeeNumber]);
            }
        }
        
        // تحديث نوع hire_date من datetime إلى date
        if (Schema::hasColumn('employees', 'hire_date')) {
            try {
                DB::statement('ALTER TABLE employees MODIFY hire_date DATE');
            } catch (\Exception $e) {
                // قد يكون نوعه date بالفعل
            }
        }
        
        // تحديث status من string إلى enum
        if (Schema::hasColumn('employees', 'status')) {
            try {
                // تحويل القيم الموجودة أولاً
                DB::table('employees')->where('status', 'ACTIVE')->update(['status' => 'active']);
                DB::table('employees')->where('status', 'INACTIVE')->update(['status' => 'inactive']);
                DB::table('employees')->where('status', 'TERMINATED')->update(['status' => 'inactive']);
                
                // تغيير نوع العمود
                DB::statement("ALTER TABLE employees MODIFY status ENUM('active', 'inactive', 'on_leave') DEFAULT 'active'");
            } catch (\Exception $e) {
                // قد يكون enum بالفعل
            }
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // لا نرجع التغييرات لأنها تحديثات هيكلية
    }
};
