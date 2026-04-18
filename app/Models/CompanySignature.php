<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class CompanySignature extends Model
{
    use HasFactory;

    public const STORAGE_PREFIX = 'company-signatures/';

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
     * مسار آمن على قرص public: فقط ملف مباشر تحت company-signatures/ (بدون .. ولا مجلدات فرعية).
     */
    public static function allowedPublicDiskPath(?string $raw): ?string
    {
        if (blank($raw)) {
            return null;
        }

        $path = trim(str_replace('\\', '/', $raw));

        if (Str::startsWith($path, ['http://', 'https://'])) {
            return null;
        }

        if (Str::startsWith($path, '/storage/')) {
            $path = ltrim(Str::after($path, '/storage/'), '/');
        }

        $path = ltrim($path, '/');

        if ($path === '' || str_contains($path, '..') || str_contains($path, "\0")) {
            return null;
        }

        if (! Str::startsWith($path, self::STORAGE_PREFIX)) {
            return null;
        }

        $fileName = Str::after($path, self::STORAGE_PREFIX);
        if ($fileName === '' || str_contains($fileName, '/')) {
            return null;
        }

        if (! preg_match('/^[a-zA-Z0-9][a-zA-Z0-9._-]*\.(png|jpe?g)$/i', $fileName)) {
            return null;
        }

        return self::STORAGE_PREFIX.$fileName;
    }

    /**
     * رابط العرض: GET /files/company-signatures/{id}
     * روابط http/https للتخزين الخارجي تُعاد كما هي.
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

        if (self::allowedPublicDiskPath($this->signature_path) === null) {
            return null;
        }

        return route('company.signature.file', [
            'companySignature' => $this->id,
            'v' => (string) ($this->updated_at?->getTimestamp() ?? $this->id),
        ]);
    }
}
