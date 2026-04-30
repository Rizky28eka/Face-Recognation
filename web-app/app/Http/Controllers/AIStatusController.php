<?php

namespace App\Http\Controllers;

use App\Services\FaceRecognitionService;
use Inertia\Inertia;

class AIStatusController extends Controller
{
    protected $faceService;

    public function __construct(FaceRecognitionService $faceService)
    {
        $this->faceService = $faceService;
    }

    /**
     * Display the AI Status dashboard.
     */
    public function index()
    {
        $aiData = $this->faceService->getStatus();
        
        // Let's get total registered faces in DB (users with is_face_registered = true)
        // Wait, the DB stores face_path, and there's a mutator or just checking if face_path is not null
        $totalRegisteredUsers = \App\Models\User::whereNotNull('face_path')->count();

        // Format data to match AIStatus interface in frontend
        $aiStatus = [
            'status' => $aiData['status'] === 'offline' ? 'offline' : ($aiData['status'] === 'training' ? 'training' : 'ready'),
            'message' => $aiData['message'] ?? 'Service AI terhubung.',
            'total_faces' => $aiData['total_images'] ?? 0,
            'trained_faces' => $aiData['total_classes'] ?? 0,
            'db_registered_faces' => $totalRegisteredUsers,
            'model_metrics' => null
        ];

        if (isset($aiData['accuracy']) && is_numeric($aiData['accuracy'])) {
            $aiStatus['model_metrics'] = [
                'accuracy' => (float)$aiData['accuracy'],
                'precision' => (float)$aiData['precision'],
                'recall' => (float)$aiData['recall'],
                'f1_score' => (float)$aiData['f1_score'],
                'last_trained' => $aiData['last_trained'] ?? null,
            ];
        }

        return Inertia::render('AI/Status', [
            'aiStatus' => $aiStatus
        ]);
    }
}
