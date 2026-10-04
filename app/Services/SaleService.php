<?php

namespace App\Services;

use App\Models\Sale;
use Illuminate\Support\Facades\DB;
use RuntimeException;

class SaleService
{
    public function process(Sale $sale): void
    {
        DB::transaction(function () use ($sale) {
            $sale->load([
                'items.recipe.ingredients',
            ]);

            foreach ($sale->items as $item) {
                foreach ($item->recipe->ingredients as $ingredient) {
                    $requiredQuantity =
                        (float) $ingredient->pivot->quantity
                        * (float) $item->quantity;

                    $currentStock = $ingredient->stockMovements()
                        ->sum('quantity');

                    if ($requiredQuantity > $currentStock) {
                        throw new RuntimeException(
                            "Insufficient stock for {$ingredient->name}."
                        );
                    }

                    $ingredient->stockMovements()->create([
                        'user_id' => $sale->user_id,
                        'type' => 'sale',
                        'quantity' => -$requiredQuantity,
                        'reference_type' => Sale::class,
                        'reference_id' => $sale->id,
                        'notes' => "Stock used for sale {$sale->invoice_number}.",
                    ]);
                }
            }
        });
    }

    public function cancel(Sale $sale): void
    {
        DB::transaction(function () use ($sale) {
            $sale->load([
                'items.recipe.ingredients',
            ]);

            foreach ($sale->items as $item) {
                foreach ($item->recipe->ingredients as $ingredient) {
                    $restoredQuantity =
                        (float) $ingredient->pivot->quantity
                        * (float) $item->quantity;

                    $ingredient->stockMovements()->create([
                        'user_id' => auth()->id(),
                        'type' => 'sale_cancel',
                        'quantity' => $restoredQuantity,
                        'reference_type' => Sale::class,
                        'reference_id' => $sale->id,
                        'notes' => "Stock restored from cancelled sale {$sale->invoice_number}.",
                    ]);
                }
            }

            $sale->update([
                'status' => 'cancelled',
            ]);
        });
    }
}
