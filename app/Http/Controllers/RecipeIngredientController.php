<?php

namespace App\Http\Controllers;

use App\Models\Ingredient;
use App\Models\Recipe;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RecipeIngredientController extends Controller
{
    public function store(Request $request, Recipe $recipe): RedirectResponse
    {
        $this->authorize('update', $recipe);

        $validated = $request->validate([
            'ingredient_id' => ['required', 'integer', 'exists:ingredients,id'],
            'quantity' => ['required', 'numeric', 'gt:0'],
        ]);

        if (
            $recipe->ingredients()
            ->where('ingredients.id', $validated['ingredient_id'])
            ->exists()
        ) {
            return Inertia::flash('toast', [
                'type' => 'error',
                'message' => 'This ingredient is already added to the recipe.',
            ])->back();
        }

        $ingredient = Ingredient::findOrFail($validated['ingredient_id']);

        if (! $ingredient->is_active) {
            return Inertia::flash('toast', [
                'type' => 'error',
                'message' => 'Inactive ingredients cannot be added to a recipe.',
            ])->back();
        }

        $recipe->ingredients()->attach(
            $ingredient->id,
            [
                'quantity' => $validated['quantity']
            ]
        );

        return Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Ingredient added to recipe successfully.',
        ])->back();
    }

    public function update(
        Request $request,
        Recipe $recipe,
        Ingredient $ingredient
    ): RedirectResponse {
        $this->authorize('update', $recipe);

        $validated = $request->validate([
            'quantity' => [
                'required',
                'numeric',
                'gt:0',
            ],
        ]);

        if (
            ! $recipe->ingredients()
                ->where('ingredients.id', $ingredient->id)
                ->exists()
        ) {
            abort(404);
        }

        $recipe->ingredients()->updateExistingPivot(
            $ingredient->id,
            [
                'quantity' => $validated['quantity'],
            ]
        );

        return Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Recipe ingredient updated successfully.',
        ])->back();
    }

    public function destroy(
        Recipe $recipe,
        Ingredient $ingredient
    ): RedirectResponse {
        $this->authorize('update', $recipe);

        if (
            ! $recipe->ingredients()
                ->where('ingredients.id', $ingredient->id)
                ->exists()
        ) {
            abort(404);
        }

        $recipe->ingredients()->detach($ingredient->id);

        return Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Ingredient removed from recipe successfully.',
        ])->back();
    }
}
