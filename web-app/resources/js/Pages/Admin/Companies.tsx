import { AppSidebar } from '@/Components/app-sidebar';
import { SiteHeader } from '@/Components/site-header';
import { SidebarInset, SidebarProvider } from '@/Components/ui/sidebar';
import { Head } from '@inertiajs/react';
import { Badge } from '@/Components/ui/badge';
import {
    MapPin,
    Users,
    UserCheck,
    Clock,
    Radius,
    CheckCircle2,
    XCircle,
} from 'lucide-react';

interface Owner {
    name: string;
    email: string;
}

interface Company {
    id: number;
    name: string;
    latitude: string | null;
    longitude: string | null;
    radius: number;
    check_in_time: string;
    check_out_time: string;
    is_active: boolean;
    owner_count: number;
    karyawan_count: number;
    owners: Owner[];
}

interface Props {
    companies: Company[];
}

export default function Companies({ companies }: Props) {
    return (
        <SidebarProvider>
            <AppSidebar variant="inset" />
            <SidebarInset>
                <SiteHeader />
                <Head title="Daftar Perusahaan" />

                <div className="flex flex-1 flex-col pb-8">
                    <div className="flex flex-col gap-4 py-4 md:gap-8 md:py-8 px-4 lg:px-6">
                        {/* Header */}
                        <div>
                            <h1 className="text-xl md:text-3xl font-bold tracking-tight text-gray-900">
                                Daftar Perusahaan
                            </h1>
                            <p className="text-xs md:text-sm text-gray-500 mt-1">
                                Informasi perusahaan dan lokasi kantor yang
                                terdaftar di sistem.
                            </p>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                            <div className="rounded-2xl bg-indigo-50 border border-indigo-100 p-4 flex flex-col gap-1">
                                <p className="text-xs text-indigo-500 font-medium uppercase tracking-wider">
                                    Total Perusahaan
                                </p>
                                <p className="text-3xl font-black text-indigo-700">
                                    {companies.length}
                                </p>
                            </div>
                            <div className="rounded-2xl bg-emerald-50 border border-emerald-100 p-4 flex flex-col gap-1">
                                <p className="text-xs text-emerald-500 font-medium uppercase tracking-wider">
                                    Aktif
                                </p>
                                <p className="text-3xl font-black text-emerald-700">
                                    {companies.filter((c) => c.is_active).length}
                                </p>
                            </div>
                            <div className="rounded-2xl bg-gray-50 border border-gray-100 p-4 flex flex-col gap-1">
                                <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                                    Total Karyawan
                                </p>
                                <p className="text-3xl font-black text-gray-700">
                                    {companies.reduce(
                                        (sum, c) => sum + c.karyawan_count,
                                        0,
                                    )}
                                </p>
                            </div>
                        </div>

                        {/* Company Cards */}
                        {companies.length === 0 ? (
                            <div className="text-center py-16 text-gray-400">
                                <MapPin className="w-10 h-10 mx-auto mb-3 opacity-30" />
                                <p className="font-medium">
                                    Belum ada perusahaan terdaftar
                                </p>
                            </div>
                        ) : (
                            <div className="grid gap-4 md:gap-5">
                                {companies.map((company) => (
                                    <div
                                        key={company.id}
                                        className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden"
                                    >
                                        {/* Card Header */}
                                        <div className="px-5 md:px-6 py-4 border-b border-gray-50 flex items-center justify-between gap-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-xl bg-indigo-100 flex items-center justify-center shrink-0">
                                                    <span className="text-indigo-700 font-black text-sm">
                                                        {company.name
                                                            .charAt(0)
                                                            .toUpperCase()}
                                                    </span>
                                                </div>
                                                <div>
                                                    <h2 className="font-bold text-gray-900 text-sm md:text-base">
                                                        {company.name}
                                                    </h2>
                                                    {company.owners.length >
                                                        0 && (
                                                        <p className="text-xs text-gray-400">
                                                            {company.owners
                                                                .map(
                                                                    (o) =>
                                                                        o.name,
                                                                )
                                                                .join(', ')}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                            <Badge
                                                className={
                                                    company.is_active
                                                        ? 'bg-emerald-100 text-emerald-700 border-none'
                                                        : 'bg-red-100 text-red-600 border-none'
                                                }
                                            >
                                                {company.is_active ? (
                                                    <CheckCircle2 className="w-3 h-3 mr-1" />
                                                ) : (
                                                    <XCircle className="w-3 h-3 mr-1" />
                                                )}
                                                {company.is_active
                                                    ? 'Aktif'
                                                    : 'Nonaktif'}
                                            </Badge>
                                        </div>

                                        {/* Card Body */}
                                        <div className="px-5 md:px-6 py-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                                            {/* Lokasi */}
                                            <div className="col-span-2 md:col-span-1 space-y-1">
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                                                    <MapPin className="w-3 h-3" />{' '}
                                                    Koordinat
                                                </p>
                                                {company.latitude &&
                                                company.longitude ? (
                                                    <div>
                                                        <p className="text-xs font-mono text-gray-700">
                                                            {Number(
                                                                company.latitude,
                                                            ).toFixed(6)}
                                                        </p>
                                                        <p className="text-xs font-mono text-gray-700">
                                                            {Number(
                                                                company.longitude,
                                                            ).toFixed(6)}
                                                        </p>
                                                        <a
                                                            href={`https://maps.google.com/?q=${company.latitude},${company.longitude}`}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            className="text-[10px] text-indigo-500 hover:underline mt-0.5 inline-block"
                                                        >
                                                            Buka di Maps ↗
                                                        </a>
                                                    </div>
                                                ) : (
                                                    <p className="text-xs text-gray-400 italic">
                                                        Belum diatur
                                                    </p>
                                                )}
                                            </div>

                                            {/* Radius */}
                                            <div className="space-y-1">
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                                                    <Radius className="w-3 h-3" />{' '}
                                                    Radius
                                                </p>
                                                <p className="text-sm font-semibold text-gray-700">
                                                    {company.radius}m
                                                </p>
                                            </div>

                                            {/* Jam Kerja */}
                                            <div className="space-y-1">
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                                                    <Clock className="w-3 h-3" />{' '}
                                                    Jam Kerja
                                                </p>
                                                <p className="text-sm font-semibold text-gray-700">
                                                    {company.check_in_time} –{' '}
                                                    {company.check_out_time}
                                                </p>
                                            </div>

                                            {/* Jumlah Pengguna */}
                                            <div className="space-y-1">
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                                                    <Users className="w-3 h-3" />{' '}
                                                    Pengguna
                                                </p>
                                                <div className="flex items-center gap-3">
                                                    <span className="flex items-center gap-1 text-xs text-gray-600">
                                                        <UserCheck className="w-3.5 h-3.5 text-indigo-400" />
                                                        {company.owner_count}{' '}
                                                        admin
                                                    </span>
                                                    <span className="flex items-center gap-1 text-xs text-gray-600">
                                                        <Users className="w-3.5 h-3.5 text-emerald-400" />
                                                        {
                                                            company.karyawan_count
                                                        }{' '}
                                                        karyawan
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
