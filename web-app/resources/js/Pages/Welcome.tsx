import ApplicationLogo from '@/Components/ApplicationLogo';
import { LandingHeader } from '@/Components/LandingHeader';
import { Badge } from '@/Components/ui/badge';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Head, Link, usePage } from '@inertiajs/react';
import {
    CheckCircle2,
    LayoutDashboard,
    ShieldCheck,
    Smartphone,
    UserCheck,
    Zap,
} from 'lucide-react';

interface WelcomeProps {
    canLogin: boolean;
    canRegister: boolean;
    stats: {
        branches: number;
        users: number;
        attendances: number;
    };
}

export default function Welcome({
    canLogin,
    canRegister,
    stats,
}: WelcomeProps) {
    const user = usePage().props.auth.user;

    return (
        <div className="min-h-screen bg-slate-50">
            <Head title="Sistem Presensi Wajah Pintar" />

            <LandingHeader canLogin={canLogin} canRegister={canRegister} />

            <main>
                {/* Hero Section */}
                <section className="relative overflow-hidden pt-16 pb-24 lg:pt-24 lg:pb-32">
                    <div className="container mx-auto px-4 lg:px-8 relative z-10">
                        <div className="grid lg:grid-cols-2 gap-12 items-center">
                            <div className="flex flex-col space-y-8">
                                <div className="space-y-4">
                                    <Badge className="w-fit bg-indigo-100 text-indigo-700 hover:bg-indigo-100 border-none px-3 py-1 text-sm font-semibold">
                                        Baru: Presensi Berbasis AI 2.0
                                    </Badge>
                                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-[1.1]">
                                        Absensi Pintar dengan{' '}
                                        <span className="text-indigo-600">
                                            Pengenalan Wajah
                                        </span>
                                    </h1>
                                    <p className="text-lg md:text-xl text-slate-600 max-w-[600px] leading-relaxed">
                                        Kami memberikan solusi presensi yang
                                        aman, cepat, dan akurat menggunakan
                                        teknologi AI tercanggih. Hindari
                                        kecurangan dan tingkatkan efisiensi tim
                                        Anda.
                                    </p>
                                </div>
                                <div className="flex flex-col sm:flex-row gap-4">
                                    {user ? (
                                        <Link href={route('dashboard')}>
                                            <Button
                                                size="lg"
                                                className="bg-indigo-600 hover:bg-indigo-700 text-lg px-8 h-14 rounded-xl shadow-lg shadow-indigo-200"
                                            >
                                                Pergi ke Dashboard
                                            </Button>
                                        </Link>
                                    ) : (
                                        <>
                                            <Link href={route('register')}>
                                                <Button
                                                    size="lg"
                                                    className="bg-indigo-600 hover:bg-indigo-700 text-lg px-8 h-14 rounded-xl shadow-lg shadow-indigo-200"
                                                >
                                                    Mulai Sekarang
                                                </Button>
                                            </Link>
                                            <Button
                                                size="lg"
                                                variant="outline"
                                                className="text-lg px-8 h-14 rounded-xl border-slate-200 hover:bg-slate-100"
                                            >
                                                Pelajari Fitur
                                            </Button>
                                        </>
                                    )}
                                </div>
                                <div className="flex items-center gap-6 pt-4 text-slate-500">
                                    <div className="flex items-center gap-2">
                                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                                        <span className="text-sm font-medium">
                                            99.9% Akurat
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                                        <span className="text-sm font-medium">
                                            Setup 5 Menit
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="relative flex justify-center lg:justify-end">
                                <div className="relative w-full max-w-[500px] aspect-square lg:aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-500">
                                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 mix-blend-overlay" />
                                    <div className="w-full h-full bg-slate-200 flex items-center justify-center border-4 border-white">
                                        <div className="text-center p-8">
                                            <Smartphone className="w-20 h-20 text-indigo-300 mx-auto mb-4" />
                                            <p className="text-slate-400 font-medium">
                                                Visual Mockup Sistem Presensi AI
                                            </p>
                                        </div>
                                    </div>
                                    {/* Glassmorphism card overlay */}
                                    <div className="absolute bottom-6 left-6 right-6 bg-white/80 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-white/40">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                                                <UserCheck className="w-6 h-6 text-white" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                                    Status Presensi
                                                </p>
                                                <p className="text-sm font-bold text-slate-900">
                                                    Verifikasi Berhasil: Rizky
                                                    Eka
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* Decorative blobs */}
                                <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-200 rounded-full blur-3xl opacity-50" />
                                <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-purple-200 rounded-full blur-3xl opacity-50" />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="py-24 bg-white border-y border-slate-100">
                    <div className="container mx-auto px-4 lg:px-8">
                        <div className="text-center max-w-[800px] mx-auto mb-16 space-y-4">
                            <h2 className="text-indigo-600 font-bold tracking-wider uppercase text-sm">
                                Keunggulan Utama
                            </h2>
                            <h3 className="text-3xl md:text-4xl font-black text-slate-900">
                                Mengapa Memilih Sistem Kami untuk Bisnis Anda?
                            </h3>
                            <p className="text-slate-600 text-lg">
                                Kami menggabungkan kemudahan penggunaan dengan
                                teknologi AI mutakhir untuk memberikan
                                pengalaman presensi terbaik.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            <Card className="border-none shadow-none hover:bg-slate-50 transition-colors p-2">
                                <CardHeader>
                                    <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-indigo-100">
                                        <ShieldCheck className="w-6 h-6 text-white" />
                                    </div>
                                    <CardTitle className="text-xl font-bold">
                                        Keamanan Tinggi
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-slate-600 leading-relaxed">
                                        Data wajah dienkripsi dengan standar
                                        militer dan dilengkapi deteksi liveness
                                        untuk mencegah pemalsuan foto.
                                    </p>
                                </CardContent>
                            </Card>

                            <Card className="border-none shadow-none hover:bg-slate-50 transition-colors p-2">
                                <CardHeader>
                                    <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-purple-100">
                                        <Zap className="w-6 h-6 text-white" />
                                    </div>
                                    <CardTitle className="text-xl font-bold">
                                        Instan & Akurat
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-slate-600 leading-relaxed">
                                        Proses pengenalan wajah kurang dari 1
                                        detik dengan tingkat akurasi yang sangat
                                        tinggi bahkan dalam kondisi cahaya
                                        minim.
                                    </p>
                                </CardContent>
                            </Card>

                            <Card className="border-none shadow-none hover:bg-slate-50 transition-colors p-2">
                                <CardHeader>
                                    <div className="w-12 h-12 bg-pink-600 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-pink-100">
                                        <LayoutDashboard className="w-6 h-6 text-white" />
                                    </div>
                                    <CardTitle className="text-xl font-bold">
                                        Dashboard Real-time
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-slate-600 leading-relaxed">
                                        Pantau kehadiran tim Anda secara
                                        langsung melalui dashboard admin yang
                                        intuitif dan komprehensif.
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </section>

                {/* Stats/Proof Section */}
                <section className="py-20 bg-indigo-900 text-white overflow-hidden relative">
                    <div className="absolute inset-0 opacity-10 pointer-events-none">
                        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
                    </div>
                    <div className="container mx-auto px-4 lg:px-8 relative z-10">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                            <div className="space-y-2">
                                <p className="text-4xl md:text-5xl font-black">
                                    {stats.users > 1000
                                        ? `${(stats.users / 1000).toFixed(1)}k+`
                                        : stats.users}
                                </p>
                                <p className="text-indigo-200 font-medium">
                                    Pengguna Aktif
                                </p>
                            </div>
                            <div className="space-y-2">
                                <p className="text-4xl md:text-5xl font-black">
                                    {stats.branches}
                                </p>
                                <p className="text-indigo-200 font-medium">
                                    Perusahaan
                                </p>
                            </div>
                            <div className="space-y-2">
                                <p className="text-4xl md:text-5xl font-black">
                                    {stats.attendances > 1000
                                        ? `${(stats.attendances / 1000).toFixed(1)}k+`
                                        : stats.attendances}
                                </p>
                                <p className="text-indigo-200 font-medium">
                                    Kepuasan
                                </p>
                            </div>
                            <div className="space-y-2">
                                <p className="text-4xl md:text-5xl font-black">
                                    24/7
                                </p>
                                <p className="text-indigo-200 font-medium">
                                    Dukungan
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-24 bg-slate-50">
                    <div className="container mx-auto px-4 lg:px-8">
                        <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 rounded-[2.5rem] p-12 md:p-20 text-center text-white relative overflow-hidden shadow-2xl shadow-indigo-200">
                            <div className="relative z-10 space-y-8">
                                <h2 className="text-3xl md:text-5xl font-black max-w-[800px] mx-auto leading-tight">
                                    Siap Mengubah Cara Kerja Tim Anda Jadi Lebih
                                    Modern?
                                </h2>
                                <p className="text-lg md:text-xl text-indigo-100 max-w-[600px] mx-auto">
                                    Daftar sekarang dan nikmati gratis trial
                                    selama 14 hari tanpa biaya apapun.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                                    {user ? (
                                        <Link href={route('dashboard')}>
                                            <Button
                                                size="lg"
                                                className="bg-white text-indigo-600 hover:bg-indigo-50 text-lg px-10 h-14 rounded-xl font-bold"
                                            >
                                                Buka Dashboard
                                            </Button>
                                        </Link>
                                    ) : (
                                        <>
                                            <Link href={route('register')}>
                                                <Button
                                                    size="lg"
                                                    className="bg-white text-indigo-600 hover:bg-indigo-50 text-lg px-10 h-14 rounded-xl font-bold"
                                                >
                                                    Daftar Sekarang
                                                </Button>
                                            </Link>
                                            <Link href={route('login')}>
                                                <Button
                                                    size="lg"
                                                    variant="ghost"
                                                    className="text-white hover:bg-white/10 text-lg px-10 h-14 rounded-xl font-bold border border-white/20"
                                                >
                                                    Masuk Akun
                                                </Button>
                                            </Link>
                                        </>
                                    )}
                                </div>
                            </div>
                            {/* Decorative elements */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
                            <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl" />
                        </div>
                    </div>
                </section>
            </main>

            <footer className="py-12 bg-white border-t border-slate-100">
                <div className="container mx-auto px-4 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                        <div className="flex flex-col items-center md:items-start gap-4">
                            <ApplicationLogo className="w-auto h-8" />
                            <p className="text-slate-500 text-sm max-w-[300px] text-center md:text-left">
                                Solusi presensi cerdas berbasis kecerdasan
                                buatan untuk masa depan yang lebih efisien.
                            </p>
                        </div>
                        <div className="flex gap-8 text-sm font-medium text-slate-600">
                            <a
                                href="#"
                                className="hover:text-indigo-600 transition-colors"
                            >
                                Kebijakan Privasi
                            </a>
                            <a
                                href="#"
                                className="hover:text-indigo-600 transition-colors"
                            >
                                Syarat & Ketentuan
                            </a>
                            <a
                                href="#"
                                className="hover:text-indigo-600 transition-colors"
                            >
                                Bantuan
                            </a>
                        </div>
                        <p className="text-slate-400 text-sm">
                            © 2026. All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
