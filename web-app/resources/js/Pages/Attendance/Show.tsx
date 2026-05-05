import { AppSidebar } from '@/Components/app-sidebar';
import { SiteHeader } from '@/Components/site-header';
import { SidebarInset, SidebarProvider } from '@/Components/ui/sidebar';
import { Head, Link } from '@inertiajs/react';
import { Card } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/Components/ui/dropdown-menu';
import {
    ArrowLeft,
    FileDown,
    MapPin,
    Clock,
    User as UserIcon,
    Shield,
    Globe,
    Cpu,
    Calendar,
    Scan,
    ChevronDown,
    Image as ImageIcon,
} from 'lucide-react';
import { Badge } from '@/Components/ui/badge';
import { useState } from 'react';

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
    bbox: number[] | null;
    accuracy?: number;
    f1_score?: number;
    precision?: number;
    recall?: number;
    raw_image_path?: string;
    branch?: {
        id: number;
        name: string;
    };
}

interface Props {
    attendance: Attendance;
}

export default function Show({ attendance }: Props) {
    const [imgSize, setImgSize] = useState({ width: 0, height: 0 });

    const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
        const { naturalWidth, naturalHeight } = e.currentTarget;
        setImgSize({ width: naturalWidth, height: naturalHeight });
    };

    const getBBoxColor = (type: string) => {
        switch (type.toLowerCase()) {
            case 'check-in':
                return 'emerald'; // Emerald for check-in
            case 'check-out':
                return 'blue'; // Blue for check-out
            default:
                return 'amber';
        }
    };

    const colorScheme = getBBoxColor(attendance.type);
    const borderColor =
        colorScheme === 'emerald' ? 'border-emerald-400' : 'border-blue-400';
    const bgColor =
        colorScheme === 'emerald' ? 'bg-emerald-500' : 'bg-blue-500';
    const shadowColor =
        colorScheme === 'emerald'
            ? 'shadow-[0_0_15px_rgba(52,211,153,0.6)]'
            : 'shadow-[0_0_15px_rgba(59,130,246,0.6)]';

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
                                                onLoad={handleImageLoad}
                                            />

                                            {/* Visual Bounding Box Overlay */}
                                            {attendance.bbox &&
                                                imgSize.width > 0 && (
                                                    <div
                                                        className={`absolute border-2 ${borderColor} ${shadowColor} rounded-sm pointer-events-none`}
                                                        style={{
                                                            left: `${(attendance.bbox[0] / imgSize.width) * 100}%`,
                                                            top: `${(attendance.bbox[1] / imgSize.height) * 100}%`,
                                                            width: `${(attendance.bbox[2] / imgSize.width) * 100}%`,
                                                            height: `${(attendance.bbox[3] / imgSize.height) * 100}%`,
                                                        }}
                                                    >
                                                        <div
                                                            className={`absolute -top-7 left-0 ${bgColor} text-white text-[8px] md:text-[10px] font-bold px-1.5 py-0.5 rounded shadow-lg flex flex-col whitespace-nowrap`}
                                                        >
                                                            <div className="flex items-center gap-1">
                                                                <Scan className="w-2.5 h-2.5" />
                                                                {attendance.type.toUpperCase()}
                                                            </div>
                                                            <div className="text-[7px] md:text-[9px] opacity-90 border-t border-white/20 mt-0.5 pt-0.5">
                                                                {
                                                                    attendance
                                                                        .user
                                                                        .name
                                                                }{' '}
                                                                -{' '}
                                                                {Math.round(
                                                                    attendance.confidence *
                                                                        100,
                                                                )}
                                                                %
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}

                                            <div className="absolute inset-x-0 bottom-0 p-3 md:p-4 bg-gradient-to-t from-black/60 to-transparent">
                                                <div className="flex items-center gap-2 text-white">
                                                    <Shield className="w-3.5 h-3.5 md:w-4 md:h-4 text-emerald-400" />
                                                    <span className="text-xs md:text-sm font-bold shadow-sm">
                                                        Terverifikasi AI
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-4 space-y-4">
                                            {/* Primary Match Confidence */}
                                            <div className="p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100">
                                                <div className="flex justify-between items-center mb-2">
                                                    <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">
                                                        Kecocokan Wajah
                                                    </span>
                                                    <span className="text-sm font-bold text-indigo-600">
                                                        {Math.round(
                                                            attendance.confidence *
                                                                100,
                                                        )}
                                                        % Match
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

                                            {/* AI Model Performance Metrics (Audit Ready) */}
                                            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                                                <div className="flex items-center gap-2 mb-3">
                                                    <div className="p-1.5 bg-white rounded-lg shadow-sm border border-slate-100">
                                                        <Cpu className="w-3.5 h-3.5 text-slate-600" />
                                                    </div>
                                                    <p className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                                                        AI Model Audit
                                                    </p>
                                                </div>

                                                <div className="grid grid-cols-2 gap-3">
                                                    <div className="p-2.5 bg-white rounded-xl border border-slate-100 shadow-sm">
                                                        <p className="text-[9px] font-bold text-slate-400 uppercase mb-1">
                                                            F1 Score
                                                        </p>
                                                        <p
                                                            className={`text-sm font-bold ${(attendance.f1_score !== undefined && attendance.f1_score !== null) ? 'text-emerald-600' : 'text-slate-300 italic font-normal'}`}
                                                        >
                                                            {(attendance.f1_score !== undefined && attendance.f1_score !== null)
                                                                ? `${Math.round(attendance.f1_score)}%`
                                                                : 'No Data'}
                                                        </p>
                                                    </div>
                                                    <div className="p-2.5 bg-white rounded-xl border border-slate-100 shadow-sm">
                                                        <p className="text-[9px] font-bold text-slate-400 uppercase mb-1">
                                                            Accuracy
                                                        </p>
                                                        <p
                                                            className={`text-sm font-bold ${(attendance.accuracy !== undefined && attendance.accuracy !== null) ? 'text-blue-600' : 'text-slate-300 italic font-normal'}`}
                                                        >
                                                            {(attendance.accuracy !== undefined && attendance.accuracy !== null)
                                                                ? `${Math.round(attendance.accuracy)}%`
                                                                : 'No Data'}
                                                        </p>
                                                    </div>
                                                    <div className="p-2.5 bg-white rounded-xl border border-slate-100 shadow-sm">
                                                        <p className="text-[9px] font-bold text-slate-400 uppercase mb-1">
                                                            Precision
                                                        </p>
                                                        <p
                                                            className={`text-sm font-bold ${(attendance.precision !== undefined && attendance.precision !== null) ? 'text-amber-600' : 'text-slate-300 italic font-normal'}`}
                                                        >
                                                            {(attendance.precision !== undefined && attendance.precision !== null)
                                                                ? `${Math.round(attendance.precision)}%`
                                                                : 'No Data'}
                                                        </p>
                                                    </div>
                                                    <div className="p-2.5 bg-white rounded-xl border border-slate-100 shadow-sm">
                                                        <p className="text-[9px] font-bold text-slate-400 uppercase mb-1">
                                                            Recall
                                                        </p>
                                                        <p
                                                            className={`text-sm font-bold ${(attendance.recall !== undefined && attendance.recall !== null) ? 'text-rose-600' : 'text-slate-300 italic font-normal'}`}
                                                        >
                                                            {(attendance.recall !== undefined && attendance.recall !== null)
                                                                ? `${Math.round(attendance.recall)}%`
                                                                : 'No Data'}
                                                        </p>
                                                    </div>
                                                </div>
                                                <p className="mt-3 text-[8px] text-slate-400 text-center italic">
                                                    *Metode: KNN Classifier
                                                    dengan Face Embeddings
                                                    (MTCNN + InceptionResnetV1)
                                                </p>
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
                                {/* Download & Action Card */}
                                <div className="flex flex-wrap gap-3">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button className="rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold flex-1 md:flex-none h-11 px-6 shadow-md shadow-indigo-200 gap-2">
                                                <FileDown className="w-4 h-4" />
                                                Unduh Gambar Bukti
                                                <ChevronDown className="w-4 h-4 ml-1 opacity-50" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent
                                            align="start"
                                            className="rounded-xl border-slate-200 shadow-xl p-1.5 w-56"
                                        >
                                            <DropdownMenuItem
                                                className="rounded-lg font-semibold text-slate-700 cursor-pointer"
                                                onClick={() => {
                                                    const link =
                                                        document.createElement(
                                                            'a',
                                                        );
                                                    link.href = `/storage/${attendance.image_path}`;
                                                    link.download = `audit_ai_${attendance.user.name}_${attendance.id}.jpg`;
                                                    document.body.appendChild(
                                                        link,
                                                    );
                                                    link.click();
                                                    document.body.removeChild(
                                                        link,
                                                    );
                                                }}
                                            >
                                                <Scan className="w-4 h-4 mr-2 text-indigo-500" />
                                                Download dengan BBox AI
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                className="rounded-lg font-semibold text-slate-700 cursor-pointer"
                                                onClick={() => {
                                                    const path =
                                                        attendance.raw_image_path ||
                                                        attendance.image_path;
                                                    const link =
                                                        document.createElement(
                                                            'a',
                                                        );
                                                    link.href = `/storage/${path}`;
                                                    link.download = `audit_raw_${attendance.user.name}_${attendance.id}.jpg`;
                                                    document.body.appendChild(
                                                        link,
                                                    );
                                                    link.click();
                                                    document.body.removeChild(
                                                        link,
                                                    );
                                                }}
                                            >
                                                <ImageIcon className="w-4 h-4 mr-2 text-slate-500" />
                                                Download Original (Polos)
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>

                                <Card className="border-none shadow-sm rounded-3xl bg-white p-5 md:p-8">
                                    <div className="flex items-center justify-between mb-6 md:mb-8 pb-4 border-b border-gray-50">
                                        <h3 className="text-base md:text-lg font-bold text-gray-900 flex items-center gap-2">
                                            <Shield className="w-5 h-5 text-emerald-500" />
                                            Data Verifikasi Lapangan
                                        </h3>
                                        <Badge className="bg-emerald-50 text-emerald-600 border-none px-3 md:px-4 py-1 md:py-1.5 rounded-full capitalize font-bold text-xs md:text-sm">
                                            {attendance.type}
                                        </Badge>
                                    </div>

                                    <div className="grid gap-6 sm:grid-cols-2 md:gap-10">
                                        <div className="space-y-6 md:space-y-8">
                                            <div className="flex gap-4">
                                                <div className="p-3 bg-indigo-50 rounded-2xl h-fit shrink-0">
                                                    <Calendar className="w-5 h-5 text-indigo-600" />
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                                                        Waktu Transaksi
                                                    </p>
                                                    <p className="text-base md:text-lg font-bold text-gray-900">
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
                                                    <p className="text-sm font-semibold text-indigo-600 mt-0.5">
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

                                            <div className="flex gap-4">
                                                <div className="p-3 bg-amber-50 rounded-2xl h-fit shrink-0">
                                                    <Globe className="w-5 h-5 text-amber-600" />
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                                                        Identitas Jaringan
                                                    </p>
                                                    <p className="text-base md:text-lg font-bold text-gray-900">
                                                        {attendance.ip_address ||
                                                            '-'}
                                                    </p>
                                                    <p className="text-[10px] md:text-xs text-gray-500 mt-1 line-clamp-1">
                                                        {attendance.network_info ||
                                                            'Device metadata not available'}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-6 md:space-y-8">
                                            <div className="flex gap-4">
                                                <div className="p-3 bg-emerald-50 rounded-2xl h-fit shrink-0">
                                                    <MapPin className="w-5 h-5 text-emerald-600" />
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                                                        Lokasi Presensi
                                                    </p>
                                                    <p className="text-base md:text-lg font-bold text-gray-900">
                                                        {attendance.branch
                                                            ?.name ||
                                                            'Luar Area'}
                                                    </p>
                                                    <div className="mt-2 flex flex-col gap-2">
                                                        <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                                            {attendance.latitude
                                                                ? `${attendance.latitude}, ${attendance.longitude}`
                                                                : 'GPS Tidak Aktif'}
                                                        </div>
                                                        {attendance.latitude && (
                                                            <a
                                                                href={`https://www.google.com/maps?q=${attendance.latitude},${attendance.longitude}`}
                                                                target="_blank"
                                                                className="text-xs text-indigo-600 font-bold hover:underline flex items-center gap-1"
                                                            >
                                                                Buka di Google
                                                                Maps
                                                                <ArrowLeft className="w-3 h-3 rotate-180" />
                                                            </a>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-8 md:mt-12">
                                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                            <h4 className="text-xs font-bold text-gray-900 mb-3 flex items-center gap-2">
                                                <Cpu className="w-4 h-4 text-indigo-600" />
                                                Data Raw Payload
                                            </h4>
                                            <div className="text-[10px] md:text-xs font-mono text-gray-500 overflow-x-auto whitespace-pre-wrap break-all max-h-32">
                                                {attendance.network_info ||
                                                    'Tidak ada payload tambahan.'}
                                            </div>
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
