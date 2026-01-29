<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RequireTwoFactor
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if ($user && $user->hasTwoFactorEnabled()) {
            // يمكن إضافة منطق إضافي هنا إذا لزم الأمر
            // على سبيل المثال، التحقق من أن المستخدم أكمل التحقق من 2FA في هذه الجلسة
        }

        return $next($request);
    }
}
