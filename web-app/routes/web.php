<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\AttendanceController;
use App\Http\Controllers\KaryawanController;
use App\Http\Controllers\BranchController;
use App\Http\Controllers\ShiftController;
use App\Http\Controllers\LeaveController;
use App\Http\Controllers\InvitationController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::middleware('guest')->group(function () {
    Route::get('/join/{token}', [InvitationController::class, 'show'])->name('invite.show');
    Route::post('/join/{token}', [InvitationController::class, 'store'])->name('invite.store');
});

Route::middleware(['auth', 'verified', 'face_registered'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Attendance Routes
    Route::get('/attendance', [AttendanceController::class, 'index'])->name('attendance.index');
    Route::get('/attendance/report', [AttendanceController::class, 'report'])->name('attendance.report');
    Route::get('/attendance/{attendance}', [AttendanceController::class, 'show'])->name('attendance.show');
    Route::post('/attendance/check-in', [AttendanceController::class, 'checkIn'])->name('attendance.check-in');

    // Employee Routes
    Route::get('/karyawan', [KaryawanController::class, 'index'])->name('karyawan.index');
    Route::get('/karyawan/create', [KaryawanController::class, 'create'])->name('karyawan.create');
    Route::post('/karyawan/reset-invite', [KaryawanController::class, 'resetInviteToken'])->name('karyawan.reset-invite');
    Route::post('/karyawan', [KaryawanController::class, 'store'])->name('karyawan.store');
    Route::get('/karyawan/{user}', [KaryawanController::class, 'show'])->name('karyawan.show');
    Route::get('/karyawan/{user}/edit', [KaryawanController::class, 'edit'])->name('karyawan.edit');
    Route::patch('/karyawan/{user}', [KaryawanController::class, 'update'])->name('karyawan.update');
    Route::delete('/karyawan/{user}', [KaryawanController::class, 'destroy'])->name('karyawan.destroy');

    // Settings Routes
    Route::get('/settings/branches', [BranchController::class, 'index'])->name('settings.branches');
    Route::post('/settings/branches', [BranchController::class, 'store'])->name('settings.branches.store');
    Route::patch('/settings/branches/{branch}', [BranchController::class, 'update'])->name('settings.branches.update');
    Route::delete('/settings/branches/{branch}', [BranchController::class, 'destroy'])->name('settings.branches.destroy');
    Route::get('/settings/shifts', [ShiftController::class, 'index'])->name('settings.shifts');
    Route::post('/settings/shifts', [ShiftController::class, 'store'])->name('settings.shifts.store');
    Route::patch('/settings/shifts/{shift}', [ShiftController::class, 'update'])->name('settings.shifts.update');
    Route::delete('/settings/shifts/{shift}', [ShiftController::class, 'destroy'])->name('settings.shifts.destroy');

    // HR Routes
    Route::get('/hr/leaves', [LeaveController::class, 'index'])->name('leaves.index');
    Route::post('/hr/leaves', [LeaveController::class, 'store'])->name('leaves.store');
    Route::patch('/hr/leaves/{leave}', [LeaveController::class, 'update'])->name('leaves.update');
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('/profile/face-setup', [ProfileController::class, 'faceSetup'])->name('profile.face-setup');
    Route::post('/profile/face-setup', [ProfileController::class, 'storeFace'])->name('profile.face-setup.store');
});

require __DIR__.'/auth.php';
