import { AppSidebar } from '@/Components/app-sidebar';
import { SiteHeader } from '@/Components/site-header';
import { SidebarInset, SidebarProvider } from '@/Components/ui/sidebar';
import { Head, Link } from '@inertiajs/react';
import { Card } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import {
    ArrowLeft,
    Mail,
    Calendar,
    Building,
    Shield,
    User as UserIcon,
    CheckCircle2,
    XCircle,
} from 'lucide-react';

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    avatar?: string;
    face_path: string | null;
    is_face_registered: boolean;
    tenant_id: number;
    created_at: string;
    branch?: { name: string };
    shift?: {
        name: string;
        color: string;
        work_type: 'wfo' | 'wfh' | 'hybrid';
    };
}

interface Props {
    employee: User;
}

export default function Show({ employee }: Props) {
    return (
        <SidebarProvider>
            <AppSidebar variant="inset" />
            <SidebarInset>
                <SiteHeader />
                <Head title={`Profil ${employee.name}`} />

                <div className="flex flex-1 flex-col pb-8">
                    <div className="flex flex-col gap-6 py-4 md:gap-8 md:py-8 px-4 lg:px-6">
                        {/* Header Section */}
                        <div className="flex items-center gap-4 max-w-5xl mx-auto w-full">
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
                                    Detail Karyawan
                                </h1>
                                <p className="text-sm md:text-base text-gray-500">
                                    Informasi lengkap profil karyawan.
                                </p>
                            </div>
                        </div>

                        {/* Profile Section */}
                        <div className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto w-full">
                            <Card className="md:col-span-1 border-none shadow-sm rounded-3xl bg-white overflow-hidden">
                                <div className="h-32 bg-gradient-to-br from-indigo-500 to-purple-600" />
                                <div className="px-6 pb-8 text-center -mt-16">
                                    <div className="relative inline-block">
                                        <img
                                            src={
                                                employee.face_path
                                                    ? `/storage/${employee.face_path}`
                                                    : `https://ui-avatars.com/api/?name=${encodeURIComponent(employee.name)}&background=fff&color=6366f1&size=128&bold=true`
                                            }
                                            alt={employee.name}
                                            className="w-32 h-32 rounded-3xl object-cover border-4 border-white shadow-xl mx-auto bg-white"
                                            onError={(e) => {
                                                e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(employee.name)}&background=fff&color=6366f1&size=128&bold=true`;
                                            }}
                                        />
                                        {/* Status wajah */}
                                        <div
                                            className={`absolute bottom-2 right-2 w-6 h-6 border-4 border-white rounded-full flex items-center justify-center ${
                                                employee.is_face_registered
                                                    ? 'bg-emerald-500'
                                                    : 'bg-amber-400'
                                            }`}
                                        />
                                    </div>
                                    <h2 className="mt-4 text-2xl font-bold text-gray-900">
                                        {employee.name}
                                    </h2>
                                    <p className="text-indigo-600 font-semibold capitalize">
                                        {employee.role}
                                    </p>
                                    {/* Badge status wajah */}
                                    <div
                                        className={`mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                                            employee.is_face_registered
                                                ? 'bg-emerald-50 text-emerald-700'
                                                : 'bg-amber-50 text-amber-700'
                                        }`}
                                    >
                                        {employee.is_face_registered ? (
                                            <>
                                                <CheckCircle2 className="w-3.5 h-3.5" />{' '}
                                                Wajah Terdaftar
                                            </>
                                        ) : (
                                            <>
                                                <XCircle className="w-3.5 h-3.5" />{' '}
                                                Belum Daftar Wajah
                                            </>
                                        )}
                                    </div>
                                </div>
                                <div className="px-6 pb-6 space-y-3">
                                    {employee.shift && (
                                        <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50">
                                            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                                                Shift
                                            </span>
                                            <div className="text-right">
                                                <span
                                                    className="text-sm font-bold block"
                                                    style={{
                                                        color: employee.shift
                                                            .color,
                                                    }}
                                                >
                                                    {employee.shift.name}
                                                </span>
                                                <span
                                                    className={`text-xs font-semibold ${
                                                        employee.shift
                                                            .work_type === 'wfh'
                                                            ? 'text-emerald-600'
                                                            : employee.shift
                                                                    .work_type ===
                                                                'hybrid'
                                                              ? 'text-violet-600'
                                                              : 'text-blue-600'
                                                    }`}
                                                >
                                                    {employee.shift.work_type.toUpperCase()}
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                    {employee.branch && (
                                        <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50">
                                            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                                                Cabang
                                            </span>
                                            <span className="text-sm font-bold text-gray-700">
                                                {employee.branch.name}
                                            </span>
                                        </div>
                                    )}
                                    <Link
                                        href={route(
                                            'karyawan.edit',
                                            employee.id,
                                        )}
                                    >
                                        <Button className="w-full h-11 rounded-xl bg-indigo-600 hover:bg-indigo-700 font-bold shadow-lg shadow-indigo-100 mt-2">
                                            Edit Profil
                                        </Button>
                                    </Link>
                                </div>
                            </Card>

                            <div className="md:col-span-2 space-y-6">
                                <Card className="border-none shadow-sm rounded-3xl bg-white p-6 md:p-8">
                                    <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                                        <UserIcon className="w-5 h-5 text-indigo-600" />
                                        Informasi Personal
                                    </h3>
                                    <div className="grid gap-6 md:grid-cols-2">
                                        <div className="space-y-1">
                                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                                                Email
                                            </p>
                                            <div className="flex items-center gap-2 text-gray-700 font-medium">
                                                <Mail className="w-4 h-4 text-gray-400" />
                                                {employee.email}
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                                                Tanggal Bergabung
                                            </p>
                                            <div className="flex items-center gap-2 text-gray-700 font-medium">
                                                <Calendar className="w-4 h-4 text-gray-400" />
                                                {new Date(
                                                    employee.created_at,
                                                ).toLocaleDateString('id-ID', {
                                                    day: 'numeric',
                                                    month: 'long',
                                                    year: 'numeric',
                                                })}
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                                                ID Karyawan
                                            </p>
                                            <div className="flex items-center gap-2 text-gray-700 font-medium">
                                                <Shield className="w-4 h-4 text-gray-400" />
                                                #
                                                {employee.id
                                                    .toString()
                                                    .padStart(5, '0')}
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                                                Perusahaan
                                            </p>
                                            <div className="flex items-center gap-2 text-gray-700 font-medium">
                                                <Building className="w-4 h-4 text-gray-400" />
                                                Tenant ID #{employee.tenant_id}
                                            </div>
                                        </div>
                                    </div>
                                </Card>

                                <Card className="border-none shadow-sm rounded-3xl bg-white p-8">
                                    <h3 className="text-lg font-bold text-gray-900 mb-4">
                                        Aktivitas Terakhir
                                    </h3>
                                    <div className="py-8 text-center border-2 border-dashed border-gray-50 rounded-2xl">
                                        <p className="text-gray-400">
                                            Belum ada riwayat aktivitas terbaru.
                                        </p>
                                    </div>
                                </Card>
                            </div>
                        </div>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
