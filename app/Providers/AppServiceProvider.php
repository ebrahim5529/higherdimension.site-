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
        $this->configureViteForSharedHosting();
    }

    /**
     * Configure Vite for shared hosting environments (like Hostinger).
     *
     * On shared hosting, the document root is typically public_html,
     * and Laravel's public folder contents should be in public_html directly.
     */
    private function configureViteForSharedHosting(): void
    {
        // Get all possible manifest paths
        $possiblePaths = $this->getPossibleManifestPaths();

        // Find the first existing manifest path
        $manifestPath = null;
        foreach ($possiblePaths as $path) {
            if (file_exists($path)) {
                $manifestPath = $path;
                break;
            }
        }

        if ($manifestPath) {
            // Configure Vite with the found manifest
            $this->configureViteWithManifest($manifestPath);
        } else {
            // If manifest not found, try to handle gracefully
            $this->handleMissingManifest($possiblePaths);
        }
    }

    /**
     * Get all possible paths where manifest.json might be located.
     */
    private function getPossibleManifestPaths(): array
    {
        $paths = [];

        // Path 1: Standard Laravel path (public/build/manifest.json)
        $paths[] = public_path('build/manifest.json');

        // Path 2: Direct public_html path (for shared hosting where public_html = document root)
        $standardPath = public_path('build/manifest.json');
        $publicHtmlPath = str_replace('/public/', '/', $standardPath);
        if ($publicHtmlPath !== $standardPath) {
            $paths[] = $publicHtmlPath;
        }

        // Path 3: Base path with public
        $paths[] = base_path('public/build/manifest.json');

        // Path 4: Check if we're in public_html directly (common in shared hosting)
        $basePath = base_path();
        if (str_contains($basePath, 'public_html')) {
            // Try public_html/build/manifest.json
            $paths[] = str_replace('/public_html/public/', '/public_html/', $standardPath);
            $paths[] = str_replace('/public_html/public/', '/public_html/', base_path('public/build/manifest.json'));
        }

        // Path 5: Absolute path from document root
        if (isset($_SERVER['DOCUMENT_ROOT'])) {
            $docRoot = $_SERVER['DOCUMENT_ROOT'];
            $paths[] = rtrim($docRoot, '/').'/build/manifest.json';
        }

        // Remove duplicates and return
        return array_unique(array_filter($paths));
    }

    /**
     * Configure Vite with the found manifest path.
     */
    private function configureViteWithManifest(string $manifestPath): void
    {
        // Set build directory
        Vite::useBuildDirectory('build');

        // Check if we need to customize asset paths for shared hosting
        $isSharedHosting = $this->isSharedHostingSetup($manifestPath);

        if ($isSharedHosting) {
            // Customize asset paths to work with shared hosting
            Vite::createAssetPathsUsing(function (string $path, ?bool $secure) {
                // Remove /public/ from the path if it exists (for shared hosting)
                $path = str_replace('/public/', '/', $path);
                // Ensure path starts with /
                if (! str_starts_with($path, '/')) {
                    $path = '/'.$path;
                }

                return asset($path, $secure);
            });
        }
    }

    /**
     * Check if this is a shared hosting setup.
     */
    private function isSharedHostingSetup(string $manifestPath): bool
    {
        // Check if manifest is in public_html directly (not public_html/public)
        return (
            str_contains($manifestPath, '/public_html/build/') &&
            ! str_contains($manifestPath, '/public_html/public/')
        ) || (
            str_contains($manifestPath, '/domains/') &&
            str_contains($manifestPath, '/public_html/')
        );
    }

    /**
     * Handle missing manifest.json gracefully.
     */
    private function handleMissingManifest(array $searchedPaths): void
    {
        // Log detailed information for debugging
        \Log::warning('Vite manifest.json not found', [
            'searched_paths' => $searchedPaths,
            'public_path' => public_path(),
            'base_path' => base_path(),
            'document_root' => $_SERVER['DOCUMENT_ROOT'] ?? 'not set',
            'environment' => app()->environment(),
        ]);

        // In production, we should fail gracefully
        // The @vite directive will throw an exception, but we can catch it
        // For now, we'll let it fail so the developer knows to build assets
        if (app()->environment('production')) {
            // Optionally, you could create a fallback here
            // For example, use CDN or static assets
        }
    }
}
