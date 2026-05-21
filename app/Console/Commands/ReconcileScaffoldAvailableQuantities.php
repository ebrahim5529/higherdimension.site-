<?php

namespace App\Console\Commands;

use App\Models\Scaffold;
use App\Services\ScaffoldInventoryService;
use Illuminate\Console\Command;

class ReconcileScaffoldAvailableQuantities extends Command
{
    protected $signature = 'inventory:reconcile-available';

    protected $description = 'يصحّح available_quantity لكل معدة = الإجمالي − مجموع كميات العقود المفتوحة أو «مغلقة ولم يتم الاستلام»';

    public function handle(): int
    {
        $this->info('جاري مزامنة الكميات المتاحة...');

        $updated = 0;

        foreach (Scaffold::query()->cursor() as $scaffold) {
            $before = (int) $scaffold->available_quantity;
            ScaffoldInventoryService::syncAvailableQuantity($scaffold);
            $scaffold->refresh();

            if ($before !== (int) $scaffold->available_quantity) {
                $this->line("  {$scaffold->scaffold_number}: {$before} → {$scaffold->available_quantity}");
                $updated++;
            }
        }

        $this->info("تم. عدد السجلات المعدّلة: {$updated}");

        return self::SUCCESS;
    }
}
