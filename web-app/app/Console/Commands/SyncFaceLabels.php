<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;

#[Signature('face:sync-labels')]
#[Description('Sinkronisasi nama folder dataset wajah dengan ID user saat ini di database.')]
class SyncFaceLabels extends Command
{
    public function handle(): void
    {
        $aiDatasetPath = base_path('../ai-service/dataset');
        $subfolders    = ['raw', 'processed', 'train', 'val', 'test'];

        $users = User::where('role', 'karyawan')->orWhere('role', 'owner')->get()
            ->keyBy(fn($u) => strtolower(str_replace(' ', '_', $u->name)));

        $renamed = 0;
        $skipped = 0;

        foreach ($subfolders as $sub) {
            $dir = "{$aiDatasetPath}/{$sub}";
            if (!is_dir($dir)) continue;

            foreach (scandir($dir) as $folder) {
                if ($folder === '.' || $folder === '..' || $folder === 'unknown') continue;
                if (!is_dir("{$dir}/{$folder}")) continue;

                // Format folder: {id}_{name}
                $parts    = explode('_', $folder, 2);
                if (count($parts) < 2) continue;
                [$oldId, $namePart] = $parts;

                $user = $users->get($namePart);
                if (!$user) {
                    $this->warn("  [{$sub}] '{$folder}' — user '{$namePart}' tidak ditemukan di DB, dilewati.");
                    $skipped++;
                    continue;
                }

                $newFolder = "{$user->id}_{$namePart}";
                if ($newFolder === $folder) continue;

                $oldPath = "{$dir}/{$folder}";
                $newPath = "{$dir}/{$newFolder}";

                if (is_dir($newPath)) {
                    // Gabungkan isi folder lama ke folder baru
                    foreach (glob("{$oldPath}/*") as $file) {
                        $dest = "{$newPath}/" . basename($file);
                        if (!file_exists($dest)) rename($file, $dest);
                    }
                    rmdir($oldPath);
                } else {
                    rename($oldPath, $newPath);
                }

                $this->info("  [{$sub}] '{$folder}' → '{$newFolder}'");
                $renamed++;
            }
        }

        if ($renamed === 0 && $skipped === 0) {
            $this->info('Semua folder sudah sinkron.');
            return;
        }

        $this->info("Selesai: {$renamed} folder direname, {$skipped} dilewati.");

        if ($renamed > 0) {
            $this->info('Menjalankan retrain model...');
            $result = app(\App\Services\FaceRecognitionService::class)->train();
            $status = $result['status'] ?? 'unknown';
            $this->info("Retrain: {$status}");
        }
    }
}
