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
     * Upload and verify a single face image.
     */
    public function uploadSingleFace(Request $request)
    {
        $request->validate([
            'image' => 'required|string',
            'index' => 'required|integer',
        ]);

        /** @var \App\Models\User $user */
        $user = Auth::user();

        // Decode image
        $imageData = $request->image;
        $image = str_replace('data:image/jpeg;base64,', '', $imageData);
        $image = str_replace(' ', '+', $image);
        $imageName = 'face_' . $user->id . '_' . time() . '_' . $request->index . '.jpg';
        
        $path = 'faces/' . $imageName;
        Storage::disk('public')->put($path, base64_decode($image));

        // Register to AI Service (Gunakan format ID_Name untuk mencegah nama kembar)
        $uniqueName = $user->id . '_' . preg_replace('/[^A-Za-z0-9]/', '', $user->name);
        $absolutePath = storage_path('app/public/' . $path);
        
        $result = $this->faceService->registerFace($uniqueName, $absolutePath, $request->index);

        if (isset($result['status']) && $result['status'] === 'success') {
            return response()->json([
                'success' => true,
                'path'    => $path,
                'message' => 'Wajah terdeteksi.',
            ]);
        }

        // Hapus file sementara jika gagal
        Storage::disk('public')->delete($path);

        // Teruskan pesan error dari AI Service dengan status HTTP yang sesuai
        $httpStatus = $result['http_status'] ?? 422;
        $message    = $result['message'] ?? 'Wajah tidak terdeteksi atau tidak jelas.';

        return response()->json([
            'success' => false,
            'message' => $message,
        ], $httpStatus);
    }

    /**
     * Selesaikan proses registrasi wajah setelah semua foto diverifikasi.
     */
    public function completeFaceSetup(Request $request): RedirectResponse
    {
        $request->validate([
            'main_photo_path' => 'nullable|string'
        ]);

        /** @var \App\Models\User $user */
        $user = Auth::user();

        $user->update([
            'face_path' => $request->main_photo_path,
            'is_face_registered' => true
        ]);

        // Jalankan training otomatis agar wajah baru langsung dikenali
        $this->faceService->train();

        return Redirect::route('dashboard')->with('success', 'Ke-5 foto wajah berhasil dipelajari AI. Pendaftaran berhasil!');
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
