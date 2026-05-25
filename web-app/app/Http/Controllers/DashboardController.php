<?php

namespace App\Http\Controllers;

use App\Models\Attendance;
use App\Models\Branch;
use App\Models\User;
use App\Models\Leave;
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
            $data = $this->getSuperadminData();
        } elseif ($role === 'owner') {
            $data = $this->getOwnerData();
        } else {
            $data = $this->getKaryawanData($user->id);
        }

        return Inertia::render('Dashboard', [
            'role'        => $role,
            'stats'       => $data['stats']       ?? [],
            'recentData'  => $data['recentData']  ?? [],
            'chartData'   => $data['chartData']   ?? [],
            'tenantStats' => $data['tenantStats'] ?? [],
        ]);
    }



    private function getSuperadminData()
    {
        $today = Carbon::today()->toDateString();

        $branchStats = Branch::withCount(['users as owner_count' => function ($q) {
            $q->where('role', 'owner');
        }, 'users as karyawan_count' => function ($q) {
            $q->where('role', 'karyawan');
        }])->get()->map(fn($b) => [
            'id'             => $b->id,
            'name'           => $b->name,
            'slug'           => $b->name,
            'owner_count'    => $b->owner_count,
            'karyawan_count' => $b->karyawan_count,
        ]);

        return [
            'stats' => [
                ['label' => 'Total Cabang',    'value' => Branch::count(),                                               'icon' => 'Building2'],
                ['label' => 'Total Karyawan',  'value' => User::where('role', 'karyawan')->count(),                      'icon' => 'Users'],
                ['label' => 'Absensi Hari Ini','value' => Attendance::whereDate('attended_at', $today)->count(),         'icon' => 'UserCheck'],
                ['label' => 'Total Absensi',   'value' => Attendance::count(),                                           'icon' => 'ClipboardList'],
            ],
            'recentData'  => Attendance::with('user')->latest('attended_at')->limit(10)->get(),
            'chartData'   => $this->getWeeklyChartData(),
            'tenantStats' => $branchStats,
        ];
    }

    private function getOwnerData()
    {
        $today = Carbon::today()->toDateString();
        $onLeaveCount = Leave::where('status', 'approved')
            ->where('start_date', '<=', $today)
            ->where('end_date', '>=', $today)
            ->count();
        
        $pendingLeaveCount = Leave::where('status', 'pending')
            ->count();

        return [
            'stats' => [
                ['label' => 'Karyawan Aktif', 'value' => User::count(), 'icon' => 'Users'],
                ['label' => 'Hadir Hari Ini', 'value' => Attendance::whereDate('created_at', Carbon::today())->count(), 'icon' => 'UserCheck'],
                ['label' => 'Karyawan Cuti', 'value' => $onLeaveCount, 'icon' => 'Coffee'],
                ['label' => 'Menunggu Persetujuan', 'value' => $pendingLeaveCount, 'icon' => 'ClipboardCheck'],
            ],
            'recentData' => Attendance::with('user')
                ->latest()
                ->limit(10)
                ->get(),
            'chartData' => $this->getWeeklyChartData(),
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

    private function getWeeklyChartData()
    {
        $data = [];
        for ($i = 6; $i >= 0; $i--) {
            $date = Carbon::today()->subDays($i);
            $data[] = [
                'day' => $date->format('D'),
                'count' => Attendance::whereDate('created_at', $date)->count(),
            ];
        }
        return $data;
    }
}
