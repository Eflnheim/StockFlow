<?php

namespace App\Http\Controllers;

use App\Models\PurchaseItem;
use App\Models\PurchaseOrder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PurchaseItemController extends Controller
{
    public function store(
        Request $request,
        PurchaseOrder $purchaseOrder
    ): RedirectResponse {
        $this->authorize('update', $purchaseOrder);

        if ($purchaseOrder->status !== 'pending') {
            return Inertia::flash('toast', [
                'type' => 'error',
                'message' => 'Only pending purchase orders can be modified.',
            ])->back();
        }

        $validated = $request->validate([
            'ingredient_id' => ['required', 'integer', 'exists:ingredients,id'],
            'quantity' => ['required', 'numeric', 'gt:0'],
            'unit_price' => ['required', 'numeric', 'min:0'],
        ]);

        PurchaseItem::create([
            'purchase_order_id' => $purchaseOrder->id,
            'ingredient_id' => $validated['ingredient_id'],
            'quantity' => $validated['quantity'],
            'unit_price' => $validated['unit_price'],
        ]);

        return Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Purchase item added successfully.',
        ])->back();
    }

    public function destroy(
        PurchaseOrder $purchaseOrder,
        PurchaseItem $purchaseItem
    ): RedirectResponse {
        $this->authorize('update', $purchaseOrder);

        if ($purchaseOrder->status !== 'pending') {
            return Inertia::flash('toast', [
                'type' => 'error',
                'message' => 'Only pending purchase orders can be modified.',
            ])->back();
        }

        if ($purchaseItem->purchase_order_id !== $purchaseOrder->id) {
            abort(404);
        }

        $purchaseItem->delete();

        return Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Purchase item removed successfully.',
        ])->back();
    }

    public function update(
        Request $request,
        PurchaseOrder $purchaseOrder,
        PurchaseItem $purchaseItem
    ): RedirectResponse {
        $this->authorize('update', $purchaseOrder);

        if ($purchaseOrder->status !== 'pending') {
            return Inertia::flash('toast', [
                'type' => 'error',
                'message' => 'Only pending purchase orders can be modified.',
            ])->back();
        }

        if ($purchaseItem->purchase_order_id !== $purchaseOrder->id) {
            abort(404);
        }

        $validated = $request->validate([
            'ingredient_id' => ['required', 'integer', 'exists:ingredients,id'],
            'quantity' => ['required', 'numeric', 'gt:0'],
            'unit_price' => ['required', 'numeric', 'min:0'],
        ]);

        $purchaseItem->update([
            'ingredient_id' => $validated['ingredient_id'],
            'quantity' => $validated['quantity'],
            'unit_price' => $validated['unit_price'],
        ]);

        return Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Purchase item updated successfully.',
        ])->back();
    }
}
