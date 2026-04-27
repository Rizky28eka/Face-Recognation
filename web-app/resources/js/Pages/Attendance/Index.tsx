import { AppSidebar } from '@/Components/app-sidebar';
import { SiteHeader } from '@/Components/site-header';
import { SidebarInset, SidebarProvider } from '@/Components/ui/sidebar';
import { Head } from '@inertiajs/react';
import { useState, useRef, useCallback, useEffect } from 'react';
import Webcam from 'react-webcam';
import { Button } from '@/Components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/Components/ui/card';
import {
    Camera,
    MapPin,
    Signal,
    Loader2,
    CheckCircle2,
    XCircle,
} from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';

interface Attendance {
    id: number;
    user: { name: string };
    type: string;
    confidence: number;
    attended_at: string;
    branch?: {
        name: string;
    };
}

interface Props {
    recentAttendances: Attendance[];
}

export default function Index({ recentAttendances }: Props) {
    const webcamRef = useRef<Webcam>(null);
    const [imgSrc, setImgSrc] = useState<string | null>(null);
    const [processing, setProcessing] = useState(false);
    const [location, setLocation] = useState<{
        lat: number;
        lng: number;
    } | null>(null);
    const [networkInfo, setNetworkInfo] = useState<string>('Unknown');
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    // Get Geolocation on mount
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    });
                },
                (error) => {
                    console.error('Error getting location:', error);
                    toast.error(
                        'Gagal mendapatkan lokasi. Pastikan GPS aktif.',
                    );
                },
            );
        }

        // Get Network Info
        if ('connection' in navigator) {
            const conn = (
                navigator as unknown as {
                    connection: { effectiveType: string; type: string };
                }
            ).connection;
            setNetworkInfo(
                `${conn.effectiveType || 'N/A'} (${conn.type || 'unknown'})`,
            );
        }
    }, []);

    const handleCheckIn = useCallback(
        async (image: string) => {
            setProcessing(true);
            setStatus('idle');

            try {
                const response = await axios.post(
                    route('attendance.check-in'),
                    {
                        image,
                        latitude: location?.lat,
                        longitude: location?.lng,
                        network_info: networkInfo,
                    },
                );

                if (response.data.success) {
                    setStatus('success');
                    setMessage(response.data.message);
                    toast.success(response.data.message);
                }
            } catch (error) {
                setStatus('error');
                const errMsg =
                    axios.isAxiosError(error) && error.response?.data?.message
                        ? error.response.data.message
                        : 'Terjadi kesalahan saat scan wajah.';
                setMessage(errMsg);
                toast.error(errMsg);
            } finally {
                setProcessing(false);
            }
        },
        [location, networkInfo],
    );

    const capture = useCallback(() => {
        const imageSrc = webcamRef.current?.getScreenshot();
        if (imageSrc) {
            setImgSrc(imageSrc);
            handleCheckIn(imageSrc);
        }
    }, [handleCheckIn]);

    const reset = () => {
        setImgSrc(null);
        setStatus('idle');
        setMessage('');
    };

    return (
        <SidebarProvider>
            <AppSidebar variant="inset" />
            <SidebarInset>
                <SiteHeader />
                <Head title="Presensi Wajah" />

                <div className="flex flex-1 flex-col pb-8">
                    <div className="px-4 lg:px-6 py-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {/* Camera Section */}
                            <div className="md:col-span-2 space-y-6">
                                <div>
                                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                                        Presensi Wajah
                                    </h1>
                                    <p className="text-gray-500">
                                        Scan wajah Anda untuk melakukan absensi
                                        masuk atau pulang.
                                    </p>
                                </div>

                                <Card className="overflow-hidden border-none shadow-2xl bg-white/80 backdrop-blur-md ring-1 ring-black/5">
                                    <CardHeader className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white">
                                        <CardTitle className="flex items-center gap-2">
                                            <Camera className="w-5 h-5" />
                                            Kamera Verifikasi
                                        </CardTitle>
                                        <CardDescription className="text-indigo-100">
                                            Posisikan wajah Anda di tengah area
                                            scan.
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="p-0 relative">
                                        {!imgSrc ? (
                                            <div className="aspect-video bg-black relative group">
                                                <Webcam
                                                    audio={false}
                                                    ref={webcamRef}
                                                    screenshotFormat="image/jpeg"
                                                    className="w-full h-full object-cover"
                                                    videoConstraints={{
                                                        facingMode: 'user',
                                                    }}
                                                />
                                                <div className="absolute inset-0 border-2 border-dashed border-white/20 m-12 rounded-3xl pointer-events-none flex items-center justify-center transition-all group-hover:border-white/40">
                                                    <div className="w-72 h-72 border-2 border-indigo-400/50 rounded-full animate-pulse"></div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="aspect-video bg-black flex items-center justify-center relative">
                                                <img
                                                    src={imgSrc}
                                                    alt="captured"
                                                    className="w-full h-full object-cover"
                                                />
                                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-sm">
                                                    {status === 'success' && (
                                                        <CheckCircle2 className="w-24 h-24 text-green-400 animate-bounce" />
                                                    )}
                                                    {status === 'error' && (
                                                        <XCircle className="w-24 h-24 text-red-400 animate-shake" />
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        <div className="p-8 flex flex-col items-center gap-6">
                                            {status === 'idle' &&
                                                !processing && (
                                                    <Button
                                                        onClick={capture}
                                                        className="w-full max-w-sm h-16 text-xl bg-indigo-600 hover:bg-indigo-700 rounded-full shadow-xl shadow-indigo-200 transition-all active:scale-95"
                                                    >
                                                        <Camera className="mr-2 w-6 h-6" />
                                                        Ambil Foto & Presensi
                                                    </Button>
                                                )}

                                            {processing && (
                                                <div className="flex flex-col items-center gap-3">
                                                    <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
                                                    <p className="text-lg font-semibold text-gray-700">
                                                        Memverifikasi...
                                                    </p>
                                                </div>
                                            )}

                                            {status !== 'idle' &&
                                                !processing && (
                                                    <div className="text-center space-y-6">
                                                        <p
                                                            className={`text-2xl font-bold ${status === 'success' ? 'text-green-600' : 'text-red-600'}`}
                                                        >
                                                            {message}
                                                        </p>
                                                        <Button
                                                            variant="outline"
                                                            onClick={reset}
                                                            className="rounded-full px-8 h-12 border-2"
                                                        >
                                                            Coba Lagi
                                                        </Button>
                                                    </div>
                                                )}
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Info Section */}
                            <div className="space-y-6">
                                <Card className="border-none shadow-lg bg-white/50 backdrop-blur-sm">
                                    <CardHeader>
                                        <CardTitle className="text-xs font-bold uppercase text-gray-400 tracking-widest">
                                            Status Perangkat
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-indigo-50 rounded-2xl">
                                                <MapPin className="w-6 h-6 text-indigo-600" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-400 font-medium">
                                                    Koordinat GPS
                                                </p>
                                                <p className="text-sm font-bold text-gray-700">
                                                    {location
                                                        ? `${location.lat.toFixed(6)}, ${location.lng.toFixed(6)}`
                                                        : 'Mencari lokasi...'}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-emerald-50 rounded-2xl">
                                                <Signal className="w-6 h-6 text-emerald-600" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-400 font-medium">
                                                    Kualitas Jaringan
                                                </p>
                                                <p className="text-sm font-bold text-gray-700">
                                                    {networkInfo}
                                                </p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="border-none shadow-lg bg-white/50 backdrop-blur-sm">
                                    <CardHeader>
                                        <CardTitle className="text-xs font-bold uppercase text-gray-400 tracking-widest">
                                            Aktivitas Hari Ini
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        {recentAttendances.length > 0 ? (
                                            <div className="space-y-4">
                                                {recentAttendances
                                                    .slice(0, 5)
                                                    .map((att) => (
                                                        <div
                                                            key={att.id}
                                                            className="flex items-center justify-between p-3 rounded-xl bg-white/50 hover:bg-white transition-colors"
                                                        >
                                                            <div className="flex flex-col">
                                                                <span className="text-sm font-bold text-gray-700">
                                                                    {
                                                                        att.user
                                                                            .name
                                                                    }
                                                                </span>
                                                                <span className="text-[10px] text-gray-400 font-medium">
                                                                    {
                                                                        att.attended_at
                                                                    }{' '}
                                                                    •{' '}
                                                                    {att.branch
                                                                        ?.name ||
                                                                        'Luar Area'}
                                                                </span>
                                                            </div>
                                                            <span
                                                                className={`text-[10px] px-2.5 py-1 rounded-lg font-black uppercase tracking-tighter ${att.type === 'check-in' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}
                                                            >
                                                                {att.type}
                                                            </span>
                                                        </div>
                                                    ))}
                                            </div>
                                        ) : (
                                            <div className="py-8 text-center">
                                                <p className="text-sm text-gray-400 font-medium">
                                                    Belum ada riwayat.
                                                </p>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
