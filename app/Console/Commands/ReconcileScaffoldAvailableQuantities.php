<?php

namespace App\Console\Commands;

use App\Models\ContractEquipment;
use App\Models\Scaffold;
use Illuminate\Console\Command;

class ReconcileScaffoldAvailableQuantities extends Command
{
    protected $signature = 'inventory:reconcile-available';

    protected $description = 'يصحّح available_quantity لكل معدة = الإجمالي − مجموع الكميات في عقود contract_equipment';

    public function handle(): int
    {
        $this->info('جاري مزامنة الكميات المتاحة...');

        $updated = 0;

        foreach (Scaffold::query()->cursor() as $scaffold) {
            $used = (int) ContractEquipment::query()
                ->where('scaffold_id', $scaffold->id)
                ->sum('quantity');

            $expected = max(0, (int) $scaffold->quantity - $used);

            if ((int) $scaffold->available_quantity !== $expected) {
                $this->line("  {$scaffold->scaffold_number}: {$scaffold->available_quantity} → {$expected}");
                $scaffold->update(['available_quantity' => $expected]);
                $updated++;
            }
        }

        $this->info("تم. عدد السجلات المعدّلة: {$updated}");

        return self::SUCCESS;
    }
}
