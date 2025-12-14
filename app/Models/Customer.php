<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Customer extends Model
{
    use HasFactory;

    protected $fillable = [
        'customer_number',
        'name',
        'email',
        'phone',
        'phones',
        'address',
        'nationality',
        'customer_type',
        'id_number',
        'commercial_record',
        'status',
        'registration_date',
        'guarantor_name',
        'guarantor_phone',
        'guarantor_id',
        'notes',
        'warnings',
        'rating',
        'attachments',
        'id_card_copy_path',
        'guarantor_id_card_copy_path',
        'commercial_record_copy_path',
    ];

    protected function casts(): array
    {
        return [
            'registration_date' => 'datetime',
            'rating' => 'integer',
            'phones' => 'array',
        ];
    }

    // Relationships
    public function contracts(): HasMany
    {
        return $this->hasMany(Contract::class);
    }

    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class);
    }

    public function customerNotes(): HasMany
    {
        return $this->hasMany(CustomerNote::class);
    }
}
