<?php

namespace Database\Seeders;

use App\Models\Unit;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UnitSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $units = [
            [
                'name' => 'Kilogram',
                'symbol' => 'kg',
            ],
            [
                'name' => 'Liter',
                'symbol' => 'L',
            ],
            [
                'name' => 'Piece',
                'symbol' => 'pcs',
            ],
        ];

        foreach ($units as $unit) {
            Unit::firstOrCreate(
                ['name' => $unit['name']],
                ['symbol' => $unit['symbol']]
            );
        }
    }
}
