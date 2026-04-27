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
                    <div className="flex flex-col gap-6 py-4 md:gap-8 md:py-8 px-4 lg:px-6 max-w-5xl mx-auto w-full">
                        {/* Header Section */}
                        <div className="flex items-center gap-4">
                            <Link href={route('attendance.report')}>
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
                                    Detail Absensi
                                </h1>
                                <p className="text-sm md:text-base text-gray-500">
                                    Informasi lengkap verifikasi kehadiran.
                                </p>
                            </div>
                        </div>

                        <div className="grid gap-6 md:grid-cols-3">
                            {/* Left Column: Verification Image */}
                            <div className="md:col-span-1 space-y-6">
                                <Card className="border-none shadow-sm rounded-3xl bg-white overflow-hidden">
                                    <div className="p-4">
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                                            Hasil Scan Wajah
                                        </p>
                                        <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100 group">
                                            <img
                                                src={`/storage/${attendance.image_path}`}
                                                alt="Verification Scan"
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                            />
                                            <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
                                                <div className="flex items-center gap-2 text-white">
                                                    <Shield className="w-4 h-4 text-emerald-400" />
                                                    <span className="text-sm font-bold">
                                                        Terverifikasi AI
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mt-4 p-4 bg-indigo-50 rounded-2xl border border-indigo-100/50">
                                            <div className="flex justify-between items-center mb-1">
                                                <span className="text-xs font-bold text-indigo-400 uppercase">
                                                    Akurasi AI
                                                </span>
                                                <span className="text-sm font-black text-indigo-600">
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

                                <Card className="border-none shadow-sm rounded-3xl bg-white p-6">
                                    <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                                        <UserIcon className="w-4 h-4 text-indigo-600" />
                                        Profil Karyawan
                                    </h3>
                                    <div className="flex items-center gap-4">
                                        <img
                                            src={
                                                attendance.user.avatar ||
                                                `https://ui-avatars.com/api/?name=${encodeURIComponent(attendance.user.name)}&background=6366f1&color=fff`
                                            }
                                            className="w-12 h-12 rounded-xl"
                                            alt=""
                                        />
                                        <div className="flex-1 min-w-0">
                                            <p className="font-bold text-gray-900 truncate">
                                                {attendance.user.name}
                                            </p>
                                            <p className="text-xs text-gray-500 truncate">
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
                                            className="w-full rounded-xl border-gray-100 text-xs h-9"
                                        >
                                            Lihat Detail Profil
                                        </Button>
                                    </Link>
                                </Card>
                            </div>

                            {/* Right Column: Detailed Info */}
                            <div className="md:col-span-2 space-y-6">
                                <Card className="border-none shadow-sm rounded-3xl bg-white p-6 md:p-8">
                                    <div className="flex items-center justify-between mb-8">
                                        <h3 className="text-lg font-bold text-gray-900">
                                            Informasi Kehadiran
                                        </h3>
                                        <Badge className="bg-emerald-50 text-emerald-600 border-none px-4 py-1.5 rounded-full capitalize font-bold">
                                            {attendance.type}
                                        </Badge>
                                    </div>

                                    <div className="grid gap-8 md:grid-cols-2">
                                        <div className="space-y-6">
                                            <div className="flex gap-4">
                                                <div className="p-3 bg-indigo-50 rounded-2xl h-fit">
                                                    <Calendar className="w-5 h-5 text-indigo-600" />
                                                </div>
                                                <div>
                                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                                                        Tanggal
                                                    </p>
                                                    <p className="text-lg font-bold text-gray-900">
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

                                            <div className="flex gap-4">
                                                <div className="p-3 bg-indigo-50 rounded-2xl h-fit">
                                                    <Clock className="w-5 h-5 text-indigo-600" />
                                                </div>
                                                <div>
                                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                                                        Waktu Presensi
                                                    </p>
                                                    <p className="text-lg font-bold text-gray-900">
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

                                        <div className="space-y-6">
                                            <div className="flex gap-4">
                                                <div className="p-3 bg-emerald-50 rounded-2xl h-fit">
                                                    <MapPin className="w-5 h-5 text-emerald-600" />
                                                </div>
                                                <div>
                                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                                                        Lokasi GPS
                                                    </p>
                                                    <p className="text-lg font-bold text-gray-900">
                                                        {attendance.branch
                                                            ?.name ||
                                                            'Luar Area'}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        {attendance.latitude
                                                            ? `${attendance.latitude}, ${attendance.longitude}`
                                                            : 'Tidak Ada Data GPS'}
                                                    </p>
                                                    {attendance.latitude && (
                                                        <a
                                                            href={`https://www.google.com/maps?q=${attendance.latitude},${attendance.longitude}`}
                                                            target="_blank"
                                                            className="text-xs text-indigo-600 font-semibold hover:underline"
                                                        >
                                                            Lihat di Google Maps
                                                        </a>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex gap-4">
                                                <div className="p-3 bg-amber-50 rounded-2xl h-fit">
                                                    <Globe className="w-5 h-5 text-amber-600" />
                                                </div>
                                                <div>
                                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                                                        Alamat IP
                                                    </p>
                                                    <p className="text-lg font-bold text-gray-900">
                                                        {attendance.ip_address ||
                                                            '-'}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-10 pt-8 border-t border-gray-50">
                                        <h4 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                                            <Cpu className="w-4 h-4 text-indigo-600" />
                                            Metadata Perangkat
                                        </h4>
                                        <div className="bg-gray-50 rounded-2xl p-4 text-xs font-mono text-gray-500 overflow-x-auto">
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
