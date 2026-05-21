import { AppSidebar } from '@/Components/app-sidebar';
import { SiteHeader } from '@/Components/site-header';
import { SidebarInset, SidebarProvider } from '@/Components/ui/sidebar';
import { Head, router, useForm } from '@inertiajs/react';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import {
    Database,
    Network,
    RefreshCw,
    Target,
    Cpu,
    Edit2,
    Table as TableIcon,
    Users,
    Clock,
    Scan,
    Eye,
    X,
} from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/Components/ui/dialog';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/Components/ui/tabs';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/Components/ui/table';

interface ModelMetrics {
    accuracy: number;
    precision: number;
    recall: number;
    f1_score: number;
    total_samples?: number;
    last_trained?: string;
}

interface Hyperparameters {
    algorithm: string;
    n_neighbors: number;
    recognition_threshold: number;
    distance_metric: string;
    detection_method: string;
}

interface SystemResources {
    cpu_percent: number;
    memory_percent: number;
    memory_used_mb: number;
    memory_total_mb: number;
}

interface DatasetClass {
    class: string;
    saved: number;
    failed: number;
    hash: string;
}

interface InferenceLog {
    name: string;
    confidence: number;
    status: string;
    timestamp: string;
    bbox?: number[];
}

interface Registration {
    name: string;
    status: 'Registered' | 'Pending';
    updated_at: string;
    has_image: boolean;
}

interface Attendance {
    name: string;
    type: string;
    confidence: number;
    time: string;
    status: string;
    bbox: number[] | null;
    image_url: string | null;
    accuracy?: number;
    f1_score?: number;
    precision?: number;
    recall?: number;
}

interface TestingReport {
    no: number | string;
    modul?: string;
    pengujian?: string;
    skenario?: string;
    input?: string;
    harapan?: string;
    aktual?: string;
    status?: string;
    fungsi?: string;
    vg?: number;
    path?: string;
    hasil?: string;
    data?: string;
    jumlah?: number | string;
    benar?: number | string;
    salah?: number | string;
    akurasi?: string;
    proses?: string;
    t1?: number | string;
    t2?: number | string;
    t3?: number | string;
    avg?: number | string;
    komponen?: string;
    min?: string;
    status_pengujian?: string;
}

interface AIStatus {
    status: 'ready' | 'training' | 'offline' | 'error';
    message?: string;
    total_faces: number;
    trained_faces: number;
    db_registered_faces: number;
    model_metrics: ModelMetrics | null;
    hyperparameters?: Hyperparameters | null;
    system_resources?: SystemResources | null;
    dataset?: DatasetClass[];
    inference_logs?: InferenceLog[];
    testing_reports?: {
        black_box: TestingReport[];
        white_box: TestingReport[];
        accuracy: TestingReport[];
        response_time: TestingReport[];
        geofence: TestingReport[];
        environment: TestingReport[];
        liveness: TestingReport[];
        specs: TestingReport[];
    } | null;
    registrations: Registration[];
    attendances: Attendance[];
}

interface Props {
    aiStatus: AIStatus;
}

