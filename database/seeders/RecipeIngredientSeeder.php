<?php

namespace Database\Seeders;

use App\Models\Ingredient;
use App\Models\Recipe;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class RecipeIngredientSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $ingredients = Ingredient::pluck('id', 'name');

        $recipes = Recipe::pluck('id', 'name');

        $recipeIngredients = [
            'Chicken Rice Bowl' => [
                'Rice' => 0.2,
                'Chicken' => 0.15,
                'Onion' => 0.03,
                'Carrot' => 0.03,
                'Cooking Oil' => 0.02,
                'Salt' => 0.005,
            ],

            'Beef Rice Bowl' => [
                'Rice' => 0.2,
                'Beef' => 0.15,
                'Onion' => 0.03,
                'Carrot' => 0.03,
                'Cooking Oil' => 0.02,
                'Salt' => 0.005,
            ],

            'Fried Rice' => [
                'Rice' => 0.2,
                'Egg' => 1,
                'Onion' => 0.03,
                'Carrot' => 0.03,
                'Cooking Oil' => 0.02,
                'Salt' => 0.005,
            ],

            'Chicken Fried Rice' => [
                'Rice' => 0.2,
                'Chicken' => 0.1,
                'Egg' => 1,
                'Onion' => 0.03,
                'Carrot' => 0.03,
                'Cooking Oil' => 0.02,
                'Salt' => 0.005,
            ],
        ];

        foreach ($recipeIngredients as $recipeName => $items) {
            $recipe = Recipe::findOrFail($recipes[$recipeName]);

            $syncData = [];

            foreach ($items as $ingredientName => $quantity) {
                $syncData[$ingredients[$ingredientName]] = [
                    'quantity' => $quantity,
                ];
            }

            $recipe->ingredients()->sync($syncData);
        }
    }
}
