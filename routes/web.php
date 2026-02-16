<?php

use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Auth\ForgotPasswordController;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\ResetPasswordController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;

// Home page - redirect based on auth status
Route::get('/', function () {
    return \Inertia\Inertia::render('Home');
})->name('home');

// Login routes
Route::get('/login', [LoginController::class, 'show'])->middleware('guest')->name('login');
Route::post('/login', [LoginController::class, 'store'])->middleware('guest');

// Forgot password routes
Route::get('/forgot-password', [ForgotPasswordController::class, 'show'])->middleware('guest')->name('password.request');
Route::post('/forgot-password', [ForgotPasswordController::class, 'store'])->middleware('guest')->name('password.email');

Route::get('/reset-password/{token}', [ResetPasswordController::class, 'show'])->middleware('guest')->name('password.reset');
Route::post('/reset-password', [ResetPasswordController::class, 'store'])->middleware('guest')->name('password.update');

// Two Factor Authentication routes (accessible without auth, but requires login.id in session)
Route::get('/two-factor/challenge', [\App\Http\Controllers\Auth\TwoFactorController::class, 'show'])->name('two-factor.challenge');
Route::post('/two-factor/challenge', [\App\Http\Controllers\Auth\TwoFactorController::class, 'verify'])->name('two-factor.verify');
Route::post('/two-factor/resend', [\App\Http\Controllers\Auth\TwoFactorController::class, 'resend'])->name('two-factor.resend');

// Public routes (no authentication required)
Route::get('/contract/sign/{contractNumber}', [\App\Http\Controllers\Admin\ContractController::class, 'sign'])->name('contracts.sign');
Route::post('/contracts/{contractNumber}/sign', [\App\Http\Controllers\Admin\ContractController::class, 'saveSignature'])->name('contracts.saveSignature');

