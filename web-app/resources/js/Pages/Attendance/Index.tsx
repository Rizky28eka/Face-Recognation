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
                if (
                    axios.isAxiosError(error) &&
                    error.response?.status === 400 &&
                    error.response?.data?.data
                ) {
                    console.error(
                        '[DEBUG FRONTEND] AI Service Response Data:',
                        JSON.stringify(error.response.data.data, null, 2),
                    );
                }
                const errorMessage =
                    axios.isAxiosError(error) && error.response?.data?.message
                        ? error.response.data.message
                        : 'Gagal melakukan absensi. Silakan coba lagi.';
                setMessage(errorMessage);
                toast.error(errorMessage);
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
                    <div className="px-4 lg:px-6 py-4 md:py-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                            {/* Camera Section */}
                            <div className="md:col-span-2 space-y-4 md:space-y-6">
                                <div>
                                    <h1 className="text-xl md:text-3xl font-bold tracking-tight text-gray-900">
                                        Presensi Wajah
                                    </h1>
                                    <p className="text-xs md:text-sm text-gray-500 mt-1">
                                        Scan wajah Anda untuk melakukan absensi
                                        masuk atau pulang.
                                    </p>
                                </div>

                                <Card className="overflow-hidden border-none shadow-xl bg-white/80 backdrop-blur-md ring-1 ring-black/5 rounded-3xl">
                                    <CardHeader className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white p-4 md:p-6">
                                        <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                                            <Camera className="w-5 h-5" />
                                            Kamera Verifikasi
                                        </CardTitle>
                                        <CardDescription className="text-indigo-100 text-xs md:text-sm">
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
                                                <div className="absolute inset-0 border-2 border-dashed border-white/20 m-6 md:m-12 rounded-3xl pointer-events-none flex items-center justify-center transition-all group-hover:border-white/40">
                                                    <div className="w-48 h-48 md:w-72 md:h-72 border-2 border-indigo-400/50 rounded-full animate-pulse"></div>
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
                                                        <CheckCircle2 className="w-16 h-16 md:w-24 md:h-24 text-green-400 animate-bounce" />
                                                    )}
                                                    {status === 'error' && (
                                                        <XCircle className="w-16 h-16 md:w-24 md:h-24 text-red-400 animate-shake" />
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        <div className="p-6 md:p-8 flex flex-col items-center gap-4 md:gap-6">
                                            {status === 'idle' &&
                                                !processing && (
                                                    <Button
                                                        onClick={capture}
                                                        className="w-full max-w-sm h-14 md:h-16 text-lg md:text-xl bg-indigo-600 hover:bg-indigo-700 rounded-full shadow-lg shadow-indigo-200 transition-all active:scale-95"
                                                    >
                                                        <Camera className="mr-2 w-5 h-5 md:w-6 md:h-6" />
                                                        Ambil Foto
                                                    </Button>
                                                )}

                                            {processing && (
                                                <div className="flex flex-col items-center gap-3">
                                                    <Loader2 className="w-8 h-8 md:w-10 md:h-10 text-indigo-600 animate-spin" />
                                                    <p className="text-base md:text-lg font-semibold text-gray-700">
                                                        Memverifikasi...
                                                    </p>
                                                </div>
                                            )}

                                            {status !== 'idle' &&
                                                !processing && (
                                                    <div className="text-center space-y-4 md:space-y-6 w-full max-w-sm">
                                                        <p
                                                            className={`text-lg md:text-2xl font-bold ${status === 'success' ? 'text-green-600' : 'text-red-600'}`}
                                                        >
                                                            {message}
                                                        </p>
                                                        <Button
                                                            variant="outline"
                                                            onClick={reset}
                                                            className="w-full rounded-full h-12 border-2 font-semibold"
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
                            <div className="space-y-4 md:space-y-6">
                                <Card className="border-none shadow-sm rounded-3xl bg-white/50 backdrop-blur-sm p-4 md:p-6">
                                    <h3 className="text-xs font-bold uppercase text-gray-400 tracking-widest mb-4">
                                        Status Perangkat
                                    </h3>
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3 md:gap-4">
                                            <div className="p-2.5 md:p-3 bg-indigo-50 rounded-2xl shrink-0">
                                                <MapPin className="w-5 h-5 md:w-6 md:h-6 text-indigo-600" />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-[10px] md:text-xs text-gray-400 font-bold uppercase tracking-wider">
                                                    Koordinat GPS
                                                </p>
                                                <p className="text-sm font-bold text-gray-700 truncate">
                                                    {location
                                                        ? `${location.lat.toFixed(6)}, ${location.lng.toFixed(6)}`
                                                        : 'Mencari lokasi...'}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 md:gap-4">
                                            <div className="p-2.5 md:p-3 bg-emerald-50 rounded-2xl shrink-0">
                                                <Signal className="w-5 h-5 md:w-6 md:h-6 text-emerald-600" />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-[10px] md:text-xs text-gray-400 font-bold uppercase tracking-wider">
                                                    Kualitas Jaringan
                                                </p>
                                                <p className="text-sm font-bold text-gray-700 truncate">
                                                    {networkInfo}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </Card>

                                <Card className="border-none shadow-sm rounded-3xl bg-white/50 backdrop-blur-sm p-4 md:p-6">
                                    <h3 className="text-xs font-bold uppercase text-gray-400 tracking-widest mb-4">
                                        Aktivitas Hari Ini
                                    </h3>
                                    <div>
                                        {recentAttendances.length > 0 ? (
                                            <div className="space-y-3">
                                                {recentAttendances
                                                    .slice(0, 5)
                                                    .map((att) => (
                                                        <div
                                                            key={att.id}
                                                            className="flex items-center justify-between p-3 rounded-2xl bg-white hover:bg-gray-50/80 transition-colors shadow-sm"
                                                        >
                                                            <div className="flex flex-col min-w-0 pr-2">
                                                                <span className="text-sm font-bold text-gray-700 truncate">
                                                                    {
                                                                        att.user
                                                                            .name
                                                                    }
                                                                </span>
                                                                <span className="text-[10px] text-gray-400 font-medium truncate">
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
                                                                className={`text-[10px] px-2.5 py-1 rounded-lg font-black uppercase tracking-tighter shrink-0 ${att.type === 'check-in' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}
                                                            >
                                                                {att.type}
                                                            </span>
                                                        </div>
                                                    ))}
                                            </div>
                                        ) : (
                                            <div className="py-6 text-center border-2 border-dashed border-gray-200 rounded-2xl">
                                                <p className="text-sm text-gray-400 font-medium">
                                                    Belum ada riwayat.
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </Card>
                            </div>
                        </div>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
