<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Shift;
use App\Models\Branch;
use App\Models\Tenant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;

class KaryawanController extends Controller
{
    public function index()
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();
        
        // Only owner can see their employees
        if ($user->role !== 'owner') {
            abort(403, 'Unauthorized action.');
        }

        $karyawan = User::where('tenant_id', $user->tenant_id)
            ->where('role', 'karyawan')
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
        $tenant = $user->tenant;

        return Inertia::render('Karyawan/Create', [
            'invite_url' => $tenant->getInviteUrl(),
        ]);
    }

    public function resetInviteToken()
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();
        
        $tenant = Tenant::find($user->tenant_id);
        $tenant->registration_token = \Illuminate\Support\Str::random(32);
        $tenant->save();

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
            'tenant_id' => $user->tenant_id,
            'shift_id' => $request->shift_id,
            'branch_id' => $request->branch_id,
        ]);

        return redirect()->route('karyawan.index')->with('success', 'Karyawan berhasil ditambahkan.');
    }

    public function show(User $user)
    {
        /** @var \App\Models\User $currentUser */
        $currentUser = Auth::user();

        // Security check
        if ($user->tenant_id !== $currentUser->tenant_id) {
            abort(403);
        }

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

        if ($user->tenant_id !== $currentUser->tenant_id) {
            abort(403);
        }

        $shifts = Shift::where('tenant_id', $currentUser->tenant_id)->get();
        $branches = Branch::where('tenant_id', $currentUser->tenant_id)->get();

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

        if ($user->tenant_id !== $currentUser->tenant_id) {
            abort(403);
        }

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

    public function destroy(User $user)
    {
        /** @var \App\Models\User $currentUser */
        $currentUser = Auth::user();

        if ($user->tenant_id !== $currentUser->tenant_id || $user->id === $currentUser->id) {
            abort(403);
        }

        $user->delete();

        return redirect()->route('karyawan.index')->with('success', 'Karyawan berhasil dihapus.');
    }

    public function toggleWfh(Request $request, User $user)
    {
        /** @var \App\Models\User $currentUser */
        $currentUser = Auth::user();

        if ($user->tenant_id !== $currentUser->tenant_id) {
            abort(403);
        }

        $request->validate([
            'is_wfh' => 'required|boolean',
        ]);

        $user->update([
            'is_wfh' => $request->is_wfh,
        ]);

        return redirect()->back()->with('success', 'Status Izin WFH berhasil diperbarui.');
    }
}
