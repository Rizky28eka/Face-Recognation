<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\AttendanceController;
use App\Http\Controllers\KaryawanController;
use App\Http\Controllers\BranchController;
use App\Http\Controllers\ShiftController;
use App\Http\Controllers\LeaveController;
use App\Http\Controllers\InvitationController;
use App\Http\Controllers\AIStatusController;
use App\Http\Controllers\SystemSettingController;
use App\Models\User;
use App\Models\Attendance;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
        'stats' => [
            'branches' => \App\Models\Branch::count(),
            'users' => User::count(),
            'attendances' => Attendance::count(),
        ]
    ]);
});

Route::middleware('guest')->group(function () {
    Route::get('/join/{token}', [InvitationController::class, 'show'])->name('invite.show');
    Route::post('/join/{token}', [InvitationController::class, 'store'])->name('invite.store');
});

Route::middleware(['auth', 'verified', 'face_registered'])->group(function () {
    // All roles can access dashboard
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Superadmin: overview semua perusahaan & lokasi (read-only)
    Route::get('/admin/companies', [BranchController::class, 'overview'])
        ->middleware('role:superadmin')
        ->name('admin.companies');

    // Attendance: superadmin & owner lihat laporan, karyawan check-in
    Route::get('/attendance', [AttendanceController::class, 'index'])
        ->middleware('role:karyawan')
        ->name('attendance.index');
    Route::post('/attendance/check-in', [AttendanceController::class, 'checkIn'])
        ->middleware('role:karyawan')
        ->name('attendance.check-in');
    Route::get('/attendance/report', [AttendanceController::class, 'report'])
        ->middleware('role:superadmin,owner')
        ->name('attendance.report');
    Route::get('/attendance/{attendance}', [AttendanceController::class, 'show'])
        ->middleware('role:owner,superadmin')
        ->name('attendance.show');

    // Manajemen karyawan: hanya owner
    Route::middleware('role:owner')->group(function () {
        Route::get('/karyawan', [KaryawanController::class, 'index'])->name('karyawan.index');
        Route::get('/karyawan/create', [KaryawanController::class, 'create'])->name('karyawan.create');
        Route::post('/karyawan/reset-invite', [KaryawanController::class, 'resetInviteToken'])->name('karyawan.reset-invite');
        Route::post('/karyawan', [KaryawanController::class, 'store'])->name('karyawan.store');
        Route::get('/karyawan/{user}', [KaryawanController::class, 'show'])->name('karyawan.show');
        Route::get('/karyawan/{user}/edit', [KaryawanController::class, 'edit'])->name('karyawan.edit');
        Route::patch('/karyawan/{user}', [KaryawanController::class, 'update'])->name('karyawan.update');
        Route::delete('/karyawan/{user}', [KaryawanController::class, 'destroy'])->name('karyawan.destroy');
        Route::post('/karyawan/{user}/toggle-wfh', [KaryawanController::class, 'toggleWfh'])->name('karyawan.toggle-wfh');
        Route::get('/karyawan/{user}/download', [KaryawanController::class, 'download'])->name('karyawan.download');
    });

    // Settings: hanya owner
    Route::middleware('role:owner')->group(function () {
        Route::get('/settings/branches', [BranchController::class, 'index'])->name('settings.branches');
        Route::post('/settings/branches', [BranchController::class, 'store'])->name('settings.branches.store');
        Route::patch('/settings/branches/{branch}', [BranchController::class, 'update'])->name('settings.branches.update');
        Route::delete('/settings/branches/{branch}', [BranchController::class, 'destroy'])->name('settings.branches.destroy');

        Route::get('/settings/shifts', [ShiftController::class, 'index'])->name('settings.shifts');
        Route::post('/settings/shifts', [ShiftController::class, 'store'])->name('settings.shifts.store');
        Route::patch('/settings/shifts/{shift}', [ShiftController::class, 'update'])->name('settings.shifts.update');
        Route::delete('/settings/shifts/{shift}', [ShiftController::class, 'destroy'])->name('settings.shifts.destroy');
    });

    // HR Cuti: karyawan ajukan, owner approve — superadmin tidak bisa sentuh
    Route::get('/hr/leaves', [LeaveController::class, 'index'])
        ->middleware('role:owner,karyawan')
        ->name('leaves.index');
    Route::post('/hr/leaves', [LeaveController::class, 'store'])
        ->middleware('role:karyawan')
        ->name('leaves.store');
    Route::patch('/hr/leaves/{leave}', [LeaveController::class, 'update'])
        ->middleware('role:owner')
        ->name('leaves.update');
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::post('/profile/photo', [ProfileController::class, 'updatePhoto'])->name('profile.update-photo');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('/profile/face-setup', [ProfileController::class, 'faceSetup'])->name('profile.face-setup');
    Route::post('/profile/face-setup/upload-single', [ProfileController::class, 'uploadSingleFace'])->name('profile.face-setup.upload-single');
    Route::post('/profile/face-setup/complete', [ProfileController::class, 'completeFaceSetup'])->name('profile.face-setup.complete');
});



require __DIR__.'/auth.php';
