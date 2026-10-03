<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreIngredientRequest;
use App\Http\Requests\UpdateIngredientRequest;
use App\Models\Ingredient;
use App\Models\IngredientCategory;
use App\Models\Unit;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class IngredientController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        $this->authorize('viewAny', Ingredient::class);

        $ingredients = Ingredient::query()
            ->with(['category', 'unit'])
            ->latest()
            ->get();

        return Inertia::render('ingredients/index', [
            'ingredients' => $ingredients,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        $this->authorize('create', Ingredient::class);

        $categories = IngredientCategory::query()
            ->orderBy('name')
            ->get(['id', 'name']);
        
        $units = Unit::query()
            ->orderBy('name')
            ->get(['id', 'name', 'symbol']);    

        return Inertia::render('ingredients/create', [
            'categories' => $categories,
            'units' => $units,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreIngredientRequest $request): RedirectResponse
    {
        $this->authorize('create', Ingredient::class);

        Ingredient::create($request->validated());

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Ingredient created successfully.',
        ]);

        return to_route('ingredients.index');
    }

    /**
     * Display the specified resource.
     */
    public function show(Ingredient $ingredient): Response
    {
        $this->authorize('view', $ingredient);

        $ingredient->load(['category', 'unit']);

        return Inertia::render('ingredients/show', [
            'ingredient' => $ingredient
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Ingredient $ingredient): Response
    {
        $this->authorize('update', $ingredient);

        $categories = IngredientCategory::query()
            ->orderBy('name')
            ->get(['id', 'name']);

        $units = Unit::query()
            ->orderBy('name')
            ->get(['id', 'name', 'symbol']);

        return Inertia::render('ingredients/edit', [
            'ingredient' => $ingredient,
            'categories' => $categories,
            'units' => $units,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateIngredientRequest $request, Ingredient $ingredient): RedirectResponse
    {
        $this->authorize('update', $ingredient);

        $ingredient->update($request->validated());

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Ingredient updated successfully.',
        ]);

        return to_route('ingredients.index');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Ingredient $ingredient): RedirectResponse
    {
        $this->authorize('delete', $ingredient);

        if ($ingredient->stockMovements()->exists()) {
            return Inertia::flash('toast', [
                'type' => 'error',
                'message' => 'Cannot delete an ingredient that has stock movements.',
            ])->back();
        }

        if ($ingredient->recipes()->exists()) {
            return Inertia::flash('toast', [
                'type' => 'error',
                'message' => 'Cannot delete an ingredient that is used in a recipe.',
            ])->back();
        }

        if ($ingredient->purchaseItems()->exists()) {
            return Inertia::flash('toast', [
                'type' => 'error',
                'message' => 'Cannot delete an ingredient that is used in a purchase order.',
            ])->back();
        }

        $ingredient->delete();

        return Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Ingredient deleted successfully.',
        ])->back();
    }
}
