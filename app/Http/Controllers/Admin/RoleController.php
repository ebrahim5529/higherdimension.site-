<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RoleController extends Controller
{
    /**
     * Display a listing of roles.
     */
    public function index(): \Inertia\Response
    {
        $roles = Role::with('permissions')->get()->map(function ($role) {
            return [
                'id' => $role->id,
                'name' => $role->name,
                'guard_name' => $role->guard_name,
                'permissions_count' => $role->permissions->count(),
                'users_count' => $role->users()->count(),
                'permissions' => $role->permissions->map(function ($permission) {
                    return [
                        'id' => $permission->id,
                        'name' => $permission->name,
                    ];
                }),
                'created_at' => $role->created_at?->format('Y-m-d H:i:s'),
            ];
        });

        $allPermissions = Permission::all()->map(function ($permission) {
            return [
                'id' => $permission->id,
                'name' => $permission->name,
                'guard_name' => $permission->guard_name,
            ];
        });

        $stats = [
            'totalRoles' => Role::count(),
            'totalPermissions' => Permission::count(),
            'totalUsers' => \App\Models\User::count(),
        ];

        return Inertia::render('Permissions/Roles/Index', [
            'roles' => $roles,
            'allPermissions' => $allPermissions,
            'stats' => $stats,
        ]);
    }

    /**
     * Store a newly created role.
     */
    public function store(Request $request): \Illuminate\Http\RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:roles,name',
            'permissions' => 'nullable|array',
            'permissions.*' => 'exists:permissions,id',
        ]);

        $role = Role::create([
            'name' => $validated['name'],
            'guard_name' => 'web',
        ]);

        if (! empty($validated['permissions'])) {
            $permissions = Permission::whereIn('id', $validated['permissions'])->get();
            $role->syncPermissions($permissions);
        }

        return redirect()->route('roles.index')
            ->with('success', 'تم إنشاء الدور بنجاح');
    }

    /**
     * Update the specified role.
     */
    public function update(Request $request, Role $role): \Illuminate\Http\RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:roles,name,'.$role->id,
            'permissions' => 'nullable|array',
            'permissions.*' => 'exists:permissions,id',
        ]);

        $role->update([
            'name' => $validated['name'],
        ]);

        if (isset($validated['permissions'])) {
            $permissions = Permission::whereIn('id', $validated['permissions'])->get();
            $role->syncPermissions($permissions);
        }

        return redirect()->route('roles.index')
            ->with('success', 'تم تحديث الدور بنجاح');
    }

    /**
     * Remove the specified role.
     */
    public function destroy(Role $role): \Illuminate\Http\RedirectResponse
    {
        if ($role->users()->count() > 0) {
            return redirect()->route('roles.index')
                ->with('error', 'لا يمكن حذف الدور لأنه مرتبط بمستخدمين');
        }

        $role->delete();

        return redirect()->route('roles.index')
            ->with('success', 'تم حذف الدور بنجاح');
    }
}
