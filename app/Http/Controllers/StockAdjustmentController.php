<?php

namespace App\Http\Controllers;

use App\Models\Ingredient;
use App\Models\StockMovement;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class StockAdjustmentController extends Controller
{
    public function create(): Response
    {
        $this->authorize('viewAny', StockMovement::class);

        $ingredients = Ingredient::query()
            ->where('is_active', true)
            ->with('unit')
            ->orderBy('name')
            ->get(['id', 'name', 'unit_id']);

        return Inertia::render('inventory/adjustment', [
            'ingredients' => $ingredients,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $this->authorize('viewAny', StockMovement::class);

        $validated = $request->validate([
            'ingredient_id' => ['required', 'integer', 'exists:ingredients,id'],
            'type' => ['required', 'in:adjustment_in,adjustment_out'],
            'quantity' => ['required', 'numeric', 'gt:0'],
            'notes' => ['required', 'string', 'max:1000'],
        ]);

        $quantity = (float) $validated['quantity'];

        if ($validated['type'] === 'adjustment_out') {
            $currentStock = StockMovement::query()
                ->where('ingredient_id', $validated['ingredient_id'])
                ->sum('quantity');

            if ($quantity > $currentStock) {
                return Inertia::flash('toast', [
                    'type' => 'error',
                    'message' => 'Stock Out quantity cannot exceed the current stock.',
                ])->back();
            }

            $quantity *= -1;
        }

        StockMovement::create([
            'ingredient_id' => $validated['ingredient_id'],
            'user_id' => auth()->id(),
            'type' => $validated['type'],
            'quantity' => $quantity,
            'reference_type' => null,
            'reference_id' => null,
            'notes' => $validated['notes'],
        ]);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Stock adjustment recorded successfully.',
        ]);

        return to_route('inventory.index');
    }
}
