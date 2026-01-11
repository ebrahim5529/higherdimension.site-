<?php

namespace App\Providers;

use App\Models\AppSetting;
use Illuminate\Mail\MailManager;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        // Register Fortify Login View Response for Inertia
        $this->app->singleton(
            \Laravel\Fortify\Contracts\LoginViewResponse::class,
            \App\Http\Responses\LoginResponse::class
        );
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Check if manifest exists in build directory (standard Laravel Vite location)
        $buildManifestPath = public_path('build/manifest.json');
        $assetsManifestPath = public_path('assets/manifest.json');

        // If manifest is in assets directory (shared hosting setup), use that
        if (file_exists($assetsManifestPath) && ! file_exists($buildManifestPath)) {
            Vite::useBuildDirectory('assets');
            Vite::useManifestPath($assetsManifestPath);
        } else {
            // Use standard build directory
            Vite::useBuildDirectory('build');
        }

        $host = (string) AppSetting::getValue('mail_host', '');
        if ($host !== '') {
            $encryption = AppSetting::getValue('mail_encryption', 'tls');
            if ($encryption === '') {
                $encryption = null;
            }

            config([
                'mail.default' => 'smtp',
                'mail.mailers.smtp.transport' => 'smtp',
                'mail.mailers.smtp.host' => $host,
                'mail.mailers.smtp.port' => (int) AppSetting::getValue('mail_port', 587),
                'mail.mailers.smtp.encryption' => $encryption,
                'mail.mailers.smtp.username' => (string) AppSetting::getValue('mail_username', ''),
                'mail.mailers.smtp.password' => (string) AppSetting::getValue('mail_password', ''),
                'mail.from.address' => (string) AppSetting::getValue('mail_from_address', config('mail.from.address')),
                'mail.from.name' => (string) AppSetting::getValue('mail_from_name', config('mail.from.name')),
            ]);

            try {
                $this->app->make(MailManager::class)->forgetMailers();
            } catch (\Throwable $e) {
            }
        }
    }
}
