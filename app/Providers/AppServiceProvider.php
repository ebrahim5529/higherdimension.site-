<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Vite;

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
        // Fix Vite manifest path for Hostinger shared hosting
        // The manifest.json should be in public/build/manifest.json
        // But if Document Root is public_html/public, Laravel will look in the correct place
        // This ensures the path is correctly resolved
        if (app()->environment('production')) {
            $manifestPath = public_path('build/manifest.json');
            
            // If manifest doesn't exist in standard location, check alternative paths
            if (!file_exists($manifestPath)) {
                // Try base_path/public/build/manifest.json
                $altPath1 = base_path('public/build/manifest.json');
                if (file_exists($altPath1)) {
                    // Path is correct, just ensure Vite uses the right directory
                    Vite::useBuildDirectory('build');
                } else {
                    // Try build/manifest.json (if Document Root is public_html/public)
                    $altPath2 = base_path('build/manifest.json');
                    if (file_exists($altPath2)) {
                        Vite::useBuildDirectory('build');
                    }
                }
            }
        }
    }
}