// Dashboard routes (protected)
Route::middleware('auth')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Main Dashboard
    Route::get('/dashboard/main-dashboard', [\App\Http\Controllers\Admin\MainDashboardController::class, 'index'])->name('dashboard.main');
    Route::get('/dashboard/dashboard-interactive', [\App\Http\Controllers\Admin\DashboardInteractiveController::class, 'index'])->name('dashboard.interactive');

    // Reports
    Route::get('/dashboard/operations-reports', [\App\Http\Controllers\Admin\OperationsReportsController::class, 'index'])->name('reports.operations');
    Route::get('/dashboard/customer-reports', [\App\Http\Controllers\Admin\CustomerReportsController::class, 'index'])->name('reports.customers');
    Route::get('/dashboard/financial-reports', [\App\Http\Controllers\Admin\FinancialReportsController::class, 'index'])->name('reports.financial');

    // Customers
    Route::middleware('permission:access-customers')->group(function () {
        Route::resource('customers', \App\Http\Controllers\Admin\CustomerController::class);
        Route::get('/dashboard/customer-management', [\App\Http\Controllers\Admin\CustomerController::class, 'index'])->name('customers.management');
        Route::get('/dashboard/customer-contracts', [\App\Http\Controllers\Admin\CustomerController::class, 'contracts'])->name('customers.contracts');
        Route::get('/dashboard/customer-claims', [\App\Http\Controllers\Admin\CustomerController::class, 'claims'])->name('customers.claims');
    });
    Route::middleware('permission:access-customers')->group(function () {
        Route::post('/customers/{id}/notes', [\App\Http\Controllers\Admin\CustomerController::class, 'storeNote'])->name('customers.notes.store');
        Route::get('/customers/{id}/download/id-card', [\App\Http\Controllers\Admin\CustomerController::class, 'downloadIdCard'])->name('customers.download.id-card');
        Route::get('/customers/{id}/download/guarantor-id-card', [\App\Http\Controllers\Admin\CustomerController::class, 'downloadGuarantorIdCard'])->name('customers.download.guarantor-id-card');
        Route::get('/customers/{id}/download/commercial-record', [\App\Http\Controllers\Admin\CustomerController::class, 'downloadCommercialRecord'])->name('customers.download.commercial-record');
        Route::get('/customers/{id}/view/id-card', [\App\Http\Controllers\Admin\CustomerController::class, 'viewIdCard'])->name('customers.view.id-card');
        Route::get('/customers/{id}/view/guarantor-id-card', [\App\Http\Controllers\Admin\CustomerController::class, 'viewGuarantorIdCard'])->name('customers.view.guarantor-id-card');
        Route::get('/customers/{id}/view/commercial-record', [\App\Http\Controllers\Admin\CustomerController::class, 'viewCommercialRecord'])->name('customers.view.commercial-record');
    });

    // Contracts - يجب وضع المسارات المخصصة قبل Route::resource
    Route::middleware('permission:access-contracts')->group(function () {
        Route::get('/contracts/active', [\App\Http\Controllers\Admin\ContractController::class, 'active'])->name('contracts.active');
        Route::get('/contracts/expired', [\App\Http\Controllers\Admin\ContractController::class, 'expired'])->name('contracts.expired');
        Route::get('/contracts/cancelled', [\App\Http\Controllers\Admin\ContractController::class, 'cancelled'])->name('contracts.cancelled');
        Route::get('/contracts/{id}/invoice', [\App\Http\Controllers\Admin\ContractController::class, 'invoice'])->name('contracts.invoice');
        Route::resource('contracts', \App\Http\Controllers\Admin\ContractController::class);
        Route::get('/dashboard/contract-management', [\App\Http\Controllers\Admin\ContractController::class, 'index'])->name('contracts.management');
        Route::post('/contracts/{id}/attachments', [\App\Http\Controllers\Admin\ContractController::class, 'uploadAttachment'])->name('contracts.attachments.upload');
        Route::delete('/contracts/{contractId}/attachments/{attachmentId}', [\App\Http\Controllers\Admin\ContractController::class, 'deleteAttachment'])->name('contracts.attachments.delete');
        Route::get('/contracts/{contractId}/attachments/{attachmentId}/download', [\App\Http\Controllers\Admin\ContractController::class, 'downloadAttachment'])->name('contracts.attachments.download');
    });

    // Suppliers
    Route::resource('suppliers', \App\Http\Controllers\Admin\SupplierController::class);
    Route::get('/dashboard/supplier-management', [\App\Http\Controllers\Admin\SupplierController::class, 'index'])->name('suppliers.management');

    // Inventory
    Route::resource('inventory', \App\Http\Controllers\Admin\InventoryController::class);
    Route::get('/dashboard/inventory-status', [\App\Http\Controllers\Admin\InventoryController::class, 'index'])->name('inventory.status');
    Route::get('/api/inventory/stats', [\App\Http\Controllers\Admin\InventoryController::class, 'stats'])->name('inventory.stats');
    Route::get('/api/scaffolds/available', [\App\Http\Controllers\Admin\InventoryController::class, 'getAvailableScaffolds'])->name('scaffolds.available');

    // Employees - Sub-menus must come BEFORE resource route
    // Salaries routes
    Route::get('/employees/salaries', [\App\Http\Controllers\Admin\SalaryController::class, 'index'])->name('employees.salaries');
    Route::get('/employees/salaries/create', [\App\Http\Controllers\Admin\SalaryController::class, 'create'])->name('employees.salaries.create');
    Route::post('/employees/salaries', [\App\Http\Controllers\Admin\SalaryController::class, 'store'])->name('employees.salaries.store');
    Route::get('/employees/salaries/{id}', [\App\Http\Controllers\Admin\SalaryController::class, 'show'])->name('employees.salaries.show');
    Route::get('/employees/salaries/{id}/edit', [\App\Http\Controllers\Admin\SalaryController::class, 'edit'])->name('employees.salaries.edit');
    Route::put('/employees/salaries/{id}', [\App\Http\Controllers\Admin\SalaryController::class, 'update'])->name('employees.salaries.update');
    Route::delete('/employees/salaries/{id}', [\App\Http\Controllers\Admin\SalaryController::class, 'destroy'])->name('employees.salaries.destroy');

    // Incentives routes
    Route::get('/employees/incentives', [\App\Http\Controllers\Admin\IncentiveController::class, 'index'])->name('employees.incentives');
    Route::get('/employees/incentives/create', [\App\Http\Controllers\Admin\IncentiveController::class, 'create'])->name('employees.incentives.create');
    Route::post('/employees/incentives', [\App\Http\Controllers\Admin\IncentiveController::class, 'store'])->name('employees.incentives.store');
    Route::get('/employees/incentives/{id}', [\App\Http\Controllers\Admin\IncentiveController::class, 'show'])->name('employees.incentives.show');
    Route::get('/employees/incentives/{id}/edit', [\App\Http\Controllers\Admin\IncentiveController::class, 'edit'])->name('employees.incentives.edit');
    Route::put('/employees/incentives/{id}', [\App\Http\Controllers\Admin\IncentiveController::class, 'update'])->name('employees.incentives.update');
    Route::delete('/employees/incentives/{id}', [\App\Http\Controllers\Admin\IncentiveController::class, 'destroy'])->name('employees.incentives.destroy');

    // Attendance routes
    Route::get('/employees/attendance', [\App\Http\Controllers\Admin\AttendanceController::class, 'index'])->name('employees.attendance');
    Route::get('/employees/attendance/reports', [\App\Http\Controllers\Admin\AttendanceController::class, 'reports'])->name('employees.attendance.reports');
    Route::get('/employees/attendance/create', [\App\Http\Controllers\Admin\AttendanceController::class, 'create'])->name('employees.attendance.create');
    Route::post('/employees/attendance', [\App\Http\Controllers\Admin\AttendanceController::class, 'store'])->name('employees.attendance.store');
    Route::get('/employees/attendance/{id}', [\App\Http\Controllers\Admin\AttendanceController::class, 'show'])->name('employees.attendance.show');
    Route::get('/employees/attendance/{id}/edit', [\App\Http\Controllers\Admin\AttendanceController::class, 'edit'])->name('employees.attendance.edit');
    Route::put('/employees/attendance/{id}', [\App\Http\Controllers\Admin\AttendanceController::class, 'update'])->name('employees.attendance.update');
    Route::delete('/employees/attendance/{id}', [\App\Http\Controllers\Admin\AttendanceController::class, 'destroy'])->name('employees.attendance.destroy');

    // Departments routes
    Route::get('/employees/departments', [\App\Http\Controllers\Admin\DepartmentController::class, 'index'])->name('employees.departments');
    Route::get('/employees/departments/create', [\App\Http\Controllers\Admin\DepartmentController::class, 'create'])->name('employees.departments.create');
    Route::post('/employees/departments', [\App\Http\Controllers\Admin\DepartmentController::class, 'store'])->name('employees.departments.store');
    Route::get('/employees/departments/{id}', [\App\Http\Controllers\Admin\DepartmentController::class, 'show'])->name('employees.departments.show');
    Route::get('/employees/departments/{id}/edit', [\App\Http\Controllers\Admin\DepartmentController::class, 'edit'])->name('employees.departments.edit');
    Route::put('/employees/departments/{id}', [\App\Http\Controllers\Admin\DepartmentController::class, 'update'])->name('employees.departments.update');
    Route::delete('/employees/departments/{id}', [\App\Http\Controllers\Admin\DepartmentController::class, 'destroy'])->name('employees.departments.destroy');

    // Leaves routes
    Route::get('/employees/leaves', [\App\Http\Controllers\Admin\LeaveController::class, 'index'])->name('employees.leaves');
    Route::get('/employees/leaves/create', [\App\Http\Controllers\Admin\LeaveController::class, 'create'])->name('employees.leaves.create');
    Route::post('/employees/leaves', [\App\Http\Controllers\Admin\LeaveController::class, 'store'])->name('employees.leaves.store');
    Route::get('/employees/leaves/{id}', [\App\Http\Controllers\Admin\LeaveController::class, 'show'])->name('employees.leaves.show');
    Route::get('/employees/leaves/{id}/edit', [\App\Http\Controllers\Admin\LeaveController::class, 'edit'])->name('employees.leaves.edit');
    Route::put('/employees/leaves/{id}', [\App\Http\Controllers\Admin\LeaveController::class, 'update'])->name('employees.leaves.update');
    Route::delete('/employees/leaves/{id}', [\App\Http\Controllers\Admin\LeaveController::class, 'destroy'])->name('employees.leaves.destroy');

    // Employees Resource
    Route::resource('employees', \App\Http\Controllers\Admin\EmployeeController::class);
    Route::get('/dashboard/employee-management', [\App\Http\Controllers\Admin\EmployeeController::class, 'index'])->name('employees.management');

    // Payments Management Routes - Specific routes must come before resource routes
    Route::middleware('permission:access-financial')->group(function () {
        Route::get('/payments', [\App\Http\Controllers\Admin\PaymentController::class, 'index'])->name('payments.index');
        Route::get('/payments/create', [\App\Http\Controllers\Admin\PaymentController::class, 'create'])->name('payments.create');
        Route::post('/payments', [\App\Http\Controllers\Admin\PaymentController::class, 'store'])->name('payments.store');
        Route::get('/payments/late', [\App\Http\Controllers\Admin\PaymentController::class, 'latePayments'])->name('payments.late');
        Route::get('/payments/reports', [\App\Http\Controllers\Admin\PaymentController::class, 'reports'])->name('payments.reports');
        Route::get('/payments/{id}', [\App\Http\Controllers\Admin\PaymentController::class, 'show'])->name('payments.show');
    });

    // Permissions Management Routes
    Route::middleware('permission:access-permissions')->group(function () {
        Route::get('/dashboard/user-roles', [\App\Http\Controllers\Admin\UserRoleController::class, 'index'])->name('user-roles.index');
        Route::post('/user-roles', [\App\Http\Controllers\Admin\UserRoleController::class, 'store'])->name('user-roles.store');
        Route::get('/user-roles/{user}', [\App\Http\Controllers\Admin\UserRoleController::class, 'show'])->name('user-roles.show');
        Route::put('/user-roles/{user}', [\App\Http\Controllers\Admin\UserRoleController::class, 'update'])->name('user-roles.update');
        Route::delete('/user-roles/{user}', [\App\Http\Controllers\Admin\UserRoleController::class, 'destroy'])->name('user-roles.destroy');
        Route::put('/user-roles/{user}/roles', [\App\Http\Controllers\Admin\UserRoleController::class, 'updateRoles'])->name('user-roles.update-roles');
        Route::put('/user-roles/{user}/permissions', [\App\Http\Controllers\Admin\UserRoleController::class, 'updatePermissions'])->name('user-roles.update-permissions');

        Route::get('/dashboard/permission-groups', [\App\Http\Controllers\Admin\PermissionController::class, 'index'])->name('permissions.index');
        Route::post('/permissions', [\App\Http\Controllers\Admin\PermissionController::class, 'store'])->name('permissions.store');
        Route::put('/permissions/{permission}', [\App\Http\Controllers\Admin\PermissionController::class, 'update'])->name('permissions.update');
        Route::delete('/permissions/{permission}', [\App\Http\Controllers\Admin\PermissionController::class, 'destroy'])->name('permissions.destroy');

        Route::get('/dashboard/roles', [\App\Http\Controllers\Admin\RoleController::class, 'index'])->name('roles.index');
        Route::post('/roles', [\App\Http\Controllers\Admin\RoleController::class, 'store'])->name('roles.store');
        Route::put('/roles/{role}', [\App\Http\Controllers\Admin\RoleController::class, 'update'])->name('roles.update');
        Route::delete('/roles/{role}', [\App\Http\Controllers\Admin\RoleController::class, 'destroy'])->name('roles.destroy');
    });

    // Profile routes
    Route::get('/dashboard/profile', [\App\Http\Controllers\ProfileController::class, 'show'])->name('profile.show');
    Route::put('/profile', [\App\Http\Controllers\ProfileController::class, 'updateProfile'])->name('profile.update');
    Route::put('/profile/password', [\App\Http\Controllers\ProfileController::class, 'changePassword'])->name('profile.password.update');
    Route::post('/profile/two-factor/enable', [\App\Http\Controllers\ProfileController::class, 'enableTwoFactor'])->name('profile.two-factor.enable');
    Route::post('/profile/two-factor/disable', [\App\Http\Controllers\ProfileController::class, 'disableTwoFactor'])->name('profile.two-factor.disable');

    Route::middleware('permission:manage-electronic-signature')->group(function () {
        Route::get('/dashboard/electronic-signature', [\App\Http\Controllers\Admin\ElectronicSignatureController::class, 'index'])->name('settings.electronic-signature');
        Route::post('/dashboard/electronic-signature', [\App\Http\Controllers\Admin\ElectronicSignatureController::class, 'store'])->name('settings.electronic-signature.store');
    });

    Route::middleware('permission:access-settings')->group(function () {
        Route::get('/dashboard/locations', [\App\Http\Controllers\Admin\LocationController::class, 'index'])->name('settings.locations');
        Route::get('/dashboard/locations/governorates', [\App\Http\Controllers\Admin\LocationController::class, 'index'])->name('settings.locations.governorates');
        Route::get('/dashboard/locations/wilayats', [\App\Http\Controllers\Admin\LocationController::class, 'wilayatsIndex'])->name('settings.locations.wilayats');

        // Governorates
        Route::post('/locations/governorates', [\App\Http\Controllers\Admin\LocationController::class, 'storeGovernorate'])->name('locations.governorates.store');
        Route::put('/locations/governorates/{governorate}', [\App\Http\Controllers\Admin\LocationController::class, 'updateGovernorate'])->name('locations.governorates.update');
        Route::delete('/locations/governorates/{governorate}', [\App\Http\Controllers\Admin\LocationController::class, 'destroyGovernorate'])->name('locations.governorates.destroy');

        // Wilayats
        Route::post('/locations/wilayats', [\App\Http\Controllers\Admin\LocationController::class, 'storeWilayat'])->name('locations.wilayats.store');
        Route::put('/locations/wilayats/{wilayat}', [\App\Http\Controllers\Admin\LocationController::class, 'updateWilayat'])->name('locations.wilayats.update');
        Route::delete('/locations/wilayats/{wilayat}', [\App\Http\Controllers\Admin\LocationController::class, 'destroyWilayat'])->name('locations.wilayats.destroy');

        Route::get('/dashboard/smtp-settings', [\App\Http\Controllers\Admin\SmtpSettingsController::class, 'index'])->name('settings.smtp');
        Route::post('/dashboard/smtp-settings', [\App\Http\Controllers\Admin\SmtpSettingsController::class, 'update'])->name('settings.smtp.update');
        Route::post('/dashboard/smtp-settings/test', [\App\Http\Controllers\Admin\SmtpSettingsController::class, 'test'])->name('settings.smtp.test');
    });

    Route::get('/api/locations/governorates', [\App\Http\Controllers\Admin\LocationController::class, 'getGovernorates'])->name('locations.governorates.index');
    Route::get('/api/locations/governorates/{governorate}/wilayats', [\App\Http\Controllers\Admin\LocationController::class, 'getWilayats'])->name('locations.governorates.wilayats');

    // Security Notifications routes
    Route::get('/dashboard/notifications', [\App\Http\Controllers\SecurityNotificationController::class, 'index'])->name('notifications.index');
    Route::post('/notifications/{notification}/read', [\App\Http\Controllers\SecurityNotificationController::class, 'markAsRead'])->name('notifications.read');
    Route::post('/notifications/read-all', [\App\Http\Controllers\SecurityNotificationController::class, 'markAllAsRead'])->name('notifications.read-all');
    Route::delete('/notifications/{notification}', [\App\Http\Controllers\SecurityNotificationController::class, 'destroy'])->name('notifications.destroy');

    // Accounting Module
    Route::prefix('accounting')->name('accounting.')->group(function () {
        // Chart of Accounts
        Route::get('/chart-of-accounts', [\App\Http\Controllers\Admin\AccountController::class, 'index'])->name('chart-of-accounts.index');
        Route::post('/chart-of-accounts', [\App\Http\Controllers\Admin\AccountController::class, 'store'])->name('chart-of-accounts.store');
        Route::put('/chart-of-accounts/{id}', [\App\Http\Controllers\Admin\AccountController::class, 'update'])->name('chart-of-accounts.update');
        Route::delete('/chart-of-accounts/{id}', [\App\Http\Controllers\Admin\AccountController::class, 'destroy'])->name('chart-of-accounts.destroy');

        // Journal Entries
        Route::get('/journal-entries', [\App\Http\Controllers\Admin\JournalEntryController::class, 'index'])->name('journal-entries.index');
        Route::get('/journal-entries/create', [\App\Http\Controllers\Admin\JournalEntryController::class, 'create'])->name('journal-entries.create');
        Route::post('/journal-entries', [\App\Http\Controllers\Admin\JournalEntryController::class, 'store'])->name('journal-entries.store');
        Route::get('/journal-entries/{id}', [\App\Http\Controllers\Admin\JournalEntryController::class, 'show'])->name('journal-entries.show');
        Route::get('/journal-entries/{id}/edit', [\App\Http\Controllers\Admin\JournalEntryController::class, 'edit'])->name('journal-entries.edit');
        Route::put('/journal-entries/{id}', [\App\Http\Controllers\Admin\JournalEntryController::class, 'update'])->name('journal-entries.update');
        Route::delete('/journal-entries/{id}', [\App\Http\Controllers\Admin\JournalEntryController::class, 'destroy'])->name('journal-entries.destroy');
        Route::post('/journal-entries/{id}/post', [\App\Http\Controllers\Admin\JournalEntryController::class, 'post'])->name('journal-entries.post');

        // Accounting Reports
        Route::get('/reports/trial-balance', [\App\Http\Controllers\Admin\AccountingReportController::class, 'trialBalance'])->name('reports.trial-balance');
        Route::get('/reports/balance-sheet', [\App\Http\Controllers\Admin\AccountingReportController::class, 'balanceSheet'])->name('reports.balance-sheet');
        Route::get('/reports/income-statement', [\App\Http\Controllers\Admin\AccountingReportController::class, 'incomeStatement'])->name('reports.income-statement');
        Route::get('/reports/general-ledger', [\App\Http\Controllers\Admin\AccountingReportController::class, 'generalLedger'])->name('reports.general-ledger');
        Route::get('/reports/account-statement', [\App\Http\Controllers\Admin\AccountingReportController::class, 'accountStatement'])->name('reports.account-statement');
        Route::get('/reports/journal-report', [\App\Http\Controllers\Admin\AccountingReportController::class, 'journalReport'])->name('reports.journal-report');
    });

    Route::post('/logout', function (Request $request) {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/login')->with('success', 'تم تسجيل الخروج بنجاح. نراك قريباً!');
    })->name('logout');
});
