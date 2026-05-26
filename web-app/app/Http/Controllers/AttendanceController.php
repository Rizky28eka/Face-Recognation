<?php

namespace App\Http\Controllers;

use App\Models\Attendance;
use App\Models\FailedAttendance;
use App\Models\User;
use App\Models\Branch;
use App\Models\Leave;
use App\Services\FaceRecognitionService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class AttendanceController extends Controller
{
    protected $faceService;

    public function __construct(FaceRecognitionService $faceService)
    {
        $this->faceService = $faceService;
    }

    /**
     * Halaman Dashboard Absensi (React).
     */
    public function index()
    {
        /** @var \App\Models\User $currentUser */
        $currentUser = Auth::user();

        $recentAttendances = Attendance::with(['user', 'branch'])
            ->when($currentUser->role === 'karyawan', fn($q) => $q->where('user_id', $currentUser->id))
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get();

        return Inertia::render('Attendance/Index', [
            'recentAttendances' => $recentAttendances,
            'userRole'          => Auth::user()->role,
        ]);
    }

    /**
     * Proses Check-in menggunakan scan wajah.
     */
    public function checkIn(Request $request)
    {
        $request->validate([
            'image' => 'required|string',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
        ]);

        /** @var \App\Models\User $user */
        $user = Auth::user();

        if ($user->role !== 'karyawan') {
            return response()->json([
                'success' => false,
                'message' => 'Fitur presensi hanya tersedia untuk karyawan.',
            ], 403);
        }
        
        // 1. Validasi Status Sistem & Geofencing Cabang
        $branch = null;
        if ($user->branch_id) {
            $branch = Branch::find($user->branch_id);
        }

        $isWfh = $user->is_wfh || ($user->shift && in_array($user->shift->work_type, ['wfh', 'hybrid']));

        // Jika user belum punya cabang spesifik dan bukan WFH, cari cabang mana saja yang masuk radius
        if (!$branch && !$isWfh) {
            $branches = Branch::where('is_active', true)->get();
            
            if ($request->latitude && $request->longitude) {
                foreach ($branches as $b) {
                    $distance = $this->calculateDistance($request->latitude, $request->longitude, $b->latitude, $b->longitude);
                    if ($distance <= $b->radius) {
                        $branch = $b;
                        break;
                    }
                }
            }
        }

        if (!$branch && !$isWfh && Branch::where('is_active', true)->exists()) {
            $noCoords = !$request->latitude || !$request->longitude;
            return response()->json([
                'success' => false,
                'message' => $noCoords
                    ? "Lokasi tidak terdeteksi. Aktifkan GPS dan izinkan akses lokasi di browser, lalu coba lagi."
                    : "Anda berada di luar radius cabang kantor terdaftar."
            ], 403);
        }

        // 2. Validasi Cuti/Izin
        $today = Carbon::today()->toDateString();
        $hasLeave = Leave::where('user_id', $user->id)
            ->where('status', 'approved')
            ->where('start_date', '<=', $today)
            ->where('end_date', '>=', $today)
            ->first();

        if ($hasLeave) {
            return response()->json([
                'success' => false,
                'message' => "Anda sedang dalam masa " . $hasLeave->type . ". Tidak perlu melakukan absensi."
            ], 403);
        }

        // 3. Validasi Geofencing (Double check if branch was found)
        if ($branch && !$isWfh) {
             if (!$request->latitude || !$request->longitude) {
                return response()->json([
                    'success' => false,
                    'message' => "Gagal mendapatkan lokasi. GPS wajib aktif untuk WFO."
                ], 400);
            }

            $distance = $this->calculateDistance(
                $request->latitude,
                $request->longitude,
                $branch->latitude,
                $branch->longitude
            );

            if ($distance > $branch->radius) {
                return response()->json([
                    'success' => false,
                    'message' => "Anda berada di luar radius " . $branch->name . " (" . round($distance) . "m dari pusat)."
                ], 403);
            }
        }

        // 3. Validasi Jam Kerja (Opsional, bisa ditambahkan jika ingin strict)
        // Saat ini kita izinkan absen kapan saja tapi catat tipenya

        // 4. Proses AI Scan
        $imageData = $request->input('image');
        // Support various base64 formats (jpeg, png, etc)
        $image = preg_replace('#^data:image/\w+;base64,#i', '', $imageData);
        $image = str_replace(' ', '+', $image);
        $imageName = 'scan_' . time() . '.jpg';
        
        $tempPath = storage_path('app/temp/' . $imageName);
        if (!file_exists(storage_path('app/temp'))) {
            mkdir(storage_path('app/temp'), 0755, true);
        }
        file_put_contents($tempPath, base64_decode($image));

        // Kirim daftar user ID dari branch yang sama agar prediksi hanya dibandingkan sesama karyawan satu perusahaan
        $branchUserIds = [];
        if ($user->branch_id) {
            $branchUserIds = \App\Models\User::where('branch_id', $user->branch_id)
                ->where('role', 'karyawan')
                ->pluck('id')
                ->toArray();
        }

        $result = $this->faceService->predictFromPath($tempPath, $branchUserIds);

        if (isset($result['status']) && $result['status'] === 'recognized') {
            // Ekstrak ID dari nama yang dikembalikan AI (format: 1_rizky)
            $predictedName = $result['name'];
            $predictedId = explode('_', $predictedName)[0];

            // Pastikan wajah yang di-scan adalah user yang sedang login (keamanan tambahan)
            if ((string)$user->id !== $predictedId) {
                $failImagePath = $this->saveFailedImage($image, $imageName, $user->id, 'face_mismatch');
                FailedAttendance::create([
                    'user_id'        => $user->id,
                    'branch_id'      => $branch?->id,
                    'reason'         => 'face_mismatch',
                    'reason_message' => "Wajah tidak cocok dengan akun. Terdeteksi sebagai ID: {$predictedId}",
                    'confidence'     => $result['confidence'] ?? null,
                    'image_path'     => $failImagePath,
                    'latitude'       => $request->input('latitude'),
                    'longitude'      => $request->input('longitude'),
                    'ip_address'     => $request->ip(),
                    'attempted_at'   => now(),
                ]);
                if (file_exists($tempPath)) unlink($tempPath);
                return response()->json([
                    'success' => false,
                    'message' => "Wajah tidak cocok dengan akun Anda! (Terdeteksi ID: " . $predictedId . ")",
                    'data' => $result
                ], 400);
            }

            // Hitung Tipe Absensi & Keterlambatan
            $now = Carbon::now();
            $today = $now->toDateString();
            $lateMinutes = 0;
            $overtimeMinutes = 0;

            // Penentuan tipe: cek riwayat absensi hari ini
            // ✅ Lebih akurat daripada heuristik jam (mencegah check-in salah jadi check-out)
            $todayCheckIn = Attendance::where('user_id', $user->id)
                ->where('type', 'check-in')
                ->whereDate('attended_at', $today)
                ->first();

            $todayCheckOut = Attendance::where('user_id', $user->id)
                ->where('type', 'check-out')
                ->whereDate('attended_at', $today)
                ->first();

            if (!$todayCheckIn) {
                // Belum pernah check-in hari ini → ini adalah check-in
                $type = 'check-in';

                if ($user->shift) {
                    $startTime = Carbon::createFromFormat('H:i:s', $user->shift->start_time);
                    // Hitung keterlambatan jika melewati jam masuk
                    if ($now->greaterThan($startTime)) {
                        $lateMinutes = (int) $startTime->diffInMinutes($now);
                        $lateMinutes = max(0, $lateMinutes);
                    }
                }
            } elseif (!$todayCheckOut) {
                // Sudah check-in tapi belum check-out → ini adalah check-out
                $type = 'check-out';

                if ($user->shift) {
                    $endTime = Carbon::createFromFormat('H:i:s', $user->shift->end_time);
                    // Hitung lembur jika melewati jam pulang
                    if ($now->greaterThan($endTime)) {
                        $overtimeMinutes = (int) $now->diffInMinutes($endTime);
                        $overtimeMinutes = max(0, $overtimeMinutes);
                    }
                }
            } else {
                // Sudah check-in DAN sudah check-out hari ini
                if (file_exists($tempPath)) unlink($tempPath);
                return response()->json([
                    'success' => false,
                    'message' => "Anda sudah melakukan Check-in dan Check-out hari ini. Tidak dapat melakukan absensi lagi.",
                ], 403);
            }
            
            // Simpan foto permanen (Utamakan foto yang ada bounding box dari AI)
            // Folder: attendances/{user_id}/{check_in|check_out}/{filename}
            $folderType = str_replace('-', '_', $type);
            $fileNameRaw = 'raw_' . $imageName;
            $fileNameAnnotated = 'annotated_' . $imageName;
            
            $finalPathRaw = "attendances/{$user->id}/{$folderType}/{$fileNameRaw}";
            $finalPathAnnotated = "attendances/{$user->id}/{$folderType}/{$fileNameAnnotated}";
            
            // Simpan yang Original
            Storage::disk('public')->put($finalPathRaw, base64_decode($image));
            
            // Simpan yang Annotated (jika ada, kalau tidak ya pakai yang original lagi)
            $saveImageAnnotated = isset($result['annotated_image']) 
                ? base64_decode($result['annotated_image']) 
                : base64_decode($image);
                
            Storage::disk('public')->put($finalPathAnnotated, $saveImageAnnotated);

            // Simpan riwayat
            Attendance::create([
                'user_id' => $user->id,
                'type' => $type,
                'work_type' => $isWfh ? 'wfh' : 'wfo',
                'confidence' => $result['confidence'],
                'image_path' => $finalPathAnnotated,
                'raw_image_path' => $finalPathRaw,
                'latitude' => $request->input('latitude'),
                'longitude' => $request->input('longitude'),
                'ip_address' => $request->ip(),
                'network_info' => $request->input('network_info'),
                'branch_id' => $branch ? $branch->id : null,
                'attended_at' => $now,
                'late_minutes' => $lateMinutes,
                'overtime_minutes' => $overtimeMinutes,
                'bbox' => $result['bbox'] ?? null,
                'accuracy' => $result['accuracy'] ?? null,
                'f1_score' => $result['f1_score'] ?? null,
                'precision' => $result['precision'] ?? null,
                'recall' => $result['recall'] ?? null,
            ]);

            $message = "Berhasil! Selamat bekerja, " . $user->name . ".";
            if ($lateMinutes > 0) {
                $message = "Berhasil! Anda terlambat " . $lateMinutes . " menit. Tetap semangat!";
            }
            if ($type === 'check-out') {
                $message = "Berhasil Check-out! Hati-hati di jalan, " . $user->name . ".";
                if ($overtimeMinutes > 0) {
                    $message .= " Anda memiliki lembur " . $overtimeMinutes . " menit.";
                }
            }

            if (file_exists($tempPath)) unlink($tempPath);

            return response()->json([
                'success' => true,
                'message' => $message,
                'data' => $result
            ]);
        }

        $reason = $result['reason'] ?? null;
        $failMessage = match($reason) {
            'no_face'       => 'Wajah tidak terdeteksi. Pastikan wajah terlihat jelas dan pencahayaan cukup.',
            'not_in_branch' => 'Wajah tidak terdaftar di perusahaan ini. Silakan daftarkan wajah Anda terlebih dahulu.',
            'low_confidence'=> 'Wajah tidak dikenali. Pastikan pencahayaan cukup dan posisi wajah menghadap kamera.',
            default         => 'Wajah tidak dikenali. Coba lagi atau hubungi admin.',
        };

        $failImagePath = $this->saveFailedImage($image, $imageName, $user->id, $reason ?? 'unknown');
        FailedAttendance::create([
            'user_id'        => $user->id,
            'branch_id'      => $branch?->id,
            'reason'         => $reason ?? 'unknown',
            'reason_message' => $failMessage,
            'confidence'     => $result['confidence'] ?? null,
            'image_path'     => $failImagePath,
            'latitude'       => $request->input('latitude'),
            'longitude'      => $request->input('longitude'),
            'ip_address'     => $request->ip(),
            'attempted_at'   => now(),
        ]);

        if (file_exists($tempPath)) unlink($tempPath);

        return response()->json([
            'success' => false,
            'message' => $failMessage,
            'data' => $result
        ], 400);
    }

    private function saveFailedImage(string $imageBase64, string $imageName, int $userId, string $reason): ?string
    {
        try {
            $path = "attendances/{$userId}/failed/{$reason}_{$imageName}";
            Storage::disk('public')->put($path, base64_decode($imageBase64));
            return $path;
        } catch (\Exception $e) {
            return null;
        }
    }

    public function failedAttempts(Request $request)
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        if ($user->role === 'karyawan') {
            abort(403);
        }

        $query = FailedAttendance::with(['user', 'branch']);

        if ($user->role === 'owner' && $user->branch_id) {
            $query->where('branch_id', $user->branch_id);
        }

        if ($request->filled('start_date') && $request->filled('end_date')) {
            $query->whereBetween('attempted_at', [
                $request->start_date . ' 00:00:00',
                $request->end_date . ' 23:59:59',
            ]);
        }

        if ($request->filled('reason')) {
            $query->where('reason', $request->reason);
        }

        $failed = $query->orderBy('attempted_at', 'desc')->paginate(20)->withQueryString();

        return Inertia::render('Attendance/FailedAttempts', [
            'failed'  => $failed,
            'filters' => $request->only(['start_date', 'end_date', 'reason']),
        ]);
    }

    private function calculateDistance($lat1, $lon1, $lat2, $lon2)
    {
        $earthRadius = 6371000; // meters
        $dLat = deg2rad($lat2 - $lat1);
        $dLon = deg2rad($lon2 - $lon1);
        $a = sin($dLat / 2) * sin($dLat / 2) +
            cos(deg2rad($lat1)) * cos(deg2rad($lat2)) *
            sin($dLon / 2) * sin($dLon / 2);
        $c = 2 * atan2(sqrt($a), sqrt(1 - $a));
        return $earthRadius * $c;
    }

    /**
     * Halaman Laporan Absensi.
     */
    public function report(Request $request)
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();
        $query = Attendance::with(['user', 'branch']);

        if ($request->filled('start_date') && $request->filled('end_date')) {
            $query->whereBetween('created_at', [
                $request->start_date . ' 00:00:00',
                $request->end_date . ' 23:59:59'
            ]);
        }

        if ($user->role === 'karyawan') {
            $query->where('user_id', $user->id);
            $employees = collect([$user]);
        } else {
            if ($request->filled('user_id')) {
                $query->where('user_id', $request->user_id);
            }
            $employees = User::orderBy('name')->get();
        }

        $attendances = $query->orderBy('created_at', 'desc')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Attendance/Report', [
            'attendances' => $attendances,
            'employees' => $employees,
            'filters' => $request->only(['start_date', 'end_date', 'user_id']),
            'role' => $user->role,
        ]);
    }

    /**
     * Detail Absensi.
     */
    public function show(Attendance $attendance)
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        if ($user->role === 'karyawan' && $attendance->user_id !== $user->id) {
            abort(403);
        }

        $attendance->load(['user', 'branch']);

        return Inertia::render('Attendance/Show', [
            'attendance' => $attendance,
        ]);
    }
}
