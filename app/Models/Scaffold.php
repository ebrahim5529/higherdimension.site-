<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Scaffold extends Model
{
    use HasFactory;

    protected $fillable = [
        'scaffold_number',
        'type',
        'size',
        'material',
        'condition',
        'status',
        'quantity',
        'available_quantity',
        'location',
        'warehouse_location',
        'selling_price',
        'daily_rental_price',
        'monthly_rental_price',
        'entry_date',
        'last_maintenance_date',
        'next_maintenance_date',
        'description_ar',
        'description_en',
        'notes',
        'supplier_id',
    ];

    protected function casts(): array
    {
        return [
            'size' => 'array',
            'entry_date' => 'date',
            'last_maintenance_date' => 'date',
            'next_maintenance_date' => 'date',
            'selling_price' => 'decimal:2',
            'daily_rental_price' => 'decimal:2',
            'monthly_rental_price' => 'decimal:2',
        ];
    }

    // Relationships
    public function supplier(): BelongsTo
    {
        return $this->belongsTo(Supplier::class);
    }
}
