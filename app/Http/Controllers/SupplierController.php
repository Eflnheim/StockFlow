<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreSupplierRequest;
use App\Http\Requests\UpdateSupplierRequest;
use App\Models\Supplier;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class SupplierController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        $this->authorize('viewAny', Supplier::class);

        $suppliers = Supplier::query()
            ->latest()
            ->get();

        return Inertia::render('suppliers/index', [
            'suppliers' => $suppliers,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        $this->authorize('create', Supplier::class);

        return Inertia::render('suppliers/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(
        StoreSupplierRequest $request
    ): RedirectResponse {
        $this->authorize('create', Supplier::class);

        Supplier::create($request->validated());

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Supplier created successfully.',
        ]);

        return to_route('suppliers.index');
    }

    /**
     * Display the specified resource.
     */
    public function show(Supplier $supplier): Response
    {
        $this->authorize('view', $supplier);

        return Inertia::render('suppliers/show', [
            'supplier' => $supplier,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Supplier $supplier): Response
    {
        $this->authorize('update', $supplier);

        return Inertia::render('suppliers/edit', [
            'supplier' => $supplier,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(
        UpdateSupplierRequest $request,
        Supplier $supplier
    ): RedirectResponse {
        $this->authorize('update', $supplier);

        $supplier->update($request->validated());

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Supplier updated successfully.',
        ]);

        return to_route('suppliers.index');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Supplier $supplier): RedirectResponse
    {
        $this->authorize('delete', $supplier);

        if ($supplier->purchaseOrders()->exists()) {
            return Inertia::flash('toast', [
                'type' => 'error',
                'message' => 'Cannot delete a supplier that is used by a purchase order.',
            ])->back();
        }

        $supplier->delete();

        return Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Supplier deleted successfully.',
        ])->back();
    }
}
