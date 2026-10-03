<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreIngredientCategoryRequest;
use App\Http\Requests\UpdateIngredientCategoryRequest;
use App\Models\IngredientCategory;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class IngredientCategoryController extends Controller
{
    public function index(): Response
    {
        $this->authorize('viewAny', IngredientCategory::class);

        $categories = IngredientCategory::query()
            ->latest()
            ->get();

        return Inertia::render('ingredient-categories/index', [
            'categories' => $categories,
        ]);
    }

    public function create(): Response
    {
        $this->authorize('create', IngredientCategory::class);

        return Inertia::render('ingredient-categories/create');
    }

    public function store(
        StoreIngredientCategoryRequest $request
    ): RedirectResponse {
        $this->authorize('create', IngredientCategory::class);

        IngredientCategory::create($request->validated());

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Ingredient category created successfully.',
        ]);

        return to_route('ingredient-categories.index');
    }

    public function show(IngredientCategory $ingredientCategory): Response
    {
        $this->authorize('view', $ingredientCategory);

        return Inertia::render('ingredient-categories/show', [
            'category' => $ingredientCategory,
        ]);
    }

    public function edit(IngredientCategory $ingredientCategory): Response
    {
        $this->authorize('update', $ingredientCategory);

        return Inertia::render('ingredient-categories/edit', [
            'category' => $ingredientCategory,
        ]);
    }

    public function update(
        UpdateIngredientCategoryRequest $request,
        IngredientCategory $ingredientCategory
    ): RedirectResponse {
        $this->authorize('update', $ingredientCategory);

        $ingredientCategory->update($request->validated());

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Ingredient category updated successfully.',
        ]);

        return to_route('ingredient-categories.index');
    }

    public function destroy(
        IngredientCategory $ingredientCategory
    ): RedirectResponse {
        $this->authorize('delete', $ingredientCategory);

        if ($ingredientCategory->ingredients()->exists()) {
            return Inertia::flash('toast', [
                'type' => 'error',
                'message' => 'Cannot delete a category that is still being used by ingredients.',
            ])->back();
        }

        $ingredientCategory->delete();

        return Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Ingredient category deleted successfully.',
        ])->back();
    }
}
