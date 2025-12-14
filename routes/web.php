<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Admin\DashboardController;

// Home page - redirect based on auth status
Route::get('/', function () {
    return \Inertia\Inertia::render('Home');
})->name('home');

// Login routes
Route::get('/login', [LoginController::class, 'show'])->middleware('guest')->name('login');
Route::post('/login', [LoginController::class, 'store'])->middleware('guest');

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
    Route::resource('customers', \App\Http\Controllers\Admin\CustomerController::class);
    Route::get('/dashboard/customer-management', [\App\Http\Controllers\Admin\CustomerController::class, 'index'])->name('customers.management');
    
    // Suppliers
    Route::resource('suppliers', \App\Http\Controllers\Admin\SupplierController::class);
    Route::get('/dashboard/supplier-management', [\App\Http\Controllers\Admin\SupplierController::class, 'index'])->name('suppliers.management');
    
    // Inventory
    Route::resource('inventory', \App\Http\Controllers\Admin\InventoryController::class);
    Route::get('/dashboard/inventory-status', [\App\Http\Controllers\Admin\InventoryController::class, 'index'])->name('inventory.status');
    Route::get('/api/inventory/stats', [\App\Http\Controllers\Admin\InventoryController::class, 'stats'])->name('inventory.stats');
    
    Route::post('/logout', function (Request $request) {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return redirect('/login');
    })->name('logout');
});
