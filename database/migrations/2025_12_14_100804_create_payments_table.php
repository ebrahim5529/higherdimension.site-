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
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->decimal('amount', 15, 2);
            $table->dateTime('payment_date');
            $table->string('payment_method')->default('CASH')->comment('CASH, BANK_TRANSFER, CHECK, CREDIT_CARD');
            $table->string('status')->default('COMPLETED')->comment('PENDING, COMPLETED, FAILED, CANCELLED');
            $table->text('notes')->nullable();
            $table->foreignId('contract_id')->constrained('contracts')->onDelete('cascade');
            $table->foreignId('customer_id')->constrained('customers')->onDelete('restrict');
            $table->foreignId('user_id')->constrained('users')->onDelete('restrict');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
