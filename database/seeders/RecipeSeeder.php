<?php

namespace Database\Seeders;

use App\Models\Recipe;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class RecipeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $recipes = [
            [
                'name' => 'Chicken Rice Bowl',
                'selling_price' => 25000,
                'is_active' => true,
                'description' => 'Rice bowl with seasoned chicken and vegetables.',
            ],
            [
                'name' => 'Beef Rice Bowl',
                'selling_price' => 35000,
                'is_active' => true,
                'description' => 'Rice bowl with seasoned beef and vegetables.',
            ],
            [
                'name' => 'Fried Rice',
                'selling_price' => 22000,
                'is_active' => true,
                'description' => 'Fried rice with egg, vegetables, and seasoning.',
            ],
            [
                'name' => 'Chicken Fried Rice',
                'selling_price' => 28000,
                'is_active' => true,
                'description' => 'Fried rice with chicken, egg, vegetables, and seasoning.',
            ],
        ];

        foreach ($recipes as $recipe) {
            Recipe::updateOrCreate(
                ['name' => $recipe['name']],
                [
                    'selling_price' => $recipe['selling_price'],
                    'is_active' => $recipe['is_active'],
                    'description' => $recipe['description'],
                ]
            );
        }
    }
}
