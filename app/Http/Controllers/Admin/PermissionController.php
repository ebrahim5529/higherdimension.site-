<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class PermissionController extends Controller
{
    /**
     * Display a listing of permissions.
     */
    public function index(): \Inertia\Response
    {
        $permissions = Permission::with('roles')->get()->map(function ($permission) {
            return [
                'id' => $permission->id,
                'name' => $permission->name,
                'guard_name' => $permission->guard_name,
                'roles_count' => $permission->roles->count(),
                'roles' => $permission->roles->map(function ($role) {
                    return [
                        'id' => $role->id,
                        'name' => $role->name,
                    ];
                }),
                'created_at' => $permission->created_at?->format('Y-m-d H:i:s'),
            ];
        });

        $allRoles = Role::all()->map(function ($role) {
            return [
                'id' => $role->id,
                'name' => $role->name,
            ];
        });

        $stats = [
            'totalPermissions' => Permission::count(),
            'totalRoles' => Role::count(),
        ];

        return Inertia::render('Permissions/Permissions/Index', [
            'permissions' => $permissions,
            'allRoles' => $allRoles,
            'stats' => $stats,
        ]);
    }

    /**
     * Store a newly created permission.
     */
    public function store(Request $request): \Illuminate\Http\RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:permissions,name',
        ]);

        Permission::create([
            'name' => $validated['name'],
            'guard_name' => 'web',
        ]);

        return redirect()->route('permissions.index')
            ->with('success', 'تم إنشاء الصلاحية بنجاح');
    }

    /**
     * Update the specified permission.
     */
    public function update(Request $request, Permission $permission): \Illuminate\Http\RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:permissions,name,'.$permission->id,
        ]);

        $permission->update([
            'name' => $validated['name'],
        ]);

        return redirect()->route('permissions.index')
            ->with('success', 'تم تحديث الصلاحية بنجاح');
    }

    /**
     * Remove the specified permission.
     */
    public function destroy(Permission $permission): \Illuminate\Http\RedirectResponse
    {
        if ($permission->roles()->count() > 0) {
            return redirect()->route('permissions.index')
                ->with('error', 'لا يمكن حذف الصلاحية لأنها مرتبطة بأدوار');
        }

        $permission->delete();

        return redirect()->route('permissions.index')
            ->with('success', 'تم حذف الصلاحية بنجاح');
    }
}
