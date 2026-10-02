<?php

namespace Database\Seeders;

use App\Models\Supplier;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SupplierSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $suppliers = [
            [
                'name' => 'Fresh Food Supplier',
                'contact_person' => 'Andi',
                'phone' => '081234567890',
                'email' => 'freshfood@example.com',
                'address' => 'Jl. Raya Industri No. 10',
                'is_active' => true,
            ],
            [
                'name' => 'Makmur Jaya Supplier',
                'contact_person' => 'Budi',
                'phone' => '082345678901',
                'email' => 'makmurjaya@example.com',
                'address' => 'Jl. Pasar Baru No. 25',
                'is_active' => true,
            ],
            [
                'name' => 'Sumber Pangan',
                'contact_person' => 'Citra',
                'phone' => '083456789012',
                'email' => 'sumberpangan@example.com',
                'address' => 'Jl. Pangan Utama No. 5',
                'is_active' => true,
            ],
        ];

        foreach ($suppliers as $supplier) {
            Supplier::updateOrCreate(
                ['name' => $supplier['name']],
                [
                    'contact_person' => $supplier['contact_person'],
                    'phone' => $supplier['phone'],
                    'email' => $supplier['email'],
                    'address' => $supplier['address'],
                    'is_active' => $supplier['is_active'],
                ]
            );
        }
    }
}
