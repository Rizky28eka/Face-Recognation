<?php

namespace App\Http\Controllers;

use App\Models\Setting;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Artisan;

class SystemSettingController extends Controller
{
    /**
     * Display the settings dashboard.
     */
    public function index()
    {
        $settings = [
            'app_name' => Setting::get('app_name', env('APP_NAME', 'Sikawan AI')),
            'ai_service_url' => Setting::get('ai_service_url', env('AI_SERVICE_URL', 'http://127.0.0.1:8088/api/v1')),
        ];

        return Inertia::render('System/Settings', [
            'settings' => $settings
        ]);
    }

    /**
     * Update the specified settings in storage.
     */
    public function update(Request $request)
    {
        $validated = $request->validate([
            'app_name' => 'required|string|max:255',
            'ai_service_url' => 'required|url|max:255',
        ]);

        Setting::set('app_name', $validated['app_name'], 'string', 'general');
        Setting::set('ai_service_url', $validated['ai_service_url'], 'string', 'ai');

        return back()->with('success', 'Pengaturan sistem berhasil diperbarui.');
    }

    /**
     * Clear application cache.
     */
    public function clearCache()
    {
        try {
            Artisan::call('optimize:clear');
            return back()->with('success', 'Cache sistem berhasil dibersihkan.');
        } catch (\Exception $e) {
            return back()->with('error', 'Gagal membersihkan cache: ' . $e->getMessage());
        }
    }
}
