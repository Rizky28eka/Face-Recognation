import { AppSidebar } from '@/Components/app-sidebar';
import { SiteHeader } from '@/Components/site-header';
import { SidebarInset, SidebarProvider } from '@/Components/ui/sidebar';
import { Head, useForm } from '@inertiajs/react';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/Components/ui/tabs';
import {
    Settings,
    Server,
    HardDrive,
    RefreshCw,
    Save,
    Cpu,
    CheckCircle2,
} from 'lucide-react';
import { toast } from 'sonner';

interface Props {
    settings: {
        app_name: string;
        ai_service_url: string;
    };
    flash: {
        success?: string;
        error?: string;
    };
}

export default function SystemSettings({ settings, flash }: Props) {
    const { data, setData, patch, processing, errors } = useForm({
        app_name: settings.app_name || '',
        ai_service_url: settings.ai_service_url || '',
    });

    const { post: postCache, processing: clearingCache } = useForm();

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        patch(route('system.settings.update'), {
            preserveScroll: true,
            onSuccess: () => toast.success('Pengaturan berhasil diperbarui.'),
            onError: () => toast.error('Gagal menyimpan pengaturan.'),
        });
    };

    const handleClearCache = () => {
        postCache(route('system.clear-cache'), {
            preserveScroll: true,
            onSuccess: () => toast.success('Cache berhasil dibersihkan.'),
            onError: () => toast.error('Gagal membersihkan cache.'),
        });
    };

    return (
        <SidebarProvider>
            <AppSidebar variant="inset" />
            <SidebarInset>
                <SiteHeader />
                <Head title="Pengaturan Sistem" />

                <div className="flex flex-1 flex-col pb-8">
                    <div className="flex flex-col gap-6 py-4 md:gap-8 md:py-8 px-4 lg:px-6 max-w-4xl mx-auto w-full">
                        {/* Header */}
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900 flex items-center gap-2">
                                <Settings className="w-8 h-8 text-indigo-600" />
                                Pengaturan Sistem
                            </h1>
                            <p className="text-sm md:text-base text-gray-500 mt-1">
                                Kelola konfigurasi global aplikasi, integrasi
                                *backend*, dan pemeliharaan server.
                            </p>
                        </div>

                        {/* Flash Messages Displayed as Alerts if Sonner isn't enough */}
                        {flash.success && (
                            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center gap-3 text-emerald-800">
                                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                                <span className="font-medium text-sm">
                                    {flash.success}
                                </span>
                            </div>
                        )}
                        {flash.error && (
                            <div className="p-4 rounded-xl bg-red-50 border border-red-100 flex items-center gap-3 text-red-800">
                                <HardDrive className="w-5 h-5 text-red-500" />
                                <span className="font-medium text-sm">
                                    {flash.error}
                                </span>
                            </div>
                        )}

                        <Tabs defaultValue="general" className="w-full">
                            <TabsList className="grid w-full max-w-md grid-cols-3 mb-6 bg-gray-100/80 p-1 rounded-xl">
                                <TabsTrigger
                                    value="general"
                                    className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm"
                                >
                                    <Server className="w-4 h-4 mr-2" /> Utama
                                </TabsTrigger>
                                <TabsTrigger
                                    value="ai"
                                    className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm"
                                >
                                    <Cpu className="w-4 h-4 mr-2" /> Integrasi
                                    AI
                                </TabsTrigger>
                                <TabsTrigger
                                    value="maintenance"
                                    className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm"
                                >
                                    <HardDrive className="w-4 h-4 mr-2" />{' '}
                                    Maintenance
                                </TabsTrigger>
                            </TabsList>

                            {/* TAB: GENERAL */}
                            <TabsContent value="general">
                                <form onSubmit={handleSave}>
                                    <Card className="rounded-2xl shadow-sm border-gray-100">
                                        <CardHeader>
                                            <CardTitle>
                                                Konfigurasi Utama
                                            </CardTitle>
                                            <CardDescription>
                                                Pengaturan dasar aplikasi yang
                                                akan terlihat oleh semua
                                                pengguna.
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-6">
                                            <div className="space-y-2">
                                                <Label htmlFor="app_name">
                                                    Nama Aplikasi
                                                </Label>
                                                <Input
                                                    id="app_name"
                                                    value={data.app_name}
                                                    onChange={(e) =>
                                                        setData(
                                                            'app_name',
                                                            e.target.value,
                                                        )
                                                    }
                                                    placeholder="Contoh: Sikawan AI"
                                                    className="max-w-md"
                                                />
                                                {errors.app_name && (
                                                    <p className="text-red-500 text-xs mt-1">
                                                        {errors.app_name}
                                                    </p>
                                                )}
                                                <p className="text-xs text-gray-500">
                                                    Nama ini akan digunakan pada
                                                    email, judul halaman, dan
                                                    invoice.
                                                </p>
                                            </div>
                                        </CardContent>
                                        <CardFooter className="bg-gray-50/50 px-6 py-4 border-t border-gray-100 rounded-b-2xl">
                                            <Button
                                                type="submit"
                                                disabled={processing}
                                                className="bg-indigo-600 hover:bg-indigo-700"
                                            >
                                                {processing ? (
                                                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                                                ) : (
                                                    <Save className="w-4 h-4 mr-2" />
                                                )}
                                                Simpan Perubahan
                                            </Button>
                                        </CardFooter>
                                    </Card>
                                </form>
                            </TabsContent>

                            {/* TAB: AI INTEGRATION */}
                            <TabsContent value="ai">
                                <form onSubmit={handleSave}>
                                    <Card className="rounded-2xl shadow-sm border-gray-100">
                                        <CardHeader>
                                            <CardTitle>
                                                Integrasi Face Recognition
                                                (Python)
                                            </CardTitle>
                                            <CardDescription>
                                                Atur titik henti (Endpoint)
                                                server AI untuk presensi wajah.
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-6">
                                            <div className="space-y-2">
                                                <Label htmlFor="ai_service_url">
                                                    AI Service URL Base
                                                </Label>
                                                <Input
                                                    id="ai_service_url"
                                                    value={data.ai_service_url}
                                                    onChange={(e) =>
                                                        setData(
                                                            'ai_service_url',
                                                            e.target.value,
                                                        )
                                                    }
                                                    placeholder="http://127.0.0.1:8088/api/v1"
                                                    dir="ltr"
                                                    className="font-mono text-sm max-w-lg"
                                                />
                                                {errors.ai_service_url && (
                                                    <p className="text-red-500 text-xs mt-1">
                                                        {errors.ai_service_url}
                                                    </p>
                                                )}
                                                <p className="text-xs text-gray-500">
                                                    Pastikan URL berakhiran
                                                    `/api/v1` dan dapat diakses
                                                    dari server Laravel ini.
                                                </p>
                                            </div>
                                        </CardContent>
                                        <CardFooter className="bg-gray-50/50 px-6 py-4 border-t border-gray-100 rounded-b-2xl">
                                            <Button
                                                type="submit"
                                                disabled={processing}
                                                className="bg-indigo-600 hover:bg-indigo-700"
                                            >
                                                {processing ? (
                                                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                                                ) : (
                                                    <Save className="w-4 h-4 mr-2" />
                                                )}
                                                Simpan Konfigurasi AI
                                            </Button>
                                        </CardFooter>
                                    </Card>
                                </form>
                            </TabsContent>

                            {/* TAB: MAINTENANCE */}
                            <TabsContent value="maintenance">
                                <Card className="rounded-2xl shadow-sm border-gray-100">
                                    <CardHeader>
                                        <CardTitle>
                                            Pemeliharaan Sistem
                                        </CardTitle>
                                        <CardDescription>
                                            Alat bantu untuk mengelola performa
                                            dan menyegarkan konfigurasi server.
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between p-4 bg-orange-50 border border-orange-100 rounded-xl">
                                            <div>
                                                <h3 className="font-bold text-orange-900 text-sm">
                                                    Bersihkan Cache (Optimize
                                                    Clear)
                                                </h3>
                                                <p className="text-xs text-orange-700 mt-1 max-w-md">
                                                    Hapus cache route, views,
                                                    dan konfigurasi. Gunakan ini
                                                    jika perubahan pada
                                                    pengaturan tidak terlihat
                                                    atau sistem terasa lambat.
                                                </p>
                                            </div>
                                            <Button
                                                variant="outline"
                                                onClick={handleClearCache}
                                                disabled={clearingCache}
                                                className="bg-white text-orange-600 border-orange-200 hover:bg-orange-100 hover:text-orange-700 whitespace-nowrap"
                                            >
                                                {clearingCache ? (
                                                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                                                ) : (
                                                    <HardDrive className="w-4 h-4 mr-2" />
                                                )}
                                                Bersihkan Cache
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
