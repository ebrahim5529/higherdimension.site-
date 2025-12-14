<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\CustomerApiController;

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// API Routes for Customers
Route::prefix('customers')->group(function () {
    Route::get('/', [CustomerApiController::class, 'index']);
    Route::post('/', [CustomerApiController::class, 'store']);
    Route::get('/{id}', [CustomerApiController::class, 'show']);
    Route::put('/{id}', [CustomerApiController::class, 'update']);
    Route::delete('/{id}', [CustomerApiController::class, 'destroy']);
});
