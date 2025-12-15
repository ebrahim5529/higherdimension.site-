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
        Schema::create('contract_attachments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('contract_id')->constrained('contracts')->onDelete('cascade');
            $table->string('name'); // اسم الملف الأصلي
            $table->string('file_path'); // مسار الملف في التخزين
            $table->string('file_type')->nullable(); // نوع الملف (PDF, ZIP, etc.)
            $table->unsignedBigInteger('file_size')->nullable(); // حجم الملف بالبايت
            $table->string('mime_type')->nullable(); // MIME type
            $table->text('description')->nullable(); // وصف اختياري
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('contract_attachments');
    }
};
