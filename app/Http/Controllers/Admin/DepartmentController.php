<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Department;
use App\Models\Employee;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DepartmentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $departments = Department::with('manager')->get()->map(function ($department) {
            $employeeCount = Employee::where('department', $department->name)->count();
            
            return [
                'id' => $department->id,
                'name' => $department->name,
                'code' => $department->code,
                'managerId' => $department->manager_id,
                'managerName' => $department->manager->name ?? 'غير محدد',
                'employeeCount' => $employeeCount,
                'description' => $department->description,
                'status' => $department->status,
                'location' => $department->location,
                'budget' => $department->budget,
            ];
        });

        // إحصائيات الأقسام
        $totalDepartments = Department::count();
        $activeDepartments = Department::where('status', 'ACTIVE')->count();
        $inactiveDepartments = Department::where('status', 'INACTIVE')->count();
        $totalEmployees = Employee::count();
        $totalBudget = Department::sum('budget') ?? 0;

        $stats = [
            'totalDepartments' => $totalDepartments,
            'activeDepartments' => $activeDepartments,
            'inactiveDepartments' => $inactiveDepartments,
            'totalEmployees' => $totalEmployees,
            'totalBudget' => round($totalBudget, 2),
        ];

        return Inertia::render('Employees/Departments/Index', [
            'departments' => $departments,
            'stats' => $stats,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $managers = Employee::select('id', 'employee_number', 'name', 'position')
            ->where('status', 'active')
            ->get();
        return Inertia::render('Employees/Departments/Create', [
            'managers' => $managers,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:departments,name',
            'code' => 'required|string|max:255|unique:departments,code',
            'manager_id' => 'nullable|exists:employees,id',
            'description' => 'nullable|string',
            'status' => 'required|in:ACTIVE,INACTIVE',
            'location' => 'nullable|string|max:255',
            'budget' => 'nullable|numeric|min:0',
        ]);

        $validated['employee_count'] = 0;

        Department::create($validated);

        return redirect()->route('employees.departments')
            ->with('success', 'تم إضافة القسم بنجاح');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $department = Department::with('manager')->findOrFail($id);
        $employeeCount = Employee::where('department', $department->name)->count();

        return Inertia::render('Employees/Departments/Show', [
            'department' => [
                'id' => $department->id,
                'name' => $department->name,
                'code' => $department->code,
                'managerId' => $department->manager_id,
                'managerName' => $department->manager->name ?? 'غير محدد',
                'employeeCount' => $employeeCount,
                'description' => $department->description,
                'status' => $department->status,
                'location' => $department->location,
                'budget' => $department->budget,
            ],
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $department = Department::findOrFail($id);
        $managers = Employee::select('id', 'employee_number', 'name', 'position')
            ->where('status', 'active')
            ->get();

        return Inertia::render('Employees/Departments/Edit', [
            'department' => [
                'id' => $department->id,
                'name' => $department->name,
                'code' => $department->code,
                'manager_id' => $department->manager_id,
                'description' => $department->description,
                'status' => $department->status,
                'location' => $department->location,
                'budget' => $department->budget,
            ],
            'managers' => $managers,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $department = Department::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:departments,name,' . $id,
            'code' => 'required|string|max:255|unique:departments,code,' . $id,
            'manager_id' => 'nullable|exists:employees,id',
            'description' => 'nullable|string',
            'status' => 'required|in:ACTIVE,INACTIVE',
            'location' => 'nullable|string|max:255',
            'budget' => 'nullable|numeric|min:0',
        ]);

        $employeeCount = Employee::where('department', $department->name)->count();
        $validated['employee_count'] = $employeeCount;

        $department->update($validated);

        return redirect()->route('employees.departments')
            ->with('success', 'تم تحديث القسم بنجاح');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $department = Department::findOrFail($id);
        $department->delete();

        return redirect()->route('employees.departments')
            ->with('success', 'تم حذف القسم بنجاح');
    }
}