export default function AIStatusDashboard({ aiStatus }: Props) {
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [selectedLog, setSelectedLog] = useState<Attendance | null>(null);

    const refreshStatus = () => {
        setIsRefreshing(true);
        router.reload({
            data: { t: Date.now() },
            only: ['aiStatus'],
            onFinish: () => setIsRefreshing(false),
        });
    };

    const isOnline =
        aiStatus.status === 'ready' || aiStatus.status === 'training';
    const metrics = aiStatus.model_metrics;
    const hyperparams = aiStatus.hyperparameters;
    const system = aiStatus.system_resources;
    const logs = aiStatus.inference_logs || [];
    const reports = aiStatus.testing_reports;
    const registrations = aiStatus.registrations || [];
    const attendances = aiStatus.attendances || [];

    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const { data, setData, post, processing } = useForm({
        recognition_threshold: hyperparams?.recognition_threshold || 0.5,
        n_neighbors: hyperparams?.n_neighbors || 3,
    });

    const openEditDialog = () => {
        setData({
            recognition_threshold: hyperparams?.recognition_threshold || 0.5,
            n_neighbors: hyperparams?.n_neighbors || 3,
        });
        setIsEditDialogOpen(true);
    };

    const submitSettings = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('ai.settings.update'), {
            onSuccess: () => {
                setIsEditDialogOpen(false);
                toast.success('Konfigurasi AI berhasil diperbarui!');
            },
            onError: () => {
                toast.error('Gagal memperbarui konfigurasi AI.');
            },
        });
    };

    const formatPercent = (val?: number) => {
        if (val === undefined || val === null) return '-';
        return `${Number(val).toFixed(2)}%`;
    };

    return (
        <SidebarProvider>
            <AppSidebar variant="inset" />
            <SidebarInset className="bg-slate-50/50">
                <SiteHeader />
                <Head title="Status AI" />

                <div className="flex flex-1 flex-col pb-12">
                    <div className="flex flex-col gap-6 p-6 lg:p-8 max-w-7xl mx-auto w-full">
                        {/* Simple Header */}
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div className="space-y-1">
                                <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                                    Status Engine AI
                                </h1>
                                <p className="text-slate-500 text-sm">
                                    Monitoring performa, registrasi wajah, dan
                                    dokumentasi pengujian.
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button
                                    onClick={refreshStatus}
                                    disabled={isRefreshing}
                                    variant="outline"
                                    size="sm"
                                    className="bg-white"
                                >
                                    <RefreshCw
                                        className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`}
                                    />
                                    {isRefreshing
                                        ? 'Sinkronisasi...'
                                        : 'Refresh Data'}
                                </Button>
                            </div>
                        </div>

                        {/* Standard Stats Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <StatCard
                                icon={<Network className="w-4 h-4" />}
                                title="Koneksi Service"
                                value={isOnline ? 'Online' : 'Offline'}
                                sub={
                                    isOnline
                                        ? 'Terhubung ke FastAPI'
                                        : 'Server tidak terjangkau'
                                }
                                status={isOnline ? 'success' : 'error'}
                            />
                            <StatCard
                                icon={<Database className="w-4 h-4" />}
                                title="Total Dataset"
                                value={aiStatus.total_faces.toLocaleString()}
                                sub={`${aiStatus.db_registered_faces} User Terdaftar`}
                            />
                            <StatCard
                                icon={<Target className="w-4 h-4" />}
                                title="Akurasi Model"
                                value={formatPercent(metrics?.accuracy)}
                                sub="Hasil evaluasi terakhir"
                            />
                            <StatCard
                                icon={<Cpu className="w-4 h-4" />}
                                title="Beban CPU"
                                value={`${system?.cpu_percent || 0}%`}
                                sub={`RAM: ${system?.memory_used_mb || 0}MB`}
                            />
                        </div>

                        {/* Main Tabs */}
                        <Tabs
                            defaultValue="monitoring"
                            className="w-full space-y-6"
                        >
                            <TabsList className="bg-white border border-slate-200">
                                <TabsTrigger
                                    value="monitoring"
                                    className="data-[state=active]:bg-slate-100"
                                >
                                    Monitoring
                                </TabsTrigger>
                                <TabsTrigger
                                    value="documentation"
                                    className="data-[state=active]:bg-slate-100"
                                >
                                    Dokumentasi
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent
                                value="monitoring"
                                className="space-y-6 outline-none"
                            >
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                    {/* Performa Model & Config */}
                                    <div className="lg:col-span-2 space-y-6">
                                        <Card className="border-none shadow-sm">
                                            <CardHeader>
                                                <CardTitle className="text-lg">
                                                    Analisis Performa
                                                </CardTitle>
                                                <CardDescription>
                                                    Metrik evaluasi algoritma
                                                    KNN
                                                </CardDescription>
                                            </CardHeader>
                                            <CardContent>
                                                {metrics ? (
                                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                                        <MetricBox
                                                            label="Accuracy"
                                                            value={formatPercent(
                                                                metrics.accuracy,
                                                            )}
                                                            color="indigo"
                                                        />
                                                        <MetricBox
                                                            label="Precision"
                                                            value={formatPercent(
                                                                metrics.precision,
                                                            )}
                                                            color="emerald"
                                                        />
                                                        <MetricBox
                                                            label="Recall"
                                                            value={formatPercent(
                                                                metrics.recall,
                                                            )}
                                                            color="blue"
                                                        />
                                                        <MetricBox
                                                            label="F1-Score"
                                                            value={formatPercent(
                                                                metrics.f1_score,
                                                            )}
                                                            color="purple"
                                                        />
                                                    </div>
                                                ) : (
                                                    <div className="py-12 text-center text-slate-400 italic">
                                                        Data metrik belum
                                                        tersedia.
                                                    </div>
                                                )}
                                            </CardContent>
                                        </Card>

                                        {/* Parameter AI */}
                                        <Card className="border-none shadow-sm">
                                            <CardHeader className="flex flex-row items-center justify-between space-y-0">
                                                <div>
                                                    <CardTitle className="text-lg">
                                                        Parameter Engine
                                                    </CardTitle>
                                                    <CardDescription>
                                                        Konfigurasi sensitivitas
                                                        deteksi
                                                    </CardDescription>
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={openEditDialog}
                                                >
                                                    <Edit2 className="w-4 h-4 mr-2" />{' '}
                                                    Ubah
                                                </Button>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                                    <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                                                        <p className="text-xs font-semibold text-slate-500 uppercase">
                                                            Algorithm
                                                        </p>
                                                        <p className="text-lg font-bold text-slate-900">
                                                            {hyperparams?.algorithm ||
                                                                'KNN'}
                                                        </p>
                                                    </div>
                                                    <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                                                        <p className="text-xs font-semibold text-slate-500 uppercase">
                                                            Threshold
                                                        </p>
                                                        <p className="text-lg font-bold text-slate-900">
                                                            {
                                                                hyperparams?.recognition_threshold
                                                            }
                                                        </p>
                                                    </div>
                                                    <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                                                        <p className="text-xs font-semibold text-slate-500 uppercase">
                                                            K-Neighbors
                                                        </p>
                                                        <p className="text-lg font-bold text-slate-900">
                                                            {
                                                                hyperparams?.n_neighbors
                                                            }
                                                        </p>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>

                                        {/* User Activity: Registration Status */}
                                        <Card className="border-none shadow-sm">
                                            <CardHeader>
                                                <CardTitle className="text-lg flex items-center gap-2">
                                                    <Users className="w-5 h-5 text-indigo-600" />{' '}
                                                    Status Registrasi Wajah
                                                </CardTitle>
                                                <CardDescription>
                                                    Detail status pendaftaran
                                                    wajah karyawan
                                                </CardDescription>
                                            </CardHeader>
                                            <CardContent className="p-0">
                                                <Table>
                                                    <TableHeader className="bg-slate-50/50">
                                                        <TableRow>
                                                            <TableHead>
                                                                Nama Karyawan
                                                            </TableHead>
                                                            <TableHead>
                                                                Status
                                                            </TableHead>
                                                            <TableHead>
                                                                Terakhir Update
                                                            </TableHead>
                                                        </TableRow>
                                                    </TableHeader>
                                                    <TableBody>
                                                        {registrations.length >
                                                        0 ? (
                                                            registrations.map(
                                                                (reg, i) => (
                                                                    <TableRow
                                                                        key={i}
                                                                    >
                                                                        <TableCell className="font-medium">
                                                                            {
                                                                                reg.name
                                                                            }
                                                                        </TableCell>
                                                                        <TableCell>
                                                                            <Badge
                                                                                variant={
                                                                                    reg.status ===
                                                                                    'Registered'
                                                                                        ? 'default'
                                                                                        : 'outline'
                                                                                }
                                                                                className={
                                                                                    reg.status ===
                                                                                    'Registered'
                                                                                        ? 'bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                                                                                        : ''
                                                                                }
                                                                            >
                                                                                {
                                                                                    reg.status
                                                                                }
                                                                            </Badge>
                                                                        </TableCell>
                                                                        <TableCell className="text-slate-500 text-xs">
                                                                            {
                                                                                reg.updated_at
                                                                            }
                                                                        </TableCell>
                                                                    </TableRow>
                                                                ),
                                                            )
                                                        ) : (
                                                            <TableRow>
                                                                <TableCell
                                                                    colSpan={3}
                                                                    className="text-center py-10 text-slate-400 italic"
                                                                >
                                                                    Belum ada
                                                                    data
                                                                    registrasi.
                                                                </TableCell>
                                                            </TableRow>
                                                        )}
                                                    </TableBody>
                                                </Table>
                                            </CardContent>
                                        </Card>
                                    </div>

                                    {/* Log Prediksi & Login Terbaru */}
                                    <div className="space-y-6">
                                        <Card className="border-none shadow-sm flex flex-col">
                                            <CardHeader>
                                                <CardTitle className="text-lg flex items-center gap-2">
                                                    <Clock className="w-5 h-5 text-indigo-600" />{' '}
                                                    Log Presensi Terkini
                                                </CardTitle>
                                                <CardDescription>
                                                    Klik baris untuk melihat
                                                    visual bounding box
                                                </CardDescription>
                                            </CardHeader>
                                            <CardContent className="p-0 overflow-hidden">
                                                <div className="overflow-y-auto max-h-[400px]">
                                                    <Table>
                                                        <TableHeader className="bg-slate-50/50 sticky top-0">
                                                            <TableRow>
                                                                <TableHead className="text-[10px] uppercase font-bold">
                                                                    Nama
                                                                </TableHead>
                                                                <TableHead className="text-[10px] uppercase font-bold text-right">
                                                                    Detail
                                                                </TableHead>
                                                            </TableRow>
                                                        </TableHeader>
                                                        <TableBody>
                                                            {attendances.length >
                                                            0 ? (
                                                                attendances.map(
                                                                    (
                                                                        att,
                                                                        i,
                                                                    ) => (
                                                                        <TableRow
                                                                            key={
                                                                                i
                                                                            }
                                                                            className="cursor-pointer hover:bg-slate-50 transition-colors group"
                                                                            onClick={() =>
                                                                                setSelectedLog(
                                                                                    att,
                                                                                )
                                                                            }
                                                                        >
                                                                            <TableCell>
                                                                                <div className="flex flex-col">
                                                                                    <span className="font-semibold text-sm flex items-center gap-2">
                                                                                        {
                                                                                            att.name
                                                                                        }
                                                                                        {att.image_url && (
                                                                                            <Eye className="w-3 h-3 text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                                                        )}
                                                                                    </span>
                                                                                    <span className="text-[10px] text-slate-400">
                                                                                        {new Date(
                                                                                            att.time,
                                                                                        ).toLocaleTimeString(
                                                                                            'id-ID',
                                                                                        )}
                                                                                    </span>
                                                                                </div>
                                                                            </TableCell>
                                                                            <TableCell className="text-right">
                                                                                <div className="flex flex-col items-end gap-1">
                                                                                    <Badge
                                                                                        variant={
                                                                                            att.status ===
                                                                                            'Success'
                                                                                                ? 'default'
                                                                                                : 'outline'
                                                                                        }
                                                                                        className={
                                                                                            att.status ===
                                                                                            'Success'
                                                                                                ? 'bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                                                                                                : ''
                                                                                        }
                                                                                    >
                                                                                        {
                                                                                            att.status
                                                                                        }
                                                                                    </Badge>
                                                                                    {att.bbox && (
                                                                                        <span className="text-[9px] text-slate-400 flex items-center gap-1">
                                                                                            <Scan className="w-3 h-3" />

                                                                                            [
                                                                                            {att.bbox.join(
                                                                                                ', ',
                                                                                            )}

                                                                                            ]
                                                                                        </span>
                                                                                    )}
                                                                                </div>
                                                                            </TableCell>
                                                                        </TableRow>
                                                                    ),
                                                                )
                                                            ) : (
                                                                <TableRow>
                                                                    <TableCell
                                                                        colSpan={
                                                                            2
                                                                        }
                                                                        className="text-center py-10 text-slate-400 italic text-sm"
                                                                    >
                                                                        Belum
                                                                        ada
                                                                        aktivitas.
                                                                    </TableCell>
                                                                </TableRow>
                                                            )}
                                                        </TableBody>
                                                    </Table>
                                                </div>
                                            </CardContent>
                                        </Card>

                                        <Card className="border-none shadow-sm flex flex-col">
                                            <CardHeader>
                                                <CardTitle className="text-lg">
                                                    Inference Feed
                                                </CardTitle>
                                                <CardDescription>
                                                    Prediksi real-time AI
                                                </CardDescription>
                                            </CardHeader>
                                            <CardContent className="p-0 overflow-hidden">
                                                <div className="overflow-y-auto max-h-[400px]">
                                                    <Table>
                                                        <TableHeader className="bg-slate-50/50 sticky top-0">
                                                            <TableRow>
                                                                <TableHead className="text-[10px] uppercase font-bold">
                                                                    Identity
                                                                </TableHead>
                                                                <TableHead className="text-[10px] uppercase font-bold text-right">
                                                                    Conf
                                                                </TableHead>
                                                            </TableRow>
                                                        </TableHeader>
                                                        <TableBody>
                                                            {logs.length > 0 ? (
                                                                logs.map(
                                                                    (
                                                                        log,
                                                                        i,
                                                                    ) => (
                                                                        <TableRow
                                                                            key={
                                                                                i
                                                                            }
                                                                        >
                                                                            <TableCell>
                                                                                <div className="flex flex-col">
                                                                                    <span className="font-semibold text-sm capitalize">
                                                                                        {log.name.replace(
                                                                                            '_',
                                                                                            ' ',
                                                                                        )}
                                                                                    </span>
                                                                                    <span className="text-[10px] text-slate-400">
                                                                                        {new Date(
                                                                                            log.timestamp,
                                                                                        ).toLocaleTimeString(
                                                                                            'id-ID',
                                                                                        )}
                                                                                    </span>
                                                                                </div>
                                                                            </TableCell>
                                                                            <TableCell className="text-right">
                                                                                <div className="flex flex-col items-end gap-1">
                                                                                    <Badge
                                                                                        variant={
                                                                                            log.confidence >
                                                                                            (hyperparams?.recognition_threshold ||
                                                                                                0.5)
                                                                                                ? 'default'
                                                                                                : 'outline'
                                                                                        }
                                                                                        className={
                                                                                            log.confidence >
                                                                                            (hyperparams?.recognition_threshold ||
                                                                                                0.5)
                                                                                                ? 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-50'
                                                                                                : ''
                                                                                        }
                                                                                    >
                                                                                        {(
                                                                                            log.confidence *
                                                                                            100
                                                                                        ).toFixed(
                                                                                            0,
                                                                                        )}

                                                                                        %
                                                                                    </Badge>
                                                                                    {log.bbox && (
                                                                                        <span className="text-[9px] text-slate-400 flex items-center gap-1">
                                                                                            <Scan className="w-3 h-3" />

                                                                                            [
                                                                                            {log.bbox.join(
                                                                                                ', ',
                                                                                            )}

                                                                                            ]
                                                                                        </span>
                                                                                    )}
                                                                                </div>
                                                                            </TableCell>
                                                                        </TableRow>
                                                                    ),
                                                                )
                                                            ) : (
                                                                <TableRow>
                                                                    <TableCell
                                                                        colSpan={
                                                                            2
                                                                        }
                                                                        className="text-center py-10 text-slate-400 italic text-sm"
                                                                    >
                                                                        Belum
                                                                        ada
                                                                        aktivitas.
                                                                    </TableCell>
                                                                </TableRow>
                                                            )}
                                                        </TableBody>
                                                    </Table>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>
                                </div>
                            </TabsContent>

                            <TabsContent
                                value="documentation"
                                className="space-y-8 outline-none"
                            >
                                <Card className="border-none shadow-sm bg-blue-50/50 border-blue-100">
                                    <CardContent className="p-6 flex gap-4 items-start">
                                        <div className="p-2 bg-blue-100 rounded text-blue-600">
                                            <TableIcon className="w-5 h-5" />
                                        </div>
                                        <div className="space-y-1">
                                            <h4 className="font-bold text-blue-900">
                                                Format Dokumentasi Akademik
                                            </h4>
                                            <p className="text-sm text-blue-800">
                                                Tabel di bawah ini telah
                                                disesuaikan dengan standar
                                                penulisan Bab 4 Skripsi. Data
                                                dihasilkan otomatis berdasarkan
                                                hasil pengujian sistem.
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Academic Tables */}
                                <div className="space-y-10">
                                    <SimpleAcademicTable
                                        id="4.3"
                                        title="Pengujian Black Box Sistem"
                                        headers={[
                                            'No',
                                            'Modul',
                                            'Nama Pengujian',
                                            'Skenario',
                                            'Input',
                                            'Harapan',
                                            'Aktual',
                                            'Status',
                                        ]}
                                        data={reports?.black_box || []}
                                        columns={[
                                            'no',
                                            'modul',
                                            'pengujian',
                                            'skenario',
                                            'input',
                                            'harapan',
                                            'aktual',
                                            'status',
                                        ]}
                                    />

                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        <SimpleAcademicTable
                                            id="4.4"
                                            title="Pengujian White Box"
                                            headers={[
                                                'No',
                                                'Modul',
                                                'Fungsi',
                                                'V(G)',
                                                'Path',
                                                'Hasil',
                                            ]}
                                            data={reports?.white_box || []}
                                            columns={[
                                                'no',
                                                'modul',
                                                'fungsi',
                                                'vg',
                                                'path',
                                                'hasil',
                                            ]}
                                        />
                                        <SimpleAcademicTable
                                            id="4.5"
                                            title="Evaluasi Akurasi"
                                            headers={[
                                                'No',
                                                'Data Uji',
                                                'Total',
                                                'Benar',
                                                'Salah',
                                                'Akurasi (%)',
                                            ]}
                                            data={reports?.accuracy || []}
                                            columns={[
                                                'no',
                                                'data',
                                                'jumlah',
                                                'benar',
                                                'salah',
                                                'akurasi',
                                            ]}
                                        />
                                    </div>

                                    <SimpleAcademicTable
                                        id="4.6"
                                        title="Pengujian Response Time"
                                        headers={[
                                            'No',
                                            'Tahapan Proses',
                                            'P1 (ms)',
                                            'P2 (ms)',
                                            'P3 (ms)',
                                            'Avg (ms)',
                                        ]}
                                        data={reports?.response_time || []}
                                        columns={[
                                            'no',
                                            'proses',
                                            't1',
                                            't2',
                                            't3',
                                            'avg',
                                        ]}
                                    />
                                </div>
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
            </SidebarInset>

            {/* Modal Bounding Box */}
            <BoundingBoxModal
                log={selectedLog}
                onClose={() => setSelectedLog(null)}
            />

            {/* Dialog Edit */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <form onSubmit={submitSettings}>
                        <DialogHeader>
                            <DialogTitle>Konfigurasi Engine</DialogTitle>
                            <DialogDescription>
                                Atur parameter sensitivitas pengenalan wajah.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="threshold">
                                    Recognition Threshold
                                </Label>
                                <Input
                                    id="threshold"
                                    type="number"
                                    step="0.01"
                                    value={data.recognition_threshold}
                                    onChange={(e) =>
                                        setData(
                                            'recognition_threshold',
                                            parseFloat(e.target.value),
                                        )
                                    }
                                />
                                <p className="text-[10px] text-slate-500 italic">
                                    Semakin tinggi semakin ketat (0.0 - 1.0).
                                </p>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="neighbors">
                                    KNN Neighbors (K)
                                </Label>
                                <Input
                                    id="neighbors"
                                    type="number"
                                    value={data.n_neighbors}
                                    onChange={(e) =>
                                        setData(
                                            'n_neighbors',
                                            parseInt(e.target.value),
                                        )
                                    }
                                />
                                <p className="text-[10px] text-slate-500 italic">
                                    Jumlah sampel terdekat yang dihitung.
                                </p>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsEditDialogOpen(false)}
                            >
                                Batal
                            </Button>
                            <Button type="submit" disabled={processing}>
                                {processing
                                    ? 'Menyimpan...'
                                    : 'Simpan Perubahan'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </SidebarProvider>
    );
}

// Visual Bounding Box Modal
function BoundingBoxModal({
    log,
    onClose,
}: {
    log: Attendance | null;
    onClose: () => void;
}) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [imgSize, setImgSize] = useState({ width: 0, height: 0 });

    const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
        const { naturalWidth, naturalHeight } = e.currentTarget;
        setImgSize({ width: naturalWidth, height: naturalHeight });
    };

    const getBBoxColor = (type: string) => {
        switch (type.toLowerCase()) {
            case 'check-in':
                return 'emerald';
            case 'check-out':
                return 'blue';
            case 'register':
                return 'indigo';
            default:
                return 'amber';
        }
    };

    if (!log || !log.image_url) return null;

    const bbox = log.bbox;
    const colorScheme = getBBoxColor(log.type || 'check-in');
    const borderColor =
        colorScheme === 'emerald'
            ? 'border-emerald-400'
            : colorScheme === 'blue'
              ? 'border-blue-400'
              : 'border-indigo-400';
    const bgColor =
        colorScheme === 'emerald'
            ? 'bg-emerald-500'
            : colorScheme === 'blue'
              ? 'bg-blue-500'
              : 'bg-indigo-500';
    const shadowColor =
        colorScheme === 'emerald'
            ? 'shadow-[0_0_15px_rgba(52,211,153,0.6)]'
            : colorScheme === 'blue'
              ? 'shadow-[0_0_15px_rgba(59,130,246,0.6)]'
              : 'shadow-[0_0_15px_rgba(99,102,241,0.6)]';

    return (
        <Dialog open={!!log} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-2xl p-0 overflow-hidden border-none bg-transparent shadow-2xl">
                <div className="relative group">
                    <div className="absolute top-4 right-4 z-50">
                        <Button
                            variant="secondary"
                            size="icon"
                            className="rounded-full bg-white/20 backdrop-blur-md hover:bg-white/40 text-white border-none"
                            onClick={onClose}
                        >
                            <X className="w-5 h-5" />
                        </Button>
                    </div>

                    <div className="bg-slate-900 rounded-xl overflow-hidden shadow-2xl border border-white/10">
                        <div className="relative" ref={containerRef}>
                            <img
                                src={log.image_url}
                                alt="Detection Log"
                                className="w-full h-auto block"
                                onLoad={handleImageLoad}
                            />

                            {/* Canvas/Overlay for Bounding Box */}
                            {bbox && imgSize.width > 0 && (
                                <div
                                    className={`absolute border-2 ${borderColor} ${shadowColor} rounded-sm pointer-events-none`}
                                    style={{
                                        left: `${(bbox[0] / imgSize.width) * 100}%`,
                                        top: `${(bbox[1] / imgSize.height) * 100}%`,
                                        width: `${(bbox[2] / imgSize.width) * 100}%`,
                                        height: `${(bbox[3] / imgSize.height) * 100}%`,
                                    }}
                                >
                                    <div
                                        className={`absolute -top-10 left-0 ${bgColor} text-white text-[10px] font-bold px-2.5 py-1 rounded shadow-lg flex flex-col whitespace-nowrap`}
                                    >
                                        <div className="flex items-center gap-1">
                                            <Scan className="w-3 h-3" />
                                            {log.type?.toUpperCase() || 'SCAN'}
                                        </div>
                                        <div className="text-[9px] opacity-90 border-t border-white/20 mt-1 pt-1">
                                            {log.name} -{' '}
                                            {(log.confidence * 100).toFixed(0)}%
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="p-6 bg-white dark:bg-slate-900">
                            <div className="flex justify-between items-start">
                                <div className="space-y-1">
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                                        Hasil Deteksi AI
                                    </h3>
                                    <p className="text-sm text-slate-500">
                                        Diambil pada{' '}
                                        {new Date(log.time).toLocaleString(
                                            'id-ID',
                                        )}
                                    </p>
                                </div>
                                <Badge className="bg-emerald-500 hover:bg-emerald-600">
                                    {log.status}
                                </Badge>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-100 dark:border-slate-700">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase">
                                        Kepercayaan
                                    </p>
                                    <p className="text-lg font-black text-indigo-600">
                                        {(log.confidence * 100).toFixed(1)}%
                                    </p>
                                </div>
                                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-100 dark:border-slate-700">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase">
                                        F1-Score
                                    </p>
                                    <p className="text-lg font-black text-emerald-600">
                                        {log.f1_score
                                            ? `${Math.round(log.f1_score)}%`
                                            : '-'}
                                    </p>
                                </div>
                                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-100 dark:border-slate-700">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase">
                                        Precision
                                    </p>
                                    <p className="text-lg font-black text-blue-600">
                                        {log.precision
                                            ? `${Math.round(log.precision)}%`
                                            : '-'}
                                    </p>
                                </div>
                                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-100 dark:border-slate-700">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase">
                                        Recall
                                    </p>
                                    <p className="text-lg font-black text-rose-600">
                                        {log.recall
                                            ? `${Math.round(log.recall)}%`
                                            : '-'}
                                    </p>
                                </div>
                                <div className="col-span-2 md:col-span-4 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-100 dark:border-slate-700">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase">
                                        Koordinat BBox
                                    </p>
                                    <p className="text-sm font-mono font-bold text-slate-700 dark:text-slate-300">
                                        [{bbox?.join(', ')}]
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

interface StatCardProps {
    icon: React.ReactNode;
    title: string;
    value: string | number;
    sub: string;
    status?: 'success' | 'error' | 'warning';
}

// Reusable Simple Components
function StatCard({ icon, title, value, sub, status }: StatCardProps) {
    return (
        <Card className="border-none shadow-sm bg-white">
            <CardContent className="p-6">
                <div className="flex items-center gap-3">
                    <div
                        className={`p-2 rounded-lg bg-slate-100 text-slate-600`}
                    >
                        {icon}
                    </div>
                    <div>
                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                            {title}
                        </p>
                        <div className="flex items-center gap-2">
                            <h3 className="text-xl font-bold text-slate-900">
                                {value}
                            </h3>
                            {status === 'success' && (
                                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                            )}
                            {status === 'error' && (
                                <div className="w-2 h-2 rounded-full bg-red-500" />
                            )}
                        </div>
                        <p className="text-[10px] text-slate-400 truncate mt-0.5">
                            {sub}
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

interface MetricBoxProps {
    label: string;
    value: string;
    color: 'indigo' | 'emerald' | 'blue' | 'purple';
}

function MetricBox({ label, value, color }: MetricBoxProps) {
    const colors = {
        indigo: 'text-indigo-600',
        emerald: 'text-emerald-600',
        blue: 'text-blue-600',
        purple: 'text-purple-600',
    };
    return (
        <div className="text-center p-3 bg-slate-50 rounded border border-slate-100">
            <p className="text-[10px] font-bold text-slate-400 uppercase">
                {label}
            </p>
            <p
                className={`text-xl font-black mt-1 ${colors[color] || 'text-slate-900'}`}
            >
                {value}
            </p>
        </div>
    );
}

interface SimpleAcademicTableProps {
    id: string;
    title: string;
    headers: string[];
    data: TestingReport[];
    columns: (keyof TestingReport)[];
}

function SimpleAcademicTable({
    id,
    title,
    headers,
    data,
    columns,
}: SimpleAcademicTableProps) {
    return (
        <Card className="border-none shadow-sm overflow-hidden">
            <CardHeader className="bg-slate-50 border-b py-4">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <Badge variant="secondary" className="font-bold">
                        Tabel {id}
                    </Badge>
                    {title}
                </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                <Table>
                    <TableHeader className="bg-slate-50/50">
                        <TableRow>
                            {headers.map((h: string, i: number) => (
                                <TableHead
                                    key={i}
                                    className="text-xs font-bold text-slate-600 whitespace-nowrap"
                                >
                                    {h}
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.length > 0 ? (
                            data.map((row, i) => (
                                <TableRow key={i}>
                                    {columns.map((col, j) => {
                                        const value = row[col];
                                        const isStatus =
                                            col === 'status' ||
                                            col === 'hasil' ||
                                            col === 'status_pengujian';
                                        return (
                                            <TableCell
                                                key={j}
                                                className="text-xs"
                                            >
                                                <span
                                                    className={`
                                                    ${isStatus && (value === 'Berhasil' || value === 'Valid' || value === 'Success' || value === 'Registered') ? 'text-emerald-600 font-bold' : ''}
                                                    ${isStatus && (value === 'Gagal' || value === 'Failed' || value === 'Pending') ? 'text-red-500 font-bold' : ''}
                                                    ${!isStatus && j === 0 ? 'text-slate-400 font-bold' : 'text-slate-700'}
                                                `}
                                                >
                                                    {value}
                                                </span>
                                            </TableCell>
                                        );
                                    })}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={headers.length}
                                    className="text-center py-8 text-slate-400 italic text-sm"
                                >
                                    Data belum tersedia.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
