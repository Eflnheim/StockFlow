<?php

namespace App\Http\Controllers;

use App\Models\StockMovement; 
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class StockMovementController extends Controller
{
    public function index(Request $request): Response
    {
        $this->authorize('viewAny', StockMovement::class);

        $stockMovements = StockMovement::query()
            ->with(['ingredient.unit', 'user'])
            ->latest()
            ->get();

        return Inertia::render('inventory/movements', [
            'stockMovements' => $stockMovements,
        ]);
    }
}
