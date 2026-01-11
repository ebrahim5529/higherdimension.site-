<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;

class NewUserCreatedArabic extends Notification
{
    use Queueable;

    public function __construct(
        private readonly string $plainPassword,
        private readonly array $roles,
        private readonly array $permissions,
    ) {
    }

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $loginUrl = url('/login');

        $listItems = [
            'البريد الإلكتروني: ' . ($notifiable->email ?? ''),
            'كلمة المرور: ' . $this->plainPassword,
        ];

        if (! empty($this->roles)) {
            $listItems[] = 'الوظيفة/الأدوار: ' . implode('، ', $this->roles);
        }

        if (! empty($this->permissions)) {
            $listItems[] = 'الصلاحيات: ' . implode('، ', $this->permissions);
        }

        return (new MailMessage)
            ->subject('تم إنشاء حسابك - ' . config('app.name'))
            ->view('emails.branded-ar', [
                'title' => 'تم إنشاء حسابك',
                'subtitle' => 'بيانات الدخول والصلاحيات',
                'greeting' => 'مرحباً ' . ($notifiable->name ?? ''),
                'introLines' => [
                    'تم إنشاء حساب جديد لك على النظام. يمكنك تسجيل الدخول باستخدام البيانات التالية:',
                ],
                'listItems' => $listItems,
                'actionText' => 'تسجيل الدخول',
                'actionUrl' => $loginUrl,
                'outroLines' => [
                    'ننصح بتغيير كلمة المرور بعد تسجيل الدخول مباشرة.',
                ],
                'salutation' => 'مع التحية، ' . config('app.name'),
            ]);
    }
}
