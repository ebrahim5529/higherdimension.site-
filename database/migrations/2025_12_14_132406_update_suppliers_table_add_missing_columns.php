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
        // ملء supplier_number للبيانات الموجودة أولاً
        if (Schema::hasColumn('suppliers', 'supplier_number')) {
            \DB::table('suppliers')->whereNull('supplier_number')->orWhere('supplier_number', '')->get()->each(function ($supplier, $index) {
                \DB::table('suppliers')->where('id', $supplier->id)->update([
                    'supplier_number' => 'SUPP-'.str_pad($supplier->id, 3, '0', STR_PAD_LEFT),
                ]);
            });
        }

        Schema::table('suppliers', function (Blueprint $table) {
            if (! Schema::hasColumn('suppliers', 'supplier_number')) {
                $table->string('supplier_number')->nullable()->after('id');
            }
            if (! Schema::hasColumn('suppliers', 'nationality')) {
                $table->string('nationality')->nullable()->after('address');
            }
            if (! Schema::hasColumn('suppliers', 'supplier_type')) {
                $table->enum('supplier_type', ['INDIVIDUAL', 'COMPANY'])->default('INDIVIDUAL')->after('nationality');
            }
            if (! Schema::hasColumn('suppliers', 'id_number')) {
                $table->string('id_number')->nullable()->after('supplier_type');
            }
            if (! Schema::hasColumn('suppliers', 'commercial_record')) {
                $table->string('commercial_record')->nullable()->after('id_number');
            }
            if (! Schema::hasColumn('suppliers', 'tax_number')) {
                $table->string('tax_number')->nullable()->after('commercial_record');
            }
            if (! Schema::hasColumn('suppliers', 'status')) {
                $table->enum('status', ['ACTIVE', 'INACTIVE', 'SUSPENDED'])->default('ACTIVE')->after('tax_number');
            }
            if (! Schema::hasColumn('suppliers', 'registration_date')) {
                $table->date('registration_date')->nullable()->after('status');
            }
            if (! Schema::hasColumn('suppliers', 'contact_person_phone')) {
                $table->string('contact_person_phone')->nullable()->after('contact_person');
            }
            if (! Schema::hasColumn('suppliers', 'contact_person_email')) {
                $table->string('contact_person_email')->nullable()->after('contact_person_phone');
            }
            if (! Schema::hasColumn('suppliers', 'bank_name')) {
                $table->string('bank_name')->nullable()->after('contact_person_email');
            }
            if (! Schema::hasColumn('suppliers', 'bank_account')) {
                $table->string('bank_account')->nullable()->after('bank_name');
            }
            if (! Schema::hasColumn('suppliers', 'iban')) {
                $table->string('iban')->nullable()->after('bank_account');
            }
            if (! Schema::hasColumn('suppliers', 'swift_code')) {
                $table->string('swift_code')->nullable()->after('iban');
            }
            if (! Schema::hasColumn('suppliers', 'notes')) {
                $table->text('notes')->nullable()->after('swift_code');
            }
            if (! Schema::hasColumn('suppliers', 'warnings')) {
                $table->text('warnings')->nullable()->after('notes');
            }
            if (! Schema::hasColumn('suppliers', 'rating')) {
                $table->integer('rating')->nullable()->after('warnings');
            }
        });

        // إضافة unique constraint بعد ملء البيانات
        if (Schema::hasColumn('suppliers', 'supplier_number')) {
            // التحقق من وجود الـ unique key قبل إضافته
            $indexes = \DB::select("SHOW INDEXES FROM suppliers WHERE Key_name = 'suppliers_supplier_number_unique'");
            if (empty($indexes)) {
                \DB::statement('ALTER TABLE suppliers MODIFY supplier_number VARCHAR(255) NOT NULL');
                \DB::statement('ALTER TABLE suppliers ADD UNIQUE KEY suppliers_supplier_number_unique (supplier_number)');
            } else {
                // إذا كان موجوداً، فقط تأكد من أنه NOT NULL
                \DB::statement('ALTER TABLE suppliers MODIFY supplier_number VARCHAR(255) NOT NULL');
            }
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('suppliers', function (Blueprint $table) {
            $columns = [
                'supplier_number',
                'nationality',
                'supplier_type',
                'id_number',
                'commercial_record',
                'tax_number',
                'status',
                'registration_date',
                'contact_person_phone',
                'contact_person_email',
                'bank_name',
                'bank_account',
                'iban',
                'swift_code',
                'notes',
                'warnings',
                'rating',
            ];

            foreach ($columns as $column) {
                if (Schema::hasColumn('suppliers', $column)) {
                    $table->dropColumn($column);
                }
            }
        });
    }
};
