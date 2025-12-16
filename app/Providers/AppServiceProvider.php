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
            // Standard path where manifest should be (relative to public directory)
            $manifestPath = public_path('build/manifest.json');
            
            // Check if manifest exists in standard location
            if (file_exists($manifestPath)) {
                // Manifest exists, ensure Vite uses the correct build directory
                Vite::useBuildDirectory('build');
            } else {
                // Try alternative paths for shared hosting
                // Path 1: Direct public_html path (if public_html is the document root)
                $publicHtmlPath = str_replace('/public/', '/', public_path('build/manifest.json'));
                
                // Path 2: Base path with public
                $basePublicPath = base_path('public/build/manifest.json');
                
                // Path 3: Just build in base
                $baseBuildPath = base_path('build/manifest.json');
                
                $alternativePaths = [
                    $publicHtmlPath,
                    $basePublicPath,
                    $baseBuildPath,
                ];
                
                $found = false;
                $foundPath = null;
                
                foreach ($alternativePaths as $altPath) {
                    if (file_exists($altPath)) {
                        // Found manifest in alternative location
                        $foundPath = $altPath;
                        $found = true;
                        break;
                    }
                }
                
                if ($found && $foundPath) {
                    // Use build directory relative to where manifest was found
                    Vite::useBuildDirectory('build');
                    
                    // If manifest is in public_html directly (not public_html/public)
                    // we need to tell Vite to use the correct base path
                    if (str_contains($foundPath, '/public_html/build/') && !str_contains($foundPath, '/public_html/public/')) {
                        // The manifest is in public_html/build/, which is correct
                        // Vite should use 'build' as the directory
                        Vite::useBuildDirectory('build');
                    }
                } else {
                    // If manifest not found, log warning but don't break
                    \Log::warning('Vite manifest.json not found in expected locations', [
                        'searched_paths' => array_merge([$manifestPath], $alternativePaths),
                        'public_path' => public_path(),
                        'base_path' => base_path(),
                    ]);
                }
            }
        }
    }
}
