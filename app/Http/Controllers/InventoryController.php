<?php

namespace App\Http\Controllers;

use App\Models\Ingredient;
use Inertia\Inertia;
use Inertia\Response;

class InventoryController extends Controller
{
    public function index(): Response
    {
        $this->authorize('viewAny', Ingredient::class);
        $ingredients = Ingredient::query()
            ->with(['unit', 'category'])
            ->withSum('stockMovements', 'quantity')
            ->orderBy('name')
            ->get();

        return Inertia::render('inventory/index', [
            'ingredients' => $ingredients,
        ]);
    }
}
