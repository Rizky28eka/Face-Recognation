import { AppSidebar } from '@/Components/app-sidebar';
import { SiteHeader } from '@/Components/site-header';
import { SidebarInset, SidebarProvider } from '@/Components/ui/sidebar';
import { Head, useForm, Link } from '@inertiajs/react';
import { Card } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { ArrowLeft, Mail, Lock, User, Clock, Save, MapPin } from 'lucide-react';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import InputError from '@/Components/InputError';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/Components/ui/select';

interface Shift {
    id: number;
    name: string;
    start_time: string;
    end_time: string;
}

interface Branch {
    id: number;
    name: string;
}

interface Employee {
    id: number;
    name: string;
    email: string;
    shift_id: number | null;
    branch_id: number | null;
}

export default function Edit({
    employee,
    shifts,
    branches,
}: {
    employee: Employee;
    shifts: Shift[];
    branches: Branch[];
}) {
    const { data, setData, patch, processing, errors } = useForm({
        name: employee.name,
        email: employee.email,
        password: '',
        password_confirmation: '',
        shift_id: employee.shift_id?.toString() || '',
        branch_id: employee.branch_id?.toString() || '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        patch(route('karyawan.update', employee.id));
    };

    return (
        <SidebarProvider>
            <AppSidebar variant="inset" />
            <SidebarInset>
                <SiteHeader />
                <Head title={`Edit Karyawan: ${employee.name}`} />

                <div className="flex flex-1 flex-col pb-8">
                    <div className="flex flex-col gap-4 py-4 md:gap-8 md:py-8 px-4 lg:px-6">
                        {/* ── Header ── */}
                        <div className="flex items-center gap-3 max-w-2xl mx-auto w-full">
                            <Link href={route('karyawan.index')}>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="rounded-full bg-white shadow-sm hover:bg-gray-50 h-9 w-9 md:h-11 md:w-11 shrink-0"
                                >
                                    <ArrowLeft className="w-4 h-4 text-gray-600" />
                                </Button>
                            </Link>
                            <div>
                                <h1 className="text-xl md:text-3xl font-bold tracking-tight text-gray-900">
                                    Edit Karyawan
                                </h1>
                                <p className="text-xs md:text-sm text-gray-500">
                                    Perbarui data karyawan atau penugasan shift.
                                </p>
                            </div>
                        </div>

                        {/* ── Form ── */}
                        <div className="max-w-2xl mx-auto w-full">
                            <Card className="border-none shadow-sm rounded-2xl bg-white p-5 md:p-8">
                                <form onSubmit={submit} className="space-y-5">
                                    {/* Nama */}
                                    <div className="space-y-1.5">
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
                                                    setData(
                                                        'name',
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="Masukkan nama lengkap"
                                                className="h-11 border-gray-100 bg-gray-50/50 pl-10 focus:ring-indigo-500 rounded-xl"
                                                required
                                            />
                                        </div>
                                        <InputError message={errors.name} />
                                    </div>

                                    {/* Email */}
                                    <div className="space-y-1.5">
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
                                                    setData(
                                                        'email',
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="email@perusahaan.com"
                                                className="h-11 border-gray-100 bg-gray-50/50 pl-10 focus:ring-indigo-500 rounded-xl"
                                                required
                                            />
                                        </div>
                                        <InputError message={errors.email} />
                                    </div>

                                    {/* Shift & Branch — stacked on mobile, 2-col on md */}
                                    <div className="grid gap-4 md:grid-cols-2">
                                        <div className="space-y-1.5">
                                            <Label
                                                htmlFor="shift_id"
                                                className="text-sm font-semibold text-gray-700"
                                            >
                                                Penugasan Shift
                                            </Label>
                                            <Select
                                                value={data.shift_id}
                                                onValueChange={(val) =>
                                                    setData('shift_id', val)
                                                }
                                            >
                                                <SelectTrigger className="h-11 border-gray-100 bg-gray-50/50 rounded-xl">
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
                                                            )}
                                                            )
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <InputError
                                                message={errors.shift_id}
                                            />
                                        </div>

                                        <div className="space-y-1.5">
                                            <Label
                                                htmlFor="branch_id"
                                                className="text-sm font-semibold text-gray-700"
                                            >
                                                Penugasan Cabang
                                            </Label>
                                            <Select
                                                value={data.branch_id}
                                                onValueChange={(val) =>
                                                    setData('branch_id', val)
                                                }
                                            >
                                                <SelectTrigger className="h-11 border-gray-100 bg-gray-50/50 rounded-xl">
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
                                            <InputError
                                                message={errors.branch_id}
                                            />
                                        </div>
                                    </div>

                                    {/* Password Section */}
                                    <div className="pt-4 border-t border-gray-100">
                                        <h3 className="text-sm font-bold text-gray-900 mb-3">
                                            Ganti Password{' '}
                                            <span className="font-normal text-gray-400">
                                                (Opsional)
                                            </span>
                                        </h3>
                                        <div className="grid gap-4 md:grid-cols-2">
                                            <div className="space-y-1.5">
                                                <Label
                                                    htmlFor="password"
                                                    className="text-sm font-semibold text-gray-700"
                                                >
                                                    Password Baru
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
                                                        className="h-11 border-gray-100 bg-gray-50/50 pl-10 focus:ring-indigo-500 rounded-xl"
                                                    />
                                                </div>
                                                <InputError
                                                    message={errors.password}
                                                />
                                            </div>

                                            <div className="space-y-1.5">
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
                                                        value={
                                                            data.password_confirmation
                                                        }
                                                        onChange={(e) =>
                                                            setData(
                                                                'password_confirmation',
                                                                e.target.value,
                                                            )
                                                        }
                                                        placeholder="••••••••"
                                                        className="h-11 border-gray-100 bg-gray-50/50 pl-10 focus:ring-indigo-500 rounded-xl"
                                                    />
                                                </div>
                                                <InputError
                                                    message={
                                                        errors.password_confirmation
                                                    }
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Submit Buttons */}
                                    <div className="flex flex-col gap-3 pt-2 sm:flex-row">
                                        <Button
                                            type="submit"
                                            disabled={processing}
                                            className="h-11 flex-1 rounded-xl bg-indigo-600 font-bold shadow-md shadow-indigo-100 hover:bg-indigo-700 gap-2"
                                        >
                                            <Save className="w-4 h-4" />
                                            Simpan Perubahan
                                        </Button>
                                        <Link
                                            href={route('karyawan.index')}
                                            className="flex-1"
                                        >
                                            <Button
                                                variant="outline"
                                                className="h-11 w-full rounded-xl border-gray-200 font-semibold text-gray-600"
                                            >
                                                Batalkan
                                            </Button>
                                        </Link>
                                    </div>
                                </form>
                            </Card>
                        </div>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
