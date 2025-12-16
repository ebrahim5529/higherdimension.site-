<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class FormatHtmlOutput
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        // Only format HTML responses
        if ($response->headers->get('Content-Type') && str_contains($response->headers->get('Content-Type'), 'text/html')) {
            $content = $response->getContent();

            if ($content) {
                // Add newlines between Vite-generated tags (self-closing and regular tags)
                // Handle: </link><link, </link><script, <link/><link, <link/><script
                $content = preg_replace(
                    '/(<\/link>|<link[^>]*\/>)(<link)/i',
                    '$1' . "\n    " . '$2',
                    $content
                );

                $content = preg_replace(
                    '/(<\/link>|<link[^>]*\/>)(<script)/i',
                    '$1' . "\n    " . '$2',
                    $content
                );

                $content = preg_replace(
                    '/(<\/script>)(<link)/i',
                    '$1' . "\n    " . '$2',
                    $content
                );

                $content = preg_replace(
                    '/(<\/script>)(<script)/i',
                    '$1' . "\n    " . '$2',
                    $content
                );

                // Also handle cases where tags are directly adjacent without closing tag
                $content = preg_replace(
                    '/(<link[^>]*\/>)(<link)/i',
                    '$1' . "\n    " . '$2',
                    $content
                );

                $content = preg_replace(
                    '/(<link[^>]*\/>)(<script)/i',
                    '$1' . "\n    " . '$2',
                    $content
                );

                $response->setContent($content);
            }
        }

        return $response;
    }
}

