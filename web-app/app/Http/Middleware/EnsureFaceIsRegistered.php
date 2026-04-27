<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureFaceIsRegistered
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        // If user is authenticated and their face is not registered
        // Also avoid redirect loop by checking if the route is already face-setup
        if ($user && !$user->is_face_registered && !$request->routeIs('profile.face-setup*') && !$request->routeIs('logout')) {
            // Optional: Skip for superadmin/owner if you want
            if ($user->role === 'karyawan') {
                return redirect()->route('profile.face-setup')->with('warning', 'Harap daftarkan wajah Anda terlebih dahulu sebelum menggunakan sistem.');
            }
        }

        return $next($request);
    }
}
