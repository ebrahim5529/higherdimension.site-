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
        Schema::create('contracts', function (Blueprint $table) {
            $table->id();
            $table->string('contract_number')->unique();
            $table->string('title');
            $table->text('description')->nullable();
            $table->decimal('amount', 15, 2);
            $table->dateTime('start_date');
            $table->dateTime('end_date');
            $table->string('status')->default('ACTIVE')->comment('ACTIVE, EXPIRED, CANCELLED, COMPLETED');
            $table->string('payment_type')->default('INSTALLMENT')->comment('CASH, INSTALLMENT, MONTHLY, QUARTERLY, YEARLY');
            $table->integer('installment_count')->nullable();
            $table->foreignId('customer_id')->constrained('customers')->onDelete('cascade');
            $table->foreignId('user_id')->constrained('users')->onDelete('restrict');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('contracts');
    }
};
