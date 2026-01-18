<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ConvertNumeralsToEnglish
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $input = $request->all();

        if (!empty($input)) {
            $input = $this->convertNumerals($input);
            $request->merge($input);
        }

        return $next($request);
    }

    /**
     * Recursively convert Arabic numerals to English numerals in array/strings.
     */
    private function convertNumerals($data)
    {
        if (is_string($data)) {
            return $this->replaceNumerals($data);
        }

        if (is_array($data)) {
            return array_map([$this, 'convertNumerals'], $data);
        }

        return $data;
    }

    private function replaceNumerals($string)
    {
        $arabic = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
        $english = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

        return str_replace($arabic, $english, $string);
    }
}
