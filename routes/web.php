<?php

use App\Http\Controllers\IngredientCategoryController;
use App\Http\Controllers\UnitController;
use App\Http\Controllers\IngredientController;
use App\Http\Controllers\SupplierController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::middleware('auth')->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
    Route::resource('ingredient-categories', IngredientCategoryController::class);
    Route::resource('units', UnitController::class);
    Route::resource('ingredients', IngredientController::class);
    Route::resource('suppliers', SupplierController::class);
});

require __DIR__.'/settings.php';
