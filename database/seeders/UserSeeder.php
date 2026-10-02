<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Role;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $roles = Role::pluck('id', 'name');

        User::updateOrCreate(
            ['email' => 'admin@stockflow.test'],
            [
                'name' => 'Admin',
                'password' => Hash::make('password'),
                'role_id' => $roles['Admin'],
            ]
        );

        User::updateOrCreate(
            ['email' => 'purchasing@stockflow.test'],
            [
                'name' => 'Purchasing Staff',
                'password' => Hash::make('password'),
                'role_id' => $roles['Purchasing'],
            ]
        );

        User::updateOrCreate(
            ['email' => 'warehouse@stockflow.test'],
            [
                'name' => 'Warehouse Staff',
                'password' => Hash::make('password'),
                'role_id' => $roles['Warehouse'],
            ]
        );

        User::updateOrCreate(
            ['email' => 'sales@stockflow.test'],
            [
                'name' => 'Sales Staff',
                'password' => Hash::make('password'),
                'role_id' => $roles['Sales'],
            ]
        );
    }
}
