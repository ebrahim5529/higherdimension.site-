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
        Schema::create('customers', function (Blueprint $table) {
            $table->id();
            $table->string('customer_number')->unique()->comment('رقم العميل');
            $table->string('name');
            $table->string('email')->nullable()->unique();
            $table->string('phone')->nullable();
            $table->text('address')->nullable();
            $table->string('nationality')->nullable()->comment('الجنسية');
            $table->string('customer_type')->default('INDIVIDUAL')->comment('نوع العميل: INDIVIDUAL, COMPANY');
            $table->string('id_number')->nullable()->comment('رقم الهوية');
            $table->string('commercial_record')->nullable()->comment('السجل التجاري');
            $table->string('status')->default('ACTIVE')->comment('حالة العميل: ACTIVE, INACTIVE');
            $table->dateTime('registration_date')->useCurrent();
            $table->string('guarantor_name')->nullable()->comment('اسم الكفيل');
            $table->string('guarantor_phone')->nullable()->comment('هاتف الكفيل');
            $table->string('guarantor_id')->nullable()->comment('رقم هوية الكفيل');
            $table->text('notes')->nullable()->comment('ملاحظات وتعليقات');
            $table->text('warnings')->nullable()->comment('تحذيرات خاصة');
            $table->tinyInteger('rating')->nullable()->comment('تقييم العميل (1-5)');
            $table->text('attachments')->nullable()->comment('مسارات الملفات المرفقة (JSON)');
            $table->string('id_card_copy_path')->nullable()->comment('مسار نسخة البطاقة الشخصية للعميل');
            $table->string('guarantor_id_card_copy_path')->nullable()->comment('مسار نسخة بطاقة الكفيل');
            $table->string('commercial_record_copy_path')->nullable()->comment('مسار نسخة السجل التجاري');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('customers');
    }
};
