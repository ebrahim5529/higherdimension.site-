<?php

namespace App\Providers;

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
    }
}
