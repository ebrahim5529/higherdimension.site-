<?php

namespace App\Services;

use App\Models\TrustedDevice;
use App\Models\User;
use Illuminate\Http\Request;

class DeviceTrackingService
{
    public function generateDeviceHash(Request $request): string
    {
        $ipAddress = $request->ip();
        $userAgent = $request->userAgent() ?? '';

        // استخدام hash ثابت للجهاز نفسه
        return hash('sha256', $ipAddress.$userAgent);
    }

    public function getDeviceInfo(Request $request): array
    {
        return [
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent() ?? '',
            'device_name' => $this->extractDeviceName($request->userAgent() ?? ''),
        ];
    }

    public function isDeviceTrusted(User $user, Request $request): bool
    {
        $deviceHash = $this->generateDeviceHash($request);

        return $user->trustedDevices()
            ->where('device_hash', $deviceHash)
            ->exists();
    }

    public function trustDevice(User $user, Request $request, ?string $deviceName = null): TrustedDevice
    {
        $deviceHash = $this->generateDeviceHash($request);
        $deviceInfo = $this->getDeviceInfo($request);

        return $user->trustedDevices()->updateOrCreate(
            [
                'user_id' => $user->id,
                'device_hash' => $deviceHash,
            ],
            [
                'device_name' => $deviceName ?? $deviceInfo['device_name'],
                'ip_address' => $deviceInfo['ip_address'],
                'user_agent' => $deviceInfo['user_agent'],
                'last_used_at' => now(),
            ]
        );
    }

    protected function extractDeviceName(?string $userAgent): string
    {
        if (empty($userAgent)) {
            return 'جهاز غير معروف';
        }

        // استخراج اسم المتصفح
        if (preg_match('/Chrome\/([0-9.]+)/', $userAgent, $matches)) {
            return 'Chrome';
        }
        if (preg_match('/Firefox\/([0-9.]+)/', $userAgent, $matches)) {
            return 'Firefox';
        }
        if (preg_match('/Safari\/([0-9.]+)/', $userAgent, $matches)) {
            return 'Safari';
        }
        if (preg_match('/Edge\/([0-9.]+)/', $userAgent, $matches)) {
            return 'Edge';
        }

        return 'متصفح غير معروف';
    }
}
