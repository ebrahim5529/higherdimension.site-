<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Notifications\NewUserCreatedArabic;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class UserRoleController extends Controller
{
    /**
     * Display users with their roles and permissions.
     */
    public function index(): \Inertia\Response
    {
        $users = User::with(['roles', 'permissions'])->get()->map(function ($user) {
            $effectivePermissions = $user->getAllPermissions();
            return [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone,
                'roles' => $user->roles->map(function ($role) {
                    return [
                        'id' => $role->id,
                        'name' => $role->name,
                    ];
                }),
                'permissions' => $effectivePermissions->map(function ($permission) {
                    return [
                        'id' => $permission->id,
                        'name' => $permission->name,
                    ];
                }),
                'roles_count' => $user->roles->count(),
                'permissions_count' => $effectivePermissions->count(),
            ];
        });

        $allRoles = Role::all()->map(function ($role) {
            return [
                'id' => $role->id,
                'name' => $role->name,
            ];
        });

        $allPermissions = Permission::all()->map(function ($permission) {
            return [
                'id' => $permission->id,
                'name' => $permission->name,
            ];
        });

        $stats = [
            'totalUsers' => User::count(),
            'totalRoles' => Role::count(),
            'totalPermissions' => Permission::count(),
        ];

        return Inertia::render('Permissions/UserRoles/Index', [
            'users' => $users,
            'allRoles' => $allRoles,
            'allPermissions' => $allPermissions,
            'stats' => $stats,
        ]);
    }

    public function show(User $user): \Illuminate\Http\JsonResponse
    {
        $user->loadMissing(['roles', 'permissions']);

        return response()->json([
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'phone' => $user->phone,
            'roles' => $user->roles->map(fn ($r) => ['id' => $r->id, 'name' => $r->name])->values(),
            'permissions' => $user->getAllPermissions()->map(fn ($p) => ['id' => $p->id, 'name' => $p->name])->values(),
        ]);
    }

    /**
     * Update user roles.
     */
    public function updateRoles(Request $request, User $user): \Illuminate\Http\RedirectResponse
    {
        $validated = $request->validate([
            'roles' => 'nullable|array',
            'roles.*' => 'exists:roles,id',
        ]);

        if (isset($validated['roles'])) {
            $roles = Role::whereIn('id', $validated['roles'])->get();
            $user->syncRoles($roles);
        } else {
            $user->syncRoles([]);
        }

        return redirect()->route('user-roles.index')
            ->with('success', 'تم تحديث أدوار المستخدم بنجاح');
    }

    /**
     * Update user permissions.
     */
    public function updatePermissions(Request $request, User $user): \Illuminate\Http\RedirectResponse
    {
        $validated = $request->validate([
            'permissions' => 'nullable|array',
            'permissions.*' => 'exists:permissions,id',
        ]);

        if (isset($validated['permissions'])) {
            $permissions = Permission::whereIn('id', $validated['permissions'])->get();
            $user->syncPermissions($permissions);
        } else {
            $user->syncPermissions([]);
        }

        return redirect()->route('user-roles.index')
            ->with('success', 'تم تحديث صلاحيات المستخدم بنجاح');
    }

    /**
     * Store a newly created user.
     */
    public function store(Request $request): \Illuminate\Http\RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email',
            'phone' => 'nullable|string|max:20',
            'password' => 'required|string|min:6',
            'roles' => 'nullable|array',
            'roles.*' => 'exists:roles,id',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'] ?? null,
            'password' => Hash::make($validated['password']),
            'role' => 'USER',
        ]);

        if (! empty($validated['roles'])) {
            $roles = Role::whereIn('id', $validated['roles'])->get();
            $user->syncRoles($roles);
        }

        $user->loadMissing(['roles', 'permissions']);
        $roleNames = $user->roles->pluck('name')->values()->all();
        $permissionNames = $user->getAllPermissions()->pluck('name')->values()->all();

        try {
            $user->notify(new NewUserCreatedArabic(
                (string) $validated['password'],
                $roleNames,
                $permissionNames,
            ));
        } catch (\Throwable $e) {
            return redirect()->route('user-roles.index')
                ->with('error', 'تم إنشاء المستخدم لكن تعذر إرسال بيانات الدخول إلى البريد الإلكتروني');
        }

        return redirect()->route('user-roles.index')
            ->with('success', 'تم إنشاء المستخدم بنجاح وتم إرسال بيانات الدخول إلى بريده الإلكتروني');
    }

    public function update(Request $request, User $user): \Illuminate\Http\RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
            'phone' => 'nullable|string|max:20',
            'password' => 'nullable|string|min:6',
        ]);

        $payload = [
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'] ?? null,
        ];

        if (! empty($validated['password'])) {
            $payload['password'] = Hash::make($validated['password']);
        }

        $user->update($payload);

        return redirect()->route('user-roles.index')
            ->with('success', 'تم تحديث بيانات المستخدم بنجاح');
    }

    public function destroy(Request $request, User $user): \Illuminate\Http\RedirectResponse
    {
        if ($request->user() && (int) $request->user()->id === (int) $user->id) {
            return redirect()->route('user-roles.index')
                ->with('error', 'لا يمكن حذف المستخدم الحالي');
        }

        $user->syncRoles([]);
        $user->syncPermissions([]);
        $user->delete();

        return redirect()->route('user-roles.index')
            ->with('success', 'تم حذف المستخدم بنجاح');
    }
}
