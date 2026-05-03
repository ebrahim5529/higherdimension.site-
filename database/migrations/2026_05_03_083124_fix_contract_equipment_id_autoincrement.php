<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * يصحّح عمود id بدون AUTO_INCREMENT (جداول مُنشأة يدوياً أو مستوردة).
     * يجب إصلاح جدول migrations أولاً وإلا يفشل تسجيل أي هجرة لاحقة.
     */
    public function up(): void
    {
        $driver = Schema::getConnection()->getDriverName();
        if (! in_array($driver, ['mysql', 'mariadb'], true)) {
            return;
        }

        if (Schema::hasTable('migrations')) {
            DB::statement('ALTER TABLE `migrations` MODIFY `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT');
        }

        if (Schema::hasTable('contract_equipment')) {
            DB::statement('ALTER TABLE `contract_equipment` MODIFY `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT');
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
