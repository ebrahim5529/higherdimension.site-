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
        // التحقق من وجود login.id في الجلسة
        $userId = $request->session()->get('login.id');

        if (! $userId) {
            \Log::warning('TwoFactorChallenge: No login.id in session', [
                'session_id' => $request->session()->getId(),
                'session_data' => $request->session()->all(),
            ]);

            return redirect()->route('login')->with('error', 'انتهت صلاحية الجلسة. يرجى تسجيل الدخول مرة أخرى.');
        }

        $user = \App\Models\User::find($userId);

        if (! $user) {
            \Log::warning('TwoFactorChallenge: User not found', [
                'user_id' => $userId,
                'session_id' => $request->session()->getId(),
            ]);
            $request->session()->forget('login.id');

            return redirect()->route('login')->with('error', 'المستخدم غير موجود. يرجى تسجيل الدخول مرة أخرى.');
        }

        if (! $user->hasTwoFactorEnabled()) {
            \Log::warning('TwoFactorChallenge: 2FA not enabled for user', [
                'user_id' => $userId,
                'session_id' => $request->session()->getId(),
            ]);
            $request->session()->forget('login.id');

            return redirect()->route('login')->with('error', 'المصادقة الثنائية غير مفعّلة لحسابك.');
        }

        // التحقق من وجود OTP صالح، وإذا لم يكن موجوداً، إرسال واحد جديد
        // فقط إذا لم يتم إرسال OTP في هذه الجلسة مؤخراً (خلال آخر دقيقة)
        $lastOtpSent = $request->session()->get('two_factor.otp_sent_at');
        $shouldSendOtp = false;

        if (! $this->twoFactorService->isOtpValid($user)) {
            // التحقق من أنه لم يتم إرسال OTP في آخر دقيقة
            if (! $lastOtpSent) {
                $shouldSendOtp = true;
            } else {
                $lastSentTime = is_string($lastOtpSent) ? \Carbon\Carbon::parse($lastOtpSent) : $lastOtpSent;
                $secondsSinceLastSent = now()->diffInSeconds($lastSentTime);

                if ($secondsSinceLastSent > 60) {
                    $shouldSendOtp = true;
                } else {
                    \Log::info('TwoFactorChallenge: OTP already sent recently, skipping', [
                        'user_id' => $userId,
                        'session_id' => $request->session()->getId(),
                        'last_sent' => $lastOtpSent,
                        'seconds_ago' => $secondsSinceLastSent,
                    ]);
                }
            }

            if ($shouldSendOtp) {
                \Log::info('TwoFactorChallenge: OTP expired or missing, sending new OTP', [
                    'user_id' => $userId,
                    'session_id' => $request->session()->getId(),
                ]);
                $this->twoFactorService->sendOtp($user);
                $request->session()->put('two_factor.otp_sent_at', now()->toDateTimeString());
                $user->refresh(); // تحديث بيانات المستخدم من قاعدة البيانات
            }
        }

        $expiresAt = $user->two_factor_otp_expires_at;

        \Log::info('TwoFactorChallenge: Rendering challenge page', [
            'user_id' => $userId,
            'email' => $user->email,
            'expires_at' => $expiresAt?->toDateTimeString(),
            'session_id' => $request->session()->getId(),
        ]);

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
        $request->session()->forget('two_factor.otp_sent_at');
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
        $request->session()->put('two_factor.otp_sent_at', now()->toDateTimeString());

        return back()->with('success', 'تم إرسال رمز التحقق إلى بريدك الإلكتروني');
    }
}
