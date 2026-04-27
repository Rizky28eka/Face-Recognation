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
}

export default function Report({ attendances, employees, filters }: Props) {
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
                    <div className="flex flex-col gap-6 py-4 md:gap-8 md:py-8">
                        {/* Header Section */}
                        <div className="px-4 lg:px-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div>
                                <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                                    Laporan Absensi
                                </h1>
                                <p className="text-gray-500">
                                    Pantau kehadiran karyawan secara real-time.
                                </p>
                            </div>
                            <Button className="bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-200 gap-2 h-12 px-6 rounded-full">
                                <FileDown className="w-4 h-4" />
                                Export Excel
                            </Button>
                        </div>

                        {/* Stats Summary */}
                        <div className="grid gap-4 md:grid-cols-4 px-4 lg:px-6">
                            <Card className="border-none shadow-sm bg-indigo-600 text-white">
                                <CardContent className="p-6 flex items-center gap-4">
                                    <div className="p-3 bg-white/20 rounded-2xl">
                                        <Clock className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-indigo-100">
                                            Total Kehadiran
                                        </p>
                                        <p className="text-2xl font-bold">
                                            {attendances.total}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                            {/* Additional placeholders for stats */}
                            <Card className="border-none shadow-sm bg-white">
                                <CardContent className="p-6 flex items-center gap-4">
                                    <div className="p-3 bg-emerald-100 rounded-2xl">
                                        <CalendarIcon className="w-6 h-6 text-emerald-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">
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
                            <Card className="border-none shadow-sm bg-white rounded-3xl p-6">
                                <div className="grid gap-4 md:grid-cols-4 items-end">
                                    <div className="space-y-2">
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
                                    <div className="space-y-2">
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
                                    <div className="space-y-2">
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
                                    <div className="flex gap-2">
                                        <Button
                                            onClick={handleFilter}
                                            className="h-11 flex-1 bg-indigo-600 hover:bg-indigo-700 rounded-xl font-bold"
                                        >
                                            Terapkan
                                        </Button>
                                        <Button
                                            variant="outline"
                                            onClick={resetFilter}
                                            className="h-11 px-4 border-gray-200 rounded-xl"
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
                                            <TableHead className="py-4">
                                                Karyawan
                                            </TableHead>
                                            <TableHead>Waktu</TableHead>
                                            <TableHead>Metode</TableHead>
                                            <TableHead>Lokasi/Cabang</TableHead>
                                            <TableHead>Confidence</TableHead>
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
                                                                    <p className="font-bold text-gray-900">
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
                                                                <div className="text-[10px] text-gray-400">
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
                                                            <div className="flex items-center gap-2">
                                                                <div className="flex-1 h-1.5 w-12 bg-gray-100 rounded-full overflow-hidden">
                                                                    <div
                                                                        className="h-full bg-indigo-500 rounded-full"
                                                                        style={{
                                                                            width: `${attendance.confidence * 100}%`,
                                                                        }}
                                                                    />
                                                                </div>
                                                                <span className="text-xs font-bold text-indigo-600">
                                                                    {Math.round(
                                                                        attendance.confidence *
                                                                            100,
                                                                    )}
                                                                    %
                                                                </span>
                                                            </div>
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
                                                                    className="rounded-full hover:bg-indigo-100 hover:text-indigo-600 font-semibold"
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
                                                    colSpan={6}
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
                            <div className="grid gap-4 md:hidden">
                                {attendances.data.length > 0 ? (
                                    attendances.data.map((attendance) => (
                                        <Card
                                            key={attendance.id}
                                            className="border-none shadow-sm bg-white p-4"
                                        >
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="flex items-center gap-3">
                                                    <img
                                                        src={
                                                            attendance.user
                                                                .avatar ||
                                                            `https://ui-avatars.com/api/?name=${encodeURIComponent(attendance.user.name)}&background=6366f1&color=fff`
                                                        }
                                                        className="w-10 h-10 rounded-xl"
                                                        alt=""
                                                    />
                                                    <div>
                                                        <p className="font-bold text-gray-900">
                                                            {
                                                                attendance.user
                                                                    .name
                                                            }
                                                        </p>
                                                        <p className="text-xs text-gray-500">
                                                            ID #{attendance.id}
                                                        </p>
                                                    </div>
                                                </div>
                                                <Badge className="bg-indigo-50 text-indigo-600 border-none rounded-lg">
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
                                                        {Math.round(
                                                            attendance.confidence *
                                                                100,
                                                        )}
                                                        % Match
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
                                            </div>
                                            <div className="flex items-center justify-between pt-3 border-t border-gray-50 text-xs text-gray-400">
                                                <div className="flex items-center gap-1">
                                                    <MapPin className="w-3 h-3" />
                                                    {attendance.latitude
                                                        ? 'Location Saved'
                                                        : 'No GPS'}
                                                </div>
                                                <span>
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
                                        </Card>
                                    ))
                                ) : (
                                    <div className="py-12 text-center text-gray-400">
                                        Tidak ada data absensi.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
