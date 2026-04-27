<?php

namespace App\Http\Controllers;

use App\Models\OfficeSetting;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class OfficeSettingController extends Controller
{
    public function index()
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();
        $tenantId = $user->tenant_id;
        $settings = OfficeSetting::firstOrCreate(
            ['tenant_id' => $tenantId],
            [
                'latitude' => '-6.200000',
                'longitude' => '106.816666',
                'radius' => 100,
                'check_in_time' => '08:00',
                'check_out_time' => '17:00'
            ]
        );

        return Inertia::render('Settings/Office', [
            'settings' => $settings,
        ]);
    }

    public function update(Request $request)
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();
        $tenantId = $user->tenant_id;
        $settings = OfficeSetting::where('tenant_id', $tenantId)->firstOrFail();

        $validated = $request->validate([
            'latitude' => 'required|string',
            'longitude' => 'required|string',
            'radius' => 'required|integer|min:10',
            'check_in_time' => 'required',
            'check_out_time' => 'required',
            'is_active' => 'required|boolean',
        ]);

        $settings->update($validated);

        return back()->with('message', 'Pengaturan kantor berhasil diperbarui.');
    }
}
