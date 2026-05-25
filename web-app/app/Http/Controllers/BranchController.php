<?php

namespace App\Http\Controllers;

use App\Models\Branch;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class BranchController extends Controller
{
    public function overview()
    {
        $companies = Branch::withCount([
            'users as owner_count' => fn($q) => $q->where('role', 'owner'),
            'users as karyawan_count' => fn($q) => $q->where('role', 'karyawan'),
        ])->with(['users' => fn($q) => $q->where('role', 'owner')->select('id', 'name', 'email', 'branch_id')])
          ->orderBy('name')
          ->get()
          ->map(fn($b) => [
              'id'             => $b->id,
              'name'           => $b->name,
              'latitude'       => $b->latitude,
              'longitude'      => $b->longitude,
              'radius'         => $b->radius,
              'check_in_time'  => $b->check_in_time,
              'check_out_time' => $b->check_out_time,
              'is_active'      => $b->is_active,
              'owner_count'    => $b->owner_count,
              'karyawan_count' => $b->karyawan_count,
              'owners'         => $b->users->map(fn($u) => ['name' => $u->name, 'email' => $u->email]),
          ]);

        return Inertia::render('Admin/Companies', [
            'companies' => $companies,
        ]);
    }

    public function index()
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();
        
        $branches = Branch::get();

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

        Branch::create($validated);

        return back()->with('success', 'Cabang baru berhasil ditambahkan.');
    }

    public function update(Request $request, Branch $branch)
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

        $branch->update($validated);

        return back()->with('success', 'Data cabang berhasil diperbarui.');
    }

    public function destroy(Branch $branch)
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();



        // Prevent deleting the last branch? Or let them?
        $count = Branch::count();
        if ($count <= 1) {
            return back()->with('error', 'Anda harus memiliki setidaknya satu cabang.');
        }

        $branch->delete();

        return back()->with('success', 'Cabang berhasil dihapus.');
    }
}
