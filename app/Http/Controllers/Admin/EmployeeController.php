<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Employee;
use Illuminate\Http\Request;
use Inertia\Inertia;

class EmployeeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $employees = Employee::all()->map(function ($employee) {
            return [
                'id' => $employee->id,
                'employeeId' => $employee->employee_number,
                'name' => $employee->name,
                'position' => $employee->position,
                'department' => $employee->department,
                'email' => $employee->email,
                'phone' => $employee->phone,
                'hireDate' => $employee->hire_date?->format('Y-m-d'),
                'status' => $employee->status,
                'salary' => $employee->total_salary,
                'manager' => $employee->manager,
                'location' => $employee->location,
            ];
        });

        // إحصائيات الموظفين
        $totalEmployees = Employee::count();
        $activeEmployees = Employee::where('status', 'active')->count();
        $inactiveEmployees = Employee::where('status', 'inactive')->count();
        $onLeaveEmployees = Employee::where('status', 'on_leave')->count();
        
        // حساب متوسط الراتب
        $averageSalary = Employee::where('status', 'active')->avg('total_salary') ?? 0;
        $totalSalaryCost = Employee::where('status', 'active')->sum('total_salary') ?? 0;
        
        // الموظفين الجدد هذا الشهر
        $newHiresThisMonth = Employee::whereMonth('hire_date', now()->month)
            ->whereYear('hire_date', now()->year)
            ->count();

        $stats = [
            'totalEmployees' => $totalEmployees,
            'activeEmployees' => $activeEmployees,
            'inactiveEmployees' => $inactiveEmployees,
            'onLeaveEmployees' => $onLeaveEmployees,
            'newHiresThisMonth' => $newHiresThisMonth,
            'averageSalary' => round($averageSalary, 2),
            'totalSalaryCost' => round($totalSalaryCost, 2),
        ];

        return Inertia::render('Employees/Index', [
            'employees' => $employees,
            'stats' => $stats,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Employees/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // توليد رقم الموظف تلقائياً إذا لم يتم إدخاله
        $employeeNumber = $request->input('employee_number');
        if (!$employeeNumber) {
            $lastEmployee = Employee::orderBy('id', 'desc')->first();
            $lastNumber = $lastEmployee ? (int) str_replace('EMP', '', $lastEmployee->employee_number) : 0;
            $employeeNumber = 'EMP' . str_pad($lastNumber + 1, 3, '0', STR_PAD_LEFT);
        }

        $validated = $request->validate([
            'employee_number' => 'nullable|string|unique:employees,employee_number|max:255',
            'name' => 'required|string|max:255',
            'position' => 'required|string|max:255',
            'department' => 'required|string|max:255',
            'email' => 'required|email|unique:employees,email|max:255',
            'phone' => 'nullable|string|max:255',
            'hire_date' => 'required|date',
            'status' => 'required|in:active,inactive,on_leave',
            'total_salary' => 'required|numeric|min:0',
            // حقول اختيارية
            'arabic_name' => 'nullable|string|max:255',
            'mobile' => 'nullable|string|max:255',
            'address' => 'nullable|string',
            'city' => 'nullable|string|max:255',
            'nationality' => 'nullable|string|max:255',
            'date_of_birth' => 'nullable|date',
            'gender' => 'nullable|in:male,female',
            'marital_status' => 'nullable|in:single,married,divorced,widowed',
            'id_number' => 'nullable|string|max:255',
            'passport_number' => 'nullable|string|max:255',
            'manager' => 'nullable|string|max:255',
            'location' => 'nullable|string|max:255',
            'contract_type' => 'nullable|in:full_time,part_time,contract,intern',
            'work_schedule' => 'nullable|string|max:255',
            'basic_salary' => 'nullable|numeric|min:0',
            'allowances' => 'nullable|numeric|min:0',
            'currency' => 'nullable|string|max:10',
            'payment_method' => 'nullable|in:bank_transfer,cash,check',
            'bank_account' => 'nullable|string|max:255',
            'documents' => 'nullable|array',
            'notes' => 'nullable|string',
        ]);

        $validated['employee_number'] = $employeeNumber;
        
        // حساب total_salary إذا لم يتم إدخاله
        if (!isset($validated['total_salary']) || $validated['total_salary'] == 0) {
            $validated['total_salary'] = ($validated['basic_salary'] ?? 0) + ($validated['allowances'] ?? 0);
        }

        $employee = Employee::create($validated);

        return redirect()->route('employees.index')
            ->with('success', 'تم إضافة الموظف بنجاح');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $employee = Employee::findOrFail($id);

        return Inertia::render('Employees/Show', [
            'employee' => [
                'id' => $employee->id,
                'employeeId' => $employee->employee_number,
                'name' => $employee->name,
                'arabicName' => $employee->arabic_name,
                'email' => $employee->email,
                'phone' => $employee->phone,
                'mobile' => $employee->mobile,
                'address' => $employee->address,
                'city' => $employee->city,
                'nationality' => $employee->nationality,
                'dateOfBirth' => $employee->date_of_birth?->format('Y-m-d'),
                'gender' => $employee->gender,
                'maritalStatus' => $employee->marital_status,
                'idNumber' => $employee->id_number,
                'passportNumber' => $employee->passport_number,
                'position' => $employee->position,
                'department' => $employee->department,
                'manager' => $employee->manager,
                'location' => $employee->location,
                'hireDate' => $employee->hire_date?->format('Y-m-d'),
                'contractType' => $employee->contract_type,
                'workSchedule' => $employee->work_schedule,
                'status' => $employee->status,
                'basicSalary' => $employee->basic_salary,
                'allowances' => $employee->allowances,
                'totalSalary' => $employee->total_salary,
                'currency' => $employee->currency,
                'paymentMethod' => $employee->payment_method,
                'bankAccount' => $employee->bank_account,
                'documents' => $employee->documents ?? [],
                'notes' => $employee->notes,
            ],
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $employee = Employee::findOrFail($id);

        return Inertia::render('Employees/Edit', [
            'employee' => [
                'id' => $employee->id,
                'employee_number' => $employee->employee_number,
                'name' => $employee->name,
                'position' => $employee->position,
                'department' => $employee->department,
                'email' => $employee->email,
                'phone' => $employee->phone,
                'hire_date' => $employee->hire_date?->format('Y-m-d'),
                'status' => $employee->status,
                'total_salary' => $employee->total_salary,
            ],
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $employee = Employee::findOrFail($id);

        $validated = $request->validate([
            'employee_number' => 'required|string|unique:employees,employee_number,'.$id.'|max:255',
            'name' => 'required|string|max:255',
            'position' => 'required|string|max:255',
            'department' => 'required|string|max:255',
            'email' => 'required|email|unique:employees,email,'.$id.'|max:255',
            'phone' => 'nullable|string|max:255',
            'hire_date' => 'required|date',
            'status' => 'required|in:active,inactive,on_leave',
            'total_salary' => 'required|numeric|min:0',
        ]);

        $employee->update($validated);

        return redirect()->route('employees.index')
            ->with('success', 'تم تحديث الموظف بنجاح');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $employee = Employee::findOrFail($id);
        $employee->delete();

        return redirect()->route('employees.index')
            ->with('success', 'تم حذف الموظف بنجاح');
    }
}
