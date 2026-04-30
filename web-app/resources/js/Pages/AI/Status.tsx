import { AppSidebar } from '@/Components/app-sidebar';
import { SiteHeader } from '@/Components/site-header';
import { SidebarInset, SidebarProvider } from '@/Components/ui/sidebar';
import { Head, router } from '@inertiajs/react';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import {
    Activity,
    Cpu,
    Database,
    Network,
    RefreshCw,
    CheckCircle2,
    XCircle,
    Target,
    Zap,
    AlertTriangle,
} from 'lucide-react';
import { useState } from 'react';

interface ModelMetrics {
    accuracy: number;
    precision: number;
    recall: number;
    f1_score: number;
    total_samples?: number;
    last_trained?: string;
}

interface AIStatus {
    status: 'ready' | 'training' | 'offline' | 'error';
    message?: string;
    total_faces: number;
    trained_faces: number;
    db_registered_faces: number;
    model_metrics: ModelMetrics | null;
}

interface Props {
    aiStatus: AIStatus;
}

export default function AIStatusDashboard({ aiStatus }: Props) {
    const [isRefreshing, setIsRefreshing] = useState(false);

    const refreshStatus = () => {
        setIsRefreshing(true);
        router.reload({
            data: { t: Date.now() } as any, // Prevent browser cache
            only: ['aiStatus'],
            onFinish: () => setIsRefreshing(false),
        });
    };

    // Helper to format percentages
    const formatPercent = (val?: number) => {
        if (val === undefined || val === null) return '-';
        return `${val.toFixed(1)}%`;
    };

    const isOnline =
        aiStatus.status === 'ready' || aiStatus.status === 'training';
    const metrics = aiStatus.model_metrics;

    return (
        <SidebarProvider>
            <AppSidebar variant="inset" />
            <SidebarInset>
                <SiteHeader />
                <Head title="Status AI Service" />

                <div className="flex flex-1 flex-col pb-8">
                    <div className="flex flex-col gap-6 py-4 md:gap-8 md:py-8 px-4 lg:px-6 max-w-7xl mx-auto w-full">
                        {/* Header */}
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div>
                                <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900 flex items-center gap-2">
                                    <Cpu className="w-8 h-8 text-indigo-600" />
                                    AI Service Dashboard
                                </h1>
                                <p className="text-sm md:text-base text-gray-500 mt-1">
                                    Pantau kondisi *engine* Face Recognition,
                                    metrik model, dan sinkronisasi data.
                                </p>
                            </div>
                            <Button
                                onClick={refreshStatus}
                                disabled={isRefreshing}
                                className="bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 shadow-sm rounded-xl font-bold"
                            >
                                <RefreshCw
                                    className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin text-indigo-600' : ''}`}
                                />
                                {isRefreshing ? 'Memuat...' : 'Muat Ulang'}
                            </Button>
                        </div>

                        {/* Top Cards: Status & Data */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Connection Status */}
                            <Card
                                className={`rounded-3xl border-none shadow-sm relative overflow-hidden ${!isOnline ? 'bg-red-50/50' : ''}`}
                            >
                                <div
                                    className={`absolute top-0 right-0 w-24 h-24 -mt-8 -mr-8 rounded-full opacity-10 ${isOnline ? 'bg-emerald-500' : 'bg-red-500'}`}
                                ></div>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                                        <Network className="w-4 h-4" />
                                        Koneksi Server
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-end justify-between">
                                        <div>
                                            <h2 className="text-3xl font-black text-gray-900 mt-2 flex items-center gap-3">
                                                {isOnline ? (
                                                    <span className="text-emerald-600 flex items-center gap-2">
                                                        <CheckCircle2 className="w-6 h-6" />{' '}
                                                        Online
                                                    </span>
                                                ) : (
                                                    <span className="text-red-600 flex items-center gap-2">
                                                        <XCircle className="w-6 h-6" />{' '}
                                                        Offline
                                                    </span>
                                                )}
                                            </h2>
                                            <p className="text-sm text-gray-500 mt-2 font-medium">
                                                {isOnline
                                                    ? 'Service Python terhubung dan berjalan normal.'
                                                    : aiStatus.message ||
                                                      'Gagal terhubung ke service AI.'}
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Total Registered Faces */}
                            <Card className="rounded-3xl border-none shadow-sm relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-24 h-24 -mt-8 -mr-8 rounded-full bg-blue-500 opacity-5"></div>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                                        <Database className="w-4 h-4" />
                                        Data Wajah Tersimpan
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div>
                                        <h2 className="text-3xl font-black text-gray-900 mt-2">
                                            {(
                                                aiStatus.total_faces || 0
                                            ).toLocaleString('id-ID')}{' '}
                                            <span className="text-lg font-medium text-gray-400">
                                                foto (dari{' '}
                                                {aiStatus.db_registered_faces ||
                                                    0}{' '}
                                                karyawan)
                                            </span>
                                        </h2>
                                        <p className="text-sm text-gray-500 mt-2 font-medium">
                                            Jumlah total dataset gambar wajah.
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Trained Faces */}
                            <Card className="rounded-3xl border-none shadow-sm relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-24 h-24 -mt-8 -mr-8 rounded-full bg-indigo-500 opacity-5"></div>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                                        <Activity className="w-4 h-4" />
                                        Sinkronisasi Model
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div>
                                        <h2 className="text-3xl font-black text-gray-900 mt-2">
                                            {(
                                                aiStatus.trained_faces || 0
                                            ).toLocaleString('id-ID')}{' '}
                                            <span className="text-lg font-medium text-gray-400">
                                                karyawan dikenali
                                            </span>
                                        </h2>
                                        <div className="flex items-center gap-2 mt-2">
                                            {(aiStatus.trained_faces || 0) <
                                            (aiStatus.db_registered_faces ||
                                                0) ? (
                                                <span className="flex items-center text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-md">
                                                    <AlertTriangle className="w-3 h-3 mr-1" />{' '}
                                                    Perlu Training Ulang
                                                </span>
                                            ) : (
                                                <span className="flex items-center text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">
                                                    <CheckCircle2 className="w-3 h-3 mr-1" />{' '}
                                                    Model Tersinkronisasi
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Metrics Section */}
                        <Card className="rounded-3xl border-none shadow-sm mt-2">
                            <CardHeader className="bg-gray-50/50 pb-6 border-b border-gray-50 rounded-t-3xl">
                                <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                    <Target className="w-5 h-5 text-indigo-600" />
                                    Performa Model K-Nearest Neighbors (KNN)
                                </CardTitle>
                                <CardDescription className="text-base">
                                    Statistik kemampuan AI dalam mengenali dan
                                    membedakan wajah antar karyawan.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="p-6 md:p-8">
                                {metrics ? (
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                                        <div className="flex flex-col items-center justify-center p-6 bg-gray-50 rounded-2xl">
                                            <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">
                                                Akurasi
                                            </p>
                                            <p className="text-4xl font-black text-indigo-600">
                                                {formatPercent(
                                                    metrics.accuracy,
                                                )}
                                            </p>
                                            <p className="text-xs text-gray-400 mt-2 text-center">
                                                Akurasi prediksi secara
                                                keseluruhan
                                            </p>
                                        </div>
                                        <div className="flex flex-col items-center justify-center p-6 bg-gray-50 rounded-2xl">
                                            <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">
                                                Precision
                                            </p>
                                            <p className="text-4xl font-black text-emerald-600">
                                                {formatPercent(
                                                    metrics.precision,
                                                )}
                                            </p>
                                            <p className="text-xs text-gray-400 mt-2 text-center">
                                                Ketepatan dari tebakan positif
                                            </p>
                                        </div>
                                        <div className="flex flex-col items-center justify-center p-6 bg-gray-50 rounded-2xl">
                                            <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">
                                                Recall
                                            </p>
                                            <p className="text-4xl font-black text-blue-600">
                                                {formatPercent(metrics.recall)}
                                            </p>
                                            <p className="text-xs text-gray-400 mt-2 text-center">
                                                Sensitivitas mendeteksi yang
                                                benar
                                            </p>
                                        </div>
                                        <div className="flex flex-col items-center justify-center p-6 bg-gray-50 rounded-2xl relative overflow-hidden">
                                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5"></div>
                                            <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2 relative z-10">
                                                F1 Score
                                            </p>
                                            <p className="text-4xl font-black text-purple-600 relative z-10 flex items-center gap-2">
                                                {formatPercent(
                                                    metrics.f1_score,
                                                )}
                                                <Zap className="w-6 h-6 text-yellow-500" />
                                            </p>
                                            <p className="text-xs text-gray-400 mt-2 text-center relative z-10">
                                                Keseimbangan Precision & Recall
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="py-12 flex flex-col items-center justify-center text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                                        <AlertTriangle className="w-12 h-12 text-amber-500 mb-4" />
                                        <h3 className="text-lg font-bold text-gray-900">
                                            Metrik Belum Tersedia
                                        </h3>
                                        <p className="text-gray-500 max-w-md mt-2">
                                            Model belum dilatih atau data metrik
                                            tidak dapat diambil. Pastikan ada
                                            minimal 2 orang karyawan yang
                                            mendaftarkan wajah dan model sudah
                                            di-training.
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
