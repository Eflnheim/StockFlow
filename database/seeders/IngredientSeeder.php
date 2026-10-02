<?php

namespace Database\Seeders;

use App\Models\Ingredient;
use App\Models\IngredientCategory;
use App\Models\Unit;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class IngredientSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = IngredientCategory::pluck('id', 'name');
        $units = Unit::pluck('id', 'name');

        $ingredients = [
            [
                'category' => 'Dry Goods',
                'unit' => 'Kilogram',
                'name' => 'Rice',
                'minimum_stock' => 10,
            ],
            [
                'category' => 'Meat',
                'unit' => 'Kilogram',
                'name' => 'Chicken',
                'minimum_stock' => 5,
            ],
            [
                'category' => 'Meat',
                'unit' => 'Kilogram',
                'name' => 'Beef',
                'minimum_stock' => 5,
            ],
            [
                'category' => 'Vegetables',
                'unit' => 'Kilogram',
                'name' => 'Onion',
                'minimum_stock' => 3,
            ],
            [
                'category' => 'Vegetables',
                'unit' => 'Kilogram',
                'name' => 'Carrot',
                'minimum_stock' => 3,
            ],
            [
                'category' => 'Eggs',
                'unit' => 'Piece',
                'name' => 'Egg',
                'minimum_stock' => 30,
            ],
            [
                'category' => 'Dry Goods',
                'unit' => 'Liter',
                'name' => 'Cooking Oil',
                'minimum_stock' => 5,
            ],
            [
                'category' => 'Seasoning',
                'unit' => 'Kilogram',
                'name' => 'Salt',
                'minimum_stock' => 2,
            ],
        ];

        foreach ($ingredients as $ingredient) {
            Ingredient::updateOrCreate(
                ['name' => $ingredient['name']],
                [
                    'ingredient_category_id' => $categories[$ingredient['category']],
                    'unit_id' => $units[$ingredient['unit']],
                    'minimum_stock' => $ingredient['minimum_stock'],
                    'is_active' => true,
                ]
            );
        }
    }
}
