<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Account extends Model
{
    use HasFactory;

    protected $fillable = [
        'code',
        'name',
        'parent_id',
        'type',
        'is_active',
        'description',
        'level',
        'is_parent',
    ];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
            'is_parent' => 'boolean',
            'level' => 'integer',
        ];
    }

    public function parent(): BelongsTo
    {
        return $this->belongsTo(Account::class, 'parent_id');
    }

    public function children(): HasMany
    {
        return $this->hasMany(Account::class, 'parent_id')->orderBy('code');
    }

    public function childrenRecursive(): HasMany
    {
        return $this->children()->with('childrenRecursive');
    }

    public function journalEntryItems(): HasMany
    {
        return $this->hasMany(JournalEntryItem::class);
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeRoots($query)
    {
        return $query->whereNull('parent_id');
    }

    public function getBalanceAttribute(): float
    {
        $debit = $this->journalEntryItems()
            ->whereHas('journalEntry', fn($q) => $q->where('status', 'posted'))
            ->sum('debit');
        $credit = $this->journalEntryItems()
            ->whereHas('journalEntry', fn($q) => $q->where('status', 'posted'))
            ->sum('credit');

        if (in_array($this->type, ['asset', 'expense'])) {
            return (float) ($debit - $credit);
        }

        return (float) ($credit - $debit);
    }
}
