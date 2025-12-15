<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Employee extends Model
{
    use HasFactory;

    protected $fillable = [
        'employee_number',
        'name',
        'arabic_name',
        'email',
        'phone',
        'mobile',
        'address',
        'city',
        'nationality',
        'date_of_birth',
        'gender',
        'marital_status',
        'id_number',
        'passport_number',
        'position',
        'department',
        'manager',
        'location',
        'hire_date',
        'contract_type',
        'work_schedule',
        'status',
        'basic_salary',
        'allowances',
        'total_salary',
        'currency',
        'payment_method',
        'bank_account',
        'documents',
        'notes',
    ];

    protected function casts(): array
    {
        return [
            'date_of_birth' => 'date',
            'hire_date' => 'date',
            'basic_salary' => 'decimal:2',
            'allowances' => 'decimal:2',
            'total_salary' => 'decimal:2',
            'documents' => 'array',
        ];
    }

    public function salaries(): HasMany
    {
        return $this->hasMany(Salary::class);
    }

    public function incentives(): HasMany
    {
        return $this->hasMany(Incentive::class);
    }

    public function attendance(): HasMany
    {
        return $this->hasMany(Attendance::class);
    }

    public function leaves(): HasMany
    {
        return $this->hasMany(Leave::class);
    }

    public function managedDepartment(): BelongsTo
    {
        return $this->belongsTo(Department::class, 'id', 'manager_id');
    }
}
