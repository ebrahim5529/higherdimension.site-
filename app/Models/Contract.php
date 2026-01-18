<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Contract extends Model
{
    use HasFactory;

    protected $fillable = [
        'contract_number',
        'title',
        'description',
        'amount',
        'start_date',
        'end_date',
        'status',
        'payment_type',
        'installment_count',
        'delivery_address',
        'delivery_address_details',
        'location_map_link',
        'transport_and_installation_cost',
        'total_discount',
        'contract_notes',
        'customer_signature',
        'signed_at',
        'customer_id',
        'user_id',
    ];

    protected $casts = [
        'start_date' => 'datetime',
        'end_date' => 'datetime',
        'signed_at' => 'datetime',
        'amount' => 'decimal:2',
        'transport_and_installation_cost' => 'decimal:2',
        'total_discount' => 'decimal:2',
        'delivery_address_details' => 'json',
    ];

    /**
     * Get the customer that owns the contract.
     */
    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }

    /**
     * Get the user who created the contract.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the payments for the contract.
     */
    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class);
    }

    /**
     * Get the contract equipment.
     */
    public function equipment(): HasMany
    {
        return $this->hasMany(ContractEquipment::class);
    }

    /**
     * Get the contract payments (from contract_payments table).
     */
    public function contractPayments(): HasMany
    {
        return $this->hasMany(ContractPayment::class);
    }

    /**
     * Get the contract attachments.
     */
    public function attachments(): HasMany
    {
        return $this->hasMany(ContractAttachment::class);
    }
}
