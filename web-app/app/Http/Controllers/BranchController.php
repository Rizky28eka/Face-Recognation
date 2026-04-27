<?php

namespace App\Http\Controllers;

use App\Models\Branch;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class BranchController extends Controller
{
    public function index()
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();
        
        $branches = Branch::where('tenant_id', $user->tenant_id)->get();

        return Inertia::render('Settings/Branches', [
            'branches' => $branches,
        ]);
    }

    public function store(Request $request)
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'latitude' => 'required|string',
            'longitude' => 'required|string',
            'radius' => 'required|integer|min:10',
            'check_in_time' => 'required',
            'check_out_time' => 'required',
            'is_active' => 'required|boolean',
        ]);

        Branch::create([
            ...$validated,
            'tenant_id' => $user->tenant_id,
        ]);

        return back()->with('success', 'Cabang baru berhasil ditambahkan.');
    }

    public function update(Request $request, Branch $branch)
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        if ($branch->tenant_id !== $user->tenant_id) {
            abort(403);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'latitude' => 'required|string',
            'longitude' => 'required|string',
            'radius' => 'required|integer|min:10',
            'check_in_time' => 'required',
            'check_out_time' => 'required',
            'is_active' => 'required|boolean',
        ]);

        $branch->update($validated);

        return back()->with('success', 'Data cabang berhasil diperbarui.');
    }

    public function destroy(Branch $branch)
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        if ($branch->tenant_id !== $user->tenant_id) {
            abort(403);
        }

        // Prevent deleting the last branch? Or let them?
        $count = Branch::where('tenant_id', $user->tenant_id)->count();
        if ($count <= 1) {
            return back()->with('error', 'Anda harus memiliki setidaknya satu cabang.');
        }

        $branch->delete();

        return back()->with('success', 'Cabang berhasil dihapus.');
    }
}
