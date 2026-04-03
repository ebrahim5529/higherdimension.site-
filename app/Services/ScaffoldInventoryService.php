<?php

namespace App\Services;

use App\Models\Scaffold;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class ScaffoldInventoryService
{
    /**
     * خصم كمية من الرصيد المتاح عند ربط المعدة بعقد.
     */
    public static function reserve(?int $scaffoldId, int $quantity): void
    {
        if (! $scaffoldId || $quantity <= 0) {
            return;
        }

        DB::transaction(function () use ($scaffoldId, $quantity) {
            $scaffold = Scaffold::query()->whereKey($scaffoldId)->lockForUpdate()->first();
            if (! $scaffold) {
                throw ValidationException::withMessages([
                    'rental_details' => 'المعدة المختارة غير موجودة.',
                ]);
            }

            if ($scaffold->available_quantity < $quantity) {
                throw ValidationException::withMessages([
                    'rental_details' => "الكمية المتاحة للمعدة {$scaffold->scaffold_number} غير كافية (المتاح حالياً: {$scaffold->available_quantity}).",
                ]);
            }

            $scaffold->decrement('available_quantity', $quantity);
        });
    }

    /**
     * إرجاع كمية إلى الرصيد المتاح (عند إلغاء بند أو حذف عقد).
     */
    public static function release(?int $scaffoldId, int $quantity): void
    {
        if (! $scaffoldId || $quantity <= 0) {
            return;
        }

        DB::transaction(function () use ($scaffoldId, $quantity) {
            $scaffold = Scaffold::query()->whereKey($scaffoldId)->lockForUpdate()->first();
            if (! $scaffold) {
                return;
            }

            $maxAllowed = (int) $scaffold->quantity;
            $newAvailable = min($maxAllowed, (int) $scaffold->available_quantity + $quantity);
            $scaffold->update(['available_quantity' => $newAvailable]);
        });
    }
}
