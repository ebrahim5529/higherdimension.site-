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
        // We need to specify the correct manifest path
        if (app()->environment('production')) {
            // Standard path where manifest should be
            $manifestPath = public_path('build/manifest.json');
            
            // If manifest exists in standard location, use it
            if (file_exists($manifestPath)) {
                // Ensure Vite uses the correct build directory
                Vite::useBuildDirectory('build');
            } else {
                // Try to find manifest in alternative locations
                $possiblePaths = [
                    base_path('public/build/manifest.json'),
                    base_path('build/manifest.json'),
                ];
                
                foreach ($possiblePaths as $path) {
                    if (file_exists($path)) {
                        // Use absolute path for manifest
                        Vite::useManifestFilename($path);
                        break;
                    }
                }
            }
        }
    }
}
