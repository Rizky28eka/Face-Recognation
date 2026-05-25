import InputError from '@/Components/InputError';
import { Head, Link, useForm } from '@inertiajs/react';
import { Eye, EyeOff, Building2, Mail, Lock, ArrowRight, ShieldCheck, Clock, BarChart3 } from 'lucide-react';
import { FormEvent, useState } from 'react';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Checkbox } from '@/Components/ui/checkbox';

interface LoginProps {
    canResetPassword?: boolean;
    status?: string;
}

export default function Login({ canResetPassword, status }: LoginProps) {
    const [showPassword, setShowPassword] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e: FormEvent) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    const highlights = [
        { icon: ShieldCheck, text: 'Verifikasi wajah real-time' },
        { icon: Clock,        text: 'Pencatatan kehadiran otomatis' },
        { icon: BarChart3,    text: 'Laporan & analitik lengkap' },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex">
            <Head title="Masuk" />

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
                        Selamat Datang<br />Kembali
                    </h1>
                    <p className="text-indigo-200 text-lg leading-relaxed mb-10">
                        Sistem presensi wajah berbasis AI untuk pengelolaan kehadiran yang akurat dan efisien.
                    </p>

                    <div className="space-y-5">
                        {highlights.map(({ icon: Icon, text }) => (
                            <div key={text} className="flex items-center gap-4 bg-white/10 rounded-2xl px-4 py-3">
                                <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
                                    <Icon className="w-4 h-4 text-white" />
                                </div>
                                <span className="text-indigo-100 text-sm font-medium">{text}</span>
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
                            Masuk ke Akun
                        </h2>
                        <p className="text-gray-500 mt-1 text-sm">
                            Belum punya akun?{' '}
                            <Link
                                href={route('register')}
                                className="text-indigo-600 font-semibold hover:underline"
                            >
                                Daftar perusahaan
                            </Link>
                        </p>
                    </div>

                    {status && (
                        <div className="mb-6 p-3 rounded-xl bg-green-50 border border-green-100 text-sm font-medium text-green-700">
                            {status}
                        </div>
                    )}

                    <form onSubmit={submit} className="space-y-5">
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
                                    placeholder="email@perusahaan.com"
                                    className="pl-9 h-11 rounded-xl border-gray-200 bg-gray-50 focus:bg-white"
                                    autoComplete="username"
                                    required
                                />
                            </div>
                            <InputError message={errors.email} />
                        </div>

                        {/* Password */}
                        <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password" className="text-sm font-semibold text-gray-700">
                                    Password
                                </Label>
                                {canResetPassword && (
                                    <Link
                                        href={route('password.request')}
                                        className="text-xs text-indigo-600 hover:underline font-medium"
                                    >
                                        Lupa password?
                                    </Link>
                                )}
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <Input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    placeholder="Password Anda"
                                    className="pl-9 pr-10 h-11 rounded-xl border-gray-200 bg-gray-50 focus:bg-white"
                                    autoComplete="current-password"
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

                        {/* Remember me */}
                        <div className="flex items-center gap-2">
                            <Checkbox
                                id="remember"
                                checked={data.remember}
                                onCheckedChange={(checked) => setData('remember', !!checked)}
                            />
                            <label htmlFor="remember" className="text-sm text-gray-600 cursor-pointer select-none">
                                Ingat saya
                            </label>
                        </div>

                        <Button
                            type="submit"
                            disabled={processing}
                            className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 rounded-xl font-bold text-base shadow-lg shadow-indigo-200 flex items-center justify-center gap-2"
                        >
                            {processing ? 'Memproses...' : (
                                <>
                                    Masuk
                                    <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
}
