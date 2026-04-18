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
     * في الإنتاج: عبر route يقرأ الملف من storage (لا يعتمد على symlink public/storage).
     * روابط http/https تُعاد كما هي (تخزين خارجي).
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

        return route('company.signature.file', [
            'companySignature' => $this->id,
            'v' => (string) ($this->updated_at?->getTimestamp() ?? $this->id),
        ]);
    }
}
