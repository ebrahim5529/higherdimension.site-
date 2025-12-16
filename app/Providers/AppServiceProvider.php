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
        // Ensure Vite uses the standard build directory
        // This is the default, but we set it explicitly to avoid issues
        Vite::useBuildDirectory('build');
    }
}
