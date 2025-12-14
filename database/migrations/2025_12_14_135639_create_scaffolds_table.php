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
        Schema::create('scaffolds', function (Blueprint $table) {
            $table->id();
            $table->string('scaffold_number')->unique();
            $table->enum('type', ['FIXED', 'MOBILE', 'TOWER', 'CANTILEVER', 'SUSPENDED'])->default('FIXED');
            $table->json('size')->nullable(); // {height, width, length}
            $table->enum('material', ['STEEL', 'ALUMINUM', 'WOOD', 'COMPOSITE'])->default('STEEL');
            $table->enum('condition', ['NEW', 'USED', 'REFURBISHED'])->default('NEW');
            $table->enum('status', ['AVAILABLE', 'RENTED', 'SOLD', 'MAINTENANCE', 'RESERVED'])->default('AVAILABLE');
            $table->integer('quantity')->default(1);
            $table->integer('available_quantity')->default(1);
            $table->string('location')->nullable();
            $table->string('warehouse_location')->nullable();
            $table->decimal('selling_price', 10, 2)->default(0);
            $table->decimal('daily_rental_price', 10, 2)->default(0);
            $table->decimal('monthly_rental_price', 10, 2)->default(0);
            $table->date('entry_date')->nullable();
            $table->date('last_maintenance_date')->nullable();
            $table->date('next_maintenance_date')->nullable();
            $table->text('description_ar')->nullable();
            $table->text('description_en')->nullable();
            $table->text('notes')->nullable();
            $table->foreignId('supplier_id')->nullable()->constrained('suppliers')->nullOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('scaffolds');
    }
};
