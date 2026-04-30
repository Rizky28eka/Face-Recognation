import { AppSidebar } from '@/Components/app-sidebar';
import { SiteHeader } from '@/Components/site-header';
import { SidebarInset, SidebarProvider } from '@/Components/ui/sidebar';
import { Head, Link, useForm } from '@inertiajs/react';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
    CardFooter,
} from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Building2, ArrowLeft, Save } from 'lucide-react';
import { toast } from 'sonner';
import React from 'react';

interface Tenant {
    id: number;
    name: string;
    slug: string;
    address: string;
}

interface Props {
    tenant: Tenant;
}

export default function TenantEdit({ tenant }: Props) {
    const { data, setData, patch, processing, errors } = useForm({
        name: tenant.name,
        slug: tenant.slug,
        address: tenant.address || '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        patch(route('tenants.update', tenant.id), {
            onSuccess: () => {
                toast.success('Data tenant berhasil diperbarui');
            },
        });
    };

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setData('name', e.target.value);
    };

    return (
        <SidebarProvider>
            <AppSidebar variant="inset" />
            <SidebarInset>
                <SiteHeader />
                <Head title={`Edit Tenant - ${tenant.name}`} />

                <div className="flex flex-1 flex-col pb-8">
                    <div className="flex flex-col gap-6 py-4 md:gap-8 md:py-8 px-4 lg:px-6 max-w-3xl mx-auto w-full">
                        {/* Header */}
                        <div className="flex items-center gap-4 mb-2">
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
                                <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900">
                                    Edit Tenant
                                </h1>
                                <p className="text-sm md:text-base text-gray-500 mt-1">
                                    Perbarui informasi perusahaan klien.
                                </p>
                            </div>
                        </div>

                        <form onSubmit={submit}>
                            <Card className="rounded-3xl border-none shadow-sm overflow-hidden">
                                <CardHeader className="bg-gray-50/50 pb-6 border-b border-gray-100">
                                    <div className="flex items-center gap-2">
                                        <Building2 className="w-5 h-5 text-indigo-600" />
                                        <CardTitle className="text-lg font-bold text-gray-900">
                                            Data Perusahaan
                                        </CardTitle>
                                    </div>
                                    <CardDescription>
                                        Pastikan data yang dimasukkan sesuai
                                        dengan informasi perusahaan saat ini.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="p-6 space-y-6">
                                    <div className="space-y-2">
                                        <Label
                                            htmlFor="name"
                                            className="text-sm font-bold text-gray-700"
                                        >
                                            Nama Perusahaan
                                        </Label>
                                        <Input
                                            id="name"
                                            value={data.name}
                                            onChange={handleNameChange}
                                            placeholder="PT Sukses Makmur"
                                            className="h-12 rounded-xl border-gray-200 bg-gray-50 focus:bg-white"
                                            required
                                        />
                                        {errors.name && (
                                            <p className="text-xs text-red-500 font-medium">
                                                {errors.name}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label
                                            htmlFor="slug"
                                            className="text-sm font-bold text-gray-700"
                                        >
                                            URL Slug
                                        </Label>
                                        <Input
                                            id="slug"
                                            value={data.slug}
                                            onChange={(e) =>
                                                setData('slug', e.target.value)
                                            }
                                            placeholder="pt-sukses-makmur"
                                            className="h-12 rounded-xl border-gray-200 bg-gray-50 focus:bg-white font-mono"
                                            required
                                        />
                                        {errors.slug && (
                                            <p className="text-xs text-red-500 font-medium">
                                                {errors.slug}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label
                                            htmlFor="address"
                                            className="text-sm font-bold text-gray-700"
                                        >
                                            Alamat Lengkap
                                        </Label>
                                        <Input
                                            id="address"
                                            value={data.address}
                                            onChange={(e) =>
                                                setData(
                                                    'address',
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="Jl. Jendral Sudirman..."
                                            className="h-12 rounded-xl border-gray-200 bg-gray-50 focus:bg-white"
                                        />
                                        {errors.address && (
                                            <p className="text-xs text-red-500 font-medium">
                                                {errors.address}
                                            </p>
                                        )}
                                    </div>
                                </CardContent>
                                <CardFooter className="p-6 bg-gray-50/50 border-t border-gray-100 flex justify-end gap-3">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        asChild
                                        className="rounded-xl font-bold text-gray-500"
                                    >
                                        <Link href={route('tenants.index')}>
                                            Batal
                                        </Link>
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={processing}
                                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 rounded-xl font-bold shadow-lg shadow-indigo-200"
                                    >
                                        <Save className="w-4 h-4 mr-2" />
                                        Simpan Perubahan
                                    </Button>
                                </CardFooter>
                            </Card>
                        </form>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
