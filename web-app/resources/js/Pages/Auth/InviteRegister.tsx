import React from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import { Card } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { User, Mail, Lock, Clock, MapPin, CheckCircle2 } from 'lucide-react';
import InputError from '@/Components/InputError';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/Components/ui/select';

export default function InviteRegister({
    tenant,
    branches,
    shifts,
}: {
    tenant: { name: string; id: number; registration_token: string };
    branches: { id: number; name: string }[];
    shifts: {
        id: number;
        name: string;
        start_time: string;
        end_time: string;
    }[];
}) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        branch_id: '',
        shift_id: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('invite.store', tenant.registration_token), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <Head title={`Join ${tenant.name}`} />

            <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-600 text-white shadow-xl shadow-indigo-200 mb-6">
                    <User className="w-8 h-8" />
                </div>
                <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                    Bergabung dengan {tenant.name}
                </h2>
                <p className="mt-2 text-sm text-gray-600">
                    Lengkapi data diri Anda untuk mulai menggunakan FaceLog.
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl">
                <Card className="border-none shadow-2xl rounded-3xl bg-white overflow-hidden">
                    <div className="p-8 sm:p-10">
                        <form onSubmit={submit} className="space-y-6">
                            <div className="space-y-2">
                                <Label
                                    htmlFor="name"
                                    className="text-sm font-semibold text-gray-700"
                                >
                                    Nama Lengkap
                                </Label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <Input
                                        id="name"
                                        value={data.name}
                                        onChange={(e) =>
                                            setData('name', e.target.value)
                                        }
                                        placeholder="Masukkan nama lengkap"
                                        className="h-12 border-gray-100 bg-gray-50/50 pl-10 focus:ring-indigo-500 rounded-xl"
                                        required
                                    />
                                </div>
                                <InputError message={errors.name} />
                            </div>

                            <div className="space-y-2">
                                <Label
                                    htmlFor="email"
                                    className="text-sm font-semibold text-gray-700"
                                >
                                    Alamat Email
                                </Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <Input
                                        id="email"
                                        type="email"
                                        value={data.email}
                                        onChange={(e) =>
                                            setData('email', e.target.value)
                                        }
                                        placeholder="email@perusahaan.com"
                                        className="h-12 border-gray-100 bg-gray-50/50 pl-10 focus:ring-indigo-500 rounded-xl"
                                        required
                                    />
                                </div>
                                <InputError message={errors.email} />
                            </div>

                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label
                                        htmlFor="branch_id"
                                        className="text-sm font-semibold text-gray-700"
                                    >
                                        Lokasi Cabang
                                    </Label>
                                    <Select
                                        value={data.branch_id}
                                        onValueChange={(val) =>
                                            setData('branch_id', val)
                                        }
                                    >
                                        <SelectTrigger className="h-12 border-gray-100 bg-gray-50/50 rounded-xl">
                                            <div className="flex items-center gap-2">
                                                <MapPin className="w-4 h-4 text-gray-400" />
                                                <SelectValue placeholder="Pilih cabang" />
                                            </div>
                                        </SelectTrigger>
                                        <SelectContent>
                                            {branches.map((branch) => (
                                                <SelectItem
                                                    key={branch.id}
                                                    value={branch.id.toString()}
                                                >
                                                    {branch.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.branch_id} />
                                </div>

                                <div className="space-y-2">
                                    <Label
                                        htmlFor="shift_id"
                                        className="text-sm font-semibold text-gray-700"
                                    >
                                        Shift Kerja
                                    </Label>
                                    <Select
                                        value={data.shift_id}
                                        onValueChange={(val) =>
                                            setData('shift_id', val)
                                        }
                                    >
                                        <SelectTrigger className="h-12 border-gray-100 bg-gray-50/50 rounded-xl">
                                            <div className="flex items-center gap-2">
                                                <Clock className="w-4 h-4 text-gray-400" />
                                                <SelectValue placeholder="Pilih shift" />
                                            </div>
                                        </SelectTrigger>
                                        <SelectContent>
                                            {shifts.map((shift) => (
                                                <SelectItem
                                                    key={shift.id}
                                                    value={shift.id.toString()}
                                                >
                                                    {shift.name} (
                                                    {shift.start_time.substring(
                                                        0,
                                                        5,
                                                    )}{' '}
                                                    -{' '}
                                                    {shift.end_time.substring(
                                                        0,
                                                        5,
                                                    )}
                                                    )
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.shift_id} />
                                </div>
                            </div>

                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label
                                        htmlFor="password"
                                        className="text-sm font-semibold text-gray-700"
                                    >
                                        Password
                                    </Label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <Input
                                            id="password"
                                            type="password"
                                            value={data.password}
                                            onChange={(e) =>
                                                setData(
                                                    'password',
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="••••••••"
                                            className="h-12 border-gray-100 bg-gray-50/50 pl-10 focus:ring-indigo-500 rounded-xl"
                                            required
                                        />
                                    </div>
                                    <InputError message={errors.password} />
                                </div>

                                <div className="space-y-2">
                                    <Label
                                        htmlFor="password_confirmation"
                                        className="text-sm font-semibold text-gray-700"
                                    >
                                        Konfirmasi Password
                                    </Label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <Input
                                            id="password_confirmation"
                                            type="password"
                                            value={data.password_confirmation}
                                            onChange={(e) =>
                                                setData(
                                                    'password_confirmation',
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="••••••••"
                                            className="h-12 border-gray-100 bg-gray-50/50 pl-10 focus:ring-indigo-500 rounded-xl"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4">
                                <Button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full h-14 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold text-lg shadow-lg shadow-indigo-100 transition-all flex items-center justify-center gap-2"
                                >
                                    <CheckCircle2 className="w-6 h-6" />
                                    Daftar Sekarang
                                </Button>
                            </div>
                        </form>

                        <div className="mt-8 pt-8 border-t border-gray-50 text-center">
                            <p className="text-sm text-gray-500">
                                Sudah punya akun?{' '}
                                <Link
                                    href={route('login')}
                                    className="font-bold text-indigo-600 hover:text-indigo-500"
                                >
                                    Masuk di sini
                                </Link>
                            </p>
                        </div>
                    </div>
                </Card>
            </div>

            <div className="mt-8 text-center text-xs text-gray-400 uppercase tracking-widest font-bold">
                FaceLog &copy; {new Date().getFullYear()} Bilcode Digital
                Solutions
            </div>
        </div>
    );
}
