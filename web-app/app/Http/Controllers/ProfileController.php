<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;

use App\Services\FaceRecognitionService;
use Illuminate\Support\Facades\Storage;

class ProfileController extends Controller
{
    protected $faceService;

    public function __construct(FaceRecognitionService $faceService)
    {
        $this->faceService = $faceService;
    }

    /**
     * Tampilkan halaman registrasi wajah.
     */
    public function faceSetup(Request $request): Response
    {
        return Inertia::render('Profile/FaceSetup', [
            'user' => $request->user(),
        ]);
    }

    /**
     * Simpan foto wajah dan daftarkan ke AI.
     */
    public function storeFace(Request $request): RedirectResponse
    {
        $request->validate([
            'images' => 'required|array|size:5',
            'images.*' => 'required|string',
        ]);

        /** @var \App\Models\User $user */
        $user = Auth::user();

        $successCount = 0;
        $savedPath = null;

        foreach ($request->images as $index => $imageData) {
            // Decode image
            $image = str_replace('data:image/jpeg;base64,', '', $imageData);
            $image = str_replace(' ', '+', $image);
            $imageName = 'face_' . $user->id . '_' . time() . '_' . $index . '.jpg';
            
            $path = 'faces/' . $imageName;
            Storage::disk('public')->put($path, base64_decode($image));

            if ($index === 0) {
                // Jadikan foto pertama sebagai foto profil utama
                $savedPath = $path;
            }

            // Register to AI Service (Gunakan format ID_Name untuk mencegah nama kembar)
            $uniqueName = $user->id . '_' . preg_replace('/[^A-Za-z0-9]/', '', $user->name);
            $absolutePath = storage_path('app/public/' . $path);
            $result = $this->faceService->registerFace($uniqueName, $absolutePath);

            if (isset($result['status']) && $result['status'] === 'success') {
                $successCount++;
            } else {
                // Hapus jika gagal dikenali AI
                Storage::disk('public')->delete($path);
            }
        }

        if ($successCount === 5) {
            $user->update([
                'face_path' => $savedPath,
                'is_face_registered' => true
            ]);

            // Jalankan training otomatis agar wajah baru langsung dikenali
            $this->faceService->train();

            return Redirect::route('dashboard')->with('success', 'Ke-5 foto wajah berhasil didaftarkan! Selamat bergabung.');
        }

        return Redirect::back()->with('error', 'Beberapa foto gagal diverifikasi AI (pastikan wajah terlihat jelas). Silakan coba lagi.');
    }
    /**
     * Display the user's profile form.
     */
    public function edit(Request $request): Response
    {
        return Inertia::render('Profile/Edit', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $request->user()->fill($request->validated());

        if ($request->user()->isDirty('email')) {
            $request->user()->email_verified_at = null;
        }

        $request->user()->save();

        return Redirect::route('profile.edit');
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }
}
