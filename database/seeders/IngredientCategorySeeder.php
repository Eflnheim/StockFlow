<?php

namespace Database\Seeders;

use App\Models\IngredientCategory;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class IngredientCategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            'Meat',
            'Vegetables',
            'Dry Goods',
            'Eggs',
            'Beverages',
            'Seasoning',
        ];

        foreach ($categories as $category) {
            IngredientCategory::firstOrCreate([
                'name' => $category,
            ]);
        }
    }
}
