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
    Home,
    Activity,
    Edit2,
    Download,
} from 'lucide-react';
import { Switch } from '@/Components/ui/switch';
import { router } from '@inertiajs/react';
import { useState } from 'react';
import { toast } from 'sonner';

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    avatar?: string;
    face_path: string | null;
    is_face_registered: boolean;
    is_wfh: boolean;
    tenant_id: number;
    created_at: string;
    branch?: { name: string };
    shift?: {
        name: string;
        color: string;
        work_type: 'wfo' | 'wfh' | 'hybrid';
    };
}

interface Attendance {
    id: number;
    type: 'check_in' | 'check_out';
    attended_at: string;
    late_minutes: number;
    image_path: string | null;
    work_type: 'wfo' | 'wfh' | 'dinas_luar';
}

interface Props {
    employee: User;
    recentAttendances?: Attendance[];
}

function workTypeBadge(type: string) {
    switch (type) {
        case 'wfh':
            return 'text-emerald-600';
        case 'hybrid':
            return 'text-violet-600';
        default:
            return 'text-blue-600';
    }
}

export default function Show({ employee, recentAttendances = [] }: Props) {
    const [isWfh, setIsWfh] = useState(employee.is_wfh);
    const [toggling, setToggling] = useState(false);

    const toggleWfh = async (checked: boolean) => {
        setToggling(true);
        try {
            await window.axios.post(route('karyawan.toggle-wfh', employee.id), {
                is_wfh: checked,
            });
            setIsWfh(checked);
            toast.success(
                checked ? 'Izin WFH diaktifkan.' : 'Izin WFH dinonaktifkan.',
            );
        } catch {
            toast.error('Gagal memperbarui status WFH.');
            setIsWfh(!checked);
        } finally {
            setToggling(false);
        }
    };

    return (
        <SidebarProvider>
            <AppSidebar variant="inset" />
            <SidebarInset>
                <SiteHeader />
                <Head title={`Profil ${employee.name}`} />

                <div className="flex flex-1 flex-col pb-8">
                    <div className="flex flex-col gap-4 py-4 md:gap-8 md:py-8 px-4 lg:px-6">
                        {/* ── Header ── */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 max-w-5xl mx-auto w-full">
                            <div className="flex items-center gap-3">
                                <Link href={route('karyawan.index')}>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="rounded-full bg-white shadow-sm hover:bg-gray-50 h-9 w-9 md:h-11 md:w-11 shrink-0"
                                    >
                                        <ArrowLeft className="w-4 h-4 text-gray-600" />
                                    </Button>
                                </Link>
                                <div className="min-w-0">
                                    <h1 className="text-xl md:text-3xl font-bold tracking-tight text-gray-900 truncate">
                                        Detail Karyawan
                                    </h1>
                                    <p className="text-xs md:text-sm text-gray-500">
                                        Informasi lengkap profil karyawan.
                                    </p>
                                </div>
                            </div>

                            <a
                                href={route('karyawan.download', employee.id)}
                                target="_blank"
                            >
                                <Button className="h-10 rounded-xl bg-white text-indigo-600 border-2 border-indigo-100 hover:bg-indigo-50 font-bold shadow-sm gap-2">
                                    <Download className="w-4 h-4" />
                                    Download PDF
                                </Button>
                            </a>
                        </div>

                        {/* ── Profile Grid ── */}
                        <div className="grid gap-4 md:grid-cols-3 max-w-5xl mx-auto w-full">
                            {/* Left: Profile Card */}
                            <Card className="md:col-span-1 border-none shadow-sm rounded-3xl bg-white overflow-hidden">
                                <div className="h-24 md:h-32 bg-gradient-to-br from-indigo-500 to-purple-600" />
                                <div className="px-5 pb-6 text-center -mt-12">
                                    <div className="relative inline-block">
                                        <img
                                            src={
                                                employee.face_path
                                                    ? `/storage/${employee.face_path}`
                                                    : `https://ui-avatars.com/api/?name=${encodeURIComponent(employee.name)}&background=fff&color=6366f1&size=128&bold=true`
                                            }
                                            alt={employee.name}
                                            className="w-24 h-24 md:w-32 md:h-32 rounded-3xl object-cover border-4 border-white shadow-xl mx-auto bg-white"
                                            onError={(e) => {
                                                e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(employee.name)}&background=fff&color=6366f1&size=128&bold=true`;
                                            }}
                                        />
                                        <div
                                            className={`absolute bottom-1 right-1 w-5 h-5 border-4 border-white rounded-full ${
                                                employee.is_face_registered
                                                    ? 'bg-emerald-500'
                                                    : 'bg-amber-400'
                                            }`}
                                        />
                                    </div>
                                    <h2 className="mt-3 text-xl font-bold text-gray-900">
                                        {employee.name}
                                    </h2>
                                    <p className="text-indigo-600 font-semibold capitalize text-sm">
                                        {employee.role}
                                    </p>
                                    <div
                                        className={`mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
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

                                <div className="px-5 pb-6 space-y-2">
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
                                                    className={`text-xs font-semibold ${workTypeBadge(employee.shift.work_type)}`}
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
                                        <Button className="w-full h-10 rounded-xl bg-indigo-600 hover:bg-indigo-700 font-bold shadow-md shadow-indigo-100 mt-1 gap-2">
                                            <Edit2 className="w-4 h-4" />
                                            Edit Profil
                                        </Button>
                                    </Link>

                                    {/* WFH Toggle */}
                                    <div className="mt-2 p-3.5 rounded-2xl border-2 border-indigo-50 bg-indigo-50/50 flex items-center justify-between gap-3">
                                        <div className="flex items-center gap-2.5">
                                            <div
                                                className={`p-2 rounded-xl ${isWfh ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-500'}`}
                                            >
                                                <Home className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-gray-900">
                                                    Izin WFH
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    Bypass radius
                                                </p>
                                            </div>
                                        </div>
                                        <Switch
                                            checked={isWfh}
                                            onCheckedChange={toggleWfh}
                                            disabled={toggling}
                                            className={
                                                isWfh
                                                    ? 'bg-emerald-500'
                                                    : 'bg-gray-200'
                                            }
                                        />
                                    </div>
                                </div>
                            </Card>

                            {/* Right: Info & Activity */}
                            <div className="md:col-span-2 space-y-4">
                                {/* Personal Info */}
                                <Card className="border-none shadow-sm rounded-3xl bg-white p-5 md:p-8">
                                    <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                                        <UserIcon className="w-4 h-4 text-indigo-600" />
                                        Informasi Personal
                                    </h3>
                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                        <div className="space-y-1">
                                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                                                Email
                                            </p>
                                            <div className="flex items-center gap-2 text-gray-700 font-medium text-sm">
                                                <Mail className="w-4 h-4 text-gray-400 shrink-0" />
                                                <span className="truncate">
                                                    {employee.email}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                                                Tanggal Bergabung
                                            </p>
                                            <div className="flex items-center gap-2 text-gray-700 font-medium text-sm">
                                                <Calendar className="w-4 h-4 text-gray-400 shrink-0" />
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
                                            <div className="flex items-center gap-2 text-gray-700 font-medium text-sm">
                                                <Shield className="w-4 h-4 text-gray-400 shrink-0" />
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
                                            <div className="flex items-center gap-2 text-gray-700 font-medium text-sm">
                                                <Building className="w-4 h-4 text-gray-400 shrink-0" />
                                                Tenant ID #{employee.tenant_id}
                                            </div>
                                        </div>
                                    </div>
                                </Card>

                                {/* Recent Activity */}
                                <Card className="border-none shadow-sm rounded-3xl bg-white p-5 md:p-8">
                                    <h3 className="text-base font-bold text-gray-900 mb-4">
                                        Aktivitas Terakhir
                                    </h3>

                                    {recentAttendances.length === 0 ? (
                                        <div className="py-8 text-center border-2 border-dashed border-gray-100 rounded-2xl">
                                            <p className="text-sm text-gray-400">
                                                Belum ada riwayat aktivitas
                                                terbaru.
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            {recentAttendances.map((attn) => (
                                                <div
                                                    key={attn.id}
                                                    className="flex items-center gap-3 p-3.5 border border-gray-100 rounded-2xl hover:bg-gray-50/50 transition-colors"
                                                >
                                                    <div
                                                        className={`p-2 rounded-xl shrink-0 ${
                                                            attn.type ===
                                                            'check_in'
                                                                ? 'bg-emerald-100 text-emerald-600'
                                                                : 'bg-rose-100 text-rose-600'
                                                        }`}
                                                    >
                                                        <Activity className="w-4 h-4" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-bold text-gray-900 flex flex-wrap items-center gap-1.5">
                                                            {attn.type ===
                                                            'check_in'
                                                                ? 'Absen Masuk'
                                                                : 'Absen Pulang'}
                                                            <span
                                                                className={`text-[10px] uppercase px-2 py-0.5 rounded-full font-bold tracking-wider ${
                                                                    attn.late_minutes >
                                                                    0
                                                                        ? 'bg-rose-100 text-rose-700'
                                                                        : 'bg-emerald-100 text-emerald-700'
                                                                }`}
                                                            >
                                                                {attn.late_minutes >
                                                                0
                                                                    ? 'TERLAMBAT'
                                                                    : 'TEPAT WAKTU'}
                                                            </span>
                                                        </p>
                                                        <p className="text-xs text-gray-500 mt-0.5 truncate">
                                                            {new Date(
                                                                attn.attended_at ||
                                                                    '',
                                                            ).toLocaleString(
                                                                'id-ID',
                                                                {
                                                                    weekday:
                                                                        'long',
                                                                    year: 'numeric',
                                                                    month: 'long',
                                                                    day: 'numeric',
                                                                    hour: '2-digit',
                                                                    minute: '2-digit',
                                                                },
                                                            )}{' '}
                                                            •{' '}
                                                            {(
                                                                attn.work_type ||
                                                                ''
                                                            ).toUpperCase()}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </Card>
                            </div>
                        </div>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
