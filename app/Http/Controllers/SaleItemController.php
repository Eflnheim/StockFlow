<?php

namespace App\Http\Controllers;

use App\Models\Recipe;
use App\Models\Sale;
use App\Models\SaleItem;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SaleItemController extends Controller
{
    public function store(
        Request $request,
        Sale $sale
    ): RedirectResponse {
        $this->authorize('create', Sale::class);

        $validated = $request->validate([
            'recipe_id' => [
                'required',
                'integer',
                'exists:recipes,id',
            ],
            'quantity' => [
                'required',
                'numeric',
                'gt:0',
            ],
        ]);

        $recipe = Recipe::query()
            ->where('is_active', true)
            ->findOrFail($validated['recipe_id']);

        $sale->items()->create([
            'recipe_id' => $recipe->id,
            'quantity' => $validated['quantity'],
            'unit_price' => $recipe->selling_price,
        ]);

        $this->updateSaleTotal($sale);

        return Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Sale item added successfully.',
        ])->back();
    }

    public function update(
        Request $request,
        Sale $sale,
        SaleItem $saleItem
    ): RedirectResponse {
        $this->authorize('update', $sale);

        if ($saleItem->sale_id !== $sale->id) {
            abort(404);
        }

        $validated = $request->validate([
            'quantity' => [
                'required',
                'numeric',
                'gt:0',
            ],
        ]);

        $saleItem->update([
            'quantity' => $validated['quantity'],
        ]);

        $this->updateSaleTotal($sale);

        return Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Sale item updated successfully.',
        ])->back();
    }

    public function destroy(
        Sale $sale,
        SaleItem $saleItem
    ): RedirectResponse {
        $this->authorize('update', $sale);

        if ($saleItem->sale_id !== $sale->id) {
            abort(404);
        }

        $saleItem->delete();

        $this->updateSaleTotal($sale);

        return Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Sale item removed successfully.',
        ])->back();
    }

    private function updateSaleTotal(Sale $sale): void
    {
        $total = $sale->items()
            ->selectRaw(
                'COALESCE(SUM(quantity * unit_price), 0) as total'
            )
            ->value('total');

        $sale->update([
            'total_amount' => $total,
        ]);
    }
}

