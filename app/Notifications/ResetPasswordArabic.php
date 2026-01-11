<?php

namespace App\Notifications;

use Illuminate\Auth\Notifications\ResetPassword as BaseResetPassword;
use Illuminate\Notifications\Messages\MailMessage;

class ResetPasswordArabic extends BaseResetPassword
{
    public function toMail($notifiable): MailMessage
    {
        $url = url(route('password.reset', [
            'token' => $this->token,
            'email' => $notifiable->getEmailForPasswordReset(),
        ], false));

        $expire = config('auth.passwords.' . config('auth.defaults.passwords') . '.expire');

        return (new MailMessage)
            ->subject('إعادة تعيين كلمة المرور - ' . config('app.name'))
            ->view('emails.branded-ar', [
                'title' => 'إعادة تعيين كلمة المرور',
                'subtitle' => 'إشعار أمان',
                'greeting' => 'مرحباً',
                'introLines' => [
                    'لقد استلمنا طلباً لإعادة تعيين كلمة المرور الخاصة بحسابك.',
                ],
                'actionText' => 'إعادة تعيين كلمة المرور',
                'actionUrl' => $url,
                'outroLines' => [
                    'ستنتهي صلاحية هذا الرابط خلال ' . $expire . ' دقيقة.',
                    'إذا لم تطلب إعادة تعيين كلمة المرور، يمكنك تجاهل هذه الرسالة بأمان.',
                ],
                'salutation' => 'مع التحية، ' . config('app.name'),
            ]);
    }
}
