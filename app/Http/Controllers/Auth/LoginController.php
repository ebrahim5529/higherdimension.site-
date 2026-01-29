<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\SecurityNotification;
use App\Notifications\NewDeviceLoginNotification;
use App\Services\DeviceTrackingService;
use App\Services\TwoFactorService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class LoginController extends Controller
{
    public function __construct(
        private readonly DeviceTrackingService $deviceTrackingService,
        private readonly TwoFactorService $twoFactorService,
    ) {}

    /**
     * Show the login form.
     */
    public function show()
    {
        return Inertia::render('Login');
    }

    /**
     * Handle a login request.
     */
    public function store(Request $request)
    {
        $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
        ], [
            'email.required' => 'يرجى إدخال البريد الإلكتروني',
            'email.email' => 'يرجى إدخال بريد إلكتروني صحيح',
            'password.required' => 'يرجى إدخال كلمة المرور',
        ]);

        if (
            Auth::attempt(
                $request->only('email', 'password'),
                $request->boolean('remember')
            )
        ) {
            $request->session()->regenerate();

            $user = Auth::user();

            // التحقق من تفعيل 2FA والجهاز
            if ($user->hasTwoFactorEnabled()) {
                $isDeviceTrusted = $this->deviceTrackingService->isDeviceTrusted($user, $request);

                if (! $isDeviceTrusted) {
                    // إرسال إشعار للأجهزة الجديدة
                    $deviceInfo = $this->deviceTrackingService->getDeviceInfo($request);
                    $user->notify(new NewDeviceLoginNotification($deviceInfo, $request->ip()));

                    // حفظ الإشعار في قاعدة البيانات
                    SecurityNotification::create([
                        'user_id' => $user->id,
                        'type' => 'new_device',
                        'title' => 'تسجيل دخول من جهاز جديد',
                        'message' => 'تم تسجيل الدخول إلى حسابك من جهاز جديد: '.($deviceInfo['device_name'] ?? 'جهاز غير معروف'),
                        'device_info' => $deviceInfo,
                        'ip_address' => $request->ip(),
                    ]);

                    // إرسال رمز OTP
                    $this->twoFactorService->sendOtp($user);

                    // حفظ معرف المستخدم في الجلسة قبل تسجيل الخروج
                    $userId = $user->id;
                    $remember = $request->boolean('remember');

                    // حفظ معرف المستخدم في الجلسة قبل تسجيل الخروج
                    $request->session()->put('login.id', $userId);
                    $request->session()->put('login.remember', $remember);

                    // تسجيل الخروج مؤقتاً حتى يتم التحقق من OTP
                    Auth::logout();

                    // عدم استخدام regenerateToken() لأنه يحذف البيانات من الجلسة
                    // $request->session()->regenerateToken();

                    return redirect()->route('two-factor.challenge');
                }
            }

            return redirect()->intended('/dashboard');
        }

        throw ValidationException::withMessages([
            'email' => 'بيانات الدخول غير صحيحة',
        ]);
    }
}
