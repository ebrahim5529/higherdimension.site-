<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Wilayat extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'governorate_id'];

    public function governorate(): BelongsTo
    {
        return $this->belongsTo(Governorate::class);
    }
}
