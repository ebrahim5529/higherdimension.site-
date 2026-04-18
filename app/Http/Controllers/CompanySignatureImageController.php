<?php

namespace App\Http\Controllers;

use App\Models\CompanySignature;
use Illuminate\Support\Facades\Storage;

class CompanySignatureImageController extends Controller
{
    /**
     * عرض صورة توقيع الشركة النشط من company-signatures/ فقط (انظر CompanySignature::allowedPublicDiskPath).
     */
    public function show(CompanySignature $companySignature)
    {
        if (! $companySignature->is_active) {
            abort(404);
        }

        $path = CompanySignature::allowedPublicDiskPath($companySignature->signature_path);
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
}
