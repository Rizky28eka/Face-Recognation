import { AppSidebar } from '@/Components/app-sidebar';
import { SiteHeader } from '@/Components/site-header';
import { SidebarInset, SidebarProvider } from '@/Components/ui/sidebar';
import { Head, Link, router } from '@inertiajs/react';
import { Card, CardContent } from '@/Components/ui/card';
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
    Users,
    MapPin,
    Trash2,
    Edit2,
    Eye,
    Link as LinkIcon,
} from 'lucide-react';
import { toast } from 'sonner';
import React from 'react';

interface Tenant {
    id: number;
    name: string;
    slug: string;
    address: string;
    registration_token: string;
    users_count: number;
    branches_count: number;
    created_at: string;
}

interface Props {
    tenants: Tenant[];
}

export default function Tenants({ tenants }: Props) {
    const deleteTenant = (id: number) => {
        if (
            confirm(
                'Apakah Anda yakin ingin menghapus tenant ini beserta seluruh datanya? Tindakan ini tidak dapat dibatalkan.',
            )
        ) {
            router.delete(route('tenants.destroy', id), {
                onSuccess: () => toast.success('Tenant berhasil dihapus'),
                onError: (err: any) =>
                    toast.error(err.error || 'Gagal menghapus tenant'),
            });
        }
    };

    const copyInviteLink = (token: string) => {
        const url = `${window.location.origin}/join/${token}`;
        navigator.clipboard.writeText(url);
        toast.success('Link registrasi karyawan disalin ke clipboard');
    };

    return (
        <SidebarProvider>
            <AppSidebar variant="inset" />
            <SidebarInset>
                <SiteHeader />
                <Head title="Manajemen Tenant" />

                <div className="flex flex-1 flex-col pb-8">
                    <div className="flex flex-col gap-4 py-4 md:gap-8 md:py-8 px-4 lg:px-6 max-w-7xl mx-auto w-full">
                        {/* Header */}
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div>
                                <h1 className="text-xl md:text-3xl font-bold tracking-tight text-gray-900">
                                    Manajemen Tenant
                                </h1>
                                <p className="text-xs md:text-base text-gray-500 mt-1">
                                    Kelola klien dan perusahaan yang menggunakan
                                    sistem FaceLog.
                                </p>
                            </div>
                        </div>

                        {/* Desktop Table View */}
                        <Card className="hidden md:block border-none shadow-sm rounded-3xl bg-white overflow-hidden">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-gray-50/50">
                                        <TableHead className="font-bold py-4 pl-6">
                                            Perusahaan
                                        </TableHead>
                                        <TableHead className="font-bold">
                                            Slug
                                        </TableHead>
                                        <TableHead className="font-bold">
                                            Statistik
                                        </TableHead>
                                        <TableHead className="font-bold">
                                            Lokasi
                                        </TableHead>
                                        <TableHead className="text-right font-bold pr-6">
                                            Aksi
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {tenants.length > 0 ? (
                                        tenants.map((tenant) => (
                                            <TableRow
                                                key={tenant.id}
                                                className="hover:bg-indigo-50/30 transition-colors group"
                                            >
                                                <TableCell className="py-4 pl-6">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600">
                                                            <Building2 className="w-5 h-5" />
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-gray-900">
                                                                {tenant.name}
                                                            </p>
                                                            <p className="text-xs text-gray-500">
                                                                Dibuat{' '}
                                                                {new Date(
                                                                    tenant.created_at,
                                                                ).toLocaleDateString(
                                                                    'id-ID',
                                                                )}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <span className="text-sm font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded-md">
                                                        {tenant.slug}
                                                    </span>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex gap-4">
                                                        <div className="flex items-center gap-1.5 text-sm text-gray-600">
                                                            <Users className="w-4 h-4 text-gray-400" />
                                                            <span className="font-medium">
                                                                {
                                                                    tenant.users_count
                                                                }
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-1.5 text-sm text-gray-600">
                                                            <MapPin className="w-4 h-4 text-gray-400" />
                                                            <span className="font-medium">
                                                                {
                                                                    tenant.branches_count
                                                                }
                                                            </span>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-sm text-gray-600 max-w-[200px] truncate">
                                                    {tenant.address || '-'}
                                                </TableCell>
                                                <TableCell className="text-right pr-6">
                                                    <div className="flex justify-end gap-1">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() =>
                                                                copyInviteLink(
                                                                    tenant.registration_token,
                                                                )
                                                            }
                                                            className="h-8 w-8 rounded-full hover:bg-emerald-50 hover:text-emerald-600"
                                                            title="Salin Link Registrasi"
                                                        >
                                                            <LinkIcon className="w-4 h-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            asChild
                                                            className="h-8 w-8 rounded-full hover:bg-indigo-50 hover:text-indigo-600"
                                                        >
                                                            <Link
                                                                href={route(
                                                                    'tenants.show',
                                                                    tenant.id,
                                                                )}
                                                            >
                                                                <Eye className="w-4 h-4" />
                                                            </Link>
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            asChild
                                                            className="h-8 w-8 rounded-full hover:bg-amber-50 hover:text-amber-600"
                                                        >
                                                            <Link
                                                                href={route(
                                                                    'tenants.edit',
                                                                    tenant.id,
                                                                )}
                                                            >
                                                                <Edit2 className="w-4 h-4" />
                                                            </Link>
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() =>
                                                                deleteTenant(
                                                                    tenant.id,
                                                                )
                                                            }
                                                            className="h-8 w-8 rounded-full hover:bg-red-50 hover:text-red-600"
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
                                                <div className="flex flex-col items-center gap-2">
                                                    <Building2 className="w-10 h-10 text-gray-200" />
                                                    <p>
                                                        Belum ada tenant yang
                                                        terdaftar.
                                                    </p>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </Card>

                        {/* Mobile List View */}
                        <div className="flex flex-col gap-3 md:hidden">
                            {tenants.length > 0 ? (
                                tenants.map((tenant) => (
                                    <Card
                                        key={tenant.id}
                                        className="border-none shadow-sm bg-white overflow-hidden rounded-2xl"
                                    >
                                        <CardContent className="p-4">
                                            <div className="flex justify-between items-start mb-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
                                                        <Building2 className="w-5 h-5" />
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-gray-900 leading-tight">
                                                            {tenant.name}
                                                        </p>
                                                        <p className="text-[10px] text-gray-500 mt-0.5">
                                                            {tenant.slug}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-2 mb-4 bg-gray-50/50 rounded-xl p-3">
                                                <div className="flex flex-col gap-1">
                                                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                                                        Karyawan
                                                    </span>
                                                    <div className="flex items-center gap-1.5 text-sm font-bold text-indigo-600">
                                                        <Users className="w-4 h-4" />
                                                        {tenant.users_count}
                                                    </div>
                                                </div>
                                                <div className="flex flex-col gap-1">
                                                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                                                        Cabang
                                                    </span>
                                                    <div className="flex items-center gap-1.5 text-sm font-bold text-indigo-600">
                                                        <MapPin className="w-4 h-4" />
                                                        {tenant.branches_count}
                                                    </div>
                                                </div>
                                            </div>

                                            {tenant.address && (
                                                <div className="mb-4">
                                                    <p className="text-[10px] text-gray-500 truncate">
                                                        <span className="font-bold text-gray-400 mr-1">
                                                            Lokasi:
                                                        </span>
                                                        {tenant.address}
                                                    </p>
                                                </div>
                                            )}

                                            <div className="grid grid-cols-4 gap-2">
                                                <Button
                                                    variant="outline"
                                                    onClick={() =>
                                                        copyInviteLink(
                                                            tenant.registration_token,
                                                        )
                                                    }
                                                    className="rounded-xl h-10 border-emerald-100 text-emerald-600 hover:bg-emerald-50 bg-emerald-50/30"
                                                    title="Salin Link"
                                                >
                                                    <LinkIcon className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    asChild
                                                    className="rounded-xl h-10 border-indigo-100 text-indigo-600 hover:bg-indigo-50 bg-indigo-50/30"
                                                >
                                                    <Link
                                                        href={route(
                                                            'tenants.show',
                                                            tenant.id,
                                                        )}
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </Link>
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    asChild
                                                    className="rounded-xl h-10 border-amber-100 text-amber-600 hover:bg-amber-50 bg-amber-50/30"
                                                >
                                                    <Link
                                                        href={route(
                                                            'tenants.edit',
                                                            tenant.id,
                                                        )}
                                                    >
                                                        <Edit2 className="w-4 h-4" />
                                                    </Link>
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    onClick={() =>
                                                        deleteTenant(tenant.id)
                                                    }
                                                    className="rounded-xl h-10 border-red-100 text-red-600 hover:bg-red-50 bg-red-50/30"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))
                            ) : (
                                <Card className="border-dashed border-2 bg-gray-50/50 shadow-none">
                                    <CardContent className="flex flex-col items-center justify-center p-8 text-center text-gray-400">
                                        <Building2 className="w-10 h-10 text-gray-300 mb-3" />
                                        <p className="text-sm">
                                            Belum ada tenant terdaftar.
                                        </p>
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
