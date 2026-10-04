<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreRecipeRequest;
use App\Http\Requests\UpdateRecipeRequest;
use App\Models\Recipe;
use App\Models\Ingredient;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class RecipeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        $this->authorize('viewAny', Recipe::class);

        $recipes = Recipe::query()
            ->latest()
            ->get();

        return Inertia::render('recipes/index', [
            'recipes' => $recipes,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        $this->authorize('create', Recipe::class);

        return Inertia::render('recipes/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreRecipeRequest $request): RedirectResponse
    {
        $this->authorize('create', Recipe::class);

        $recipe = Recipe::create($request->validated());

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Recipe created successfully.',
        ]);

        return to_route('recipes.show', $recipe);
    }

    /**
     * Display the specified resource.
     */
    public function show(Recipe $recipe): Response
    {
        $this->authorize('view', $recipe);

        $recipe->load(['ingredients.unit',]);

        $ingredients = Ingredient::query()
            ->where('is_active', true)
            ->with('unit')
            ->orderBy('name')
            ->get([
                'id',
                'name',
                'unit_id',
            ]);

        return Inertia::render('recipes/show', [
            'recipe' => $recipe,
            'ingredients' => $ingredients,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Recipe $recipe): Response
    {
        $this->authorize('update', $recipe);

        return Inertia::render('recipes/edit', [
            'recipe' => $recipe,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateRecipeRequest $request, Recipe $recipe): RedirectResponse
    {
        $this->authorize('update', $recipe);

        $recipe->update($request->validated());

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Recipe updated successfully.',
        ]);

        return to_route('recipes.show', $recipe);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Recipe $recipe): RedirectResponse
    {
        $this->authorize('delete', $recipe);

        if ($recipe->saleItems()->exists()) {
            return Inertia::flash('toast', [
                'type' => 'error',
                'message' => 'This recipe cannot be deleted because it has been used in sales.',
            ])->back();
        }

        $recipe->delete();

        return Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Recipe deleted successfully.',
        ])->back();
    }
}
