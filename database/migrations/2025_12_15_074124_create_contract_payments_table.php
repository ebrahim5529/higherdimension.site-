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
        Schema::create('contract_payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('contract_id')->constrained('contracts')->onDelete('cascade');
            $table->enum('payment_method', ['cash', 'check', 'credit_card', 'bank_transfer'])->default('cash');
            $table->date('payment_date');
            $table->decimal('amount', 15, 2);
            $table->string('check_number')->nullable();
            $table->string('bank_name')->nullable();
            $table->date('check_date')->nullable();
            $table->string('check_image_path')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('contract_payments');
    }
};
