<?php

namespace App\Http\Controllers;

use App\Models\SecurityNotification;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class SecurityNotificationController extends Controller
{
    public function index(): \Inertia\Response
    {
        $user = Auth::user();

        $notifications = $user->securityNotifications()
            ->latest()
            ->paginate(20);

        return Inertia::render('Dashboard/Notifications', [
            'notifications' => $notifications,
        ]);
    }

    public function markAsRead(SecurityNotification $notification): \Illuminate\Http\RedirectResponse
    {
        $user = Auth::user();

        if ($notification->user_id !== $user->id) {
            abort(403);
        }

        $notification->markAsRead();

        return back()->with('success', 'تم تحديد الإشعار كمقروء');
    }

    public function markAllAsRead(): \Illuminate\Http\RedirectResponse
    {
        $user = Auth::user();

        $user->securityNotifications()
            ->unread()
            ->update(['read_at' => now()]);

        return back()->with('success', 'تم تحديد جميع الإشعارات كمقروءة');
    }

    public function destroy(SecurityNotification $notification): \Illuminate\Http\RedirectResponse
    {
        $user = Auth::user();

        if ($notification->user_id !== $user->id) {
            abort(403);
        }

        $notification->delete();

        return back()->with('success', 'تم حذف الإشعار');
    }
}
