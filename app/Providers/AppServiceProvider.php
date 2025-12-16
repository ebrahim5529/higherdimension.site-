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
        // On Hostinger, Document Root is public_html (not public_html/public)
        // Laravel's public_path() returns: /home/.../public_html/public/build/manifest.json
        // But actual path is: /home/.../public_html/build/manifest.json
        if (app()->environment('production')) {
            // Try to find manifest in correct location
            // Path 1: Standard Laravel path
            $standardPath = public_path('build/manifest.json');
            
            // Path 2: Direct public_html path (for shared hosting)
            $publicHtmlPath = str_replace('/public/', '/', $standardPath);
            
            // Path 3: Base path with public
            $basePublicPath = base_path('public/build/manifest.json');
            
            $manifestPath = null;
            
            // Check which path exists
            if (file_exists($standardPath)) {
                $manifestPath = $standardPath;
            } elseif (file_exists($publicHtmlPath)) {
                $manifestPath = $publicHtmlPath;
            } elseif (file_exists($basePublicPath)) {
                $manifestPath = $basePublicPath;
            }
            
            if ($manifestPath) {
                // Manifest found, configure Vite
                Vite::useBuildDirectory('build');
                
                // If manifest is in public_html directly (not public_html/public)
                // we need to customize the asset path generation
                if (str_contains($manifestPath, '/public_html/build/') && !str_contains($manifestPath, '/public_html/public/')) {
                    // Customize asset paths to remove /public/ from URLs
                    Vite::createAssetPathsUsing(function (string $path, ?bool $secure) {
                        // Remove /public/ from the path if it exists
                        $path = str_replace('/public/', '/', $path);
                        return asset($path, $secure);
                    });
                }
            } else {
                // If manifest not found, log warning
                \Log::warning('Vite manifest.json not found', [
                    'searched_paths' => [$standardPath, $publicHtmlPath, $basePublicPath],
                    'public_path' => public_path(),
                    'base_path' => base_path(),
                ]);
            }
        }
    }
}
