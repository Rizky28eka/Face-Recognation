import { AppSidebar } from '@/Components/app-sidebar';
import { SiteHeader } from '@/Components/site-header';
import { SidebarInset, SidebarProvider } from '@/Components/ui/sidebar';
import { Head, Link } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/Components/ui/table';
import { Button } from '@/Components/ui/button';
import {
    Building2,
    MapPin,
    ArrowLeft,
    Users,
    CheckCircle2,
    XCircle,
    Copy,
    KeySquare,
} from 'lucide-react';
import { toast } from 'sonner';

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    is_face_registered: boolean;
}

interface Branch {
    id: number;
    name: string;
    latitude: string;
    longitude: string;
    radius: number;
    is_active: boolean;
}

interface Tenant {
    id: number;
    name: string;
    slug: string;
    address: string;
    registration_token: string;
    created_at: string;
    users: User[];
    branches: Branch[];
}

interface Props {
    tenant: Tenant;
}

export default function TenantShow({ tenant }: Props) {
    const copyInviteLink = () => {
        const url = `${window.location.origin}/join/${tenant.registration_token}`;
        navigator.clipboard.writeText(url);
        toast.success('Link registrasi karyawan disalin ke clipboard');
    };

    return (
        <SidebarProvider>
            <AppSidebar variant="inset" />
            <SidebarInset>
                <SiteHeader />
                <Head title={`Detail Tenant - ${tenant.name}`} />

                <div className="flex flex-1 flex-col pb-8">
                    <div className="flex flex-col gap-4 py-4 md:gap-8 md:py-8 px-4 lg:px-6 max-w-7xl mx-auto w-full">
                        {/* Header */}
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div className="flex items-start md:items-center gap-3 md:gap-4">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    asChild
                                    className="rounded-full w-9 h-9 md:w-10 md:h-10 border-gray-200 shrink-0 mt-0.5 md:mt-0"
                                >
                                    <Link href={route('tenants.index')}>
                                        <ArrowLeft className="w-4 h-4 md:w-5 md:h-5 text-gray-500" />
                                    </Link>
                                </Button>
                                <div>
                                    <h1 className="text-xl md:text-3xl font-bold tracking-tight text-gray-900 flex items-center gap-2 leading-tight">
                                        <Building2 className="w-5 h-5 md:w-6 md:h-6 text-indigo-600 shrink-0" />
                                        <span className="truncate max-w-[200px] sm:max-w-xs md:max-w-none">
                                            {tenant.name}
                                        </span>
                                    </h1>
                                    <p className="text-[10px] md:text-base text-gray-500 flex items-center gap-1.5 md:gap-2 mt-0.5 md:mt-1 truncate max-w-[250px] sm:max-w-xs md:max-w-none">
                                        <MapPin className="w-3.5 h-3.5 md:w-4 md:h-4 shrink-0" />
                                        {tenant.address ||
                                            'Alamat belum diatur'}
                                    </p>
                                </div>
                            </div>
                            <Button
                                onClick={copyInviteLink}
                                variant="outline"
                                className="w-full md:w-auto rounded-xl md:rounded-2xl font-bold border-indigo-200 text-indigo-700 bg-indigo-50 hover:bg-indigo-100 h-10 md:h-11"
                            >
                                <Copy className="w-4 h-4 mr-2" />
                                Salin Link Pendaftaran
                            </Button>
                        </div>

                        {/* Grid for Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                            {/* General Info */}
                            <Card className="rounded-2xl md:rounded-3xl border-none shadow-sm md:col-span-1">
                                <CardHeader className="p-4 md:p-6 pb-2">
                                    <CardTitle className="text-base md:text-lg font-bold text-gray-900">
                                        Informasi Umum
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-4 md:p-6 pt-0 space-y-4">
                                    <div className="bg-gray-50/50 p-3 rounded-xl">
                                        <p className="text-[10px] md:text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">
                                            Slug
                                        </p>
                                        <p className="text-sm md:text-base font-bold text-gray-900">
                                            {tenant.slug}
                                        </p>
                                    </div>
                                    <div className="bg-gray-50/50 p-3 rounded-xl">
                                        <p className="text-[10px] md:text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">
                                            Registration Token
                                        </p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <code className="text-[10px] md:text-xs bg-white border border-gray-100 px-2 py-1 rounded text-gray-700 font-mono break-all">
                                                {tenant.registration_token}
                                            </code>
                                        </div>
                                    </div>
                                    <div className="bg-gray-50/50 p-3 rounded-xl">
                                        <p className="text-[10px] md:text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">
                                            Tanggal Terdaftar
                                        </p>
                                        <p className="text-sm md:text-base font-bold text-gray-900">
                                            {new Date(
                                                tenant.created_at,
                                            ).toLocaleDateString('id-ID', {
                                                day: 'numeric',
                                                month: 'long',
                                                year: 'numeric',
                                            })}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Branches Info */}
                            <Card className="rounded-2xl md:rounded-3xl border-none shadow-sm md:col-span-2 overflow-hidden flex flex-col">
                                <CardHeader className="bg-gray-50/50 p-4 md:p-6 md:pb-4 border-b border-gray-50">
                                    <CardTitle className="text-base md:text-lg font-bold text-gray-900 flex items-center justify-between">
                                        <span>
                                            Cabang Terdaftar (
                                            {tenant.branches.length})
                                        </span>
                                        <MapPin className="w-4 h-4 md:w-5 md:h-5 text-gray-400" />
                                    </CardTitle>
                                </CardHeader>

                                {/* Desktop Table View */}
                                <div className="hidden md:block overflow-auto flex-1 max-h-[300px]">
                                    <Table>
                                        <TableHeader className="sticky top-0 bg-white shadow-sm z-10">
                                            <TableRow>
                                                <TableHead className="pl-6">
                                                    Nama Cabang
                                                </TableHead>
                                                <TableHead>Lokasi</TableHead>
                                                <TableHead>Radius</TableHead>
                                                <TableHead>Status</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {tenant.branches.length > 0 ? (
                                                tenant.branches.map(
                                                    (branch) => (
                                                        <TableRow
                                                            key={branch.id}
                                                        >
                                                            <TableCell className="font-bold text-gray-900 pl-6">
                                                                {branch.name}
                                                            </TableCell>
                                                            <TableCell className="text-xs text-gray-500">
                                                                {
                                                                    branch.latitude
                                                                }
                                                                ,{' '}
                                                                {
                                                                    branch.longitude
                                                                }
                                                            </TableCell>
                                                            <TableCell>
                                                                {branch.radius}m
                                                            </TableCell>
                                                            <TableCell>
                                                                {branch.is_active ? (
                                                                    <span className="text-xs font-bold bg-emerald-100 text-emerald-700 px-2 py-1 rounded-md">
                                                                        Aktif
                                                                    </span>
                                                                ) : (
                                                                    <span className="text-xs font-bold bg-red-100 text-red-700 px-2 py-1 rounded-md">
                                                                        Nonaktif
                                                                    </span>
                                                                )}
                                                            </TableCell>
                                                        </TableRow>
                                                    ),
                                                )
                                            ) : (
                                                <TableRow>
                                                    <TableCell
                                                        colSpan={4}
                                                        className="text-center py-8 text-gray-400"
                                                    >
                                                        Belum ada cabang.
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>

                                {/* Mobile List View */}
                                <div className="md:hidden flex flex-col p-4 gap-3 bg-white max-h-[300px] overflow-y-auto">
                                    {tenant.branches.length > 0 ? (
                                        tenant.branches.map((branch) => (
                                            <div
                                                key={branch.id}
                                                className="border border-gray-100 rounded-xl p-3 shadow-sm bg-gray-50/30"
                                            >
                                                <div className="flex justify-between items-start mb-2">
                                                    <div>
                                                        <h4 className="font-bold text-sm text-gray-900">
                                                            {branch.name}
                                                        </h4>
                                                        <p className="text-[10px] text-gray-500 flex items-center gap-1 mt-0.5">
                                                            <MapPin className="w-3 h-3" />
                                                            {branch.latitude},{' '}
                                                            {branch.longitude}
                                                        </p>
                                                    </div>
                                                    {branch.is_active ? (
                                                        <span className="text-[10px] font-bold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded uppercase">
                                                            Aktif
                                                        </span>
                                                    ) : (
                                                        <span className="text-[10px] font-bold bg-red-100 text-red-700 px-2 py-0.5 rounded uppercase">
                                                            Nonaktif
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-xs font-bold text-indigo-600">
                                                    Radius: {branch.radius}m
                                                </p>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-6 text-sm text-gray-400">
                                            Belum ada cabang.
                                        </div>
                                    )}
                                </div>
                            </Card>

                            {/* Users Info */}
                            <Card className="rounded-2xl md:rounded-3xl border-none shadow-sm md:col-span-3 overflow-hidden flex flex-col md:mt-2">
                                <CardHeader className="bg-gray-50/50 p-4 md:p-6 md:pb-4 border-b border-gray-50">
                                    <CardTitle className="text-base md:text-lg font-bold text-gray-900 flex items-center justify-between">
                                        <span>
                                            Pengguna Terdaftar (
                                            {tenant.users.length})
                                        </span>
                                        <Users className="w-4 h-4 md:w-5 md:h-5 text-gray-400" />
                                    </CardTitle>
                                </CardHeader>

                                {/* Desktop Table View */}
                                <div className="hidden md:block overflow-auto max-h-[400px]">
                                    <Table>
                                        <TableHeader className="sticky top-0 bg-white shadow-sm z-10">
                                            <TableRow>
                                                <TableHead className="pl-6">
                                                    Nama Lengkap
                                                </TableHead>
                                                <TableHead>Email</TableHead>
                                                <TableHead>
                                                    Peran (Role)
                                                </TableHead>
                                                <TableHead>
                                                    Status Wajah
                                                </TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {tenant.users.length > 0 ? (
                                                tenant.users.map((user) => (
                                                    <TableRow key={user.id}>
                                                        <TableCell className="font-bold text-gray-900 pl-6">
                                                            {user.name}
                                                        </TableCell>
                                                        <TableCell className="text-gray-500">
                                                            {user.email}
                                                        </TableCell>
                                                        <TableCell>
                                                            <span
                                                                className={`text-xs font-bold px-2 py-1 rounded-md uppercase tracking-wider
                                                                ${user.role === 'owner' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}
                                                            `}
                                                            >
                                                                {user.role}
                                                            </span>
                                                        </TableCell>
                                                        <TableCell>
                                                            {user.is_face_registered ? (
                                                                <div className="flex items-center gap-1.5 text-emerald-600 text-sm font-medium">
                                                                    <CheckCircle2 className="w-4 h-4" />
                                                                    Terdaftar
                                                                </div>
                                                            ) : (
                                                                <div className="flex items-center gap-1.5 text-red-500 text-sm font-medium">
                                                                    <XCircle className="w-4 h-4" />
                                                                    Belum
                                                                </div>
                                                            )}
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            ) : (
                                                <TableRow>
                                                    <TableCell
                                                        colSpan={4}
                                                        className="text-center py-8 text-gray-400"
                                                    >
                                                        Belum ada pengguna.
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>

                                {/* Mobile List View */}
                                <div className="md:hidden flex flex-col p-4 gap-3 bg-white max-h-[400px] overflow-y-auto">
                                    {tenant.users.length > 0 ? (
                                        tenant.users.map((user) => (
                                            <div
                                                key={user.id}
                                                className="border border-gray-100 rounded-xl p-3 shadow-sm bg-gray-50/30"
                                            >
                                                <div className="flex justify-between items-start mb-1.5">
                                                    <h4 className="font-bold text-sm text-gray-900 truncate pr-2">
                                                        {user.name}
                                                    </h4>
                                                    <span
                                                        className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider shrink-0
                                                        ${user.role === 'owner' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}
                                                    `}
                                                    >
                                                        {user.role}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-gray-500 truncate mb-2">
                                                    {user.email}
                                                </p>
                                                <div className="flex items-center justify-between border-t border-gray-100 pt-2">
                                                    <span className="text-[10px] text-gray-400 font-bold uppercase">
                                                        Status Wajah
                                                    </span>
                                                    {user.is_face_registered ? (
                                                        <div className="flex items-center gap-1 text-emerald-600 text-[11px] font-bold">
                                                            <CheckCircle2 className="w-3.5 h-3.5" />
                                                            TERDAFTAR
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-center gap-1 text-red-500 text-[11px] font-bold">
                                                            <XCircle className="w-3.5 h-3.5" />
                                                            BELUM
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-6 text-sm text-gray-400">
                                            Belum ada pengguna.
                                        </div>
                                    )}
                                </div>
                            </Card>
                        </div>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
