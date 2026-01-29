<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class TwoFactorEnabledNotification extends Notification
{
    use Queueable;

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('تم تفعيل المصادقة الثنائية - '.config('app.name'))
            ->view('emails.branded-ar', [
                'title' => 'تم تفعيل المصادقة الثنائية',
                'subtitle' => 'إشعار أمان',
                'greeting' => 'مرحباً '.$notifiable->name,
                'introLines' => [
                    'تم تفعيل المصادقة الثنائية (2FA) لحسابك بنجاح.',
                    'من الآن فصاعداً، عند تسجيل الدخول من أجهزة جديدة، سيتم إرسال رمز تحقق إضافي إلى بريدك الإلكتروني.',
                ],
                'actionText' => null,
                'actionUrl' => null,
                'outroLines' => [
                    'كيفية عمل المصادقة الثنائية:',
                    '1. عند تسجيل الدخول من جهاز جديد، سيتم إرسال رمز OTP (6 أرقام) إلى بريدك الإلكتروني',
                    '2. أدخل الرمز في صفحة التحقق لإكمال تسجيل الدخول',
                    '3. الرمز صالح لمدة 10 دقائق فقط',
                    '',
                    'إذا لم تكن أنت من قام بتفعيل هذه الميزة، يرجى الاتصال بالدعم الفني فوراً.',
                ],
                'salutation' => 'مع التحية، '.config('app.name'),
            ]);
    }

    public function toArray(object $notifiable): array
    {
        return [
            'type' => 'two_factor_enabled',
            'title' => 'تم تفعيل المصادقة الثنائية',
            'message' => 'تم تفعيل المصادقة الثنائية لحسابك بنجاح.',
            'device_info' => null,
            'ip_address' => null,
        ];
    }
}
