<?php

namespace Database\Seeders;

use App\Models\Branch;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class BilcodeSeeder extends Seeder
{
    public function run(): void
    {
        // Branch utama Bilcode
        $branch = Branch::create([
            'name'           => 'Kaktus Coffee Place',
            'latitude'       => -7.756200514424161,
            'longitude'      => 110.39331541057437,
            'radius'         => 100,
            'check_in_time'  => '08:00',
            'check_out_time' => '17:00',
            'is_active'      => true,
        ]);

        // Shift kerja
        $shiftPagi = \App\Models\Shift::create([
            'name'       => 'Shift Pagi',
            'start_time' => '08:00',
            'end_time'   => '17:00',
            'color'      => '#4f46e5',
            'work_type'  => 'wfo',
        ]);

        // Owner Bilcode
        $owner = User::create([
            'name'               => 'Owner Bilcode',
            'email'              => 'owner@bilcode.id',
            'password'           => Hash::make('password'),
            'role'               => 'owner',
            'branch_id'          => $branch->id,
            'shift_id'           => $shiftPagi->id,
            'is_face_registered' => false,
        ]);

        // Karyawan Bilcode
        $karyawanData = [
            ['name' => 'Eka',   'email' => 'eka@bilcode.id'],
            ['name' => 'Gb',    'email' => 'gb@bilcode.id'],
            ['name' => 'Akbar', 'email' => 'akbar@bilcode.id'],
            ['name' => 'Iqbal', 'email' => 'iqbal@bilcode.id'],
            ['name' => 'Arung', 'email' => 'arung@bilcode.id'],
        ];

        foreach ($karyawanData as $data) {
            User::create([
                'name'               => $data['name'],
                'email'              => $data['email'],
                'password'           => Hash::make('password'),
                'role'               => 'karyawan',
                'branch_id'          => $branch->id,
                'shift_id'           => $shiftPagi->id,
                'is_face_registered' => false,
            ]);
        }

        $this->command?->info('✅ Bilcode: branch, 1 shift, 1 owner, 5 karyawan dibuat.');
        $this->command?->info('   Owner   : owner@bilcode.id / password');
        $this->command?->info('   Karyawan: eka@bilcode.id, gb@bilcode.id, akbar@bilcode.id, iqbal@bilcode.id, arung@bilcode.id / password');
    }
}
