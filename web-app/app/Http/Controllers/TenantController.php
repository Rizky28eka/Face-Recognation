<?php

namespace App\Http\Controllers;

use App\Models\Tenant;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class TenantController extends Controller
{
    /**
     * Display a listing of the tenants.
     */
    public function index()
    {
        // Using withCount to show statistics in the UI
        $tenants = Tenant::withCount(['users', 'branches'])->latest()->get();

        return Inertia::render('Tenants/Index', [
            'tenants' => $tenants
        ]);
    }

    /**
     * Display the specified tenant.
     */
    public function show(Tenant $tenant)
    {
        $tenant->load(['users', 'branches']);
        
        return Inertia::render('Tenants/Show', [
            'tenant' => $tenant
        ]);
    }

    /**
     * Show the form for editing the specified tenant.
     */
    public function edit(Tenant $tenant)
    {
        return Inertia::render('Tenants/Edit', [
            'tenant' => $tenant
        ]);
    }

    /**
     * Update the specified tenant in storage.
     */
    public function update(Request $request, Tenant $tenant)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:tenants,slug,' . $tenant->id,
            'address' => 'nullable|string',
        ]);

        $tenant->update($validated);

        return redirect()->route('tenants.show', $tenant->id)->with('success', 'Data tenant berhasil diperbarui.');
    }

    /**
     * Remove the specified tenant from storage.
     */
    public function destroy(Tenant $tenant)
    {
        // Prevent deleting the very first tenant if it's considered system critical? Or just let them.
        // Let's delete the tenant. Due to foreign keys, this should cascade if DB is set up that way,
        // but let's assume the developer knows what they are doing.
        // In a real app, we might soft delete or check for existing data.
        
        $tenant->delete();

        return back()->with('success', 'Tenant berhasil dihapus.');
    }
}
