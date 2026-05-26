<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Shift;
use App\Models\Branch;
use App\Services\FaceRecognitionService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;
use Barryvdh\DomPDF\Facade\Pdf;

class KaryawanController extends Controller
{
    public function index()
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();
        
        $karyawan = User::where('role', 'karyawan')
            ->latest()
            ->paginate(10);

        return Inertia::render('Karyawan/Index', [
            'karyawan' => $karyawan
        ]);
    }

    public function create()
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        if (!$user->invite_token) {
            $user->update(['invite_token' => \Illuminate\Support\Str::random(32)]);
        }

        $inviteUrl = route('invite.show', $user->invite_token);

        return Inertia::render('Karyawan/Create', [
            'invite_url' => $inviteUrl,
        ]);
    }

    public function resetInviteToken()
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();
        $user->update(['invite_token' => \Illuminate\Support\Str::random(32)]);

        return redirect()->route('karyawan.create')->with('success', 'Link undangan berhasil diperbarui.');
    }

    public function store(Request $request)
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => ['required', 'confirmed', Password::defaults()],
            'shift_id' => 'nullable|exists:shifts,id',
            'branch_id' => 'nullable|exists:branches,id',
        ]);

        User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => 'karyawan',
            'shift_id' => $request->shift_id,
            'branch_id' => $request->branch_id,
        ]);

        return redirect()->route('karyawan.index')->with('success', 'Karyawan berhasil ditambahkan.');
    }

    public function show(User $user)
    {
        /** @var \App\Models\User $currentUser */
        $currentUser = Auth::user();



        $attendances = \App\Models\Attendance::where('user_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get();

        return Inertia::render('Karyawan/Show', [
            'employee' => $user->load(['shift', 'branch']),
            'recentAttendances' => $attendances
        ]);
    }

    public function edit(User $user)
    {
        /** @var \App\Models\User $currentUser */
        $currentUser = Auth::user();



        $shifts = Shift::get();
        $branches = Branch::get();

        return Inertia::render('Karyawan/Edit', [
            'employee' => $user,
            'shifts' => $shifts,
            'branches' => $branches,
        ]);
    }

    public function update(Request $request, User $user)
    {
        /** @var \App\Models\User $currentUser */
        $currentUser = Auth::user();



        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
            'password' => ['nullable', 'confirmed', Password::defaults()],
            'shift_id' => 'nullable|exists:shifts,id',
            'branch_id' => 'nullable|exists:branches,id',
        ]);

        $user->update([
            'name' => $request->name,
            'email' => $request->email,
            'shift_id' => $request->shift_id,
            'branch_id' => $request->branch_id,
        ]);

        if ($request->filled('password')) {
            $user->update([
                'password' => Hash::make($request->password),
            ]);
        }

        return redirect()->route('karyawan.index')->with('success', 'Data karyawan berhasil diperbarui.');
    }

    public function destroy(User $user, FaceRecognitionService $faceService)
    {
        /** @var \App\Models\User $currentUser */
        $currentUser = Auth::user();

        if ($user->id === $currentUser->id) {
            abort(403);
        }

        // Hapus dataset wajah dari AI service jika sudah registrasi
        if ($user->is_face_registered) {
            $faceLabel = $user->id . '_' . strtolower(str_replace(' ', '_', $user->name));
            $faceService->removeFace($faceLabel);
        }

        // Hapus foto profil dari storage
        if ($user->profile_photo_path) {
            Storage::disk('public')->delete($user->profile_photo_path);
        }

        // Hapus foto absensi dari storage
        Storage::disk('public')->deleteDirectory("attendances/{$user->id}");

        $user->delete();

        return redirect()->route('karyawan.index')->with('success', 'Karyawan berhasil dihapus.');
    }

    public function toggleWfh(Request $request, User $user)
    {
        /** @var \App\Models\User $currentUser */
        $currentUser = Auth::user();



        $request->validate([
            'is_wfh' => 'required|boolean',
        ]);

        $user->update([
            'is_wfh' => $request->is_wfh,
        ]);

        return redirect()->back()->with('success', 'Status Izin WFH berhasil diperbarui.');
    }

    public function download(User $user)
    {
        /** @var \App\Models\User $currentUser */
        $currentUser = Auth::user();



        $attendances = \App\Models\Attendance::where('user_id', $user->id)
            ->orderBy('attended_at', 'desc')
            ->take(20)
            ->get();

        $pdf = Pdf::loadView('pdf.employee-detail', [
            'employee' => $user->load(['shift', 'branch']),
            'attendances' => $attendances,
            'tenant' => ['name' => \App\Models\Setting::get('app_name', 'Sikawan')]
        ]);

        return $pdf->download("Detail_Karyawan_{$user->id}.pdf");
    }
}
