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
        Schema::table('contracts', function (Blueprint $table) {
            if (!Schema::hasColumn('contracts', 'delivery_address')) {
                $table->string('delivery_address')->nullable()->after('installment_count');
            }
            if (!Schema::hasColumn('contracts', 'location_map_link')) {
                $table->string('location_map_link')->nullable()->after('delivery_address');
            }
            if (!Schema::hasColumn('contracts', 'transport_and_installation_cost')) {
                $table->decimal('transport_and_installation_cost', 15, 2)->default(0)->after('location_map_link');
            }
            if (!Schema::hasColumn('contracts', 'total_discount')) {
                $table->decimal('total_discount', 15, 2)->default(0)->after('transport_and_installation_cost');
            }
            if (!Schema::hasColumn('contracts', 'contract_notes')) {
                $table->text('contract_notes')->nullable()->after('total_discount');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('contracts', function (Blueprint $table) {
            $table->dropColumn([
                'delivery_address',
                'location_map_link',
                'transport_and_installation_cost',
                'total_discount',
                'contract_notes',
            ]);
        });
    }
};
