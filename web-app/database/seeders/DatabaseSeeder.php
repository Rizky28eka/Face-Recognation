<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Tenant;
use App\Models\Branch;
use App\Models\Shift;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Create Superadmin
        User::create([
            'name' => 'Sikawan Superadmin',
            'email' => 'superadmin@sikawan.com',
            'password' => Hash::make('password'),
            'role' => 'superadmin',
            'tenant_id' => null,
        ]);

        // 2. Create Main Tenant (Bilcode Digital Solutions)
        $tenant = Tenant::create([
            'name' => 'Bilcode Digital Solutions',
            'slug' => 'bilcode',
            'address' => 'Jakarta Barat',
            'registration_token' => Str::random(32),
        ]);

        // 3. Create Branches for Bilcode
        $hq = Branch::create([
            'tenant_id' => $tenant->id,
            'name' => 'HQ Jakarta',
            'latitude' => -6.175392,
            'longitude' => 106.827153,
            'radius' => 100,
            'is_active' => true,
        ]);

        $bandung = Branch::create([
            'tenant_id' => $tenant->id,
            'name' => 'Bandung Hub',
            'latitude' => -6.917464,
            'longitude' => 107.619123,
            'radius' => 200,
            'is_active' => true,
        ]);

        // 4. Create Shifts for Bilcode
        $pagi = Shift::create([
            'tenant_id' => $tenant->id,
            'name' => 'Shift Pagi',
            'start_time' => '08:00:00',
            'end_time' => '17:00:00',
            'color' => '#4f46e5',
        ]);

        $siang = Shift::create([
            'tenant_id' => $tenant->id,
            'name' => 'Shift Siang',
            'start_time' => '10:00:00',
            'end_time' => '19:00:00',
            'color' => '#10b981',
        ]);

        // 5. Create Owner for Bilcode
        User::create([
            'name' => 'Rizky Eka (Owner)',
            'email' => 'owner@bilcode.com',
            'password' => Hash::make('password'),
            'role' => 'owner',
            'tenant_id' => $tenant->id,
        ]);

        // 6. Create Employees for Bilcode
        User::create([
            'name' => 'Budi Karyawan',
            'email' => 'budi@bilcode.com',
            'password' => Hash::make('password'),
            'role' => 'karyawan',
            'tenant_id' => $tenant->id,
            'branch_id' => $hq->id,
            'shift_id' => $pagi->id,
        ]);

        User::create([
            'name' => 'Ani Karyawan',
            'email' => 'ani@bilcode.com',
            'password' => Hash::make('password'),
            'role' => 'karyawan',
            'tenant_id' => $tenant->id,
            'branch_id' => $bandung->id,
            'shift_id' => $siang->id,
        ]);

        // 7. Create Demo Tenant
        $tenantDemo = Tenant::create([
            'name' => 'PT Demo Sukses',
            'slug' => 'demo-sukses',
            'address' => 'Semarang',
        ]);

        User::create([
            'name' => 'Owner Demo',
            'email' => 'demo@demo.com',
            'password' => Hash::make('password'),
            'role' => 'owner',
            'tenant_id' => $tenantDemo->id,
        ]);
    }
}
