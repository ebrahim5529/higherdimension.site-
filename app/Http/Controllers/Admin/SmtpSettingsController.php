<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AppSetting;
use Symfony\Component\Mailer\Transport;
use Symfony\Component\Mailer\Mailer;
use Symfony\Component\Mailer\Exception\TransportExceptionInterface;
use Symfony\Component\Mime\Email;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SmtpSettingsController extends Controller
{
    public function index()
    {
        return Inertia::render('SmtpSettings', [
            'settings' => [
                'mail_mailer' => AppSetting::getValue('mail_mailer', 'smtp'),
                'mail_host' => AppSetting::getValue('mail_host', ''),
                'mail_port' => AppSetting::getValue('mail_port', ''),
                'mail_username' => AppSetting::getValue('mail_username', ''),
                'mail_password' => '',
                'mail_encryption' => AppSetting::getValue('mail_encryption', 'tls'),
                'mail_from_address' => AppSetting::getValue('mail_from_address', ''),
                'mail_from_name' => AppSetting::getValue('mail_from_name', ''),
            ],
        ]);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'mail_mailer' => ['required', 'in:smtp'],
            'mail_host' => ['required', 'string', 'max:255', 'not_regex:/@/'],
            'mail_port' => ['required', 'integer', 'min:1', 'max:65535'],
            'mail_username' => ['nullable', 'string', 'max:255'],
            'mail_password' => ['nullable', 'string', 'max:255'],
            'mail_encryption' => ['nullable', 'in:tls,ssl,null'],
            'mail_from_address' => ['required', 'email', 'max:255'],
            'mail_from_name' => ['required', 'string', 'max:255'],
        ], [
            'mail_host.not_regex' => 'SMTP Host يجب أن يكون اسم خادم مثل smtp.gmail.com وليس بريد إلكتروني',
        ]);

        $validated['mail_encryption'] = $validated['mail_encryption'] ?? 'tls';
        if (($validated['mail_encryption'] ?? null) === 'null') {
            $validated['mail_encryption'] = '';
        }

        if (! array_key_exists('mail_password', $validated) || $validated['mail_password'] === '' || $validated['mail_password'] === null) {
            unset($validated['mail_password']);
        }

        foreach ($validated as $key => $value) {
            AppSetting::setValue($key, (string) ($value ?? ''));
        }

        return redirect()->back()->with('success', 'تم حفظ إعدادات SMTP بنجاح');
    }

    public function test(Request $request)
    {
        $validated = $request->validate([
            'to' => ['required', 'email', 'max:255'],
        ]);

        $host = (string) AppSetting::getValue('mail_host', '');
        $port = (int) AppSetting::getValue('mail_port', 587);
        $username = (string) AppSetting::getValue('mail_username', '');
        $password = (string) AppSetting::getValue('mail_password', '');
        $encryption = (string) AppSetting::getValue('mail_encryption', 'tls');
        $fromAddress = (string) AppSetting::getValue('mail_from_address', '');
        $fromName = (string) AppSetting::getValue('mail_from_name', '');

        if ($host === '' || $fromAddress === '') {
            return redirect()->back()->with('error', 'يرجى حفظ إعدادات SMTP أولاً');
        }

        $scheme = 'smtp';
        if ($encryption === 'ssl') {
            $scheme = 'smtps';
        }

        $transportDsn = $scheme.'://'.rawurlencode($username).':'.rawurlencode($password).'@'.$host.':'.$port;

        try {
            $transport = Transport::fromDsn($transportDsn);
            $mailer = new Mailer($transport);

            $email = (new Email())
                ->from($fromName !== '' ? sprintf('%s <%s>', $fromName, $fromAddress) : $fromAddress)
                ->to($validated['to'])
                ->subject('SMTP Test Email')
                ->text('This is a test email sent from Higher Dimension SMTP settings page.');

            $mailer->send($email);

            return redirect()->back()->with('success', 'تم إرسال رسالة اختبار بنجاح');
        } catch (TransportExceptionInterface $e) {
            return redirect()->back()->with('error', 'فشل اختبار SMTP: '.$e->getMessage());
        } catch (\Throwable $e) {
            return redirect()->back()->with('error', 'فشل اختبار SMTP');
        }
    }
}
