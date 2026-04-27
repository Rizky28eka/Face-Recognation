import { AppSidebar } from '@/Components/app-sidebar';
import { SiteHeader } from '@/Components/site-header';
import { SidebarInset, SidebarProvider } from '@/Components/ui/sidebar';
import { Head, Link, router } from '@inertiajs/react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/Components/ui/table';
import { Card, CardContent } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import {
    UserPlus,
    Search,
    Filter,
    Users,
    UserCheck,
    UserX,
    Edit2,
    Trash2,
} from 'lucide-react';
import { Input } from '@/Components/ui/input';

interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    created_at: string;
}

interface Props {
    karyawan: {
        data: User[];
        links: {
            url: string | null;
            label: string;
            active: boolean;
        }[];
        total: number;
    };
}

export default function Index({ karyawan }: Props) {
    return (
        <SidebarProvider>
            <AppSidebar variant="inset" />
            <SidebarInset>
                <SiteHeader />
                <Head title="Data Karyawan" />

                <div className="flex flex-1 flex-col pb-8">
                    <div className="flex flex-col gap-6 py-4 md:gap-8 md:py-8">
                        {/* Header Section */}
                        <div className="px-4 lg:px-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div>
                                <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                                    Data Karyawan
                                </h1>
                                <p className="text-gray-500">
                                    Kelola semua data karyawan di perusahaan
                                    Anda.
                                </p>
                            </div>
                            <Link href={route('karyawan.create')}>
                                <Button className="bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200 gap-2 h-12 px-6 rounded-full">
                                    <UserPlus className="w-4 h-4" />
                                    Undang Karyawan
                                </Button>
                            </Link>
                        </div>

                        {/* Stats Summary */}
                        <div className="grid gap-4 md:grid-cols-3 px-4 lg:px-6">
                            <Card className="border-none shadow-sm bg-white/50 backdrop-blur-sm">
                                <CardContent className="p-6 flex items-center gap-4">
                                    <div className="p-3 bg-indigo-100 rounded-2xl">
                                        <Users className="w-6 h-6 text-indigo-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">
                                            Total Karyawan
                                        </p>
                                        <p className="text-2xl font-bold text-gray-900">
                                            {karyawan.total}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card className="border-none shadow-sm bg-white/50 backdrop-blur-sm">
                                <CardContent className="p-6 flex items-center gap-4">
                                    <div className="p-3 bg-emerald-100 rounded-2xl">
                                        <UserCheck className="w-6 h-6 text-emerald-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">
                                            Aktif
                                        </p>
                                        <p className="text-2xl font-bold text-gray-900">
                                            {karyawan.total}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card className="border-none shadow-sm bg-white/50 backdrop-blur-sm">
                                <CardContent className="p-6 flex items-center gap-4">
                                    <div className="p-3 bg-amber-100 rounded-2xl">
                                        <UserX className="w-6 h-6 text-amber-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">
                                            Izin/Sakit
                                        </p>
                                        <p className="text-2xl font-bold text-gray-900">
                                            0
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Filters & Search */}
                        <div className="px-4 lg:px-6 flex flex-col md:flex-row gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <Input
                                    placeholder="Cari nama atau email..."
                                    className="pl-10 h-12 border-none shadow-sm bg-white rounded-xl"
                                />
                            </div>
                            <Button
                                variant="outline"
                                className="h-12 px-6 gap-2 border-none shadow-sm bg-white rounded-xl"
                            >
                                <Filter className="w-4 h-4" />
                                Filter
                            </Button>
                        </div>

                        {/* List Section */}
                        <div className="px-4 lg:px-6">
                            {/* Desktop Table View */}
                            <Card className="hidden md:block border-none shadow-sm overflow-hidden rounded-2xl bg-white">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-gray-50/50 hover:bg-gray-50/50">
                                            <TableHead className="w-[80px] py-4">
                                                Avatar
                                            </TableHead>
                                            <TableHead>Nama Karyawan</TableHead>
                                            <TableHead>Alamat Email</TableHead>
                                            <TableHead>
                                                Tanggal Bergabung
                                            </TableHead>
                                            <TableHead className="text-right">
                                                Aksi
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {karyawan.data.length > 0 ? (
                                            karyawan.data.map((user) => (
                                                <TableRow
                                                    key={user.id}
                                                    className="hover:bg-indigo-50/30 transition-colors group"
                                                >
                                                    <TableCell className="py-4">
                                                        <div className="relative">
                                                            <img
                                                                src={
                                                                    user.avatar ||
                                                                    `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=6366f1&color=fff`
                                                                }
                                                                alt={user.name}
                                                                className="w-12 h-12 rounded-2xl object-cover ring-2 ring-white shadow-sm"
                                                            />
                                                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full"></div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <span className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                                                            {user.name}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell className="text-gray-500 font-medium">
                                                        {user.email}
                                                    </TableCell>
                                                    <TableCell className="text-gray-400 text-sm">
                                                        {new Date(
                                                            user.created_at,
                                                        ).toLocaleDateString(
                                                            'id-ID',
                                                            {
                                                                day: 'numeric',
                                                                month: 'long',
                                                                year: 'numeric',
                                                            },
                                                        )}
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <div className="flex justify-end gap-2">
                                                            <Link
                                                                href={route(
                                                                    'karyawan.show',
                                                                    user.id,
                                                                )}
                                                            >
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className="rounded-full hover:bg-indigo-100 hover:text-indigo-600 h-9 w-9"
                                                                    title="Lihat Profil"
                                                                >
                                                                    <Users className="w-4 h-4" />
                                                                </Button>
                                                            </Link>
                                                            <Link
                                                                href={route(
                                                                    'karyawan.edit',
                                                                    user.id,
                                                                )}
                                                            >
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className="rounded-full hover:bg-amber-100 hover:text-amber-600 h-9 w-9"
                                                                    title="Edit Karyawan"
                                                                >
                                                                    <Edit2 className="w-4 h-4" />
                                                                </Button>
                                                            </Link>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                onClick={() => {
                                                                    if (
                                                                        confirm(
                                                                            'Apakah Anda yakin ingin menghapus karyawan ini? Semua data absensi terkait juga akan dihapus.',
                                                                        )
                                                                    ) {
                                                                        router.delete(
                                                                            route(
                                                                                'karyawan.destroy',
                                                                                user.id,
                                                                            ),
                                                                        );
                                                                    }
                                                                }}
                                                                className="rounded-full hover:bg-red-100 hover:text-red-600 h-9 w-9"
                                                                title="Hapus Karyawan"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </Button>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell
                                                    colSpan={5}
                                                    className="h-48 text-center text-gray-400"
                                                >
                                                    Belum ada data karyawan.
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </Card>

                            {/* Mobile Card View */}
                            <div className="grid gap-4 md:hidden">
                                {karyawan.data.length > 0 ? (
                                    karyawan.data.map((user) => (
                                        <Card
                                            key={user.id}
                                            className="border-none shadow-sm bg-white p-4"
                                        >
                                            <div className="flex items-center gap-4 mb-4">
                                                <div className="relative">
                                                    <img
                                                        src={
                                                            user.avatar ||
                                                            `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=6366f1&color=fff`
                                                        }
                                                        alt={user.name}
                                                        className="w-14 h-14 rounded-2xl object-cover"
                                                    />
                                                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full"></div>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="font-bold text-gray-900 truncate">
                                                        {user.name}
                                                    </h3>
                                                    <p className="text-sm text-gray-500 truncate">
                                                        {user.email}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                                                <span className="text-xs text-gray-400">
                                                    Gabung:{' '}
                                                    {new Date(
                                                        user.created_at,
                                                    ).toLocaleDateString(
                                                        'id-ID',
                                                        {
                                                            day: 'numeric',
                                                            month: 'short',
                                                            year: 'numeric',
                                                        },
                                                    )}
                                                </span>
                                                <div className="flex gap-2">
                                                    <Link
                                                        href={route(
                                                            'karyawan.edit',
                                                            user.id,
                                                        )}
                                                    >
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="rounded-lg h-9 text-amber-600"
                                                        >
                                                            Edit
                                                        </Button>
                                                    </Link>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => {
                                                            if (
                                                                confirm(
                                                                    'Hapus karyawan ini?',
                                                                )
                                                            ) {
                                                                router.delete(
                                                                    route(
                                                                        'karyawan.destroy',
                                                                        user.id,
                                                                    ),
                                                                );
                                                            }
                                                        }}
                                                        className="rounded-lg h-9 text-red-600"
                                                    >
                                                        Hapus
                                                    </Button>
                                                </div>
                                            </div>
                                        </Card>
                                    ))
                                ) : (
                                    <div className="py-12 text-center text-gray-400">
                                        Belum ada data karyawan.
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
