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
        Schema::create('contract_equipment', function (Blueprint $table) {
            $table->id();
            $table->foreignId('contract_id')->constrained('contracts')->onDelete('cascade');
            $table->foreignId('scaffold_id')->nullable()->constrained('scaffolds')->nullOnDelete();
            $table->string('item_code')->nullable();
            $table->text('item_description')->nullable();
            $table->date('start_date');
            $table->date('end_date');
            $table->integer('duration');
            $table->enum('duration_type', ['daily', 'monthly'])->default('monthly');
            $table->integer('quantity')->default(1);
            $table->decimal('daily_rate', 10, 2)->default(0);
            $table->decimal('monthly_rate', 10, 2)->default(0);
            $table->decimal('total', 10, 2)->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('contract_equipment');
    }
};
