<?php

namespace App\Http\Controllers;

use App\Actions\Fortify\UpdateUserPassword;
use App\Actions\Fortify\UpdateUserProfileInformation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ProfileController extends Controller
{
    public function show(): \Inertia\Response
    {
        $user = Auth::user();

        return Inertia::render('Profile/Index', [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone,
                'roles' => $user->roles->pluck('name'),
                'permissions' => $user->getAllPermissions()->pluck('name'),
            ],
        ]);
    }

    public function updateProfile(Request $request): \Illuminate\Http\RedirectResponse
    {
        $user = Auth::user();

        $updater = app(UpdateUserProfileInformation::class);
        $updater->update($user, $request->all());

        return back()->with('success', 'تم تحديث معلومات الملف الشخصي بنجاح');
    }

    public function changePassword(Request $request): \Illuminate\Http\RedirectResponse
    {
        $user = Auth::user();

        $updater = app(UpdateUserPassword::class);
        $updater->update($user, $request->all());

        return back()->with('success', 'تم تغيير كلمة المرور بنجاح');
    }
}
