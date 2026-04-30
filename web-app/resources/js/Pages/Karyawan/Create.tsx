import { AppSidebar } from '@/Components/app-sidebar';
import { SiteHeader } from '@/Components/site-header';
import { SidebarInset, SidebarProvider } from '@/Components/ui/sidebar';
import { Head, Link, router } from '@inertiajs/react';
import { Card, CardContent } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import {
    ArrowLeft,
    UserPlus,
    Copy,
    RefreshCw,
    Shield,
    Zap,
} from 'lucide-react';
import { toast } from 'sonner';
import { useEffect } from 'react';
import { usePage } from '@inertiajs/react';

export default function Create({ invite_url }: { invite_url: string }) {
    const { flash } = usePage().props as { flash?: { success?: string } };

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
                    <div className="flex flex-col gap-4 py-4 md:gap-8 md:py-8 px-4 lg:px-6">
                        {/* ── Header ── */}
                        <div className="flex items-center gap-3 max-w-2xl mx-auto w-full">
                            <Link href={route('karyawan.index')}>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="rounded-full bg-white shadow-sm hover:bg-gray-50 h-9 w-9 md:h-11 md:w-11 shrink-0"
                                >
                                    <ArrowLeft className="w-4 h-4 text-gray-600" />
                                </Button>
                            </Link>
                            <div>
                                <h1 className="text-xl md:text-3xl font-bold tracking-tight text-gray-900">
                                    Undang Karyawan
                                </h1>
                                <p className="text-xs md:text-sm text-gray-500">
                                    Gunakan link di bawah untuk mengundang
                                    karyawan baru.
                                </p>
                            </div>
                        </div>

                        {/* ── Card ── */}
                        <div className="max-w-2xl mx-auto w-full">
                            <Card className="border-none shadow-xl rounded-3xl bg-white overflow-hidden">
                                <CardContent className="p-6 md:p-10">
                                    {/* Icon */}
                                    <div className="flex justify-center mb-6">
                                        <div className="w-16 h-16 md:w-20 md:h-20 bg-indigo-50 rounded-full flex items-center justify-center">
                                            <UserPlus className="w-8 h-8 md:w-10 md:h-10 text-indigo-600" />
                                        </div>
                                    </div>

                                    {/* Title */}
                                    <div className="text-center space-y-2 mb-6">
                                        <h2 className="text-lg md:text-xl font-bold text-gray-900">
                                            Link Undangan Pendaftaran
                                        </h2>
                                        <p className="text-gray-500 text-sm">
                                            Kirimkan link ini kepada karyawan
                                            Anda. Mereka dapat mengisi data diri
                                            dan memilih shift secara mandiri.
                                        </p>
                                    </div>

                                    {/* URL Box */}
                                    <div className="bg-gray-50 p-3 md:p-4 rounded-2xl border border-gray-100 mb-4">
                                        <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-1.5">
                                            Link URL
                                        </p>
                                        <p className="text-sm font-mono text-gray-600 break-all leading-relaxed">
                                            {invite_url}
                                        </p>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex flex-col sm:flex-row gap-3">
                                        <Button
                                            onClick={copyToClipboard}
                                            className="flex-1 h-11 rounded-xl bg-indigo-600 hover:bg-indigo-700 font-bold shadow-md shadow-indigo-100 gap-2"
                                        >
                                            <Copy className="w-4 h-4" />
                                            Salin Link
                                        </Button>
                                        <Button
                                            variant="outline"
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
                                            className="flex-1 h-11 rounded-xl border-gray-200 text-gray-600 gap-2 font-semibold"
                                        >
                                            <RefreshCw className="w-4 h-4" />
                                            Reset Link
                                        </Button>
                                    </div>

                                    {/* Info Pills */}
                                    <div className="flex flex-wrap justify-center gap-4 mt-6 pt-5 border-t border-gray-50">
                                        <div className="flex items-center gap-2">
                                            <div className="w-7 h-7 bg-emerald-50 rounded-lg flex items-center justify-center">
                                                <Shield className="w-3.5 h-3.5 text-emerald-600" />
                                            </div>
                                            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                                                Link Aktif
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-7 h-7 bg-amber-50 rounded-lg flex items-center justify-center">
                                                <Zap className="w-3.5 h-3.5 text-amber-600" />
                                            </div>
                                            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                                                Daftar Instan
                                            </span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
