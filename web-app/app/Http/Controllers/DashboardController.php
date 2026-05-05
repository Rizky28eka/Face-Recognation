<?php

namespace App\Http\Controllers;

use App\Models\Attendance;
use App\Models\Tenant;
use App\Models\User;
use App\Models\Leave;
use App\Models\AuditLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Carbon\Carbon;

class DashboardController extends Controller
{
    protected $faceService;

    public function __construct(\App\Services\FaceRecognitionService $faceService)
    {
        $this->faceService = $faceService;
    }

    public function index()
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();
        $role = $user->role;
        $data = [];

        if ($role === 'superadmin') {
            $data = $this->getSuperAdminData();
        } elseif ($role === 'owner') {
            $data = $this->getOwnerData($user->tenant_id);
        } else {
            $data = $this->getKaryawanData($user->id);
        }

        return Inertia::render('Dashboard', [
            'role' => $role,
            'stats' => $data['stats'] ?? [],
            'recentData' => $data['recentData'] ?? [],
            'chartData' => $data['chartData'] ?? [],
        ]);
    }

    private function getSuperAdminData()
    {
        $aiData = $this->faceService->getStatus();
        $status = $aiData['status'] ?? 'offline';
        
        // Handle different response formats from AI service
        $metrics = $aiData['metrics'] ?? $aiData;
        $accuracy = isset($metrics['accuracy']) ? $metrics['accuracy'] . '%' : 'N/A';
        $totalUsers = $metrics['total_classes'] ?? 0;
        $totalImages = $metrics['total_images'] ?? 0;

        return [
            'stats' => [
                ['label' => 'Total Tenant', 'value' => Tenant::count(), 'icon' => 'Building2'],
                ['label' => 'Trained Users', 'value' => $totalUsers, 'icon' => 'Users'],
                ['label' => 'Total Absensi', 'value' => Attendance::count(), 'icon' => 'CalendarCheck'],
                ['label' => 'AI Accuracy', 'value' => $accuracy, 'icon' => 'Target'],
            ],
            'recentData' => Tenant::withCount(['users', 'attendances'])->latest()->limit(5)->get(),
            'auditLogs' => AuditLog::with('user')->latest()->limit(10)->get(),
        ];
    }

    private function getOwnerData($tenantId)
    {
        $today = Carbon::today()->toDateString();
        $onLeaveCount = Leave::where('tenant_id', $tenantId)
            ->where('status', 'approved')
            ->where('start_date', '<=', $today)
            ->where('end_date', '>=', $today)
            ->count();
        
        $pendingLeaveCount = Leave::where('tenant_id', $tenantId)
            ->where('status', 'pending')
            ->count();

        return [
            'stats' => [
                ['label' => 'Karyawan Aktif', 'value' => User::where('tenant_id', $tenantId)->count(), 'icon' => 'Users'],
                ['label' => 'Hadir Hari Ini', 'value' => Attendance::where('tenant_id', $tenantId)->whereDate('created_at', Carbon::today())->count(), 'icon' => 'UserCheck'],
                ['label' => 'Karyawan Cuti', 'value' => $onLeaveCount, 'icon' => 'Coffee'],
                ['label' => 'Menunggu Persetujuan', 'value' => $pendingLeaveCount, 'icon' => 'ClipboardCheck'],
            ],
            'recentData' => Attendance::with('user')
                ->where('tenant_id', $tenantId)
                ->latest()
                ->limit(10)
                ->get(),
            'chartData' => $this->getWeeklyChartData($tenantId),
        ];
    }

    private function getKaryawanData($userId)
    {
        $user = User::with('shift')->find($userId);
        $shiftName = $user->shift ? $user->shift->name : 'Flexible';
        $shiftHours = $user->shift ? $user->shift->start_time . ' - ' . $user->shift->end_time : 'Bebas';

        return [
            'stats' => [
                ['label' => 'Kehadiran Bulan Ini', 'value' => Attendance::where('user_id', $userId)->whereMonth('created_at', Carbon::now()->month)->count() . ' Hari', 'icon' => 'Calendar'],
                ['label' => 'Shift Kerja', 'value' => $shiftName, 'icon' => 'Clock'],
                ['label' => 'Jam Kerja', 'value' => $shiftHours, 'icon' => 'Timer'],
                ['label' => 'Status Hari Ini', 'value' => Attendance::where('user_id', $userId)->whereDate('created_at', Carbon::today())->exists() ? 'Sudah Absen' : 'Belum Absen', 'icon' => 'ShieldCheck'],
            ],
            'recentData' => Attendance::where('user_id', $userId)->latest()->limit(5)->get(),
        ];
    }

    private function getWeeklyChartData($tenantId)
    {
        $data = [];
        for ($i = 6; $i >= 0; $i--) {
            $date = Carbon::today()->subDays($i);
            $data[] = [
                'day' => $date->format('D'),
                'count' => Attendance::where('tenant_id', $tenantId)->whereDate('created_at', $date)->count(),
            ];
        }
        return $data;
    }
}
