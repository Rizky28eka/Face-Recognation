<?php

namespace App\Http\Controllers;

use App\Models\Leave;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class LeaveController extends Controller
{
    public function index()
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();
        
        $query = Leave::with('user');

        if ($user->role === 'karyawan') {
            $query->where('user_id', $user->id);
        }

        $leaves = $query->latest()->paginate(15);

        return Inertia::render('HR/LeaveIndex', [
            'leaves' => $leaves
        ]);
    }

    public function store(Request $request)
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        $validated = $request->validate([
            'type' => 'required|string',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'reason' => 'required|string',
        ]);

        $validated['user_id'] = $user->id;

        $validated['status'] = 'pending';

        Leave::create($validated);

        return back()->with('success', 'Pengajuan cuti berhasil dikirim.');
    }

    public function update(Request $request, Leave $leave)
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();
        


        $validated = $request->validate([
            'status' => 'required|in:approved,rejected',
        ]);

        $leave->update($validated);

        return back()->with('success', 'Status pengajuan cuti diperbarui.');
    }
}
