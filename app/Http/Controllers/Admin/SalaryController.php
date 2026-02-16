<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Salary;
use App\Models\Employee;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Services\AccountingService;

class SalaryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $salaries = Salary::with('employee')->get()->map(function ($salary) {
            return [
                'id' => $salary->id,
                'employeeId' => $salary->employee_number,
                'employeeName' => $salary->employee->name ?? 'غير معروف',
                'position' => $salary->employee->position ?? '',
                'department' => $salary->employee->department ?? '',
                'basicSalary' => $salary->basic_salary,
                'allowances' => $salary->allowances,
                'deductions' => $salary->deductions,
                'totalSalary' => $salary->total_salary,
                'paymentDate' => $salary->payment_date?->format('Y-m-d'),
                'status' => $salary->status,
                'paymentMethod' => $salary->payment_method,
            ];
        });

        // إحصائيات الرواتب
        $totalSalaries = Salary::count();
        $totalAmount = Salary::sum('total_salary') ?? 0;
        $paidSalaries = Salary::where('status', 'paid')->count();
        $pendingSalaries = Salary::where('status', 'pending')->count();
        $overdueSalaries = Salary::where('status', 'overdue')->count();
        $averageSalary = Salary::avg('total_salary') ?? 0;

        $stats = [
            'totalSalaries' => $totalSalaries,
            'totalAmount' => round($totalAmount, 2),
            'paidSalaries' => $paidSalaries,
            'pendingSalaries' => $pendingSalaries,
            'overdueSalaries' => $overdueSalaries,
            'averageSalary' => round($averageSalary, 2),
        ];

        return Inertia::render('Employees/Salaries/Index', [
            'salaries' => $salaries,
            'stats' => $stats,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $employees = Employee::select('id', 'employee_number', 'name')->get();
        return Inertia::render('Employees/Salaries/Create', [
            'employees' => $employees,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'employee_id' => 'required|exists:employees,id',
            'basic_salary' => 'required|numeric|min:0',
            'allowances' => 'nullable|numeric|min:0',
            'deductions' => 'nullable|numeric|min:0',
            'total_salary' => 'required|numeric|min:0',
            'payment_date' => 'required|date',
            'status' => 'required|in:paid,pending,overdue',
            'payment_method' => 'required|in:bank_transfer,cash,check',
            'notes' => 'nullable|string',
        ]);

        $employee = Employee::findOrFail($validated['employee_id']);
        $validated['employee_number'] = $employee->employee_number;

        $salary = Salary::create($validated);

        // إنشاء قيد محاسبي تلقائي عند دفع الراتب
        if ($validated['status'] === 'paid') {
            $salary->load('employee');
            (new AccountingService())->onSalaryPaid($salary);
        }

        return redirect()->route('employees.salaries')
            ->with('success', 'تم إضافة الراتب بنجاح');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $salary = Salary::with('employee')->findOrFail($id);

        return Inertia::render('Employees/Salaries/Show', [
            'salary' => [
                'id' => $salary->id,
                'employeeId' => $salary->employee_number,
                'employeeName' => $salary->employee->name ?? 'غير معروف',
                'position' => $salary->employee->position ?? '',
                'department' => $salary->employee->department ?? '',
                'basicSalary' => $salary->basic_salary,
                'allowances' => $salary->allowances,
                'deductions' => $salary->deductions,
                'totalSalary' => $salary->total_salary,
                'paymentDate' => $salary->payment_date?->format('Y-m-d'),
                'status' => $salary->status,
                'paymentMethod' => $salary->payment_method,
                'notes' => $salary->notes,
            ],
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $salary = Salary::with('employee')->findOrFail($id);
        $employees = Employee::select('id', 'employee_number', 'name')->get();

        return Inertia::render('Employees/Salaries/Edit', [
            'salary' => [
                'id' => $salary->id,
                'employee_id' => $salary->employee_id,
                'basic_salary' => $salary->basic_salary,
                'allowances' => $salary->allowances,
                'deductions' => $salary->deductions,
                'total_salary' => $salary->total_salary,
                'payment_date' => $salary->payment_date?->format('Y-m-d'),
                'status' => $salary->status,
                'payment_method' => $salary->payment_method,
                'notes' => $salary->notes,
            ],
            'employees' => $employees,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $salary = Salary::findOrFail($id);

        $validated = $request->validate([
            'employee_id' => 'required|exists:employees,id',
            'basic_salary' => 'required|numeric|min:0',
            'allowances' => 'nullable|numeric|min:0',
            'deductions' => 'nullable|numeric|min:0',
            'total_salary' => 'required|numeric|min:0',
            'payment_date' => 'required|date',
            'status' => 'required|in:paid,pending,overdue',
            'payment_method' => 'required|in:bank_transfer,cash,check',
            'notes' => 'nullable|string',
        ]);

        $employee = Employee::findOrFail($validated['employee_id']);
        $validated['employee_number'] = $employee->employee_number;

        $salary->update($validated);

        return redirect()->route('employees.salaries')
            ->with('success', 'تم تحديث الراتب بنجاح');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $salary = Salary::findOrFail($id);
        $salary->delete();

        return redirect()->route('employees.salaries')
            ->with('success', 'تم حذف الراتب بنجاح');
    }
}
