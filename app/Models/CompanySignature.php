<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CompanySignature extends Model
{
    use HasFactory;

    protected $fillable = [
        'company_name',
        'signer_name',
        'signer_title',
        'signature_path',
        'signature_data',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
        ];
    }
}
