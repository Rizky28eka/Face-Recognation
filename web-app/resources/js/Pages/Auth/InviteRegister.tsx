import React, { useState } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import {
    User, Mail, Lock, Clock, MapPin, ArrowRight,
    Building2, Eye, EyeOff, CheckCircle2,
} from 'lucide-react';
import InputError from '@/Components/InputError';
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/Components/ui/select';

interface Branch { id: number; name: string }
interface Shift  { id: number; name: string; start_time: string; end_time: string; work_type: string }

interface Props {
    branches:     Branch[];
    shifts:       Shift[];
    company_name: string;
    token:        string;
}

export default function InviteRegister({ branches, shifts, company_name, token }: Props) {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm,  setShowConfirm]  = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        name:                  '',
        email:                 '',
        password:              '',
        password_confirmation: '',
        branch_id:             branches.length === 1 ? String(branches[0].id) : '',
        shift_id:              '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('invite.store', token), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex">
            <Head title={`Bergabung — ${company_name}`} />

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

                    <div className="mb-8">
                        <p className="text-indigo-300 text-sm font-medium uppercase tracking-wider mb-2">
                            Undangan dari
                        </p>
                        <h1 className="text-3xl font-black text-white leading-tight">
                            {company_name}
                        </h1>
                    </div>

                    <p className="text-indigo-200 leading-relaxed mb-10">
                        Anda diundang bergabung sebagai karyawan. Lengkapi data di bawah untuk membuat akun dan mulai absensi.
                    </p>

                    <div className="space-y-3">
                        {[
                            'Daftarkan akun karyawan',
                            'Registrasi wajah untuk absensi',
                            'Mulai absensi dari hari pertama',
                        ].map((step, i) => (
                            <div key={step} className="flex items-center gap-3">
                                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                                    <span className="text-white text-xs font-bold">{i + 1}</span>
                                </div>
                                <span className="text-indigo-100 text-sm">{step}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <p className="relative z-10 text-indigo-300 text-xs">© 2026 Sikawan. Sistem Presensi Pintar.</p>
            </div>

            {/* Right panel */}
            <div className="flex-1 flex items-center justify-center px-6 py-12">
                <div className="w-full max-w-md">
                    {/* Mobile header */}
                    <div className="mb-8 lg:hidden">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                                <Building2 className="w-4 h-4 text-white" />
                            </div>
                            <span className="font-bold text-indigo-800">Sikawan</span>
                        </div>
                        <p className="text-sm text-indigo-600 font-medium">Undangan dari {company_name}</p>
                    </div>

                    <div className="mb-8">
                        <h2 className="text-2xl md:text-3xl font-black text-gray-900">Buat Akun Karyawan</h2>
                        <p className="text-gray-500 mt-1 text-sm">
                            Sudah punya akun?{' '}
                            <Link href={route('login')} className="text-indigo-600 font-semibold hover:underline">
                                Masuk di sini
                            </Link>
                        </p>
                    </div>

                    <form onSubmit={submit} className="space-y-5">
                        {/* Nama */}
                        <div className="space-y-1.5">
                            <Label className="text-sm font-semibold text-gray-700">Nama Lengkap</Label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <Input
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="Nama lengkap Anda"
                                    className="pl-9 h-11 rounded-xl border-gray-200 bg-gray-50 focus:bg-white"
                                    required
                                />
                            </div>
                            <InputError message={errors.name} />
                        </div>

                        {/* Email */}
                        <div className="space-y-1.5">
                            <Label className="text-sm font-semibold text-gray-700">Email</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <Input
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    placeholder="email@perusahaan.com"
                                    className="pl-9 h-11 rounded-xl border-gray-200 bg-gray-50 focus:bg-white"
                                    required
                                />
                            </div>
                            <InputError message={errors.email} />
                        </div>

                        {/* Branch — sembunyikan jika hanya 1 */}
                        {branches.length > 1 ? (
                            <div className="space-y-1.5">
                                <Label className="text-sm font-semibold text-gray-700">Lokasi Cabang</Label>
                                <Select value={data.branch_id} onValueChange={(v) => setData('branch_id', v)}>
                                    <SelectTrigger className="h-11 rounded-xl border-gray-200 bg-gray-50">
                                        <div className="flex items-center gap-2">
                                            <MapPin className="w-4 h-4 text-gray-400" />
                                            <SelectValue placeholder="Pilih cabang" />
                                        </div>
                                    </SelectTrigger>
                                    <SelectContent>
                                        {branches.map((b) => (
                                            <SelectItem key={b.id} value={String(b.id)}>{b.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.branch_id} />
                            </div>
                        ) : (
                            <div className="flex items-center gap-2 p-3 rounded-xl bg-indigo-50 border border-indigo-100">
                                <MapPin className="w-4 h-4 text-indigo-500 shrink-0" />
                                <span className="text-sm text-indigo-700 font-medium">{branches[0]?.name ?? company_name}</span>
                                <CheckCircle2 className="w-4 h-4 text-indigo-400 ml-auto" />
                            </div>
                        )}

                        {/* Shift */}
                        {shifts.length > 0 && (
                            <div className="space-y-1.5">
                                <Label className="text-sm font-semibold text-gray-700">Shift Kerja</Label>
                                <Select value={data.shift_id} onValueChange={(v) => setData('shift_id', v)}>
                                    <SelectTrigger className="h-11 rounded-xl border-gray-200 bg-gray-50">
                                        <div className="flex items-center gap-2">
                                            <Clock className="w-4 h-4 text-gray-400" />
                                            <SelectValue placeholder="Pilih shift" />
                                        </div>
                                    </SelectTrigger>
                                    <SelectContent>
                                        {shifts.map((s) => (
                                            <SelectItem key={s.id} value={String(s.id)}>
                                                {s.name} · {s.start_time.substring(0, 5)}–{s.end_time.substring(0, 5)}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.shift_id} />
                            </div>
                        )}

                        {/* Password */}
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <Label className="text-sm font-semibold text-gray-700">Password</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <Input
                                        type={showPassword ? 'text' : 'password'}
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        placeholder="••••••••"
                                        className="pl-9 pr-9 h-11 rounded-xl border-gray-200 bg-gray-50 focus:bg-white"
                                        required
                                    />
                                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                                <InputError message={errors.password} />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-sm font-semibold text-gray-700">Konfirmasi</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <Input
                                        type={showConfirm ? 'text' : 'password'}
                                        value={data.password_confirmation}
                                        onChange={(e) => setData('password_confirmation', e.target.value)}
                                        placeholder="••••••••"
                                        className="pl-9 pr-9 h-11 rounded-xl border-gray-200 bg-gray-50 focus:bg-white"
                                        required
                                    />
                                    <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                        {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            disabled={processing}
                            className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 rounded-xl font-bold text-base shadow-lg shadow-indigo-200 flex items-center justify-center gap-2"
                        >
                            {processing ? 'Mendaftarkan...' : (
                                <>Daftar & Masuk <ArrowRight className="w-4 h-4" /></>
                            )}
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
}
