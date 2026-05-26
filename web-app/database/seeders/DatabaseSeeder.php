<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        User::create([
            'name'               => 'Sikawan Superadmin',
            'email'              => 'superadmin@sikawan.com',
            'password'           => Hash::make('password'),
            'role'               => 'superadmin',
            'is_face_registered' => true,
        ]);

        $this->command?->info('✅ Superadmin: superadmin@sikawan.com / password');

        $this->call(BilcodeSeeder::class);
    }
}
