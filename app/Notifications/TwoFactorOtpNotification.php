<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class TwoFactorOtpNotification extends Notification
{
    use Queueable;

    public function __construct(
        private readonly string $otp,
    ) {}

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('رمز التحقق للمصادقة الثنائية - '.config('app.name'))
            ->view('emails.branded-ar', [
                'title' => 'رمز التحقق للمصادقة الثنائية',
                'subtitle' => 'إشعار أمان',
                'greeting' => 'مرحباً '.$notifiable->name,
                'introLines' => [
                    'تم طلب رمز التحقق لتسجيل الدخول إلى حسابك.',
                    'استخدم الرمز التالي لإكمال عملية تسجيل الدخول:',
                ],
                'actionText' => null,
                'actionUrl' => null,
                'outroLines' => [
                    '<div style="text-align: center; margin: 30px 0;">',
                    '<div style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 3px; border-radius: 12px; box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);">',
                    '<div style="background: #ffffff; border-radius: 10px; padding: 25px 40px;">',
                    '<div style="font-family: \'Courier New\', monospace; font-size: 42px; font-weight: 700; letter-spacing: 12px; color: #1e40af; text-align: center; direction: ltr; line-height: 1.2;">'.$this->otp.'</div>',
                    '</div>',
                    '</div>',
                    '</div>',
                    '<div style="text-align: center; margin: 20px 0 10px 0;">',
                    '<div style="display: inline-block; background-color: #fef3c7; border-right: 4px solid #f59e0b; padding: 12px 20px; border-radius: 8px;">',
                    '<div style="font-family: Tahoma, Arial, sans-serif; font-size: 13px; color: #92400e; font-weight: 600;">⏱️ هذا الرمز صالح لمدة 10 دقائق فقط</div>',
                    '</div>',
                    '</div>',
                    '',
                    '<div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 18px; margin: 20px 0;">',
                    '<div style="font-family: Tahoma, Arial, sans-serif; font-size: 13px; color: #475569; line-height: 1.8;">',
                    '<div style="margin-bottom: 8px;"><strong style="color: #1e40af;">🔒 ملاحظات أمنية مهمة:</strong></div>',
                    '<div style="margin-right: 20px; margin-bottom: 6px;">• لا تشارك هذا الرمز مع أي شخص، حتى لو طلب منك ذلك</div>',
                    '<div style="margin-right: 20px; margin-bottom: 6px;">• إذا لم تطلب هذا الرمز، يرجى تجاهل هذه الرسالة فوراً</div>',
                    '<div style="margin-right: 20px;">• في حالة الشك، قم بتغيير كلمة المرور فوراً</div>',
                    '</div>',
                    '</div>',
                    '',
                    '<div style="font-family: Tahoma, Arial, sans-serif; font-size: 13px; color: #64748b; text-align: center; margin-top: 20px;">',
                    'إذا كنت تواجه مشاكل في تسجيل الدخول، يمكنك طلب إرسال رمز جديد من صفحة تسجيل الدخول.',
                    '</div>',
                ],
                'salutation' => 'مع التحية، '.config('app.name'),
            ]);
    }
}
