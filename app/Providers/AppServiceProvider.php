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
        // On Hostinger, Document Root is public_html/public, so Laravel searches in:
        // /home/u183760739/domains/higherdimension.site/public_html/public/build/manifest.json
        // The manifest.json should be in public/build/manifest.json relative to project root
        // We need to ensure the path is correctly resolved
        if (app()->environment('production')) {
            // Standard path where manifest should be (relative to public directory)
            $manifestPath = public_path('build/manifest.json');
            
            // Check if manifest exists in standard location
            if (file_exists($manifestPath)) {
                // Manifest exists, ensure Vite uses the correct build directory
                Vite::useBuildDirectory('build');
            } else {
                // Try alternative paths
                $alternativePaths = [
                    base_path('public/build/manifest.json'),
                    base_path('build/manifest.json'),
                ];
                
                $found = false;
                foreach ($alternativePaths as $altPath) {
                    if (file_exists($altPath)) {
                        // Found manifest in alternative location
                        // Use build directory relative to where manifest was found
                        Vite::useBuildDirectory('build');
                        $found = true;
                        break;
                    }
                }
                
                // If manifest not found, log warning but don't break
                if (!$found) {
                    \Log::warning('Vite manifest.json not found in expected locations', [
                        'searched_paths' => array_merge([$manifestPath], $alternativePaths),
                    ]);
                }
            }
        }
    }
}
