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
        User::updateOrCreate(
            ['email' => 'superadmin@sikawan.com'],
            [
                'name' => 'Sikawan Superadmin',
                'password' => Hash::make('password'),
                'role' => 'superadmin',
                'tenant_id' => null,
            ]
        );

        // 2. Create Main Tenant (Bilcode Digital Solutions)
        $tenant = Tenant::updateOrCreate(
            ['slug' => 'bilcode'],
            [
                'name' => 'Bilcode Digital Solutions',
                'address' => 'Jakarta Barat',
                'registration_token' => Str::random(32),
            ]
        );

        // 3. Create Branches for Bilcode
        $hq = Branch::updateOrCreate(
            ['tenant_id' => $tenant->id, 'name' => 'HQ Jakarta'],
            [
                'latitude' => -6.175392,
                'longitude' => 106.827153,
                'radius' => 100,
                'is_active' => true,
            ]
        );

        $bandung = Branch::updateOrCreate(
            ['tenant_id' => $tenant->id, 'name' => 'Bandung Hub'],
            [
                'latitude' => -6.917464,
                'longitude' => 107.619123,
                'radius' => 200,
                'is_active' => true,
            ]
        );

        // 4. Create Shifts for Bilcode
        $pagi = Shift::updateOrCreate(
            ['tenant_id' => $tenant->id, 'name' => 'Shift Pagi'],
            [
                'start_time' => '08:00:00',
                'end_time' => '17:00:00',
                'color' => '#4f46e5',
            ]
        );

        $siang = Shift::updateOrCreate(
            ['tenant_id' => $tenant->id, 'name' => 'Shift Siang'],
            [
                'start_time' => '10:00:00',
                'end_time' => '19:00:00',
                'color' => '#10b981',
            ]
        );

        // 5. Create Owner for Bilcode
        User::updateOrCreate(
            ['email' => 'owner@bilcode.com'],
            [
                'name' => 'Rizky Eka (Owner)',
                'password' => Hash::make('password'),
                'role' => 'owner',
                'tenant_id' => $tenant->id,
            ]
        );

        // 6. Create Employees for Bilcode
        User::updateOrCreate(
            ['email' => 'budi@bilcode.com'],
            [
                'name' => 'Budi Karyawan',
                'password' => Hash::make('password'),
                'role' => 'karyawan',
                'tenant_id' => $tenant->id,
                'branch_id' => $hq->id,
                'shift_id' => $pagi->id,
            ]
        );

        User::updateOrCreate(
            ['email' => 'ani@bilcode.com'],
            [
                'name' => 'Ani Karyawan',
                'password' => Hash::make('password'),
                'role' => 'karyawan',
                'tenant_id' => $tenant->id,
                'branch_id' => $bandung->id,
                'shift_id' => $siang->id,
            ]
        );

        // 7. Create Demo Tenant
        $tenantDemo = Tenant::updateOrCreate(
            ['slug' => 'demo-sukses'],
            [
                'name' => 'PT Demo Sukses',
                'address' => 'Semarang',
            ]
        );

        User::updateOrCreate(
            ['email' => 'demo@demo.com'],
            [
                'name' => 'Owner Demo',
                'password' => Hash::make('password'),
                'role' => 'owner',
                'tenant_id' => $tenantDemo->id,
            ]
        );
    }
}
