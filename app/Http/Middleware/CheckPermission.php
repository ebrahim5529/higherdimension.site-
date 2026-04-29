<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class CheckPermission
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, string $permission): Response
    {
        if (! Auth::check()) {
            return redirect()->route('login');
        }

        $user = Auth::user();

        if (! $user || ! $this->userHasAnyPermission($user, $permission)) {
            // إذا لم يكن لديه صلاحية: وجّه لأقرب صفحة مسموحة له
            // (بدون هذا التعديل قد يعود المستخدم لنفس صفحة dashboard ويقع في لخبطة/حلقة redirect)
            $targetRouteName = $this->getFirstAllowedDashboardRouteName($user);

            return redirect()->route($targetRouteName)->with('error', 'ليس لديك صلاحية للوصول إلى هذه الصفحة');
        }

        return $next($request);
    }

    private function userHasAnyPermission($user, string $permission): bool
    {
        // ملاحظة: هذا middleware يدعم صيغة `permission:permA|permB` كـ OR
        $permissions = array_map('trim', explode('|', $permission));

        foreach ($permissions as $perm) {
            if ($perm !== '' && $user->hasPermissionTo($perm)) {
                return true;
            }
        }

        return false;
    }

    private function getFirstAllowedDashboardRouteName(object $user): string
    {
        // ترتيب الأولويات مطابق لقائمة Sidebar: الرئيسية -> التفاعلية -> المالية -> التشغيل -> العملاء

        if ($user->hasPermissionTo('access-main-dashboard')) {
            return 'dashboard';
        }

        $hasDashboardReports = $user->hasPermissionTo('access-dashboard-reports');

        if ($user->hasPermissionTo('access-dashboard-interactive') || $hasDashboardReports) {
            return 'dashboard.interactive';
        }

        if ($user->hasPermissionTo('access-financial-reports') || $hasDashboardReports) {
            return 'reports.financial';
        }

        if ($user->hasPermissionTo('access-operations-reports') || $hasDashboardReports) {
            return 'reports.operations';
        }

        if ($user->hasPermissionTo('access-customer-reports') || $hasDashboardReports) {
            return 'reports.customers';
        }

        // fallback آمن: صفحة Profile لا تعتمد permission بعكس باقي صفحات dashboard
        return 'profile.show';
    }
}
