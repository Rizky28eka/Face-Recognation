import { AppSidebar } from '@/Components/app-sidebar';
import { SiteHeader } from '@/Components/site-header';
import { SidebarInset, SidebarProvider } from '@/Components/ui/sidebar';
import { Head, useForm, Link } from '@inertiajs/react';
import { Card } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import {
    ArrowLeft,
    UserPlus,
    Mail,
    Lock,
    User,
    Clock,
    Save,
    MapPin,
} from 'lucide-react';
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
                    <div className="flex flex-col gap-6 py-4 md:gap-8 md:py-8 px-4 lg:px-6">
                        {/* Header Section */}
                        <div className="flex items-center gap-4 max-w-2xl mx-auto w-full">
                            <Link href={route('karyawan.index')}>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="rounded-full bg-white shadow-sm hover:bg-gray-50 h-10 w-10 md:h-12 md:w-12"
                                >
                                    <ArrowLeft className="w-5 h-5 text-gray-600" />
                                </Button>
                            </Link>
                            <div>
                                <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900">
                                    Edit Karyawan
                                </h1>
                                <p className="text-sm md:text-base text-gray-500">
                                    Perbarui data karyawan atau penugasan shift.
                                </p>
                            </div>
                        </div>

                        {/* Form Section */}
                        <div className="max-w-2xl mx-auto w-full">
                            <Card className="border-none shadow-sm rounded-2xl bg-white p-6 md:p-8">
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
                                                    setData(
                                                        'name',
                                                        e.target.value,
                                                    )
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
                                                    setData(
                                                        'email',
                                                        e.target.value,
                                                    )
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
                                                htmlFor="shift_id"
                                                className="text-sm font-semibold text-gray-700"
                                            >
                                                Penugasan Shift
                                            </Label>
                                            <div className="relative">
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
                                                                )}
                                                                )
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <InputError
                                                message={errors.shift_id}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label
                                                htmlFor="branch_id"
                                                className="text-sm font-semibold text-gray-700"
                                            >
                                                Penugasan Cabang
                                            </Label>
                                            <div className="relative">
                                                <Select
                                                    value={data.branch_id}
                                                    onValueChange={(val) =>
                                                        setData(
                                                            'branch_id',
                                                            val,
                                                        )
                                                    }
                                                >
                                                    <SelectTrigger className="h-12 border-gray-100 bg-gray-50/50 rounded-xl">
                                                        <div className="flex items-center gap-2">
                                                            <MapPin className="w-4 h-4 text-gray-400" />
                                                            <SelectValue placeholder="Pilih cabang" />
                                                        </div>
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {branches.map(
                                                            (branch) => (
                                                                <SelectItem
                                                                    key={
                                                                        branch.id
                                                                    }
                                                                    value={branch.id.toString()}
                                                                >
                                                                    {
                                                                        branch.name
                                                                    }
                                                                </SelectItem>
                                                            ),
                                                        )}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <InputError
                                                message={errors.branch_id}
                                            />
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t border-gray-50">
                                        <h3 className="text-sm font-bold text-gray-900 mb-4">
                                            Ganti Password (Opsional)
                                        </h3>
                                        <div className="grid gap-6 md:grid-cols-2">
                                            <div className="space-y-2">
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
                                                        className="h-12 border-gray-100 bg-gray-50/50 pl-10 focus:ring-indigo-500 rounded-xl"
                                                    />
                                                </div>
                                                <InputError
                                                    message={errors.password}
                                                />
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
                                                        className="h-12 border-gray-100 bg-gray-50/50 pl-10 focus:ring-indigo-500 rounded-xl"
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

                                    <div className="flex flex-col gap-4 pt-4 md:flex-row">
                                        <Button
                                            type="submit"
                                            disabled={processing}
                                            className="h-12 flex-1 rounded-xl bg-indigo-600 text-lg font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700"
                                        >
                                            <Save className="mr-2 w-5 h-5" />
                                            Simpan Perubahan
                                        </Button>
                                        <Link
                                            href={route('karyawan.index')}
                                            className="flex-1"
                                        >
                                            <Button
                                                variant="outline"
                                                className="h-12 w-full rounded-xl border-gray-200 text-lg font-semibold text-gray-600"
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
