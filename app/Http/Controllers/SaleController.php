<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreSaleRequest;
use App\Http\Requests\UpdateSaleRequest;
use App\Services\SaleService;
use App\Models\Sale;
use App\Models\Customer;
use App\Models\Recipe;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class SaleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        $this->authorize('viewAny', Sale::class);

        $sales = Sale::query()
            ->with(['customer', 'user'])
            ->latest('sale_date')
            ->get();

        return Inertia::render('sales/index', [
            'sales' => $sales,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        $this->authorize('create', Sale::class);

        $customers = Customer::query()
            ->where('is_active', true)
            ->orderBy('name')
            ->get(['id', 'name']);

        return Inertia::render('sales/create', [
            'customers' => $customers,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(
        StoreSaleRequest $request
    ): RedirectResponse {
        $this->authorize('create', Sale::class);

        $sale = Sale::create([
            'customer_id' => $request->validated('customer_id'),
            'user_id' => auth()->id(),
            'invoice_number' => $this->generateInvoiceNumber(),
            'sale_date' => $request->validated('sale_date'),
            'total_amount' => 0,
            'status' => 'pending',
            'notes' => $request->validated('notes'),
        ]);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Sale created successfully.',
        ]);

        return to_route('sales.show', $sale);
    }

    /**
     * Display the specified resource.
     */
    public function show(Sale $sale): Response
    {
        $this->authorize('view', $sale);

        $sale->load(['customer', 'user', 'items.recipe']);

        $recipes = Recipe::query()
            ->where('is_active', true)
            ->orderBy('name')
            ->get([
                'id',
                'name',
                'selling_price',
            ]);

        return Inertia::render('sales/show', [
            'sale' => $sale,
            'recipes' => $recipes,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Sale $sale): Response
    {
        $this->authorize('update', $sale);

        $customers = Customer::query()
            ->where('is_active', true)
            ->orderBy('name')
            ->get(['id', 'name']);

        return Inertia::render('sales/edit', [
            'sale' => $sale,
            'customers' => $customers,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(
        UpdateSaleRequest $request,
        Sale $sale
    ): RedirectResponse {
        $this->authorize('update', $sale);

        $sale->update(
            $request->validated()
        );

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Sale updated successfully.',
        ]);

        return to_route('sales.show', $sale);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Sale $sale): RedirectResponse
    {
        $this->authorize('delete', $sale);

        $sale->delete();

        return Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Sale deleted successfully.',
        ])->back();
    }

    private function generateInvoiceNumber(): string
    {
        $date = now()->format('Ymd');

        $lastSale = Sale::query()
            ->whereDate('created_at', today())
            ->latest('id')
            ->first();

        $sequence = $lastSale ? ((int) substr($lastSale->invoice_number, -4)) + 1 : 1;

        return sprintf('INV-%s-%04d', $date, $sequence);
    }

    public function complete(
        Sale $sale,
        SaleService $saleService
    ): RedirectResponse {
        $this->authorize('update', $sale);

        if ($sale->status !== 'pending') {
            return Inertia::flash('toast', [
                'type' => 'error',
                'message' => 'This sale has already been completed.',
            ])->back();
        }

        if (! $sale->items()->exists()) {
            return Inertia::flash('toast', [
                'type' => 'error',
                'message' => 'A sale must have at least one item before it can be completed.',
            ])->back();
        }

        try {
            $saleService->process($sale);
        } catch (\RuntimeException $exception) {
            return Inertia::flash('toast', [
                'type' => 'error',
                'message' => $exception->getMessage(),
            ])->back();
        }

        $sale->update([
            'status' => 'completed',
        ]);

        return Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Sale completed and stock deducted successfully.',
        ])->back();
    }

    public function cancel(
        Sale $sale,
        SaleService $saleService
    ): RedirectResponse {
        $this->authorize('update', $sale);

        if ($sale->status !== 'completed') {
            return Inertia::flash('toast', [
                'type' => 'error',
                'message' => 'Only completed sales can be cancelled.',
            ])->back();
        }

        $saleService->cancel($sale);

        return Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Sale cancelled and stock restored successfully.',
        ])->back();
    }
}
