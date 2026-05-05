<?php

namespace App\Http\Controllers;

use App\Services\FaceRecognitionService;
use App\Models\AuditLog;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

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
        $metrics = $aiData['metrics'] ?? $aiData; // Fallback to old format if 'metrics' key not found
        $statusLabel = $metrics['status'] ?? 'Not Trained';
        
        // Fetch Registration Data (Users who have or haven't registered faces)
        $registrations = \App\Models\User::where('role', 'karyawan')
            ->select('name', 'is_face_registered', 'face_path', 'updated_at')
            ->orderBy('updated_at', 'desc')
            ->get()
            ->map(function($user) {
                return [
                    'name' => $user->name,
                    'status' => $user->is_face_registered ? 'Registered' : 'Pending',
                    'updated_at' => $user->updated_at->toDateTimeString(),
                    'has_image' => !empty($user->face_path)
                ];
            });

        // Fetch Recent Attendance/Login Data
        $attendances = \App\Models\Attendance::with('user')
            ->orderBy('attended_at', 'desc')
            ->take(10)
            ->get()
            ->map(function($att) {
                return [
                    'name' => $att->user->name ?? 'Unknown',
                    'type' => $att->type,
                    'confidence' => $att->confidence,
                    'time' => $att->attended_at,
                    'status' => $att->confidence > 0.7 ? 'Success' : 'Low Confidence',
                    'bbox' => $att->bbox,
                    'image_url' => $att->image_path ? asset('storage/' . $att->image_path) : null,
                    'accuracy' => $att->accuracy,
                    'f1_score' => $att->f1_score,
                    'precision' => $att->precision,
                    'recall' => $att->recall,
                ];
            });

        $aiStatus = [
            'status' => strtolower($statusLabel) === 'offline' ? 'offline' : (strtolower($statusLabel) === 'training' ? 'training' : 'ready'),
            'message' => $aiData['message'] ?? 'Service AI terhubung.',
            'total_faces' => $metrics['total_images'] ?? 0,
            'trained_faces' => $metrics['total_classes'] ?? 0,
            'db_registered_faces' => $totalRegisteredUsers,
            'model_metrics' => null,
            'hyperparameters' => $aiData['hyperparameters'] ?? null,
            'system_resources' => $aiData['system'] ?? null,
            'dataset' => $aiData['dataset'] ?? [],
            'inference_logs' => $aiData['inference_logs'] ?? [],
            'testing_reports' => $aiData['testing_reports'] ?? null,
            'registrations' => $registrations,
            'attendances' => $attendances
        ];

        if (isset($metrics['accuracy']) && is_numeric($metrics['accuracy'])) {
            $aiStatus['model_metrics'] = [
                'accuracy' => (float)$metrics['accuracy'],
                'precision' => (float)$metrics['precision'],
                'recall' => (float)$metrics['recall'],
                'f1_score' => (float)$metrics['f1_score'],
                'last_trained' => $metrics['last_trained'] ?? null,
            ];
        }

        return Inertia::render('AI/Status', [
            'aiStatus' => $aiStatus
        ]);
    }

    /**
     * Update AI Hyperparameters.
     */
    public function updateSettings(\Illuminate\Http\Request $request)
    {
        $validated = $request->validate([
            'recognition_threshold' => 'nullable|numeric|min:0.1|max:1.0',
            'n_neighbors' => 'nullable|integer|min:1|max:15',
        ]);

        $response = $this->faceService->updateSettings($validated);

        if (isset($response['status']) && $response['status'] === 'success') {
            // Log audit
            AuditLog::create([
                'user_id' => Auth::id(),
                'action' => 'UPDATE_AI_SETTINGS',
                'description' => 'Superadmin mengubah parameter AI: Threshold=' . ($validated['recognition_threshold'] ?? '-') . ', Neighbors=' . ($validated['n_neighbors'] ?? '-'),
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent(),
            ]);

            return redirect()->back()->with('success', $response['message']);
        }

        return redirect()->back()->with('error', $response['message'] ?? 'Gagal menyimpan konfigurasi AI.');
    }
}
