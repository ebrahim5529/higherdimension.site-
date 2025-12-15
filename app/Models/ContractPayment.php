<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ContractPayment extends Model
{
    use HasFactory;

    protected $table = 'contract_payments';

    protected $fillable = [
        'contract_id',
        'payment_method',
        'payment_date',
        'amount',
        'check_number',
        'bank_name',
        'check_date',
        'check_image_path',
        'notes',
    ];

    protected $casts = [
        'payment_date' => 'date',
        'check_date' => 'date',
        'amount' => 'decimal:2',
    ];

    /**
     * Get the contract that owns the payment.
     */
    public function contract(): BelongsTo
    {
        return $this->belongsTo(Contract::class);
    }
}

