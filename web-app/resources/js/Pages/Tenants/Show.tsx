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
    KeySquare,
    CheckCircle2,
    XCircle,
    Copy,
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
                    <div className="flex flex-col gap-6 py-4 md:gap-8 md:py-8 px-4 lg:px-6 max-w-7xl mx-auto w-full">
                        {/* Header */}
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div className="flex items-center gap-4">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    asChild
                                    className="rounded-full w-10 h-10 border-gray-200"
                                >
                                    <Link href={route('tenants.index')}>
                                        <ArrowLeft className="w-5 h-5 text-gray-500" />
                                    </Link>
                                </Button>
                                <div>
                                    <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900 flex items-center gap-2">
                                        <Building2 className="w-6 h-6 text-indigo-600" />
                                        {tenant.name}
                                    </h1>
                                    <p className="text-sm md:text-base text-gray-500 flex items-center gap-2 mt-1">
                                        <MapPin className="w-4 h-4" />
                                        {tenant.address ||
                                            'Alamat belum diatur'}
                                    </p>
                                </div>
                            </div>
                            <Button
                                onClick={copyInviteLink}
                                variant="outline"
                                className="rounded-2xl font-bold border-indigo-200 text-indigo-700 bg-indigo-50 hover:bg-indigo-100"
                            >
                                <Copy className="w-4 h-4 mr-2" />
                                Salin Link Pendaftaran
                            </Button>
                        </div>

                        {/* Grid for Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* General Info */}
                            <Card className="rounded-3xl border-none shadow-sm md:col-span-1">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-lg font-bold text-gray-900">
                                        Informasi Umum
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">
                                            Slug
                                        </p>
                                        <p className="text-base font-bold text-gray-900">
                                            {tenant.slug}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">
                                            Registration Token
                                        </p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <code className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-700 font-mono">
                                                {tenant.registration_token}
                                            </code>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">
                                            Tanggal Terdaftar
                                        </p>
                                        <p className="text-base font-bold text-gray-900">
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
                            <Card className="rounded-3xl border-none shadow-sm md:col-span-2 overflow-hidden flex flex-col">
                                <CardHeader className="bg-gray-50/50 pb-4 border-b border-gray-50">
                                    <CardTitle className="text-lg font-bold text-gray-900 flex items-center justify-between">
                                        <span>
                                            Cabang Terdaftar (
                                            {tenant.branches.length})
                                        </span>
                                        <MapPin className="w-5 h-5 text-gray-400" />
                                    </CardTitle>
                                </CardHeader>
                                <div className="overflow-auto flex-1 max-h-[300px]">
                                    <Table>
                                        <TableHeader className="sticky top-0 bg-white shadow-sm z-10">
                                            <TableRow>
                                                <TableHead>
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
                                                            <TableCell className="font-bold text-gray-900">
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
                            </Card>

                            {/* Users Info */}
                            <Card className="rounded-3xl border-none shadow-sm md:col-span-3 overflow-hidden flex flex-col mt-2">
                                <CardHeader className="bg-gray-50/50 pb-4 border-b border-gray-50">
                                    <CardTitle className="text-lg font-bold text-gray-900 flex items-center justify-between">
                                        <span>
                                            Pengguna Terdaftar (
                                            {tenant.users.length})
                                        </span>
                                        <Users className="w-5 h-5 text-gray-400" />
                                    </CardTitle>
                                </CardHeader>
                                <div className="overflow-auto max-h-[400px]">
                                    <Table>
                                        <TableHeader className="sticky top-0 bg-white shadow-sm z-10">
                                            <TableRow>
                                                <TableHead>
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
                                                        <TableCell className="font-bold text-gray-900">
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
                            </Card>
                        </div>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
