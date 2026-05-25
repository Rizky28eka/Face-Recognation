<?php

namespace App\Http\Controllers;

use App\Models\Branch;
use App\Models\Shift;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class InvitationController extends Controller
{
    private function findOwnerByToken(string $token): User
    {
        $owner = User::where('invite_token', $token)
            ->whereIn('role', ['owner', 'superadmin'])
            ->first();

        if (!$owner) {
            abort(404, 'Link undangan tidak valid atau sudah kedaluwarsa.');
        }

        return $owner;
    }

    public function show(string $token)
    {
        $owner = $this->findOwnerByToken($token);

        // Ambil branch milik owner ini saja
        $branches = Branch::where('is_active', true)
            ->when($owner->branch_id, fn($q) => $q->where('id', $owner->branch_id))
            ->get(['id', 'name']);

        $shifts = Shift::orderBy('name')->get(['id', 'name', 'start_time', 'end_time', 'work_type']);

        return Inertia::render('Auth/InviteRegister', [
            'branches'     => $branches,
            'shifts'       => $shifts,
            'company_name' => $owner->branch?->name ?? 'Perusahaan',
            'token'        => $token,
        ]);
    }

    public function store(Request $request, string $token)
    {
        $owner = $this->findOwnerByToken($token);

        $request->validate([
            'name'      => 'required|string|max:255',
            'email'     => 'required|string|email|max:255|unique:users',
            'password'  => 'required|string|min:8|confirmed',
            'branch_id' => 'required|exists:branches,id',
            'shift_id'  => 'nullable|exists:shifts,id',
        ]);

        // Pastikan branch_id yang dipilih memang milik owner ini
        if ($owner->branch_id && (int) $request->branch_id !== $owner->branch_id) {
            abort(403, 'Branch tidak valid untuk undangan ini.');
        }

        $user = User::create([
            'name'      => $request->name,
            'email'     => $request->email,
            'password'  => Hash::make($request->password),
            'branch_id' => $request->branch_id,
            'shift_id'  => $request->shift_id,
            'role'      => 'karyawan',
        ]);

        Auth::login($user);

        return redirect()->route('profile.face-setup')
            ->with('success', 'Akun berhasil dibuat! Silakan daftarkan wajah Anda.');
    }
}
