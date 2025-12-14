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
        Schema::create('company_signatures', function (Blueprint $table) {
            $table->id();
            $table->string('company_name')->comment('اسم الجهة المالكة');
            $table->string('signer_name')->comment('اسم الموقع');
            $table->string('signer_title')->comment('منصب الموقع');
            $table->string('signature_path')->comment('مسار ملف التوقيع');
            $table->text('signature_data')->nullable()->comment('بيانات التوقيع (JSON)');
            $table->boolean('is_active')->default(true)->comment('هل التوقيع نشط');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('company_signatures');
    }
};
