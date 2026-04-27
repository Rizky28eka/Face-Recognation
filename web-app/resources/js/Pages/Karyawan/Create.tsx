import { AppSidebar } from '@/Components/app-sidebar';
import { SiteHeader } from '@/Components/site-header';
import { SidebarInset, SidebarProvider } from '@/Components/ui/sidebar';
import { Head, Link, router } from '@inertiajs/react';
import { Card } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { ArrowLeft, UserPlus } from 'lucide-react';
import { toast } from 'sonner';

import { useEffect } from 'react';
import { usePage } from '@inertiajs/react';

export default function Create({ invite_url }: { invite_url: string }) {
    const { flash } = usePage().props as any;

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }
    }, [flash]);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(invite_url);
        toast.success('Link undangan berhasil disalin!');
    };

    return (
        <SidebarProvider>
            <AppSidebar variant="inset" />
            <SidebarInset>
                <SiteHeader />
                <Head title="Undang Karyawan" />

                <div className="flex flex-1 flex-col pb-8">
                    <div className="flex flex-col gap-6 py-4 md:gap-8 md:py-8 px-4 lg:px-6">
                        {/* Header Section */}
                        <div className="flex items-center gap-4 max-w-2xl mx-auto w-full">
                            <Link href={route('karyawan.index')}>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="rounded-full bg-white shadow-sm hover:bg-gray-50 h-10 w-10 md:h-12 md:w-12"
                                >
                                    <ArrowLeft className="w-5 h-5 text-gray-600" />
                                </Button>
                            </Link>
                            <div>
                                <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900">
                                    Undang Karyawan
                                </h1>
                                <p className="text-sm md:text-base text-gray-500">
                                    Gunakan link di bawah untuk mengundang
                                    karyawan baru.
                                </p>
                            </div>
                        </div>

                        {/* Link Section */}
                        <div className="max-w-2xl mx-auto w-full">
                            <Card className="border-none shadow-xl rounded-3xl bg-white overflow-hidden">
                                <div className="p-8 md:p-12 text-center space-y-8">
                                    <div className="mx-auto w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center">
                                        <UserPlus className="w-10 h-10 text-indigo-600" />
                                    </div>

                                    <div className="space-y-2">
                                        <h2 className="text-xl font-bold text-gray-900">
                                            Link Undangan Pendaftaran
                                        </h2>
                                        <p className="text-gray-500 text-sm max-w-md mx-auto">
                                            Kirimkan link ini kepada karyawan
                                            Anda. Mereka dapat mengisi data diri
                                            dan memilih shift secara mandiri.
                                        </p>
                                    </div>

                                    <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex items-center gap-4 group">
                                        <div className="flex-1 text-left overflow-hidden">
                                            <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-1">
                                                Link URL
                                            </p>
                                            <p className="text-sm font-mono text-gray-600 truncate">
                                                {invite_url}
                                            </p>
                                        </div>
                                        <Button
                                            onClick={copyToClipboard}
                                            className="bg-white hover:bg-gray-50 text-indigo-600 border border-gray-100 shadow-sm rounded-xl font-bold h-12"
                                        >
                                            Salin Link
                                        </Button>
                                    </div>

                                    <div className="pt-4 border-t border-gray-50 flex flex-col md:flex-row items-center justify-center gap-6">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center">
                                                <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                                            </div>
                                            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                                                Link Aktif
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 bg-amber-50 rounded-lg flex items-center justify-center">
                                                <div className="w-2 h-2 bg-amber-500 rounded-full" />
                                            </div>
                                            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                                                Gratis
                                            </span>
                                        </div>
                                    </div>

                                    <div className="pt-4 flex justify-center">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => {
                                                if (
                                                    confirm(
                                                        'Apakah Anda yakin ingin memperbarui link? Link lama tidak akan bisa digunakan lagi.',
                                                    )
                                                ) {
                                                    router.post(
                                                        route(
                                                            'karyawan.reset-invite',
                                                        ),
                                                    );
                                                }
                                            }}
                                            className="text-xs text-gray-400 hover:text-red-500 transition-colors"
                                        >
                                            Reset & Buat Link Baru
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
