<?php

namespace App\Services;

use App\Models\ContractEquipment;
use App\Models\Scaffold;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class ScaffoldInventoryService
{
    /**
     * حالات العقود التي تخصم الكمية من المخزون المتاح.
     *
     * @return list<string>
     */
    public static function inventoryReservingContractStatuses(): array
    {
        return ['ACTIVE', 'OPEN', 'CLOSED_NOT_RECEIVED'];
    }

    /**
     * هل حالة العقد تعني أن الكميات مخصومة من المخزون؟
     */
    public static function contractStatusReservesInventory(string $status): bool
    {
        return in_array($status, self::inventoryReservingContractStatuses(), true);
    }

    /**
     * مجموع الكميات المحجوزة من العقود المفتوحة أو «مغلقة ولم يتم الاستلام».
     */
    public static function reservedQuantity(int $scaffoldId): int
    {
        return (int) ContractEquipment::query()
            ->where('scaffold_id', $scaffoldId)
            ->whereHas('contract', function ($query) {
                $query->whereIn('status', self::inventoryReservingContractStatuses());
            })
            ->sum('quantity');
    }

    /**
     * مزامنة available_quantity مع الإجمالي − المحجوز من العقود التي تخصم المخزون.
     */
    public static function syncAvailableQuantity(Scaffold $scaffold): void
    {
        $expected = self::availableForQuantity(
            (int) $scaffold->quantity,
            self::reservedQuantity((int) $scaffold->id),
        );

        if ((int) $scaffold->available_quantity !== $expected) {
            $scaffold->update(['available_quantity' => $expected]);
        }
    }

    /**
     * الكمية المتاحة = الإجمالي − المحجوز (لا تقل عن 0).
     */
    public static function availableForQuantity(int $totalQuantity, int $reservedQuantity): int
    {
        return max(0, $totalQuantity - $reservedQuantity);
    }

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
