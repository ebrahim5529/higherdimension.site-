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
        Schema::create('incentives', function (Blueprint $table) {
            $table->id();
            $table->foreignId('employee_id')->constrained('employees')->onDelete('cascade');
            $table->string('employee_number');
            $table->enum('incentive_type', ['performance', 'bonus', 'overtime', 'commission', 'other']);
            $table->decimal('amount', 10, 2);
            $table->text('reason');
            $table->date('date');
            $table->enum('status', ['approved', 'pending', 'rejected'])->default('pending');
            $table->string('approved_by')->nullable();
            $table->date('approved_date')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('incentives');
    }
};
