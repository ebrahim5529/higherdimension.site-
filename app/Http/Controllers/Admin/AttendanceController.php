<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\Employee;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AttendanceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $attendances = Attendance::with('employee')->get()->map(function ($attendance) {
            $checkIn = null;
            $checkOut = null;
            
            if ($attendance->check_in) {
                if (is_string($attendance->check_in)) {
                    $checkIn = date('H:i', strtotime($attendance->check_in));
                } else {
                    $checkIn = $attendance->check_in->format('H:i');
                }
            }
            
            if ($attendance->check_out) {
                if (is_string($attendance->check_out)) {
                    $checkOut = date('H:i', strtotime($attendance->check_out));
                } else {
                    $checkOut = $attendance->check_out->format('H:i');
                }
            }
            
            return [
                'id' => $attendance->id,
                'employeeId' => $attendance->employee->employee_number ?? '',
                'employeeName' => $attendance->employee->name ?? 'غير معروف',
                'position' => $attendance->employee->position ?? '',
                'department' => $attendance->employee->department ?? '',
                'date' => $attendance->date?->format('Y-m-d'),
                'checkIn' => $checkIn,
                'checkOut' => $checkOut,
                'totalHours' => $attendance->total_hours,
                'overtime' => $attendance->overtime,
                'status' => $attendance->status,
                'notes' => $attendance->notes,
            ];
        });

        // إحصائيات الحضور
        $totalRecords = Attendance::count();
        $presentCount = Attendance::where('status', 'present')->count();
        $absentCount = Attendance::where('status', 'absent')->count();
        $lateCount = Attendance::where('status', 'late')->count();
        $onLeaveCount = Attendance::where('status', 'on_leave')->count();
        $totalHours = Attendance::sum('total_hours') ?? 0;
        $totalOvertime = Attendance::sum('overtime') ?? 0;

        $stats = [
            'totalRecords' => $totalRecords,
            'presentCount' => $presentCount,
            'absentCount' => $absentCount,
            'lateCount' => $lateCount,
            'onLeaveCount' => $onLeaveCount,
            'totalHours' => round($totalHours, 2),
            'totalOvertime' => round($totalOvertime, 2),
        ];

        return Inertia::render('Employees/Attendance/Index', [
            'attendances' => $attendances,
            'stats' => $stats,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $employees = Employee::select('id', 'employee_number', 'name')->get();
        return Inertia::render('Employees/Attendance/Create', [
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
            'date' => 'required|date',
            'check_in' => 'nullable|date_format:H:i',
            'check_out' => 'nullable|date_format:H:i|after:check_in',
            'total_hours' => 'nullable|numeric|min:0',
            'overtime' => 'nullable|numeric|min:0',
            'status' => 'required|in:present,absent,late,half_day,on_leave',
            'notes' => 'nullable|string',
        ]);

        $employee = Employee::findOrFail($validated['employee_id']);
        $validated['employee_number'] = $employee->employee_number;

        // تحويل check_in و check_out إلى datetime
        if ($validated['check_in']) {
            $validated['check_in'] = $validated['date'] . ' ' . $validated['check_in'] . ':00';
        }
        if ($validated['check_out']) {
            $validated['check_out'] = $validated['date'] . ' ' . $validated['check_out'] . ':00';
        }

        Attendance::create($validated);

        return redirect()->route('employees.attendance')
            ->with('success', 'تم إضافة سجل الحضور بنجاح');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $attendance = Attendance::with('employee')->findOrFail($id);

        $checkIn = null;
        $checkOut = null;
        
        if ($attendance->check_in) {
            if (is_string($attendance->check_in)) {
                $checkIn = date('H:i', strtotime($attendance->check_in));
            } else {
                $checkIn = $attendance->check_in->format('H:i');
            }
        }
        
        if ($attendance->check_out) {
            if (is_string($attendance->check_out)) {
                $checkOut = date('H:i', strtotime($attendance->check_out));
            } else {
                $checkOut = $attendance->check_out->format('H:i');
            }
        }

        return Inertia::render('Employees/Attendance/Show', [
            'attendance' => [
                'id' => $attendance->id,
                'employeeId' => $attendance->employee->employee_number ?? '',
                'employeeName' => $attendance->employee->name ?? 'غير معروف',
                'position' => $attendance->employee->position ?? '',
                'department' => $attendance->employee->department ?? '',
                'date' => $attendance->date?->format('Y-m-d'),
                'checkIn' => $checkIn,
                'checkOut' => $checkOut,
                'totalHours' => $attendance->total_hours,
                'overtime' => $attendance->overtime,
                'status' => $attendance->status,
                'notes' => $attendance->notes,
            ],
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $attendance = Attendance::with('employee')->findOrFail($id);
        $employees = Employee::select('id', 'employee_number', 'name')->get();

        $checkIn = null;
        $checkOut = null;
        
        if ($attendance->check_in) {
            if (is_string($attendance->check_in)) {
                $checkIn = date('H:i', strtotime($attendance->check_in));
            } else {
                $checkIn = $attendance->check_in->format('H:i');
            }
        }
        
        if ($attendance->check_out) {
            if (is_string($attendance->check_out)) {
                $checkOut = date('H:i', strtotime($attendance->check_out));
            } else {
                $checkOut = $attendance->check_out->format('H:i');
            }
        }

        return Inertia::render('Employees/Attendance/Edit', [
            'attendance' => [
                'id' => $attendance->id,
                'employee_id' => $attendance->employee_id,
                'date' => $attendance->date?->format('Y-m-d'),
                'check_in' => $checkIn,
                'check_out' => $checkOut,
                'total_hours' => $attendance->total_hours,
                'overtime' => $attendance->overtime,
                'status' => $attendance->status,
                'notes' => $attendance->notes,
            ],
            'employees' => $employees,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $attendance = Attendance::findOrFail($id);

        $validated = $request->validate([
            'employee_id' => 'required|exists:employees,id',
            'date' => 'required|date',
            'check_in' => 'nullable|date_format:H:i',
            'check_out' => 'nullable|date_format:H:i|after:check_in',
            'total_hours' => 'nullable|numeric|min:0',
            'overtime' => 'nullable|numeric|min:0',
            'status' => 'required|in:present,absent,late,half_day,on_leave',
            'notes' => 'nullable|string',
        ]);

        $employee = Employee::findOrFail($validated['employee_id']);
        $validated['employee_number'] = $employee->employee_number;

        // تحويل check_in و check_out إلى datetime
        if ($validated['check_in']) {
            $validated['check_in'] = $validated['date'] . ' ' . $validated['check_in'] . ':00';
        }
        if ($validated['check_out']) {
            $validated['check_out'] = $validated['date'] . ' ' . $validated['check_out'] . ':00';
        }

        $attendance->update($validated);

        return redirect()->route('employees.attendance')
            ->with('success', 'تم تحديث سجل الحضور بنجاح');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $attendance = Attendance::findOrFail($id);
        $attendance->delete();

        return redirect()->route('employees.attendance')
            ->with('success', 'تم حذف سجل الحضور بنجاح');
    }

    /**
     * Display attendance reports.
     */
    public function reports(Request $request)
    {
        $employees = Employee::select('id', 'employee_number', 'name', 'position', 'department')->get();
        
        $employeeId = $request->get('employee_id');
        $period = $request->get('period', 'monthly'); // daily, weekly, monthly
        $startDate = $request->get('start_date');
        $endDate = $request->get('end_date');

        // تحديد التواريخ حسب الفترة
        $now = now();
        if (!$startDate || !$endDate) {
            switch ($period) {
                case 'daily':
                    $startDate = $now->format('Y-m-d');
                    $endDate = $now->format('Y-m-d');
                    break;
                case 'weekly':
                    $startDate = $now->startOfWeek()->format('Y-m-d');
                    $endDate = $now->endOfWeek()->format('Y-m-d');
                    break;
                case 'monthly':
                default:
                    $startDate = $now->startOfMonth()->format('Y-m-d');
                    $endDate = $now->endOfMonth()->format('Y-m-d');
                    break;
            }
        }

        $query = Attendance::with('employee')
            ->whereBetween('date', [$startDate, $endDate]);

        if ($employeeId) {
            $query->where('employee_id', $employeeId);
        }

        $attendances = $query->get()->map(function ($attendance) {
            $checkIn = null;
            $checkOut = null;
            
            if ($attendance->check_in) {
                if (is_string($attendance->check_in)) {
                    $checkIn = date('H:i', strtotime($attendance->check_in));
                } else {
                    $checkIn = $attendance->check_in->format('H:i');
                }
            }
            
            if ($attendance->check_out) {
                if (is_string($attendance->check_out)) {
                    $checkOut = date('H:i', strtotime($attendance->check_out));
                } else {
                    $checkOut = $attendance->check_out->format('H:i');
                }
            }
            
            return [
                'id' => $attendance->id,
                'employeeId' => $attendance->employee->employee_number ?? '',
                'employeeName' => $attendance->employee->name ?? 'غير معروف',
                'position' => $attendance->employee->position ?? '',
                'department' => $attendance->employee->department ?? '',
                'date' => $attendance->date?->format('Y-m-d'),
                'checkIn' => $checkIn,
                'checkOut' => $checkOut,
                'totalHours' => $attendance->total_hours,
                'overtime' => $attendance->overtime,
                'status' => $attendance->status,
                'notes' => $attendance->notes,
            ];
        });

        // إحصائيات حسب الموظف
        $employeeStats = [];
        if ($employeeId) {
            $employee = Employee::find($employeeId);
            if ($employee) {
                $employeeAttendances = Attendance::where('employee_id', $employeeId)
                    ->whereBetween('date', [$startDate, $endDate])
                    ->get();
                
                $presentCount = $employeeAttendances->where('status', 'present')->count();
                $absentCount = $employeeAttendances->where('status', 'absent')->count();
                $lateCount = $employeeAttendances->where('status', 'late')->count();
                $halfDayCount = $employeeAttendances->where('status', 'half_day')->count();
                $onLeaveCount = $employeeAttendances->where('status', 'on_leave')->count();
                $totalDays = $employeeAttendances->count();
                $totalHours = $employeeAttendances->sum('total_hours') ?? 0;
                $totalOvertime = $employeeAttendances->sum('overtime') ?? 0;
                
                // حساب معدل الحضور
                $workingDays = $totalDays > 0 ? $totalDays : 1;
                $attendanceRate = $totalDays > 0 ? ($presentCount / $workingDays) * 100 : 0;
                
                $employeeStats = [
                    'employeeId' => $employee->employee_number,
                    'employeeName' => $employee->name,
                    'position' => $employee->position ?? '',
                    'department' => $employee->department ?? '',
                    'totalDays' => $totalDays,
                    'presentCount' => $presentCount,
                    'absentCount' => $absentCount,
                    'lateCount' => $lateCount,
                    'halfDayCount' => $halfDayCount,
                    'onLeaveCount' => $onLeaveCount,
                    'totalHours' => round($totalHours, 2),
                    'totalOvertime' => round($totalOvertime, 2),
                    'attendanceRate' => round($attendanceRate, 2),
                ];
            }
        } else {
            // إحصائيات عامة لجميع الموظفين
            $allAttendances = Attendance::whereBetween('date', [$startDate, $endDate])->get();
            $totalRecords = $allAttendances->count();
            $presentCount = $allAttendances->where('status', 'present')->count();
            $absentCount = $allAttendances->where('status', 'absent')->count();
            $lateCount = $allAttendances->where('status', 'late')->count();
            $totalHours = $allAttendances->sum('total_hours') ?? 0;
            $totalOvertime = $allAttendances->sum('overtime') ?? 0;
            
            $employeeStats = [
                'totalRecords' => $totalRecords,
                'presentCount' => $presentCount,
                'absentCount' => $absentCount,
                'lateCount' => $lateCount,
                'totalHours' => round($totalHours, 2),
                'totalOvertime' => round($totalOvertime, 2),
            ];
        }

        return Inertia::render('Employees/Attendance/Reports', [
            'attendances' => $attendances,
            'employees' => $employees,
            'employeeStats' => $employeeStats,
            'filters' => [
                'employee_id' => $employeeId,
                'period' => $period,
                'start_date' => $startDate,
                'end_date' => $endDate,
            ],
        ]);
    }
}
