<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CompanySignature;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ElectronicSignatureController extends Controller
{
    public function index()
    {
        $signature = CompanySignature::where('is_active', true)->latest('id')->first();

        return Inertia::render('ElectronicSignature', [
            'signature' => $signature ? [
                'id' => $signature->id,
                'company_name' => $signature->company_name,
                'signer_name' => $signature->signer_name,
                'signer_title' => $signature->signer_title,
                'signature_url' => $signature->signature_path ? asset(Storage::url($signature->signature_path)) : null,
                'is_active' => (bool) $signature->is_active,
            ] : null,
        ]);
    }

    public function store(Request $request)
    {
        $current = CompanySignature::where('is_active', true)->latest('id')->first();

        $validated = $request->validate([
            'company_name' => 'required|string|max:255',
            'signer_name' => 'required|string|max:255',
            'signer_title' => 'required|string|max:255',
            'signature_file' => 'nullable|file|mimes:png,jpg,jpeg|max:5120',
            'signature' => 'nullable|string',
        ]);

        $newPath = null;

        if ($request->hasFile('signature_file') && $request->file('signature_file')->isValid()) {
            $newPath = $request->file('signature_file')->store('company-signatures', 'public');
        } elseif (!empty($validated['signature'])) {
            $dataUrl = $validated['signature'];
            if (preg_match('/^data:image\/(png|jpeg|jpg);base64,/', $dataUrl) === 1) {
                $data = substr($dataUrl, strpos($dataUrl, ',') + 1);
                $binary = base64_decode($data);

                if ($binary === false) {
                    return redirect()->back()->with('error', 'تعذر قراءة بيانات التوقيع');
                }

                $filename = 'signature_' . now()->format('Ymd_His') . '.png';
                $newPath = 'company-signatures/' . $filename;
                Storage::disk('public')->put($newPath, $binary);
            } else {
                return redirect()->back()->with('error', 'صيغة التوقيع غير صحيحة');
            }
        }

        if (!$current && !$newPath) {
            return redirect()->back()->with('error', 'يرجى رفع صورة التوقيع أو رسم التوقيع');
        }

        if ($newPath && $current?->signature_path && Storage::disk('public')->exists($current->signature_path)) {
            Storage::disk('public')->delete($current->signature_path);
        }

        CompanySignature::query()->update(['is_active' => false]);

        $payload = [
            'company_name' => $validated['company_name'],
            'signer_name' => $validated['signer_name'],
            'signer_title' => $validated['signer_title'],
            'signature_path' => $newPath ?: ($current?->signature_path ?? ''),
            'signature_data' => json_encode([
                'source' => $newPath ? ($request->hasFile('signature_file') ? 'upload' : 'draw') : 'existing',
            ], JSON_UNESCAPED_UNICODE),
            'is_active' => true,
        ];

        if ($current) {
            $current->update($payload);
        } else {
            CompanySignature::create($payload);
        }

        return redirect()->back()->with('success', 'تم حفظ التوقيع الإلكتروني بنجاح');
    }
}
