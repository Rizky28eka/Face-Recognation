<?php

namespace App\Http\Controllers;

use App\Models\Shift;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class ShiftController extends Controller
{
    public function index()
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();
        $shifts = Shift::get();

        return Inertia::render('Settings/Shifts', [
            'shifts' => $shifts
        ]);
    }

    public function store(Request $request)
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'start_time' => 'required',
            'end_time' => 'required',
            'color' => 'required|string|size:7',
            'work_type' => 'required|in:wfo,wfh,hybrid',
        ]);



        Shift::create($validated);

        return back()->with('success', 'Shift berhasil dibuat.');
    }

    public function update(Request $request, Shift $shift)
    {


        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'start_time' => 'required',
            'end_time' => 'required',
            'color' => 'required|string|size:7',
            'work_type' => 'required|in:wfo,wfh,hybrid',
        ]);

        $shift->update($validated);

        return back()->with('success', 'Shift berhasil diperbarui.');
    }

    public function destroy(Shift $shift)
    {


        $shift->delete();

        return back()->with('success', 'Shift berhasil dihapus.');
    }
}
