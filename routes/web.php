<?php

use App\Http\Controllers\IngredientCategoryController;
use App\Http\Controllers\UnitController;
use App\Http\Controllers\IngredientController;
use App\Http\Controllers\SupplierController;
use App\Http\Controllers\PurchaseOrderController;
use App\Http\Controllers\PurchaseItemController;
use App\Http\Controllers\InventoryController;
use App\Http\Controllers\StockMovementController;
use App\Http\Controllers\StockAdjustmentController;
use App\Http\Controllers\RecipeController;
use App\Http\Controllers\RecipeIngredientController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\SaleController;
use App\Http\Controllers\SaleItemController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::middleware('auth')->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
    Route::resource('ingredient-categories', IngredientCategoryController::class);
    Route::resource('units', UnitController::class);
    Route::resource('ingredients', IngredientController::class);
    Route::resource('suppliers', SupplierController::class);
    Route::resource('purchase-orders', PurchaseOrderController::class);
    Route::resource('recipes', RecipeController::class);
    Route::resource('customers', CustomerController::class);
    Route::resource('sales', SaleController::class);
    Route::post(
        'purchase-orders/{purchaseOrder}/items',
        [PurchaseItemController::class, 'store']
    )->name('purchase-orders.items.store');

    Route::put(
        'purchase-orders/{purchaseOrder}/items/{purchaseItem}',
        [PurchaseItemController::class, 'update']
    )->name('purchase-orders.items.update');

    Route::delete(
        'purchase-orders/{purchaseOrder}/items/{purchaseItem}',
        [PurchaseItemController::class, 'destroy']
    )->name('purchase-orders.items.destroy');

    Route::post(
        'purchase-orders/{purchaseOrder}/receive',
        [PurchaseOrderController::class, 'receive']
    )->name('purchase-orders.receive');

    Route::get(
        'inventory',
        [InventoryController::class, 'index']
    )->name('inventory.index');
    Route::get(
        'inventory/movements',
        [StockMovementController::class, 'index']
    )->name('inventory.movements');
    Route::get(
        'inventory/adjustment',
        [StockAdjustmentController::class, 'create']
    )->name('inventory.adjustment');

    Route::post(
        'inventory/adjustment',
        [StockAdjustmentController::class, 'store']
    )->name('inventory.adjustment.store');

    Route::post(
        'recipes/{recipe}/ingredients',
        [RecipeIngredientController::class, 'store']
    )->name('recipes.ingredients.store');

    Route::put(
        'recipes/{recipe}/ingredients/{ingredient}',
        [RecipeIngredientController::class, 'update']
    )->name('recipes.ingredients.update');

    Route::delete(
        'recipes/{recipe}/ingredients/{ingredient}',
        [RecipeIngredientController::class, 'destroy']
    )->name('recipes.ingredients.destroy');

    Route::post(
        'sales/{sale}/items',
        [SaleItemController::class, 'store']
    )->name('sales.items.store');

    Route::put(
        'sales/{sale}/items/{saleItem}',
        [SaleItemController::class, 'update']
    )->name('sales.items.update');

    Route::delete(
        'sales/{sale}/items/{saleItem}',
        [SaleItemController::class, 'destroy']
    )->name('sales.items.destroy');

    Route::post(
        'sales/{sale}/complete',
        [SaleController::class, 'complete']
    )->name('sales.complete');

    Route::post(
        'sales/{sale}/cancel',
        [SaleController::class, 'cancel']
    )->name('sales.cancel');

    Route::resource('sales', SaleController::class);
});

require __DIR__ . '/settings.php';
