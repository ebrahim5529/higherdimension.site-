<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ContractEquipment extends Model
{
    use HasFactory;

    protected $table = 'contract_equipment';

    protected $fillable = [
        'contract_id',
        'scaffold_id',
        'item_code',
        'item_description',
        'start_date',
        'end_date',
        'duration',
        'duration_type',
        'quantity',
        'daily_rate',
        'monthly_rate',
        'discount',
        'total',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'daily_rate' => 'decimal:2',
        'monthly_rate' => 'decimal:2',
        'discount' => 'decimal:2',
        'total' => 'decimal:2',
    ];

    /**
     * Get the contract that owns the equipment.
     */
    public function contract(): BelongsTo
    {
        return $this->belongsTo(Contract::class);
    }

    /**
     * Get the scaffold.
     */
    public function scaffold(): BelongsTo
    {
        return $this->belongsTo(Scaffold::class);
    }
}

