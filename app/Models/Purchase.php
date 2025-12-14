<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Purchase extends Model
{
    use HasFactory;

    protected $fillable = [
        'purchase_number',
        'title',
        'description',
        'amount',
        'purchase_date',
        'status',
        'notes',
        'supplier_id',
    ];

    protected function casts(): array
    {
        return [
            'amount' => 'decimal:2',
            'purchase_date' => 'datetime',
        ];
    }

    // Relationships
    public function supplier(): BelongsTo
    {
        return $this->belongsTo(Supplier::class);
    }
}
