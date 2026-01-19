<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Region extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'wilayat_id'];

    public function wilayat(): BelongsTo
    {
        return $this->belongsTo(Wilayat::class);
    }
}
