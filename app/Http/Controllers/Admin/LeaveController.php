<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Leave;
use App\Models\Employee;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LeaveController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $leaves = Leave::with('employee')->get()->map(function ($leave) {
            return [
                'id' => $leave->id,
                'employeeId' => $leave->employee->employee_number ?? '',
                'employeeName' => $leave->employee->name ?? 'غير معروف',
                'position' => $leave->employee->position ?? '',
                'department' => $leave->employee->department ?? '',
                'leaveType' => $leave->leave_type,
                'startDate' => $leave->start_date?->format('Y-m-d'),
                'endDate' => $leave->end_date?->format('Y-m-d'),
                'totalDays' => $leave->total_days,
                'reason' => $leave->reason,
                'status' => $leave->status,
                'appliedDate' => $leave->applied_date?->format('Y-m-d'),
                'approvedBy' => $leave->approved_by,
                'approvedDate' => $leave->approved_date?->format('Y-m-d'),
                'remainingBalance' => $leave->remaining_balance,
            ];
        });

        // إحصائيات الإجازات
        $totalLeaves = Leave::count();
        $pendingLeaves = Leave::where('status', 'PENDING')->count();
        $approvedLeaves = Leave::where('status', 'APPROVED')->count();
        $rejectedLeaves = Leave::where('status', 'REJECTED')->count();
        $cancelledLeaves = Leave::where('status', 'CANCELLED')->count();
        $totalDays = Leave::sum('total_days') ?? 0;

        $stats = [
            'totalLeaves' => $totalLeaves,
            'pendingLeaves' => $pendingLeaves,
            'approvedLeaves' => $approvedLeaves,
            'rejectedLeaves' => $rejectedLeaves,
            'cancelledLeaves' => $cancelledLeaves,
            'totalDays' => $totalDays,
        ];

        return Inertia::render('Employees/Leaves/Index', [
            'leaves' => $leaves,
            'stats' => $stats,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $employees = Employee::select('id', 'employee_number', 'name')->get();
        return Inertia::render('Employees/Leaves/Create', [
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
            'leave_type' => 'required|in:ANNUAL,SICK,EMERGENCY,MATERNITY,PATERNITY,UNPAID,OTHER',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'total_days' => 'required|integer|min:1',
            'reason' => 'required|string',
            'status' => 'required|in:PENDING,APPROVED,REJECTED,CANCELLED',
            'applied_date' => 'required|date',
            'approved_by' => 'nullable|string',
            'approved_date' => 'nullable|date',
            'remaining_balance' => 'nullable|integer|min:0',
            'notes' => 'nullable|string',
        ]);

        $employee = Employee::findOrFail($validated['employee_id']);
        $validated['employee_number'] = $employee->employee_number;

        Leave::create($validated);

        return redirect()->route('employees.leaves')
            ->with('success', 'تم إضافة الإجازة بنجاح');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $leave = Leave::with('employee')->findOrFail($id);

        return Inertia::render('Employees/Leaves/Show', [
            'leave' => [
                'id' => $leave->id,
                'employeeId' => $leave->employee->employee_number ?? '',
                'employeeName' => $leave->employee->name ?? 'غير معروف',
                'position' => $leave->employee->position ?? '',
                'department' => $leave->employee->department ?? '',
                'leaveType' => $leave->leave_type,
                'startDate' => $leave->start_date?->format('Y-m-d'),
                'endDate' => $leave->end_date?->format('Y-m-d'),
                'totalDays' => $leave->total_days,
                'reason' => $leave->reason,
                'status' => $leave->status,
                'appliedDate' => $leave->applied_date?->format('Y-m-d'),
                'approvedBy' => $leave->approved_by,
                'approvedDate' => $leave->approved_date?->format('Y-m-d'),
                'remainingBalance' => $leave->remaining_balance,
                'notes' => $leave->notes,
            ],
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $leave = Leave::with('employee')->findOrFail($id);
        $employees = Employee::select('id', 'employee_number', 'name')->get();

        return Inertia::render('Employees/Leaves/Edit', [
            'leave' => [
                'id' => $leave->id,
                'employee_id' => $leave->employee_id,
                'leave_type' => $leave->leave_type,
                'start_date' => $leave->start_date?->format('Y-m-d'),
                'end_date' => $leave->end_date?->format('Y-m-d'),
                'total_days' => $leave->total_days,
                'reason' => $leave->reason,
                'status' => $leave->status,
                'applied_date' => $leave->applied_date?->format('Y-m-d'),
                'approved_by' => $leave->approved_by,
                'approved_date' => $leave->approved_date?->format('Y-m-d'),
                'remaining_balance' => $leave->remaining_balance,
                'notes' => $leave->notes,
            ],
            'employees' => $employees,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $leave = Leave::findOrFail($id);

        $validated = $request->validate([
            'employee_id' => 'required|exists:employees,id',
            'leave_type' => 'required|in:ANNUAL,SICK,EMERGENCY,MATERNITY,PATERNITY,UNPAID,OTHER',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'total_days' => 'required|integer|min:1',
            'reason' => 'required|string',
            'status' => 'required|in:PENDING,APPROVED,REJECTED,CANCELLED',
            'applied_date' => 'required|date',
            'approved_by' => 'nullable|string',
            'approved_date' => 'nullable|date',
            'remaining_balance' => 'nullable|integer|min:0',
            'notes' => 'nullable|string',
        ]);

        $employee = Employee::findOrFail($validated['employee_id']);
        $validated['employee_number'] = $employee->employee_number;

        $leave->update($validated);

        return redirect()->route('employees.leaves')
            ->with('success', 'تم تحديث الإجازة بنجاح');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $leave = Leave::findOrFail($id);
        $leave->delete();

        return redirect()->route('employees.leaves')
            ->with('success', 'تم حذف الإجازة بنجاح');
    }
}
