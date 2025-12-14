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
        Schema::create('installments', function (Blueprint $table) {
            $table->id();
            $table->integer('installment_number');
            $table->decimal('amount', 15, 2);
            $table->dateTime('due_date');
            $table->string('status')->default('PENDING')->comment('PENDING, PAID, OVERDUE, CANCELLED');
            $table->dateTime('paid_date')->nullable();
            $table->foreignId('contract_id')->constrained('contracts')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('installments');
    }
};
