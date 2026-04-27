<?php

namespace App\Http\Controllers;

use App\Models\Tenant;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class InvitationController extends Controller
{
    public function show($token)
    {
        $tenant = Tenant::where('registration_token', $token)->firstOrFail();

        return Inertia::render('Auth/InviteRegister', [
            'tenant' => $tenant,
            'branches' => $tenant->branches()->where('is_active', true)->get(),
            'shifts' => $tenant->shifts()->get(),
        ]);
    }

    public function store(Request $request, $token)
    {
        $tenant = Tenant::where('registration_token', $token)->firstOrFail();

        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'branch_id' => 'required|exists:branches,id',
            'shift_id' => 'required|exists:shifts,id',
        ]);

        $user = User::create([
            'tenant_id' => $tenant->id,
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'branch_id' => $request->branch_id,
            'shift_id' => $request->shift_id,
            'role' => 'karyawan',
        ]);

        Auth::login($user);

        return redirect()->route('profile.face-setup')->with('success', 'Akun berhasil dibuat! Sekarang silakan daftarkan wajah Anda.');
    }
}
