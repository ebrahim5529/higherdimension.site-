<?php

namespace App\Http\Controllers;

use App\Actions\Fortify\UpdateUserPassword;
use App\Actions\Fortify\UpdateUserProfileInformation;
use App\Models\SecurityNotification;
use App\Notifications\TwoFactorEnabledNotification;
use App\Services\TwoFactorService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ProfileController extends Controller
{
    public function __construct(
        private readonly TwoFactorService $twoFactorService,
    ) {}

    public function show(): \Inertia\Response
    {
        $user = Auth::user();

        return Inertia::render('Profile/Index', [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone,
                'roles' => $user->roles->pluck('name'),
                'permissions' => $user->getAllPermissions()->pluck('name'),
                'two_factor_enabled' => $user->hasTwoFactorEnabled(),
            ],
        ]);
    }

    public function updateProfile(Request $request): \Illuminate\Http\RedirectResponse
    {
        $user = Auth::user();

        $updater = app(UpdateUserProfileInformation::class);
        $updater->update($user, $request->all());

        return back()->with('success', 'تم تحديث معلومات الملف الشخصي بنجاح');
    }

    public function changePassword(Request $request): \Illuminate\Http\RedirectResponse
    {
        $user = Auth::user();

        $updater = app(UpdateUserPassword::class);
        $updater->update($user, $request->all());

        return back()->with('success', 'تم تغيير كلمة المرور بنجاح');
    }

    public function enableTwoFactor(): \Illuminate\Http\RedirectResponse
    {
        $user = Auth::user();

        if ($user->hasTwoFactorEnabled()) {
            return back()->with('error', 'المصادقة الثنائية مفعّلة بالفعل');
        }

        $this->twoFactorService->enable($user);

        // إرسال إشعار تأكيد
        $user->notify(new TwoFactorEnabledNotification);

        // حفظ الإشعار في قاعدة البيانات
        SecurityNotification::create([
            'user_id' => $user->id,
            'type' => 'two_factor_enabled',
            'title' => 'تم تفعيل المصادقة الثنائية',
            'message' => 'تم تفعيل المصادقة الثنائية لحسابك بنجاح.',
        ]);

        return back()->with('success', 'تم تفعيل المصادقة الثنائية بنجاح');
    }

    public function disableTwoFactor(Request $request): \Illuminate\Http\RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ], [
            'password.required' => 'يرجى إدخال كلمة المرور',
            'password.current_password' => 'كلمة المرور غير صحيحة',
        ]);

        $user = Auth::user();

        if (! $user->hasTwoFactorEnabled()) {
            return back()->with('error', 'المصادقة الثنائية غير مفعّلة');
        }

        $this->twoFactorService->disable($user);

        return back()->with('success', 'تم إلغاء تفعيل المصادقة الثنائية بنجاح');
    }
}
