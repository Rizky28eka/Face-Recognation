import { AppSidebar } from '@/Components/app-sidebar';
import { SiteHeader } from '@/Components/site-header';
import { SidebarInset, SidebarProvider } from '@/Components/ui/sidebar';
import { Head, router, Link } from '@inertiajs/react';
import { Card, CardContent } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import {
    Calendar as CalendarIcon,
    FileDown,
    Clock,
    MapPin,
    Eye,
} from 'lucide-react';
import { Input } from '@/Components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/Components/ui/table';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/Components/ui/select';
import { useState } from 'react';
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
    created_at: string;
    branch?: {
        id: number;
        name: string;
    };
    f1_score?: number;
    accuracy?: number;
    precision?: number;
    recall?: number;
}

interface Props {
    attendances: {
        data: Attendance[];
        links: {
            url: string | null;
            label: string;
            active: boolean;
        }[];
        total: number;
    };
    employees: User[];
    filters: {
        start_date?: string;
        end_date?: string;
        user_id?: string;
    };
    role: 'owner' | 'karyawan';
}

export default function Report({ attendances, employees, filters, role }: Props) {
    const [startDate, setStartDate] = useState(filters.start_date || '');
    const [endDate, setEndDate] = useState(filters.end_date || '');
    const [userId, setUserId] = useState(filters.user_id || 'all');

    const handleFilter = () => {
        router.get(
            route('attendance.report'),
            {
                start_date: startDate,
                end_date: endDate,
                user_id: userId === 'all' ? '' : userId,
            },
            { preserveState: true },
        );
    };

    const resetFilter = () => {
        setStartDate('');
        setEndDate('');
        setUserId('all');
        router.get(route('attendance.report'));
    };

    return (
        <SidebarProvider>
            <AppSidebar variant="inset" />
            <SidebarInset>
                <SiteHeader />
                <Head title="Laporan Absensi" />

                <div className="flex flex-1 flex-col pb-8">
                    <div className="flex flex-col gap-4 py-4 md:gap-8 md:py-8">
                        {/* Header Section */}
                        <div className="px-4 lg:px-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div>
                                <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900">
                                    Laporan Absensi
                                </h1>
                                <p className="text-sm text-gray-500 mt-1">
                                    Pantau kehadiran karyawan secara real-time.
                                </p>
                            </div>
                            <Button className="w-full md:w-auto bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-200 gap-2 h-11 px-6 rounded-full">
                                <FileDown className="w-4 h-4" />
                                Export Excel
                            </Button>
                        </div>

                        {/* Stats Summary */}
                        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 px-4 lg:px-6">
                            <Card className="border-none shadow-sm bg-indigo-600 text-white col-span-2 md:col-span-1">
                                <CardContent className="p-4 md:p-6 flex items-center gap-3 md:gap-4">
                                    <div className="p-2.5 md:p-3 bg-white/20 rounded-2xl shrink-0">
                                        <Clock className="w-5 h-5 md:w-6 md:h-6 text-white" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-xs md:text-sm font-medium text-indigo-100 truncate">
                                            Total Kehadiran
                                        </p>
                                        <p className="text-2xl font-bold">
                                            {attendances.total}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                            {/* Additional placeholders for stats */}
                            <Card className="border-none shadow-sm bg-white col-span-2 md:col-span-1">
                                <CardContent className="p-4 md:p-6 flex items-center gap-3 md:gap-4">
                                    <div className="p-2.5 md:p-3 bg-emerald-100 rounded-2xl shrink-0">
                                        <CalendarIcon className="w-5 h-5 md:w-6 md:h-6 text-emerald-600" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-xs md:text-sm font-medium text-gray-500 truncate">
                                            Hadir Hari Ini
                                        </p>
                                        <p className="text-2xl font-bold text-gray-900">
                                            {
                                                attendances.data.filter(
                                                    (a) =>
                                                        new Date(
                                                            a.created_at,
                                                        ).toDateString() ===
                                                        new Date().toDateString(),
                                                ).length
                                            }
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Filters Section */}
                        <div className="px-4 lg:px-6">
                            <Card className="border-none shadow-sm bg-white rounded-3xl p-5 md:p-6">
                                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 items-end">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                                            Mulai Tanggal
                                        </label>
                                        <Input
                                            type="date"
                                            value={startDate}
                                            onChange={(e) =>
                                                setStartDate(e.target.value)
                                            }
                                            className="h-11 border-gray-100 bg-gray-50/50 rounded-xl"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                                            Sampai Tanggal
                                        </label>
                                        <Input
                                            type="date"
                                            value={endDate}
                                            onChange={(e) =>
                                                setEndDate(e.target.value)
                                            }
                                            className="h-11 border-gray-100 bg-gray-50/50 rounded-xl"
                                        />
                                    </div>
                                    {role === 'owner' && (
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                                                Karyawan
                                            </label>
                                            <Select
                                                value={userId}
                                                onValueChange={setUserId}
                                            >
                                                <SelectTrigger className="h-11 border-gray-100 bg-gray-50/50 rounded-xl">
                                                    <SelectValue placeholder="Semua Karyawan" />
                                                </SelectTrigger>
                                                <SelectContent className="rounded-xl">
                                                    <SelectItem value="all">
                                                        Semua Karyawan
                                                    </SelectItem>
                                                    {employees.map((emp) => (
                                                        <SelectItem
                                                            key={emp.id}
                                                            value={emp.id.toString()}
                                                        >
                                                            {emp.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    )}
                                    <div className="flex gap-2">
                                        <Button
                                            onClick={handleFilter}
                                            className="h-11 flex-1 bg-indigo-600 hover:bg-indigo-700 rounded-xl font-bold shadow-md shadow-indigo-100"
                                        >
                                            Terapkan
                                        </Button>
                                        <Button
                                            variant="outline"
                                            onClick={resetFilter}
                                            className="h-11 px-4 border-gray-200 rounded-xl text-gray-600"
                                        >
                                            Reset
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        </div>

                        {/* Data Section */}
                        <div className="px-4 lg:px-6">
                            {/* Desktop View */}
                            <Card className="hidden md:block border-none shadow-sm overflow-hidden rounded-3xl bg-white">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-gray-50/50 hover:bg-gray-50/50">
                                            {role === 'owner' && (
                                                <TableHead className="py-4">
                                                    Karyawan
                                                </TableHead>
                                            )}
                                            <TableHead>Waktu</TableHead>
                                            <TableHead>Metode</TableHead>
                                            <TableHead>Lokasi/Cabang</TableHead>
                                            <TableHead>Confidence</TableHead>
                                            <TableHead>F1 Score</TableHead>
                                            <TableHead className="text-right">
                                                Aksi
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {attendances.data.length > 0 ? (
                                            attendances.data.map(
                                                (attendance) => (
                                                    <TableRow
                                                        key={attendance.id}
                                                        className="hover:bg-indigo-50/30 transition-colors group"
                                                    >
                                                        {role === 'owner' && (
                                                            <TableCell className="py-4">
                                                                <div className="flex items-center gap-3">
                                                                    <img
                                                                        src={
                                                                            attendance
                                                                                .user
                                                                                .avatar ||
                                                                            `https://ui-avatars.com/api/?name=${encodeURIComponent(attendance.user.name)}&background=6366f1&color=fff`
                                                                        }
                                                                        className="w-10 h-10 rounded-xl object-cover"
                                                                        alt=""
                                                                    />
                                                                    <div>
                                                                        <p className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                                                                            {
                                                                                attendance
                                                                                    .user
                                                                                    .name
                                                                            }
                                                                        </p>
                                                                        <p className="text-xs text-gray-500">
                                                                            {
                                                                                attendance
                                                                                    .user
                                                                                    .email
                                                                            }
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </TableCell>
                                                        )}
                                                        <TableCell>
                                                            <div className="flex flex-col">
                                                                <span className="font-semibold text-gray-700">
                                                                    {new Date(
                                                                        attendance.created_at,
                                                                    ).toLocaleTimeString(
                                                                        'id-ID',
                                                                        {
                                                                            hour: '2-digit',
                                                                            minute: '2-digit',
                                                                        },
                                                                    )}{' '}
                                                                    WIB
                                                                </span>
                                                                <span className="text-xs text-gray-400">
                                                                    {new Date(
                                                                        attendance.created_at,
                                                                    ).toLocaleDateString(
                                                                        'id-ID',
                                                                        {
                                                                            day: 'numeric',
                                                                            month: 'short',
                                                                        },
                                                                    )}
                                                                </span>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Badge
                                                                variant="outline"
                                                                className="bg-indigo-50 text-indigo-600 border-indigo-100 rounded-lg capitalize"
                                                            >
                                                                {
                                                                    attendance.type
                                                                }
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell>
                                                            <div className="flex flex-col gap-1">
                                                                <div className="flex items-center gap-1 text-xs font-bold text-indigo-600">
                                                                    <MapPin className="w-3 h-3" />
                                                                    {attendance
                                                                        .branch
                                                                        ?.name ||
                                                                        'Cabang Terhapus'}
                                                                </div>
                                                                <div className="text-[10px] text-gray-400">
                                                                    IP:{' '}
                                                                    {
                                                                        attendance.ip_address
                                                                    }
                                                                </div>
                                                                <div className="text-[10px] text-gray-400 truncate max-w-[150px]">
                                                                    {
                                                                        attendance.latitude
                                                                    }
                                                                    ,{' '}
                                                                    {
                                                                        attendance.longitude
                                                                    }
                                                                </div>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>
                                                            {(attendance.confidence !== undefined && attendance.confidence !== null) ? (
                                                                <span className="text-xs font-bold text-indigo-600">
                                                                    {Math.round(
                                                                        attendance.confidence *
                                                                            100,
                                                                    )}
                                                                    % Match
                                                                </span>
                                                            ) : (
                                                                <span className="text-xs text-gray-400 italic">
                                                                    No Data
                                                                </span>
                                                            )}
                                                        </TableCell>
                                                        <TableCell>
                                                            {(attendance.f1_score !== undefined && attendance.f1_score !== null) ? (
                                                                <div className="flex items-center gap-2">
                                                                    <div className="flex-1 h-1.5 w-12 bg-gray-100 rounded-full overflow-hidden">
                                                                        <div
                                                                            className="h-full bg-emerald-500 rounded-full"
                                                                            style={{
                                                                                width: `${attendance.f1_score}%`,
                                                                            }}
                                                                        />
                                                                    </div>
                                                                    <span className="text-xs font-bold text-emerald-600">
                                                                        {Math.round(
                                                                            attendance.f1_score,
                                                                        )}
                                                                        %
                                                                    </span>
                                                                </div>
                                                            ) : (
                                                                <span className="text-xs text-gray-400 italic">
                                                                    No Data
                                                                </span>
                                                            )}
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            <Link
                                                                href={route(
                                                                    'attendance.show',
                                                                    attendance.id,
                                                                )}
                                                            >
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    className="rounded-full hover:bg-indigo-100 hover:text-indigo-600 font-semibold h-8"
                                                                >
                                                                    Lihat Detail
                                                                </Button>
                                                            </Link>
                                                        </TableCell>
                                                    </TableRow>
                                                ),
                                            )
                                        ) : (
                                            <TableRow>
                                                <TableCell
                                                    colSpan={role === 'owner' ? 7 : 6}
                                                    className="h-48 text-center text-gray-400"
                                                >
                                                    Tidak ada data absensi untuk
                                                    periode ini.
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </Card>

                            {/* Mobile View */}
                            <div className="flex flex-col gap-3 md:hidden">
                                {attendances.data.length > 0 ? (
                                    attendances.data.map((attendance) => (
                                        <Card
                                            key={attendance.id}
                                            className="border-none shadow-sm bg-white"
                                        >
                                            <CardContent className="p-4">
                                                <div className="flex items-center justify-between mb-4">
                                                    <div className="flex items-center gap-3">
                                                        <img
                                                            src={
                                                                attendance.user
                                                                    .avatar ||
                                                                `https://ui-avatars.com/api/?name=${encodeURIComponent(attendance.user.name)}&background=6366f1&color=fff`
                                                            }
                                                            className="w-12 h-12 rounded-2xl object-cover"
                                                            alt=""
                                                        />
                                                        <div className="min-w-0">
                                                            <p className="font-bold text-gray-900 truncate">
                                                                {
                                                                    attendance
                                                                        .user
                                                                        .name
                                                                }
                                                            </p>
                                                            <p className="text-xs text-gray-500">
                                                                ID #
                                                                {attendance.id}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <Badge className="bg-indigo-50 text-indigo-600 border-none rounded-lg text-xs font-bold shrink-0">
                                                        {new Date(
                                                            attendance.created_at,
                                                        ).toLocaleTimeString(
                                                            'id-ID',
                                                            {
                                                                hour: '2-digit',
                                                                minute: '2-digit',
                                                            },
                                                        )}
                                                    </Badge>
                                                </div>
                                                <div className="grid grid-cols-2 gap-4 py-3 border-t border-gray-50">
                                                    <div>
                                                        <p className="text-[10px] font-bold text-gray-400 uppercase">
                                                            Confidence
                                                        </p>
                                                        <p className="text-sm font-bold text-indigo-600">
                                                            {attendance.confidence ? (
                                                                `${Math.round(attendance.confidence * 100)}% Match`
                                                            ) : (
                                                                <span className="text-gray-400 italic font-normal">
                                                                    No Data
                                                                </span>
                                                            )}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] font-bold text-gray-400 uppercase">
                                                            Metode
                                                        </p>
                                                        <p className="text-sm font-bold text-gray-700 capitalize">
                                                            {attendance.type}
                                                        </p>
                                                    </div>
                                                    {(attendance.f1_score !== undefined && attendance.f1_score !== null) && (
                                                        <div className="col-span-2">
                                                            <p className="text-[10px] font-bold text-gray-400 uppercase">
                                                                Model F1 Score
                                                            </p>
                                                            <p className="text-sm font-bold text-emerald-600">
                                                                {Math.round(
                                                                    attendance.f1_score,
                                                                )}
                                                                % Reliability
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex items-center justify-between py-3 border-t border-gray-50 text-xs text-gray-400">
                                                    <div className="flex items-center gap-1.5 font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">
                                                        <MapPin className="w-3.5 h-3.5" />
                                                        {attendance.latitude
                                                            ? 'GPS Aktif'
                                                            : 'No GPS'}
                                                    </div>
                                                    <span className="font-medium">
                                                        {new Date(
                                                            attendance.created_at,
                                                        ).toLocaleDateString(
                                                            'id-ID',
                                                            {
                                                                day: 'numeric',
                                                                month: 'long',
                                                            },
                                                        )}
                                                    </span>
                                                </div>
                                                <div className="pt-3 border-t border-gray-50">
                                                    <Link
                                                        href={route(
                                                            'attendance.show',
                                                            attendance.id,
                                                        )}
                                                    >
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="w-full rounded-lg h-9 text-indigo-600 border-indigo-100 hover:bg-indigo-50 font-semibold"
                                                        >
                                                            <Eye className="w-3.5 h-3.5 mr-1.5" />
                                                            Lihat Detail
                                                        </Button>
                                                    </Link>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))
                                ) : (
                                    <div className="py-12 text-center text-gray-400 bg-white rounded-2xl shadow-sm">
                                        Tidak ada data absensi.
                                    </div>
                                )}
                            </div>

                            {/* Pagination */}
                            {attendances.links &&
                                attendances.links.length > 3 && (
                                    <div className="flex flex-wrap justify-center gap-1 mt-6">
                                        {attendances.links.map((link, i) => (
                                            <Link
                                                key={i}
                                                href={link.url || '#'}
                                                className={`px-3 py-1.5 text-sm rounded-lg font-medium transition-colors ${
                                                    link.active
                                                        ? 'bg-indigo-600 text-white shadow-sm'
                                                        : link.url
                                                          ? 'bg-white text-gray-600 hover:bg-gray-50 shadow-sm'
                                                          : 'bg-white text-gray-300 cursor-not-allowed shadow-sm'
                                                }`}
                                                dangerouslySetInnerHTML={{
                                                    __html: link.label,
                                                }}
                                            />
                                        ))}
                                    </div>
                                )}
                        </div>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
