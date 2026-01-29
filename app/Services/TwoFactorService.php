<?php

namespace App\Services;

use App\Models\User;
use App\Notifications\TwoFactorOtpNotification;
use Illuminate\Support\Facades\Hash;

class TwoFactorService
{
    public function enable(User $user): bool
    {
        return $user->update([
            'two_factor_enabled' => true,
        ]);
    }

    public function disable(User $user): bool
    {
        return $user->update([
            'two_factor_enabled' => false,
            'two_factor_otp' => null,
            'two_factor_otp_expires_at' => null,
        ]);
    }

    public function generateOtp(): string
    {
        return str_pad((string) random_int(0, 999999), 6, '0', STR_PAD_LEFT);
    }

    public function sendOtp(User $user): string
    {
        $otp = $this->generateOtp();
        $expiresAt = now()->addMinutes(10);

        $user->update([
            'two_factor_otp' => Hash::make($otp),
            'two_factor_otp_expires_at' => $expiresAt,
        ]);

        // إرسال OTP للبريد الإلكتروني
        $user->notify(new TwoFactorOtpNotification($otp));

        return $otp;
    }

    public function verifyOtp(User $user, string $otp): bool
    {
        if (! $user->two_factor_otp || ! $user->two_factor_otp_expires_at) {
            return false;
        }

        if ($user->two_factor_otp_expires_at->isPast()) {
            return false;
        }

        if (! Hash::check($otp, $user->two_factor_otp)) {
            return false;
        }

        // حذف OTP بعد الاستخدام الناجح
        $user->update([
            'two_factor_otp' => null,
            'two_factor_otp_expires_at' => null,
        ]);

        return true;
    }

    public function isOtpValid(User $user): bool
    {
        if (! $user->two_factor_otp || ! $user->two_factor_otp_expires_at) {
            return false;
        }

        return ! $user->two_factor_otp_expires_at->isPast();
    }
}
