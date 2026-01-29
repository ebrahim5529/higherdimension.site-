<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class NewDeviceLoginNotification extends Notification
{
    use Queueable;

    public function __construct(
        private readonly array $deviceInfo,
        private readonly string $ipAddress,
    ) {}

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $deviceName = $this->deviceInfo['device_name'] ?? 'جهاز غير معروف';
        $userAgent = $this->deviceInfo['user_agent'] ?? 'غير معروف';

        return (new MailMessage)
            ->subject('تسجيل دخول من جهاز جديد - '.config('app.name'))
            ->view('emails.branded-ar', [
                'title' => 'تسجيل دخول من جهاز جديد',
                'subtitle' => 'إشعار أمان',
                'greeting' => 'مرحباً '.$notifiable->name,
                'introLines' => [
                    'تم تسجيل الدخول إلى حسابك من جهاز جديد.',
                    'إذا كنت أنت من قام بتسجيل الدخول، يمكنك تجاهل هذه الرسالة.',
                ],
                'actionText' => null,
                'actionUrl' => null,
                'outroLines' => [
                    'معلومات الجهاز:',
                    'اسم الجهاز: '.$deviceName,
                    'عنوان IP: '.$this->ipAddress,
                    'المتصفح: '.$userAgent,
                    'التاريخ والوقت: '.now()->format('Y-m-d H:i:s'),
                    '',
                    'إذا لم تكن أنت من قام بتسجيل الدخول، يرجى تغيير كلمة المرور فوراً.',
                ],
                'salutation' => 'مع التحية، '.config('app.name'),
            ]);
    }

    public function toArray(object $notifiable): array
    {
        return [
            'type' => 'new_device',
            'title' => 'تسجيل دخول من جهاز جديد',
            'message' => 'تم تسجيل الدخول إلى حسابك من جهاز جديد: '.($this->deviceInfo['device_name'] ?? 'جهاز غير معروف'),
            'device_info' => $this->deviceInfo,
            'ip_address' => $this->ipAddress,
        ];
    }
}
