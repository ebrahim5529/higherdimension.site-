<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Incentive;
use App\Models\Employee;
use Illuminate\Http\Request;
use Inertia\Inertia;

class IncentiveController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $incentives = Incentive::with('employee')->get()->map(function ($incentive) {
            return [
                'id' => $incentive->id,
                'employeeId' => $incentive->employee->employee_number ?? '',
                'employeeName' => $incentive->employee->name ?? 'غير معروف',
                'position' => $incentive->employee->position ?? '',
                'department' => $incentive->employee->department ?? '',
                'incentiveType' => $incentive->incentive_type,
                'amount' => $incentive->amount,
                'reason' => $incentive->reason,
                'date' => $incentive->date?->format('Y-m-d'),
                'status' => $incentive->status,
                'approvedBy' => $incentive->approved_by,
                'approvedDate' => $incentive->approved_date?->format('Y-m-d'),
            ];
        });

        // إحصائيات الحوافز
        $totalIncentives = Incentive::count();
        $totalAmount = Incentive::sum('amount') ?? 0;
        $approvedIncentives = Incentive::where('status', 'approved')->count();
        $pendingIncentives = Incentive::where('status', 'pending')->count();
        $rejectedIncentives = Incentive::where('status', 'rejected')->count();
        $averageAmount = Incentive::avg('amount') ?? 0;

        $stats = [
            'totalIncentives' => $totalIncentives,
            'totalAmount' => round($totalAmount, 2),
            'approvedIncentives' => $approvedIncentives,
            'pendingIncentives' => $pendingIncentives,
            'rejectedIncentives' => $rejectedIncentives,
            'averageAmount' => round($averageAmount, 2),
        ];

        return Inertia::render('Employees/Incentives/Index', [
            'incentives' => $incentives,
            'stats' => $stats,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $employees = Employee::select('id', 'employee_number', 'name')->get();
        return Inertia::render('Employees/Incentives/Create', [
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
            'incentive_type' => 'required|in:performance,bonus,overtime,commission,other',
            'amount' => 'required|numeric|min:0',
            'reason' => 'nullable|string',
            'date' => 'required|date',
            'status' => 'required|in:approved,pending,rejected',
            'approved_by' => 'nullable|string',
            'notes' => 'nullable|string',
        ]);

        $employee = Employee::findOrFail($validated['employee_id']);
        $validated['employee_number'] = $employee->employee_number;

        Incentive::create($validated);

        return redirect()->route('employees.incentives')
            ->with('success', 'تم إضافة الحافز بنجاح');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $incentive = Incentive::with('employee')->findOrFail($id);

        return Inertia::render('Employees/Incentives/Show', [
            'incentive' => [
                'id' => $incentive->id,
                'employeeId' => $incentive->employee->employee_number ?? '',
                'employeeName' => $incentive->employee->name ?? 'غير معروف',
                'position' => $incentive->employee->position ?? '',
                'department' => $incentive->employee->department ?? '',
                'incentiveType' => $incentive->incentive_type,
                'amount' => $incentive->amount,
                'reason' => $incentive->reason,
                'date' => $incentive->date?->format('Y-m-d'),
                'status' => $incentive->status,
                'approvedBy' => $incentive->approved_by,
                'approvedDate' => $incentive->approved_date?->format('Y-m-d'),
                'notes' => $incentive->notes,
            ],
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $incentive = Incentive::with('employee')->findOrFail($id);
        $employees = Employee::select('id', 'employee_number', 'name')->get();

        return Inertia::render('Employees/Incentives/Edit', [
            'incentive' => [
                'id' => $incentive->id,
                'employee_id' => $incentive->employee_id,
                'incentive_type' => $incentive->incentive_type,
                'amount' => $incentive->amount,
                'reason' => $incentive->reason,
                'date' => $incentive->date?->format('Y-m-d'),
                'status' => $incentive->status,
                'approved_by' => $incentive->approved_by,
                'approved_date' => $incentive->approved_date?->format('Y-m-d'),
                'notes' => $incentive->notes,
            ],
            'employees' => $employees,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $incentive = Incentive::findOrFail($id);

        $validated = $request->validate([
            'employee_id' => 'required|exists:employees,id',
            'incentive_type' => 'required|in:performance,bonus,overtime,commission,other',
            'amount' => 'required|numeric|min:0',
            'reason' => 'nullable|string',
            'date' => 'required|date',
            'status' => 'required|in:approved,pending,rejected',
            'approved_by' => 'nullable|string',
            'approved_date' => 'nullable|date',
            'notes' => 'nullable|string',
        ]);

        $employee = Employee::findOrFail($validated['employee_id']);
        $validated['employee_number'] = $employee->employee_number;

        $incentive->update($validated);

        return redirect()->route('employees.incentives')
            ->with('success', 'تم تحديث الحافز بنجاح');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $incentive = Incentive::findOrFail($id);
        $incentive->delete();

        return redirect()->route('employees.incentives')
            ->with('success', 'تم حذف الحافز بنجاح');
    }
}
