<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class JournalEntry extends Model
{
    use HasFactory;

    protected $fillable = [
        'entry_number',
        'date',
        'description',
        'reference_type',
        'reference_id',
        'status',
        'total_debit',
        'total_credit',
        'created_by',
    ];

    protected function casts(): array
    {
        return [
            'date' => 'date',
            'total_debit' => 'decimal:2',
            'total_credit' => 'decimal:2',
        ];
    }

    public function items(): HasMany
    {
        return $this->hasMany(JournalEntryItem::class);
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function scopePosted($query)
    {
        return $query->where('status', 'posted');
    }

    public function scopeDraft($query)
    {
        return $query->where('status', 'draft');
    }

    public static function generateEntryNumber(): string
    {
        $lastEntry = static::orderByDesc('id')->first();
        $nextNumber = $lastEntry ? ((int) substr($lastEntry->entry_number, 3)) + 1 : 1;
        return 'JE-' . str_pad($nextNumber, 6, '0', STR_PAD_LEFT);
    }
}
