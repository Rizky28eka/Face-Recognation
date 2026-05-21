<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Tenant;
use App\Models\Branch;
use App\Models\Shift;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // ── 1. Superadmin ─────────────────────────────────────────────────────
        User::create([
            'name'      => 'Sikawan Superadmin',
            'email'     => 'superadmin@sikawan.com',
            'password'  => Hash::make('password'),
            'role'      => 'superadmin',
            'tenant_id' => null,
        ]); // ID 1

        // ── 2. Tenant Bilcode ─────────────────────────────────────────────────
        $tenant = Tenant::create([
            'name'               => 'Bilcode Digital Solutions',
            'slug'               => 'bilcode',
            'address'            => 'Jakarta Barat',
            'registration_token' => Str::random(32),
        ]);

        $hq = Branch::create([
            'tenant_id' => $tenant->id,
            'name'      => 'HQ Jakarta',
            'latitude'  => -6.175392,
            'longitude' => 106.827153,
            'radius'    => 100,
            'is_active' => true,
        ]);

        $bandung = Branch::create([
            'tenant_id' => $tenant->id,
            'name'      => 'Bandung Hub',
            'latitude'  => -6.917464,
            'longitude' => 107.619123,
            'radius'    => 200,
            'is_active' => true,
        ]);

        $pagi = Shift::create([
            'tenant_id'  => $tenant->id,
            'name'       => 'Shift Pagi',
            'start_time' => '08:00:00',
            'end_time'   => '17:00:00',
            'color'      => '#4f46e5',
        ]);

        $siang = Shift::create([
            'tenant_id'  => $tenant->id,
            'name'       => 'Shift Siang',
            'start_time' => '10:00:00',
            'end_time'   => '19:00:00',
            'color'      => '#10b981',
        ]);

        // ── 3. Owner Bilcode (Abil) ───────────────────────────────────────────
        $ownerPhoto = $this->copyPhoto('Abil.jpeg', 2);
        User::create([
            'name'               => 'Abil',
            'email'              => 'owner@bilcode.com',
            'password'           => Hash::make('password'),
            'role'               => 'owner',
            'tenant_id'          => $tenant->id,
            'profile_photo_path' => $ownerPhoto,
        ]); // ID 2

        // ── 4. Demo Tenant Owner ──────────────────────────────────────────────
        $tenantDemo = Tenant::create([
            'name'    => 'PT Demo Sukses',
            'slug'    => 'demo-sukses',
            'address' => 'Semarang',
        ]);

        User::create([
            'name'      => 'Owner Demo',
            'email'     => 'demo@demo.com',
            'password'  => Hash::make('password'),
            'role'      => 'owner',
            'tenant_id' => $tenantDemo->id,
        ]); // ID 3

        // ── 5. Karyawan 16 orang (IDs match AI model training classes) ──────────
        $employees = [
            //  expectedId  name        email                    photoFile         branch     shift
            [  6, 'Affen',   'affen@bilcode.com',   'Affen.jpg',      $hq,      $pagi  ],
            [  7, 'Akbar',   'akbar@bilcode.com',   'Akbar.jpg',      $hq,      $pagi  ],
            [  8, 'Arung',   'arung@bilcode.com',   'Arung.jpg',      $hq,      $siang ],
            [  9, 'Dwicky',  'dwicky@bilcode.com',  'Dwicky2.jpg',    $hq,      $pagi  ],
            [ 10, 'Eka',     'eka@bilcode.com',     'Eka.jpg',        $hq,      $pagi  ],
            [ 11, 'Erfan',   'erfan@bilcode.com',   'Erfan.jpg',      $hq,      $siang ],
            [ 12, 'Farrel',  'farrel@bilcode.com',  'Farrel.jpg',     $hq,      $pagi  ],
            [ 13, 'Fatah',   'fatah@bilcode.com',   'Fatah.jpg',      $bandung, $pagi  ],
            [ 14, 'Gilbram', 'gilbram@bilcode.com', 'GIlbram2.jpeg',  $hq,      $siang ],
            [ 15, 'Hasim',   'hasim@bilcode.com',   'Hasim.jpg',      $bandung, $pagi  ],
            [ 16, 'Iqbal',   'iqbal@bilcode.com',   'Iqbal.jpg',      $hq,      $pagi  ],
            [ 17, 'Rahmat',  'rahmat@bilcode.com',  'Rahmat.jpg',     $hq,      $siang ],
            [ 18, 'Ayip',    'ayip@bilcode.com',    'Ayip.jpeg',      $hq,      $pagi  ],
            [ 19, 'Faza',    'faza@bilcode.com',    'Faza.jpeg',      $hq,      $pagi  ],
            [ 20, 'Hapid',   'hapid@bilcode.com',   'Hapid.jpeg',     $bandung, $siang ],
            [ 21, 'Willie',  'willie@bilcode.com',  'Willie.jpeg',    $hq,      $pagi  ],
        ];

        foreach ($employees as [$expectedId, $name, $email, $photoFile, $branch, $shift]) {
            // Set sequence so each user gets the exact ID matching the AI model
            DB::statement("SELECT setval('users_id_seq', " . ($expectedId - 1) . ", true)");

            $photo = $this->copyPhoto($photoFile, $expectedId);

            $user = User::create([
                'name'               => $name,
                'email'              => $email,
                'password'           => Hash::make('password'),
                'role'               => 'karyawan',
                'tenant_id'          => $tenant->id,
                'branch_id'          => $branch->id,
                'shift_id'           => $shift->id,
                'is_face_registered' => true,
                'is_wfh'             => true,
                'profile_photo_path' => $photo,
                'face_path'          => $photo,
            ]);

            if ($user->id !== $expectedId) {
                $this->command?->warn("⚠  ID mismatch for {$name}: expected {$expectedId}, got {$user->id}");
            }
        }

        $this->command?->info('✅ Seeding done — ' . count($employees) . ' karyawan created.');
    }

    private function copyPhoto(string $filename, int $userId): ?string
    {
        $src = base_path('../Data-Wajah/' . $filename);

        if (!file_exists($src)) {
            $this->command?->warn("Photo not found: {$src}");
            return null;
        }

        $ext  = strtolower(pathinfo($filename, PATHINFO_EXTENSION));
        $dest = "profile-photos/{$userId}/photo.{$ext}";

        Storage::disk('public')->makeDirectory("profile-photos/{$userId}");
        Storage::disk('public')->put($dest, file_get_contents($src));

        return $dest;
    }
}
