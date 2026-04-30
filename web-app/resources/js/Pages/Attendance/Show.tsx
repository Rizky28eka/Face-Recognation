import { AppSidebar } from '@/Components/app-sidebar';
import { SiteHeader } from '@/Components/site-header';
import { SidebarInset, SidebarProvider } from '@/Components/ui/sidebar';
import { Head, Link } from '@inertiajs/react';
import { Card } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import {
    ArrowLeft,
    MapPin,
    Clock,
    User as UserIcon,
    Shield,
    Globe,
    Cpu,
    Calendar,
} from 'lucide-react';
import { Badge } from '@/Components/ui/badge';

interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
}

interface Attendance {
    id: number;
    user_id: number;
    user: User;
    type: string;
    confidence: number;
    image_path: string;
    latitude?: string;
    longitude?: string;
    ip_address?: string;
    network_info?: string;
    created_at: string;
    branch?: {
        id: number;
        name: string;
    };
}

interface Props {
    attendance: Attendance;
}

export default function Show({ attendance }: Props) {
    return (
        <SidebarProvider>
            <AppSidebar variant="inset" />
            <SidebarInset>
                <SiteHeader />
                <Head title={`Detail Absensi - ${attendance.user.name}`} />

                <div className="flex flex-1 flex-col pb-8">
                    <div className="flex flex-col gap-4 py-4 md:gap-8 md:py-8 px-4 lg:px-6 max-w-5xl mx-auto w-full">
                        {/* Header Section */}
                        <div className="flex items-center gap-3">
                            <Link href={route('attendance.report')}>
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
                                    Detail Absensi
                                </h1>
                                <p className="text-xs md:text-sm text-gray-500">
                                    Informasi lengkap verifikasi kehadiran.
                                </p>
                            </div>
                        </div>

                        <div className="grid gap-4 md:gap-6 md:grid-cols-3">
                            {/* Left Column: Verification Image */}
                            <div className="md:col-span-1 space-y-4 md:space-y-6">
                                <Card className="border-none shadow-sm rounded-3xl bg-white overflow-hidden">
                                    <div className="p-4 md:p-5">
                                        <p className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                                            Hasil Scan Wajah
                                        </p>
                                        <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100 group">
                                            <img
                                                src={`/storage/${attendance.image_path}`}
                                                alt="Verification Scan"
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                            />
                                            <div className="absolute inset-x-0 bottom-0 p-3 md:p-4 bg-gradient-to-t from-black/60 to-transparent">
                                                <div className="flex items-center gap-2 text-white">
                                                    <Shield className="w-3.5 h-3.5 md:w-4 md:h-4 text-emerald-400" />
                                                    <span className="text-xs md:text-sm font-bold shadow-sm">
                                                        Terverifikasi AI
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mt-4 p-3.5 bg-indigo-50 rounded-2xl border border-indigo-100/50">
                                            <div className="flex justify-between items-center mb-1.5">
                                                <span className="text-[10px] md:text-xs font-bold text-indigo-400 uppercase">
                                                    Akurasi AI
                                                </span>
                                                <span className="text-sm md:text-base font-black text-indigo-600">
                                                    {Math.round(
                                                        attendance.confidence *
                                                            100,
                                                    )}
                                                    %
                                                </span>
                                            </div>
                                            <div className="h-2 w-full bg-indigo-100 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-indigo-500 rounded-full"
                                                    style={{
                                                        width: `${attendance.confidence * 100}%`,
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </Card>

                                <Card className="border-none shadow-sm rounded-3xl bg-white p-4 md:p-5">
                                    <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                                        <UserIcon className="w-4 h-4 text-indigo-600" />
                                        Profil Karyawan
                                    </h3>
                                    <div className="flex items-center gap-3">
                                        <img
                                            src={
                                                attendance.user.avatar ||
                                                `https://ui-avatars.com/api/?name=${encodeURIComponent(attendance.user.name)}&background=6366f1&color=fff`
                                            }
                                            className="w-10 h-10 md:w-12 md:h-12 rounded-xl object-cover"
                                            alt=""
                                        />
                                        <div className="flex-1 min-w-0">
                                            <p className="font-bold text-gray-900 truncate text-sm md:text-base">
                                                {attendance.user.name}
                                            </p>
                                            <p className="text-[10px] md:text-xs text-gray-500 truncate">
                                                {attendance.user.email}
                                            </p>
                                        </div>
                                    </div>
                                    <Link
                                        href={route(
                                            'karyawan.show',
                                            attendance.user.id,
                                        )}
                                        className="block mt-4"
                                    >
                                        <Button
                                            variant="outline"
                                            className="w-full rounded-xl border-gray-200 text-xs font-semibold h-9 md:h-10 hover:bg-gray-50"
                                        >
                                            Lihat Detail Profil
                                        </Button>
                                    </Link>
                                </Card>
                            </div>

                            {/* Right Column: Detailed Info */}
                            <div className="md:col-span-2 space-y-4 md:space-y-6">
                                <Card className="border-none shadow-sm rounded-3xl bg-white p-5 md:p-8">
                                    <div className="flex items-center justify-between mb-6 md:mb-8 pb-4 md:pb-0 border-b border-gray-50 md:border-none">
                                        <h3 className="text-base md:text-lg font-bold text-gray-900">
                                            Informasi Kehadiran
                                        </h3>
                                        <Badge className="bg-emerald-50 text-emerald-600 border-none px-3 md:px-4 py-1 md:py-1.5 rounded-full capitalize font-bold text-xs md:text-sm">
                                            {attendance.type}
                                        </Badge>
                                    </div>

                                    <div className="grid gap-6 sm:grid-cols-2 md:gap-8">
                                        <div className="space-y-5 md:space-y-6">
                                            <div className="flex gap-3 md:gap-4">
                                                <div className="p-2.5 md:p-3 bg-indigo-50 rounded-2xl h-fit shrink-0">
                                                    <Calendar className="w-4 h-4 md:w-5 md:h-5 text-indigo-600" />
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">
                                                        Tanggal
                                                    </p>
                                                    <p className="text-sm md:text-lg font-bold text-gray-900 truncate">
                                                        {new Date(
                                                            attendance.created_at,
                                                        ).toLocaleDateString(
                                                            'id-ID',
                                                            {
                                                                day: 'numeric',
                                                                month: 'long',
                                                                year: 'numeric',
                                                            },
                                                        )}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex gap-3 md:gap-4">
                                                <div className="p-2.5 md:p-3 bg-indigo-50 rounded-2xl h-fit shrink-0">
                                                    <Clock className="w-4 h-4 md:w-5 md:h-5 text-indigo-600" />
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">
                                                        Waktu Presensi
                                                    </p>
                                                    <p className="text-sm md:text-lg font-bold text-gray-900 truncate">
                                                        {new Date(
                                                            attendance.created_at,
                                                        ).toLocaleTimeString(
                                                            'id-ID',
                                                            {
                                                                hour: '2-digit',
                                                                minute: '2-digit',
                                                                second: '2-digit',
                                                            },
                                                        )}{' '}
                                                        WIB
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-5 md:space-y-6">
                                            <div className="flex gap-3 md:gap-4">
                                                <div className="p-2.5 md:p-3 bg-emerald-50 rounded-2xl h-fit shrink-0">
                                                    <MapPin className="w-4 h-4 md:w-5 md:h-5 text-emerald-600" />
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">
                                                        Lokasi GPS
                                                    </p>
                                                    <p className="text-sm md:text-lg font-bold text-gray-900 truncate">
                                                        {attendance.branch
                                                            ?.name ||
                                                            'Luar Area'}
                                                    </p>
                                                    <p className="text-[10px] md:text-xs text-gray-500 mt-0.5 truncate">
                                                        {attendance.latitude
                                                            ? `${attendance.latitude}, ${attendance.longitude}`
                                                            : 'Tidak Ada Data GPS'}
                                                    </p>
                                                    {attendance.latitude && (
                                                        <a
                                                            href={`https://www.google.com/maps?q=${attendance.latitude},${attendance.longitude}`}
                                                            target="_blank"
                                                            className="text-[10px] md:text-xs text-indigo-600 font-bold hover:underline mt-1 inline-block"
                                                        >
                                                            Lihat di Google Maps
                                                        </a>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex gap-3 md:gap-4">
                                                <div className="p-2.5 md:p-3 bg-amber-50 rounded-2xl h-fit shrink-0">
                                                    <Globe className="w-4 h-4 md:w-5 md:h-5 text-amber-600" />
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">
                                                        Alamat IP
                                                    </p>
                                                    <p className="text-sm md:text-lg font-bold text-gray-900 truncate">
                                                        {attendance.ip_address ||
                                                            '-'}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-8 md:mt-10 pt-6 md:pt-8 border-t border-gray-50">
                                        <h4 className="text-xs md:text-sm font-bold text-gray-900 mb-3 md:mb-4 flex items-center gap-2">
                                            <Cpu className="w-3.5 h-3.5 md:w-4 md:h-4 text-indigo-600" />
                                            Metadata Perangkat
                                        </h4>
                                        <div className="bg-gray-50 rounded-xl md:rounded-2xl p-3 md:p-4 text-[10px] md:text-xs font-mono text-gray-500 overflow-x-auto whitespace-pre-wrap break-all">
                                            {attendance.network_info ||
                                                'Tidak ada data metadata tambahan.'}
                                        </div>
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
