<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class FaceRecognitionService
{
    protected $baseUrl;

    public function __construct()
    {
        $this->baseUrl = env('AI_SERVICE_URL', 'http://127.0.0.1:8088/api/v1');
    }

    /**
     * Prediksi identitas wajah dari path file lokal.
     */
    public function predictFromPath($filePath)
    {
        try {
            $response = Http::attach(
                'file', 
                file_get_contents($filePath), 
                basename($filePath)
            )->post("{$this->baseUrl}/predict");

            return $response->json();
        } catch (\Exception $e) {
            Log::error("AI Service Error (Predict): " . $e->getMessage());
            return ['status' => 'error', 'message' => 'Connection to AI Service failed.'];
        }
    }

    /**
     * Register wajah baru ke AI Service.
     */
    public function registerFace($name, $filePath)
    {
        try {
            $response = Http::attach(
                'file', 
                file_get_contents($filePath), 
                basename($filePath)
            )->post("{$this->baseUrl}/add-face", [
                'name' => $name
            ]);

            return $response->json();
        } catch (\Exception $e) {
            Log::error("AI Service Error (Register): " . $e->getMessage());
            return ['status' => 'error', 'message' => 'Connection to AI Service failed.'];
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
}
