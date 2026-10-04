<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePurchaseOrderRequest;
use App\Http\Requests\UpdatePurchaseOrderRequest;
use App\Models\PurchaseOrder;
use App\Models\Supplier;
use App\Models\Ingredient;
use App\Models\StockMovement;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class PurchaseOrderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        $this->authorize('viewAny', PurchaseOrder::class);

        $purchaseOrders = PurchaseOrder::query()
            ->with('supplier')
            ->latest('order_date')
            ->latest()
            ->get();

        return Inertia::render('purchase-orders/index', [
            'purchaseOrders' => $purchaseOrders,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        $this->authorize('create', PurchaseOrder::class);

        $suppliers = Supplier::query()
            ->where('is_active', true)
            ->orderBy('name')
            ->get(['id', 'name']);

        return Inertia::render('purchase-orders/create', [
            'suppliers' => $suppliers,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(
        StorePurchaseOrderRequest $request
    ): RedirectResponse {
        $this->authorize('create', PurchaseOrder::class);

        $purchaseOrder = PurchaseOrder::create([
            'supplier_id' => $request->validated('supplier_id'),
            'user_id' => auth()->id(),
            'order_number' => $this->generateOrderNumber(),
            'order_date' => $request->validated('order_date'),
            'status' => 'pending',
            'notes' => $request->validated('notes'),
        ]);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Purchase order created successfully.',
        ]);

        return to_route('purchase-orders.show', $purchaseOrder);
    }

    /**
     * Display the specified resource.
     */
    public function show(PurchaseOrder $purchaseOrder): Response
    {
        $this->authorize('view', $purchaseOrder);

        $purchaseOrder->load('supplier', 'user', 'items.ingredient.unit');

        $ingredients = Ingredient::query()
            ->where('is_active', true)
            ->with('unit')
            ->orderBy('name')
            ->get([
                'id',
                'name',
                'unit_id',
            ]);

        return Inertia::render('purchase-orders/show', [
            'purchaseOrder' => $purchaseOrder,
            'ingredients' => $ingredients,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(PurchaseOrder $purchaseOrder): Response|RedirectResponse
    {
        $this->authorize('update', $purchaseOrder);

        if ($purchaseOrder->status !== 'pending') {
            return Inertia::flash('toast', [
                'type' => 'error',
                'message' => 'Only pending purchase orders can be edited.',
            ])->back();
        }

        $suppliers = Supplier::query()
            ->where('is_active', true)
            ->orderBy('name')
            ->get(['id', 'name']);

        return Inertia::render('purchase-orders/edit', [
            'purchaseOrder' => $purchaseOrder,
            'suppliers' => $suppliers,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(
        UpdatePurchaseOrderRequest $request,
        PurchaseOrder $purchaseOrder
    ): RedirectResponse {
        $this->authorize('update', $purchaseOrder);

        if ($purchaseOrder->status !== 'pending') {
            return Inertia::flash('toast', [
                'type' => 'error',
                'message' => 'Only pending purchase orders can be edited.',
            ])->back();
        }

        $purchaseOrder->update($request->validated());

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Purchase order updated successfully.',
        ]);

        return to_route('purchase-orders.show', $purchaseOrder);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(PurchaseOrder $purchaseOrder): RedirectResponse
    {
        $this->authorize('delete', $purchaseOrder);

        if ($purchaseOrder->status !== 'pending') {
            return Inertia::flash('toast', [
                'type' => 'error',
                'message' => 'Only pending purchase orders can be deleted.',
            ])->back();
        }

        $purchaseOrder->delete();

        return Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Purchase order deleted successfully.',
        ])->back();
    }

    private function generateOrderNumber(): string
    {
        $date = now()->format('Ymd');

        $lastOrder = PurchaseOrder::query()
            ->whereDate('created_at', now()->toDateString())
            ->latest('id')
            ->first();

        $sequence = $lastOrder
            ? ((int) substr($lastOrder->order_number, -4)) + 1
            : 1;

        return sprintf(
            'PO-%s-%04d',
            $date,
            $sequence
        );
    }

    public function receive(PurchaseOrder $purchaseOrder): RedirectResponse
    {
        $this->authorize('update', $purchaseOrder);

        if ($purchaseOrder->status !== 'pending') {
            return Inertia::flash('toast', [
                'type' => 'error',
                'message' => 'Only pending purchase orders can be received.',
            ])->back();
        }

        $purchaseOrder->load('items');

        if ($purchaseOrder->items->isEmpty()) {
            return Inertia::flash('toast', [
                'type' => 'error',
                'message' => 'Cannot receive a purchase order with no items.',
            ])->back();
        }

        DB::transaction(function () use ($purchaseOrder): void {
            foreach ($purchaseOrder->items as $item) {
                StockMovement::create([
                    'ingredient_id' => $item->ingredient_id,
                    'user_id' => auth()->id(),
                    'type' => 'purchase',
                    'quantity' => $item->quantity,
                    'reference_type' => PurchaseOrder::class,
                    'reference_id' => $purchaseOrder->id,
                    'notes' => 'Stock received for purchase order ' . $purchaseOrder->order_number,
                ]);
            }

            $purchaseOrder->update(['status' => 'received']);
        });

        return Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Purchase order received successfully.',
        ])->back();
    }
}
