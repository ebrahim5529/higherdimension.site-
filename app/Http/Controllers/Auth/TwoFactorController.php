<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Services\TwoFactorService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class TwoFactorController extends Controller
{
    public function __construct(
        private readonly TwoFactorService $twoFactorService,
    ) {}

    public function show(Request $request): \Inertia\Response|\Illuminate\Http\RedirectResponse
    {
        $userId = $request->session()->get('login.id');

        if (! $userId) {
            return redirect()->route('login');
        }

        $user = \App\Models\User::find($userId);

        if (! $user || ! $user->hasTwoFactorEnabled()) {
            $request->session()->forget('login.id');

            return redirect()->route('login');
        }

        // التحقق من وجود OTP صالح، وإذا لم يكن موجوداً، إرسال واحد جديد
        if (! $this->twoFactorService->isOtpValid($user)) {
            $this->twoFactorService->sendOtp($user);
            $user->refresh(); // تحديث بيانات المستخدم من قاعدة البيانات
        }

        $expiresAt = $user->two_factor_otp_expires_at;

        return Inertia::render('Auth/TwoFactorChallenge', [
            'email' => $user->email,
            'expires_at' => $expiresAt?->timestamp,
        ]);
    }

    public function verify(Request $request): \Illuminate\Http\RedirectResponse
    {
        $request->validate([
            'code' => ['required', 'string', 'size:6'],
        ], [
            'code.required' => 'يرجى إدخال رمز التحقق',
            'code.size' => 'رمز التحقق يجب أن يكون 6 أرقام',
        ]);

        $userId = $request->session()->get('login.id');

        if (! $userId) {
            return redirect()->route('login');
        }

        $user = \App\Models\User::find($userId);

        if (! $user) {
            $request->session()->forget('login.id');

            return redirect()->route('login');
        }

        $key = 'two-factor-verify:'.$user->id.':'.$request->ip();

        if (RateLimiter::tooManyAttempts($key, 5)) {
            $seconds = RateLimiter::availableIn($key);
            throw ValidationException::withMessages([
                'code' => 'تم تجاوز عدد المحاولات المسموح بها. يرجى المحاولة مرة أخرى بعد '.ceil($seconds / 60).' دقيقة.',
            ]);
        }

        RateLimiter::hit($key, 60);

        if (! $this->twoFactorService->verifyOtp($user, $request->input('code'))) {
            throw ValidationException::withMessages([
                'code' => 'رمز التحقق غير صحيح أو منتهي الصلاحية',
            ]);
        }

        RateLimiter::clear($key);

        // إعادة تسجيل الدخول
        $remember = $request->session()->get('login.remember', false);
        Auth::login($user, $remember);
        $request->session()->forget('login.id');
        $request->session()->forget('login.remember');
        $request->session()->regenerate();

        // حفظ الجهاز كجهاز موثوق
        app(\App\Services\DeviceTrackingService::class)->trustDevice($user, $request);

        return redirect()->intended('/dashboard');
    }

    public function resend(Request $request): \Illuminate\Http\RedirectResponse
    {
        $userId = $request->session()->get('login.id');

        if (! $userId) {
            return redirect()->route('login');
        }

        $user = \App\Models\User::find($userId);

        if (! $user || ! $user->hasTwoFactorEnabled()) {
            $request->session()->forget('login.id');

            return redirect()->route('login');
        }

        $key = 'two-factor-resend:'.$user->id.':'.$request->ip();

        if (RateLimiter::tooManyAttempts($key, 3)) {
            $seconds = RateLimiter::availableIn($key);

            return back()->withErrors([
                'message' => 'تم تجاوز عدد المحاولات المسموح بها. يرجى المحاولة مرة أخرى بعد '.ceil($seconds / 60).' دقيقة.',
            ]);
        }

        RateLimiter::hit($key, 3600);

        $this->twoFactorService->sendOtp($user);

        return back()->with('success', 'تم إرسال رمز التحقق إلى بريدك الإلكتروني');
    }
}
