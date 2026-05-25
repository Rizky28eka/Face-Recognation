import InputError from '@/Components/InputError';
import { Head, Link, useForm } from '@inertiajs/react';
import { Eye, EyeOff, Building2, User, Mail, Lock, ArrowRight, CheckCircle2 } from 'lucide-react';
import { FormEvent, useState } from 'react';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';

export default function Register() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        company_name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e: FormEvent) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    const features = [
        'Absensi berbasis pengenalan wajah AI',
        'Manajemen karyawan & shift kerja',
        'Geofencing lokasi kantor',
        'Laporan kehadiran real-time',
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex">
            <Head title="Daftar Perusahaan" />

            {/* Left panel */}
            <div className="hidden lg:flex lg:w-5/12 bg-gradient-to-br from-indigo-600 to-indigo-800 flex-col justify-between p-12 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
                    <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-300 rounded-full blur-3xl" />
                </div>

                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-12">
                        <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                            <Building2 className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-white font-bold text-xl">Sikawan</span>
                    </div>

                    <h1 className="text-4xl font-black text-white leading-tight mb-4">
                        Daftarkan<br />Perusahaan Anda
                    </h1>
                    <p className="text-indigo-200 text-lg leading-relaxed mb-10">
                        Mulai kelola kehadiran karyawan dengan teknologi pengenalan wajah AI yang akurat.
                    </p>

                    <div className="space-y-4">
                        {features.map((f) => (
                            <div key={f} className="flex items-center gap-3">
                                <CheckCircle2 className="w-5 h-5 text-indigo-300 shrink-0" />
                                <span className="text-indigo-100 text-sm">{f}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <p className="relative z-10 text-indigo-300 text-xs">
                    © 2026 Sikawan. Sistem Presensi Pintar.
                </p>
            </div>

            {/* Right panel */}
            <div className="flex-1 flex items-center justify-center px-6 py-12">
                <div className="w-full max-w-md">
                    {/* Mobile logo */}
                    <div className="flex items-center gap-2 mb-8 lg:hidden">
                        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                            <Building2 className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-bold text-indigo-800 text-lg">Sikawan</span>
                    </div>

                    <div className="mb-8">
                        <h2 className="text-2xl md:text-3xl font-black text-gray-900">
                            Buat Akun Baru
                        </h2>
                        <p className="text-gray-500 mt-1 text-sm">
                            Sudah punya akun?{' '}
                            <Link
                                href={route('login')}
                                className="text-indigo-600 font-semibold hover:underline"
                            >
                                Masuk di sini
                            </Link>
                        </p>
                    </div>

                    <form onSubmit={submit} className="space-y-5">
                        {/* Company Name */}
                        <div className="space-y-1.5">
                            <Label htmlFor="company_name" className="text-sm font-semibold text-gray-700">
                                Nama Perusahaan
                            </Label>
                            <div className="relative">
                                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <Input
                                    id="company_name"
                                    value={data.company_name}
                                    onChange={(e) => setData('company_name', e.target.value)}
                                    placeholder="PT. Maju Bersama"
                                    className="pl-9 h-11 rounded-xl border-gray-200 bg-gray-50 focus:bg-white"
                                    required
                                />
                            </div>
                            <InputError message={errors.company_name} />
                        </div>

                        {/* Full Name */}
                        <div className="space-y-1.5">
                            <Label htmlFor="name" className="text-sm font-semibold text-gray-700">
                                Nama Admin (Anda)
                            </Label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <Input
                                    id="name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="John Doe"
                                    className="pl-9 h-11 rounded-xl border-gray-200 bg-gray-50 focus:bg-white"
                                    autoComplete="name"
                                    required
                                />
                            </div>
                            <InputError message={errors.name} />
                        </div>

                        {/* Email */}
                        <div className="space-y-1.5">
                            <Label htmlFor="email" className="text-sm font-semibold text-gray-700">
                                Email
                            </Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <Input
                                    id="email"
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    placeholder="admin@perusahaan.com"
                                    className="pl-9 h-11 rounded-xl border-gray-200 bg-gray-50 focus:bg-white"
                                    autoComplete="username"
                                    required
                                />
                            </div>
                            <InputError message={errors.email} />
                        </div>

                        {/* Password */}
                        <div className="space-y-1.5">
                            <Label htmlFor="password" className="text-sm font-semibold text-gray-700">
                                Password
                            </Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <Input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    placeholder="Min. 8 karakter"
                                    className="pl-9 pr-10 h-11 rounded-xl border-gray-200 bg-gray-50 focus:bg-white"
                                    autoComplete="new-password"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                            <InputError message={errors.password} />
                        </div>

                        {/* Confirm Password */}
                        <div className="space-y-1.5">
                            <Label htmlFor="password_confirmation" className="text-sm font-semibold text-gray-700">
                                Konfirmasi Password
                            </Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <Input
                                    id="password_confirmation"
                                    type={showConfirm ? 'text' : 'password'}
                                    value={data.password_confirmation}
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    placeholder="Ulangi password"
                                    className="pl-9 pr-10 h-11 rounded-xl border-gray-200 bg-gray-50 focus:bg-white"
                                    autoComplete="new-password"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirm(!showConfirm)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                            <InputError message={errors.password_confirmation} />
                        </div>

                        <Button
                            type="submit"
                            disabled={processing}
                            className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 rounded-xl font-bold text-base shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 mt-2"
                        >
                            {processing ? 'Mendaftarkan...' : (
                                <>
                                    Daftar Sekarang
                                    <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </Button>

                        <p className="text-center text-xs text-gray-400 pt-2">
                            Dengan mendaftar, Anda setuju dengan syarat & ketentuan yang berlaku.
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}
