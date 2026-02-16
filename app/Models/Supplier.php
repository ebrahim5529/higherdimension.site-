<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Supplier extends Model
{
    use HasFactory;

    protected $fillable = [
        'supplier_number',
        'name',
        'email',
        'phone',
        'address',
        'nationality',
        'supplier_type',
        'id_number',
        'commercial_record',
        'tax_number',
        'status',
        'registration_date',
        'contact_person',
        'contact_person_phone',
        'contact_person_email',
        'bank_name',
        'bank_account',
        'iban',
        'swift_code',
        'notes',
        'warnings',
        'rating',
    ];

    protected function casts(): array
    {
        return [
            'registration_date' => 'datetime',
            'rating' => 'integer',
        ];
    }

    public function purchases(): HasMany
    {
        return $this->hasMany(Purchase::class);
    }
}
