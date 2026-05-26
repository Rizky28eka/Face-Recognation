<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class FaceRecognitionService
{
    protected $baseUrl;

    public function __construct()
    {
        // Ambil URL dari database jika ada, jika tidak gunakan env
        $this->baseUrl = \App\Models\Setting::get('ai_service_url', env('AI_SERVICE_URL', 'http://127.0.0.1:8088/api/v1'));
    }

    /**
     * Prediksi identitas wajah dari path file lokal.
     */
    public function predictFromPath($filePath, array $branchUserIds = [])
    {
        try {
            $request = Http::attach('file', file_get_contents($filePath), basename($filePath));

            $payload = [];
            if (!empty($branchUserIds)) {
                $payload['branch_user_ids'] = json_encode($branchUserIds);
            }

            $response = $request->post("{$this->baseUrl}/predict", $payload);

            return $response->json();
        } catch (\Exception $e) {
            Log::error("AI Service Error (Predict): " . $e->getMessage());
            return ['status' => 'error', 'message' => 'Connection to AI Service failed.'];
        }
    }

    /**
     * Register wajah baru ke AI Service.
     * 
     * Mengembalikan response mentah dari AI Service (termasuk error 409 duplikasi wajah).
     * Caller bertanggung jawab menginterpretasi status HTTP.
     */
    public function registerFace($name, $filePath, $index = 0, array $branchUserIds = [])
    {
        try {
            $payload = ['name' => $name, 'index' => (int) $index];
            if (!empty($branchUserIds)) {
                $payload['branch_user_ids'] = json_encode($branchUserIds);
            }

            $response = Http::attach(
                'file',
                file_get_contents($filePath),
                basename($filePath)
            )->post("{$this->baseUrl}/add-face", $payload);

            // Teruskan respons mentah (termasuk error 409, 422, dll dari AI Service)
            $body = $response->json();
            
            // Jika AI Service mengembalikan error (4xx/5xx), teruskan pesan error-nya
            if ($response->failed()) {
                $detail = $body['detail'] ?? $body['message'] ?? 'AI Service menolak permintaan.';
                return [
                    'status'      => 'error',
                    'http_status' => $response->status(),
                    'message'     => $detail,
                ];
            }

            return $body;
        } catch (\Exception $e) {
            Log::error("AI Service Error (Register): " . $e->getMessage());
            return ['status' => 'error', 'http_status' => 503, 'message' => 'Koneksi ke AI Service gagal.'];
        }
    }

    /**
     * Jalankan training model di Python.
     */
    public function train()
    {
        try {
            $response = Http::post("{$this->baseUrl}/train");
            return $response->json();
        } catch (\Exception $e) {
            Log::error("AI Service Error (Train): " . $e->getMessage());
            return ['status' => 'error', 'message' => 'Connection to AI Service failed.'];
        }
    }

    /**
     * Dapatkan status dan metrik AI Service.
     */
    public function getStatus()
    {
        try {
            $response = Http::timeout(3)->get("{$this->baseUrl}/faces/status");
            if ($response->successful()) {
                return $response->json();
            }
            throw new \Exception("HTTP Error: " . $response->status());
        } catch (\Exception $e) {
            Log::error("AI Service Error (Status): " . $e->getMessage());
            return [
                'status' => 'offline',
                'message' => 'AI Service is unreachable.',
                'total_images' => 0,
                'total_classes' => 0,
                'accuracy' => 'N/A',
                'precision' => 'N/A',
                'recall' => 'N/A',
                'f1_score' => 'N/A'
            ];
        }
    }

    /**
     * Hapus data wajah user dari dataset AI dan retrain model.
     */
    public function removeFace(string $faceLabel): array
    {
        try {
            $response = Http::delete("{$this->baseUrl}/remove-face/{$faceLabel}");
            return $response->json() ?? [];
        } catch (\Exception $e) {
            Log::error("AI Service Error (RemoveFace): " . $e->getMessage());
            return ['status' => 'error', 'message' => 'Koneksi ke AI Service gagal.'];
        }
    }

    /**
     * Update AI Service Hyperparameters.
     */
    public function updateSettings($data)
    {
        try {
            $response = Http::asForm()->post("{$this->baseUrl}/settings", $data);
            return $response->json();
        } catch (\Exception $e) {
            Log::error("AI Service Error (Settings): " . $e->getMessage());
            return ['status' => 'error', 'message' => 'Connection to AI Service failed.'];
        }
    }
}
