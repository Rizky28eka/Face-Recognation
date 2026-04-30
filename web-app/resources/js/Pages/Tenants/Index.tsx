import { AppSidebar } from '@/Components/app-sidebar';
import { SiteHeader } from '@/Components/site-header';
import { SidebarInset, SidebarProvider } from '@/Components/ui/sidebar';
import { Head, Link, router } from '@inertiajs/react';
import { Card } from '@/Components/ui/card';
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
                    <div className="flex flex-col gap-6 py-4 md:gap-8 md:py-8 px-4 lg:px-6 max-w-7xl mx-auto w-full">
                        {/* Header */}
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div>
                                <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900">
                                    Manajemen Tenant
                                </h1>
                                <p className="text-sm md:text-base text-gray-500">
                                    Kelola klien dan perusahaan yang menggunakan
                                    sistem FaceLog.
                                </p>
                            </div>
                        </div>

                        {/* Tenant Table */}
                        <Card className="border-none shadow-sm rounded-3xl bg-white overflow-hidden">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-gray-50/50">
                                        <TableHead className="font-bold py-4">
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
                                        <TableHead className="text-right font-bold">
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
                                                <TableCell className="py-4">
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
                                                <TableCell className="text-right">
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
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
