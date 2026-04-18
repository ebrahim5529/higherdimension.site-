<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

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

    /**
     * رابط صورة التوقيع للعرض في المتصفح.
     * مسار نسبي /storage/... يتبع نطاق الصفحة (مهم لصفحة التوقيع العامة وعدم تعارض APP_URL أو http/https).
     * إن كان المسار في DB مطابقاً للسلوك القديم asset(Storage::url) يُعاد كما هو عند البدء بـ /storage.
     */
    public function publicSignatureUrl(): ?string
    {
        if (blank($this->signature_path)) {
            return null;
        }

        $path = trim(str_replace('\\', '/', (string) $this->signature_path));

        if (Str::startsWith($path, ['http://', 'https://'])) {
            return $path;
        }

        if (Str::startsWith($path, '/storage/')) {
            return $path;
        }

        $normalized = ltrim($path, '/');

        return '/storage/'.$normalized;
    }
}
