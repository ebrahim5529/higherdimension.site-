<?php

namespace App\Http\Controllers;

use App\Models\CompanySignature;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class CompanySignatureImageController extends Controller
{
    /**
     * عرض صورة توقيع الشركة النشط — يعمل في الإنتاج دون الاعتماد على symlink لـ public/storage.
     */
    public function show(CompanySignature $companySignature)
    {
        if (! $companySignature->is_active) {
            abort(404);
        }

        $path = $this->normalizedStoragePath($companySignature->signature_path);
        if ($path === null) {
            abort(404);
        }

        if (! Storage::disk('public')->exists($path)) {
            abort(404);
        }

        $mime = Storage::disk('public')->mimeType($path) ?: 'image/png';

        return Storage::disk('public')->response($path, basename($path), [
            'Content-Type' => $mime,
            'Cache-Control' => 'public, max-age=86400',
        ]);
    }

    private function normalizedStoragePath(?string $raw): ?string
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

        if (str_contains($path, '..')) {
            return null;
        }

        return ltrim($path, '/');
    }
}
