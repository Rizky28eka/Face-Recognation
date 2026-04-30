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
    Users,
    UserCheck,
    UserX,
    Edit2,
    Trash2,
    Eye,
} from 'lucide-react';
import { Input } from '@/Components/ui/input';
import { useState } from 'react';

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

function avatarUrl(name: string, avatar?: string) {
    return (
        avatar ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=6366f1&color=fff`
    );
}

function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });
}

export default function Index({ karyawan }: Props) {
    const [search, setSearch] = useState('');

    const filtered = karyawan.data.filter(
        (u) =>
            u.name.toLowerCase().includes(search.toLowerCase()) ||
            u.email.toLowerCase().includes(search.toLowerCase()),
    );

    const handleDelete = (userId: number, name: string) => {
        if (
            confirm(
                `Apakah Anda yakin ingin menghapus karyawan "${name}"? Semua data absensi terkait juga akan dihapus.`,
            )
        ) {
            router.delete(route('karyawan.destroy', userId));
        }
    };

    return (
        <SidebarProvider>
            <AppSidebar variant="inset" />
            <SidebarInset>
                <SiteHeader />
                <Head title="Data Karyawan" />

                <div className="flex flex-1 flex-col pb-8">
                    <div className="flex flex-col gap-4 py-4 md:gap-8 md:py-8">
                        {/* ── Header ── */}
                        <div className="px-4 lg:px-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                            <div>
                                <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900">
                                    Data Karyawan
                                </h1>
                                <p className="text-sm text-gray-500 mt-1">
                                    Kelola semua data karyawan di perusahaan
                                    Anda.
                                </p>
                            </div>
                            <Link
                                href={route('karyawan.create')}
                                className="w-full md:w-auto"
                            >
                                <Button className="w-full md:w-auto bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200 gap-2 h-11 px-6 rounded-full">
                                    <UserPlus className="w-4 h-4" />
                                    Undang Karyawan
                                </Button>
                            </Link>
                        </div>

                        {/* ── Stats Summary ── */}
                        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 px-4 lg:px-6">
                            <Card className="border-none shadow-sm bg-white col-span-2 md:col-span-1">
                                <CardContent className="p-4 flex items-center gap-3">
                                    <div className="p-2.5 bg-indigo-100 rounded-xl shrink-0">
                                        <Users className="w-5 h-5 text-indigo-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-medium text-gray-500">
                                            Total Karyawan
                                        </p>
                                        <p className="text-2xl font-bold text-gray-900">
                                            {karyawan.total}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card className="border-none shadow-sm bg-white">
                                <CardContent className="p-4 flex items-center gap-3">
                                    <div className="p-2.5 bg-emerald-100 rounded-xl shrink-0">
                                        <UserCheck className="w-5 h-5 text-emerald-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-medium text-gray-500">
                                            Aktif
                                        </p>
                                        <p className="text-2xl font-bold text-gray-900">
                                            {karyawan.total}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card className="border-none shadow-sm bg-white">
                                <CardContent className="p-4 flex items-center gap-3">
                                    <div className="p-2.5 bg-amber-100 rounded-xl shrink-0">
                                        <UserX className="w-5 h-5 text-amber-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-medium text-gray-500">
                                            Izin/Sakit
                                        </p>
                                        <p className="text-2xl font-bold text-gray-900">
                                            0
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* ── Search ── */}
                        <div className="px-4 lg:px-6">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <Input
                                    placeholder="Cari nama atau email..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="pl-10 h-11 border-none shadow-sm bg-white rounded-xl"
                                />
                            </div>
                        </div>

                        {/* ── List ── */}
                        <div className="px-4 lg:px-6">
                            {/* Desktop Table */}
                            <Card className="hidden md:block border-none shadow-sm overflow-hidden rounded-2xl bg-white">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-gray-50/50 hover:bg-gray-50/50">
                                            <TableHead className="w-[72px] py-4">
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
                                        {filtered.length > 0 ? (
                                            filtered.map((user) => (
                                                <TableRow
                                                    key={user.id}
                                                    className="hover:bg-indigo-50/30 transition-colors group"
                                                >
                                                    <TableCell className="py-3">
                                                        <div className="relative w-10 h-10">
                                                            <img
                                                                src={avatarUrl(
                                                                    user.name,
                                                                    user.avatar,
                                                                )}
                                                                alt={user.name}
                                                                className="w-10 h-10 rounded-xl object-cover ring-2 ring-white shadow-sm"
                                                            />
                                                            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <span className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                                                            {user.name}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell className="text-gray-500 font-medium text-sm">
                                                        {user.email}
                                                    </TableCell>
                                                    <TableCell className="text-gray-400 text-sm">
                                                        {formatDate(
                                                            user.created_at,
                                                        )}
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <div className="flex justify-end gap-1">
                                                            <Link
                                                                href={route(
                                                                    'karyawan.show',
                                                                    user.id,
                                                                )}
                                                            >
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className="rounded-full hover:bg-indigo-100 hover:text-indigo-600 h-8 w-8"
                                                                    title="Lihat Profil"
                                                                >
                                                                    <Eye className="w-4 h-4" />
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
                                                                    className="rounded-full hover:bg-amber-100 hover:text-amber-600 h-8 w-8"
                                                                    title="Edit"
                                                                >
                                                                    <Edit2 className="w-4 h-4" />
                                                                </Button>
                                                            </Link>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                onClick={() =>
                                                                    handleDelete(
                                                                        user.id,
                                                                        user.name,
                                                                    )
                                                                }
                                                                className="rounded-full hover:bg-red-100 hover:text-red-600 h-8 w-8"
                                                                title="Hapus"
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
                                                    className="h-40 text-center text-gray-400"
                                                >
                                                    {search
                                                        ? 'Tidak ada hasil pencarian.'
                                                        : 'Belum ada data karyawan.'}
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </Card>

                            {/* Mobile Card List */}
                            <div className="flex flex-col gap-3 md:hidden">
                                {filtered.length > 0 ? (
                                    filtered.map((user) => (
                                        <Card
                                            key={user.id}
                                            className="border-none shadow-sm bg-white"
                                        >
                                            <CardContent className="p-4">
                                                <div className="flex items-center gap-3 mb-3">
                                                    <div className="relative shrink-0">
                                                        <img
                                                            src={avatarUrl(
                                                                user.name,
                                                                user.avatar,
                                                            )}
                                                            alt={user.name}
                                                            className="w-12 h-12 rounded-2xl object-cover"
                                                        />
                                                        <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h3 className="font-bold text-gray-900 truncate">
                                                            {user.name}
                                                        </h3>
                                                        <p className="text-sm text-gray-500 truncate">
                                                            {user.email}
                                                        </p>
                                                        <p className="text-xs text-gray-400 mt-0.5">
                                                            Bergabung{' '}
                                                            {formatDate(
                                                                user.created_at,
                                                            )}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2 pt-3 border-t border-gray-50">
                                                    <Link
                                                        href={route(
                                                            'karyawan.show',
                                                            user.id,
                                                        )}
                                                        className="flex-1"
                                                    >
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="w-full rounded-lg h-9 text-indigo-600 border-indigo-100 hover:bg-indigo-50 font-semibold"
                                                        >
                                                            <Eye className="w-3.5 h-3.5 mr-1.5" />
                                                            Lihat
                                                        </Button>
                                                    </Link>
                                                    <Link
                                                        href={route(
                                                            'karyawan.edit',
                                                            user.id,
                                                        )}
                                                        className="flex-1"
                                                    >
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="w-full rounded-lg h-9 text-amber-600 border-amber-100 hover:bg-amber-50 font-semibold"
                                                        >
                                                            <Edit2 className="w-3.5 h-3.5 mr-1.5" />
                                                            Edit
                                                        </Button>
                                                    </Link>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() =>
                                                            handleDelete(
                                                                user.id,
                                                                user.name,
                                                            )
                                                        }
                                                        className="flex-1 rounded-lg h-9 text-red-600 border-red-100 hover:bg-red-50 font-semibold"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                                                        Hapus
                                                    </Button>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))
                                ) : (
                                    <div className="py-12 text-center text-gray-400 bg-white rounded-2xl shadow-sm">
                                        {search
                                            ? 'Tidak ada hasil pencarian.'
                                            : 'Belum ada data karyawan.'}
                                    </div>
                                )}
                            </div>

                            {/* Pagination */}
                            {karyawan.links.length > 3 && (
                                <div className="flex flex-wrap justify-center gap-1 mt-6">
                                    {karyawan.links.map((link, i) => (
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
