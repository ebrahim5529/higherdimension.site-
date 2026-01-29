<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user();

        $unreadNotificationsCount = 0;
        if ($user) {
            try {
                $unreadNotificationsCount = $user->securityNotifications()
                    ->unread()
                    ->count();
            } catch (\Exception $e) {
                // تجاهل الأخطاء في حالة عدم وجود علاقة أو جدول
                $unreadNotificationsCount = 0;
            }
        }

        $authData = null;
        if ($user) {
            try {
                $authData = [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'roles' => $user->roles->pluck('name')->toArray(),
                    'permissions' => $user->getAllPermissions()->pluck('name')->toArray(),
                    'two_factor_enabled' => $user->hasTwoFactorEnabled(),
                ];
            } catch (\Exception $e) {
                // في حالة وجود خطأ، نعيد null
                $authData = null;
            }
        }

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $authData,
            ],
            'flash' => [
                'success' => $request->session()->get('success'),
                'error' => $request->session()->get('error'),
            ],
            'unreadNotificationsCount' => $unreadNotificationsCount,
        ];
    }
}
